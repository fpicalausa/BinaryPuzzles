import { projectColumnVales, projectRowValues } from '../models/projection.ts';

export function instersect(
    set1: Set<number> | undefined,
    set2: Set<number> | undefined,
): Set<number> {
    const result = new Set<number>();
    if (!set1 || !set2) return result;
    for (const number of set1) {
        if (set2.has(number)) {
            result.add(number);
        }
    }

    return result;
}

export function findPossibleDuplicateRows(
    val: 0 | 1,
    selfSig: number[],
    signatures: { [p: string]: Set<number> },
    row: CellValue[],
) {
    // Find rows with 0's (or 1's) in the same position as this row
    let pool = signatures[`${val}-${selfSig[0]}`] || new Set();
    for (let i = 1; i < selfSig.length && pool.size !== 0; i++) {
        pool = instersect(pool, signatures[`${val}-${selfSig[i]}`]);
    }

    if (pool.size === 0) return null;

    // Check if any of the null cells in this row have a matching 0 in the remaining cells.
    for (let i = 0; i < row.length; i++) {
        if (row[i] !== null) continue;
        const others = instersect(signatures[val + '-' + i], pool);
        if (others.size) {
            const other: number = others.values().next().value;
            // this cell must be the opposite value, otherwise all the 0's (or 1's) would match
            return [other, i];
        }
    }
    return null;
}

export function computeRowSignature(row: (0 | 1 | null)[]) {
    const selfSig: [number[], number[]] = [[], []];
    const counts: [number, number] = [0, 0]; // zeroes, ones, max run length with 0, max run length with 1
    for (let j = 0; j < row.length; j++) {
        const val = row[j];
        if (val === null) continue;

        selfSig[val].push(j);
        counts[val]++;
    }

    return {
        counts,
        selfSig,
    };
}

export function registerRowSignature(
    row: (0 | 1 | null)[],
    signatures: { [p: string]: Set<number> },
    rowIndex: number,
    register: [boolean, boolean],
) {
    for (let j = 0; j < row.length; j++) {
        const val = row[j];
        if (val === null || !register[val]) continue;

        (signatures[`${val}-${j}`] =
            signatures[`${val}-${j}`] || new Set()).add(rowIndex);
    }
}

export function computeCandidateStatistics(
    row: (0 | 1 | null)[],
    rowIndex: number,
    signatures: { [p: string]: Set<number> },
    candidates: [0 | 1, number, CellValue[], number[]][],
) {
    const { counts, selfSig } = computeRowSignature(row);

    // Row is missing a 0; this is a candidate to check other rows with similar 0 pattern
    if (counts[0] === row.length / 2 - 1) {
        candidates.push([0, rowIndex, row, selfSig[0]]);
    }

    if (counts[1] === row.length / 2 - 1) {
        candidates.push([1, rowIndex, row, selfSig[1]]);
    }

    // Row has all its 0's and 1's; other row's can't have the same pattern
    registerRowSignature(row, signatures, rowIndex, [
        counts[0] === row.length / 2,
        counts[1] === row.length / 2,
    ]);
}

export class GuessLastDigitWithDuplicateRow implements SolverStrategy {
    name = 'Guess last digit position';
    description =
        'If a row has all but one zeroes, check all blanks in that row and decide if placing the last zero would break the rules';
    findCandidates(grid: GridState): Step[] {
        // Find existing runs of two 0 or two 1 and terminate the run with the opposite value
        return [
            ...this.findRowCandidates(grid),
            ...this.findColumnCandidates(grid),
        ];
    }

    private findColumnCandidates(grid: CellState[][]) {
        const result: Step[] = [];
        let signatures: { [valueAndPos: string]: Set<number> } = {};
        let candidates: [0 | 1, number, CellValue[], number[]][] = [];

        for (let i = 0; i < grid.length; i++) {
            const col = projectColumnVales(grid, i);
            computeCandidateStatistics(col, i, signatures, candidates);
        }

        for (const [val, colIndex, col, selfSig] of candidates) {
            // Check if any other row has val in the same positions
            const match = findPossibleDuplicateRows(
                val,
                selfSig,
                signatures,
                col,
            );

            if (match !== null) {
                const [other, rowIndex] = match;
                result.push(
                    GuessLastDigitWithDuplicateRow.buildStepRowMatch(
                        [rowIndex, colIndex],
                        val === 0 ? 1 : 0,
                        [0, other],
                        [1, 0],
                        col.length,
                    ),
                );
            }
        }
        return result;
    }

    private findRowCandidates(grid: CellState[][]) {
        const result: Step[] = [];
        let signatures: { [valueAndPos: string]: Set<number> } = {};
        let candidates: [0 | 1, number, CellValue[], number[]][] = [];

        for (let i = 0; i < grid.length; i++) {
            const row = projectRowValues(grid, i);
            computeCandidateStatistics(row, i, signatures, candidates);
        }

        debugger;

        for (const [val, rowIndex, row, selfSig] of candidates) {
            // Check if any other row has val in the same positions
            const match = findPossibleDuplicateRows(
                val,
                selfSig,
                signatures,
                row,
            );
            if (match !== null) {
                const [other, colIndex] = match;
                result.push(
                    GuessLastDigitWithDuplicateRow.buildStepRowMatch(
                        [rowIndex, colIndex],
                        val === 0 ? 1 : 0,
                        [other, 0],
                        [0, 1],
                        row.length,
                    ),
                );
            }
        }
        return result;
    }

    public static buildStepRowMatch(
        location: CellLocation,
        value: 0 | 1,
        otherRow: CellLocation,
        direction: [number, number],
        length: number,
    ): Step {
        const constraintCells: CellLocation[] = [];

        for (let i = 0; i < length; i++) {
            constraintCells.push([
                otherRow[0] + direction[0] * i,
                otherRow[1] + direction[1] * i,
            ]);
        }

        const isRow = direction[0] === 0;

        return {
            strategy: GuessLastDigitWithDuplicateRow.name,
            locations: [location],
            value,
            constraintCells,
            explanation: `${isRow ? 'Row ' + otherRow[1] : 'Column ' + otherRow[0]} has its ${value === 1 ? 0 : 1} in the same position as this one. If the final cell is also a ${value === 1 ? 0 : 1}, the two ${isRow ? 'rows' : 'columns'} would be identical.`,
        };
    }
}
