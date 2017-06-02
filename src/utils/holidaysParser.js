'use strict';

const map = require('lodash.map');

exports.parseHolidays = holidays => (
    new Promise(resolve => setImmediate(() => {
        const parsedHolidays = holidays.reduce((acc, {date}) => {
            acc.push(date);
            return acc;
        }, []);
        resolve(parsedHolidays);
    }))
);

exports.parseHolidaysResponse = holidays => (
    new Promise(resolve => setImmediate(() => {
        const parsedHolidays = holidays.List.reduce((acc, {occurrences}) => {
            const {0: {day, month, year}} = occurrences;
            return acc.add(new Date(`${year}-${month}-${day} 00:00:00 GMT-0`).toUTCString());
        }, new Set());
        resolve(parsedHolidays);
    }))
);

exports.parseCountries = countries => (
    new Promise(resolve => setImmediate(() => {
        const parsedCountries = map(countries, (country, key) => (
            {
                id: key,
                text: country
            }
        ));
        resolve(parsedCountries);
    }))
);
