import { GridState } from '../models/GridState.ts';
import { GameGridConstraints } from '../models/GameGridConstraints.ts';

export interface SolverStrategy {
    name: string;
    description: string;
    findCandidates(grid: GridState, constraints: GameGridConstraints[]): Step[];
}

export type SolverRegistry = SolverStrategy[];

export type Step = {
    locations: CellLocation[];
    value: 0 | 1;
    // Which cells contribute to solving this?
    constraintCells: CellLocation[];
    strategy: string;
    explanation: string;
};
