// All modern browsers, except `Safari`, have implemented
// the `ECMAScript Internationalization API`.
// see http://formatjs.io/guides/runtime-environments/#client
export default function patchIntl(run) {
	if (global.Intl) return run();
	require.ensure([], require => {
		require('intl');
		require('intl/locale-data/jsonp/en.js');
		require('intl/locale-data/jsonp/de.js');
		run();
	}, 'IntlBundle');
}
