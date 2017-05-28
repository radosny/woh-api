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
    return parseHolidaysResponse(holidays);
};

exports.getCountries = function *getCountries() {
    const countries = db.get('countries');
    return (yield countries.find({}, '-_id'));
};
