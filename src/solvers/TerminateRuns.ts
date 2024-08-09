import { SolverStrategy, Step } from './types.ts';
import { GridState } from '../models/GridState.ts';

export class TerminateRuns implements SolverStrategy {
    name = 'Terminate Runs';
    description =
        'At most 2 consecutive 0 or 1 are allowed. If two consecutive 0 are found, the next value must be a 1';
    findCandidates(grid: GridState): Step[] {
        // Find existing runs of two 0 or two 1 and terminate the run with the opposite value
        const result: Step[] = [];
        const [rows, cols] = grid.getSize();

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid.getCell(i, j) !== null) continue;

                const cells: ([CellLocation, CellLocation] | null)[] = [
                    j > 1
                        ? [
                              [i, j - 1],
                              [i, j - 2],
                          ]
                        : null,
                    j < cols - 2
                        ? [
                              [i, j + 1],
                              [i, j + 2],
                          ]
                        : null,
                    i > 1
                        ? [
                              [i - 1, j],
                              [i - 2, j],
                          ]
                        : null,
                    i < rows - 2
                        ? [
                              [i + 1, j],
                              [i + 2, j],
                          ]
                        : null,
                ] as const;

                cells.forEach((locs) => {
                    if (locs === null) return;
                    const [l1, l2] = locs;
                    const c1 = grid.getCell(l1[0], l1[1]);
                    const c2 = grid.getCell(l2[0], l2[1]);
                    if (c1 === null || c1 !== c2) return;
                    result.push(
                        TerminateRuns.buildStep([i, j], c1 === 0 ? 1 : 0, locs),
                    );
                });
            }
        }

        return result;
    }

    private static buildStep(
        location: CellLocation,
        value: 0 | 1,
        constraintCells: CellLocation[],
    ): Step {
        return {
            strategy: TerminateRuns.name,
            locations: [location],
            value,
            constraintCells,
            explanation: `${value === 1 ? 0 : 1} appears in two consecutive adjacent cells, this cell must be ${value}`,
        };
    }
}
