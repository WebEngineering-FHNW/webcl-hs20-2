import { pepServices }  from "./remoteService.js"
import { Suite }        from "../../test/test.js";

const remoteServiceSuite = Suite("remoteService");
const service = pepServices(`https://localhost:44382/api/pep`, '');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


remoteServiceSuite.add("setup", assert => {
  assert.is(1, 1)

  var d = null;
  var done = false;

   service.loadDevelopers( devs => {
    d = devs;
  });
   service.loadDevelopers( devs2 => {
	  assert.is(2, devs2.length);
			done = true;
	})
  

    service.loadProjects( projs => {
        assert.is(projs.length, 2);
    })

    

});

remoteServiceSuite.run();
