import {
    createContext,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from 'react';
import { GameGrid } from './models/GameGrid.ts';
import { loadGameData } from './models/loader.ts';

const defaultValue: ContextType = {
    grid: new GameGrid([10, 10]),
    resize: () => {},
    setCell: () => {},
    lockGrid: () => {},
    clear: () => {},
    load: () => {},
    refresh: () => {},
    setConstraintMode: () => {},
    isSettingConstraint: false,
    addConstraint() {},
};
type ContextType = {
    grid: GameGrid;
    resize: (newSize: [number, number]) => void;
    setCell: (x: number, y: number, value: CellValue) => void;
    lockGrid: () => void;
    clear: () => void;
    load: (data: string) => void;
    refresh: () => void;
    setConstraintMode: () => void;
    isSettingConstraint: boolean;
    addConstraint(tl: CellLocation, br: CellLocation): void;
};
export const gameGridContext = createContext<ContextType>(defaultValue);

function useForceRefresh(): [unknown, () => void] {
    const [token, setRefresh] = useState<unknown>(null);

    const refresh = useCallback(() => setRefresh({}), []);
    return [token, refresh];
}
export function GameGridContextProvider(props: {
    initialSize: number;
    children: ReactNode;
}) {
    const [constraintsMode, setConstraintsMode] = useState(false);
    const [grid, setGrid] = useState(() => {
        const result = new GameGrid([props.initialSize, props.initialSize]);

        const saved = localStorage.getItem('current-game');
        if (!saved) return result;
        let state = JSON.parse(saved);
        try {
            result.loadState(state.grid);
            if (state.locked) result.lockGrid();
        } catch (e) {}

        return result;
    });
    const [token, refresh] = useForceRefresh();

    // @ts-ignore
    globalThis.gameGrid = grid;

    const value: ContextType = useMemo(
        () => ({
            grid,
            resize: (size: [number, number]) => {
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
            refresh,
            addConstraint(tl: CellLocation, br: CellLocation) {
                grid.addConstraint(tl, br);
                setConstraintsMode(false);
            },
            isSettingConstraint: constraintsMode,
            setConstraintMode() {
                setConstraintsMode(true);
            },
        }),
        [token, constraintsMode],
    );

    return (
        <gameGridContext.Provider value={value}>
            {props.children}
        </gameGridContext.Provider>
    );
}
