import { getConfigNode } from './utils.js';

export const plusDim = (mult, target, source) => {
	let unit = "";
	if(target.includes("px")) unit = "px";
	if(target.includes("fr")) unit = "fr";
	if(target.includes("%")) unit = "%";
	return Number(target.replace(unit,""))
		+ mult * Number(source.replace(unit,""))
		+ unit;
};

const removePaneConfig = ({ layout, pane }) => {
	const { config } = layout;

	const paneConfig = getConfigNode(config, x => x.id === pane);
	if(!paneConfig)
		return { error: "pane config not found" };

	const parentConfig = getConfigNode(
		config,
		(node) => node.children && node.children
			.find(c => c.id === pane)
	);
	if(!parentConfig)
		return { error: "pane parent config not found" };

	if(parentConfig.children.length < 2)
		return removePaneConfig({
			layout,
			pane: parentConfig.id
		});

	const paneIndex = parentConfig.children.indexOf(paneConfig);
	const paneIsStart = paneIndex === 0;
	const paneIsEnd = paneIndex === parentConfig.children.length - 1;
	const paneInMiddle = !paneIsStart && !paneIsEnd;

	const paneIsColumn = !!paneConfig.width;

	const nextPane = parentConfig.children[paneIndex+1];
	const prevPane = parentConfig.children[paneIndex-1];

	if(paneInMiddle && paneIsColumn){
		prevPane.width = plusDim(0.5, prevPane.width, paneConfig.width);
		nextPane.width = plusDim(0.5, nextPane.width, paneConfig.width);
	}
	if(paneInMiddle && !paneIsColumn){
		prevPane.height = plusDim(0.5, prevPane.height, paneConfig.height);
		nextPane.height = plusDim(0.5, nextPane.height, paneConfig.height);
	}

	if(paneIsStart && paneIsColumn){
		nextPane.width = plusDim(1, nextPane.width, paneConfig.width);
	}
	if(paneIsStart && !paneIsColumn){
		nextPane.height = plusDim(1, nextPane.height, paneConfig.height);
	}

	if(paneIsEnd && paneIsColumn){
		prevPane.width = plusDim(1, prevPane.width, paneConfig.width);
	}
	if(paneIsEnd && !paneIsColumn){
		prevPane.height = plusDim(1, prevPane.height, paneConfig.height);
	}

	parentConfig.children = parentConfig.children
		.filter(x => x.id !== pane);

	return {
		child: paneConfig.id,
		parent: parentConfig.id,
		parentConfig
	}
};

const removePaneDom = ({ dom, removed }) => {
	if(typeof document === "undefined")
		return console.log("no DOM present");
	if(removed.error)
		return console.log('ERROR:\n'+ removed.error + "\n");

	const { parent, child, parentConfig } = removed;
	const parentDom = document.querySelector('#'+parent);
	const childDom = parentDom.querySelector('#'+child);
	
	const gridTemplateRows = parentDom.style.gridTemplateRows
		.split(' ').filter(x=>x);
	const gridTemplateColumns = parentDom.style.gridTemplateColumns
		.split(' ').filter(x=>x);

	const children = Array.from(parentDom.children)
	const childIndex = children.indexOf(childDom);
	const spacerIndex = childIndex === children.length -1
		? childIndex-1
		: childIndex+1;

	gridTemplateRows[spacerIndex] = "";
	gridTemplateRows[childIndex] = "";
	gridTemplateColumns[spacerIndex] = "";
	gridTemplateColumns[childIndex] = "";
	
	const rowsCSS = gridTemplateRows.filter(x=>x).join(" ");
	const colsCSS = gridTemplateColumns.filter(x=>x).join(" ");

	console.log({
		rowsCSS, colsCSS
	})
	if(rowsCSS)
		parentDom.style.gridTemplateRows = parentConfig.children
			.map(x => x.width)
			.join(" 0px ");
	if(colsCSS)
		parentDom.style.gridTemplateColumns = parentConfig.children
			.map(x => x.width)
			.join(" 0px ");

	children[spacerIndex].remove();
	children[childIndex].remove();

};

const removePane = (layout) => (pane) => {
	try {
		const { config, dom } = layout;
		if(!config || !dom) return console.log('config and/or dom not found');

		const removed = removePaneConfig({ layout, pane });
		removePaneDom({ layout, removed });
	} catch(e){
		debugger;
	}
};

export default removePane;
