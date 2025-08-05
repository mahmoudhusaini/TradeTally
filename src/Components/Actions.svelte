
<script lang="ts">


    export let isSubmitDisabled: boolean = true;
    export let validateAndCalculate: () => void;
    export let addNewProduct: () => void;
    export let submit: () => void;

</script>


<!-- Action Panel -->
<div class="mb-6 rounded-lg bg-white p-6 shadow">
	<h4 class="mb-4 text-xl font-semibold text-gray-800">Actions</h4>
	<div class="flex flex-wrap gap-4">
		<button class="cursor-pointer rounded-lg bg-blue-500 px-5 py-2.5 text-white transition hover:bg-blue-700" on:click={addNewProduct}>
			+ New Product
		</button>

		<button class="cursor-pointer rounded-lg bg-blue-500 px-5 py-2.5 text-white transition" on:click={validateAndCalculate}>
            Validate and Calculate
		</button>

		<button class="rounded-lg bg-green-600 px-5 py-2.5 text-white transition
					  	{isSubmitDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
			    disabled={isSubmitDisabled}
			    on:click={submit}>

			Export CSV
		</button>
	</div>
</div>