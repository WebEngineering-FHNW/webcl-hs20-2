
import { pepServices } from "./service/localService.js";
import { start }       from "./pep.js";

const appRootId = window.appRootId;

const service = pepServices();

service.loadDevelopers( devs =>
    service.loadProjects( projects =>
      start(appRootId, devs, projects)
));
