import { pepServices }  from "./localService.js"
import { Suite }        from "../../test/test.js";

const localServiceSuite = Suite("localService");

localServiceSuite.add("setup", assert => {

    pepServices().loadDevelopers( devs => {
        assert.is(devs.length, 2);
    })

    pepServices().loadProjects( projs => {
        assert.is(projs.length, 2);
    })

});

localServiceSuite.run();
