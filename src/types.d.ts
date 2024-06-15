type CellValue = 0 | 1 | null;
type CellState = {
    value: CellValue;
    isInitial: boolean;
    error: 'cell' | 'row' | 'column' | null;
};
type GridState = CellState[][];
