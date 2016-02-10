const toBeObject = require('jasmine-expect/src/toBeObject');
const toBeMoment = require('./to-be-moment');

module.exports = (key, actual) => toBeObject(actual) && toBeMoment(actual[key]);
