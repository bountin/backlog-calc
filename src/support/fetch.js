//
// restful.js requires "Headers" to be iterable which is not defined by the standard.
// Polyfills usually include this functionality but won't be activated if the browser
// already provides an implementation.
//
// To override this behavior, we check whether forEach is implemented. If not, the
// native "fetch" implementation is deleted to activate the polyfill.
//
// See `npm info whatwg-fetch` for more information on the polyfill.
//
if (window.Headers && !window.Headers.prototype.forEach)
	delete window.fetch;
