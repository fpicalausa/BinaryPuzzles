type Game = {
    data: string;
    level: 'Very hard' | 'Hard' | 'Easy';
};

const games: Record<string, () => Promise<Game>> = {};

export default games;
