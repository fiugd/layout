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
		width: 220px;
		height: 200px;
		background: #333;
		border-radius: 3px;
		box-shadow: 3px 3px 8px #00000073;
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
	.tabs-controls svg {
		fill: currentColor; height: 0.9em;
	}
	.tab > * + * { margin-left: 0.4em; }
	.tab {
		padding: 0.1em 0.7em 0.1em 1.5em;
		cursor: pointer; color: #999;
		height: 30px;
		border-top-right-radius: 2px; border-top-left-radius: 2px;
		/*border-left: 0.5px solid; border-right: 0.5px solid;*/ border-top: 0.5px solid;
		border-color: transparent;
		white-space: nowrap;
		display: flex;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tab + .tab { margin-left: 1px; }
	.active, .open { background: #1e1e1e; border-color: #2a2a2a; }
	.tab span, .tab-close { display: inline; }
	.tab-close { color: transparent; }
	.tab-close svg {
		stroke: currentColor; stroke-width: 1.5; height: 0.65em;
	}
	.active, .active .action-item, .tab:hover .action-item { color: white }
	.action-item * { pointer-events:none; }
	.action-item {
		padding: 0.4em;
		border-radius: 3px;
		display: flex;
	}
	.action-item:hover, .action-item.selected {
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
		border-top: 1px solid #262626; border-left: 1px solid #262626;
		box-sizing: border-box;
	}
	.pane.bottomDocked {
		margin-bottom: -23px;
		z-index: 1;
	}
	.pane .content { flex: 1; background: #1e1e1e; }
	.pane .content iframe {
		border: 0; width: 100%; height: 100%;
		border-color: #2a2a2a;
	}
	.sizer {
		background: transparent;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
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
	.sizer.disabled { pointer-events: none; }
	.sizer:hover { background: #48e; }
	`;
};

export default () => paneStyle() + tabStyle() + draggedStyle();
