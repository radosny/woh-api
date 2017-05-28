'use strict';

const bunyan = require('bunyan');
const loggerModules = new Map();


/**
 * Creates logger per module
 * @param {string} moduleName
 * @returns {bunyan}
 */
module.exports = function (moduleName) {
    if (!loggerModules.has(moduleName)) {
        const log = bunyan.createLogger({
            name: `woh-api:${moduleName}`
        });
        loggerModules.set(moduleName, log);
    }
    return loggerModules.get(moduleName);
};
