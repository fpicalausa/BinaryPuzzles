type CellValue = 0 | 1 | null;
type CellErrorType =
    /** The cell is part of a run of 3 */
    | 'three'
    /** The cell is part of a duplicate row */
    | 'dup'
    /** The cell is part of an unbalanced row  */
    | 'parity';
type CellState = {
    value: CellValue;
    isInitial: boolean;
    error: CellErrorType | null;
};
type CellLocation = [number, number];
