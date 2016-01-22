jest.dontMock('../utils/calculations');
jest.dontMock('moment');

import moment from 'moment';
const {successfulProject, projectDuration} = require('../utils/calculations');

describe('Calculations', () => {
	it('calculates the same output with the example inputs', () => {
		expect(successfulProject(moment("2016-01-22"), moment("2016-02-22"), 5, 20)).toEqual(false);
	});
	it('should calculate success with modified inputs', () => {
		expect(successfulProject(moment("2016-01-22"), moment("2016-02-22"), 5, 17)).toEqual(true);
	});
	it('should calculate the correct date for valid input', () => {
		expect(projectDuration(moment("2016-01-22"), moment("2016-02-22"), 5, 20).isSame(moment("2016-02-27"))).toEqual(true);
	});
	it('should calculate the correct date for invalid input', () => {
		expect(projectDuration(moment("2016-01-22"), moment("2016-02-22"), 5, 17).isSame(moment("2016-02-21"))).toEqual(true);
	});
});
