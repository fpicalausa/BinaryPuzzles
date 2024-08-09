import { GridState } from './GridState.ts';

export class GridStateView implements GridState {
    private baseState: GridState;
    private bottomRight: CellLocation;
    private topLeft: CellLocation;
    constructor(
        baseState: GridState,
        topLeft: CellLocation,
        bottomRight: CellLocation,
    ) {
        this.baseState = baseState;
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    getCell(r: number, c: number): CellValue {
        return this.baseState.getCell(this.topLeft[0] + r, this.topLeft[1] + c);
    }
    setCell(r: number, c: number, value: CellValue): void {
        this.baseState.setCell(this.topLeft[0] + r, this.topLeft[1] + c, value);
    }
    getRow(r: number): CellValue[] {
        return this.baseState
            .getRow(this.topLeft[0] + r)
            .slice(this.topLeft[1], this.bottomRight[1]);
    }
    getCol(c: number): CellValue[] {
        return this.baseState
            .getCol(this.topLeft[1] + c)
            .slice(this.topLeft[0], this.bottomRight[0]);
    }
    getSlice(topLeft: CellLocation, bottomRight: CellLocation): GridState {
        const baseSize = this.baseState.getSize();
        if (bottomRight[0] > baseSize[0] || bottomRight[1] > baseSize[1]) {
            throw new Error('Slice size cannot exceed parent boundaries');
        }

        const actualTL: CellLocation = [
            this.topLeft[0] + topLeft[0],
            this.topLeft[1] + topLeft[1],
        ];
        const actualBR: CellLocation = [
            this.topLeft[0] + bottomRight[0],
            this.topLeft[1] + bottomRight[1],
        ];
        return this.baseState.getSlice(actualTL, actualBR);
    }
    getSize(): [number, number] {
        return [
            this.bottomRight[0] - this.topLeft[0],
            this.bottomRight[1] - this.topLeft[1],
        ];
    }
}
