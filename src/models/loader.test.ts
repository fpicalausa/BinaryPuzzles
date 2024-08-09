import { loadGameData } from './loader.ts';
import { describe, expect, it } from 'vitest';
import { GameGrid } from './GameGrid.ts';

describe('loadGameData', () => {
    it('Should load game data', () => {
        const state = loadGameData('0  0\n00  \n   0\n1  ');
        const grid = new GameGrid();
        grid.loadState(state);

        const snapshot = grid.getStateSnapshot();

        expect(snapshot.size).toEqual([4, 4]);
        // prettier-ignore
        expect(snapshot.values).toEqual([
            0, null, null, 0,
            0, 0, null, null,
            null, null, null, 0,
            1, null, null, null,
        ]);

        // prettier-ignore
        expect(snapshot.meta.map((m) => m.isLocked)).toEqual([
            true, false, false, true,
            true, true, false, false,
            false, false, false, true,
            true, false, false, false,
        ]);
    });
});
