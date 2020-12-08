
import "./serviceDoc.js"

export { pepServices }

/** @type Developer[] */
const devs = [
    {id:0, img:"img/img0.jpg", name: "Marie-Claude Federspiel"},
    {id:1, img:"img/img1.jpg", name: "Christian Ribeaud"},
];

/** @type Project[] */
const projs = [
    {id:0, color: 'red',   name: "Personal Einsatz Planung"},
    {id:1, color: 'green', name: "Web Clients"},
];

/**
 * Concrete factory for local {@link PepService} functions.
 * @constructor
 * @returns {PepService}
 */
const pepServices = () => {

    const loadDevelopers = withDevelopers => withDevelopers(devs);
    const loadProjects   = withProjects   => withProjects(projs);
    return { loadDevelopers, loadProjects }
};
