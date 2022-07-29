/*
	TODO: iframe behavior should vary based on parent type
	this is hardcoded right now, fix this
*/

import * as events from './events.js';
import * as dom from './dom.js';

const randomId = (prefix="_") => prefix + Math.random().toString(16).replace('0.','');

const halfDim = (dim) => {
	let unit = "";
	if(dim.includes("px")) unit = "px";
	if(dim.includes("fr")) unit = "fr";
	if(dim.includes("%")) unit = "%";
	return 0.5 * Number(dim.replace(unit,"")) + unit;
};

const split = (node, target, append, vertical, row) => {
	const containerId = randomId();
	const paneId = randomId();
	const container = document.createElement('div');
	container.classList.add("layout-container");
	container.id = containerId;

	const sizerDir = row ? "column" : "row";
	const parentTabbed = node.classList.contains('tabbed');
	const parentDragTo = node.classList.contains('dragTo');
	container.innerHTML = `
		${ append ? `<div class="sizer ${sizerDir}"></div>` : "" }
		${ dom.newPane(target, parentTabbed, parentDragTo, paneId) }
		${ !append ? `<div class="sizer ${sizerDir}"></div>` : "" }
	`;
	if(vertical){
		container.classList.add("row");
		container.style.gridTemplateRows = "50% 0px 50%";
	} else {
		container.classList.add("column");
		container.style.gridTemplateColumns = "50% 0px 50%";
	}
	node.insertAdjacentElement('beforebegin', container);

	if(parentDragTo){
		const pane = container.querySelector('#' + paneId);
		events.onDrop(undefined, pane);
	}

	const insertLocation = append ? 'afterbegin' : 'beforeend';
	container.insertAdjacentElement(insertLocation, node);

	const splitPane = {
		parent: container.parentNode.id,
		container: containerId,
		orient: vertical ? "row" : "column",
		pane: paneId,
		sibling: node.id,
		location: insertLocation,
		file: target,
		tabbed: parentTabbed,
		dragTo: parentDragTo
	};
	if(row){
		splitPane.width = "50%";
	} else {
		splitPane.height = "50%";
	}
	return { splitPane };
};

const addPane = (node, target, append, vertical, row) => {
	let dims = row
		? node.parentNode.style.gridTemplateRows.split(" ").filter(x=>x)
		: node.parentNode.style.gridTemplateColumns.split(" ").filter(x=>x);
	const index = Array.from(node.parentNode.children).indexOf(node);
	const half = halfDim(dims[index]);
	dims[index] = [half, '0px', half];
	dims = dims.flat();
	if(row)
		node.parentNode.style.gridTemplateRows = dims.join(" ");
	else
		node.parentNode.style.gridTemplateColumns = dims.join(" ");

	const spacer = document.createElement('div');
	spacer.classList.add("sizer", row ? "row" : "column");

	const pane = document.createElement('div');
	pane.classList.add('pane');
	const parentTabbed = node.classList.contains('tabbed');
	const parentDragTo = node.classList.contains('dragTo');

	const id = randomId();
	pane.innerHTML = dom.newPaneChildren(target, parentTabbed);
	pane.id = id;

	const insertLocation = append ? 'afterend' : 'beforebegin';
	node.insertAdjacentElement(insertLocation, pane);
	node.insertAdjacentElement(insertLocation, spacer);

	if(parentTabbed)
		pane.classList.add('tabbed');
	if(parentDragTo){
		events.onDrop(undefined, pane);
		pane.classList.add('dragTo');
	}

	const addedPane = {
		parent: node.parentNode.id,
		pane: id,
		location: insertLocation,
		sibling: node.id,
		file: target,
		tabbed: parentTabbed,
		dragTo: parentDragTo
	};
	if(row){
		addedPane.height = half;
	} else {
		addedPane.width = half;
	}
	return { addedPane };
};

export const newPane = (direction, node, target) => {
	const row = node.parentNode.classList.contains('row');
	const column = node.parentNode.classList.contains('column');
	const horizontal = ["left", "right"].includes(direction);
	const vertical = ["up", "down"].includes(direction);
	const append = ["right", "down"].includes(direction);
	
	const operation = (() => {
		if(column && horizontal) return addPane;
		if(row && vertical) return addPane;
		if(column && vertical) return split;
		if(row && horizontal) return split;
	})();
	if(!operation) return;

	return operation(node, target, append, vertical, row)
};
