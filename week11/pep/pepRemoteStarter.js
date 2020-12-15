
import { pepServices } from "./service/remoteService.js";
import { start }       from "./pep.js";

// use data as provided from view through the window object:
const URL       = `http://${grailsServerName}:${grailsServerPort}${restPath}`;
const appRootId = window.appRootId;

const service = pepServices(URL, "/static/pep/img/");

service.loadDevelopers( devs =>
    service.loadProjects( projects =>
      start(appRootId, devs, projects)
));

