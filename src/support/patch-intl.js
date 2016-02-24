/**
 * All modern browsers, except `Safari`, have implemented the
 * `ECMAScript Internationalization API`. This loads the Intl
 * polyfill for Safari and executes run on Success. For all
 * other browsers, it executes run immediately.
 *
 * @param {Function} run - A callback to run after patching Intl.
 * @returns {undefined}
 * @see http://formatjs.io/guides/runtime-environments/#client
 */
export default function patchIntl(run) {
	if (global.Intl) return run();
	require.ensure([], require => {
		require('intl');
		require('intl/locale-data/jsonp/en.js');
		require('intl/locale-data/jsonp/de.js');
		run();
	}, 'IntlBundle');
	/* eslint consistent-return:0 */
}
