<script lang="ts">
	import { marked } from "marked";
	import terms from "../../../TERMS.md?raw";
</script>

<div class="overflow-auto p-6">
	<div class="prose mx-auto px-4 pb-24 pt-6 dark:prose-invert md:pt-12">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html marked(terms, { gfm: true })}
	</div>
</div>
