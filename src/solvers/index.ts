import { TerminateRuns } from './TerminateRuns.ts';
import { SplitRuns } from './SplitRuns.ts';
import { CompleteRows } from './CompleteRows.ts';
import { GuessLastDigitWithDuplicateRow } from './GuessLastDigitWithDuplicateRow.ts';

const solvers: SolverRegistry = [
    new CompleteRows(),
    new TerminateRuns(),
    new SplitRuns(),
    new GuessLastDigitWithDuplicateRow(),
];

export default solvers;
