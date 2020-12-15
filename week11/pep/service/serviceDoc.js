
import "../domainDoc.js"

/**
 * @callback onDevelopersReadyCallback
 * @param    {Developer[]} devs - array of developers
 * @return   {undefined} void
 */

/**
 * @callback onProjectsReadyCallback
 * @param    {Project[]} projects - array of projects
 * @return   {undefined} void
 */

/**
 * Common interface for all services (abstract factory pattern)
 *
 * @typedef {
              {loadDevelopers: (function(onDevelopersReadyCallback): undefined)},
              {loadProjects:   (function(onProjectsReadyCallback): undefined)}
            } PepService
 */

