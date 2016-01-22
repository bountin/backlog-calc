jest.dontMock('../calculations');
jest.dontMock('moment');

import moment from 'moment';
const {successfulProject, projectDuration, successProbability, maximalBacklogSize} = require('../calculations');

describe('calculations', () => {
	describe('successfulProject', () => {
		it('calculates the same output with the example inputs', () => {
			expect(successfulProject(moment("2016-01-22"), moment("2016-02-22"), 5, 20)).toEqual(false);
		});
		it('should calculate success with modified inputs', () => {
			expect(successfulProject(moment("2016-01-22"), moment("2016-02-22"), 5, 17)).toEqual(true);
		});
	});

	describe('projectDuration', () => {
		it('should calculate the correct date for valid input', () => {
			expect(projectDuration(moment("2016-01-22"), moment("2016-02-22"), 5, 20).isSame(moment("2016-02-27"))).toEqual(true);
		});
		it('should calculate the correct date for invalid input', () => {
			expect(projectDuration(moment("2016-01-22"), moment("2016-02-22"), 5, 17).isSame(moment("2016-02-21"))).toEqual(true);
		});
	});

	describe('successProbability', () => {
		it('should be quite sure', () => {
			expect(successProbability(moment("2015-11-24"), moment("2016-06-17"), 10, 200)).toBeCloseTo(1, 0.005);
		});
		it('should be a bit positive', () => {
			expect(successProbability(moment("2015-11-24"), moment("2016-03-10"), 9, 108)).toBeCloseTo(.82, 0.005);
		});
		it('should be a bit negative', () => {
			expect(successProbability(moment("2015-11-24"), moment("2016-06-17"), 8, 200)).toBeCloseTo(.50, 0.005);
		});
		it('should be quite devastating', () => {
			expect(successProbability(moment("2015-11-24"), moment("2016-06-17"), 10, 300)).toBeCloseTo(.05, 0.005);
		});
	});

	describe('maximalBacklogSize', () => {
		it('should calculate back from invalid projects', () => {
			expect(maximalBacklogSize(moment("2015-11-24"), moment("2016-03-10"), 9, 120)).toEqual(108);
		});
		it('should calculate forward from valid projects', () => {
			expect(maximalBacklogSize(moment("2015-11-24"), moment("2016-03-10"), 9, 100)).toEqual(108);
		});
		it('should calculate back from invalid projects too', () => {
			expect(maximalBacklogSize(moment("2015-12-24"), moment("2016-04-30"), 8, 130)).toEqual(115);
		});
		it('should calculate forward from valid projects too', () => {
			expect(maximalBacklogSize(moment("2015-12-24"), moment("2016-04-30"), 8, 100)).toEqual(115);
		});
	});
});
