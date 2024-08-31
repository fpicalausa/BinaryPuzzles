import { describe, expect, it } from 'vitest';
import { DefaultGridState } from '../models/DefaultGridState.ts';
import {
    GuessPenultimateDigits,
    hasPossibleRunOfThreeAfterIndex,
} from './GuessPenultimateDigits.ts';
import { GridState } from '../models/GridState.ts';

class TransposeGridState implements GridState {
    private wrapped: GridState;

    constructor(wrapped: GridState) {
        this.wrapped = wrapped;
    }

    getCell(r: number, c: number): CellValue {
        return this.wrapped.getCell(c, r);
    }
    setCell(r: number, c: number, value: CellValue): void {
        this.wrapped.setCell(c, r, value);
    }
    getRow(r: number): CellValue[] {
        return this.wrapped.getCol(r);
    }
    getCol(c: number): CellValue[] {
        return this.wrapped.getRow(c);
    }
    getSlice(): GridState {
        throw new Error('Method not implemented.');
    }
    getSize(): [number, number] {
        const [r, c] = this.wrapped.getSize();
        return [c, r];
    }
}

describe('GuessPenultimateDigits', () => {
    it('hints at completable cases', () => {
        const state = new DefaultGridState();

        state.loadFromString(
            ' 0  1 0 \n 1  0  1\n  0110  \n  1001  \n01100110\n10011001\n 01101 0\n 10010  ',
        );

        const steps = new GuessPenultimateDigits().findCandidates(state);

        const expectedSteps = [
            expect.objectContaining({
                locations: [[1, 0]],
                value: 1,
            }),
        ];

        expect(steps.length).toBe(expectedSteps.length);
        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });

    it('hints at completable cases transposed', () => {
        const state = new DefaultGridState();

        state.loadFromString(
            ' 0  1 0 \n 1  0  1\n  0110  \n  1001  \n01100110\n10011001\n 01101 0\n 10010  ',
        );

        const steps = new GuessPenultimateDigits().findCandidates(
            new TransposeGridState(state),
        );

        const expectedSteps = [
            expect.objectContaining({
                locations: [[0, 1]],
                value: 1,
            }),
        ];

        expect(steps.length).toBe(expectedSteps.length);
        for (let i = 0; i < expectedSteps.length; i++) {
            expect(steps[i]).toEqual(expectedSteps[i]);
        }
    });
});

describe('hasPossibleRunOfThreeAfterIndex', () => {
    it('returns false if no possible run is found after index', () => {
        const row: CellValue[] = [null, null, 0, 1, 1, 0, 0, null];
        expect(hasPossibleRunOfThreeAfterIndex(0, row, 0)).toBe(false);
        expect(hasPossibleRunOfThreeAfterIndex(0, row, 1)).toBe(true);
    });
});
