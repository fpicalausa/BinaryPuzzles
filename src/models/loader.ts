import { CellMeta, StateSnapshot } from './GameGrid.ts';

function getNextEvenNumber(number: number) {
    if (number % 2 === 0) return number;
    return number + 1;
}

function stringToCellValue(value: string): CellValue {
    switch (value) {
        case '0':
            return 0;
        case '1':
            return 1;
        default:
            return null;
    }
}

export function loadGameData(data: string): StateSnapshot {
    const values = data.split('\n').map((row) => row.split(''));

    const size: [number, number] = [
        getNextEvenNumber(Math.max(...values.map((row) => row.length))),
        getNextEvenNumber(values.length),
    ];

    const result: {
        size: [number, number];
        values: CellValue[];
        meta: CellMeta[];
    } = {
        size,
        values: [],
        meta: [],
    };

    for (let i = 0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
            const cellValue =
                i < values.length && j < values[i].length
                    ? stringToCellValue(values[i][j])
                    : null;
            result.values.push(cellValue);
            result.meta.push({
                isLocked: cellValue !== null,
                errors: new Set(),
            });
        }
    }

    return result;
}
