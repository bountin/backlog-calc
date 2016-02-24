var KEY_PREFIX = 'Webpack';

function TeamCityWebpackPlugin(options) {
	this.options = Object.assign({
		bail: true,
		disable: false,
		stats: true
	}, options);
}

TeamCityWebpackPlugin.prototype.apply = function (compiler) {
	var options = this.options;

	if (options.disable) {
		return;
	}

	compiler.plugin('done', function (compilation) {
		if (options.stats) {
			var time = compilation.endTime - compilation.startTime;
			tclog('buildStatisticValue', { key: KEY_PREFIX + 'BuildDuration', value: time });
		}

		if (options.bail && compilation.errors && compilation.errors.length) {
			process.on('beforeExit', function() { process.exit(1) });
		}
	});
};

//
// TEAM CITY LOGGING
// Taken from jasmine-reporter's TeamCityReporter
// Author: Larry Myers
//

function pad(n) { return n < 10 ? '0'+n : n; }
function padThree(n) { return n < 10 ? '00'+n : n < 100 ? '0'+n : n; }

function ISODateString(d) {
	return d.getUTCFullYear() + '-' +
		pad(d.getUTCMonth()+1) + '-' +
		pad(d.getUTCDate()) + 'T' +
		pad(d.getUTCHours()) + ':' +
		pad(d.getUTCMinutes()) + ':' +
		pad(d.getUTCSeconds()) + '.' +
			// TeamCity wants ss.SSS
		padThree(d.getUTCMilliseconds());
}

function log(str) {
	var con = global.console || console;
	if (con && con.log) {
		con.log(str);
	}
}

// shorthand for logging TeamCity messages
function tclog(message, attrs) {
	var str = '##teamcity[' + message;
	if (typeof(attrs) === 'object') {
		if (!('timestamp' in attrs)) {
			attrs.timestamp = new Date();
		}
		for (var prop in attrs) {
			if (attrs.hasOwnProperty(prop)) {
				str += ' ' + prop + "='" + escapeTeamCityString(String(attrs[prop])) + "'";
			}
		}
	}
	str += ']';
	log(str);
}

function escapeTeamCityString(str) {
	if(!str) {
		return '';
	}
	if (Object.prototype.toString.call(str) === '[object Date]') {
		return ISODateString(str);
	}

	return str.replace(/\|/g, '||')
		.replace(/\'/g, "|'")
		.replace(/\n/g, '|n')
		.replace(/\r/g, '|r')
		.replace(/\u0085/g, '|x')
		.replace(/\u2028/g, '|l')
		.replace(/\u2029/g, '|p')
		.replace(/\[/g, '|[')
		.replace(/]/g, '|]');
}

module.exports = TeamCityWebpackPlugin;
