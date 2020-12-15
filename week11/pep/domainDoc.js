
/**
 * @typedef Developer
 * @type {object}
 * @property {!number} id   - unique integer number; mandatory.
 * @property {?string} img  - path to an image that displays the developer; optional.
 * @property {string}  name - composed full name; might be empty.
 * @example  {id:0, img:"img/img0.jpg", name: "Dierk König"}
 */

/**
 * @typedef Project
 * @type {object}
 * @property {!number} id    - unique integer number; mandatory.
 * @property {?string} color - color name like "green" ; optional.
 * @property {!string}  name - descriptive project name; at least three chars.
 * @example  {id:0, color: 'red',   name: "Personal Einsatz Planung"},
 */
