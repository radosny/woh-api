'use strict';

const Holidays = require('date-holidays');
const log = require('./log')(module.id);
const {parseCountries, parseHolidays} = require('./utils');

const hdInstance = new Holidays();

exports.getHolidays = function *getHolidays(countryId, year) {
    log.debug('getHolidays');
    hdInstance.init(countryId);
    const holidays = hdInstance.getHolidays(year);
    return (yield parseHolidays(holidays));
};

exports.getCountries = function *getCountries() {
    log.debug('getCountries');
    const countries = hdInstance.getCountries();
    return (yield parseCountries(countries));
};
