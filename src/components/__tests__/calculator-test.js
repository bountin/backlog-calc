/* globals jest, expect, beforeEach, it */

jest.dontMock('../calculator');
jest.dontMock('../../utils/test-utils');

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('../../utils/test-utils');
const moment = require('moment');

const Calculator = require('../calculator');
const Results = require('../results').default;
const { isSuccessful, successDuration, successProbability, successBacklogSize } = require('../../utils/calculations');
const { validateInputs } = require('../../utils/validators');

describe('Calculator component', () => {

	let decorator, calculator, node;

	beforeEach(() => {
		TestUtils.mockComponent(Results);

		isSuccessful.mockClear();
		successDuration.mockClear();
		successProbability.mockClear();
		successBacklogSize.mockClear();
		validateInputs.mockClear();

		decorator = TestUtils.renderIntoDocument(<Calculator.default />);
		calculator = TestUtils.findRenderedComponentWithType(decorator, Calculator.Calculator);
		node = ReactDOM.findDOMNode(calculator);
	});

	it('should initialize the start and end date, but no other values', () => {
		const { inputs } = calculator.state;
		expect(inputs).not.toHaveMember('projectName');
		expect(inputs).toHaveMoment('startDate');
		expect(inputs).toHaveMomentAfter('endDate', inputs.startDate);
		expect(inputs).not.toHaveMember('velocity');
		expect(inputs).not.toHaveMember('backlogSize');
	});

	it('should not display results initially', () => {
		expect(TestUtils.scryRenderedComponentsWithType(calculator, Results)).toBeEmptyArray();
	});

	it('should hide results when the user types', () => {
		const results = {
			isSuccessful   : true,
			completionDate : moment(),
			probability    : 0.8,
			backlogSize    : 100,
		};

		calculator.setState({ results });
		TestUtils.enterTextIntoComponentInput(calculator.refs.projectName, 'Test project');
		expect(TestUtils.scryRenderedComponentsWithType(calculator, Results)).toBeEmptyArray();

		calculator.setState({ results });
		TestUtils.enterTextIntoComponentInput(calculator.refs.startDate, '2016-01-01');
		expect(TestUtils.scryRenderedComponentsWithType(calculator, Results)).toBeEmptyArray();

		calculator.setState({ results });
		TestUtils.enterTextIntoComponentInput(calculator.refs.endDate, '2016-02-01');
		expect(TestUtils.scryRenderedComponentsWithType(calculator, Results)).toBeEmptyArray();

		calculator.setState({ results });
		TestUtils.enterTextIntoComponentInput(calculator.refs.velocity, '7');
		expect(TestUtils.scryRenderedComponentsWithType(calculator, Results)).toBeEmptyArray();

		calculator.setState({ results });
		TestUtils.enterTextIntoComponentInput(calculator.refs.backlogSize, '15');
		expect(TestUtils.scryRenderedComponentsWithType(calculator, Results)).toBeEmptyArray();
	});

	it('should parse user inputs from input boxes', () => {
		calculator.setState({ inputs : {} });
		TestUtils.enterTextIntoComponentInput(calculator.refs.projectName, 'Test project');
		expect(calculator.state.inputs.projectName).toBe('Test project');

		calculator.setState({ inputs : {} });
		TestUtils.enterTextIntoComponentInput(calculator.refs.startDate, '2016-01-01');
		expect(calculator.state.inputs.startDate).toBeSameMoment('2016-01-01');

		calculator.setState({ inputs : {} });
		TestUtils.enterTextIntoComponentInput(calculator.refs.endDate, '2016-02-01');
		expect(calculator.state.inputs.endDate).toBeSameMoment('2016-02-01');

		calculator.setState({ inputs : {} });
		TestUtils.enterTextIntoComponentInput(calculator.refs.velocity, '7');
		expect(calculator.state.inputs.velocity).toBe(7);

		calculator.setState({ inputs : {} });
		TestUtils.enterTextIntoComponentInput(calculator.refs.backlogSize, '15');
		expect(calculator.state.inputs.backlogSize).toBe(15);
	});

	it('should recalculate when submitting the form', () => {
		const recalculate = TestUtils.mockComponentMethod(calculator, '_recalculate');

		const form = TestUtils.findRenderedDOMComponentWithTag(calculator, 'form');
		TestUtils.Simulate.submit(form);

		expect(recalculate).toBeCalled();
	});

	it('should validate all input data upon recalculating', () => {
		const inputs = {
			projectName : 'Test project',
			startDate   : moment().add(42, 'days'),
			endDate     : moment().add(4711, 'days'),
			velocity    : 17,
			backlogSize : 21,
		};

		validateInputs.mockReturnValue({});
		calculator.setState({ inputs });
		calculator._recalculate(new Event(''));

		expect(validateInputs).lastCalledWith(inputs);
	});

	it('should calculate results if validation succeeds', () => {
		const inputs = {
			projectName : 'Test project',
			startDate   : moment().add(42, 'days'),
			endDate     : moment().add(84, 'days'),
			velocity    : 17,
			backlogSize : 21,
		};

		validateInputs.mockReturnValue({});
		calculator.setState({ inputs });
		calculator._recalculate(new Event(''));

		expect(isSuccessful).toBeCalledWith(21, 17, 42);
		expect(successProbability).toBeCalledWith(21, 17, 42);
		expect(successDuration).toBeCalledWith(21, 17);
		expect(successBacklogSize).toBeCalledWith(17, 42);
	});

	it('should display results after recalculating successfully', () => {
		validateInputs.mockReturnValue({});
		isSuccessful.mockReturnValue(true);
		successProbability.mockReturnValue(0.9);
		successDuration.mockReturnValue(21);
		successBacklogSize.mockReturnValue(100);

		calculator._recalculate(new Event(''));

		const { results, inputs } = calculator.state;
		expect(results.isSuccessful).toBe(true);
		expect(results.probability).toBe(0.9);
		expect(inputs.startDate.diff(results.completionDate, 'days')).toBe(-21);
		expect(results.backlogSize).toBe(100);
	});

	it('should pass results properly to the results component', () => {
		const results = {
			isSuccessful : true,
			probability: 0.9,
			completionDate: moment(),
			backlogSize : 100,
		};

		calculator.setState({ results });
		const resultsComponent = TestUtils.findRenderedComponentWithType(calculator, Results);
		expect(resultsComponent.props).toEqual(results);
	});

	it('should calculate the proper project duration when changing the start date', () => {
		const startDate = calculator.state.inputs.endDate.clone().subtract(42, 'days');
		TestUtils.enterTextIntoComponentInput(calculator.refs.startDate, startDate.format('YYYY-MM-DD'));

		validateInputs.mockReturnValue({});
		calculator._recalculate(new Event(''));

		expect(isSuccessful).toBeCalledWith(NaN, NaN, 42);
		expect(successProbability).toBeCalledWith(NaN, NaN, 42);
	});

	it('should calculate the proper project duration when changing the end date', () => {
		const endDate = calculator.state.inputs.startDate.clone().add(42, 'days');
		TestUtils.enterTextIntoComponentInput(calculator.refs.endDate, endDate.format('YYYY-MM-DD'));

		validateInputs.mockReturnValue({});
		calculator._recalculate(new Event(''));

		expect(isSuccessful).toBeCalledWith(NaN, NaN, 42);
		expect(successProbability).toBeCalledWith(NaN, NaN, 42);
	});

	it('should not calculate results if validation fails', () => {
		const errorMessage = { id : 'foo', defaultMessage : 'bar' };
		validateInputs.mockReturnValue({
			startDate   : [errorMessage],
			endDate     : [errorMessage],
			velocity    : [errorMessage],
			backlogSize : [errorMessage],
		});

		calculator.setState({ inputs : {} });
		calculator._recalculate(new Event(''));

		expect(isSuccessful).not.toBeCalled();
		expect(successDuration).not.toBeCalled();
		expect(successProbability).not.toBeCalled();
		expect(successBacklogSize).not.toBeCalled();
	});

	it('should carry over error messages if validation fails', () => {
		const errorMessage = { id : 'foo', defaultMessage : 'bar' };
		const errors = {
			startDate   : [errorMessage],
			endDate     : [errorMessage],
			velocity    : [errorMessage],
			backlogSize : [errorMessage],
		};

		validateInputs.mockReturnValue(errors);
		calculator.setState({ inputs : {} });
		calculator._recalculate(new Event(''));

		expect(calculator.state.errors).toEqual(errors);
	});

	it('should clear errors if validation succeeds', () => {
		const errorMessage = { id : 'foo', defaultMessage : 'bar' };
		const errors = {
			startDate   : [errorMessage],
			endDate     : [errorMessage],
			velocity    : [errorMessage],
			backlogSize : [errorMessage],
		};

		calculator.setState({ errors });
		validateInputs.mockReturnValue({});
		calculator._recalculate(new Event(''));

		expect(calculator.state.errors).toBeEmptyObject();
	});

});
