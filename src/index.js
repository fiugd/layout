import * as events from './events.js';
import * as tabbed from './tabbed.js';
import * as splitting from './splitting.js';
import * as dom from './dom.js';
import * as state from './state.js';
import { flatConfig } from './utils.js';

import { UrlParams, addParams } from './utils.js';

window.newPane = splitting.newPane;

class Layout {
	constructor(config){
		this.events = { ...config.events };
		this.on = (eventName, handler) => {
			this.events[eventName] = this.events[eventName] || [];
			this.events[eventName].push(handler);
		};

		this.splitting = splitting;
		this.tabbed = {
			...tabbed,
			openTab: (...args) => tabbed.openTab(...args, this)
		};

		this.config = state.parseConfig(config);
		this.onChange = state.onChange(this);
		this.onOpen = state.onOpen(this);
		this.onSelect = state.onSelect(this);
		this.onClose = state.onClose(this);
		this.onResize = state.onResize(this);
		this.onDrop = state.onDrop(this);

		this.activate = (args) => state.activate({ ...args, layout: this });
		this.focusAllActiveTabs = () => tabbed.focusAllActiveTabs(this.dom);
		this.closeAllMenus = tabbed.closeAllMenus;
		this.flatConfig = () => flatConfig(this.config);

		//EXTERNAL
		this.openTab = (args) => {
			this.activate(args);
			this.onChange();
		};
		this.closeTab = (args) => {
			const { tab, pane } = args;
			const file = UrlParams(tab.getAttribute("source")).get("file");
			this.tabbed.closeTab(pane, tab);
			this.onClose({ pane: pane.id, file });
			this.onChange();
		};
		this.closePane = (args) => {
			state.closePane(this)(args);
			this.onChange();
		};
		this.hidePane = (args) =>state.hidePane(this)(args);
		this.showPane = (args) =>state.showPane(this)(args);

		this.dom = dom.createDom(this);
		if(!this.dom) return console.error('layout creation failed');

		this.config.parent.append(this.dom);
		this.focusAllActiveTabs();
		events.attachEvents(this);
	}
};

export default Layout;

export const dragEnd = events.dragEnd;
export const dragStart = events.dragStart;
export const onDrop = events.onDrop;
