import style from './style.js';
import { randomId, getFilename, getFilepath, addParams } from './utils.js';

// WIP to hide tab controls when no valid actions exist

// const tabControls = (menuactions=[]) => `
// 	<div class="tabs-controls">
// 		<div class="action-item" data-action="fullscreen">
// 			<svg viewBox="0 0 10 10" class="icon stroke">
// 				<line x1="1" y1="1" x2="9" y2="1"></line>
// 				<line x1="1" y1="2" x2="9" y2="2"></line>
// 				<line x1="1" y1="1" x2="1" y2="9"></line>
// 				<line x1="9" y1="1" x2="9" y2="9"></line>
// 				<line x1="1" y1="9" x2="9" y2="9"></line>
// 			</svg>
// 		</div>
// 		<div class="action-item hidden" data-action="exitfullscreen">
// 			<svg viewBox="0 0 10 10" class="icon stroke">
// 				<line x1="1" y1="9" x2="9" y2="9"></line>
// 			</svg>
// 		</div>
// 		${ menuactions.filter(x=>!x.disabled).length
// 			? `<div class="action-item" data-action="menuToggle">
// 					<svg viewBox="0 0 10 10" class="icon fill">
// 						<circle cx="1" cy="5" r="1"></circle>
// 						<circle cx="5" cy="5" r="1"></circle>
// 						<circle cx="9" cy="5" r="1"></circle>
// 					</svg>
// 				</div>`
// 			: ""
// 		}
// 	</div>
// `;

const tabControls = (menuactions=[]) => `
	<div class="tabs-controls">
		<div class="action-item" data-action="fullscreen">
			<svg viewBox="0 0 10 10" class="icon stroke">
				<line x1="1" y1="1" x2="9" y2="1"></line>
				<line x1="1" y1="2" x2="9" y2="2"></line>
				<line x1="1" y1="1" x2="1" y2="9"></line>
				<line x1="9" y1="1" x2="9" y2="9"></line>
				<line x1="1" y1="9" x2="9" y2="9"></line>
			</svg>
		</div>
		<div class="action-item hidden" data-action="exitfullscreen">
			<svg viewBox="0 0 10 10" class="icon stroke">
				<line x1="1" y1="9" x2="9" y2="9"></line>
			</svg>
		</div>
		<div class="action-item" data-action="menuToggle">
			<svg viewBox="0 0 10 10" class="icon fill">
				<circle cx="1" cy="5" r="1"></circle>
				<circle cx="5" cy="5" r="1"></circle>
				<circle cx="9" cy="5" r="1"></circle>
			</svg>
		</div>
	</div>
`;

const tabClose = () => `
	<div class="tab-close">
		<div class="action-item" data-action="tabClose">
			<svg viewBox="0 0 10 10" class="icon fill">
				<line x1="1" y1="1" x2="9" y2="9"></line>
				<line x1="9" y1="1" x2="1" y2="9"></line>
			</svg>
		</div>
	</div>
`;

const tabMenuActions = (pane={}) => [
	{
		title: "Close Pane",
		disabled: pane.fixed === true
	},
	// {
	// 	title: "TODO:",
	// 	disabled: true,
	// },
	// {
	// 	seperator: true,
	// },
	// {
	// 	title: "Close All Tabs",
	// 	disabled: true,
	// },
	// {
	// 	title: "Close Inactive Tabs",
	// 	disabled: true,
	// },
	// {
	// 	title: "Close Inactive Left",
	// 	disabled: true,
	// },
	// {
	// 	title: "Close Inactive Right",
	// 	disabled: true,
	// },
];

const tabMenuItem = (i) => {
	if (i.seperator) return `<div class="seperator"></div>`;

	return `
		<li class="${[i.hidden && "hidden", i.disabled && "disabled"]
			.filter((x) => x)
			.join(" ")}"
			data-action="${i.title.replaceAll(" ", "").toLowerCase()}"
		>
			${i.title}
		</li>
	`;
};

const tabsMenu = (items) => {
	items = items || [];
	return `
	<div class="tabs-menu hidden">
		<ul>
			${items.map(tabMenuItem).join("")}
		</ul>
	</div>
	`;
};

export const createTab = (active, iframe) => {
	const filename = getFilename(iframe);
	const filepath = getFilepath(iframe);
	return `
	<div
		class="tab${active ? " active" : ""}"
		source="${iframe}"
		file="${filename}"
		path="${filepath}"
		data-action="tabSelect"
	>
		<span>${filename}</span>
		${tabClose()}
	</div>
	`;
};

const dummyFiles = [
	"one.json",
	"two.jpg",
	"three.png",
	"four.js",
	"five.css",
	"six.html",
];

const iframeAddPaneId = (iframe, paneid) => {
	const isModule = iframe.includes("/_/modules") ||
		iframe.includes("/dist/");
	if (!isModule) return iframe;
	return addParams(iframe, { paneid });
};

const getContent = ({ src, srcdoc, layout, pane }) => {
	const { createTabContent } = layout?.events;
	if(src && createTabContent && typeof createTabContent === "function"){
		const userDefinedContent = createTabContent({ pane, file: src, layout });
		if(userDefinedContent) return userDefinedContent;
	}

	const _src = dummyFiles.includes(src)
		? "document.html"
		: src;
	const sandbox = [
		"allow-same-origin",
		"allow-scripts",
		"allow-popups",
		"allow-modals",
		"allow-downloads",
		"allow-forms",
		"allow-top-navigation",
		"allow-popups-to-escape-sandbox",
	].join(" ");
	const iframe = src
		? `<iframe
			src="${paneid ? iframeAddPaneId(_src, pane) : _src}"
			allowtransparency=”true”
			sandbox="${sandbox}"
			width="100%" height="100%"
			></iframe>`
		: `<iframe
			srcdoc='${srcdoc}'
			allowtransparency=”true”
			sandbox="${sandbox}"
			width="100%" height="100%"
			></iframe>`;
	return iframe;
};

export const createContent = ({ src, srcdoc, childrenOnly, paneid, layout }) => {
	const content = getContent({ src, srcdoc, layout, pane: paneid });
	if (childrenOnly) return content;
	return `<div class="content">${content}</div>`;
};

export const createPane = (paneConfig, layout) => {
	const {
		orient,
		children,
		drop,
		id,
		active: paneActive,
	} = paneConfig;

	const active = children.find((x) => x.active) || children[0];
	const isModule = children.find(
		(x) => x.iframe.includes("/_/modules") || x.iframe.includes("/dist/")
	);
	const dropClass = drop + "" !== "false" ? " dragTo" : "";
	const bottomDockedClass = isModule ? " bottomDocked" : ""; // bottomDocked class does not work as expected
	const activeClass = paneActive ? " active" : "";
	const tabbedClass = orient === "tabs" ? " tabbed" : "";
	const classes = tabbedClass + dropClass + bottomDockedClass + activeClass;

	const menuActions = tabMenuActions(paneConfig);

	return `
	<div class="pane${classes}" id="${id}">
		${
			orient === "tabs"
				? `<div class="tabs-container">
					<div class="tabs">
						${children
							.map((x) => createTab(
								x.active,
								iframeAddPaneId(x.iframe, id)
							))
							.join("")}
					</div>
					${tabControls(menuActions)}
				</div>`
				: ""
		}
		${createContent({ src: active.iframe, paneid: id, layout })}
		${tabsMenu(menuActions)}
	</div>
	`;
};

export const newPaneChildren = (target, tabbed, layout) => {
	return `
	${
		tabbed
			? `<div class="tabs-container">
				<div class="tabs"></div>
				${tabControls()}
			</div>`
			: ""
	}
	<div class="content"></div>
	${tabbed && tabsMenu(tabMenuActions())}
	`;
};

export const newPane = (target, tabbed, dragTo, id, bottomDocked, layout) => `
	<div class="${[
		"pane",
		tabbed && "tabbed",
		dragTo && "dragTo",
		bottomDocked && "bottomDocked",
	]
		.filter((x) => x)
		.join(" ")}"
		id="${id}"
	>
		${newPaneChildren(target, tabbed, layout)}
	</div>
`;

export const childContent = (child, layout) => {
	child.id = child.id || randomId();
	const { iframe, children, id, orient = "", drop } = child;
	const dragToClass = drop + "" !== "false" ? " dragTo" : "";
	if (iframe) {
		const allowed = [
			"terminal.html",
			"status.html",
			"action.html",
			"tree.html",
		];
		let _iframe = allowed.includes(iframe) ? iframe : "terminal.html";
		const isModule = iframe.includes("/_/modules") || iframe.includes("/dist/");
		if (isModule){
			_iframe = addParams(iframe, { paneid: child.id });
		}
		return createPane({
			...child,
			children: [{ iframe: _iframe, active: true }],
		}, layout);
	}

	if (children && orient === "tabs") return createPane(child, layout);

	return `
	<div class="layout-container ${orient}" id="${id}">
		${children.map(childDom(child, layout)).join("")}
	</div>
	`;
};

export const childDom = (config, layout) => (child, i, all) => {
	const { orient } = config;
	if (i === 0) return childContent(child, layout);
	const prev = all[i - 1];
	const next = all[i + 1];
	const canResize = (() => {
		if (prev.resize + "" === "false") return false;
		if (i + 1 === all.length && child.resize + "" === "false") return false;
		return true;
	})();
	const sizer = canResize
		? `<div class="sizer ${orient}"></div>`
		: `<div class="sizer ${orient} disabled"></div>`;
	return sizer + childContent(child, layout);
};

export const createEmpty = () =>
	`
<html>
	<head>
	<meta name="color-scheme" content="dark">
	<style>
		body {
			margin: 0;
			font-family: sans-serif;
			font-size: 14px;
			color: #999;
			background: #2a2a2a;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			bottom: 0;
			top: 0;
			left: 0;
			right: 0;
			box-shadow: inset 0 0 10px 0px #1e1e1e;
		}
		svg {
			width: 60px;
			fill: none;
			stroke: #363636;
			stroke-width: 3px;
		}
	</style>
	</head>
	<body>
		<svg viewBox="0 0 30 30">
			<circle cx="15" cy="15" r="10"></circle>
			<line x1="25" y1="5" x2="5" y2="25"></line>
		</svg>
	</body>
</html>
`
		.replaceAll("\r", "")
		.replaceAll("\n", "");


const containerSizers = (layout, containers, configFlat) => {
	for(const [index, container] of containers.entries()){
		const containerConfig = configFlat
			.find(x => x.id === container.id);
		layout.splitting.setSize(container, containerConfig);

		const sizers = container.querySelectorAll(':scope > .sizer');
		for(const [index, sizer] of Array.from(sizers).entries()){
			sizer.id = randomId();
		}
	}
};

export const createDom = (layout) => {
	try {
		const { flatConfig, config } = layout;
		const { children, id, orient } = config;
		const layoutDom = document.createElement('div');
		layoutDom.classList.add('layout-container', orient);
		id && (layoutDom.id = id);

		layoutDom.innerHTML = `<style>${style()}</style>` + 
			children.map(childDom(config, layout)).join('');

		if(layout.events.createTab){
			const tabs = Array.from(layoutDom.querySelectorAll('.tab'));
			for(const tab of tabs){
				const pane = tab.closest('.pane')?.id;
				const file = tab.getAttribute('path');
				layout.events.createTab({ tab, pane, file });
			}
		}

		if(layout.events.createPane){
			const panes = Array.from(layoutDom.querySelectorAll('.pane'));
			for(const pane of panes){
				layout.events.createPane({ pane });
			}
		}

		const containers = layoutDom
			.querySelectorAll('.layout-container');
		containerSizers(
			layout,
			[layoutDom, ...Array.from(containers)],
			flatConfig()
		);
		return layoutDom;
	} catch(error){
		console.log(error);
		debugger;
	}
};
