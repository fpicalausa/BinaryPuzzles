import { TerminateRuns } from './TerminateRuns.ts';
import { SplitRuns } from './SplitRuns.ts';

const solvers: SolverRegistry = [new TerminateRuns(), new SplitRuns()];

export default solvers;
