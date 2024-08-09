import { GridState } from '../models/GridState.ts';

export interface SolverStrategy {
    name: string;
    description: string;
    findCandidates(grid: GridState): Step[];
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
