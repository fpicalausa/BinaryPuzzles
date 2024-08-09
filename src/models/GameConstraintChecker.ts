import { getCounts, getFullSignature } from './utils.ts';
import { GridState } from './GridState.ts';

export type ErrorType = {
    location: CellLocation;
    error: CellErrorType;
    direction?: 'horizontal' | 'vertical';
};

function checkParity(row: CellValue[]): [boolean, boolean] {
    const [zeroes, ones] = getCounts(row);
    return [zeroes > row.length / 2, ones > row.length / 2];
}

function checkRuns(row: CellValue[]): number[] {
    let currentRunLength = 0;
    let currentRunValue: CellValue = null;
    const result: number[] = [];

    for (let i = 0; i < row.length; i++) {
        switch (row[i]) {
            case null:
                currentRunLength = 0;
                currentRunValue = null;
                break;
            case currentRunValue:
                currentRunLength++;
                break;
            default:
                currentRunValue = row[i];
                currentRunLength = 1;
        }

        if (currentRunLength === 3) {
            result.push(i - 2);
            result.push(i - 1);
            result.push(i);
        } else if (currentRunLength > 3) {
            result.push(i);
        }
    }

    return result;
}

function checkRowOrCol(
    rowOrCol: CellValue[],
    signatures: {
        [p: string]: boolean;
    },
    coordinate: (cellIndex: number) => CellLocation,
    direction: 'horizontal' | 'vertical',
): [isComplete: boolean, errors: ErrorType[]] {
    let isComplete = true;
    const errors: ErrorType[] = [];
    const sig = getFullSignature(rowOrCol);

    if (sig && sig in signatures) {
        for (let j = 0; j < rowOrCol.length; j++) {
            errors.push({ location: coordinate(j), error: 'dup', direction });
        }

        signatures[sig] = true;
    } else if (sig) {
        signatures[sig] = true;
    } else {
        isComplete = false;
    }

    const parityIssues = checkParity(rowOrCol);
    if (parityIssues[0] || parityIssues[1]) {
        for (let j = 0; j < rowOrCol.length; j++) {
            const val = rowOrCol[j];
            if (val !== null && parityIssues[val]) {
                errors.push({
                    location: coordinate(j),
                    error: 'parity',
                    direction,
                });
            }
        }
    }

    for (let cell of checkRuns(rowOrCol)) {
        errors.push({ location: coordinate(cell), error: 'three', direction });
    }
    return [isComplete, errors];
}

export function checkState(state: GridState): {
    errors: ErrorType[];
    isValid: boolean;
    isComplete: boolean;
} {
    const errors: ErrorType[] = [];
    let isComplete = true;

    const rowSignatures: { [sig: string]: boolean } = {};
    const colSignatures: { [sig: string]: boolean } = {};

    const [rows, cols] = state.getSize();
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const row = state.getRow(rowIndex);
        const coordinate: (cell: number) => CellLocation = (j: number) => [
            rowIndex,
            j,
        ];
        const [isRowComplete, rowErrors] = checkRowOrCol(
            row,
            rowSignatures,
            coordinate,
            'horizontal',
        );
        isComplete = isComplete && isRowComplete;
        errors.push(...rowErrors);
    }

    for (let colIndex = 0; colIndex < cols; colIndex++) {
        const column = state.getCol(colIndex);
        const coordinate: (cell: number) => CellLocation = (j: number) => [
            j,
            colIndex,
        ];
        const [isRowComplete, colErrors] = checkRowOrCol(
            column,
            colSignatures,
            coordinate,
            'vertical',
        );
        isComplete = isComplete && isRowComplete;
        errors.push(...colErrors);
    }

    return { errors, isValid: errors.length === 0, isComplete };
}
