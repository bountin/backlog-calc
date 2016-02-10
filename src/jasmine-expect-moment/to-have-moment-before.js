const toBeObject = require('jasmine-expect/src/toBeObject');
const toBeMomentBefore = require('./to-be-moment-before');

module.exports = (key, date, actual) => toBeObject(actual) && toBeMomentBefore(date, actual[key]);
