const toBeObject = require('jasmine-expect/src/toBeObject');
const toBeMomentAfter = require('./to-be-moment-after');

module.exports = (key, date, actual) => toBeObject(actual) && toBeMomentAfter(date, actual[key]);
