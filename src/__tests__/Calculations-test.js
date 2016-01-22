jest.dontMock('../utils/calculations');
jest.dontMock('moment');

import moment from 'moment';
const successfulProject = require('../utils/calculations').default;

describe('Calculations', () => {
	it('calculates the same output with the example inputs', () => {
		expect(successfulProject(moment("2015-11-24"), moment("2016-06-17"), 9, 200)).toEqual(false);
	})
});
