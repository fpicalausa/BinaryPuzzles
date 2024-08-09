import { describe, expect, it } from 'vitest';
import { checkState } from './GameConstraintChecker.ts';
import { DefaultGridState } from './DefaultGridState.ts';

describe('GameConstraintChecker', () => {
    it('check constraints are met', () => {
        const grid = new DefaultGridState([4, 4]);

        grid.loadFrom2DArray([
            [0, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 0, 1],
        ]);
        const result = checkState(grid);
        expect(result).toEqual({ errors: [], isValid: true, isComplete: true });
    });

    it('check constraints are met for incomplete grids', () => {
        const grid = new DefaultGridState([4, 4]);

        grid.loadFrom2DArray([
            [0, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 0, null, null],
            [0, 1, null, 1],
        ]);
        const result = checkState(grid);
        expect(result).toEqual({
            errors: [],
            isValid: true,
            isComplete: false,
        });
    });

    it('check constraints fails on duplicates', () => {
        const grid = new DefaultGridState([4, 4]);

        grid.loadFrom2DArray([
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [1, 0, null, 1],
        ]);
        const result = checkState(grid);
        expect(result).toEqual({
            errors: expect.arrayContaining([
                {
                    location: [2, 0],
                    error: 'dup',
                    direction: 'horizontal',
                },
                {
                    location: [2, 1],
                    error: 'dup',
                    direction: 'horizontal',
                },
                {
                    location: [2, 2],
                    error: 'dup',
                    direction: 'horizontal',
                },
                {
                    location: [2, 3],
                    error: 'dup',
                    direction: 'horizontal',
                },
                {
                    location: [0, 3],
                    error: 'dup',
                    direction: 'vertical',
                },
                {
                    location: [1, 3],
                    error: 'dup',
                    direction: 'vertical',
                },
                {
                    location: [2, 3],
                    error: 'dup',
                    direction: 'vertical',
                },
                {
                    location: [3, 3],
                    error: 'dup',
                    direction: 'vertical',
                },
            ]),
            isValid: false,
            isComplete: false,
        });
    });

    it('check constraints fails for runs of three', () => {
        const grid = new DefaultGridState([4, 4]);

        grid.loadFrom2DArray([
            [0, 1, 1, 1],
            [1, 0, 1, 0],
            [1, 0, null, null],
            [0, 0, null, 1],
        ]);
        const result = checkState(grid);
        expect(result).toEqual({
            errors: expect.arrayContaining([
                {
                    location: [0, 1],
                    error: 'parity',
                    direction: 'horizontal',
                },
                {
                    location: [0, 2],
                    error: 'parity',
                    direction: 'horizontal',
                },
                {
                    location: [0, 3],
                    error: 'parity',
                    direction: 'horizontal',
                },
                {
                    location: [0, 1],
                    error: 'three',
                    direction: 'horizontal',
                },
                {
                    location: [0, 2],
                    error: 'three',
                    direction: 'horizontal',
                },
                {
                    location: [0, 3],
                    error: 'three',
                    direction: 'horizontal',
                },
                {
                    location: [1, 1],
                    error: 'parity',
                    direction: 'vertical',
                },
                {
                    location: [2, 1],
                    error: 'parity',
                    direction: 'vertical',
                },
                {
                    location: [3, 1],
                    error: 'parity',
                    direction: 'vertical',
                },
                {
                    location: [1, 1],
                    error: 'three',
                    direction: 'vertical',
                },
                {
                    location: [2, 1],
                    error: 'three',
                    direction: 'vertical',
                },
                {
                    location: [3, 1],
                    error: 'three',
                    direction: 'vertical',
                },
            ]),
            isValid: false,
            isComplete: false,
        });
    });
});
