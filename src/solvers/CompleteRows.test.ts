import { describe, expect, it } from 'vitest';
import { loadGameData } from '../models/loader.ts';
import { CompleteRows } from './CompleteRows.ts';

describe('CompleteRows', () => {
    it('complete rows half full', () => {
        const state = loadGameData(
            ['000   ', '      ', '      ', '      ', '      ', '      '].join(
                '\n',
            ),
        );

        const steps = new CompleteRows().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                locations: [
                    [0, 3],
                    [0, 4],
                    [0, 5],
                ],
                constraintCells: [
                    [0, 0],
                    [0, 1],
                    [0, 2],
                ],
                value: 1,
            }),
        ];

        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });

    it('complete columns half full', () => {
        const state = loadGameData(
            ['  0   ', '      ', '  0   ', '      ', '  0   ', '      '].join(
                '\n',
            ),
        );

        const steps = new CompleteRows().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                locations: [
                    [1, 2],
                    [3, 2],
                    [5, 2],
                ],
                constraintCells: [
                    [0, 2],
                    [2, 2],
                    [4, 2],
                ],
                value: 1,
            }),
        ];

        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });

    it('completes columns with a missing value full', () => {
        const state = loadGameData(
            ['      ', '00101 ', '      ', '      ', '      ', '      '].join(
                '\n',
            ),
        );

        const steps = new CompleteRows().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                locations: [[1, 5]],
                constraintCells: [
                    [1, 0],
                    [1, 1],
                    [1, 3],
                ],
                value: 1,
            }),
        ];

        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });
});
