'use strict';

const config = require('../config');

exports.get = function get() {
    // TODO: add config schema validation (strummer)
    return Object.assign({}, config);
};
