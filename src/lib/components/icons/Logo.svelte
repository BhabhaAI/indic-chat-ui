<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_APP_ASSETS, PUBLIC_APP_NAME, PUBLIC_ORIGIN } from "$env/static/public";
	import { base } from "$app/paths";

	export let classNames = "";
	export let size = "small";
</script>


<img
    class={classNames}
    alt="{PUBLIC_APP_NAME} logo"
    src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/{size === 'large' ? 'logo_large.webp' : 'logo.webp'}"
/>