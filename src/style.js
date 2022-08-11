const tabStyle = () => {
	 return `
	.pane.tabbed {
		flex-direction: column;
		font-family: sans-serif; font-size: 14px;
		overflow: hidden;
	}
	.tabs-container {
		user-select: none;
		height: 30px;
		min-height: 30px;
		background: #2a2a2a;
		display: flex;
	}
	.tabs {
		flex: 1;
		display: flex;
		margin-top: -1px;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
	}
	.tabs::-webkit-scrollbar {
		display: none;
	}

	.tabs-menu {
		position: absolute;
		top: 28px;
		right: 10px;
		min-width: 220px;
		min-height: 200px;
		background: #333;
		border-radius: 3px;
		box-shadow: 3px 3px 8px #00000073;
	}
	.tabs-menu ul {
		list-style: none;
		user-select: none;
		padding-left: 0;
		margin: 0;
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}
	.tabs-menu ul li {
		padding: 0.5em 1em;
	}
	.tabs-menu ul li.disabled {
		color: #666;
	}
	.tabs-menu ul li:not(.disabled) {
		cursor: pointer;
	}
	.tabs-menu ul li + li {}
	.tabs-menu ul li:not(.disabled):hover {
		background: #38495b;
	}
	.tabs-menu .seperator {
		width: 100%;
		background: #4f4f4f;
		height: 1px;
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	}

	.tabs-controls {
		height: 100%;
		display: flex;
		background: #2a2a2a;
		padding: 0 0.75em;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: #999;
	}
	.tabs-controls svg.fill {
		fill: currentColor; height: 0.9em;
	}
	.tabs-controls svg.stroke {
		stroke: currentColor;
		height: 0.9em;
	}
	.tab > * + * { margin-left: 0.4em; }
	.tab {
		padding: 0.1em 0.7em 0.1em 1.5em;
		cursor: pointer; color: #999;
		height: 30px;
		border-top-right-radius: 2px;
		border-top-left-radius: 2px;
		/*
		border-left: 0.5px solid;
		border-right: 0.5px solid;
		*/
		border-top: 0.5px solid;
		border-color: transparent;
		white-space: nowrap;
		display: flex;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tab + .tab { margin-left: 1px; }
	.tab.active, .tab.open {
		background: #222;
		background: linear-gradient(0deg, #1e1e1e 0%, #2a2a2a 70%);
	}
	.tab.active:hover,
	.pane.active .tab.active,
	.pane.active .tab.open {
		background: #1e1e1e;
	}
	.tab > span { pointer-events: none; }
	.tab > span, .tab-close { display: inline; }
	.tab-close { color: transparent; }
	.tab-close svg {
		stroke: currentColor; stroke-width: 1.5; height: 0.65em;
	}
	.pane.active .tab.active,
	.pane.active .tab.active .action-item,
	.tab.active:hover,
	.tab:hover .action-item {
		color: white;
	}
	.action-item * { pointer-events:none; }
	.action-item {
		padding: 0.4em;
		border-radius: 3px;
		display: flex;
	}
	.action-item:hover,
	.action-item.selected {
		color: white;
		background: #fff2;
	}
	`;
};

const draggedStyle = () => {
	return `
	.pane.dragging { cursor: copy; }
	.pane.noDrag { cursor: no-drop; }
	
	.pane.dragging iframe,
	.pane.dragging .tabs,
	.pane.noDrag iframe,
	.pane.noDrag .tabs {
		pointer-events: none;
	}
	.pane .content { position: relative; }

	.pane {
		background: #222;
	}
	.pane.active {
		background: #1e1e1e;
	}

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
};

const paneStyle = () => {
	return `
	.layout-container {
		display: grid;
		width: 100%;
		height: 100%;
	}
	.pane {
		position: relative;
		display: flex; 
		margin: 0;
		/*border-top: 1px solid #262626;*/
		/*border-left: 1px solid #262626;*/
		box-sizing: border-box;
	}
	.pane.bottomDocked {
		margin-bottom: -23px;
		/*z-index: 1;*/
	}
	.pane.maximum {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 9;
		margin-bottom: 0;
	}
	.pane .content { flex: 1; }
	.pane .content iframe {
		border: 0; width: 100%; height: 100%;
		border-color: #2a2a2a;
	}
	.pane.active:after {
		content: "";
		position: absolute;
		pointer-events: none;
		display: block;
		box-sizing: border-box;
		/*
		right: 0;
		top: 0;
		box-shadow: inset 0 0 3px #00bcff;
		left: 1px;
		bottom: 23px;
		*/
		right: 11px;
		bottom: 28px;
		background: #779997;
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
	.sizer {
		background: transparent;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
		color: #2d2d2d;
	}
	.sizer.column {
		cursor: col-resize;
		left: -1px;
		width: 3px;
		margin-top: 1px;
	}
	.sizer.row {
		cursor: row-resize;
		top: -1px;
		height: 3px;
		margin-left: 1px;
	}
	.sizer:after {
		content: '';
		display: block;
		background: currentColor;
	}
	.sizer.column:after {
		height: 100%;
		width: 1px;
		margin-left: 1px;
	}
	.sizer.row:after {
		width: 100%;
		height: 1px;
		margin-top: 1px;
	}
	.sizer.disabled { pointer-events: none; color:transparent; }
	.sizer:hover { background: #48e; color: transparent; }
	`;
};

export default () => paneStyle() + tabStyle() + draggedStyle();
