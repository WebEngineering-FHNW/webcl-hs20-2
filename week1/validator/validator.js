const Validator = () => {
    const validators = new Map()
    const registerValidator = (attribute, validator) => validators.set(attribute, validator)
    const unregisterValidator = (attribute) => validators.delete(attribute)
    const getValidator = (attribute) => validators.has(attribute) ? validators.get(attribute) : _ => true
    const hasValidator = (attribute) => validators.has(attribute)
    const searchValidator = (attributes) => attributes
        .map(att => hasValidator(att.name))
        .reduce((acc, att) => acc || att, false)
    const findValidator = (attributes) => attributes
        .filter(att => hasValidator(att.name))
        .map(attribute => getValidator(attribute.name)(attribute))
    const getFns = (attributes) => {
        const attrs = Array.from(attributes)
        return searchValidator(attrs) ? findValidator(attrs) : [_ => true]
    }
    const addInvalidCSS = (input) => {
        input.setCustomValidity("invalid")
        input.style.color = '#ff0000'
        input.style.borderBottomColor = '#ff0000'
    }
    const makeValid = (input, css) => {
        input.style = css
        input.setCustomValidity("")
    }

    return {
        get: getFns,
        registerInputElement: (inputElement) => inputElement.oninput = value => {
            const originStyle = inputElement.style
            getFns(inputElement.attributes)
                .reduce((acc, fn) => fn(value.target.value) && acc, true)
                ? makeValid(inputElement, originStyle)
                : addInvalidCSS(inputElement)
        },
        add: registerValidator,
        remove: unregisterValidator,
        count: () => validators.size,
        has: hasValidator,
        show: () => validators.keys()
    }
};
