import { describe, expect, it } from 'vitest';
import { loadGameData } from '../models/loader.ts';
import { SplitRuns } from './SplitRuns.ts';

describe('SplitRuns', () => {
    it('splits horizontal runs', () => {
        const state = loadGameData(
            ['      ', '  0 0 ', '      ', ' 1 1  ', '      ', '      '].join(
                '\n',
            ),
        );

        const steps = new SplitRuns().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                location: [1, 3],
                constraintCells: [
                    [1, 2],
                    [1, 4],
                ],
                value: 1,
            }),
            expect.objectContaining({
                location: [3, 2],
                constraintCells: [
                    [3, 1],
                    [3, 3],
                ],
                value: 0,
            }),
        ];

        expect(steps.length).toBe(expectedSteps.length);
        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });

    it('splits vertical runs', () => {
        const state = loadGameData(
            ['      ', ' 0  1 ', '      ', ' 0  1 ', '      ', '      '].join(
                '\n',
            ),
        );

        const steps = new SplitRuns().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                location: [2, 1],
                constraintCells: [
                    [1, 1],
                    [3, 1],
                ],
                value: 1,
            }),
            expect.objectContaining({
                location: [2, 4],
                constraintCells: [
                    [1, 4],
                    [3, 4],
                ],
                value: 0,
            }),
        ];

        expect(steps.length).toBe(expectedSteps.length);
        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });
    it('splits runs at edge', () => {
        console.error('hello');
        const state = loadGameData(['0 0 ', '   0', '0  ', ' 0 0'].join('\n'));

        const steps = new SplitRuns().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                location: [0, 1],
            }),
            expect.objectContaining({
                location: [1, 0],
            }),
            expect.objectContaining({
                location: [3, 2],
            }),
            expect.objectContaining({
                location: [2, 3],
            }),
        ];

        expect(steps.length).toBe(expectedSteps.length);
        expectedSteps.every((expectedStep, index) => {
            expect(steps[index]).toEqual(expectedStep);
        });
    });
});
