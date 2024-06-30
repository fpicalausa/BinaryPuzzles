import { getCounts, projectColumn, projectRow } from './projection.ts';

function buildInitialState(size: number, previousGrid: GridState = []) {
    const array: GridState = [];
    for (let i = 0; i < size; i++) {
        const row: GridState[0] = [];
        for (let j = 0; j < size; j++) {
            if (previousGrid.length > i && previousGrid[i].length > j) {
                row.push(previousGrid[i][j]);
            } else {
                row.push({ value: null, isInitial: false, error: null });
            }
        }
        array.push(row);
    }
    return array;
}
export class GameGrid {
    private _size: number;
    // Todo: keep a transposed state to make things faster
    private _state: GridState;
    private _isInitial: boolean;
    private _isValid: boolean;

    constructor(size: number) {
        this._state = buildInitialState(size);
        this._size = size;
        this._isInitial = true;
        this._isValid = false;
    }

    isValid() {
        return this._isValid;
    }

    debug() {
        console.log(JSON.stringify(this._state));
    }

    resize(size: number) {
        this._state = buildInitialState(size, this._state);
        this._size = size;
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
        this._state[x][y] = {
            value,
            isInitial: this._isInitial && value !== null,
            error: null,
        };
        this.updateState();
    }

    private setRowError(index: number) {
        for (let i = 0; i < this._size; i++) {
            this._state[index][i].error = 'row';
        }
    }

    private setColumnError(index: number) {
        for (let i = 0; i < this._size; i++) {
            this._state[i][index].error = 'column';
        }
    }

    private isValidRowOrColumn(cells: CellState[]) {
        const [num0, num1] = getCounts(cells.map((c) => c.value));
        return num0 <= this._size / 2 && num1 <= this._size / 2;
    }

    private getRowColumnSignature(cells: CellState[]) {
        // A row/column cannot be repeated

        let signature = '';
        for (let i = 0; i < this._size; i++) {
            switch (cells[i].value) {
                case 0:
                    signature += '0';
                    break;
                case 1:
                    signature += '1';
                    break;
                case null:
                    return null;
            }
        }

        return signature;
    }

    private updateState() {
        const rowsSignatures: Record<string, number> = {};

        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                this._state[i][j].error = null;
            }
        }

        for (let row = 0; row < this._size; row++) {
            const rowCells = projectRow(this._state, row);

            if (!this.isValidRowOrColumn(rowCells)) {
                this.setRowError(row);
            }

            const signature = this.getRowColumnSignature(rowCells);
            if (!signature) continue;
            if (signature in rowsSignatures) {
                this.setRowError(row);
                this.setRowError(rowsSignatures[signature]);
            }
            rowsSignatures[signature] = row;
        }

        const columnsSignature: Record<string, number> = {};
        for (let col = 0; col < this._size; col++) {
            const rowCells = projectColumn(this._state, col);

            if (!this.isValidRowOrColumn(rowCells)) {
                this.setColumnError(col);
            }

            const signature = this.getRowColumnSignature(rowCells);
            if (!signature) continue;
            if (signature in columnsSignature) {
                this.setColumnError(col);
                this.setColumnError(columnsSignature[signature]);
            }
            columnsSignature[signature] = col;
        }

        let hasUnfilledCell = false;
        let hasError = false;

        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                // The same digit can only repeat twice at most
                if (
                    i < this._size - 2 &&
                    this._state[i][j].value !== null &&
                    this._state[i][j].value === this._state[i + 1][j].value &&
                    this._state[i][j].value === this._state[i + 2][j].value
                ) {
                    this._state[i][j].error = 'cell';
                    this._state[i + 1][j].error = 'cell';
                    this._state[i + 2][j].error = 'cell';
                }

                if (
                    j < this._size - 2 &&
                    this._state[i][j].value !== null &&
                    this._state[i][j].value === this._state[i][j + 1].value &&
                    this._state[i][j].value === this._state[i][j + 2].value
                ) {
                    this._state[i][j].error = 'cell';
                    this._state[i][j + 1].error = 'cell';
                    this._state[i][j + 2].error = 'cell';
                }

                hasUnfilledCell =
                    hasUnfilledCell || this._state[i][j].value === null;
                hasError = hasError || this._state[i][j].error !== null;
            }
        }

        this._isValid = !hasUnfilledCell && !hasError;
    }

    isLocked() {
        return !this._isInitial;
    }

    clear() {
        this._state = buildInitialState(this._size);
    }

    loadState(state: CellState[][]) {
        this._size = state.length;
        this._state = state;
        this.updateState();
    }

    getStateCopy() {
        return this._state.map((row) => row.map((cell) => ({ ...cell })));
    }

    setState(state: GridState) {
        this._state = state;
        this.updateState();
    }
}
