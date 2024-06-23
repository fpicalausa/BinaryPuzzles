import {
    createContext,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from 'react';
import { GameGrid } from './models/GameGrid.ts';
import { loadGameData } from './models/loader.ts';

export const gameGridContext = createContext<{
    grid: GameGrid;
    resize: (newSize: number) => void;
    setCell: (x: number, y: number, value: CellValue) => void;
    lockGrid: () => void;
    clear: () => void;
    load: (data: string) => void;
}>({
    grid: new GameGrid(10),
    resize: () => {},
    setCell: () => {},
    lockGrid: () => {},
    clear: () => {},
    load: () => {},
});

function useForceRefresh(): [unknown, () => void] {
    const [token, setRefresh] = useState<unknown>(null);

    const refresh = useCallback(() => setRefresh({}), []);
    return [token, refresh];
}
export function GameGridContextProvider(props: {
    initialSize: number;
    children: ReactNode;
}) {
    const [grid, setGrid] = useState(() => {
        const result = new GameGrid(props.initialSize);

        const saved = localStorage.getItem('current-game');
        if (!saved) return result;
        let state = JSON.parse(saved);
        result.loadState(state.grid);
        if (state.locked) result.lockGrid();

        return result;
    });
    const [token, refresh] = useForceRefresh();

    // @ts-ignore
    globalThis.gameGrid = grid;

    const value = useMemo(
        () => ({
            grid,
            resize: (size: number) => {
                grid.resize(size);
                refresh();
            },
            setCell: (x: number, y: number, value: CellValue) => {
                grid.setCell(x, y, value);
                localStorage.setItem(
                    'current-game',
                    JSON.stringify({
                        locked: grid.isLocked(),
                        grid: grid.getState(),
                    }),
                );
                refresh();
            },
            lockGrid: () => {
                grid.lockGrid();
                refresh();
            },
            clear: () => {
                setGrid(new GameGrid(grid.getSize()));
                localStorage.removeItem('current-game');
                refresh();
            },
            load: (data: string) => {
                const state = loadGameData(data);
                grid.loadState(state);
                grid.lockGrid();
                refresh();
            },
        }),
        [token],
    );

    return (
        <gameGridContext.Provider value={value}>
            {props.children}
        </gameGridContext.Provider>
    );
}
