const toBeMoment = require('./to-be-moment');
module.exports = (other, actual) => toBeMoment(actual) && actual.isBefore(other);
