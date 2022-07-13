/*
https://blog.jim-nielsen.com/2021/css-system-colors/

https://css-tricks.com/snippets/css/complete-guide-grid/
*/

import * as events from './events.js';
import * as tabbed from './tabbed.js';

const style = `
	.page-layout {
		display: grid;
		width: 100%;
		height: 100%;
	}
	.page-layout > iframe {
		border: 0;
	}
	.sizer {
		/*background: ButtonFace;
		transition: background 0.5s;*/
		cursor: ew-resize;
	}
	.sizer:hover {
		background: #48e;
	}

	${tabbed.style()}
`;

const childDom = (child) => {
	const { iframe, children, orient="" } = child;
	if(iframe) return `<iframe src="${iframe}" width="100%" height="100%"></iframe>`;

	if(children && orient === "tabs") return tabbed.createDom(children);

	return `<iframe src="${children[0].iframe}" width="100%" height="100%"></iframe>`;
};

const createDom = (layout) => {
	const { config, onResize } = layout;
	const { children, id } = config;
	const layoutDom = document.createElement('div');
	layoutDom.classList.add('page-layout');
	id && (layoutDom.id = id);

	layoutDom.innerHTML = 
	`<style>${style}</style>` + 
	children
		.map(childDom)
		.join(`
			<div class="sizer"></div>
		`);

	const sizers = layoutDom.querySelectorAll(':scope > .sizer');
	for(const [index, sizer] of Array.from(sizers).entries()){
		sizer.id = Math.random().toString(16).replace('0.','');
		events.attachResizeListener(sizer, index, onResize);
	}

	events.attachDragListener();
	tabbed.attachEvents(layoutDom);
	return layoutDom;
};

const parseConfig = (config) => {
	const { children, rows, columns, tabs, ...rest } = config;
	const _children = children || rows || columns || tabs;
	if(_children && !(_children||[]).find(x => x.active)){
		_children[0] && (_children[0].active = true);
	}

	let orient = "column";
	if(columns) orient = "row";
	if(tabs) orient = "tabs";

	return {
		...rest,
		orient,
		children: (_children||[]).map(parseConfig)
	}
};

class Layout {
	constructor(config){
		this.config = parseConfig(config);
		const { parent, children } = this.config;
		this.dom = createDom({
			config: this.config,
			onResize: this.onResize.bind(this)
		});
		parent.append(this.dom);
		this.setSize();
	}
	onResize(sizer, i, x, y){
		const prev = this.config.children[i];
		const next = this.config.children[i+1];
		//TODO: figure out how to size them (px, %, 1fr)
		if(prev.width && prev.width.includes('px')){
			prev.width = Number(
				prev.width.replace('px','')
			) + x + 'px';
		}
		if(next.width && next.width.includes('px')){
			next.width = Number(
				next.width.replace('px','')
			) - x + 'px';
		}
		this.setSize();
	}
	setSize(){
		this.dom.style.gridTemplateColumns = this.config.children
			.map(x=>x.width || '1fr')
			.join(' 3px ');
	}
};

export default Layout;

export const dragStart = events.dragStart;
export const onDrop = events.onDrop;
