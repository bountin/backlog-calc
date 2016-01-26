/*globals jasmine*/
jasmine.VERBOSE = true;

require('jasmine-expect');
let jasmineReporters = require('jasmine-reporters');

// Enable Teamcity Reporter if a Teamcity environment is detected
if (process.env.TEAMCITY_VERSION) {
	var teamcity = new jasmineReporters.TeamCityReporter();
	jasmine.getEnv().addReporter(teamcity);
}
