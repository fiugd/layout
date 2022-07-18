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
document.body.append(dragPreview);


var offX = 15;
var offY = 15;
function mouseX(evt) {if (!evt) evt = window.event; if (evt.pageX) return evt.pageX; else if (evt.clientX)return evt.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft); else return 0;}
function mouseY(evt) {if (!evt) evt = window.event; if (evt.pageY) return evt.pageY; else if (evt.clientY)return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop); else return 0;}
function follow(evt) {
	var obj = dragPreview.style;
	obj.left = (parseInt(mouseX(evt))+offX) + 'px';
	obj.top = (parseInt(mouseY(evt))+offY) + 'px'; 
}

let dragging = false;
const dragStartMessage = () => (e) => {
	const { file, source, dragStart, dragEnd, pointerId } = JSON.parse(e.data);
	//document.body.setPointerCapture(pointerId);
	console.log(dragStart, dragEnd);

	if(dragStart){
		follow(e);
		dragPreview.classList.remove('hidden');
		dragPreview.innerHTML = file;
		dragging = true;
		document.addEventListener('pointermove', follow);
	}
	if(dragEnd){
		dragPreview.classList.add('hidden');
		document.removeEventListener('pointermove', follow);
		dragging = false;
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

export const dragStart = (ev) => {
	console.log('dragging started')
	//document.body.setPointerCapture(ev.pointerId);
	//ev.dataTransfer.setData("text", ev.target.textContent);
	const message = JSON.stringify({
		pointerId: ev.pointerId,
		dragStart: ev.target.textContent,
		file: ev.target.textContent,
		source: location.href.split('/').pop()
	});
	window.parent.postMessage(message, '*');
	ev.preventDefault();
};

export const dragEnd = ({ pane }) => {
	dragging = false;
	console.log('dragging ended');
	console.log(pane)
	const message = JSON.stringify({
		dragEnd: true,
		source: location.href.split('/').pop()
	});
	window.parent.postMessage(message, '*');
};


//------------------------------------------
export const draggedStyle = () => `
	.pane.dragging { cursor: grabbing; }
	.hidden { display: none; }
	.drag-hover {
		pointer-events: none;
		background: #008062 !important;
		/*filter: hue-rotate(294deg) brightness(0.75) saturate(0.25);*/
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
		transition: left .3s, right .3s, top .3s, bottom .3s;
	}
	.right-hover { left: 50%; }
	.left-hover { right: 50%; }
	.bottom-hover { top: 50%; }
	.top-hover { bottom: 50%; }
	.drag-preview {
		position: absolute;
		min-width: 50px;
		padding: 0.25em 0.75em;
		background: #125863;
		z-index: 1;
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
	//dragTarget.innerHTML = `<style>${dropStyle}</style>`
	_parent.append(dragTarget);

	let hoverClassWait;
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
		if(pointermove===true) console.log('pointer move');
		dragTarget.classList.remove('hidden');
		ev.preventDefault();

		const mousePercents = [
			ev.offsetX/_parent.clientWidth,
			ev.offsetY/_parent.clientHeight
		];
		mouse.innerHTML = `${
			hoverClassWait === "done"
				? 'DONE'
				: 'WAIT'
		} : ${
			(100 * mousePercents[0]).toFixed(2)
		}, ${
			(100 * mousePercents[1]).toFixed(2)
		}`;

		if(!hoverClassWait){
			hoverClassWait="inprogress";
			setTimeout(() => {
				if(hoverClassWait==="inprogress")
					hoverClassWait = "done";
			}, HOVER_WAIT_TIME);
		}
		if(hoverClassWait==="inprogress") return;

		const hoverClass = hoverClassForSplit(...mousePercents);
		if(!hoverClass) removeHoverClasses(dragTarget);
		if(hoverClass && !dragTarget.classList.contains(hoverClass)){
			removeHoverClasses(dragTarget);
			dragTarget.classList.add(hoverClass);
		}
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
		hoverClassWait = undefined;
		handler({ name: data });
	};
	const ondragleave = (ev) => {
		console.log('drag leave');
		ev.preventDefault();
		removeHoverClasses(dragTarget);
		dragTarget.classList.add('hidden');
		mouse.innerHTML = '';
		hoverClassWait = undefined;
		//_parent.classList.remove('drag-hover');
	};
	_parent.ondragleave = ondragleave;
	//_parent.onpointerleave = ondragleave;

	const pointermove = (e) => dragover(e,true);
	_parent.onpointerenter = () => {
		if(!dragging) return;
		_parent.classList.add('dragging');
		for(var frame of Array.from(_parent.querySelectorAll('.tabs'))){
			frame.style.pointerEvents = "none";
		}
		for(var frame of Array.from(_parent.querySelectorAll('iframe'))){
			frame.style.pointerEvents = "none";
		}
		_parent.addEventListener('pointermove', pointermove);
		dragTarget.classList.remove('hidden');
	};
	_parent.onpointerleave = () => {
		if(!dragging) return;
		_parent.classList.remove('dragging');
		for(var frame of Array.from(_parent.querySelectorAll('.tabs'))){
			frame.style.pointerEvents = undefined;
		}
		for(var frame of Array.from(_parent.querySelectorAll('iframe'))){
			frame.style.pointerEvents = undefined;
		}
		_parent.removeEventListener('pointermove', pointermove);
		dragTarget.classList.add('hidden');
		mouse.innerHTML = '';
		if(dragging) console.log('drag exit')
	};
	
	const pointerUp = (ev) => {
		if(!dragging) return;
		_parent.classList.remove('dragging');
		_parent.removeEventListener('pointermove', pointermove);
		ev.preventDefault();
		dragging = false;
		console.log('pane heard pointer up');
		dragTarget.classList.add('hidden');
		mouse.innerHTML = '';
		removeHoverClasses(dragTarget);
		hoverClassWait = undefined;
		dragEnd({ pane: _parent });
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
	const tabbedPanes = Array.from(layoutDom.querySelectorAll('.pane.dragTo'));
	for(const pane of tabbedPanes){
		const { dragover } = onDrop(dropHandler, pane);
	}
}