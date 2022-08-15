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