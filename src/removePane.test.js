import removePane from './removePane.js';

const layout = {
	config: {
		id: "grandparent",
		children: [{
			id: "parent",
			height: "200px",
			orient: "tabs",
			children: [
				{ width: "37.5%", id: "start", iframe: "" },
				{ width: "30.7%", id: "middle", iframe: "" },
				{ width: "31.8%", id: "last", iframe: "" },
			],
		}, {
			id: "uncle",
			height: "200px",
			children: []
		}],
	},
	dom: {}
};

removePane(layout)("start");
removePane(layout)("middle");
removePane(layout)("last");
removePane(layout)("uncle");