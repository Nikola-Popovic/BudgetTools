export interface Payer {
    id?: number;
    name: string;
    amountDue: number;
    receipts: Receipt[];
}

export interface Receipt {
    id: number;
    name: string;
    total: number;
    payerId: number;
    items: ReceiptItem[];
}

export interface ReceiptItem {
    id: string;
    name: string;
    price: number;
}