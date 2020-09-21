const Transformers = () => {
    const transformers = new Map()
    const registerTransformer = (attribute, tranformer) => transformers.set(attribute, tranformer)
    const unregisterTransformer = (attribute) => transformers.delete(attribute)
    const getTransformer = (attribute) => transformers.has(attribute) ? transformers.get(attribute) : _ => _
    const hasTransformer = (attribute) => transformers.has(attribute)
    const searchTransformers = (attributes) => attributes
        .map(att => hasTransformer(att.name))
        .reduce((acc, att) => acc || att, false)
    const findTransformer = (attributes) => attributes
        .filter(att => hasTransformer(att.name))
        .map(attribute => getTransformer(attribute.name)(attribute))
    const getFns = (attributes) => {
        const attrs = Array.from(attributes)
        return searchTransformers(attrs) ? findTransformer(attrs) : [_ => _]
    }
    return {
        get: getFns,
        registerInputElement: (inputElement) => inputElement.onchange = value => {
            inputElement.value = getFns(inputElement.attributes)
                .reduce((acc, fn) => fn(acc), value.target.value)
            inputElement.dispatchEvent(new Event('input',
                {
                    transformer: true
                }
                )
            )
        },
        add: registerTransformer,
        remove: unregisterTransformer,
        count: () => transformers.size,
        has: hasTransformer,
        show: () => transformers.keys()
    }
};
