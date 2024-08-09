import { describe, expect, it } from 'vitest';
import { DefaultGridState } from './DefaultGridState.ts';

describe('DefaultGridState', () => {
    it('Defaults to null cell', () => {
        const grid = new DefaultGridState([4, 4]);
        expect(grid.getCell(0, 0)).toBeNull();
        expect(grid.getCell(1, 1)).toBeNull();
        expect(grid.getCell(3, 1)).toBeNull();
    });

    it('Retains last set values', () => {
        const grid = new DefaultGridState([4, 4]);

        grid.setCell(0, 0, 1);
        grid.setCell(3, 0, 1);
        grid.setCell(2, 3, 0);
        grid.setCell(3, 0, null);

        expect(grid.getCell(0, 0)).toBe(1);
        expect(grid.getCell(3, 0)).toBeNull;
        expect(grid.getCell(2, 3)).toBe(0);
    });

    it('Gives the correct row and column projections', () => {
        const grid = new DefaultGridState([4, 4]);

        grid.loadFrom2DArray([
            [0, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 0, 1],
        ]);

        expect(grid.getRow(0)).toEqual([0, 1, 1, 0]);
        expect(grid.getRow(3)).toEqual([0, 1, 0, 1]);
        expect(grid.getCol(0)).toEqual([0, 1, 1, 0]);
        expect(grid.getCol(3)).toEqual([0, 0, 1, 1]);
    });

    it('Gives the correct slice', () => {
        const grid = new DefaultGridState([4, 4]);

        grid.loadFrom2DArray([
            [0, 1, 1, 0, 0, 1],
            [1, 0, 1, 0, 0, 1],
            [1, 0, 0, 1, 1, 0],
            [0, 1, 0, 1, 1, 0],
            [1, 0, 1, 0, 0, 1],
            [0, 1, 0, 1, 1, 0],
        ]);

        const slice = grid.getSlice([2, 2], [6, 6]);
        expect(slice.getRow(0)).toEqual([0, 1, 1, 0]);
        expect(slice.getRow(3)).toEqual([0, 1, 1, 0]);
        expect(slice.getCol(0)).toEqual([0, 0, 1, 0]);
        expect(slice.getCol(3)).toEqual([0, 0, 1, 0]);
    });
});
