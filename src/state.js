import { getConfigNode, randomId } from './utils.js';
import removePane from './removePane.js';

export const parseConfig = (config) => {
	const { children, rows, columns, tabs, ...rest } = config;
	const _children = children || rows || columns || tabs;
	if(_children && !(_children||[]).find(x => x.active)){
		tabs && _children[0] && (_children[0].active = true);
	}

	let orient = "column";
	if(rows) orient = "row";
	if(tabs) orient = "tabs";

	if(!_children || !_children.length) return rest;

	return {
		...rest,
		orient,
		id: randomId(),
		children: _children.map(parseConfig)
	}
};

const outputConfig = (config) => {
	const { parent, id, orient, children, ...rest} = config;

	const output = { ...rest };
	if(orient === "row")
		output.rows = children.map(outputConfig);
	if(orient === "column")
		output.columns = children.map(outputConfig);
	if(orient === "tabs")
		output.tabs = children.map(outputConfig);

	return output;
};

export const activate = ({ layout, pane, file }) => {
	layout.closeAllMenus();

	const paneDom = layout.dom.querySelector('#' + pane);
	const activePaneDom = layout.dom.querySelector('.pane.active');
	let tabDom = (file && paneDom) && paneDom.querySelector(`.tab[source^="${file}"]`);
	const activeTabDom = (file && paneDom) && paneDom.querySelector('.tab.active');

	const paneAlreadyActive = (paneDom) && paneDom === activePaneDom;
	let tabAlreadyActive = (tabDom) && tabDom === activeTabDom;

	if(paneAlreadyActive && tabAlreadyActive) return tabDom && tabDom.scrollIntoViewIfNeeded({inline: "center"});

	const paneConfig = getConfigNode(layout.config, x => x.id === pane);

	if(!paneAlreadyActive){
		const activePaneConfig = activePaneDom && getConfigNode(
			layout.config,
			x => x.id === activePaneDom.id
		);
		activePaneDom && activePaneDom.classList.toggle('active');
		paneDom.classList.toggle('active');
		paneConfig.active = true;
		activePaneConfig && delete activePaneConfig.active;
	}
	if(paneDom && file && !tabDom){
		paneConfig.children.push({iframe: file });
	}
	if(file && !tabAlreadyActive){
		const tabConfig = getConfigNode(
			paneConfig,
			x => file.startsWith(x.iframe)
		);
		const activeTabConfig = activeTabDom && getConfigNode(
			paneConfig,
			(x) => activeTabDom.getAttribute("source").startsWith(x.iframe)
		);
		layout.tabbed.openTab(paneDom, file + `&paneid=${pane}`);
		tabDom = paneDom.querySelector(`.tab[source^="${file}"]`);

		//activeTabDom && activeTabDom.classList.toggle('active');
		//tabDom.classList.add('active');

		tabConfig.active = true;
		activeTabConfig && delete activeTabConfig.active;
	}
	tabDom && tabDom.scrollIntoViewIfNeeded({inline: "center"});
};

export const onChange = (layout) => (args) => {
	(layout.events['change'] || [])
		.forEach(handler => handler(
			outputConfig(layout.config)
		));
};

export const onSelect = (layout) => (args) => {
	layout.activate(args);
	layout.onChange();
	(layout.events['select'] || [])
		.forEach(handler => handler(args))
};

export const onOpen = (layout) => (args) => {
	(layout.events['open'] || [])
		.forEach(handler => handler(args))
};

//TODO: do not trigger change unless there is nothing open in pane or pane closes
//      instead, modify config & trigger an open which will trigger onChange
//      possibly still trigger an open (because another pane/file may go active)
export const onClose = (layout) => (args) => {
	const { pane, file } = args;
	const paneConfig = getConfigNode(layout.config, x => x.id === pane);
	if(!file){
		return console.warn('this is probably an unhandled pane close event');
	}
	const fileConfig = paneConfig.children.find(x => x.iframe.startsWith(file))
	const fileIsActive = fileConfig && fileConfig.active;
	paneConfig.children = paneConfig.children.filter(x => !x.iframe.startsWith(file));

	//TODO: keep track of files in a stack based on when opened, pop from that
	const lastChild = paneConfig.children[paneConfig.children.length-1];
	if(fileIsActive && lastChild){
		lastChild.active = true;
	}

	(layout.events['close'] || [])
		.forEach(handler => handler(args));

	if(!lastChild){
		//TODO: should maybe be activating the next pane
		layout.onChange();
		return;
	}

	//TODO: if this pane was not active, does it make sense to activate it (instead of just the file)?
	layout.onSelect({
		pane, file: lastChild.iframe
	});
};

export const onDrop = (layout) => (args) => {
	const { splitPane, addedPane } = args;
	const configFlat = layout.flatConfig();

	if(addedPane){
		const {
			file, height, width, tabbed, dragTo,
			pane, location, parent, sibling
		} = addedPane;
		const parentConfig = configFlat
			.find(x => x.id === parent);
		const newPane = {};
		if(!!width) newPane.width = width;
		if(!!height) newPane.height = height;

		if(tabbed){
			newPane.orient = "tabs";
			newPane.id = pane;
			newPane.children = [];
			//newPane.children = [{ iframe: file }];
		} else {
			newPane.id = pane;
			newPane.iframe = file;
		}

		if(!dragTo){
			newPane.drag = false;
		}

		parentConfig.children = parentConfig.children
			.map(child => {
				if(child?.id !== sibling) return child;

				if(!!width && child.width) child.width = width;
				if(!!height && child.height) child.height = height;

				return location === "afterend"
					? [child, newPane]
					: [newPane, child];
			}).flat();

		layout.activate({ pane, file });
	}

	if(splitPane){
		const {
			file, height, width, tabbed, dragTo,
			pane, container, orient, sibling, parent
		} = splitPane;
		const siblingConfig = configFlat
			.find(x => x.id === sibling);
		const parentConfig = configFlat
			.find(x => x.id === parent);

		const newPane = {};
		if(!!width) newPane.width = width;
		if(!!height) newPane.height = height;
		if(siblingConfig?.module){
			newPane.module = siblingConfig.module;
		}
		if(tabbed){
			newPane.orient = "tabs";
			newPane.id = pane;
			newPane.children = [];
			//newPane.children = [{ iframe: file }];
		} else {
			newPane.id = pane;
			newPane.iframe = file;
		}

		parentConfig.children = parentConfig.children
			.map(child => {
				if(child?.id !== sibling) return child;

				const children = location === "afterbegin"
					? [newPane, child]
					: [child, newPane];

				const containerConfig = {
					id: container,
					orient,
					children
				};
				if(child.width){
					containerConfig.width = child.width;
					delete child.width;
				}
				if(child.height){
					containerConfig.height = child.height;
					delete child.height;
				}
				if(!!width) child.width = width;
				if(!!height) child.height = height;

				return containerConfig;
			});

		layout.activate({ pane, file });
	}

	if(!splitPane && !addedPane) return;
	layout.onChange();
};

export const onResize = (layout) => (sizer, i, x, y) => {
	//TODO: sizers should be stored in Layout state when created
	//data gathering is too much to be doing while resizing
	const orient = sizer.classList
		.contains("row") ? "row" : "column";
	const configFlat = layout.flatConfig();
	const containerConfig = configFlat
		.find(x => x.id === sizer.parentNode.id);
	const prev = containerConfig.children[i];
	const next = containerConfig.children[i+1];

	const modDim = orient === "row" ? "height": "width";

	const pixelDelta = orient === "row" ? y : x;
	const parentTotal = orient === "row"
		? sizer.parentNode.clientHeight
		: sizer.parentNode.clientWidth
	const fractionalDelta = pixelDelta / parentTotal;

	const getDelta = (dim) => {
		if(dim.includes('%')) return 100 * fractionalDelta;
		return pixelDelta;
	};

	const getUnits = (dim) => {
		if(dim.includes('%')) return '%';
		return 'px';
	};

	let dimsChanged = false;

	if(prev[modDim] && !prev[modDim].includes('fr')){
		const units = getUnits(prev[modDim]);
		const delta = getDelta(prev[modDim]);
		const newDim = (
			Number(prev[modDim].replace(units,'')) + delta
		).toFixed(1) + units;
		if(prev[modDim] !== newDim) dimsChanged = true;
		prev[modDim] = newDim;
	}
	if(next[modDim] && !next[modDim].includes('fr')){
		const units = getUnits(next[modDim]);
		const delta = getDelta(next[modDim]);
		const newDim = (
			Number(next[modDim].replace(units,'')) - delta
		).toFixed(1) + units;
		if(next[modDim] !== newDim) dimsChanged = true;
		next[modDim] = newDim;
	}

	if(!dimsChanged) return;
	layout.splitting.setSize(sizer.parentNode, containerConfig);
	layout.focusAllActiveTabs(layout.dom);
	layout.onChange();
	(layout.events['resize'] || [])
		.forEach(handler => handler());
};

export const closePane = removePane;
