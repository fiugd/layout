import * as splitting from './splitting.js';
import * as tabbed from './tabbed.js';

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

const dragPreview = document.createElement('div');
dragPreview.classList.add('drag-preview', 'hidden');
dragPreview.style.left = "-999px";
dragPreview.style.top = "-999px";
document.body.append(dragPreview);

var offX = 15;
var offY = -10;
function mouseX(evt) {if (!evt) evt = window.event; if (evt.pageX) return evt.pageX; else if (evt.clientX)return evt.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft); else return 0;}
function mouseY(evt) {if (!evt) evt = window.event; if (evt.pageY) return evt.pageY; else if (evt.clientY)return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop); else return 0;}
function follow(evt) {
	var obj = dragPreview.style;
	obj.left = (parseInt(mouseX(evt))+offX) + 'px';
	obj.top = (parseInt(mouseY(evt))+offY) + 'px'; 
}

let dragging = false;
let file;
const dragStartMessage = (layout) => (e) => {
	const { file: inputFile, source, dragStart, dragEnd, pointerId, pane, splitDirection } = JSON.parse(e.data);
	//document.body.setPointerCapture(pointerId);
	file = inputFile || file;

	if(dragStart){
		dragging = true;
		follow({ pageX: -999, pageY: -999 });
		dragPreview.classList.remove('hidden');
		dragPreview.innerHTML = file.split('/').pop();
		document.addEventListener('pointermove', follow);
	}
	if(dragEnd){
		const dir = {
			"top": "up",
			"bottom": "down",
			"left": "left",
			"right": "right"
		}[splitDirection];
		const splitPane = document.getElementById(pane?.id);
		if(dir && splitPane){
			const split = splitting.newPane(dir, splitPane, file);
			layout.onDrop({ type: "split", dir, pane, file, ...split });
		}
		const tabbedPane = splitPane.classList.contains('tabbed');
		if(!dir && tabbedPane){
			const editorFile = `/fiugd/beta/dist/editor.html?file=${file}`;
			layout.openTab({
				pane: splitPane.id,
				file: editorFile
			});
		}

		dragPreview.classList.add('hidden');
		document.removeEventListener('pointermove', follow);
		dragging = false;
		file = undefined;

		//TODO: adjust layout config
	}
	// const pointerUp = () => {
	// 	dragging = false;
	// 	console.log('body: pointer up');
	// 	console.log('should know what frame got dropped on');
	// 	console.log('for iframe, message that iframe?');
	// 	console.log('for tabbed, message that pane?');
	// 	document.removeEventListener('pointerup', pointerUp);
	// 	document.removeEventListener('pointercancel', pointerUp);
	// };
	// document.addEventListener('pointerup', pointerUp);
	// document.addEventListener('pointercancel', pointerUp);
};

// used by document pointerdown & iframe message that it was clicked
const setPaneActive = (parentPane) => {
	const activePane = document.querySelector('.pane.active');
	if(activePane) activePane.classList.toggle('active');
	parentPane.classList.toggle('active');
	const parentContentIframe = parentPane.querySelector('.content iframe');
	//if(!parentContentIframe) return console.log('no iframe found');
	//parentContentIframe.contentWindow.focus();
};

export const attachResizeListener = (resize) => {
	document.addEventListener('pointerdown', (e) => {
		const isSizer = e.target.classList.contains('sizer');
		if(!isSizer) {
			// const parentPane = e.target.closest('.pane');
			// if(!parentPane) return;
			// setPaneActive(parentPane);
			return;
		}
		const container = e.target.closest('.layout-container');
		const sizers = Array.from(container.querySelectorAll(':scope > .sizer'));
		for(const [index, sizer] of sizers.entries()){
			if(sizer !== e.target) continue;
			pointerDown(sizer, index, resize)(e);
			break;
		}
	});
};

export const attachDragListener = (layout) => {
	const dragListener = dragStartMessage(layout);
	window.addEventListener('message', (e) => {
		try{
			JSON.parse(e.data);
		}catch(e){
			return;
		}
		dragListener(e);
	});
};

// used in the page context
export const dragStart = (ev, draggedEv) => {
	const message = JSON.stringify({
		pointerId: ev.pointerId,
		dragStart: draggedEv.target.textContent,
		file: draggedEv.target.textContent,
		source: location.href.split('/').pop()
	});
	window.parent.postMessage(message, '*');
	ev.preventDefault();
};

// used in the page context
export const dragEnd = ({ pane, splitDirection }={}) => {
	dragging = false;
	const message = JSON.stringify({
		dragEnd: true,
		pane, splitDirection,
		source: location.href.split('/').pop()
	});
	window.parent.postMessage(message, '*');
};

export const onDrop = (handler, parent) => {
	const _parent = parent || document.body;

	const HOVER_WAIT_TIME = 750;

	const mouse = document.createElement('div');
	mouse.classList.add('mouse');
	_parent.append(mouse);

	const dragTarget = document.createElement('div');
	dragTarget.classList.add('drag-target', 'hidden');

	//TODO: drag target for tabs

	const content = _parent.querySelector('.content');
	if(content)	content.append(dragTarget);
	else _parent.append(dragTarget);
	
	_parent.append(dragTarget)

	function hoverClassForSplit(x,y){
		if(x < 0.25) return 'left-hover';
		if(x > 0.75) return 'right-hover';
		if(y < 0.25) return 'top-hover';
		if(y > 0.75) return 'bottom-hover';
		return '';
	}
	function removeHoverClasses(el){
		el.classList.remove('left-hover');
		el.classList.remove('right-hover');
		el.classList.remove('top-hover');
		el.classList.remove('bottom-hover');
	}

	const dragover = (ev, pointermove) => {
		ev.preventDefault();

		if(!_parent.classList.contains('dragTo')){
			return;
		}

		const mousePercents = [
			ev.offsetX/_parent.clientWidth,
			ev.offsetY/_parent.clientHeight
		];
		mouse.innerHTML = `${
			_parent.hoverClassWait === "done"
				? 'DONE'
				: 'WAIT'
		} : ${
			(100 * mousePercents[0]).toFixed(2)
		}, ${
			(100 * mousePercents[1]).toFixed(2)
		}`;

		if(!_parent.hoverClassWait){
			_parent.hoverClassWait="inprogress";
			setTimeout(() => {
				if(_parent.hoverClassWait==="inprogress")
					_parent.hoverClassWait = "done";
			}, HOVER_WAIT_TIME);
		}
		if(_parent.hoverClassWait==="inprogress") return;

		const hoverClass = hoverClassForSplit(...mousePercents);
		if(!hoverClass) removeHoverClasses(dragTarget);
		if(hoverClass && !dragTarget.classList.contains(hoverClass)){
			removeHoverClasses(dragTarget);
			dragTarget.classList.add(hoverClass);
		}
		dragTarget.classList.remove('hidden');

	};
	//_parent.ondragover = editor.ondragover = dragover;
	// _parent.ondragenter = (ev) => {
	// 	ev.preventDefault();
	// 	console.log('drag enter');
	// 	dragTarget.classList.remove('hidden');
	// };
	_parent.ondragover = dragover;
	_parent.ondrop = (ev) => {
		ev.preventDefault();
		const data = ev.dataTransfer.getData("text");
		//_parent.classList.remove('drag-hover');
		dragTarget.classList.add('hidden');
		mouse.innerHTML = '';
		removeHoverClasses(dragTarget);
		_parent.hoverClassWait = undefined;
		handler({ name: data });
	};
	const ondragleave = (ev) => {
		ev.preventDefault();
		removeHoverClasses(dragTarget);
		dragTarget.classList.add('hidden');
		mouse.innerHTML = '';
		_parent.hoverClassWait = undefined;
		//_parent.classList.remove('drag-hover');
	};
	_parent.ondragleave = ondragleave;
	//_parent.onpointerleave = ondragleave;

	const pointermove = (e) => dragover(e,true);
	_parent.onpointerenter = () => {
		if(!dragging) return;
		_parent.addEventListener('pointermove', pointermove);
		if(!_parent.classList.contains('dragTo')){
			_parent.classList.add('noDrag');
			return;
		}
		_parent.classList.add('dragging');
		dragTarget.classList.remove('hidden');
	};
	_parent.onpointerleave = () => {
		if(!dragging) return;
		_parent.classList.remove('dragging', 'noDrag');
		_parent.removeEventListener('pointermove', pointermove);
		dragTarget.classList.add('hidden');
		mouse.innerHTML = '';
		_parent.hoverClassWait = undefined;
	};
	
	const pointerUp = (ev) => {
		if(!dragging) return;
		_parent.classList.remove('dragging', 'noDrag');
		_parent.removeEventListener('pointermove', pointermove);
		ev.preventDefault();
		dragging = false;
		mouse.innerHTML = '';
		
		const splitDirection = dragTarget.classList.value
			.replace('drag-target', '')
			.replace('-hover', '')
			.trim();
		dragEnd({ 
			pane: {
				id: _parent.id
			},
			splitDirection
		});
		dragTarget.classList.add('hidden');
		removeHoverClasses(dragTarget);
		_parent.hoverClassWait = undefined;
		
		if(handler) handler();
		return false;
	};
	_parent.addEventListener('pointerup', pointerUp);
	_parent.addEventListener('pointercancel', pointerUp);

	/*
		dragging to a pane will work like this:
		0) as soon as parent gets a message that DnD has started
		1) all panes activate drag target containers which cover them and are mostly transparent
		2) when a pane has been entered then the drag target itself becomes visible
		3) as mouse moves in pane, it indicates drop locations of center, top, right, left, bottom
		4) when any of these panes gets a pointerup event it is the drop target
		5) DnD ends and all panes deactivate their drag target containers
	*/

	return { dragover };
};


const dropHandler = () => {
	console.log('drop happened')
};

export const attachDropListener = (layoutDom) => {
	const tabbedPanes = Array.from(layoutDom.querySelectorAll('.pane'));
	for(const pane of tabbedPanes){
		const { dragover } = onDrop(dropHandler, pane);
	}
};

export const attachClickListener = (layout) => {
	//document.addEventListener('fullscreenchange', fullscreenChangeHandler);

	layout.dom.addEventListener('click', ({ target }) => {
		if(target.classList.contains('disabled')) return;
		const { action } = target.dataset;

		if(action !== 'menuToggle') tabbed.closeAllMenus();
		if(!action) return;

		const pane = target.closest('.pane.tabbed');
		const handler = tabbed.actionHandlers[action];

		if(handler)
			return handler(pane, target, layout);

		if(action)
			return console.log(`UNHANDLED: ${action}`)
	});
};

export const attachEvents = (layout) => {
	const { dom, onResize } = layout;
	attachResizeListener(onResize);
	attachDragListener(layout);
	attachDropListener(dom);
	attachClickListener(layout);
};
