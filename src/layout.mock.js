import * as dom from './dom.js';
import * as state from './state.js';
import * as splitting from './splitting.js';

const fakeDom = (layout) => {
	try {
		const createElement = () => {
			return {
				classList: {
					add: () => {}
				},
				querySelectorAll: () => {
					return [];
				}
			};
		};
		self.document = {
			createElement
		};
		return dom.createDom(layout);
	} catch(e){
		console.log(e.message + e.stack );
		debugger;
	}
};

layout.flatConfig = () => state.flatConfig(layout.config);
layout.splitting = splitting;
layout.dom = fakeDom(layout);

/*
TODO: this file is half-baked attempt at running layout in a worker (aka "node" in fiug)
these are just the parts I pulled out of removePane.test.js
this is NOT quite complete
*/