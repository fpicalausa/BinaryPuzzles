import { describe, expect, it, test } from 'vitest';
import { loadGameData } from '../models/loader.ts';
import {
    computeRunLength,
    guessAndCheck,
    GuessLastDigitWithLongRun,
} from './GuessLastDigitWithLongRun.ts';

test('computeRunLength', () => {
    expect(computeRunLength([0, 0, 1, 1, 0, 1, null, null])).toEqual({
        threeRunStart: [null, 5],
        counts: [3, 3],
    });

    expect(computeRunLength([0, 0, 1, 1, 0, 1, null, 0])).toEqual({
        threeRunStart: [null, null],
        counts: [4, 3],
    });

    expect(computeRunLength([0, 0, 1, null, null, null, null, 0])).toEqual({
        threeRunStart: [3, 2],
        counts: [3, 1],
    });

    expect(computeRunLength([null, 0, 1, null, null, null, null, 0])).toEqual({
        threeRunStart: [3, 2],
        counts: [2, 1],
    });
});

test('guessAndcheck', () => {
    expect(guessAndCheck([0, 0, 1, null, null, null, null, 0], 0, 2)).toEqual([
        3, 4,
    ]);

    expect(guessAndCheck([0, 0, 1, null, null, 0, null, null], 0, 2)).toEqual([
        6, 2,
    ]);

    expect(guessAndCheck([0, 0, 1, null, null, 0, 1, null], 0, 2)).toEqual([
        7, 2,
    ]);
});

describe('GuessLastDigitWithLongRun', () => {
    it('hints at avoiding three runs', () => {
        const state = loadGameData(
            [
                '001  0  ',
                '0       ',
                '1       ',
                '        ',
                '        ',
                '0       ',
                '        ',
                '        ',
            ].join('\n'),
        );

        const steps = new GuessLastDigitWithLongRun().findCandidates(state);

        console.error(JSON.stringify(steps));

        const expectedSteps = [
            expect.objectContaining({
                locations: [[0, 6]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[6, 0]],
                value: 1,
            }),
        ];

        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });
    it('hints at avoiding three runs (2)', () => {
        const state = loadGameData(
            [
                ' 1 0  0 ',
                '1  x  0 ',
                '  1  010',
                '    1 01',
                '    0110',
                ' 011001 ',
                '   0110 ',
                '11001010',
            ].join('\n'),
        );

        const steps = new GuessLastDigitWithLongRun().findCandidates(state);

        console.error(JSON.stringify(steps));

        const expectedSteps = [
            expect.objectContaining({
                locations: [[1, 3]],
                value: 1,
            }),
        ];

        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });
});
