import { pepServices }  from "./remoteService.js"
import { Suite }        from "../../test/test.js";

const remoteServiceSuite = Suite("remoteService");
const service = pepServices(`https://localhost:44382/api/pep`, '');

  remoteServiceSuite.add("setup", async assert => {
    assert.is(1, 1);

    service.loadDevelopers( devs => { // promise
      assert.is(2, devs.length);   // execution later
    });

    service.loadDevelopers( devs => {
      service.loadDevelopers( devs2 => { 
        assert.is(devs.length, devs2.length);   
      });
    });
    
    service.loadProjects( prjs => { // promise
      assert.is(2, prjs.length);   // execution later
    });

  });

remoteServiceSuite.run(4);
//remoteServiceSuite.run(5); //no testresult
