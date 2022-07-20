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
const dragStartMessage = () => (e) => {
	const { file: inputFile, source, dragStart, dragEnd, pointerId, pane, splitDirection } = JSON.parse(e.data);
	//document.body.setPointerCapture(pointerId);
	file = inputFile || file;

	if(dragStart){
		dragging = true;
		follow({ pageX: -999, pageY: -999 });
		dragPreview.classList.remove('hidden');
		dragPreview.innerHTML = file;
		document.addEventListener('pointermove', follow);
	}
	if(dragEnd){
		console.log({ file, source, dragEnd, pane: pane?.id, splitDirection });
		const dir = {
			"top": "up",
			"bottom": "down",
			"left": "left",
			"right": "right"
		}[splitDirection];
		const splitPane = document.getElementById(pane?.id);
		if(dir && splitPane){
			splitting.newPane(dir, splitPane, file);
		}
		const tabbedPane = splitPane.classList.contains('tabbed');
		if(!dir && tabbedPane){
			tabbed.openTab(splitPane, file);
		}

		dragPreview.classList.add('hidden');
		document.removeEventListener('pointermove', follow);
		dragging = false;
		file = undefined;
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

export const attachResizeListener = (sizer, index, resize) => {
	sizer.addEventListener('pointerdown', pointerDown(sizer, index, resize));
};

export const attachDragListener = () => {
	window.addEventListener('message', dragStartMessage());
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


//------------------------------------------
export const draggedStyle = () => `
	.pane.dragging { cursor: copy; }
	.pane.noDrag { cursor: no-drop; }
	
	.pane.dragging iframe,
	.pane.dragging .tabs,
	.pane.noDrag iframe,
	.pane.noDrag .tabs {
		pointer-events: none;
	}
	.pane .content { position: relative; }

	.hidden { display: none; }
	.drag-hover {
		pointer-events: none;
		background: #008062 !important;
	}
	.dropped { background: blue; }
	.mouse {
		pointer-events: none;
		position: absolute; bottom: 5px; right: 5px;
	}
	.drag-target {
		pointer-events: none;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: #7774;
		transition: left .2s, right .2s, top .2s, bottom .2s;
	}
	.right-hover { left: 50%; }
	.left-hover { right: 50%; }
	.bottom-hover { top: 50%; }
	.top-hover { bottom: 50%; }
	.drag-preview {
		position: absolute;
		padding: 0.25em 0.75em;
		background: #666;
		z-index: 1;
		border-radius: 3px;
		font-family: sans-serif;
	}
`;
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
}