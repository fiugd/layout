const randomId = () => Math.random().toString(16).replace('0.','');

export const style = () => `
	.pane.tabbed {
		flex-direction: column;
		font-family: sans-serif; font-size: 14px;
	}
	.tabs {
		height: 30px; background: #2a2a2a; display: flex;
		margin-top: -0.5px;
	}
	.tab { 
		padding: 0.55em 1.5em; cursor: pointer; color: #999;
		
		border-top-right-radius: 2px; border-top-left-radius: 2px;
		/*border-left: 0.5px solid; border-right: 0.5px solid;*/ border-top: 0.5px solid;
		border-color: transparent;
	}
	.tab + .tab { margin-left: 1px; }
	.active, .open { background: #1e1e1e; border-color: #2a2a2a; }
	.tab-close {
		display: inline-block; color: transparent;
		margin-left: 0.5em; margin-right: -0.3em;
	}
	.tab-close svg {
		pointer-events:none;
		stroke: currentColor; stroke-width: 2.5; height: 0.6em;
	}
	.active, .active .tab-close, .tab:hover .tab-close { color: white }
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
		<svg viewBox="0 0 10 10">
			<line x1="1" y1="1" x2="9" y2="9"></line>
			<line x1="9" y1="1" x2="1" y2="9"></line>
		</svg>
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

export const createDom = ({ children, drop }) => `
	<div class="pane tabbed${ (drop+"") !== "false" ? " dragTo" : "" }" id="${randomId()}">
		<div class="tabs">
			${ children.map(x => createTabDom(
					x.active,
					x.iframe.split('/').pop()
				)).join('')
			}
		</div>
		<div class="content">
			${/* TODO: document.html is currently hardcoded, fix this later */""}
			${createContentDom({ src: "document.html" })}
		</div>
	</div>
`;

const closeTab = (parent, tab) => {
	tab.remove();

	const tabs = Array.from(parent.querySelectorAll('.tab'));
	const content = parent.querySelector('.content');
	const lastTab = tabs && tabs[tabs.length-1];
	const file = lastTab && lastTab.getAttribute('file');

	if(file){
		openTab(parent, file);
	} else {
		content.innerHTML = createContentDom({ srcdoc: createEmptyDom() });
	}
};

export const openTab = (parent, tab) => {
	const content = parent.querySelector('.content');
	/* TODO: document.html is currently hardcoded, fix this later */
	content.innerHTML = createContentDom({ src: "document.html" });

	Array.from(parent.querySelectorAll('.tab.active'))
		.forEach(x=>x.classList.remove('active'));
	const tabs = parent.querySelector('.tabs');
	const found = tabs.querySelector(`.tab[file="${tab}"]`);
	if(found){
		found.classList.add('active');
		return
	}
	tabs.innerHTML += createTabDom(true, tab);
};

export const attachEvents = (layoutDom) => {
	layoutDom.addEventListener('click', (e) => {
		if(e.target.classList.contains('tab-close')) return closeTab(
			e.target.closest('.pane.tabbed'), e.target.closest('.tab')
		);
	});
	/*
		TODO: eached tabbed pane should have its own handlers for:
			- clicked on a tab
			- closed a tab
			- moved a tab
			- opened a tab: from DnD or otherwise(?)
			- drag a tab to somewhere else
			- selected a tab
		This should do what editor.html does
		This should also do what tabs do in editor in current system
		Should be able to DnD to entire tabbed pane OR to tab bar
	*/


	// 	let dragover;

	// 	function upsertTab(data){
	// 		Array.from(tabs.querySelectorAll('.tab.active'))
	// 			.forEach(x=>x.classList.remove('active'));
	// 		const found = tabs.querySelector(`.tab[file="${data}"]`);
	// 		if(found){
	// 			found.classList.add('active');
	// 			return
	// 		}
	// 		tabs.innerHTML += `<div class="tab active" file="${data}">${data}</div>`;
	// 	}
	// 	function openDoc({ name }){
	// 		upsertTab(name);
	// 		editor.innerHTML = `
	// 			<iframe src="./document.html" ondragover="dragover(event)"></iframe>
	// 		`;
	// 		editor.querySelector('iframe').contentWindow.ondragover = dragover;
	// 		editor.classList.add('open');
	// 	}

	// 	({ dragover } = events.onDrop(openDoc));
};
