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

export const getFilename = (target) => {
	let filename = target.split("/").pop();
	if (filename.includes("&paneid="))
		filename = filename.split("&paneid=").shift();
	if (filename.includes("?file="))
		filename = filename.split("?file=").pop();
	return filename;
};

export const getFilepath = (target) => {
	let filename = target;
	if (filename.includes("&paneid="))
		filename = filename.split("&paneid=").shift();
	if (filename.includes("?file="))
		filename = filename.split("?file=").pop();
	return filename;
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
}