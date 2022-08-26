import YAML from "https://cdn.skypack.dev/yaml";
import menus from "/fiugd/beta/dist/menus.js";
import iconMap from './icons.js';

document.body.append(menus());

//import Layout from "https://unpkg.com/@fiug/layout@0.0.6";
import Layout from "../src/index.js";

function debounce(func, timeout = 500) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

const storedLayout = (() => {
	try {
		const s = sessionStorage.getItem("test-layout-example");
		if (!s) return;
		return JSON.parse(s);
	} catch (e) {
		console.log(e);
	}
})();

let layoutConfig = storedLayout || "layout.fiug.yaml";
//layoutConfig = 'layout.fiug.yaml';

if (typeof layoutConfig !== "object") {
	const url = layoutConfig;
	const source = await fetch(layoutConfig).then((r) => r.text());
	if (url.includes(".json")) {
		layoutConfig = JSON.parse(source);
	}
	if (url.includes(".yml") || url.includes(".yaml")) {
		layoutConfig = YAML.parse(source);
	}
}

const createTab = ({ tab, file, pane }) => {
	const title = tab.querySelector('span');
	
	const source = tab.getAttribute('source');
	const paramsString = source.split('?').pop() || "";
	const params = new URLSearchParams(paramsString);
	const service = params.get("service") || "{service}";
	const fileName = params.get("file");

	// const service = tab.getAttribute('service') || "{service}";
	//const path = tab.getAttribute('path') || "{path}";
	tab.setAttribute('title', `${service}/${file}`)

	if(source.includes('tree.html')){
		tab.classList.add('option');
		tab.id = "explorerTab";
		title.textContent = "EXPLORER";
		return;
	}
	if(source.includes('search.html')){
		tab.classList.add('option');
		tab.id = "searchTab";
		title.textContent = "SEARCH";
		return;
	}
	if(source.includes('terminal.html')){
		tab.classList.add('option');
		title.textContent = "TERMINAL";
		tab.closest('.tabs-container').style.display = "none";
		return;
	}
	if(source.includes('preview.html')){
		tab.classList.add('option');
		tab.id = "previewTab";
		title.textContent = "PREVIEW";
		tab.closest('.tabs-container').style.display = "none";
		return;
	}
	title.classList.add('icon', 'icon-' + iconMap(fileName || file));
};
const createTabContent = ({ pane, file, layout }) => {
	const params = new URLSearchParams(
		file.includes('?')
			? file.split('?').pop()
			: ''
	);
	const paramsFile = params.get("file");
	const service = params.get("service");
	const paneid = params.get("paneid")
	!paneid && params.set("paneid", pane);
	
	const paneConfig = layout.flatConfig().find(x => x.id === (pane||paneid));
	const paneModule = paneConfig?.module;

	const paramsString = params.toString().replace(/%2F/g, '/');

	const src = paneModule
		? `${paneModule||''}?${paramsString}`
		: `${file}?${params.toString().replace(/%2F/g, '/')}`;

	// return '<pre>' + JSON.stringify({
	// 	src,
	// 	paneModule,
	// 	params: Object.fromEntries(params)
	// }, null, 2) + '</pre>';

	const sandbox = [
		"allow-same-origin",
		"allow-scripts",
		"allow-popups",
		"allow-modals",
		"allow-downloads",
		"allow-forms",
		"allow-top-navigation",
		"allow-popups-to-escape-sandbox",
	].join(" ");
	const iframe = `<iframe
		src="${src}"
		allowtransparency=”true”
		sandbox="${sandbox}"
		width="100%" height="100%"
	></iframe>`;
	return iframe;
};
const createPane = ({ pane }) => {
	console.log(`pane created: ${pane.id}`)
};

const layout = new Layout({
	...layoutConfig,
	parent: document.querySelector('#layout'),
	events: { createTab, createPane, createTabContent }
});

let activeEditor = document.querySelector('.pane.tabbed.active')?.id;

// INTERNAL
layout.on('change', debounce((config) => {
	const configString = JSON.stringify(config, null, 2);
	//console.log(configString);
	sessionStorage.setItem("test-layout-example", configString);
}));
layout.on('open', ({ file, pane }) => {
	// - a file has been dropped onto a pane
	// - a new tab is opened in a pane
	console.log(`opened: ${file}`);
});
layout.on('close', ({ file, pane }) => {
	// - a tab has been closed
	// - a pane has been closed
	console.log(`closed: ${file}`);
});
// layout.on('select', ({ file, pane }) => {
// 	// - a tab has been selected
// 	// - a pane has been selected
// 	// - set activeEditor to pane (if tabbed)
// 	if(file && file.includes("/editor.html") ){
// 		activeEditor = pane;
// 		const path = file.split('file=').pop().split("pane=").shift();
// 		const name = path.split('/').pop();
// 		const parent = path.replace("/"+name, "");
// 		const treeFrame = document.querySelector('iframe[src*="dist/tree.html"]');
// 		treeFrame.contentWindow.postMessage({
// 			type: "fileSelect",
// 			detail: {
// 				name,
// 				parent,
// 				service: "fiugd/layout",
// 				source: "Tabs",
// 				data: {},
// 			}
// 		}, location);
// 	}
// });
layout.on('resize', () => {
	console.log('optionally notify status bar of resize')
});

// EXTERNAL
const fileSelect = (e) => {
	//TODO: something like this belongs in the module, not sure how to do it
	const file = `/fiugd/beta/dist/editor.html?file=${e.src}`;
	const allPanes = Array.from(document.querySelectorAll('.pane.tabbed'));
	const panesWithFileOpen = [];
	const panesWithFileActive = [];
	for(const pane of allPanes){
		const fileTab = pane.querySelector(`.tab[path^="${e.src}"]`);
		if(!fileTab) continue;
		panesWithFileOpen.push(pane.id);
		if(!fileTab.classList.contains('active')) continue;
		panesWithFileActive.push(pane.id);
	}
	let pane = activeEditor || document.querySelector('.pane.tabbed')?.id;
	if(panesWithFileOpen.length){
		pane = activeEditor && panesWithFileOpen.includes(activeEditor)
			? activeEditor
			: panesWithFileOpen[0];
	}
	if(panesWithFileActive.length){
		pane = activeEditor && panesWithFileActive.includes(activeEditor)
			? activeEditor
			: panesWithFileActive[0];
	}
	activeEditor = pane;
	layout.openTab({ pane, file });
};
const fileRemove = (e) => {
	/*
		- if file is open in allPanes, close it
		- if file was active, activate the next tab
	*/
	console.log('handle file being closed from outside layout');
};
const fileChange = (e) => {
	/*
		- if file is open in allPanes, update its status, ie. orange bar at top
		- if a file was renamed?
	*/
	console.log('handle file being changed outside layout');
};
const cursorActivity = (e) => {
	if(!e.source) return;
	const { location } = e.source;
	const pane = location.href.split("paneid=").pop();
	if(location.href.includes("/editor.html") ){
		activeEditor = pane;
	}
	const params = new Proxy(new URLSearchParams(e.source.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});
	const file = params.file && e.source.location.pathname + `?file=${params.file}`;
	if(!file) return layout.activate({ pane });
	layout.openTab({ pane, file });
};

window.addEventListener("message", (event) => {
	if(event.source === window) return;
	const { triggerEvent, subscribe } = event.data;
	if (triggerEvent?.type === "fileSelect")
		return fileSelect(triggerEvent?.detail);
	if (triggerEvent?.type === "fileClose")
		return fileRemove(triggerEvent?.detail);
	if (triggerEvent?.type === "fileDelete")
		return fileRemove(triggerEvent?.detail);
	if (triggerEvent?.type === "fileChange")
		return fileChange(triggerEvent?.detail);

	if (triggerEvent?.type === "cursorActivity")
		return cursorActivity(event);

	if (triggerEvent) return console.log(`event triggered: `, triggerEvent);
	if (subscribe) return console.log(`request to subscribe: ${subscribe}`);
	console.log(event.data);
});