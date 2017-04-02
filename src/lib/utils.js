const getSelector = model => model.findAll().then(result => result.map(e => e.toMap));

export default getSelector;
