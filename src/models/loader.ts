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

export function loadGameData(data: string) {
    const values = data.split('\n').map((row) => row.split(''));

    const state: GridState = [];

    const size = getNextEvenNumber(
        Math.max(values.length, ...values.map((row) => row.length)),
    );

    for (let i = 0; i < size; i++) {
        state.push([]);
        for (let j = 0; j < size; j++) {
            const cellValue =
                i < values.length && j < values[i].length
                    ? stringToCellValue(values[i][j])
                    : null;
            state[i].push({
                isInitial: cellValue !== null,
                value: cellValue,
                error: null,
            });
        }
    }

    return state;
}
