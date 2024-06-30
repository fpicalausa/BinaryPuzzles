export function projectRow(state: GridState, index: number) {
    return state[index];
}

export function projectColumn(state: GridState, index: number) {
    let col = [];
    for (let i = 0; i < state.length; i++) {
        col.push(state[i][index]);
    }
    return col;
}
export function projectRowValues(state: GridState, index: number) {
    return projectRow(state, index).map((cell) => cell.value);
}

export function projectColumnValues(state: GridState, index: number) {
    return projectColumn(state, index).map((cell) => cell.value);
}

export function getCounts(row: (0 | 1 | null)[]): [number, number, number] {
    const counts: [number, number, number] = [0, 0, 0];
    for (let i = 0; i < row.length; i++) {
        switch (row[i]) {
            case null:
                counts[2]++;
                break;
            default:
                counts[row[i]]++;
        }
    }
    return counts;
}
