function cellToValue(cell: Element): ' ' | '0' | '1' {
    switch ((cell.textContent || '').trim()) {
        case '0':
            return '0';
        case '1':
            return '1';
        default:
            return ' ';
    }
}

export async function extractPuzzleFromUrl(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.text();
    const root = new DOMParser().parseFromString(data, 'text/html');
    const cells = [...root.querySelectorAll('.puzzlecel')];

    const grid: string[][] = [];

    let maxRow = 0,
        maxCol = 0;
    cells.forEach((cell) => {
        const [row, col] = cell.id.split('_').slice(1).map(Number);

        maxRow = row > maxRow ? row : maxRow;
        maxCol = col > maxCol ? col : maxCol;
    });

    if (maxCol !== maxRow) {
        throw new Error('Col !== row');
    }

    for (let i = 0; i < maxRow; i++) {
        grid.push([]);
        for (let j = 0; j < maxCol; j++) {
            grid[i].push(' ');
        }
    }

    cells.forEach((cell) => {
        const [row, col] = cell.id.split('_').slice(1).map(Number);
        grid[row - 1][col - 1] = cellToValue(cell);
    });

    return grid.map((row) => row.join('')).join('\n');
}
