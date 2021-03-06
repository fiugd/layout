import * as dom from './dom.js';

const randomId = (prefix="_") => prefix + Math.random().toString(16).replace('0.','');

const createEmptyDom = dom.createEmpty;
const createTabDom = dom.createTab;
const createContentDom = dom.createContent;
export const createDom = dom.createPane;

const closeTab = (parent, tab) => {
	tab.remove();

	const tabsContainer = parent.querySelector('.tabs-container');
	const tabs = Array.from(parent.querySelectorAll('.tab'));
	const content = parent.querySelector('.content');
	const lastTab = tabs && tabs[tabs.length-1];

	const src = lastTab && lastTab.getAttribute('source');
	if(src) return  openTab(parent, src);

	tabsContainer.classList.add('hidden');
	content.innerHTML = createContentDom({
		srcdoc: createEmptyDom(),
		childrenOnly: true
	});
};

const getFilename = (target) => {
	let filename = target.split("/").pop();
	if(filename.includes("?file="))
		filename = filename.split("?file=").pop();
	return filename;
};

export const openTab = (parent, src) => {
	const filename = getFilename(src);
	const content = parent.querySelector('.content');
	const tabsContainer = parent.querySelector('.tabs-container');

	/* TODO: document.html is currently hardcoded, fix this later */
	content.innerHTML = createContentDom({ src, childrenOnly: true });

	Array.from(parent.querySelectorAll('.tab.active'))
		.forEach(x=>x.classList.remove('active'));
	const tabs = parent.querySelector('.tabs');
	const found = tabs.querySelector(`.tab[file="${filename}"]`);
	if(found){
		found.classList.add('active');
		return;
	}
	tabsContainer.classList.remove('hidden');
	tabs.innerHTML += createTabDom(true, src);
};

/*
TODO: populate tabs menu

Close pane
Close tabs left, right, all
Maximize/minimize pane
*/

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
		if(isTab || parentIsTab){
			let filename = e.target.parentNode.getAttribute("source")
			filename = filename || e.target.textContent.trim()
			return openTab(pane, filename);
		}
	});
};
