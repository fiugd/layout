const newPaneDomChildren = (target) => `
	<div class="tabs">
		<div class="tab active">${target.split("/").pop()}</div>
	</div>
	<div class="content">
		<iframe src="${target}" width="100%" height="100%"></iframe>
	</div>
`;
const newPaneDom = (target) => `
	<div class="pane tabbed dragTo">
		${newPaneDomChildren(target)}
	</div>
`;

const split = (node, target, append, vertical, row) => {
	const splitter = document.createElement('div');
	const sizerDir = row ? "column" : "row";
	splitter.innerHTML = `
		${ append ? `<div class="sizer ${sizerDir}"></div>` : "" }
		${ newPaneDom(target) }
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
	const spacer = document.createElement('div');
	spacer.classList.add("sizer", row ? "row" : "column");

	const pane = document.createElement('div');
	pane.classList.add('pane', 'tabbed', 'dragTo');
	pane.innerHTML = newPaneDomChildren(target);

	const insertLocation = append ? 'afterend' : 'beforebegin';
	node.insertAdjacentElement(insertLocation, pane);
	node.insertAdjacentElement(insertLocation, spacer);

	if(row){
		node.parentNode.style.gridTemplateRows = append
			? node.parentNode.style.gridTemplateRows + " 0px 1fr"
			: "1fr 0px " + node.parentNode.style.gridTemplateRows;
	} else {
		node.parentNode.style.gridTemplateColumns = append
			? node.parentNode.style.gridTemplateColumns + " 0px 1fr"
			: "1fr 0px " + node.parentNode.style.gridTemplateColumns;
	}
};

/*
TODO:
connect sizer to listeners

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

