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

export function buildLocations(
    origin: CellLocation,
    direction: Vector2,
    length: number,
) {
    const result: CellLocation[] = [origin];

    for (let i = 1; i < length; i++) {
        result.push([
            origin[0] + direction[0] * i,
            origin[1] + direction[1] * i,
        ]);
    }
    return result;
}
