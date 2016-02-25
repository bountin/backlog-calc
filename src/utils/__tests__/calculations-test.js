/* globals jest, expect, beforeEach, it */
jest.dontMock('../calculations');

const {
    isSuccessful,
    successDuration,
    successProbability,
    successBacklogSize,
} = require('../calculations');

describe('calculations', () => {

    describe('successProbability', () => {
        it('should return 100% for clearly successful projects', () => {
            expect(successProbability(17, 5, 1000)).toBe(1);
        });

        it('should return just above success for successful projects', () => {
            expect(successProbability(17, 5, 31)).toBeCloseTo(.82, 2);
        });

        it('should return just under success for unsuccessful projects', () => {
            expect(successProbability(17, 5, 30)).toBeCloseTo(.73, 2);
        });

        it('should almost return 0% for very unsuccessful projects', () => {
            expect(successProbability(27, 5, 35)).toBeCloseTo(.01, 2);
        });

        it('should return 0% for clearly unsuccessful projects', () => {
            expect(successProbability(1000, 5, 31)).toBe(0);
        });

        it('should return 100% despite an empty backlog', () => {
            expect(successProbability(0, 5, 31)).toBe(1, 2);
        });

        it('should return 0% without a velocity', () => {
            expect(successProbability(17, 0, 31)).toBe(0);
        });

        it('should return 0% without a duration', () => {
            expect(successProbability(17, 5, 0)).toBe(0);
        });
    });

    describe('isSuccessful', () => {
        it('should detect successful projects', () => {
            expect(isSuccessful(17, 5, 31)).toEqual(true);
        });

        it('should detect unsuccessful projects', () => {
            expect(isSuccessful(17, 5, 30)).toEqual(false);
        });

        it('should detect clearly successful projects', () => {
            expect(isSuccessful(17, 5, 1000)).toEqual(true);
        });

        it('should detect clearly unsuccessful projects', () => {
            expect(isSuccessful(1000, 5, 31)).toEqual(false);
        });

        it('should return true despite an empty backlog', () => {
            expect(isSuccessful(0, 5, 31)).toEqual(true);
        });

        it('should return false without a velocity', () => {
            expect(isSuccessful(17, 0, 31)).toEqual(false);
        });

        it('should return false without a duration', () => {
            expect(isSuccessful(17, 5, 0)).toEqual(false);
        });
    });

    describe('successDuration', () => {
        it('should calculate the correct duration', () => {
            expect(successDuration(17, 5)).toBe(31);
        });

        it('should calculate the correct duration for huge projects', () => {
            expect(successDuration(1000, 5)).toBe(1811);
        });

        it('should return a single day for instant projects', () => {
            expect(successDuration(1, 10)).toBe(1);
        });

        it('should return a zero days for an empty backlog', () => {
            expect(successDuration(0, 5)).toBe(0);
        });

        it('should return an infinite duration without a velocity', () => {
            expect(successDuration(17, 0)).toBe(Infinity);
        });
    });

    describe('maximumBacklogSize', () => {
        it('should calculate the correct backlog size', () => {
            expect(successBacklogSize(5, 31)).toBe(17);
        });

        it('should calculate the correct backlog size for huge projects', () => {
            expect(successBacklogSize(5, 1811)).toBe(1000);
        });

        it('should calculate the correct backlog size for single-day projects', () => {
            expect(successBacklogSize(10, 1)).toBe(1);
        });

        it('should return zero without a velocity', () => {
            expect(successBacklogSize(0, 31)).toBe(0);
        });

        it('should return zero without a duration', () => {
            expect(successBacklogSize(5, 0)).toBe(0);
        });
    });
});
