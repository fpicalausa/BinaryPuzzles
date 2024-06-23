import { describe, expect, it } from 'vitest';
import { loadGameData } from '../models/loader.ts';
import { TerminateRuns } from './TerminateRuns.ts';
import { stateToString } from '../models/exporter.ts';

describe('TerminateRuns', () => {
    it('terminates runs', () => {
        const state = loadGameData(['    ', ' 00 ', ' 00 ', '    '].join('\n'));

        const steps = new TerminateRuns().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                locations: [[0, 1]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[0, 2]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[1, 0]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[2, 0]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[3, 1]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[3, 2]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[1, 3]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[2, 3]],
                value: 1,
            }),
        ];

        expect(steps.length).toBe(expectedSteps.length);
        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps).toContainEqual(expectedSteps[i]);
        }
    });

    it('terminates runs at the border', () => {
        const state = loadGameData(
            ['00  00', '0    0', '      ', '      ', '1    1', '11  11'].join(
                '\n',
            ),
        );

        const steps = new TerminateRuns().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                locations: [[0, 2]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[0, 3]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[2, 0]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[2, 5]],
                value: 1,
            }),
            expect.objectContaining({
                locations: [[3, 0]],
                value: 0,
            }),
            expect.objectContaining({
                locations: [[3, 5]],
                value: 0,
            }),
            expect.objectContaining({
                locations: [[5, 2]],
                value: 0,
            }),
            expect.objectContaining({
                locations: [[5, 3]],
                value: 0,
            }),
        ];

        expect(steps.length).toBe(expectedSteps.length);
        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps).toContainEqual(expectedSteps[i]);
        }
    });
});
