<script lang="ts">
	import Actions from "../../Components/Actions.svelte";
	import ProductLocal from "../../Components/ProductLocal.svelte";
	import { TransportationType } from "../../Models/Enums/enums";
	import type { Product } from "../../Models/Types/types";
	import { getExcelContent } from "../../Models/Utilities/utilities";
    

    type LocalOrderDetails = {
		supplierName: string,
		isSupplierNameValid: boolean,
		deliveryCharges: number;
		isDeliveryChargesValid: boolean;
		totalAfterDelivery: number;
		istotalAfterDeliveryValid: boolean;
	};

	let localOrderDetails: LocalOrderDetails = {
		supplierName: '',
		isSupplierNameValid: true,
		deliveryCharges: 0,
		isDeliveryChargesValid: true,
		totalAfterDelivery: 0,
		istotalAfterDeliveryValid: true
	};

	// For Order Details

	$: baseNoDeliveryCost = localOrderDetails.totalAfterDelivery - localOrderDetails.deliveryCharges;


    let products: Product[] = [];
	let cards: any[] = [];
    let counter: number = 0;

	let isTotalAfterDeliveryMatching: boolean = true;
	let isDeliveryChargeMatching: boolean = true;

    let isSubmitDisabled: boolean = true;

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


    function validate() {
        
		let continueToExport: boolean = true;

		if(cards.length < 1) { 
			continueToExport = false;
			isSubmitDisabled = true;
			// To Do: Error Toaster or error message makes client know there is something missing
			return;
		}

		localOrderDetails.isSupplierNameValid = localOrderDetails.supplierName.trim() !== '';
		localOrderDetails.isDeliveryChargesValid = localOrderDetails.deliveryCharges >= 0;
		localOrderDetails.istotalAfterDeliveryValid = localOrderDetails.totalAfterDelivery > 0;

		if(!localOrderDetails.isSupplierNameValid ||
		   !localOrderDetails.isDeliveryChargesValid ||
		   !localOrderDetails.istotalAfterDeliveryValid) {

			continueToExport = false;
			isSubmitDisabled = true;
		}

		for (const card of cards) {
			if(!card.validate()) {
				continueToExport = false;
				isSubmitDisabled = true;
			}
		}

		if(continueToExport) {
			// products = products.map((product) => {
			// 	const percentage =
			// 		product.total +
			// 		product.freightCharge +
			// 		(product.total + product.freightCharge) ;

			// 	return {
			// 		...product,
			// 		costAfterCharge: percentage,
			// 		landedCostPerSingleItem: percentage / product.quantity
			// 	};
			// });

			// To Do: Can Export Csv Now

			isSubmitDisabled = false;
		}

    }

	function submit() {

		let totalDeliveryCharge: number = 0; 
		let totalCostAfterDelivery: number = 0; // Amount Due

		products = products.map((product) => {
			totalDeliveryCharge += product.deliveryCharge;
			totalCostAfterDelivery += product.costAfterCharge; 

			return {
				...product,
				landedCostPerSingleItem: product.costAfterCharge / product.quantity
			};
		});
		
		isDeliveryChargeMatching = localOrderDetails.deliveryCharges === totalDeliveryCharge;
		isTotalAfterDeliveryMatching = localOrderDetails.totalAfterDelivery == totalCostAfterDelivery;
		
		if(isTotalAfterDeliveryMatching && isDeliveryChargeMatching) {
			getExcelContent(localOrderDetails.supplierName, products, TransportationType.Local);
		} else {
			isSubmitDisabled = true;
		}
    }

	
	async function removeProduct(productId: number) {

		const indexInArray = products.findIndex((p) => p.id == productId);

		if(indexInArray !== -1) {
			products.splice(indexInArray, 1);
			cards.splice(indexInArray, 1);
			products = [...products]
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


<Actions addNewProduct={addNewProduct} validateAndCalculate={validate} submit={submit} isSubmitDisabled={isSubmitDisabled} />



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
			<label for="total-products-cost" class="mb-1 text-sm font-medium text-gray-700">
				Total After Delivery (USD) 
			</label>
			<input
				bind:value={localOrderDetails.totalAfterDelivery}
				id="total-products-cost"
				type="number"
				placeholder="e.g. 4500"
				class={localOrderDetails.istotalAfterDeliveryValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !localOrderDetails.istotalAfterDeliveryValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="total-products-cost" class="mb-1 text-sm font-medium text-gray-700">
				Delivery Charges (USD) 
			</label>
			<input
				bind:value={localOrderDetails.deliveryCharges}
				id="total-products-cost"
				type="number"
				placeholder="e.g. 4500"
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
			<label for="calculated-freight-Cost" class="mb-1 text-sm font-medium text-gray-700">
				Base Cost (No Delivery)
			</label>
            <span class="text-lg text-blue-700">{baseNoDeliveryCost} $</span>
		</div>



	</div>

		<div class="grid grid-cols-1 gap-6">
		{#if !isTotalAfterDeliveryMatching}
			<span class="mt-1 text-lg text-red-500">
				Delivery Fees Doesn't Align With The Specified Order Fees.
			</span>
		{/if}

		{#if !isDeliveryChargeMatching}
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
		{#each products as product, id (product.id) }
            <ProductLocal {product} bind:this={cards[id]} on:remove={() => removeProduct(product.id)} />
        {/each}
	</div>
</div>