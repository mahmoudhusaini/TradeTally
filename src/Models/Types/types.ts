import type { TransportationType } from "../Enums/enums";

    export type Product = {
		id: number;
		name: string;
		image: string;
		quantity: number;
		total: number;
		isLocal: boolean;
		transportationType: TransportationType;
		freightCharge: number;
		costAfterCharge: number;
		deliveryCharge: number; // only for local prods
		landedCostPerSingleItem: number;
		isReceived: boolean;
	};

	// export type Product = {
	// 	id: number;
	// 	name: string;
	// 	image: string;
	// 	quantity: number;
	// 	total: number;
	// 	freightCost: number;
	// 	percentage: number;
	// 	costPrice: number;
	// 	isReceived: boolean;
	// };
