<h1>Player {name}</h1>

<main>
    <!-- Highscores table UI -->
    <div class="highscores">
        <ol>
            {#each highscores as highscore, idx}
                <li>{idx + 1}. {highscore.name} - {highscore.elapsed.toFixed(2)}</li>
            {/each}
        </ol>
    </div>
</main>

<script lang="ts">
    import { page } from "$app/state";
    import { fetchHighscores, parseURLParams, type Highscore } from "$lib";

    let name: string = $state(page.params["name"]);
    let highscores: Highscore[] = $state([]);

    // TODO: Hack to get default filters
    const filters = parseURLParams(new URLSearchParams());
    filters.name = name;
    fetchHighscores(page.url, filters).then((res) => {
        console.log('Setting highscores');
        highscores = res;
    });
</script>
