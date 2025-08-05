
<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Product } from "../Models/Types/types";
   
	export let product: Product;

	let isTotalValid: boolean = true;
	let isNameValid: boolean = true;
	let isQuantityValid: boolean = true;

	const dispatch = createEventDispatcher();

	function removeProduct() {
		dispatch('remove');
	}

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

<div class="flex flex-col items-center rounded-md p-6 text-center text-gray-800 shadow-sm hover:shadow-md">
	
    <img src={product.image} alt={product.name} class="mb-2 h-40 w-40 rounded object-cover" />

	<label class="mb-2 cursor-pointer text-blue-600 underline">
		Upload Image
		<input type="file" accept="image/*" on:change={handleFileChange} class="hidden" />
	</label>

	<h1 class="my-2 text-center text-2xl uppercase">
		Cost Price: {product.landedCostPerSingleItem.toFixed(2) ?? 0.0} $
	</h1>

	<div>
		<div class="my-3 mb-6 grid gap-6 md:grid-cols-2">
			<div class="flex flex-col items-start">
				<label for="name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
					Product Name:
				</label>

				<input
					type="text"
					id="name"
					placeholder="Wired Mouse"
					required
					bind:value={product.name}
					class={`block w-full rounded-lg border p-2.5 text-sm text-gray-900
						  ${
								isNameValid
									? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
									: 'border-red-500 focus:border-red-500 focus:ring-red-500'
							}
						   dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
				/>

				{#if !isNameValid}
					<p class="mt-1 text-sm text-red-500">Name is required</p>
				{/if}
			</div>

			<div class="flex flex-col items-start">
				<label for="quantity" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
					Quantity:
				</label>

				<input
					type="number"
					id="quantity"
					min="0"
					required
					bind:value={product.quantity}
					class={`block w-full rounded-lg border p-2.5 text-sm text-gray-900
						  ${
								isQuantityValid
									? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
									: 'border-red-500 focus:border-red-500 focus:ring-red-500'
							}
						   dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
				/>

				{#if !isQuantityValid}
					<p class="mt-1 text-sm text-red-500">Must Be Greater Than Zero</p>
				{/if}
			</div>

			<div class="flex flex-col items-start">
				<label for="total" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
					Total(Including Delivery):
				</label>
				<input
					type="number"
					id="total"
					min="0"
					required
					bind:value={product.total}
					class={`block w-full rounded-lg border p-2.5 text-sm text-gray-900
						  ${
								isTotalValid
									? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
									: 'border-red-500 focus:border-red-500 focus:ring-red-500'
							}
						   dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
				/>
			</div>

			<div class="flex flex-col items-start">
				<label
					for="delivery-charge"
					class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
				>
					Delivery Charge:
				</label>
				<input
					type="number"
					id="delivery-charge"
					required
					min="0"
					bind:value={product.deliveryCharge}
					class="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				/>
			</div>

			<div class="flex flex-col items-start">
				<label for="recvd" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
					Received:
				</label>

				<input
					name="recvd"
					type="checkbox"
					bind:checked={product.isReceived}
					class="h-5 w-5 rounded border-gray-300 accent-green-600 transition duration-150 focus:ring-2 focus:ring-green-500"
				/>
			</div>
		</div>
		<button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
			focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center 
			 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" on:click={removeProduct}>
			Remove Product
		</button>
	</div>
</div>
