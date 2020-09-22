import { Suite }     from "../test/test.js";
import { Attribute } from "./presentationModel.js";

const pmSuite = Suite("presModel");

pmSuite.add("attr-value", assert => {
    const attr = Attribute("init");
    assert.is(attr.valueObs.getValue(), "init");
    assert.is(attr.validObs.getValue(), true);  // default
});

pmSuite.add("attr-convert", assert => {
    const attr = Attribute("init");
    attr.setConverter(str => str.toUpperCase());
    assert.is(attr.valueObs.getValue(), "INIT"); // existing value is converted
    attr.setConvertedValue("xxx");               // specialized function: ...
    assert.is(attr.valueObs.getValue(), "XXX");  // ... converted
    attr.valueObs.setValue("xxx");               // direct access to observable function: ...
    assert.is(attr.valueObs.getValue(), "xxx");  // ... does _not_ convert
});

pmSuite.add("attr-valid", assert => {
    const attr = Attribute("init");
    let   valid = undefined;
    attr.validObs.onChange(x => valid = x);
    assert.is(valid, true);
    attr.setValidator( val => val.length > 4);
    assert.is(valid, false);
    attr.setConvertedValue("12345");
    assert.is(valid, true);
});


pmSuite.run();
