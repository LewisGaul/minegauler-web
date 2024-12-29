<h1>Minegauler Highscores</h1>

<!-- Filtering UI -->
<div>
    <label for="difficulty">Filter by difficulty:</label>
    <select id="difficulty" bind:value={filters.difficulty} onchange={() => updateURL()}>
        {#each Object.entries(Difficulty) as [diff_name, diff_val]}
            <option value={diff_val}>{diff_name.toLowerCase()}</option>
        {/each}
    </select>
</div>
<div>
    <label for="drag-select">Filter by drag select:</label>
    <select id="drag-select" bind:value={filters.drag_select} onchange={() => updateURL()}>
        <option value={null}></option>
        <option value={true}>on</option>
        <option value={false}>off</option>
    </select>
</div>
<div>
    <label for="per-cell">Filter by max mines per cell:</label>
    <select id="per-cell" bind:value={filters.per_cell} onchange={() => updateURL()}>
        <option value={null}></option>
        {#each [1, 2, 3] as per_cell}
            <option value={per_cell}>{per_cell}</option>
        {/each}
    </select>
</div>
<div>
    <label for="reach">Filter by reach:</label>
    <select id="reach" bind:value={filters.reach} onchange={() => updateURL()}>
        {#each [4, 8, 24] as reach}
            <option value={reach}>{reach}</option>
        {/each}
    </select>
</div>
<div>
    <label for="game-mode">Filter by game mode:</label>
    <select id="game-mode" bind:value={filters.game_mode} onchange={() => updateURL()}>
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
        bind:value={nameFilterInput}
        onblur={() => (filters.name = nameFilterInput) && updateURL()}
        onkeydown={(e) => e.key === 'Enter' && (filters.name = nameFilterInput) && updateURL()}
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
    import { pushState, replaceState } from '$app/navigation';
    import { page } from '$app/state';
    import type { Highscore, HighscoreFilters } from '$lib';
    import {
        constructURLParams,
        Difficulty,
        fetchHighscores,
        GameMode,
        parseURLParams,
    } from '$lib';
    import { onMount, tick, untrack } from 'svelte';

    const initialFilters = parseURLParams(page.url.searchParams);
    let nameFilterInput: string = $state.raw(initialFilters.name || '');

    // Reactive variables
    let filters: HighscoreFilters = $state(initialFilters);
    let highscores: Highscore[] = $state([]);

    // Handle initialisation, setting filters in URL query params
    let initialised = false;

    function updateURL(push: boolean = true): void {
        const newURLParams = constructURLParams(filters);
        const newURL = new URL(page.url);
        newURL.search = newURLParams.toString();
        if (push) {
            console.log('pushState() with:', newURL.toString());
            pushState(newURL, page.state);
        } else {
            console.log('replaceState() with:', newURL.toString());
            replaceState(newURL, page.state);
        }
    }

    // Initialisation on client side
    onMount(async () => {
        console.log("onMount()");
        await tick();
        updateURL(false);
        console.log("Initialised");
        initialised = true;
    })

    // Response to filters changing (selected by user or from URL)
    $effect(() => {
        console.log('Filters:', JSON.stringify(filters));

        untrack(() => {
            // Don't update the URL here because this can be triggered by the
            // browser back button!

            console.log('Updating highscores');
            fetchHighscores(page.url, filters).then((res) => {
                console.log('Setting highscores');
                highscores = res;
            });
        })
    });

    // Response to page URL changing (back/forward button pressed)
    $effect(() => {
        console.log('Page URL:', page.url.toString());

        untrack(() => {
            // Svelte's 'page.url' state doesn't seem to work properly on back
            // button, giving multiple steps back...
            const pageURL = new URL(window.location.href);
            const newFilters = parseURLParams(pageURL.searchParams);
            if (JSON.stringify(filters) !== JSON.stringify(newFilters)) {
                console.log('New filters from URL:', JSON.stringify(newFilters));
                filters = newFilters;  // Trigger reactivity on the 'filters' state
                nameFilterInput = newFilters.name || "";
            }
        })
    });

</script>
