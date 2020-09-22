
import { Observable } from "../observable/observable.js";
import { id }         from "../church/church.js";

export { Attribute }

const Attribute = value => {

    const valueObs = Observable(value);
    const validObs = Observable(true);

    let   converter    = id;
    const setConverter = newConverter => {
        converter = newConverter;
        setConvertedValue( valueObs.getValue() );
    }
    const setConvertedValue = value => valueObs.setValue( converter( value ) );

    const setValidator = newValidator => valueObs.onChange( value => validObs.setValue( newValidator(value) ) );

    return { valueObs, validObs, setConverter, setValidator, setConvertedValue }
};
