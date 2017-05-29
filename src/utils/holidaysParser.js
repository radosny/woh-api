'use strict';

const map = require('lodash.map');

exports.parseHolidays = holidays => (
    Promise.resolve(holidays.reduce((acc, {date}) => {
        acc.push(date);
        return acc;
    }, [])
));

exports.parseHolidaysResponse = holidays => (
                                             Promise.resolve(holidays.List.reduce((acc, {occurrences}) => {
                                                                                  const {0: {day, month, year}} = occurrences;
                                                                                  return acc.add(new Date(`${year}-${month}-${day} 00:00:00 GMT-0`).toUTCString());
                                                                                  }, new Set())
                                                             ));

exports.parseCountries = countries => (
    Promise.resolve(
        map(countries, (country, key) => (
            {
                id: key,
                text: country
            }
        )))
);
