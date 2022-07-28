const randomId = (prefix="_") => prefix + Math.random().toString(16).replace('0.','');

export const style = () => `
	.pane.tabbed {
		flex-direction: column;
		font-family: sans-serif; font-size: 14px;
		overflow: hidden;
	}
	.tabs-container {
		user-select: none;
		height: 30px;
		min-height: 30px;
		background: #2a2a2a;
		display: flex;
	}
	.tabs {
		flex: 1;
		display: flex;
		margin-top: -1px;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
	}
	.tabs::-webkit-scrollbar {
		display: none;
	}
	.tabs-menu {
		position: absolute;
		top: 28px;
		right: 10px;
		width: 220px;
		height: 200px;
		background: #333;
		border-radius: 3px;
		box-shadow: 3px 3px 8px #00000073;
	}
	.tabs-controls {
		height: 100%;
		display: flex;
		background: #2a2a2a;
		padding: 0 0.75em;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: #999;
	}
	.tabs-controls svg {
		fill: currentColor; height: 0.9em;
	}
	.tab > * + * { margin-left: 0.4em; }
	.tab {
		padding: 0.1em 0.7em 0.1em 1.5em;
		cursor: pointer; color: #999;
		height: 30px;
		border-top-right-radius: 2px; border-top-left-radius: 2px;
		/*border-left: 0.5px solid; border-right: 0.5px solid;*/ border-top: 0.5px solid;
		border-color: transparent;
		white-space: nowrap;
		display: flex;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tab + .tab { margin-left: 1px; }
	.active, .open { background: #1e1e1e; border-color: #2a2a2a; }
	.tab span, .tab-close { display: inline; }
	.tab-close { color: transparent; }
	.tab-close svg {
		stroke: currentColor; stroke-width: 1.5; height: 0.65em;
	}
	.active, .active .action-item, .tab:hover .action-item { color: white }
	.action-item * { pointer-events:none; }
	.action-item {
		padding: 0.4em;
		border-radius: 3px;
		display: flex;
	}
	.action-item:hover, .action-item.selected {
		color: white;
		background: #fff2;
	}
`;

const createEmptyDom = () => `
<html>
	<head>
	<meta name="color-scheme" content="dark">
	<style>
		body {
			margin: 0;
			padding: 0.75em 1em;
			font-family: sans-serif; font-size: 14px;
			color: #999;
			background: #2a2a2a;
		}
	</style>
	</head>
	<body>
	</body>
</html>
`.replaceAll("\r", "").replaceAll("\n", "");;


const createTabDom = (active, filename) => `
<div
	class="tab${ active ? ' active' : ''}"
	file="${filename}"
>
	<span>${filename}</span>
	<div class="tab-close">
		<div class="action-item">
			<svg viewBox="0 0 10 10">
				<line x1="1" y1="1" x2="9" y2="9"></line>
				<line x1="9" y1="1" x2="1" y2="9"></line>
			</svg>
		</div>
	</div>
</div>
`;

const createContentDom = ({ src, srcdoc }) => src
? `
	<iframe src="${src}" width="100%" height="100%"></iframe>
`
: `
	<iframe srcdoc='${srcdoc}' width="100%" height="100%"></iframe>
`
;

export const createDom = ({ children, drop, id }) => `
	<div class="pane tabbed${ (drop+"") !== "false" ? " dragTo" : "" }" id="${id}">
		<div class="tabs-container">
			<div class="tabs">
				${ children.map(x => createTabDom(
						x.active,
						x.iframe.split('/').pop()
					)).join('')
				}
			</div>
			<div class="tabs-controls">
				<div class="action-item">
					<svg viewBox="0 0 10 10">
						<circle cx="1" cy="5" r="1"></circle>
						<circle cx="5" cy="5" r="1"></circle>
						<circle cx="9" cy="5" r="1"></circle>
					</svg>
				</div>
			</div>
		</div>
		<div class="content">
			${/* TODO: document.html is currently hardcoded, fix this later */""}
			${createContentDom({ src: "document.html" })}
		</div>
		<div class="tabs-menu hidden"></div>
	</div>
`;

const closeTab = (parent, tab) => {
	tab.remove();

	const tabsContainer = parent.querySelector('.tabs-container');
	const tabs = Array.from(parent.querySelectorAll('.tab'));
	const content = parent.querySelector('.content');
	const lastTab = tabs && tabs[tabs.length-1];
	const file = lastTab && lastTab.getAttribute('file');

	if(file){
		openTab(parent, file);
	} else {
		tabsContainer.classList.add('hidden');
		content.innerHTML = createContentDom({ srcdoc: createEmptyDom() });
	}
};

export const openTab = (parent, tab) => {
	const content = parent.querySelector('.content');
	const tabsContainer = parent.querySelector('.tabs-container');

	/* TODO: document.html is currently hardcoded, fix this later */
	content.innerHTML = createContentDom({ src: "document.html" });

	Array.from(parent.querySelectorAll('.tab.active'))
		.forEach(x=>x.classList.remove('active'));
	const tabs = parent.querySelector('.tabs');
	const found = tabs.querySelector(`.tab[file="${tab}"]`);
	if(found){
		found.classList.add('active');
		return;
	}
	tabsContainer.classList.remove('hidden');
	tabs.innerHTML += createTabDom(true, tab);
};

//TODO: populate menu
const openMenu = (pane, actionEl) => {
	const menu = pane.querySelector('.tabs-menu');
	actionEl.classList.toggle('selected');
	menu.classList.toggle('hidden');
	//TODO: set up pointerdown listener so that menu disappears after clicks
};

export const attachEvents = (layoutDom) => {
	layoutDom.addEventListener('click', (e) => {
		const pane = e.target.closest('.pane.tabbed');
		const parent = e.target.parentNode;
		if(e.target.classList.contains('action-item')){
			if(parent.classList.contains('tab-close'))
				return closeTab(pane, e.target.closest('.tab'));
			if(parent.classList.contains('tabs-controls'))
				return openMenu(pane, e.target);
		}
		const isTab = e.target.classList.contains('tab');
		const parentIsTab = parent.classList.contains('tab');
		if(isTab || parentIsTab)
			return openTab(pane, e.target.textContent.trim());
	});
};
