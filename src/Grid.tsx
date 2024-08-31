import './grid.css';
import { useContext, useState } from 'react';
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

const borderClasses = ['border-t', 'border-l', 'border-b', 'border-r'];

function Cell(props: {
    value: CellValue;
    meta: CellMeta;
    highlight: boolean;
    onChange: (value: CellValue) => void;
    onClick: () => void;
    onHover: () => void;
    showErrors: boolean;
    hint: {
        isConstraint: boolean;
        isTarget: boolean;
    };
    borderConstraints: Borders;
}) {
    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault();
                return false;
            }}
            onClick={(e) => {
                props.onClick();

                if (e.buttons === 0) {
                    props.onChange(next(props.value));
                }

                e.preventDefault();
                return false;
            }}
            onMouseEnter={() => props.onHover()}
            className={[
                'cell',
                props.meta.isLocked ? 'initial' : '',
                props.showErrors && props.meta.errors?.size ? 'error' : '',
                props.showErrors && props.meta.errors?.size
                    ? 'error-' + props.meta.errors.values().next().value
                    : '',
                props.hint.isTarget ? 'hint' : '',
                props.hint.isConstraint ? 'hint-constraint' : '',
                props.highlight ? 'highlight' : '',
                ...props.borderConstraints.map((v, i) =>
                    v ? borderClasses[i] : '',
                ),
            ].join(' ')}>
            {props.value}
        </div>
    );
}

function isBetween1(peek: number, l1: number, l2: number) {
    if (l1 < l2) {
        return l1 <= peek && peek <= l2;
    } else {
        return l2 <= peek && peek <= l1;
    }
}

function isBetween(peek: CellLocation, l1: CellLocation, l2: CellLocation) {
    return (
        isBetween1(peek[0], l1[0], l2[0]) && isBetween1(peek[1], l1[1], l2[1])
    );
}

type Borders = [boolean, boolean, boolean, boolean];

function getConstraints(
    i: number,
    j: number,
    constraints: [number, number, number, number][],
): Borders {
    return constraints.reduce(
        (p: Borders, c) => {
            return [
                p[0] || (c[0] === i && c[1] <= j && j < c[3]),
                p[1] || (c[1] === j && c[0] <= i && i < c[2]),
                p[2] || (c[2] - 1 === i && c[1] <= j && j < c[3]),
                p[3] || (c[3] - 1 === j && c[0] <= i && i < c[2]),
            ];
        },
        [false, false, false, false],
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
    const { grid, setCell, isSettingConstraint, addConstraint } =
        useContext(gameGridContext);
    const size = grid.getSize();
    const [currentConstraint, setCurrentConstraint] = useState<CellLocation[]>(
        [],
    );
    const [hoveredCell, setHoveredCell] = useState<CellLocation | null>(null);

    const constraints: [number, number, number, number][] = grid
        .getConstraints()
        .slice(1)
        .map((c) => [...c.getBoundaries()[0], ...c.getBoundaries()[1]]);

    return (
        <div onMouseOut={() => setHoveredCell(null)}>
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
                        onHover={() => setHoveredCell([i, j])}
                        onChange={(value) => {
                            if (isSettingConstraint) return;

                            setCell(i, j, value);
                            clearHint();
                        }}
                        onClick={() => {
                            if (!isSettingConstraint) return;

                            if (currentConstraint.length < 2) {
                                currentConstraint.push([i, j]);
                            }

                            if (currentConstraint.length === 2) {
                                const tl: CellLocation = [
                                    Math.min(
                                        currentConstraint[0][0],
                                        currentConstraint[1][0],
                                    ),
                                    Math.min(
                                        currentConstraint[0][1],
                                        currentConstraint[1][1],
                                    ),
                                ];

                                const br: CellLocation = [
                                    Math.max(
                                        currentConstraint[0][0],
                                        currentConstraint[1][0],
                                    ) + 1,
                                    Math.max(
                                        currentConstraint[0][1],
                                        currentConstraint[1][1],
                                    ) + 1,
                                ];
                                addConstraint(tl, br);
                                setCurrentConstraint([]);
                            }
                        }}
                        showErrors={showErrors}
                        highlight={
                            (i === hoveredCell?.[0] &&
                                j === hoveredCell?.[1]) ||
                            (currentConstraint.length === 1 &&
                                hoveredCell &&
                                isBetween(
                                    [i, j],
                                    currentConstraint[0],
                                    hoveredCell,
                                )) ||
                            false
                        }
                        borderConstraints={getConstraints(i, j, constraints)}
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
