import { GridState } from './GridState.ts';
import { DefaultGridState } from './DefaultGridState.ts';
import { GameGridConstraints } from './GameGridConstraints.ts';

export type CellMeta = { isLocked: boolean; errors: Set<CellErrorType> };

export class GameGrid {
    private _size: [number, number];
    private _state: DefaultGridState;
    private _gridMeta: CellMeta[];
    private _constraints: GameGridConstraints[];
    private _isInitial: boolean;
    private _isValid: boolean;

    constructor(size: [number, number]) {
        this._state = new DefaultGridState(size);
        this._gridMeta = Array(size[0] * size[1]).fill({
            isLocked: false,
            errors: [],
        });
        this._size = size;
        this._isInitial = true;
        this._isValid = false;
        this._constraints = [
            new GameGridConstraints(this._state, [0, 0], size),
        ];
    }

    isValid() {
        return this._isValid;
    }

    debug() {
        console.log(JSON.stringify(this.getStateCopy()));
    }

    resize(size: [number, number]) {
        this._state = new DefaultGridState(size);
        this._gridMeta = Array(size[0] * size[1]).fill({
            isLocked: false,
            errors: [],
        });
        this._size = size;
        this._isValid = true;
        this._isInitial = true;
        this._constraints = [
            new GameGridConstraints(this._state, [0, 0], size),
        ];
    }

    lockGrid() {
        this._isInitial = false;
    }

    unlockGrid() {
        this._isInitial = true;
    }

    getSize() {
        return this._size;
    }

    getState(): GridState {
        return this._state;
    }

    setCell(x: number, y: number, value: CellValue) {
        this._state.setCell(x, y, value);
        this._gridMeta[x * this._size[1] + y].isLocked =
            this._isInitial && value !== null;
        this.updateState();
    }

    private updateState() {
        for (let i = 0; i < this._gridMeta.length; i++) {
            this._gridMeta[i].errors.clear();
        }

        let isValid = true;

        for (const constraint of this._constraints) {
            const state = constraint.checkState();
            isValid = isValid && state.isValid && state.isComplete;
            for (let error of state.errors) {
                this._gridMeta[
                    error.location[0] * this._size[1] + error.location[1]
                ].errors.add(error.error);
            }
        }

        this._isValid = isValid;
    }

    isLocked() {
        return !this._isInitial;
    }

    clear() {
        this.resize(this._size);
    }

    loadState(state: { grid: { value: CellValue; isLocked: boolean }[][] }) {
        this._size = [state.grid.length, state.grid[0].length];
        this.resize(this._size);

        for (let i = 0; i < state.grid.length; i++) {
            for (let j = 0; j < state.grid[i].length; j++) {
                this._state.setCell(i, j, state.grid[i][j].value);
                this._gridMeta[i * this._size[1] + j].isLocked =
                    state.grid[i][j].isLocked;
            }
        }

        this.updateState();
    }

    getStateCopy() {
        const result = this._state.snapshot().map((v, i) => ({
            value: v,
            isLocked: this._gridMeta[i].isLocked,
        }));

        const gridResult: { value: CellValue; isLocked: boolean }[][] = [];
        for (let i = 0; i < result.length; i++) {
            if (i % this._size[1] === 0) {
                gridResult.push([result[i]]);
            } else {
                gridResult[gridResult.length - 1].push(result[i]);
            }
        }

        return gridResult;
    }
}
