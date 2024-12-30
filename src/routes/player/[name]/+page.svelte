<h1>Player {name}</h1>

<main>
    <section>
        <h2>Classic</h2>

        <div class="difficulty-list">
            {#each Object.entries(Difficulty) as [diff_name, difficulty]}
                <div class="difficulty-container">
                    <h4>{diff_name}</h4>
                    <div class="highscores">
                        {#await fetchHighscores( page.url, { name, drag_select: false, reach: 8, per_cell: 1, difficulty, game_mode: GameMode.Regular }, )}
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
    </section>

    <section>
        <h2>Drag select</h2>
        <div class="difficulty-list">
            {#each Object.entries(Difficulty) as [diff_name, difficulty]}
                <div class="difficulty-container">
                    <h4>{diff_name}</h4>
                    <div class="highscores">
                        {#await fetchHighscores( page.url, { name, drag_select: true, reach: 8, per_cell: 1, difficulty, game_mode: GameMode.Regular }, )}
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
    </section>

    <section>
        <h2>Multiple mines per cell</h2>

        {#each [2, 3] as per_cell}
            <h3>Max per cell: {per_cell}</h3>
            <div class="difficulty-list">
                {#each Object.entries(Difficulty) as [diff_name, difficulty]}
                    <div class="difficulty-container">
                        <h4>{diff_name}</h4>
                        <div class="highscores">
                            {#await fetchHighscores( page.url, { name, drag_select: null, reach: 8, per_cell, difficulty, game_mode: GameMode.Regular }, )}
                                <p>Loading...</p>
                            {:then highscores}
                                <ol>
                                    {#each highscores.slice(0, 5) as highscore, idx}
                                        <li>
                                            {idx + 1}. {highscore.name} - {highscore.elapsed.toFixed(
                                                2,
                                            )}
                                        </li>
                                    {/each}
                                </ol>
                            {/await}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </section>

    <section>
        <h2>Reach</h2>

        {#each [4, 24] as reach}
            <h3>Reach: {reach}</h3>
            <div class="difficulty-list">
                {#each Object.entries(Difficulty) as [diff_name, difficulty]}
                    <div class="difficulty-container">
                        <h4>{diff_name}</h4>
                        <div class="highscores">
                            {#await fetchHighscores( page.url, { name, drag_select: null, reach, per_cell: 1, difficulty, game_mode: GameMode.Regular }, )}
                                <p>Loading...</p>
                            {:then highscores}
                                <ol>
                                    {#each highscores.slice(0, 5) as highscore, idx}
                                        <li>
                                            {idx + 1}. {highscore.name} - {highscore.elapsed.toFixed(
                                                2,
                                            )}
                                        </li>
                                    {/each}
                                </ol>
                            {/await}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </section>

    <section>
        <h2>Split cell</h2>

        <div class="difficulty-list">
            {#each Object.entries(Difficulty) as [diff_name, difficulty]}
                <div class="difficulty-container">
                    <h4>{diff_name}</h4>
                    <div class="highscores">
                        {#await fetchHighscores( page.url, { name, drag_select: null, reach: 8, per_cell: 1, difficulty, game_mode: GameMode.SplitCell }, )}
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
    </section>
</main>

<script lang="ts">
    import { page } from '$app/state';
    import { Difficulty, GameMode, fetchHighscores } from '$lib';

    let name: string = $state(page.params['name']);
</script>

<style>
    /* This ensures the sections inside the container appear below each other */
    section {
        display: block; /* Ensure sections are treated as block-level elements */
        margin-bottom: 2rem; /* Adds space between each section */
    }

    .difficulty-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem; /* Adds space between the blocks */
        justify-content: flex-start;
        margin: 0 -1.5rem; /* Compensates for the gap on the container's sides */
    }

    .difficulty-container {
        display: flex;
        flex-direction: column; /* Stack <h4> above the <div> */
        flex: 1 1 18%; /* Ensures the containers take up about 18% of the width */
        max-width: 20%; /* Optional: ensures each block doesn’t exceed 20% of the container width */
        min-width: 200px; /* Ensures the containers don't shrink too much */
        box-sizing: border-box; /* Includes padding and borders in the element's total width */
    }

    .difficulty-container h4 {
        margin-top: 0;
        margin-bottom: 0.5rem; /* Optional: spacing between <h4> and <div> */
    }

    .difficulty-container .highscores {
        flex-grow: 1;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between; /* Distributes space to fit the content */
    }

    .difficulty-container .highscores ol {
        padding-left: 1rem; /* Adds padding to the left of the list */
        margin: 0; /* Resets the margin */
        list-style-position: inside; /* Aligns the list numbers with the content */
        max-height: calc(100vh - 200px); /* Limits height of the <ol> based on the viewport */
        overflow-y: auto; /* Adds scroll if the list is too long */
        flex-grow: 1; /* Allows the <ol> to grow to take up the available space */
    }
</style>
