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

function Game() {
    const [showErrors, setShowErrors] = useState(true);
    const [level, setLevel] = useState<string | null>(null);
    const [hint, setHint] = useState<Step | null>(null);

    const { grid, clear, resize, lockGrid, load } = useContext(gameGridContext);

    function computeNextHint() {
        for (let solver of solvers) {
            const steps = solver.findCandidates(grid.getState());
            if (!steps.length) continue;

            setHint(steps[0]);
            return;
        }
    }

    return (
        <>
            <label>
                Size:
                <input
                    disabled={grid.isLocked()}
                    type="number"
                    value={grid.getSize()}
                    step={2}
                    onChange={(e) => {
                        const newSize = e.currentTarget.valueAsNumber;
                        resize(newSize);
                    }}
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
                            const url = prompt(
                                'url?',
                                'https://www.binarypuzzle.com/index.php',
                            );
                            if (!url) return;

                            const proxyUrl =
                                'https://corsproxy.io/?' +
                                encodeURIComponent(url);
                            load(await extractPuzzleFromUrl(proxyUrl));
                            grid.lockGrid();
                            return;
                        }

                        const { data, level } = await games[game]();
                        load(data);
                        setLevel(level);
                    }}>
                    <option key="none" value="">
                        None
                    </option>
                    <option key="url" value="url">
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
                cleaHint={() => setHint(null)}
            />
            {grid.isValid() && <div className="solved">Solved</div>}
            {hint && <div className="hint-details">{hint.explanation}</div>}
            <div className="game-controls">
                {grid.isLocked() && (
                    <button onClick={computeNextHint}>Hint</button>
                )}
                {!grid.isLocked() && (
                    <button onClick={() => lockGrid()}>Start Playing</button>
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
