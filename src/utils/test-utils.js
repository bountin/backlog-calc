const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');

/**
 * Wrapper for React's TestUtils with convenient and a bit more advanced helpers.
 */
const TestUtils = {

	/**
	 * Mocks the given component and makes sure jasmine is able to pretty-print
	 * it. This modifies the given component class! The component must be
	 * obtained via require in a JEST context.
	 *
	 * @param {Class} componentClass - A mocked component constructor.
	 */
	mockComponent(componentClass) {
		ReactTestUtils.mockComponent(componentClass);
		componentClass.prototype.jasmineToString = React.Component.prototype.jasmineToString;
	},

	/**
	 * Injects the given input into the component's input element and simulates
	 * the onChange event.
	 *
	 * This method will fail if the component is not rendered into the DOM. Make
	 * sure to fetch the component via renderIntoDocument, obtain it from some
	 * rendered component's refs, or via findRenderedComponentWithType.
	 *
	 * @param {Component} component - A rendered component containing the target
	 * input element.
	 *
	 * @param {string} text - Text to enter into the component's input element.
	 * The text will not be typed in with keystrokes, but rather injected
	 * atomically.
	 */
	enterTextIntoComponentInput(component, text) {
		const input = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'input');
		input.value = text;
		ReactTestUtils.Simulate.change(input);
	},

	/**
	 * Mocks the method of an existing component using JEST. The method is
	 * irreversibly replaced by this method. To restore the original method
	 * afterwards, either store the original reference or create a new instance.
	 *
	 * If no method exists with the given name, it is created.
	 *
	 * @param {Component} component - A component containing the method to mock.
	 * @param {string} methodName - The name of the method to mock.
	 *
	 * @returns {Function} The mocked component method.
	 */
	mockComponentMethod(component, methodName) {
		const mock = component[methodName] = jest.genMockFn();
		component.forceUpdate();
		return mock;
	},

};

module.exports = Object.assign({}, ReactTestUtils, TestUtils);
