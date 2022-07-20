/*
	TODO: iframe behavior should vary based on parent type
	this is hardcoded right now, fix this
*/
const newPaneDomChildren = (target, tabbed) => `
	${tabbed ? `
		<div class="tabs">
			<div class="tab active">${target.split("/").pop()}</div>
		</div>
	`: ""}
	<div class="content">
		<iframe src="${tabbed ? target : "terminal.html"}" width="100%" height="100%"></iframe>
	</div>
`;
const newPaneDom = (target, tabbed, dragTo) => `
	<div class="${
		[
			"pane",
			tabbed && "tabbed",
			dragTo && "dragTo"
		].filter(x=>x).join(" ")
	}">
		${newPaneDomChildren(target)}
	</div>
`;

const halfDim = (dim) => {
	let unit = "";
	if(dim.includes("px")) unit = "px";
	if(dim.includes("fr")) unit = "fr";
	if(dim.includes("%")) unit = "%";
	return 0.5 * Number(dim.replace(unit,"")) + unit;
};

const split = (node, target, append, vertical, row) => {
	const splitter = document.createElement('div');
	const sizerDir = row ? "column" : "row";
	const parentTabbed = node.classList.contains('tabbed');
	const parentDragTo = node.classList.contains('dragTo');
	splitter.innerHTML = `
		${ append ? `<div class="sizer ${sizerDir}"></div>` : "" }
		${ newPaneDom(target, parentTabbed, parentDragTo) }
		${ !append ? `<div class="sizer ${sizerDir}"></div>` : "" }
	`;
	if(vertical){
		splitter.classList.add("layout-container", "row");
		splitter.style.gridTemplateRows = "50% 0px 50%";
	} else {
		splitter.classList.add("layout-container", "column");
		splitter.style.gridTemplateColumns = "50% 0px 50%";
	}
	node.insertAdjacentElement('beforebegin', splitter);

	const insertLocation = append ? 'afterbegin' : 'beforeend';
	splitter.insertAdjacentElement(insertLocation, node);
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
		node.parentNode.style.gridTemplateXColumns = dims.join(" ");

	const spacer = document.createElement('div');
	spacer.classList.add("sizer", row ? "row" : "column");

	const pane = document.createElement('div');
	pane.classList.add('pane');
	const parentTabbed = node.classList.contains('tabbed');
	if(parentTabbed)
		pane.classList.add('tabbed');
	if(node.classList.contains('dragTo'))
		pane.classList.add('dragTo');
	pane.innerHTML = newPaneDomChildren(target, parentTabbed);

	const insertLocation = append ? 'afterend' : 'beforebegin';
	node.insertAdjacentElement(insertLocation, pane);
	node.insertAdjacentElement(insertLocation, spacer);
};

/*
TODO:
connect sizer and drop to listeners

OR

use delegated/global handler
*/

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
}

