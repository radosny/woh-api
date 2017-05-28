'use strict';

const dao = require('./dao');

exports.discovery = function *discovery(req, res) {
    // TODO add discovery routes
    return {};
};

exports.getCountries = function *getCountries(req) {
    return yield dao.getCountries();
};

exports.getHolidays = function *getHolidays(req) {
    return yield dao.getHolidays(81, 2017);
};
