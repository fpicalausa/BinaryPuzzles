import { TerminateRuns } from './TerminateRuns.ts';
import { SplitRuns } from './SplitRuns.ts';
import { CompleteRows } from './CompleteRows.ts';

const solvers: SolverRegistry = [
    new CompleteRows(),
    new TerminateRuns(),
    new SplitRuns(),
];

export default solvers;
