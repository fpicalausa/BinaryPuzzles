import { CellMeta } from './GameGrid.ts';

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

export function loadGameData(data: string): {
    values: CellValue[][];
    meta: CellMeta[][];
} {
    const values = data.split('\n').map((row) => row.split(''));

    const result: { values: CellValue[][]; meta: CellMeta[][] } = {
        values: [],
        meta: [],
    };

    const size = [
        getNextEvenNumber(Math.max(...values.map((row) => row.length))),
        getNextEvenNumber(values.length),
    ];

    for (let i = 0; i < size; i++) {
        result.values.push([]);
        result.meta.push([]);
        for (let j = 0; j < size; j++) {
            const cellValue =
                i < values.length && j < values[i].length
                    ? stringToCellValue(values[i][j])
                    : null;
            result.values[i].push(cellValue);
            result.meta[i].push({
                isLocked: cellValue !== null,
                errors: new Set(),
            });
        }
    }

    return { size };
}
