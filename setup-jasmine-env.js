/*globals jasmine*/
jasmine.VERBOSE = true;

require('jasmine-expect');
require('./src/jasmine-expect-moment');

// Enable Teamcity Reporter if a Teamcity environment is detected
if (process.env.TEAMCITY_VERSION) {
	const JasmineReporters = require('jasmine-reporters');
	const teamcity = new JasmineReporters.TeamCityReporter();
	jasmine.getEnv().addReporter(teamcity);
}
