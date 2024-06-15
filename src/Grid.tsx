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
}: {
    showErrors: boolean;
    level: string | null;
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
                            onTouchStart={(e) => {
                                setCell(i, j, next(cell.value));

                                e.preventDefault();
                                return false;
                            }}
                            onClick={(e) => {
                                if (e.buttons === 1) {
                                    setCell(i, j, next(cell.value));
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
                            ].join(' ')}>
                            {cell.value}
                        </div>
                    )),
                )}
            </div>
        </div>
    );
}
