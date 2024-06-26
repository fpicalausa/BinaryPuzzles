export class TerminateRuns implements SolverStrategy {
    name = 'Terminate Runs';
    description =
        'At most 2 consecutive 0 or 1 are allowed. If two consecutive 0 are found, the next value must be a 1';
    findCandidates(grid: GridState): Step[] {
        // Find existing runs of two 0 or two 1 and terminate the run with the opposite value
        const result: Step[] = [];

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j].value !== null) continue;
                if (
                    i > 1 &&
                    grid[i - 2][j].value === grid[i - 1][j].value &&
                    grid[i - 1][j].value !== null
                ) {
                    result.push(
                        TerminateRuns.buildStep(
                            [i, j],
                            grid[i - 1][j].value === 0 ? 1 : 0,
                            'above',
                            [
                                [i - 1, j],
                                [i - 2, j],
                            ],
                        ),
                    );
                }
                if (
                    j > 1 &&
                    grid[i][j - 2].value === grid[i][j - 1].value &&
                    grid[i][j - 1].value !== null
                ) {
                    result.push(
                        TerminateRuns.buildStep(
                            [i, j],
                            grid[i][j - 1].value === 0 ? 1 : 0,
                            'to the left',
                            [
                                [i, j - 1],
                                [i, j - 2],
                            ],
                        ),
                    );
                }

                if (
                    i < grid.length - 2 &&
                    grid[i + 1][j].value === grid[i + 2][j].value &&
                    grid[i + 1][j].value !== null
                ) {
                    result.push(
                        TerminateRuns.buildStep(
                            [i, j],
                            grid[i + 1][j].value === 0 ? 1 : 0,
                            'below',
                            [
                                [i + 1, j],
                                [i + 2, j],
                            ],
                        ),
                    );
                }

                if (
                    j < grid[i].length - 2 &&
                    grid[i][j + 1].value === grid[i][j + 2].value &&
                    grid[i][j + 1].value !== null
                ) {
                    result.push(
                        TerminateRuns.buildStep(
                            [i, j],
                            grid[i][j + 1].value === 0 ? 1 : 0,
                            'below',
                            [
                                [i, j + 1],
                                [i, j + 2],
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
            strategy: TerminateRuns.name,
            locations: [location],
            value,
            constraintCells,
            explanation: `${value === 1 ? 0 : 1} appears in two consecutive cells ${direction}. Since three consecutive cells cannot have the same value, this cell must be ${value}`,
        };
    }
}
