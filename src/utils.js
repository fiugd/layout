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
