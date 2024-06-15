import _20240615 from './20240615.json';

type Game = {
    data: string;
    level: 'Very hard' | 'Hard' | 'Easy';
};

const games: Record<string, () => Promise<Game>> = {
    '20240615': () => import('./20240615.json') as Promise<Game>,
    '6x6 - 1': () => import('./6x6 - 1.json') as Promise<Game>,
};

export default games;
