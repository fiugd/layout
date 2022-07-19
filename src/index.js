/*
https://blog.jim-nielsen.com/2021/css-system-colors/

https://css-tricks.com/snippets/css/complete-guide-grid/
*/

import * as events from './events.js';
import * as tabbed from './tabbed.js';
import * as splitting from './splitting.js';

window.newPane = splitting.newPane;

const randomId = () => Math.random().toString(16).replace('0.','');

const style = `
	.layout-container {
		display: grid;
		width: 100%;
		height: 100%;
	}
	.pane {
		position: relative;
		display: flex; 
		margin: 0;
		border-top: 1px solid #262626; border-left: 1px solid #262626;
		box-sizing: border-box;
	}
	.pane .content { flex: 1; }
	.pane .content iframe {
		border: 0; width: 100%; height: 100%;
		background: #1e1e1e; border-color: #2a2a2a;
	}
	.sizer {
		background: transparent;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
	.sizer.column {
		cursor: ew-resize;
		left: -1px;
		width: 3px;
		margin-top: 1px;
	}
	.sizer.row {
		cursor: ns-resize;
		top: -1px;
		height: 3px;
		margin-left: 1px;
	}
	.sizer.disabled { pointer-events: none; }
	.sizer:hover { background: #48e; }

	${tabbed.style()}
	${events.draggedStyle()}
`;

const flatConfig = (config) => {
	if(!config.children) return config;
	return [config, ...config.children.map(flatConfig)].flat();
};

const childContent = (child) => {
	const { iframe, children, id, orient="", drop } = child;
	const dragToClass = (drop+"") !== "false" ? " dragTo" : "";
	if(iframe) return `
		<div class="pane${dragToClass}">
			<div class="content">
				<iframe src="${iframe}" width="100%" height="100%"></iframe>
			</div>
		</div>
	`;

	if(children && orient === "tabs") return tabbed.createDom(child);

	return `
	<div class="layout-container ${orient}" id="${id}">
		${children.map(childDom(child)).join('')}
	</div>
	`;
};

const childDom = (config) => (child, i, all) => {
	const { orient } = config;
	if(i === 0) return childContent(child);
	const prev = all[i-1];
	const next = all[i+1]
	const canResize = (() => {
		if(prev.resize+'' === 'false') return false;
		if(i+1 === all.length && child.resize+'' === 'false') return false;
		return true;
	})();
	const sizer = canResize
		? `<div class="sizer ${orient}"></div>`
		: `<div class="sizer ${orient} disabled"></div>`;
	return sizer + childContent(child);
};

const containerSizers = (containers, configFlat, onResize) => {
	for(const [index, container] of containers.entries()){
		const containerConfig = configFlat.find(x => x.id === container.id);
		setSize(container, containerConfig);

		const sizers = container.querySelectorAll(':scope > .sizer');
		for(const [index, sizer] of Array.from(sizers).entries()){
			sizer.id = randomId();
			events.attachResizeListener(sizer, index, onResize);
		}
	}
}

const createDom = (layout) => {
	const { config, onResize } = layout;
	const { children, id, orient } = config;
	const layoutDom = document.createElement('div');
	layoutDom.classList.add('layout-container', orient);
	id && (layoutDom.id = id);

	layoutDom.innerHTML = `<style>${style}</style>` + 
		children.map(childDom(config)).join('');

	const configFlat = flatConfig(config);
	const containers = layoutDom.querySelectorAll('.layout-container');
	containerSizers(
		[layoutDom, ...Array.from(containers)],
		configFlat,
		onResize
	);

	events.attachDragListener();
	events.attachDropListener(layoutDom);
	return layoutDom;
};

const parseConfig = (config) => {
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

const setSize = (container, config) => {
	if(config.orient === "column"){
		container.style.gridTemplateColumns = config.children
			.map(x=>x.width || '1fr')
			.join(' 0px ');
		return;
	}
	container.style.gridTemplateRows = config.children
		.map(x=>x.height || '1fr')
		.join(' 0px ');
}

class Layout {
	constructor(config){
		this.config = parseConfig(config);
		const { parent, children } = this.config;
		this.dom = createDom({
			config: this.config,
			onResize: this.onResize.bind(this)
		});
		parent.append(this.dom);
	}
	onResize(sizer, i, x, y){
		//TODO: sizers should be stored in Layout state when created
		//data gathering is too much to be doing while resizing
		const orient = sizer.classList.contains("row") ? "row" : "column";
		const configFlat = flatConfig(this.config);
		const containerConfig = configFlat.find(x => x.id === sizer.parentNode.id);
		const prev = containerConfig.children[i];
		const next = containerConfig.children[i+1];

		const modDim = orient === "row" ? "height": "width";

		const pixelDelta = orient === "row" ? y : x;
		const parentTotal = orient === "row" ? sizer.parentNode.clientHeight : sizer.parentNode.clientWidth
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

		if(dimsChanged){
			setSize(sizer.parentNode, containerConfig);
		}
	}
};

export default Layout;

export const dragWarn = events.dragWarn;
export const dragStart = events.dragStart;
export const onDrop = events.onDrop;
