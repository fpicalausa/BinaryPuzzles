type ExportOptions = {
    boldInitialValues: boolean;
    marks: { location: [number, number] }[];
    markSymbol: string;
};

export function stateToString(
    state: GridState,
    options: ExportOptions = {
        boldInitialValues: false,
        marks: [],
        markSymbol: 'x',
    },
) {
    return state
        .map((row, i) => {
            return row
                .map((cell, j) => {
                    for (const loc of options.marks) {
                        if (!(loc.location[0] !== i || loc.location[1] !== j)) {
                            return options.markSymbol;
                        }
                    }

                    if (cell.isInitial && options.boldInitialValues) {
                        return cell.value === 1 ? '𝟭' : '𝟎';
                    }

                    return cell.value === null ? ' ' : `${cell.value}`;
                })
                .join('');
        })
        .join('\n');
}
