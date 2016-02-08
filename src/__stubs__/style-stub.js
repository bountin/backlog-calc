/**
 * @providesModule style-stub
 */

import 'harmony-reflect';
export default new Proxy({}, {
	get : (target, name) => target[name] = target[name] || name + Math.random()
});
