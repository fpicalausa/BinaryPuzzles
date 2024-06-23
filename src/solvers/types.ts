type CellLocation = [number, number];

interface SolverStrategy {
    name: string;
    description: string;
    findCandidates(grid: GridState): Step[];
}

type SolverRegistry = SolverStrategy[];

type Step = {
    locations: CellLocation[];
    value: 0 | 1;
    // Which cells contribute to solving this?
    constraintCells: CellLocation[];
    strategy: string;
    explanation: string;
};
