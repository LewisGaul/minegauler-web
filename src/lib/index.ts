import type { Highscore, HighscoreFilters } from './types';

export * from './types';

export async function fetchHighscores(filters: HighscoreFilters): Promise<Highscore[]> {
    const apiUrl = new URL('/api/v1/highscores', window.location.origin);
    if (filters.name) {
        apiUrl.searchParams.set('name', filters.name);
    }
    if (filters.difficulty) {
        apiUrl.searchParams.set('difficulty', filters.difficulty);
    }
    if (filters.dragSelect != null) {
        apiUrl.searchParams.set('drag_select', filters.dragSelect ? "1" : "0");
    }
    if (filters.perCell) {
        apiUrl.searchParams.set('per_cell', filters.perCell.toString());
    }
    apiUrl.searchParams.set('reach', filters.reach.toString());
    apiUrl.searchParams.set('game_mode', filters.gameMode);

    console.log("Fetching:", apiUrl.toString());
    const res = await fetch(apiUrl.toString());  // Use the stringified URL with query params
    if (!res.ok) {
        throw new Error(`Failed to fetch highscores: ${res.statusText}`);
    }
    return await res.json();
}
