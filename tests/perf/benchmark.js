'use strict';

const siege = require('siege');

siege()
  .on(8099)
  .concurrent(15)
  .for(10000).times
  .get('/v1/calendar/')
  .get('/v1/calendar/countries')
  .get('/v1/calendar/holidays/2017/AD').for(2).seconds // local dao
  .get('/v1/calendar/holidays/2017/81').for(2).seconds // remote dao
  .attack();
