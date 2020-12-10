import { pepServices }  from "./remoteService.js"
import { Suite }        from "../../test/test.js";

const remoteServiceSuite = Suite("remoteService");
const service = pepServices(`https://localhost:44382/api/pep`, '');

function init () {
  remoteServiceSuite.add("setup", async assert => {
    assert.is(1, 1);

    var d = null;
    var done = false;

    await service.loadDevelopers(  devs => {
      d = devs;
    });
    await service.loadDevelopers( devs2 => {
      assert.is(2, devs2.length);
        done = true;
    })
    

    await service.loadProjects( projs => {
          assert.is(projs.length, 2);
      })
  });
}

init();
remoteServiceSuite.run();