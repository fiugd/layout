import * as events from './events.js';
import * as tabbed from './tabbed.js';
import * as splitting from './splitting.js';
import * as dom from './dom.js';
import * as state from './state.js';

window.newPane = splitting.newPane;

class Layout {
	constructor(config){
		this.events = {};
		this.on = (eventName, handler) => {
			this.events[eventName] = this.events[eventName] || [];
			this.events[eventName].push(handler);
		};

		this.splitting = splitting;

		this.config = state.parseConfig(config);
		this.onChange = state.onChange(this);
		this.onOpen = state.onOpen(this);
		this.onSelect = state.onSelect(this);
		this.onClose = state.onClose(this);
		this.onResize = state.onResize(this);
		this.onDrop = state.onDrop(this);

		this.activate = (args) => state.activate({ ...args, layout: this });
		this.focusAllActiveTabs = () => tabbed.focusAllActiveTabs(this.dom);
		this.openTab = tabbed.openTab;
		this.closeAllMenus = tabbed.closeAllMenus;
		this.flatConfig = () => state.flatConfig(this.config);

		this.dom = dom.createDom(this);
		this.config.parent.append(this.dom);

		this.focusAllActiveTabs();
		events.attachEvents(this);
	}
};

export default Layout;

export const dragEnd = events.dragEnd;
export const dragStart = events.dragStart;
export const onDrop = events.onDrop;
