import { GridState } from './GridState.ts';
import { DefaultGridState } from './DefaultGridState.ts';
import { GameGridConstraints } from './GameGridConstraints.ts';

export type CellMeta = { isLocked: boolean; errors: Set<CellErrorType> | null };

export type StateSnapshot = {
    size: [number, number];
    values: CellValue[];
    meta: CellMeta[];
};

const DEFAULT_CELL_META: CellMeta = {
    isLocked: false,
    errors: null,
};

function newGridMetas(size: GridSize): CellMeta[] {
    const result: CellMeta[] = Array(size[0] * size[1]);
    for (let i = 0; i < size[0] * size[1]; i++) {
        result[i] = { ...DEFAULT_CELL_META };
    }

    return result;
}

export class GameGrid {
    private _size: [number, number];
    private _state: DefaultGridState;
    private _gridMeta: CellMeta[];
    private _constraints: GameGridConstraints[];
    private _isInitial: boolean;
    private _isValid: boolean;

    constructor(size: GridSize = [0, 0]) {
        this._state = new DefaultGridState(size);
        this._gridMeta = newGridMetas(size);
        this._size = size;
        this._isInitial = true;
        this._isValid = false;
        this._constraints = [
            new GameGridConstraints(this._state, [0, 0], size),
        ];
    }

    addConstraint(tl: CellLocation, br: CellLocation) {
        this._constraints.push(new GameGridConstraints(this._state, tl, br));
    }

    getConstraints(): GameGridConstraints[] {
        return this._constraints;
    }

    isValid() {
        return this._isValid;
    }

    debug() {
        console.log(JSON.stringify(this.getStateSnapshot()));
    }

    resize(size: [number, number]) {
        this._state = new DefaultGridState(size);
        this._gridMeta = newGridMetas(size);
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
        const isCurrentlyLocked =
            this._gridMeta[x * this._size[1] + y].isLocked;
        if (!this._isInitial && isCurrentlyLocked) {
            return;
        }

        this._state.setCell(x, y, value);
        this._gridMeta[x * this._size[1] + y].isLocked =
            this._isInitial && value !== null;
        this.updateState();
    }

    updateState() {
        for (let i = 0; i < this._gridMeta.length; i++) {
            this._gridMeta[i].errors?.clear();
        }

        let isValid = true;

        for (const constraint of this._constraints) {
            const state = constraint.checkState();
            isValid = isValid && state.isValid && state.isComplete;
            for (let error of state.errors) {
                const cellMeta =
                    this._gridMeta[
                        error.location[0] * this._size[1] + error.location[1]
                    ];
                cellMeta.errors = cellMeta.errors ?? new Set();
                cellMeta.errors.add(error.error);
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

    loadState(state: StateSnapshot) {
        if (state.values.length !== state.size[0] * state.size[1]) {
            throw new Error(
                "Invalid state snapshot: cell values don't match size",
            );
        }

        if (state.meta.length !== state.size[0] * state.size[1]) {
            throw new Error(
                "Invalid state snapshot: cell meta don't match size",
            );
        }

        this.resize(state.size);

        this._state.load(state.values);
        this._gridMeta = [...state.meta];
        this.updateState();
    }

    getStateSnapshot(): StateSnapshot {
        const values = this._state.snapshot();
        const meta: CellMeta[] = this._gridMeta.map((m) => ({
            isLocked: m.isLocked,
            errors: new Set(),
        }));

        return { size: [this._size[0], this._size[1]], values, meta };
    }

    map<T>(
        fn: (loc: CellLocation, value: CellValue, meta: CellMeta) => T,
    ): T[] {
        const result: T[] = [];

        for (let i = 0; i < this._size[0]; i++) {
            for (let j = 0; j < this._size[1]; j++) {
                result.push(
                    fn(
                        [i, j],
                        this._state.getCell(i, j),
                        this._gridMeta[i * this._size[1] + j],
                    ),
                );
            }
        }

        return result;
    }
}
