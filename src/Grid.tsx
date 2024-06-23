import './grid.css';
import { useContext } from 'react';
import { gameGridContext } from './GameGridContext.tsx';

function next(value: 0 | 1 | null) {
    switch (value) {
        case 0:
            return 1;
        case 1:
            return null;
        case null:
            return 0;
    }
}

export function Grid({
    showErrors,
    level,
    hint,
    cleaHint,
}: {
    showErrors: boolean;
    level: string | null;
    hint: Step | null;
    cleaHint: () => void;
}) {
    const { grid, setCell } = useContext(gameGridContext);

    const state: GridState = grid.getState();
    return (
        <div>
            <div>
                {level ? level : ''}
                {`${grid.getSize()}x${grid.getSize()}`} puzzle
            </div>
            <div
                className="grid"
                style={{
                    gridTemplateColumns: 'repeat(' + grid.getSize() + ', auto)',
                }}>
                {state.map((row, i) =>
                    row.map((cell, j) => (
                        <div
                            key={`cell_${i}_${j}`}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                return false;
                            }}
                            onClick={(e) => {
                                if (cell.isInitial && grid.isLocked()) {
                                    return false;
                                }

                                if (e.buttons === 0) {
                                    setCell(i, j, next(cell.value));
                                    cleaHint();
                                }

                                e.preventDefault();
                                return false;
                            }}
                            className={[
                                'cell',
                                cell.isInitial ? 'initial' : '',
                                showErrors && cell.error
                                    ? 'error-' + cell.error
                                    : '',
                                hint?.locations.some(
                                    (l) => l[0] === i && l[1] === j,
                                )
                                    ? 'hint'
                                    : '',
                                hint?.constraintCells.some(
                                    (c) => c[0] === i && c[1] === j,
                                )
                                    ? 'hint-constraint'
                                    : '',
                            ].join(' ')}>
                            {cell.value}
                        </div>
                    )),
                )}
            </div>
        </div>
    );
}
