
jest.dontMock('../validators');

import moment from 'moment';
const {validateProjectDates, validateBacklogSize} = require('../validators');

describe('validators', () => {
    describe ('validateProjectDates', () => {
        it('should accept a valid input', () => {
            let result = validateProjectDates(moment("2015-01-04"), moment("2015-10-31"));

            expect(result).toEqual(true);
        });
        it('should not accept an invalid input', () => {
            let result = validateProjectDates(moment("2016-01-01"), moment("2015-01-01"));

            expect(result).toEqual(false);
        });
    });

    describe ('validateBacklogSize', () => {
        it('should not allow negative backlog size', () => {
            expect(validateBacklogSize(-42, 2)).toEqual(false);
        });
        it('should not allow negative weekly performance', () => {
            expect(validateBacklogSize(42, -3)).toEqual(false);
        });
        it('should not allow a zero performance', () => {
            expect(validateBacklogSize(42, 0)).toEqual(false);
        });
        it('should not allow a performance that is bigger than the total workload', () => {
            expect(validateBacklogSize(42, 60)).toEqual(false);
        });
        it('should allow at least something', () => {
            expect(validateBacklogSize(200, 14)).toEqual(true);
        });
    });
});
