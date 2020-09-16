const Transformers = () => {
    const transformers = new Map()
    const registerTransformer = (attribute, tranfomer) => transformers.set(attribute, tranfomer)
    const unregisterTransformer = (attribute) => transformers.delete(attribute)
    const getTransformer = (attribute) => transformers.has(attribute) ? transformers.get(attribute) : _ => _
    const hasTransformer = (attribute) => transformers.has(attribute)
    const searchTransformers = (attributes) => attributes
        .map(att => hasTransformer(att.name))
        .reduce((acc, att) => acc || att, false)
    const findTransformer = (attributes) => attributes
        .filter(att => hasTransformer(att.name))
        .map(attribute => getTransformer(attribute.name)(attribute))
    return {
        get: (attributes) => {

            const atts = Array.prototype.slice.call(attributes)

            return searchTransformers(atts) ? findTransformer(atts) : [_ => _]
        },
        registerInputElement: (inputElement) => {
            inputElement.onchange = value => {
                const fns = transformer
                    .get(inputElement.attributes);
                let transformed = value.target.value
                for (let i = 0; i < fns.length; i++) {
                    transformed = fns[i](transformed)
                }
                inputElement.value = transformed
            }
        },
        add: registerTransformer,
        remove: unregisterTransformer,
        count: () => transformers.size,
        has: hasTransformer,
        show: () => transformers.keys()
    }
};
