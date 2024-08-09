export function getCounts(row: CellValue[]): [number, number, number] {
    const counts: [number, number, number] = [0, 0, 0];
    for (let i = 0; i < row.length; i++) {
        let element = row[i];
        switch (element) {
            case 0:
            case 1:
                counts[element]++;
                break;
            case null:
                counts[2]++;
        }
    }
    return counts;
}

export function getFullSignature(cells: CellValue[]) {
    // A row/column cannot be repeated

    let signature = '';
    for (let i = 0; i < cells.length; i++) {
        let val = cells[i];
        switch (val) {
            case 0:
            case 1:
                signature += '' + val;
                break;
            case null:
                return null;
        }
    }

    return signature;
}
