<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { read } from "$app/server";
	import type { Product } from "../Models/Types/types";

	export let product: Product;
	
	const dispatch = createEventDispatcher();

	function removeProduct() {
		dispatch('remove');
	}

	let isNameValid = true;
	let isQuantityValid = true;
	let isTotalValid = true;
	

	export function validate(): boolean {
		isNameValid = !!product.name?.trim();
		isQuantityValid = !(product.quantity <= 0);
		isTotalValid = !(product.total <= 0);

		return isNameValid && isQuantityValid && isTotalValid;
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if(file) {
			const reader = new FileReader();
			reader.onload = () => {
				product.image = reader.result as string; // base64 data URL
				console.log(reader.result);
			}

			reader.readAsDataURL(file);
		}
	}

</script>

<div class="flex flex-col items-center rounded-md p-6
          text-center text-gray-800 shadow-sm hover:shadow-md">

	<img src={product.image} alt={product.name} class="h-40 w-40 object-cover rounded mb-2" />

	<label class="cursor-pointer text-blue-600 underline mb-2">
		Upload Image
		<input type="file" accept="image/*" on:change={handleFileChange} class="hidden" />
	</label>

	<h1 class="my-2 text-center text-2xl uppercase">Cost Price: {product.landedCostPerSingleItem.toFixed(2) ?? 0.00} $</h1>

<form>
    <div class="grid gap-6 mb-6 md:grid-cols-2 my-3">
        <div class="flex flex-col items-start">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name:</label>
            <input type="text" id="name" placeholder="Wired Mouse" required bind:value={product.name}
					class={`border text-gray-900 text-sm rounded-lg block w-full p-2.5
						  ${isNameValid ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500':
						  'border-red-500 focus:border-red-500 focus:ring-red-500' }
						   dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white`}/>

				{#if !isNameValid}
					<p class="text-red-500 text-sm mt-1">Name is required</p>
				{/if}

        </div>
		
		<div class="flex flex-col items-start">
            <label for="quantity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity:</label>
            <input type="number" id="quantity" min="0" required bind:value={product.quantity}
			class={`border text-gray-900 text-sm rounded-lg block w-full p-2.5
						  ${isQuantityValid ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500':
						  'border-red-500 focus:border-red-500 focus:ring-red-500' }
						   dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white`}/>
        
			{#if !isQuantityValid}
				<p class="text-red-500 text-sm mt-1">Must Be Greater Than Zero</p>
			{/if}
		</div>

		<div class="flex flex-col items-start">
			<!-- Total of the item but not per 1 piece price gross-->
            <label for="total" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total (No Freight):</label>
            <input type="number" id="total" min="0" required bind:value={product.total}
			class={`border text-gray-900 text-sm rounded-lg block w-full p-2.5
						  ${isTotalValid ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500':
						  'border-red-500 focus:border-red-500 focus:ring-red-500' }
						   dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white`}/>
		</div>

		<div class="flex flex-col items-start">
            <label for="freight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Freight Cost:</label>
            <input type="number" id="freight" required bind:value={product.freightCharge}
			class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        </div>

        <div class="flex flex-col items-start">
            <label for="transfer-fees" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">+Money Transfer Fees:</label>
			<span class="text-lg text-blue-700">{product.costAfterCharge} $</span> 
        </div>

		<div class="flex flex-col items-start">
			<label for="recvd" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Received:</label>
			<input name="recvd" type="checkbox" bind:checked={product.isReceived}
				class="h-5 w-5 rounded border-gray-300 accent-green-600 transition duration-150 focus:ring-2 focus:ring-green-500"
			/>
		</div>
        
    </div>

    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
			focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center 
			 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" on:click={removeProduct}>
			Remove Product
	</button>
	 

</form>



</div>
