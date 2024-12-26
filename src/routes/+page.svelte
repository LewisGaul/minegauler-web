<h1>Minegauler Highscores</h1>

<!-- Filtering UI -->
<div>
    <label for="difficulty">Filter by difficulty:</label>
    <select id="difficulty" bind:value={difficultyFilter}>
        {#each Object.entries(Difficulty) as [diff_name, diff_val]}
            <option value={diff_val}>{diff_name.toLowerCase()}</option>
        {/each}
    </select>
</div>
<div>
    <label for="drag-select">Filter by drag select:</label>
    <select id="drag-select" bind:value={dragSelectFilter}>
        <option value={null}></option>
        <option value={true}>on</option>
        <option value={false}>off</option>
    </select>
</div>
<div>
    <label for="per-cell">Filter by max mines per cell:</label>
    <select id="per-cell" bind:value={perCellFilter}>
        <option value={null}></option>
        {#each [1, 2, 3] as per_cell}
            <option value={per_cell}>{per_cell}</option>
        {/each}
    </select>
</div>
<div>
    <label for="reach">Filter by reach:</label>
    <select id="reach" bind:value={reachFilter}>
        {#each [4, 8, 24] as reach}
            <option value={reach}>{reach}</option>
        {/each}
    </select>
</div>
<div>
    <label for="game-mode">Filter by game mode:</label>
    <select id="game-mode" bind:value={gameModeFilter}>
        {#each Object.values(GameMode) as mode}
            <option value={mode}>{mode}</option>
        {/each}
    </select>
</div>
<div>
    <label for="player-name">Filter by player name:</label>
    <input
        id="player-name"
        type="text"
        placeholder="Enter player name"
        bind:value={tempNameFilter}
        on:blur={() => nameFilter = tempNameFilter}
        on:keydown={(e) => e.key === 'Enter' && (nameFilter = tempNameFilter)}
    />
</div>

<!-- Highscores table UI -->
<ul>
    {#each highscores as highscore}
        <li>{highscore.name} - {highscore.elapsed.toFixed(2)}</li>
    {/each}
</ul>

<!-- Svelte scripting -->
<script lang="ts">
    import type { Highscore, HighscoreFilters } from '$lib';
    import { Difficulty, GameMode, fetchHighscores } from '$lib';

    let highscores: Highscore[] = [];
    let nameFilter: string | null = null;
    let tempNameFilter: string = "";
    let difficultyFilter: Difficulty = Difficulty.Expert;
    let dragSelectFilter: boolean | null = null;
    let perCellFilter: number | null = 1;
    let reachFilter: number = 8;
    let gameModeFilter: GameMode = GameMode.Regular;

    // Define the filters object that will automatically update when filter variables change
    let filters: HighscoreFilters;
    $: filters = {
        name: nameFilter,
        difficulty: difficultyFilter,
        dragSelect: dragSelectFilter,
        perCell: perCellFilter,
        reach: reachFilter,
        gameMode: gameModeFilter,
    };

    // Fetch highscores when component is mounted or when filters change
    $: {
        fetchHighscores(filters).then(fetchedHighscores => {
            highscores = fetchedHighscores;
        }).catch(error => {
            console.error('Failed to fetch highscores', error);
        });
    }
</script>
