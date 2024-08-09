import { GridState } from './GridState.ts';
import { GridStateView } from './GridStateView.ts';

export class DefaultGridState implements GridState {
    private values: CellValue[];
    private size: [number, number];

    constructor(size: [number, number] = [0, 0]) {
        this.values = Array(size[0] * size[1]).fill(null);
        this.size = size;
    }

    getCell(r: number, c: number): CellValue {
        return this.values[r * this.size[1] + c];
    }

    setCell(r: number, c: number, value: CellValue): void {
        this.values[r * this.size[1] + c] = value;
    }

    getRow(r: number): CellValue[] {
        return this.values.slice(r * this.size[1], (r + 1) * this.size[1]);
    }

    getCol(c: number): CellValue[] {
        const result: CellValue[] = [];
        for (let i = 0; i < this.size[0]; i++) {
            result.push(this.values[i * this.size[1] + c]);
        }
        return result;
    }

    getSlice(topLeft: CellLocation, bottomRight: CellLocation): GridState {
        return new GridStateView(this, topLeft, bottomRight);
    }

    getSize(): [number, number] {
        return this.size;
    }

    snapshot(): CellValue[] {
        return [...this.values];
    }

    debug() {
        let out = '';
        for (let i = 0; i < this.values.length; i++) {
            if (i % this.size[1] === 0) out += '\n';
            out += this.values[i] === null ? ' ' : `${this.values[i]}`;
        }
        console.log(out);
    }

    loadFrom2DArray(values: CellValue[][]) {
        this.size = [values.length, values[0].length];
        this.values = values.flat();
    }

    load(values: CellValue[]) {
        this.values = values;
    }

    loadFromString(data: string) {
        const rows = data.split('\n');
        const cols = Math.max(...rows.map((l) => l.length));

        this.size = [rows.length, cols];
        const charToCellValue = (c: string): CellValue => {
            switch (c) {
                case '0':
                    return 0;
                case '1':
                    return 1;
                default:
                    return null;
            }
        };
        this.values = rows.flatMap((r) =>
            r.padEnd(cols, ' ').split('').map(charToCellValue),
        );
    }
}
