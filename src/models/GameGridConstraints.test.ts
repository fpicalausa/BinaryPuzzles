import { describe, expect, it } from 'vitest';
import { DefaultGridState } from './DefaultGridState.ts';
import { GameGridConstraints } from './GameGridConstraints.ts';

describe('GameGridConstraints', () => {
    it('Validates the specified game grid slice', () => {
        const grid = new DefaultGridState();

        grid.loadFrom2DArray([
            [0, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 0, 1],
        ]);

        const _4By4 = new GameGridConstraints(grid, [0, 0], [4, 4]);
        const _2By2TopLeft = new GameGridConstraints(grid, [0, 0], [2, 2]);
        const _2By2center = new GameGridConstraints(grid, [1, 1], [3, 3]);

        expect(_4By4.checkState()).toEqual({
            isValid: true,
            isComplete: true,
            errors: [],
        });

        expect(_2By2TopLeft.checkState()).toEqual({
            isValid: true,
            isComplete: true,
            errors: [],
        });

        const checkState1 = _2By2center.checkState();
        expect(checkState1).toEqual({
            isValid: false,
            isComplete: true,
            errors: [
                {
                    error: 'parity',
                    location: [2, 1],
                },
                {
                    error: 'parity',
                    location: [2, 2],
                },
                {
                    error: 'parity',
                    location: [1, 1],
                },
                {
                    error: 'parity',
                    location: [2, 1],
                },
            ],
        });
    });
});
