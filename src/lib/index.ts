import type { Highscore, HighscoreFilters } from './types';

export * from './types';

export async function fetchHighscores(filters: HighscoreFilters): Promise<Highscore[]> {
    let apiUrl: URL;
    if (filters.name) {
        apiUrl = new URL('/api/v1/highscores', window.location.origin);
        apiUrl.searchParams.set('name', filters.name);
    } else {
        apiUrl = new URL('/api/v1/highscores/ranks', window.location.origin);
    }
    apiUrl.searchParams.set('difficulty', filters.difficulty);
    apiUrl.searchParams.set('reach', filters.reach.toString());
    apiUrl.searchParams.set('game_mode', filters.gameMode);
    if (filters.dragSelect != null) {
        apiUrl.searchParams.set('drag_select', filters.dragSelect ? "1" : "0");
    }
    if (filters.perCell) {
        apiUrl.searchParams.set('per_cell', filters.perCell.toString());
    }

    console.log("Fetching:", apiUrl.toString());
    const res = await fetch(apiUrl.toString());
    if (!res.ok) {
        throw new Error(`Failed to fetch highscores: ${res.statusText}`);
    }
    return await res.json();
}
