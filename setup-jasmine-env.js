/*globals jasmine*/
jasmine.VERBOSE = true;

require('jasmine-expect');
require('./src/jasmine-expect-moment');
require('./src/jasmine-expect-react');

// Enable Teamcity Reporter if a Teamcity environment is detected
if (process.env.TEAMCITY_VERSION) {
	const JasmineReporters = require('jasmine-reporters');
	const teamcity = new JasmineReporters.TeamCityReporter();
	jasmine.getEnv().addReporter(teamcity);
}
