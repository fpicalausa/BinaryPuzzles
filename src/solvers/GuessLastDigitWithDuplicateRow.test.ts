import { describe, expect, it, test } from 'vitest';
import {
    computeCandidateStatistics,
    computeRowSignature,
    findPossibleDuplicateRows,
    GuessLastDigitWithDuplicateRow,
    instersect,
    registerRowSignature,
} from './GuessLastDigitWithDuplicateRow.ts';
import { DefaultGridState } from '../models/DefaultGridState.ts';

test('intersect two sets', () => {
    expect(instersect(new Set([1, 2, 3]), new Set([3, 4, 5]))).toEqual(
        new Set([3]),
    );
    expect(instersect(new Set([1, 2]), new Set([4, 5]))).toEqual(new Set());
    expect(instersect(new Set([1, 2]), new Set([1, 2]))).toEqual(
        new Set([1, 2]),
    );

    expect(instersect(new Set(), new Set([1, 2]))).toEqual(new Set([]));
    expect(instersect(new Set([1, 2]), new Set())).toEqual(new Set([]));
});

test('computeRowSignature', () => {
    expect(computeRowSignature([0, 1, 0, null, null, 1, 1, null])).toEqual({
        counts: [2, 3],
        selfSig: [
            [0, 2],
            [1, 5, 6],
        ],
    });
});

test('computeCandidateStatistics adds 0 and 1 signatures', () => {
    const signatures = {};
    const candidates: [] = [];
    computeCandidateStatistics(
        [0, 0, 1, 1, 0, 1, 0, 1],
        5,
        signatures,
        candidates,
    );

    expect(signatures).toEqual({
        '0-0': new Set([5]),
        '0-1': new Set([5]),
        '0-4': new Set([5]),
        '0-6': new Set([5]),
        '1-2': new Set([5]),
        '1-3': new Set([5]),
        '1-5': new Set([5]),
        '1-7': new Set([5]),
    });
    expect(candidates).toEqual([]);
});

test('computeCandidateStatistics adds partial signatures', () => {
    const signatures = {};
    const candidates: [] = [];
    computeCandidateStatistics(
        [0, 0, 1, null, 0, null, 0, 1],
        5,
        signatures,
        candidates,
    );

    expect(signatures).toEqual({
        '0-0': new Set([5]),
        '0-1': new Set([5]),
        '0-4': new Set([5]),
        '0-6': new Set([5]),
    });
    expect(candidates).toEqual([]);
});

test('computeCandidateStatistics skips incomplete rows', () => {
    const signatures = {};
    const candidates: [] = [];
    computeCandidateStatistics(
        [0, null, 1, null, null, null, 0, 1],
        5,
        signatures,
        candidates,
    );

    expect(signatures).toEqual({});
    expect(candidates).toEqual([]);
});

test('computeCandidateStatistics adds candidate rows', () => {
    const signatures = {};
    const candidates: [] = [];
    let row: CellValue[] = [0, 0, 1, null, null, null, 0, 1];
    computeCandidateStatistics(row, 5, signatures, candidates);

    expect(signatures).toEqual({});
    const zeroSig = [0, 1, 6];
    expect(candidates).toEqual([[0, 5, row, zeroSig]]);
});

test('findPossibleDuplicateRows', () => {
    const signatures = {};
    registerRowSignature([0, 0, 1, 1, 0, 1, 0, 1], signatures, 1, [true, true]);
    registerRowSignature([0, 1, 1, 0, 0, 1, 1, 0], signatures, 2, [true, true]);
    const row: CellValue[] = [0, 0, 1, null, null, null, 0, 1];
    const { selfSig } = computeRowSignature(row);
    const match = findPossibleDuplicateRows(0, selfSig[0], signatures, row);

    expect(match).toEqual([1, 4]); // Row 1, column 4 cannot be a 0
});

describe('GuessLastDigitWithDuplicateRow', () => {
    it('hints at avoiding duplicate rows', () => {
        const state = new DefaultGridState();
        state.loadFromString(
            ['0  0  ', '00101 ', '00    ', '      ', '      ', '      '].join(
                '\n',
            ),
        );

        const steps = new GuessLastDigitWithDuplicateRow().findCandidates(
            state,
        );

        console.error(JSON.stringify(steps));

        const expectedSteps = [
            expect.objectContaining({
                locations: [[0, 1]],
                value: 1,
                explanation: expect.stringContaining('Row'),
            }),
            expect.objectContaining({
                locations: [[2, 3]],
                value: 1,
                explanation: expect.stringContaining('Row'),
            }),
            expect.objectContaining({
                locations: [[0, 1]],
                value: 1,
                explanation: expect.stringContaining('Column'),
            }),
            expect.objectContaining({
                locations: [[2, 3]],
                value: 1,
                explanation: expect.stringContaining('Column'),
            }),
        ];

        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });
});
