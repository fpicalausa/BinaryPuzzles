import { describe, expect, it } from 'vitest';
import { loadGameData } from '../models/loader.ts';
import { stateToString } from '../models/exporter.ts';
import { TerminateRuns } from './TerminateRuns.ts';

describe('TerminateRuns', () => {
    it('terminates runs', () => {
        const state = loadGameData(['    ', ' 00 ', ' 00 ', '    '].join('\n'));

        const steps = new TerminateRuns().findCandidates(state);
        console.error(
            stateToString(state, {
                marks: steps,
                boldInitialValues: true,
                markSymbol: 'x',
            }),
        );

        const expectedSteps = [
            expect.objectContaining({
                location: [0, 1],
                value: 1,
            }),
            expect.objectContaining({
                location: [0, 2],
                value: 1,
            }),
            expect.objectContaining({
                location: [1, 0],
                value: 1,
            }),
            expect.objectContaining({
                location: [2, 0],
                value: 1,
            }),
            expect.objectContaining({
                location: [3, 1],
                value: 1,
            }),
            expect.objectContaining({
                location: [3, 2],
                value: 1,
            }),
            expect.objectContaining({
                location: [1, 3],
                value: 1,
            }),
            expect.objectContaining({
                location: [2, 3],
                value: 1,
            }),
        ];

        expect(steps.length).toBe(expectedSteps.length);
        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps).toContainEqual(expectedSteps[i]);
        }
    });
});
