const Transformers = () => {
    const transformers = new Map()
    const registerTransformer = (attribute, tranfomer) => transformers.set(attribute, tranfomer)
    const unregisterTransformer = (attribute) => transformers.delete(attribute)
    const getTransformer = (attribute) => transformers.has(attribute) ? transformers.get(attribute) : _ => _
    const hasTransformer = (attribute) => transformers.has(attribute)
    const searchTransformers = (attributes) => attributes
        .map(att => hasTransformer(att))
        .reduce((acc, att) => acc || att, false)
    const findTransformer = (attributes) => attributes
        .filter(att => hasTransformer(att))
        .map(attribute => getTransformer(attribute))
    return {
        get: (attributes) => searchTransformers(attributes) ? findTransformer(attributes) : [_ => _],
        add: registerTransformer,
        remove: unregisterTransformer,
        count: () => transformers.size,
        has: hasTransformer,
        show: () => transformers.keys()
    }
};
