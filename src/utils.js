export const flatConfig = (config) => {
	if(!config.children) return config;
	return [
		config,
		...config.children.map((x) => flatConfig(x, config))
	].flat();
};

export const getConfigNode = (config, predicate) => {
	const configFlat = flatConfig(config);
	return configFlat.find(predicate);
};

export const randomId = (prefix="_") =>
	prefix + Math.random().toString(16).replace('0.','');


export function UrlParams(url=""){
	const paramsString = url.includes('?')
		? url.split('?').pop()
		: "";
	const urlParams = new URLSearchParams(paramsString);
	return urlParams;
};

export function addParams(url, toAdd){
	const currentParams = Object.fromEntries(
		UrlParams(url)
	);
	const newParams = new URLSearchParams({
		...currentParams,
		...toAdd
	});
	const path = url.split("?").shift() + "?" + newParams.toString().replace(/%2F/g, '/')
	return path;
}

export const getFilename = (target="") => {
	const params = UrlParams(target);
	const path = params.get('file') || target;
	const filename = path.split("/").pop();
	return filename;
};

export const getServicename = (target="") => {
	const params = UrlParams(target);
	const service = params.get('service');
	return service;
};

export const getFilepath = (target) => {
	const params = UrlParams(target);
	const path = params.get('file') || target;
	return path;
};

export const debounce = (func, timeout = 500) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			requestAnimationFrame(() => {
				func.apply(this, args)
			});
		}, timeout);
	};
};

export const throttle = (func, interval) => {
	let shouldFire = true;
	return (...args) => {
			if (!shouldFire) return;
			requestAnimationFrame(() => {
				func.apply(this, args)
			});
			shouldFire = false;
			setTimeout(() => {
				shouldFire = true;
			}, interval);
	};
};

export function debounce2 (func, delay) {
	var cooldown = null
	var multiple = null
	return function () {
		var self = this
		var args = arguments
		if (cooldown) {
			multiple = true
			clearTimeout(cooldown)
		} else {
			requestAnimationFrame(() => {
				func.apply(self, args)
			});
		}
		cooldown = setTimeout(function () {
			if (multiple) {
				requestAnimationFrame(() => {
					func.apply(self, args)
				});
			}
			cooldown = null
			multiple = null
		}, delay)
	}
};
