import { TerminateRuns } from './TerminateRuns.ts';
import { SplitRuns } from './SplitRuns.ts';
import { CompleteRows } from './CompleteRows.ts';
import { GuessLastDigitWithDuplicateRow } from './GuessLastDigitWithDuplicateRow.ts';
import { GuessLastDigitWithLongRun } from './GuessLastDigitWithLongRun.ts';
import { SolverRegistry } from './types.ts';
import { SolverStrategyAdapter } from './SimpleSolverStrategy.ts';
import { GuessPenultimateDigits } from './GuessPenultimateDigits.ts';

const solvers: SolverRegistry = [
    ...[
        new CompleteRows(),
        new TerminateRuns(),
        new SplitRuns(),
        new GuessLastDigitWithDuplicateRow(),
        new GuessLastDigitWithLongRun(),
        new GuessPenultimateDigits(),
    ].map((solver) => new SolverStrategyAdapter(solver)),
];

export default solvers;
