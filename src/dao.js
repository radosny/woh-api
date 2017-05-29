'use strict';

const parallel = require('co-parallel');

const log = require('./log')(module.id);
const api = require('./api');
const {parseHolidaysResponse} = require('./utils');
const config = require('./config').get();
const db = require('monk')(config.DB_URL);


function *insertCountry(countries, country) {
    return (yield countries.insert(country));
}

exports.getDBInstance = () => db;

exports.createCountries = function *createCountries(countriesList) {
    log.info('createCountries');
    const countries = db.create('countries');

    const countriesToInsert = countriesList.map(insertCountry.bind(null, countries));
    if (countriesToInsert.length > 0) {
        log.debug('createCountries:remove');
        yield countries.remove({});
    }
    return (yield parallel(countriesToInsert));
};

exports.getHolidays = function *getHolidays(countryId, year) {
    const holidays = yield api.getHolidays(countryId, year);
    const holidaysList = yield parseHolidaysResponse(holidays);
    return [...holidaysList.keys()];
};

exports.getCountries = function *getCountries() {
    const countries = db.get('countries');
    return (yield countries.find({}, '-_id'));
};

/*
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
