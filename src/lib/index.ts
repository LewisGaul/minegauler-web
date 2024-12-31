import { Difficulty, GameMode, type Highscore, type HighscoreFilters } from './types';
import { format as dateFormat } from 'date-fns';

export * from './types';

export function parseURLParams(params: URLSearchParams): HighscoreFilters {
    // Name filter (string)
    const nameFilter: string | null = params.get('name');

    // Difficulty filter (enum)
    let difficultyFilter: Difficulty = Difficulty.Expert;
    const difficultyParam = params.get('difficulty');
    if (difficultyParam) {
        if (Object.values(Difficulty).includes(difficultyParam as Difficulty)) {
            difficultyFilter = difficultyParam as Difficulty;
        } else {
            console.error('Unrecognised difficulty parameter:', difficultyParam);
        }
    }

    // Drag select filter (boolean)
    let dragSelectFilter: boolean | null = null;
    const dragSelectParam = params.get('drag_select');
    if (dragSelectParam) {
        dragSelectFilter = parseBoolean(dragSelectParam);
    }

    // Per cell filter (number)
    let perCellFilter: number | null = null;
    const perCellParam = params.get('per_cell');
    if (perCellParam) {
        const perCellParamInt = parseInt(perCellParam, 10);
        if ([1, 2, 3].includes(perCellParamInt)) {
            perCellFilter = perCellParamInt;
        } else {
            console.error('Invalid per_cell value:', perCellParam);
        }
    }

    // Reach filter (number)
    let reachFilter: number = 8;
    const reachParam = params.get('reach');
    if (reachParam) {
        const reachParamInt = parseInt(reachParam, 10);
        if ([4, 8, 24].includes(reachParamInt)) {
            reachFilter = reachParamInt;
        } else {
            console.error('Invalid reach value:', reachParam);
        }
    }

    // Game mode filter (enum)
    let gameModeFilter: GameMode = GameMode.Regular;
    const gameModeParam = params.get('game_mode');
    if (gameModeParam) {
        if (Object.values(GameMode).includes(gameModeParam as GameMode)) {
            gameModeFilter = gameModeParam as GameMode;
        } else {
            console.error('Unrecognised game_mode parameter:', gameModeParam);
        }
    }

    return {
        name: nameFilter,
        difficulty: difficultyFilter,
        drag_select: dragSelectFilter,
        per_cell: perCellFilter,
        reach: reachFilter,
        game_mode: gameModeFilter,
    };
}

export function constructURLParams(filters: HighscoreFilters): URLSearchParams {
    const params = new URLSearchParams();
    if (filters.name) {
        params.set('name', filters.name);
    }
    params.set('difficulty', filters.difficulty);
    params.set('game_mode', filters.game_mode);
    params.set('reach', filters.reach.toString());
    if (filters.drag_select !== null) {
        params.set('drag_select', filters.drag_select ? '1' : '0');
    }
    if (filters.per_cell) {
        params.set('per_cell', filters.per_cell.toString());
    }
    return params;
}

export function constructApiURL(filters: HighscoreFilters, baseUrl?: string | URL): URL {
    let url = new URL(filters.name ? '/api/v1/highscores' : '/api/v1/highscores/ranks', baseUrl);
    url.search = constructURLParams(filters).toString();
    return url;
}

export function parseBoolean(value: string): boolean | null {
    if (value === 'true' || value === '1') {
        return true;
    } else if (value === 'false' || value === '0') {
        return false;
    } else {
        console.error('Invalid boolean value:', value);
        return null;
    }
}

export async function fetchHighscores(
    baseURL: URL,
    filters: HighscoreFilters,
): Promise<Highscore[]> {
    const apiUrl = constructApiURL(filters, baseURL);
    console.log('Fetching:', apiUrl.toString());
    const res = await fetch(apiUrl.toString());
    if (!res.ok) {
        throw new Error(`Failed to fetch highscores: ${res.statusText}`);
    }
    return await res.json();
}

export function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    return dateFormat(date, 'yyyy-MM-dd');
}
