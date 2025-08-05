<script lang="ts">

	import ProductLocal from "../../Components/ProductLocal.svelte";
	import { TransportationType } from "../../Models/Enums/enums";
	import type { Product } from "../../Models/Types/types";
	import { getExcelContent } from "../../Models/Utilities/utilities";


	type LocalOrderDetails = {
		supplierName: string,
		isSupplierNameValid: boolean,
		deliveryCharges: number;
		isDeliveryChargesValid: boolean;
		totalCost: number;
		isTotalCostValid: boolean;
	};

	let localOrderDetails: LocalOrderDetails = {
		supplierName: '',
		isSupplierNameValid: true,
		deliveryCharges: 0,
		isDeliveryChargesValid: true,
		totalCost: 0,
		isTotalCostValid: true
	};
	let cards: any[] = []; // holds references to each Card component
	$: noDeliveryCost = localOrderDetails.totalCost - localOrderDetails.deliveryCharges;

	// Table Supplier id-name-Enum:local-orderCounter

	let isSubmitDisabled: boolean = true;
    let counter: number = 0;
    let products: Product[] = [];

	let isTotalMatching: boolean = true;
	let isDeliveryChargeMatching: boolean = true;


	function addNewProduct() {
        let newProduct: Product = {
            id: counter++,
			name: '',
			image: '/assets/images/placeholder-product-image.jpg',
			quantity: 0,
			total: 0,
			isLocal: true,
			transportationType: TransportationType.Local,
			freightCharge: 0,
			costAfterCharge: 0,
			deliveryCharge: 0,
			landedCostPerSingleItem: 0,
			isReceived: false
        };

        products = [...products, newProduct]
    }

	function validateAndCalculate() {

		let allValid: boolean = true;

		localOrderDetails.isSupplierNameValid = localOrderDetails.supplierName.trim() !== '';
		localOrderDetails.isDeliveryChargesValid = localOrderDetails.deliveryCharges >= 0;
		localOrderDetails.isTotalCostValid = localOrderDetails.totalCost > 0;

		if(!localOrderDetails.isSupplierNameValid || !localOrderDetails.isDeliveryChargesValid || !localOrderDetails.isTotalCostValid) {
			allValid = false;
			// isSubmitDisabled = true;
		}

		for (const card of cards) {
			if(!card.validate()) {
				allValid = false;
				isSubmitDisabled = true;
			}
		}

		if(cards.length < 1) { 
			allValid = false;
		}

		if(allValid) {
			isSubmitDisabled = false;
		}

	}

	function submit() {

		let totalDeliveryCharge: number = 0;
		let totalAmount: number =  0;
		
		products = products.map((product) => {
			totalDeliveryCharge += product.deliveryCharge;
			totalAmount += product.total; // includes delivery

			return {
				...product,
				landedCostPerSingleItem: product.costAfterCharge / product.quantity
			};
		});
		

		isDeliveryChargeMatching = localOrderDetails.deliveryCharges === totalDeliveryCharge;
		isTotalMatching = localOrderDetails.totalCost === totalAmount;
		
		if(isDeliveryChargeMatching && isTotalMatching) {

			getExcelContent(localOrderDetails.supplierName, products, TransportationType.Local);

		}

	}


	function removeProduct(id: number): void {
		const index = products.findIndex((p) => p.id === id); 

		if (index !== -1) {
			products.splice(index, 1);
			cards.splice(index, 1); 
			products = [...products];
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
		<h3 class="mb-2 text-lg font-semibold text-gray-700">🚚 Orders</h3>
		<p class="text-2xl font-bold text-green-600">18</p>
	</div>
	<div class="rounded-lg bg-white p-6 shadow transition hover:shadow-md">
		<h3 class="mb-2 text-lg font-semibold text-gray-700">💵 COGS</h3>
		<!-- Cost Of Goods -->
		<p class="text-2xl font-bold text-emerald-600">$10,000</p>
	</div>
	<div class="rounded-lg bg-white p-6 shadow transition hover:shadow-md">
		<h3 class="mb-2 text-lg font-semibold text-gray-700">💵 Profit</h3>
		<p class="text-2xl font-bold text-emerald-600">$2,450</p>
	</div>
</div>

<!-- Action Panel -->
<div class="mb-6 rounded-lg bg-white p-6 shadow">
	<h4 class="mb-4 text-xl font-semibold text-gray-800">Actions</h4>
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
			Export CSV
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
				bind:value={localOrderDetails.supplierName}
				id="supplier-name"
				type="text"
				placeholder="e.g. AY COMPUTERS"
				class={localOrderDetails.isSupplierNameValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !localOrderDetails.isSupplierNameValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="total-cost" class="mb-1 text-sm font-medium text-gray-700">
				Base Products Cost (USD)
			</label>
			<input
				bind:value={localOrderDetails.totalCost}
				id="total-cost"
				type="number"
				placeholder="e.g. 4500"
				class={localOrderDetails.isTotalCostValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !localOrderDetails.isTotalCostValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="delivery-charges" class="mb-1 text-sm font-medium text-gray-700">
				Delivery Charges (USD)
			</label>
			<input
				bind:value={localOrderDetails.deliveryCharges}
				id="delivery-charges"
				type="number"
				placeholder="e.g. 3"
				class={localOrderDetails.isDeliveryChargesValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !localOrderDetails.isDeliveryChargesValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		<div class="flex flex-col">
				<label for="no-delivery-cost" class="mb-1 text-sm font-medium text-gray-700">
					Total After Delivery (USD):
				</label>
			{#if localOrderDetails.isDeliveryChargesValid && localOrderDetails.isTotalCostValid}
				<span id="no-delivery-cost" class="mt-1 text-lg text-blue-700">
					    {noDeliveryCost}
				</span>
			{/if}
		</div>
	</div>


	<div class="grid grid-cols-1 gap-6">
		{#if !isDeliveryChargeMatching}
			<span class="mt-1 text-lg text-red-500">
				Total Product Delivery Charge Doesn't Align With The Order Delivery.
			</span>
		{/if}

		{#if !isTotalMatching}
			<span class="mt-1 text-lg text-red-500">
				Total Products Cost Doesn't Align With The Order Total Cost.
			</span>
		{/if}
	</div>

</div>




<!-- Products Cards -->
<div class="my-6 rounded-lg bg-white p-6 shadow">
	<h4 class="mb-4 text-xl font-semibold text-gray-800">Products</h4>
	<div class="mx-6 grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-2">
		{#each products as product, id (product.id)}
			<ProductLocal {product} bind:this={cards[id]} on:remove={() => removeProduct(product.id)}/>
		{/each}
	</div>
</div>
