export interface GridState {
    getCell(r: number, c: number): CellValue;

    setCell(r: number, c: number, value: CellValue): void;

    getRow(r: number): CellValue[];
    getCol(c: number): CellValue[];

    getSlice(topLeft: CellLocation, bottomRight: CellLocation): GridState;

    getSize(): [number, number];
}
