import { projectColumnValues, projectRowValues } from '../models/projection.ts';

export class CompleteRows implements SolverStrategy {
    name = 'Complete rows';
    description =
        'A row or column must have the same number of 1 or 0. If a row has has already all 1 (or 0) figured out, fill in the rest with 0. As a special case, this fills in the last cell of any row/column.';
    findCandidates(grid: GridState): Step[] {
        // Find existing runs of two 0 or two 1 and terminate the run with the opposite value
        const result: Step[] = [];

        for (let i = 0; i < grid.length; i++) {
            const row = projectRowValues(grid, i);
            const step = this.computeHintsForRow([i, 0], [0, 1], row);
            if (step) {
                result.push(step);
            }
        }

        for (let i = 0; i < grid[0].length; i++) {
            const row = projectColumnValues(grid, i);
            const step = this.computeHintsForRow([0, i], [1, 0], row);
            if (step) {
                result.push(step);
            }
        }

        return result;
    }

    private static buildStep(
        locations: CellLocation[],
        value: 0 | 1,
        direction: string,
        constraintCells: CellLocation[],
        size: number,
    ): Step {
        return {
            strategy: CompleteRows.name,
            locations,
            value,
            constraintCells,
            explanation: `${value === 1 ? 0 : 1} appears ${size / 2} times in the ${direction}. Since the number of 1 and 0 in a ${direction} need to be the same, this cell can be filled with ${value}`,
        };
    }

    private computeHintsForRow(
        start: CellLocation,
        direction: CellLocation,
        row: (0 | 1 | null)[],
    ): Step | null {
        let { zeroes, ones, nulls } = this.countZeroesAndOnes(row);

        let fill: CellValue = null;
        if (nulls === 0) {
            return null;
        } else if (zeroes === row.length / 2) {
            fill = 1;
        } else if (ones === row.length / 2) {
            fill = 0;
        } else {
            return null;
        }

        const constraints: Step['constraintCells'] = [];
        const locations: Step['locations'] = [];

        for (let j = 0; j < row.length; j++) {
            if (row[j] === fill) {
                continue;
            }

            if (row[j] === null) {
                locations.push([
                    start[0] + direction[0] * j,
                    start[1] + direction[1] * j,
                ]);
            } else {
                constraints.push([
                    start[0] + direction[0] * j,
                    start[1] + direction[1] * j,
                ]);
            }
        }

        return CompleteRows.buildStep(
            locations,
            fill,
            direction[1] === 1 ? 'column' : 'row',
            constraints,
            row.length,
        );
    }

    private countZeroesAndOnes(row: (0 | 1 | null)[]) {
        let zeroes = 0;
        let ones = 0;
        let nulls = 0;
        for (let j = 0; j < row.length; j++) {
            switch (row[j]) {
                case 0:
                    zeroes++;
                    break;
                case 1:
                    ones++;
                    break;
                default:
                    nulls++;
                    break;
            }
        }
        return { zeroes, ones, nulls };
    }
}
