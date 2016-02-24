import { defineMessages } from 'react-intl';
import moment from 'moment';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';

const messages = defineMessages({
	startDateRequired: {
		id: 'validators.startDateRequired',
		defaultMessage: 'Please choose a project start date.',
	},

	endDateRequired: {
		id: 'validators.endDateRequired',
		defaultMessage: 'Please choose a project target date.',
	},

	endDate: {
		id: 'validators.endDate',
		defaultMessage: 'The project target date must be after the start date.',
	},

	backlogSizePositive: {
		id: 'validators.backlogSizePositive',
		defaultMessage: 'The backlog size must be a positive number.',
	},

	velocityPositive: {
		id: 'validators.velocityPositive',
		defaultMessage: 'The velocity must be a positive number.',
	},

	velocityMax: {
		id: 'validators.velocityMax',
		defaultMessage: 'The velocity must be smaller than the backlog size.',
	},
});

/**
 * Validates backlog calculator inputs.
 *
 *  - startDate: Must be present
 *  - endDate: Must be present and after the start date.
 *  - backlogSize: Must be a number greater than zero.
 *  - velocity: Must be a number greater than zero and lower than the backlog size.
 *
 * @param {object} inputs - An object containing all inputs from the calculator.
 *
 * @returns {object} An object containing arrays of errors for each input.
 * Valid inputs are not present in the errors object. If the errors object is
 * empty, all inputs were valid.
 */
export function validateInputs(inputs) {
	const descriptor = {
		startDate: [
			[({ startDate }) => moment.isMoment(startDate), messages.startDateRequired],
		],

		endDate: [
			[({ endDate }) => moment.isMoment(endDate), messages.endDateRequired, true],
			[({ startDate, endDate }) => endDate.isAfter(startDate), messages.endDate],
		],

		backlogSize: [
			[({ backlogSize }) => backlogSize > 0, messages.backlogSizePositive],
		],

		velocity: [
			[({ velocity }) => velocity > 0, messages.velocityPositive],
			[({ backlogSize, velocity }) => velocity <= backlogSize, messages.velocityMax],
		],
	};

	return runValidators(descriptor, inputs);
}

/**
 * Runs a set of validators over the given inputs.
 *
 * Validators are specified within the descriptor object. For every input
 * property, the descriptor contains an array of validators:
 *
 * {
 *   input1: [ validator1, validator2, ... ],
 *   input2: [ validator3, validator4, ... ],
 *   ...
 * }
 *
 * Each validator is an array containing:
 *  - callback: Invoked with all inputs, returns whether the field is valid
 *  - message (optional): Error message, if the callback returned false
 *  - bail (optional): Skip to the next input, if the callback returned false
 *
 * The order at which inputs are checked is implementation defined. All
 * validators are called, even if the respective input field is undefined. The
 * runner executes all validators for an input in the specified order. Unless
 * bail is set to true, every validator is executed once. Otherwise, a validator
 * is only executed if all previous validators returned true.
 *
 * All error messages are collected in an error object with the same keys as
 * the respective input properties. The error object only contains entries for
 * inputs with errors. If the error object is empty, all inputs were valid.
 *
 * {
 *   input2: [ "error1", "error2" ],
 * }
 *
 * @param {object} descriptor - The validation descriptor.
 * @param {object} inputs - An object containing inputs.
 *
 * @returns {object} An object containing arrays of errors for each input.
 * Valid inputs are not present in the errors object. If the errors object is
 * empty, all inputs were valid.
 */
function runValidators(descriptor, inputs) {
	const errors = mapValues(descriptor, validators => {
		const errorMessages = [];
		for (const [validate, message = {}, abort = false] of validators) {
			if (!validate || validate(inputs)) continue;
			errorMessages.push(message);
			if (abort) break;
		}
		return errorMessages;
	});

	return pickBy(errors, e => !!e.length);
}
