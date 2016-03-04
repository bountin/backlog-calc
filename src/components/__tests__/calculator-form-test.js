/* globals jest, expect, beforeEach, it */

jest.dontMock('../calculator-form');
jest.dontMock('../../utils/test-utils');

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('../../utils/test-utils');
const moment = require('moment');

const CalculatorForm = require('../calculator-form');
const FormattedMultiLine = require('../formatted-multi-line').default;
const { validateInputs } = require('../../utils/validators');

describe('Calculator Form component', () => {

    let decorator, calculatorForm, node;

    beforeEach(() => {
        TestUtils.mockComponent(FormattedMultiLine);

        validateInputs.mockClear();

        decorator = TestUtils.renderIntoDocument(<CalculatorForm.default project={{}}/>);
        calculatorForm = TestUtils.findRenderedComponentWithType(decorator, CalculatorForm.CalculatorForm);
        node = ReactDOM.findDOMNode(calculatorForm);
    });

    it('should initialize the start and end date, but no other values', () => {
        const { inputs } = calculatorForm.state;
        expect(inputs).not.toHaveMember('projectName');
        expect(inputs).not.toHaveMoment('startDate');
        expect(inputs).not.toHaveMoment('endDate');
        expect(inputs).not.toHaveMember('velocity');
        expect(inputs).not.toHaveMember('backlogSize');
    });

    it('should not display results initially', () => {
        expect(TestUtils.scryRenderedComponentsWithType(calculatorForm)).toBeEmptyArray();
    });

    it('should parse user inputs from input boxes', () => {
        calculatorForm.setState({ inputs: {} });
        TestUtils.enterTextIntoComponentInput(calculatorForm.refs.projectName, 'Test project');
        expect(calculatorForm.state.inputs.projectName).toBe('Test project');

        calculatorForm.setState({ inputs: {} });
        TestUtils.enterTextIntoComponentInput(calculatorForm.refs.startDate, '2016-01-01');
        expect(calculatorForm.state.inputs.startDate).toBeSameMoment('2016-01-01');

        calculatorForm.setState({ inputs: {} });
        TestUtils.enterTextIntoComponentInput(calculatorForm.refs.endDate, '2016-02-01');
        expect(calculatorForm.state.inputs.endDate).toBeSameMoment('2016-02-01');

        calculatorForm.setState({ inputs: {} });
        TestUtils.enterTextIntoComponentInput(calculatorForm.refs.velocity, '7');
        expect(calculatorForm.state.inputs.velocity).toBe(7);

        calculatorForm.setState({ inputs: {} });
        TestUtils.enterTextIntoComponentInput(calculatorForm.refs.backlogSize, '15');
        expect(calculatorForm.state.inputs.backlogSize).toBe(15);
    });

    /*
    it('should handleFormSubmit when submitting the form', () => {
        const handleFormSubmit = TestUtils.mockComponentMethod(calculatorForm, 'handleFormSubmit');

        const form = TestUtils.findRenderedDOMComponentWithTag(calculatorForm, 'form');
        TestUtils.Simulate.submit(form);

        expect(handleFormSubmit).toBeCalled();
    });

    it('should validate all input data upon recalculating', () => {
        const inputs = {
            projectName: 'Test project',
            startDate: moment().add(42, 'days'),
            endDate: moment().add(4711, 'days'),
            velocity: 17,
            backlogSize: 21,
        };

        validateInputs.mockReturnValue({});
        calculatorForm.setState({ inputs });

        expect(validateInputs).lastCalledWith(inputs);
    });

    it('should calculate results if validation succeeds', () => {
        const inputs = {
            projectName: 'Test project',
            startDate: moment().add(42, 'days'),
            endDate: moment().add(84, 'days'),
            velocity: 17,
            backlogSize: 21,
        };

        validateInputs.mockReturnValue({});
        calculatorForm.setState({ inputs });
    });

    it('should display results after recalculating successfully', () => {
        validateInputs.mockReturnValue({});

        calculatorForm.recalculate(new Event(''));

        const { results, inputs } = calculatorForm.state;
        expect(results.isSuccessful).toBe(true);
        expect(results.probability).toBe(0.9);
        expect(inputs.startDate.diff(results.completionDate, 'days')).toBe(-21);
        expect(results.backlogSize).toBe(100);
    });

    it('should pass results properly to the results component', () => {
        const results = {
            isSuccessful: true,
            probability: 0.9,
            completionDate: moment(),
            backlogSize: 100,
        };

        calculatorForm.setState({ results });
        const resultsComponent = TestUtils.findRenderedComponentWithType(calculatorForm, Results);
        expect(resultsComponent.props).toEqual(results);
    });

    it('should calculate the proper project duration when changing the start date', () => {
        const startDate = calculatorForm.state.inputs.endDate.clone().subtract(42, 'days');
        TestUtils.enterTextIntoComponentInput(calculatorForm.refs.startDate, startDate.format('YYYY-MM-DD'));

        validateInputs.mockReturnValue({});
    });

    it('should calculate the proper project duration when changing the end date', () => {
        const endDate = calculatorForm.state.inputs.startDate.clone().add(42, 'days');
        TestUtils.enterTextIntoComponentInput(calculatorForm.refs.endDate, endDate.format('YYYY-MM-DD'));

        validateInputs.mockReturnValue({});
    });

    it('should not calculate results if validation fails', () => {
        const errorMessage = { id: 'foo', defaultMessage: 'bar' };
        validateInputs.mockReturnValue({
            startDate: [errorMessage],
            endDate: [errorMessage],
            velocity: [errorMessage],
            backlogSize: [errorMessage],
        });

        calculatorForm.setState({ inputs: {} });
    });

    it('should carry over error messages if validation fails', () => {
        const errorMessage = { id: 'foo', defaultMessage: 'bar' };
        const errors = {
            startDate: [errorMessage],
            endDate: [errorMessage],
            velocity: [errorMessage],
            backlogSize: [errorMessage],
        };

        validateInputs.mockReturnValue(errors);
        calculatorForm.setState({ inputs: {} });

        expect(calculatorForm.state.errors).toEqual(errors);
    });

    it('should clear errors if validation succeeds', () => {
        const errorMessage = { id: 'foo', defaultMessage: 'bar' };
        const errors = {
            startDate: [errorMessage],
            endDate: [errorMessage],
            velocity: [errorMessage],
            backlogSize: [errorMessage],
        };

        calculatorForm.setState({ errors });
        validateInputs.mockReturnValue({});

        expect(calculatorForm.state.errors).toBeEmptyObject();
    });
*/
});
