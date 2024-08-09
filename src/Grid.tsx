import './grid.css';
import { useContext } from 'react';
import { gameGridContext } from './GameGridContext.tsx';
import { Step } from './solvers/types.ts';
import { CellMeta } from './models/GameGrid.ts';

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

function Cell(props: {
    value: CellValue;
    meta: CellMeta;
    onChange: (value: CellValue) => void;
    showErrors: boolean;
    hint: {
        isConstraint: boolean;
        isTarget: boolean;
    };
}) {
    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault();
                return false;
            }}
            onClick={(e) => {
                if (e.buttons === 0) {
                    props.onChange(next(props.value));
                }

                e.preventDefault();
                return false;
            }}
            className={[
                'cell',
                props.meta.isLocked ? 'initial' : '',
                props.showErrors && props.meta.errors?.size ? 'error' : '',
                props.showErrors && props.meta.errors?.size
                    ? 'error-' + props.meta.errors.values().next()
                    : '',
                props.hint.isTarget ? 'hint' : '',
                props.hint.isConstraint ? 'hint-constraint' : '',
            ].join(' ')}>
            {props.value}
        </div>
    );
}

export function Grid({
    showErrors,
    level,
    hint,
    clearHint,
}: {
    showErrors: boolean;
    level: string | null;
    hint: Step | null;
    clearHint: () => void;
}) {
    const { grid, setCell } = useContext(gameGridContext);
    const size = grid.getSize();

    return (
        <div>
            <div>
                {level ? level : ''}
                {`${size[0]}x${size[1]}`} puzzle
            </div>
            <div
                className="grid"
                style={{
                    gridTemplateColumns: 'repeat(' + size[1] + ', auto)',
                }}>
                {grid.map(([i, j], value, meta) => (
                    <Cell
                        key={`cell_${i}_${j}`}
                        value={value}
                        meta={meta}
                        onChange={(value) => {
                            setCell(i, j, value);
                            clearHint();
                        }}
                        showErrors={showErrors}
                        hint={{
                            isConstraint:
                                hint?.constraintCells.some(
                                    ([x, y]) => x === i && y === j,
                                ) || false,
                            isTarget:
                                hint?.locations.some(
                                    ([x, y]) => x === i && y === j,
                                ) || false,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
