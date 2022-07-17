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

const dragStartMessage = () => (e) => {
	const { source, dragStart } = JSON.parse(e.data);
	console.log(source, dragStart);
};

export const attachResizeListener = (sizer, index, resize) => {
	sizer.addEventListener('pointerdown', pointerDown(sizer, index, resize));
};

export const attachDragListener = () => {
	window.addEventListener('message', dragStartMessage());
};

export const dragStart = (ev) => {
	ev.dataTransfer.setData("text", ev.target.textContent);
	const message = JSON.stringify({
		dragStart: ev.target.textContent,
		source: location.href.split('/').pop()
	});
	window.parent.postMessage(message, '*');
};


//------------------------------------------
const dropStyle = `
	.hidden { display: none; }
	.drag-hover {
		pointer-events: none;
		background: #008062 !important;
		/*filter: hue-rotate(294deg) brightness(0.75) saturate(0.25);*/
	}
	.dropped { background: blue; }
	.mouse { position: absolute; bottom: 5px; right: 5px; }
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
`;
export const onDrop = (handler, parent) => {
	const _parent = parent || document.body;

	const HOVER_WAIT_TIME = 750;

	const mouse = document.createElement('div');
	mouse.classList.add('mouse');
	_parent.append(mouse);

	const dragTarget = document.createElement('div');
	dragTarget.classList.add('drag-target', 'hidden');
	dragTarget.innerHTML = `<style>${dropStyle}</style>`
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

	const dragover = (ev) => {
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

	return { dragover };
};