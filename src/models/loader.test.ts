import { loadGameData } from './loader.ts';
import { describe, it } from 'vitest';
import { DefaultGridState } from './DefaultGridState.ts';

describe('loadGameData', () => {
    it('Should load game data', () => {
        const state = loadGameData('0  0\n00  \n   0\n1    ');
        new DefaultGridState();
    });
});
