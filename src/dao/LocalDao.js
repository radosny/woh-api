'use strict';

const Holidays = require('date-holidays');

const log = require('../log')(module.id);
const {parseHolidays, parseCountries} = require('../utils');

exports.LocalDao = class LocalDao {
    constructor() {
        this.hd = new Holidays();
    }

    /**
     * Returns holidays for specific country
     *
     * @param {Number} countryId
     * @param {Number} year
     * @returns {Array<Date>}
     *
     * @memberof LocalDao
     */
    *getHolidays(countryId, year) {
        log.debug('getHolidays');
        this.hd.init(countryId);
        const holidays = this.hd.getHolidays(year);
        return (yield parseHolidays(holidays));
    }

    /**
     * Returns list of available countries
     * @returns {Array<{id:String, text:String}>}
     *
     * @memberof LocalDao
     */
    *getCountries() {
        log.debug('getCountries');
        const countries = this.hd.getCountries();
        return (yield parseCountries(countries));
    }
};
