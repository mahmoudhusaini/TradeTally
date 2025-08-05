<script lang="ts">
	import Actions from "../../Components/Actions.svelte";
	import Card from "../../Components/Card.svelte";
	import { TransportationType } from "../../Models/Enums/enums";
	import type { Product } from "../../Models/Types/types";
	import { getExcelContent } from "../../Models/Utilities/utilities";
    
    type ContainerOrderDetails = {
		supplierName: string,
		isSupplierNameValid: boolean,
        cbm: number,
		isCbmValid: boolean;
        cbmRate: number,
		isCbmRateValid: boolean;
		otherCharges: number;
		baseProductsCost: number;
		isBaseProductsCost: boolean;
		moneyTransferPercentage: number;
        isPercentageValid: boolean;
	};

	let containerOrderDetails: ContainerOrderDetails = {
		supplierName: '',
		isSupplierNameValid: true,
        cbm: 0,
		isCbmValid: true,
        cbmRate: 0,
		isCbmRateValid: true,
		otherCharges: 0,
		baseProductsCost: 0,
		isBaseProductsCost: true,
        moneyTransferPercentage:0,
		isPercentageValid: true,

	};

	// For shipment details
    $: FreightCost = containerOrderDetails.cbm * containerOrderDetails.cbmRate;
    $: OverAllShipmentCost = FreightCost + containerOrderDetails.baseProductsCost + containerOrderDetails.otherCharges;
    $: AmountDue = OverAllShipmentCost + (OverAllShipmentCost * (containerOrderDetails.moneyTransferPercentage/100));//+money transfer

    let products: Product[] = [];
	let cards: any[] = [];
    let counter: number = 0;

	let isFreightCompatible: boolean = true;
	let isCostAfterChargesCompatible: boolean = true;

    let isSubmitDisabled: boolean = true;

    function addNewProduct() {
        let newProduct: Product = {
            id: counter++,
			name: '',
			image: '/assets/images/placeholder-product-image.jpg',
			quantity: 0,
			total: 0,
			isLocal: false,
			transportationType: TransportationType.BySea,
			freightCharge: 0, 
			costAfterCharge: 0, //+ percentage
			deliveryCharge: 0, 
			landedCostPerSingleItem: 0,
			isReceived: false
        };

        products = [...products, newProduct]
    }

	async function removeProduct(productId: number) {

		const indexInArray = products.findIndex((p) => p.id == productId);

		if(indexInArray !== -1) {
			products.splice(indexInArray, 1);
			cards.splice(indexInArray, 1);
			products = [...products]
		}
	}

    function validate() {
        
		let continueToExport: boolean = true;

		if(cards.length < 1) { 
			continueToExport = false;
			isSubmitDisabled = true;
			// To Do: Error Toaster or error message makes client know there is something missing
			// How the client needs to know after changing prodcut details that he needs to validate
			// Naming inventory parts - invoice line 
			// Other charges add boolean to card and show input number
			// +Money Transfer Fees: in card to be reactive -- Undoable
			// add select country
			// Product props names?

			return;
		}

		containerOrderDetails.isSupplierNameValid = containerOrderDetails.supplierName.trim() !== '';
		containerOrderDetails.isCbmValid = containerOrderDetails.cbm > 0;
		containerOrderDetails.isCbmRateValid = containerOrderDetails.cbmRate > 0;
		containerOrderDetails.isBaseProductsCost = containerOrderDetails.baseProductsCost > 0;
		containerOrderDetails.isPercentageValid = containerOrderDetails.moneyTransferPercentage >= 0;

		if(!containerOrderDetails.isSupplierNameValid ||
		   !containerOrderDetails.isCbmValid ||
		   !containerOrderDetails.isCbmRateValid ||
		   !containerOrderDetails.isBaseProductsCost ||
		   !containerOrderDetails.isPercentageValid) {

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
			products = products.map((product) => {
				const percentage =
					product.total +
					product.freightCharge +
					(product.total + product.freightCharge) * (containerOrderDetails.moneyTransferPercentage / 100);

				return {
					...product,
					costAfterCharge: percentage,
					landedCostPerSingleItem: percentage / product.quantity
				};
			});

			isSubmitDisabled = false;
		}

    }

	function submit() {

		let totalFreightCharges: number = 0; // FreightCost
		let totalCostAfterCharges: number = 0; // +Money Transfer Percentage Amount Due

		for (const product of products) {
			totalFreightCharges += product.freightCharge;
			totalCostAfterCharges += product.costAfterCharge;
		}
		
		isFreightCompatible = FreightCost == totalFreightCharges;
		isCostAfterChargesCompatible = totalCostAfterCharges == AmountDue;

		if(isFreightCompatible && isCostAfterChargesCompatible) {
			getExcelContent(containerOrderDetails.supplierName, products, TransportationType.BySea);
		}
    }

</script>





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
				bind:value={containerOrderDetails.supplierName}
				id="supplier-name"
				type="text"
				placeholder="e.g. AY COMPUTERS"
				class={containerOrderDetails.isSupplierNameValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !containerOrderDetails.isSupplierNameValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>


		<div class="flex flex-col">
			<label for="transfer" class="mb-1 text-sm font-medium text-gray-700">
				Money Transfer Percentage (%)
			</label>
			<input
				bind:value={containerOrderDetails.moneyTransferPercentage}
				id="transfer"
				type="number"
				placeholder="e.g. 3"
				class={containerOrderDetails.isPercentageValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !containerOrderDetails.isPercentageValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

		<div class="flex flex-col">
			<label for="Cbm" class="mb-1 text-sm font-medium text-gray-700">
				Total CBM
			</label>
			<input
				bind:value={containerOrderDetails.cbm}
				id="Cbm"
				type="number"
				placeholder="e.g. 5"
				class={containerOrderDetails.isCbmValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !containerOrderDetails.isCbmValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>


        <div class="flex flex-col">
			<label for="Cbm" class="mb-1 text-sm font-medium text-gray-700">
				CBM Rate
			</label>
			<input
				bind:value={containerOrderDetails.cbmRate}
				id="Cbm"
				type="number"
				placeholder="e.g. 5"
				class={containerOrderDetails.isCbmRateValid
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !containerOrderDetails.isCbmRateValid}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>


		<div class="flex flex-col">
			<label for="weight" class="mb-1 text-sm font-medium text-gray-700">
				Other Charges (USD)
			</label>
			<input
				bind:value={containerOrderDetails.otherCharges}
				id="weight"
				type="number"
				placeholder="e.g. 300"
				class='rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
				min="0"
			/>
		</div>

		<div class="flex flex-col">
			<!-- Total No Fees  -->
			<label for="total-products-cost" class="mb-1 text-sm font-medium text-gray-700">
				Base Products Cost(USD) 
			</label>
			<input
				bind:value={containerOrderDetails.baseProductsCost}
				id="total-products-cost"
				type="number"
				placeholder="e.g. 4500"
				class={containerOrderDetails.isBaseProductsCost
					? 'rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
					: 'rounded-lg border border-red-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200'}
				required
				min="0"
			/>

			{#if !containerOrderDetails.isBaseProductsCost}
				<span class="mt-1 text-sm text-red-500">Field is Required</span>
			{/if}
		</div>

        <div class="flex flex-col">
			<label for="calculated-freight-Cost" class="mb-1 text-sm font-medium text-gray-700">
				Total Freight Cost
			</label>
            <span class="text-lg text-blue-700">{FreightCost} $</span>
		</div>


        <div class="flex flex-col">
			<label for="shipment-Cost" class="mb-1 text-sm font-medium text-gray-700">
				Shipment Cost
			</label>
            <span class="text-lg text-blue-700">{OverAllShipmentCost} $</span>
		</div>


        <div class="flex flex-col">
			<label for="shipment-Cost-with-percentage" class="mb-1 text-sm font-medium text-gray-700">
				+Money Transfer Percentage
			</label>
            <span class="text-lg text-blue-700">{AmountDue} $</span>
		</div>


	</div>

		<div class="grid grid-cols-1 gap-6">
		{#if !isFreightCompatible}
			<span class="mt-1 text-lg text-red-500">
				Total Freight Charges Doesn't Align With The Specified Shipment Charges.
			</span>
		{/if}

		{#if !isCostAfterChargesCompatible}
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
            <Card {product} bind:this={cards[id]} on:remove={() => removeProduct(product.id)} />
        {/each}
	</div>
</div>