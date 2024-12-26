export enum Difficulty {
    Beginner = "B",
    Intermediate = "I",
    Expert = "E",
    Master = "M",
    Ludicrous = "L",
}

export enum GameMode {
    Regular = "regular",
    SplitCell = "split_cell",
}

export interface HighscoreFilters {
    name: string | null;
    difficulty: Difficulty | null;
    dragSelect: boolean | null;
    perCell: number | null;
    reach: number;
    gameMode: GameMode;
}

export interface Highscore {
    name: string;
    difficulty: Difficulty;
    dragSelect: boolean;
    perCell: number;
    reach: number;
    gameMode: GameMode;
    elapsed: number;
    timestamp: number;
}
