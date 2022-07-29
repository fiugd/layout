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

export const createTab = (active, filename) => `
<div
	class="tab${ active ? ' active' : ''}"
	file="${filename}"
>
	<span>${filename}</span>
	${tabClose()}
</div>
`;

export const createContent = ({ src, srcdoc }) => {
	const iframe = src
		? `<iframe src="${src}" width="100%" height="100%"></iframe>`
		: `<iframe srcdoc='${srcdoc}' width="100%" height="100%"></iframe>`;

	return `<div class="content">${iframe}</div>`;
};

export const createPane = ({ children, drop, id }) => `
	<div class="pane tabbed${ (drop+"") !== "false" ? " dragTo" : "" }" id="${id}">
		<div class="tabs-container">
			<div class="tabs">
				${ children.map(x => createTab(
						x.active,
						x.iframe.split('/').pop()
					)).join('')
				}
			</div>
			${tabControls()}
		</div>
		${/* TODO: document.html is currently hardcoded, fix this later */""}
		${createContent({ src: "document.html" })}
		${tabsMenu()}
	</div>
`;

export const newPaneChildren = (target, tabbed) => `
	${ tabbed
		? `<div class="tabs-container">
				<div class="tabs">
					${createTab(true, target.split("/").pop())}
				</div>
				${tabControls()}
			</div>`
		: ""
	}
	${createContent({ src: tabbed ? "document.html" : "terminal.html" })}
	${ tabbed && tabsMenu()}
`;

export const newPane = (target, tabbed, dragTo, id) => `
	<div class="${
		[
			"pane",
			tabbed && "tabbed",
			dragTo && "dragTo"
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
			padding: 0.75em 1em;
			font-family: sans-serif; font-size: 14px;
			color: #999;
			background: #2a2a2a;
		}
	</style>
	</head>
	<body>
	</body>
</html>
`.replaceAll("\r", "").replaceAll("\n", "");;

