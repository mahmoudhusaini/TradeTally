import { TransportationType } from "../Enums/enums";
import type { Product } from "../Types/types";

// export function handleFileChange(event: Event, product: Product) {
// 		const target = event.target as HTMLInputElement;
// 		const file = target.files?.[0];

// 		if (file) {
// 			const reader = new FileReader();
// 			reader.onload = () => {
// 				product.image = reader.result as string; // base64 data URL
// 				console.log(reader.result);
// 			};

// 			reader.readAsDataURL(file);
// 		}
// 	}


export function downloadBlob(blobData: any, fileName: string, dataType: string) {
    let blob = new Blob([blobData], { type: dataType });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.csv`;

    link.click();
}


function getShipmentMode(transportationType: TransportationType): string {

    switch(transportationType) {
        case TransportationType.ByAir:
            return "By Air";
        
        case TransportationType.BySea:
            return "By Container";

         case TransportationType.Local:
            return "Local Order";

        default:
            return '  ';
    }

}



export function getExcelContent(supplierName: string, products: Product[], transportationType: TransportationType) {

    let orderType: string = getShipmentMode(transportationType);

    const date = new Date();

    const formatedDate = `${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`;

    const title = `${orderType} - ${supplierName} - ${formatedDate}`;

    let reportHeader: string[] = ['Name', 'Quantity', 'Total', 'Cost After Charges', 'Cost Price','Is Received'];

    let arrayOfArrays: string[][] = [];

    for (const product of products) {

        let line: string[] = [];

        let name = product.name;
        line.push(name);

        let quantity = `${product.quantity}`;
        line.push(quantity);

        let total = `${product.total}`;
        line.push(total);

        let costAfterCharge = `${product.costAfterCharge.toFixed(2)}`;
        line.push(costAfterCharge);

        let costPrice = `${product.landedCostPerSingleItem.toFixed(2)}`;
        line.push(costPrice);

        let isReceived = `${product.isReceived}`;
        line.push(isReceived);

        arrayOfArrays.push(line);
    }
    const csvContent = [reportHeader.join(','), ...arrayOfArrays.map((row) => row.join(','))].join('\n');
    downloadBlob(csvContent, title, 'data:text/csv;charset=utf-8');
}