import removePane from './removePane.js';

const layout = {
	config: {
		id: "grandparent",
		children: [{
			id: "parent",
			height: "200px",
			children: [
				{ width: "37.5%", id: "start" },
				{ width: "30.7%", id: "middle" },
				{ width: "31.8%", id: "last" },
			],
		}, {
			id: "uncle",
			height: "200px",
			children: []
		}],
	},
	dom: {
	
	}
};
removePane(layout)("start");
removePane(layout)("middle");
removePane(layout)("last");
removePane(layout)("uncle");