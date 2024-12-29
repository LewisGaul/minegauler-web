export enum Difficulty {
    Beginner = 'B',
    Intermediate = 'I',
    Expert = 'E',
    Master = 'M',
    Ludicrous = 'L',
}

export enum GameMode {
    Regular = 'regular',
    SplitCell = 'split_cell',
}

export interface HighscoreFilters {
    name: string | null;
    difficulty: Difficulty;
    drag_select: boolean | null;
    per_cell: number | null;
    reach: number;
    game_mode: GameMode;
}

export interface Highscore {
    name: string;
    difficulty: Difficulty;
    drag_select: boolean;
    per_cell: number;
    reach: number;
    game_mode: GameMode;
    elapsed: number;
    timestamp: number;
}
