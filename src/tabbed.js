import { onDrop } from './events.js';

export const style = () => `
	.tabbedPane {
		display: flex; flex-direction: column; margin: 0;
		font-family: sans-serif; font-size: 14px;
	}
	.tabbedPane { border-top: 1px solid #262626; border-left: 1px solid #262626; }
	.tabs { height: 30px; background: #2a2a2a; display: flex; }
	.tab { 
		padding: 0.55em 1.5em; cursor: pointer; color: #999;
		border-top-right-radius: 2px; border-top-left-radius: 2px;
		border-left: 0.5px solid; border-right: 0.5px solid; border-top: 0.5px solid;
		border-color: transparent;
	}
	.tab + .tab { margin-left: 1px; }
	.tabbedContent { flex: 1; }
	.tabbedContent iframe { border: 0; width: 100%; height: 100%; }
	.active, .open, .tabbedContent iframe { background: #1e1e1e; border-color: #2a2a2a; }
	.tab-close { display: inline-block; color: transparent; }
	.tab-close svg {  stroke: currentColor; stroke-width: 2.5; height: 0.6em; margin-left: 0.5em; margin-right: -0.3em; }
	.active, .active .tab-close, .tab:hover .tab-close { color: white }
`;

export const createDom = (children) => `
	<div class="tabbedPane">
		<div class="tabs">
			${ children.map(x => `
				<div
					class="tab${ x.active ? ' active' : ''}"
					file="${x.iframe.split('/').pop()}"
				>
					<span>${x.iframe.split('/').pop()}</span>
					<div class="tab-close">
						<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
							<line x1="1" y1="1" x2="9" y2="9"></line>
							<line x1="9" y1="1" x2="1" y2="9"></line>
						</svg>
					</div>
				</div>
			`).join('')}
		</div>
		<div class="tabbedContent">
			${/* TODO: document.html is currently hardcoded, fix this later */""}
			<iframe src="./document.html" width="100%" height="100%"></iframe>
		</div>
	</div>
`;

export const attachEvents = (layoutDom) => {
	console.log('TODO: tabbed.attachEvents');
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

	// 	const tabs = document.querySelector('.tabs');
	// 	const editor = document.querySelector('.editor');
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

	// 	({ dragover } = onDrop(openDoc));
};
