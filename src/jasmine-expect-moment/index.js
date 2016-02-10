const factory = require('jasmine-expect/src/lib/factory');
const moment = require('moment');

moment.prototype.jasmineToString = moment.prototype.toString;

const matchers = {
	toBeMoment         : require('./to-be-moment'),
	toBeMomentAfter    : require('./to-be-moment-after'),
	toBeMomentBefore   : require('./to-be-moment-before'),
	toBeSameMoment     : require('./to-be-same-moment'),
	toHaveMoment       : require('./to-have-moment'),
	toHaveMomentAfter  : require('./to-have-moment-after'),
	toHaveMomentBefore : require('./to-have-moment-before'),
};

for (var matcherName in matchers) {
	factory(matcherName, matchers[matcherName]);
}

module.exports = matchers;
