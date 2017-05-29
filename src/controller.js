'use strict';

const dao = require('./dao');

exports.discovery = function *discovery(req, res) {
    // TODO add discovery routes
    return {};
};

exports.getCountries = function *getCountries() {
    return yield dao.getCountries();
};

exports.getHolidays = function *getHolidays(req) {
    const {params:{year, countryId}} = req;
    return yield dao.getHolidays(countryId, year);
};
