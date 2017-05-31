'use strict';

const parallel = require('co-parallel');

const log = require('../log')(module.id);
const {parseHolidaysResponse} = require('../utils');
const api = require('../api');
const config = require('../config').get();
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

exports.RemoteDao = class RemoteDao {
    /**
     * Returns holidays for specific country
     *
     * @param {Number} countryId
     * @param {Number} year
     * @returns {Array<Date>}
     *
     * @memberof RemoteDao
     */
    *getHolidays(countryId, year) {
        const holidays = yield api.getHolidays(parseInt(countryId, 10), parseInt(year, 10));
        const holidaysList = yield parseHolidaysResponse(holidays);
        return [...holidaysList.keys()];
    }

    /**
     * Returns list of available countries
     * @returns {Array<{id:String, text:String}>}
     *
     * @memberof RemoteDao
     */
    *getCountries() {
        log.debug('getCountries');
        const countries = db.get('countries');
        return (yield countries.find({}, '-_id'));
    }
};
