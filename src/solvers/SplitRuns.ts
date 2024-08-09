import { SolverStrategy, Step } from './types.ts';
import { GridState } from '../models/GridState.ts';

export class SplitRuns implements SolverStrategy {
    name = 'Split Runs';
    description =
        'At most 2 consecutive 0 or 1 are allowed. If two 0 are neighboring a cell horizontally or vertically, the middle value must be a 1';
    findCandidates(grid: GridState): Step[] {
        // Find existing runs of two 0 or two 1 and terminate the run with the opposite value
        const result: Step[] = [];

        const [rows, cols] = grid.getSize();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid.getCell(i, j) !== null) continue;
                if (
                    i > 0 &&
                    i < rows - 1 &&
                    grid.getCell(i - 1, j) === grid.getCell(i + 1, j) &&
                    grid.getCell(i - 1, j) !== null
                ) {
                    result.push(
                        SplitRuns.buildStep(
                            [i, j],
                            grid.getCell(i - 1, j) === 0 ? 1 : 0,
                            'horizontally',
                            [
                                [i - 1, j],
                                [i + 1, j],
                            ],
                        ),
                    );
                }
                if (
                    j > 0 &&
                    j < cols - 1 &&
                    grid.getCell(i, j - 1) === grid.getCell(i, j + 1) &&
                    grid.getCell(i, j - 1) !== null
                ) {
                    result.push(
                        SplitRuns.buildStep(
                            [i, j],
                            grid.getCell(i, j - 1) === 0 ? 1 : 0,
                            'to the left',
                            [
                                [i, j - 1],
                                [i, j + 1],
                            ],
                        ),
                    );
                }
            }
        }

        return result;
    }

    private static buildStep(
        location: CellLocation,
        value: 0 | 1,
        direction: string,
        constraintCells: CellLocation[],
    ): Step {
        return {
            strategy: SplitRuns.name,
            locations: [location],
            value,
            constraintCells,
            explanation: `${value === 1 ? 0 : 1} appears in two cells ${direction}. Since three consecutive cells cannot have the same value, this cell must be ${value}`,
        };
    }
}
