//import { defineMessages } from 'react-intl';
import moment from 'moment';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';

function defineMessages(foo) { return foo }
const messages = defineMessages({
	startDateRequired : {
		id             : 'validators.startDateRequired',
		defaultMessage : 'Please choose a project start date.',
	},

	endDateRequired : {
		id             : 'validators.endDateRequired',
		defaultMessage : 'Please choose a project target date.',
	},

	endDate : {
		id             : 'validators.endDate',
		defaultMessage : 'The project target date must be after the start date.',
	},

	backlogSizePositive : {
		id             : 'validators.backlogSizePositive',
		defaultMessage : 'The backlog size must be a positive number.',
	},

	velocityPositive : {
		id             : 'validators.velocityPositive',
		defaultMessage : 'The velocity must be a positive number.',
	},

	velocityMax : {
		id             : 'validators.velocityMax',
		defaultMessage : 'The velocity must be smaller than the backlog size.',
	},
});

export function validateInputs(inputs) {
	const descriptor = {
		startDate : [
			[({ startDate }) => moment.isMoment(startDate), messages.startDateRequired],
		],

		endDate : [
			[({ endDate }) => moment.isMoment(endDate), messages.endDateRequired, true],
			[({ startDate, endDate }) => endDate.isAfter(startDate), messages.endDate]
		],

		backlogSize : [
			[({backlogSize}) => backlogSize > 0, messages.backlogSizePositive]
		],

		velocity : [
			[({velocity}) => velocity > 0, messages.velocityPositive],
			[({backlogSize, velocity}) => velocity <= backlogSize, messages.velocityMax]
		],
	};

	return runValidators(descriptor, inputs);
}

function runValidators(descriptor, inputs) {
	const errors = mapValues(descriptor, validators => {
		let messages = [];
		for (let [validate, message={}, abort=false] of validators) {
			if (validate(inputs)) {
				continue;
			}
			messages.push(message);
			if (abort) {
				break;
			}
		}
		return messages;
	});

	return pickBy(errors, errors => !!errors.length);
}
