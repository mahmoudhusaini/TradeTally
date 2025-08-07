

<script lang="ts">

	// Csv saved in a component page to be always displayed

	import Card from '../Components/Card.svelte';
	import { TransportationType } from '../Models/Enums/enums';
	import type { Product } from '../Models/Types/types';
	import { getExcelContent } from '../Models/Utilities/utilities';

	let isPercentageValid: boolean = true;
	let isFreightFeesValid: boolean = true;
	let isWeightValid: boolean = true;
	let isGoodsCostValid: boolean = true;

	type ShipmentDetails = {
		supplierName: string,
		isSupplierNameValid: boolean,
		moneyTransferPercentage: number;
		freightFees: number; // Per 1 KG
		totalWeight: number;
		goodsCostOnly: number; 
	};

	let shipmentDetails: ShipmentDetails = {
		supplierName: '',
		isSupplierNameValid: true,
		moneyTransferPercentage: 0,
		freightFees: 0,
		totalWeight: 0, 
		goodsCostOnly: 0, 
	};
	
	$: overallFreightCharges = shipmentDetails.freightFees * shipmentDetails.totalWeight;
	$: afterFreightCharges = shipmentDetails.goodsCostOnly + overallFreightCharges;
	// After Money Transfer Percentage
	$: afterAddedPercentage = (afterFreightCharges) + ((afterFreightCharges) * (shipmentDetails.moneyTransferPercentage / 100));

	let cards: any[] = []; // holds references to each Card component

	let counter: number = 0;

	let products: Product[] = [];

	let isSubmitDisabled = true;

	let isFreightFeesMatching: boolean = true;
	let isShipmentCostMatching: boolean = true;

	function addNewProduct() {
		const newProduct: Product = {
			id: counter++,
			name: '',
			image: '/assets/images/placeholder-product-image.jpg',
			quantity: 0,
			total: 0,
			isLocal: false,
			transportationType: TransportationType.ByAir,
			freightCharge: 0,
			costAfterCharge: 0,
			deliveryCharge: 0,
			landedCostPerSingleItem: 0,
			isReceived: false
		};

		products = [...products, newProduct];
	}

	function removeProduct(id: number) {
		const index = products.findIndex((p) => p.id === id); // .findIndex(predicate) takes a predicate and returns number

		// findIndex(...) returns the
		//  index of the first matching item in the array.

		// If no item is found, it returns -1.

		// So:

		// index !== -1 → item was found ✅

		// index === -1 → item not found ❌

		if (index !== -1) {
			// Is the item exists in the array.
			// If The item was found in the array
			products.splice(index, 1); // remove it
			cards.splice(index, 1); // Also keeps cards[] in sync
			products = [...products]; // trigger reactivity
		}
	}

	function validateAndCalculate() {

		let allValid: boolean = true;

		shipmentDetails.isSupplierNameValid = shipmentDetails.supplierName.trim() !== '';
		isPercentageValid = shipmentDetails.moneyTransferPercentage > 0;
		isFreightFeesValid = shipmentDetails.freightFees > 0;
		isWeightValid = shipmentDetails.totalWeight > 0;
		isGoodsCostValid = shipmentDetails.goodsCostOnly > 0;

		if (!isPercentageValid || !isFreightFeesValid || !isWeightValid || !isGoodsCostValid || !shipmentDetails.isSupplierNameValid) {
			allValid = false;
			isSubmitDisabled = true;
			// To Do: Error Toaster or error message makes client know there is something missing
		}

		if(cards.length < 1) { 
			allValid = false;
			isSubmitDisabled = true;
			// To Do: Error Toaster or error message makes client know there is something missing
			return;
		}


		for (const card of cards) {
			if (!card.validate()) {
				allValid = false;
				isSubmitDisabled = true;
			}
		}

		if (allValid) {
			isSubmitDisabled = false;
		}
	}

	async function submit() {
		

		console.log(`Supposed to be: ${overallFreightCharges} and` + afterAddedPercentage);


		let freightChargePerItem: number = 0;
		let totalPerItemAfterPercentage: number = 0;

		products = products.map((product) => {

				const afterCharges =
					product.total +
					product.freightCharge +
					(product.total + product.freightCharge) * (shipmentDetails.moneyTransferPercentage / 100);


				freightChargePerItem += product.freightCharge;
				totalPerItemAfterPercentage += afterCharges;	

				return {
					...product,
					costAfterCharge: afterCharges,
					landedCostPerSingleItem: afterCharges / product.quantity
				};
			});


		isFreightFeesMatching = overallFreightCharges === freightChargePerItem;
		isShipmentCostMatching = afterAddedPercentage === totalPerItemAfterPercentage;
		
		if (isFreightFeesMatching && isShipmentCostMatching) {
			getExcelContent(shipmentDetails.supplierName, products, TransportationType.ByAir);

		} else {
			isSubmitDisabled = true;
		}
	}
</script>

<!-- Widgets Grid -->
<div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	<div class="rounded-lg bg-white p-6 shadow transition hover:shadow-md">
		<h3 class="mb-2 text-lg font-semibold text-gray-700">📦 Total Products</h3>
		<p class="text-2xl font-bold text-indigo-600">124</p>
	</div>
	<div class="rounded-lg bg-white p-6 shadow transition hover:shadow-md">
		<h3 class="mb-2 text-lg font-semibold text-gray-700">🚚 Shipments</h3>
		<p class="text-2xl font-bold text-green-600">18</p>
	</div>
	<div class="rounded-lg bg-white p-6 shadow transition hover:shadow-md">
		<h3 class="mb-2 text-lg font-semibold text-gray-700">💵 Revenue</h3>
		<p class="text-2xl font-bold text-emerald-600">$12,450</p>
	</div>
</div>

<!-- Action Panel -->
<div class="mb-6 rounded-lg bg-white p-6 shadow">
	<h4 class="mb-4 text-xl font-semibold text-gray-800">Quick Actions</h4>
	<div class="flex flex-wrap gap-4">
		<button
			on:click={addNewProduct}
			class="cursor-pointer rounded-lg bg-blue-500 px-5 py-2.5 text-white transition hover:bg-blue-700"
		>
			+ New Product
		</button>

		<button
			class="cursor-pointer rounded-lg bg-blue-500 px-5 py-2.5 text-white transition"
			on:click={validateAndCalculate}
		>
			Validate and Calculate
		</button>

		<button
			class="rounded-lg bg-green-600 px-5 py-2.5 text-white transition
					  	{isSubmitDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
			disabled={isSubmitDisabled}
			on:click={submit}
		>
			Submit
		</button>
	</div>
</div>

<!-- Shipment Details -->
<div class="rounded-lg bg-white p-6 shadow">
	<h4 class="mb-4 text-xl font-semibold text-gray-800">Shipment Details</h4>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">


		 <div class="flex flex-col">
			<label for="supplier-name" class="mb-1 text-sm font-medium text-gray-700">
				Supplier Name
			</label>
			<input
				bind:value={shipmentDetails.supplierName}
				id="supplier-name"
				type="text"
				placeholder="e.g. AY COMPUTERS"
				class={shipmentDetails.isSupplierNameValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !shipmentDetails.isSupplierNameValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>


		<div class="flex flex-col">
			<label for="transfer" class="mb-1 text-sm font-medium text-gray-700">
				Money Transfer Percentage (%)
			</label>
			<input
				bind:value={shipmentDetails.moneyTransferPercentage}
				id="transfer"
				type="number"
				placeholder="e.g. 3"
				class={isPercentageValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !isPercentageValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="freight" class="mb-1 text-sm font-medium text-gray-700">
				Freight Fees per 1 KG
			</label>
			<input
				bind:value={shipmentDetails.freightFees}
				id="freight"
				type="number"
				placeholder="e.g. 5"
				class={isFreightFeesValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !isFreightFeesValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="weight" class="mb-1 text-sm font-medium text-gray-700">
				Total Weight of Shipment (KG)
			</label>
			<input
				bind:value={shipmentDetails.totalWeight}
				id="weight"
				type="number"
				placeholder="e.g. 300"
				class={isWeightValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !isWeightValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="total-amount" class="mb-1 text-sm font-medium text-gray-700">
				Base Cost of Goods (USD)
			</label>
			<input
				bind:value={shipmentDetails.goodsCostOnly}
				id="total-cost"
				type="number"
				placeholder="e.g. 4500"
				class={isGoodsCostValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !isGoodsCostValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		 <div class="flex flex-col">
			<label for="calculated-freight-Cost" class="mb-1 text-sm font-medium text-gray-700">
				 Freight Fees
			</label>
            <span class="text-lg text-blue-700">{overallFreightCharges} $</span>
		</div>

		<div class="flex flex-col">
			<label for="calculated-freight-Cost" class="mb-1 text-sm font-medium text-gray-700">
				 +Freight Charges
			</label>
            <span class="text-lg text-blue-700">{afterFreightCharges} $</span>
		</div>

		<div class="flex flex-col">
			<label for="calculated-freight-Cost" class="mb-1 text-sm font-medium text-gray-700">
				 +Money Transfer Fees:
			</label>
            <span class="text-lg text-blue-700">{afterAddedPercentage} $</span>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6">
		{#if !isFreightFeesMatching}
			<span class="mt-1 text-lg text-red-500">
				Total Product Freight Cost Doesn't Align With The Shipment's Freight Cost.
			</span>
		{/if}

		{#if !isShipmentCostMatching}
			<span class="mt-1 text-lg text-red-500">
				Total Products Cost Doesn't Align With The Shipment Total Cost.
			</span>
		{/if}
	</div>
</div>

<!-- Products Cards -->
<div class="my-6 rounded-lg bg-white p-6 shadow">
	<h4 class="mb-4 text-xl font-semibold text-gray-800">Products</h4>
	<div class="mx-6 grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-2">
		{#each products as product, id (product.id)}
			<Card {product} bind:this={cards[id]} on:remove={() => removeProduct(product.id)} />
		{/each}
	</div>
</div>
