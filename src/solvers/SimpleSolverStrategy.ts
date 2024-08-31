import { GameGridConstraints } from '../models/GameGridConstraints.ts';
import { GridState } from '../models/GridState.ts';
import { SolverStrategy, Step } from './types.ts';
import { GridStateView } from '../models/GridStateView.ts';

export interface SimpleSolverStrategy {
    name: string;
    description: string;

    findCandidates(grid: GridState): Step[];
}

function v2Plus(a: Vector2, b: Vector2): Vector2 {
    return [a[0] + b[0], a[1] + b[1]];
}

export class SolverStrategyAdapter implements SolverStrategy {
    name: string;
    description: string;
    wrapped: SimpleSolverStrategy;

    constructor(simpleStrategy: SimpleSolverStrategy) {
        this.name = simpleStrategy.name;
        this.description = simpleStrategy.description;
        this.wrapped = simpleStrategy;
    }

    findCandidates(
        grid: GridState,
        constraints: GameGridConstraints[],
    ): Step[] {
        const result: Step[] = [];

        for (const constraint of constraints) {
            const [tl, br] = constraint.getBoundaries();
            const view = new GridStateView(grid, tl, br);
            const steps = this.wrapped.findCandidates(view);
            for (const step of steps) {
                result.push({
                    ...step,
                    locations: step.locations.map((l1) => v2Plus(l1, tl)),
                    constraintCells: step.constraintCells.map((l1) =>
                        v2Plus(l1, tl),
                    ),
                });
            }
        }

        return result;
    }
}
