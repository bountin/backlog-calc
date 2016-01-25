/* globals jest, expect, beforeEach, it */
jest.dontMock('../validators');

import moment from 'moment';
const { validateInputs } = require('../validators');

describe('input validation', () => {

	let inputs;

	beforeEach(() => {
		inputs = {
			startDate   : moment(),
			endDate     : moment().add(1, 'month'),
			backlogSize : 17,
			velocity    : 5,
		};
	});

	it('should accept valid inputs', () => {
		expect(validateInputs(inputs)).toEqual({});
	});

	it('should reject an empty end date', () => {
		inputs.startDate = undefined;
		const errors = validateInputs(inputs);
		expect(errors).toHaveArray('startDate');
		expect(errors.startDate.map(e => e.id)).toContain('validators.startDateRequired');
	});

	it('should reject an empty end date', () => {
		inputs.endDate = undefined;
		const errors = validateInputs(inputs);
		expect(errors).toHaveArray('endDate');
		expect(errors.endDate.map(e => e.id)).toContain('validators.endDateRequired');
	});

	it('should reject an end date before the start date', () => {
		inputs.endDate = inputs.startDate.clone().subtract(1, 'days');
		const errors = validateInputs(inputs);
		expect(errors).toHaveArray('endDate');
		expect(errors.endDate.map(e => e.id)).toContain('validators.endDate');
	});

	it('should reject a negative backlog size', () => {
		inputs.backlogSize = -42;
		const errors = validateInputs(inputs);
		expect(errors).toHaveArray('backlogSize');
		expect(errors.backlogSize.map(e => e.id)).toContain('validators.backlogSizePositive');
	});

	it('should reject backlog size of zero', () => {
		inputs.backlogSize = 0;
		const errors = validateInputs(inputs);
		expect(errors).toHaveArray('backlogSize');
		expect(errors.backlogSize.map(e => e.id)).toContain('validators.backlogSizePositive');
	});

	it('should reject a negative velocity', () => {
		inputs.velocity = -42;
		const errors = validateInputs(inputs);
		expect(errors).toHaveArray('velocity');
		expect(errors.velocity.map(e => e.id)).toContain('validators.velocityPositive');
	});

	it('should reject a velocity of zero', () => {
		inputs.velocity = 0;
		const errors = validateInputs(inputs);
		expect(errors).toHaveArray('velocity');
		expect(errors.velocity.map(e => e.id)).toContain('validators.velocityPositive');
	});

	it('should reject a velocity bigger than the backlog', () => {
		inputs.velocity = inputs.backlogSize + 1;
		const errors = validateInputs(inputs);
		expect(errors).toHaveArray('velocity');
		expect(errors.velocity.map(e => e.id)).toContain('validators.velocityMax');
	});

	it('should accept a velocity equal to the backlog size', () => {
		inputs.velocity = inputs.backlogSize;
		expect(validateInputs(inputs).velocity).toBeFalsy();
	});

});
