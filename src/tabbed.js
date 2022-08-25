import * as dom from './dom.js';
import { randomId, getFilename } from './utils.js';

const createEmptyDom = dom.createEmpty;
const createTabDom = dom.createTab;
const createContentDom = dom.createContent;
export const createDom = dom.createPane;

export const focusAllActiveTabs = (layoutDom) => {
	if(!layoutDom) debugger
	const activeTabs = Array.from(layoutDom.querySelectorAll('.tab.active'));
	activeTabs.forEach(t => t.scrollIntoView({inline: "center"}));
};

export const closeTab = (parent, tab) => {
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

export const closeAllMenus = () => {
	try {
		const openMenus = document.querySelectorAll('.tabs-menu.menu-open');
		for(const menu of Array.from(openMenus)){
			menu.classList.remove('menu-open');
			menu.classList.add('hidden');
		}
		const selectedActions = document.querySelectorAll('.action-item.selected');
		for(const action of Array.from(selectedActions)){
			action.classList.remove('selected');
		}
	} catch(e){
		debugger;
	}
};

export const openTab = (parent, src, layout) => {
	closeAllMenus();
	const filename = getFilename(src);
	const content = parent.querySelector('.content');
	const tabsContainer = parent.querySelector('.tabs-container');
	content.innerHTML = createContentDom({ src, childrenOnly: true });

	Array.from(parent.querySelectorAll('.tab.active'))
		.forEach(x=>x.classList.remove('active'));
	const tabs = parent.querySelector('.tabs');
	const found = tabs.querySelector(`.tab[file="${filename}"]`);
	//if(found) return;
	if(found){
		found.classList.add('active');
		found.scrollIntoViewIfNeeded({inline: "center"})
		return;
	}
	tabsContainer.classList.remove('hidden');
	tabs.insertAdjacentHTML('beforeend', createTabDom(true, src));

	const tab = tabs.querySelector('.tab:last-child');

	const pane = tab.closest('.pane')?.id;
	const file = tab.getAttribute('path');
	layout.events.createTab({ tab, pane, file: filename });

	tab.scrollIntoView({inline: "center"});
};

const menuToggleAction = (pane, target, layout) => {
	const menu = pane.querySelector('.tabs-menu');
	target.classList.toggle('selected');
	menu.classList.toggle('hidden');
	menu.classList.toggle('menu-open');

	const openMenus = document.querySelectorAll('.tabs-menu.menu-open');
	for(const menu of Array.from(openMenus)){
		if(pane.contains(menu)) continue;
		menu.classList.remove('menu-open');
		menu.classList.add('hidden');
	}
	const selectedActions = document.querySelectorAll('.action-item.selected');
	for(const action of Array.from(selectedActions)){
		if(pane.contains(action)) continue;
		action.classList.remove('selected');
	}
};

const fullscreenChangeHandler = (fsElement) => {
	//const fsElement = document.fullscreenElement;
	const allActions = document.querySelectorAll('.tabs-menu li, .action-item');
	for(const actionNode of Array.from(allActions)){
		const { action } = actionNode.dataset;
		if(action === 'fullscreen' && fsElement){
			actionNode.classList.add('hidden');
			continue;
		}
		if(action === 'fullscreen' && !fsElement){
			actionNode.classList.remove('hidden');
			continue;
		}
		if(action === 'exitfullscreen' && fsElement){
			actionNode.classList.remove('hidden');
			continue;
		}
		if(action === 'exitfullscreen' && !fsElement){
			actionNode.classList.add('hidden');
			continue;
		}
	}
};

const fullscreenExitAction = (pane, target, layout) => {
	//if(!document.fullscreenElement || !document.exitFullscreen) return;
	//document.exitFullscreen();
	pane.classList.remove('maximum');
	fullscreenChangeHandler(false);
};

const fullscreenAction = (pane, target, layout) => {
	//if (!pane || document.fullscreenElement) return;
	//pane.requestFullscreen();
	pane.classList.add('maximum');
	fullscreenChangeHandler(true);
};

const tabCloseAction = (pane, target, layout) => {
	const { onClose } = layout;
	const tab = target.closest('.tab');
	const file = tab.getAttribute("source")
		.split('&paneid=').shift();
	onClose({ pane: pane.id, file });
	closeTab(pane, tab);
};

const tabSelectAction = (pane, target, layout) => {
	const { activate, onSelect } = layout;
	let file = target.getAttribute("source");
	file = file || target.textContent.trim();
	file = file.split('&paneid=').shift();
	onSelect({ pane: pane.id, file });
};

const closepane = (pane, target, layout) => {
	layout.closePane(pane.id);
};

export const actionHandlers = {
	menuToggle: menuToggleAction,
	fullscreen: fullscreenAction,
	exitfullscreen: fullscreenExitAction,
	tabClose: tabCloseAction,
	tabSelect: tabSelectAction,
	closepane
};

