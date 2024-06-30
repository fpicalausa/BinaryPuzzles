import { projectColumnVales, projectRowValues } from '../models/projection.ts';
type RunStart = [number | null, number | null];

export function computeRunLength(row: CellValue[]) {
    let counts = [0, 0];
    let threeRunStart: RunStart = [null, null];
    let currentRunStart: RunStart = [null, null];
    let currentLength = [0, 0];
    for (let i = 0; i < row.length; i++) {
        const val = row[i];

        switch (val) {
            case null:
                currentRunStart[0] = currentRunStart[0] ?? i;
                currentRunStart[1] = currentRunStart[1] ?? i;
                currentLength[0]++;
                currentLength[1]++;
                break;
            case 1:
                counts[1]++;
                currentRunStart[0] = null;
                currentRunStart[1] = currentRunStart[1] ?? i;
                currentLength[0] = 0;
                currentLength[1]++;
                break;
            case 0:
                counts[0]++;
                currentRunStart[0] = currentRunStart[0] ?? i;
                currentRunStart[1] = null;
                currentLength[0]++;
                currentLength[1] = 0;
                break;
        }

        if (currentLength[0] > 2 && threeRunStart[0] === null) {
            threeRunStart[0] = currentRunStart[0];
        }

        if (currentLength[1] > 2 && threeRunStart[1] === null) {
            threeRunStart[1] = currentRunStart[1];
        }
    }

    return { threeRunStart, counts };
}

export function guessAndCheck(
    row: (0 | 1 | null)[],
    val: number,
    threeRunStartElement: number,
): [number, number] | null {
    for (let i = 0; i < row.length; i++) {
        if (row[i] !== null) continue;

        let length = 0;
        let start: number | null = null;
        for (let j = threeRunStartElement; j < row.length; j++) {
            if (i === j) {
                length = 0;
                start = null;
                continue;
            }

            switch (row[j]) {
                case null:
                    length++;
                    start = start ?? j;
                    break;
                case val:
                    length = 0;
                    start = null;
                    break;
                default:
                    start = start ?? j;
                    length++;
            }

            if (length > 2 && start !== null) {
                return [i, start];
            }
        }

        if (length > 2 && start !== null) {
            return [i, start];
        }
    }

    return null;
}

function addResult(
    row: (0 | 1 | null)[],
    callback: (cellIndex: number, value: 0 | 1, runStart: number) => void,
) {
    const { threeRunStart, counts } = computeRunLength(row);

    if (counts[0] === row.length / 2 - 1 && threeRunStart[1] !== null) {
        const check = guessAndCheck(row, 0, threeRunStart[1]);
        if (check) {
            const [col, runStart] = check;
            callback(col, 1, runStart);
        }
    }

    if (counts[1] === row.length / 2 - 1 && threeRunStart[0] !== null) {
        const check = guessAndCheck(row, 1, threeRunStart[0]);
        if (check) {
            const [col, runStart] = check;
            callback(col, 0, runStart);
        }
    }
}

export class GuessLastDigitWithLongRun implements SolverStrategy {
    name = 'Guess last digit position';
    description =
        'If a row has all but one zeroes, check all blanks in that row and decide if placing the last zero would break the rules';
    findCandidates(grid: GridState): Step[] {
        // Find existing runs of two 0 or two 1 and terminate the run with the opposite value
        const result: Step[] = [];

        for (let i = 0; i < grid.length; i++) {
            const row = projectRowValues(grid, i);
            addResult(row, (col, val, runStart) => {
                result.push(
                    GuessLastDigitWithLongRun.buildStepOverrun(
                        [i, col],
                        val,
                        [0, 1],
                        [i, runStart],
                    ),
                );
            });

            const col = projectColumnVales(grid, i);
            addResult(col, (row, val, runStart) => {
                result.push(
                    GuessLastDigitWithLongRun.buildStepOverrun(
                        [row, i],
                        val,
                        [1, 0],
                        [runStart, i],
                    ),
                );
            });
        }

        return result;
    }

    public static buildStepOverrun(
        location: CellLocation,
        value: 0 | 1,
        direction: [number, number],
        runStart: CellLocation,
    ): Step {
        const isRow = direction[0] === 0;

        const constraintCells: CellLocation[] = [];

        for (let i = 0; i < 3; i++) {
            constraintCells.push([
                runStart[0] + direction[0] * i,
                runStart[1] + direction[1] * i,
            ]);
        }

        return {
            strategy: GuessLastDigitWithLongRun.name,
            locations: [location],
            value,
            constraintCells,
            explanation: `This ${isRow ? 'row' : 'column'} is missing a single ${value === 0 ? 1 : 0}. If this cell is a ${value === 0 ? 1 : 0}, then the other 3 cells in this ${isRow ? 'row' : 'column'} must be ${value}. Hence this cell must be a ${value}.`,
        };
    }
}
