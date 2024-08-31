import { Step } from './types.ts';
import { GridState } from '../models/GridState.ts';
import { SimpleSolverStrategy } from './SimpleSolverStrategy.ts';

function getSignature(cells: CellValue[], value: 0 | 1): string {
    let sig = '';

    for (let cell of cells) {
        if (cell === value) sig += value;
        else sig += ' ';
    }

    return sig;
}

function getSignatures(cells: CellValue[]): {
    zsig: string | null;
    osig: string | null;
    zeroes: number;
    ones: number;
} {
    let zeroSig: string = '';
    let oneSig: string = '';
    let zeroes = 0;
    let ones = 0;

    for (let cell of cells) {
        switch (cell) {
            case 0:
                zeroes++;
                zeroSig += '0';
                oneSig += ' ';
                break;
            case 1:
                ones++;
                zeroSig += ' ';
                oneSig += '1';
                break;
            default:
                zeroSig += ' ';
                oneSig += ' ';
                break;
        }
    }

    return {
        zsig: zeroes !== cells.length / 2 ? null : zeroSig,
        osig: ones !== cells.length / 2 ? null : oneSig,
        zeroes,
        ones,
    };
}

/**
 * Check if there is a run of 3 cells with the same value, assuming that the cell at index has the given value
 */
function isInRunOfThree(
    row: CellValue[],
    value: 0 | 1,
    index: number,
): boolean {
    // index is surrounded by same value
    if (
        index > 0 &&
        index < row.length - 1 &&
        row[index - 1] === value &&
        row[index + 1] === value
    )
        return true;

    // index is followed by same value
    if (index < row.length - 2 && row[index + 1] === 0 && row[index + 2] === 0)
        return true;

    // index is preceded by same value
    return index >= 2 && row[index - 1] === 0 && row[index - 2] === 0;
}

export function hasPossibleRunOfThreeAfterIndex(
    firstIndex: number,
    row: CellValue[],
    oppositeDigit: 0 | 1,
) {
    let possibleRunLength = 0;
    for (let j = firstIndex + 1; j < row.length; j++) {
        if (row[j] === oppositeDigit) {
            possibleRunLength = 0;
            continue;
        }
        possibleRunLength++;
        if (possibleRunLength === 3) {
            return true;
        }
    }
    return false;
}

export function canPlaceAnotherDigit(
    rowOrCol: CellValue[],
    digit: 0 | 1,
    signatures: Record<string, true>,
) {
    let oppositeDigitRuns = 0;
    for (let i = 0; i < rowOrCol.length; i++) {
        if (rowOrCol[i] === digit) {
            oppositeDigitRuns = 0;
            continue;
        }
        if (rowOrCol[i] !== null) {
            oppositeDigitRuns++;
            continue;
        }
        oppositeDigitRuns++;
        if (oppositeDigitRuns > 3) {
            // Can't leave a 3-run of 1 open
            break;
        }

        if (isInRunOfThree(rowOrCol, digit, i)) {
            // Can't place a 0 that would create a run of 3
            continue;
        }

        rowOrCol[i] = digit;
        const sig = getSignature(rowOrCol, digit);
        rowOrCol[i] = null;
        if (sig in signatures) {
            // Can't place a 0 that would duplicate a signature
            continue;
        }

        // Can't have a run of three 1 after placing this 0
        let hasRunOfThree = hasPossibleRunOfThreeAfterIndex(i, rowOrCol, digit);
        if (hasRunOfThree) {
            continue;
        }

        return true;
    }
    return false;
}

export class GuessPenultimateDigits implements SimpleSolverStrategy {
    name = 'Test digit position with 2 missing';
    description =
        'If a row has all but two zeroes, guess a zero and check that placing the last zero would always break the rules';
    findCandidates(grid: GridState): Step[] {
        // Find existing runs of two 0 or two 1 and terminate the run with the opposite value
        const size = grid.getSize();
        const rowResult = this.findCandidatesProjections(
            grid.getRow.bind(grid),
            size[0],
            (i, j) => [i, j],
        );

        const colResults = this.findCandidatesProjections(
            grid.getCol.bind(grid),
            size[1],
            (i, j) => [j, i],
        );

        return [...rowResult, ...colResults];
    }

    private findCandidatesProjections(
        projectionFn: (index: number) => CellValue[],
        size: number,
        coordinateFn: (i: number, j: number) => [number, number],
    ) {
        const signatures: [Record<string, true>, Record<string, true>] = [
            {},
            {},
        ];
        const candidateRows: [number[], number[]] = [[], []];

        for (let i = 0; i < size; i++) {
            const row = projectionFn(i);
            const { zsig, osig, zeroes, ones } = getSignatures(row);
            if (zsig) signatures[0][zsig] = true;
            if (osig) signatures[1][osig] = true;
            if (zeroes == row.length / 2 - 2) candidateRows[0].push(i);
            if (ones == row.length / 2 - 2) candidateRows[1].push(i);
        }

        const rowResult = [
            ...this.checkCandidateProjections(
                candidateRows[0],
                0,
                signatures[0],
                projectionFn,
                coordinateFn,
            ),
            ...this.checkCandidateProjections(
                candidateRows[1],
                1,
                signatures[1],
                projectionFn,
                coordinateFn,
            ),
        ];
        return rowResult;
    }

    private checkCandidateProjections(
        rowIndexes: number[],
        digit: 0 | 1,
        signatures: Record<string, true>,
        projectionFn: (r: number) => CellValue[],
        coordinateFn: (i: number, j: number) => [number, number],
    ): Step[] {
        const result: Step[] = [];
        rowIndexes.forEach((rowIndex) => {
            const rowOrCol = projectionFn(rowIndex);
            for (let i = 0; i < rowOrCol.length; i++) {
                if (rowOrCol[i] === digit) {
                    continue;
                }
                if (rowOrCol[i] !== digit && rowOrCol[i] !== null) {
                    continue;
                }

                // Guess this is a zero
                const copy = [...rowOrCol];
                copy[i] = digit;

                // Check if we can place another 0 without contradicting rules
                let hasCandidate = canPlaceAnotherDigit(
                    copy,
                    digit,
                    signatures,
                );

                if (!hasCandidate) {
                    // Placing the zero in any of the remaining blanks would make any other placement of 0 invalid. Hence, value is 1.
                    result.push(
                        GuessPenultimateDigits.buildStepGuessed(
                            coordinateFn(rowIndex, i),
                            digit === 1 ? 0 : 1,
                            rowOrCol
                                .map((cell, index) =>
                                    cell === null && index !== i
                                        ? coordinateFn(rowIndex, index)
                                        : null,
                                )
                                .filter(Boolean) as CellLocation[],
                            true,
                        ),
                    );
                }
            }
        });

        return result;
    }

    public static buildStepGuessed(
        location: CellLocation,
        value: 0 | 1,
        constraintCells: CellLocation[],
        isRow: boolean,
    ): Step {
        const opposite = value === 0 ? 1 : 0;
        return {
            strategy: GuessPenultimateDigits.name,
            locations: [location],
            value,
            constraintCells,
            explanation: `This ${isRow ? 'row' : 'column'} is missing two ${opposite}. If this cell is a ${opposite}, then none of the other cells can have a ${opposite} in this ${isRow ? 'row' : 'column'}. Hence this cell must be a ${value}.`,
        };
    }
}
