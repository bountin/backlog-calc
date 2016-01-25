// All modern browsers, except `Safari`, have implemented
// the `ECMAScript Internationalization API`.
// see http://formatjs.io/guides/runtime-environments/#client
export default function patchIntl(run) {
	if (global.Intl) return run();
	require.ensure(['intl'], require => {
		require('intl');
		run();
	}, 'IntlBundle');
}
