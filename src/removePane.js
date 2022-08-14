import {getConfigNode} from './state.js';

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
		parent: parentConfig.id
	}
};

const removePaneDom = ({ dom, removed }) => {
	if(removed.error)
		return console.log('ERROR:\n'+ removed.error + "\n");

	console.log(`
TODO DOM OPERATIONS:
Change parent grid dims: ${removed.parent}
Remove child: ${removed.child}
`.trim()+"\n");
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
