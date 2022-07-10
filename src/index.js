/*
https://blog.jim-nielsen.com/2021/css-system-colors/

https://css-tricks.com/snippets/css/complete-guide-grid/
*/

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
`;

const pointerDown = (sizer, index, resize) => (e) => {
	let { x: startX, y: startY } = e;
	sizer.setPointerCapture(e.pointerId);

	const pointerMove = (e) => {
		resize(sizer, index, e.x - startX, e.y - startY);
		startX = e.x;
		startY = e.y;
	};
	const pointerUp = () => {
		document.removeEventListener('pointermove', pointerMove);
		document.removeEventListener('pointerup', pointerUp);
		document.removeEventListener('pointercancel', pointerUp);
	};
	document.addEventListener('pointermove', pointerMove);
	document.addEventListener('pointerup', pointerUp);
	document.addEventListener('pointercancel', pointerUp);
};

const attachResizeListener = (sizer, index, resize) => {
	sizer.addEventListener('pointerdown', pointerDown(sizer, index, resize));
};

const createDom = (layout) => {
	const { config, onResize } = layout;
	const { children, id } = config;
	const layoutDom = document.createElement('div');
	layoutDom.classList.add('page-layout');
	id && (layoutDom.id = id);

	layoutDom.innerHTML = 
	`<style>${style}</style>` + 
	children.map(x => `
		<iframe src="${x.iframe}" width="100%" height="100%"></iframe>
	`).join(`
		<div class="sizer"></div>
	`);

	const sizers = layoutDom.querySelectorAll(':scope > .sizer');
	for(const [index, sizer] of Array.from(sizers).entries()){
		sizer.id = Math.random().toString(16).replace('0.','');
		attachResizeListener(sizer, index, onResize);
	}

	return layoutDom;
};

class Layout {
	constructor(config){
		this.config = config;
		const { parent, children } = config;
		this.dom = createDom({
			config,
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
