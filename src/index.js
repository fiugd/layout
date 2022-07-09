/*
system colors:
https://blog.jim-nielsen.com/2021/css-system-colors/
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
		background: ButtonFace;
	}
`;

const pointerDown = (sizer, resize) => (e) => {
	let { x: startX, y: startY } = e;
	sizer.setPointerCapture(e.pointerId);

	const pointerMove = (e) => {
		resize(sizer, e.x - startX, e.y - startY);
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

const attachResizeListener = (sizer, resize) => {
	sizer.addEventListener('pointerdown', pointerDown(sizer, resize));
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
	for(const sizer of Array.from(sizers)){
		sizer.id = Math.random().toString(16).replace('0.','');
		attachResizeListener(sizer, onResize);
	}

	layoutDom.style.gridTemplateColumns = children
		.map(x=>x.width || '1fr')
		.join(' 3px ');

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
	onResize(sizer, x, y){
		console.log(sizer.id, x, y);
		//TODO: figure out which elements to size
		//TODO: figure out how to size them (px, %, 1fr)
		//NOTE: for now this is hard-coded to resize first element
		this.config.children[0].width = Number(
			this.config.children[0].width.replace('px','')
		) + x + 'px';
		this.setSize();
	}
	setSize(){
		this.dom.style.gridTemplateColumns = this.config.children
			.map(x=>x.width || '1fr')
			.join(' 3px ');
	}
};

export default Layout;
