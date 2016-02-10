const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');

const TestUtils = {

	/**
	 *
	 * @param componentClass
	 */
	mockComponent(componentClass) {
		ReactTestUtils.mockComponent(componentClass);
		componentClass.prototype.jasmineToString = React.Component.prototype.jasmineToString;
	},

	/**
	 *
	 * @param component
	 * @param text
	 */
	enterTextIntoComponentInput(component, text) {
		const input = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'input');
		input.value = text;
		ReactTestUtils.Simulate.change(input);
	},

	/**
	 *
	 * @param component
	 * @param methodName
	 * @returns {*}
	 */
	mockComponentMethod(component, methodName) {
		const mock = component[methodName] = jest.genMockFn();
		component.forceUpdate();
		return mock;
	},

};

module.exports = Object.assign({}, ReactTestUtils, TestUtils);
