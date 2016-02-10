const toBeMoment = require('./to-be-moment');
module.exports = (expected, unit, actual) => toBeMoment(actual) && actual.isSame(expected, unit);
