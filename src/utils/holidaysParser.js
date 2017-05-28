'use strict';

exports.parseHolidaysResponse = holidays => (
    holidays.List.reduce((acc, {occurrences}) => {
        const {0: {day, month, year}} = occurrences;
        acc.push(new Date(`${year}-${month}-${day} 00:00:00 GMT-0`).toUTCString());
        return acc;
    }, [])
);
