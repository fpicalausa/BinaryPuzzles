type ExportOptions = {
    boldInitialValues: boolean;
    marks: [number, number][];
    markSymbol: string;
};

const defaultOptions: ExportOptions = {
    boldInitialValues: true,
    marks: [],
    markSymbol: 'x',
};

export function stateToString(
    state: GridState,
    options?: Partial<ExportOptions>,
) {
    const opts: ExportOptions = {
        ...defaultOptions,
        ...options,
    };

    return state
        .map((row, i) => {
            return row
                .map((cell, j) => {
                    for (const loc of opts.marks) {
                        if (!(loc[0] !== i || loc[1] !== j)) {
                            return opts.markSymbol;
                        }
                    }

                    if (cell.isInitial && opts.boldInitialValues) {
                        return cell.value === 1 ? '𝟭' : '𝟎';
                    }

                    return cell.value === null ? ' ' : `${cell.value}`;
                })
                .join('');
        })
        .join('\n');
}
