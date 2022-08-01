const tabControls = () => `
	<div class="tabs-controls">
		<div class="action-item">
			<svg viewBox="0 0 10 10">
				<circle cx="1" cy="5" r="1"></circle>
				<circle cx="5" cy="5" r="1"></circle>
				<circle cx="9" cy="5" r="1"></circle>
			</svg>
		</div>
	</div>
`;

const tabClose = () => `
	<div class="tab-close">
		<div class="action-item">
			<svg viewBox="0 0 10 10">
				<line x1="1" y1="1" x2="9" y2="9"></line>
				<line x1="9" y1="1" x2="1" y2="9"></line>
			</svg>
		</div>
	</div>
`;

const tabsMenu = () => `
	<div class="tabs-menu hidden">
		<i>todo: menu items</i>
	</div>
`;

const getFilename = (target) => {
	let filename = target.split("/").pop();
	if(filename.includes("?file="))
		filename = filename.split("?file=").pop();
	return filename;
};

export const createTab = (active, iframe) => {
	const filename = getFilename(iframe)
	return `
	<div
		class="tab${ active ? ' active' : ''}"
		source="${iframe}"
		file="${filename}"
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

export const createContent = ({ src, srcdoc, childrenOnly }) => {
	const _src = dummyFiles.includes(src)
		? "document.html"
		: src;
	const sandbox = "allow-same-origin allow-scripts allow-popups allow-modals allow-downloads allow-forms allow-top-navigation allow-popups-to-escape-sandbox"
	const iframe = src
		? `<iframe src="${_src}" allowtransparency=”true” sandbox="${sandbox}" width="100%" height="100%"></iframe>`
		: `<iframe srcdoc='${srcdoc}' allowtransparency=”true” sandbox="${sandbox}" width="100%" height="100%"></iframe>`;

	if(childrenOnly) return iframe;

	return `<div class="content">${iframe}</div>`;
};

export const createPane = ({ children, drop, id }) => {
	const active = children.find(x => x.active);
	const isModule = children.find(x => x.iframe.includes('/_/modules') || x.iframe.includes('/dist/'))
	const dropClass =  (drop+"") !== "false" ? " dragTo" : "";
	const bottomDockedClass = isModule ? " bottomDocked" : "";
	return `
	<div class="pane tabbed${dropClass}${bottomDockedClass}" id="${id}">
		<div class="tabs-container">
			<div class="tabs">
				${ children.map(x => createTab(
						x.active, x.iframe
					)).join('')
				}
			</div>
			${tabControls()}
		</div>
		${/* TODO: document.html is currently hardcoded, fix this later */""}
		${createContent({ src: active.iframe })}
		${tabsMenu()}
	</div>
	`;
};

export const newPaneChildren = (target, tabbed) => {
	return `
	${ tabbed
		? `<div class="tabs-container">
				<div class="tabs">
					${createTab(true, getFilename(target))}
				</div>
				${tabControls()}
			</div>`
		: ""
	}
	${createContent({ src: tabbed ? "document.html" : "terminal.html" })}
	${ tabbed && tabsMenu()}
	`;
};

export const newPane = (target, tabbed, dragTo, id, bottomDocked) => `
	<div class="${
		[
			"pane",
			tabbed && "tabbed",
			dragTo && "dragTo",
			bottomDocked && "bottomDocked"
		].filter(x=>x).join(" ")
	}"
		id="${id}"
	>
		${newPaneChildren(target, tabbed)}
	</div>
`;

export const createEmpty = () => `
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
`.replaceAll("\r", "").replaceAll("\n", "");;

