<h1>Player {name}</h1>

{#snippet highscoresTable(filters: {
    drag_select: boolean | null;
    per_cell: number | null;
    reach: number;
    game_mode: GameMode;
})}
    <div class="difficulty-list">
        {#each Object.entries(Difficulty) as [diff_name, difficulty]}
            <div class="difficulty-container">
                <h4>{diff_name}</h4>
                <div class="highscores">
                    {#await fetchHighscores(page.url, { name, difficulty, ...filters })}
                        <p>Loading...</p>
                    {:then highscores}
                        <ol>
                            {#each highscores.slice(0, 5) as highscore, idx}
                                <li>
                                    {idx + 1}. {highscore.name} - {highscore.elapsed.toFixed(2)}
                                </li>
                            {/each}
                        </ol>
                    {/await}
                </div>
            </div>
        {/each}
    </div>
{/snippet}

<main>
    <section>
        <h2>Classic</h2>

        {@render highscoresTable({
            drag_select: false,
            per_cell: 1,
            reach: 8,
            game_mode: GameMode.Regular,
        })}
    </section>

    <section>
        <h2>Drag select</h2>

        {@render highscoresTable({
            drag_select: true,
            per_cell: 1,
            reach: 8,
            game_mode: GameMode.Regular,
        })}
    </section>

    <section>
        <h2>Multiple mines per cell</h2>

        {#each [2, 3] as per_cell}
            <h3>Max per cell: {per_cell}</h3>
            {@render highscoresTable({
                drag_select: null,
                per_cell,
                reach: 8,
                game_mode: GameMode.Regular,
            })}
        {/each}
    </section>

    <section>
        <h2>Reach</h2>

        {#each [4, 24] as reach}
            <h3>Reach: {reach}</h3>
            {@render highscoresTable({
                drag_select: null,
                per_cell: null,
                reach,
                game_mode: GameMode.Regular,
            })}
        {/each}
    </section>

    <section>
        <h2>Split cell</h2>

        {@render highscoresTable({
            drag_select: null,
            per_cell: null,
            reach: 8,
            game_mode: GameMode.SplitCell,
        })}
    </section>
</main>

<script lang="ts">
    import { page } from '$app/state';
    import { Difficulty, GameMode, fetchHighscores } from '$lib';

    let name: string = $state(page.params['name']);
</script>

<style>
    /* Ensure the main element fills more of the screen */
    main {
        display: flex;
        flex-direction: column; /* Stack sections vertically */
        flex-grow: 1; /* Allow main to grow and fill available space */
        margin: 1rem auto; /* Center the main content with some vertical margin */
        width: 90vw; /* Use 90% of the viewport width on larger screens */
        padding: 1rem; /* Add padding for spacing */
        box-sizing: border-box; /* Include padding and borders in dimensions */
    }

    /* Ensure each section inside main takes some space */
    main > section {
        flex: 1; /* Allow sections to grow equally if space is available */
        margin-bottom: 2rem; /* Space between sections */
    }

    /* Container for difficulty tables to allow side-by-side layout */
    .difficulty-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Equal-width columns */
        gap: 1rem; /* Space between tables */
    }

    /* Individual difficulty container styling */
    .difficulty-container {
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        padding: 1rem;
        background-color: #f9f9f9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column; /* Ensure child content stacks vertically */
        box-sizing: border-box; /* Include padding and border in width */
        overflow: visible; /* Ensure contents aren't clipped */
        height: auto; /* Allow the container to grow with its content */
        min-height: 0; /* Prevent flexbox from imposing an incorrect minimum height */
    }

    /* Style for difficulty headers */
    .difficulty-container h4 {
        margin-bottom: 0.5rem;
        text-align: center;
        font-size: 1.2rem;
        color: #333;
    }

    /* Optional: Improve loading state appearance */
    .difficulty-container p {
        text-align: center;
        font-style: italic;
        color: #666;
    }

    /* Add responsive adjustments for smaller screens */
    @media (max-width: 768px) {
        .difficulty-list {
            flex-direction: column; /* Stack tables vertically on narrow screens */
        }

        .difficulty-container {
            max-width: 100%; /* Allow full width for narrow layouts */
        }
    }
</style>
