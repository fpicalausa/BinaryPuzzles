import { useContext, useState } from 'react';
import './App.css';
import { Grid } from './Grid.tsx';
import {
    gameGridContext,
    GameGridContextProvider,
} from './GameGridContext.tsx';
import games from './assets/games/games.ts';
import { extractPuzzleFromUrl } from './gameGridImporter.ts';
import solvers from './solvers';
import { Step } from './solvers/types.ts';

function SizeInput(props: {
    value: GridSize;
    disabled: boolean;
    onChange: (value: GridSize) => void;
}) {
    return (
        <>
            <input
                disabled={props.disabled}
                type="number"
                aria-label="Width"
                value={props.value[0]}
                step={2}
                onChange={(e) => {
                    const newSize = e.currentTarget.valueAsNumber;
                    props.onChange([newSize, props.value[1]]);
                }}
            />
            <input
                disabled={props.disabled}
                aria-label="Height"
                type="number"
                value={props.value[1]}
                step={2}
                onChange={(e) => {
                    const newSize = e.currentTarget.valueAsNumber;
                    props.onChange([props.value[0], newSize]);
                }}
            />
        </>
    );
}

function Game() {
    const [showErrors, setShowErrors] = useState(true);
    const [level, setLevel] = useState<string | null>(null);
    const [hint, setHint] = useState<Step | null>(null);

    const { grid, clear, resize, lockGrid, load, refresh, setConstraintMode } =
        useContext(gameGridContext);

    function computeNextHint() {
        for (let solver of solvers) {
            const steps = solver.findCandidates(
                grid.getState(),
                grid.getConstraints(),
            );
            if (!steps.length) continue;

            setHint(steps[0]);
            return;
        }
    }

    async function loadGameFromUrl() {
        const firstPuzzleDate = new Date(2011, 3, 8);
        const today = new Date();
        // Incorrect, but good enough for now
        const daysElapsed = Math.trunc(
            today.getTime() - (firstPuzzleDate.getTime() / 24) * 3600 * 1000,
        );
        const defaultUrl =
            'https://www.binarypuzzle.com/daypuzzle.php?id=' +
            (1 + daysElapsed);
        const url = prompt('url?', defaultUrl);
        if (!url) return;

        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        load(await extractPuzzleFromUrl(proxyUrl));
        grid.lockGrid();
        return;
    }

    function autoSolve() {
        if (grid.isValid()) return;

        let steps: Step[] = [];
        const state = grid.getState();

        do {
            for (const step of steps) {
                for (const [x, y] of step.locations) {
                    state.setCell(x, y, step.value);
                }
            }

            steps = [];
            for (let solver of solvers) {
                steps.push(
                    ...solver.findCandidates(state, grid.getConstraints()),
                );
                if (steps.length) break; // Apply the low-cost strategies first
            }
        } while (steps.length);

        refresh();
    }

    return (
        <>
            <label>
                Size:{' '}
                <SizeInput
                    value={grid.getSize()}
                    disabled={grid.isLocked()}
                    onChange={resize}
                />
            </label>
            <label>
                Show Errors:
                <input
                    type="checkbox"
                    checked={showErrors}
                    onChange={(e) => setShowErrors(e.target.checked)}
                />
            </label>
            <label>
                Load:
                <select
                    onChange={async (e) => {
                        const game = e.currentTarget.value;
                        setLevel(null);
                        if (!game) return;
                        if (game === 'url') {
                            await loadGameFromUrl();
                            return;
                        }

                        const { data, level } = await games[game]();
                        load(data);
                        setLevel(level);
                    }}>
                    <option key="none" value="">
                        None
                    </option>
                    <option key="url" value="url" onClick={loadGameFromUrl}>
                        From URL
                    </option>
                    {Object.keys(games)
                        .sort()
                        .map((key) => (
                            <option value={key} key={key}>
                                {key}
                            </option>
                        ))}
                </select>
            </label>
            <Grid
                showErrors={showErrors}
                level={level}
                hint={hint}
                clearHint={() => setHint(null)}
            />
            {grid.isValid() && <div className="solved">Solved</div>}
            {hint && <div className="hint-details">{hint.explanation}</div>}
            <div className="game-controls">
                {grid.isLocked() && (
                    <>
                        <button onClick={computeNextHint}>Hint</button>
                        <button onClick={autoSolve}>Auto-solve</button>
                    </>
                )}
                {!grid.isLocked() && (
                    <button onClick={() => lockGrid()}>Start Playing</button>
                )}
                {!grid.isLocked() && (
                    <button onClick={() => setConstraintMode()}>
                        Add constraint
                    </button>
                )}
                <button onClick={clear}>Reset</button>
            </div>
        </>
    );
}

function App() {
    return (
        <div id="root">
            <GameGridContextProvider initialSize={6}>
                <Game />
            </GameGridContextProvider>
        </div>
    );
}

export default App;
