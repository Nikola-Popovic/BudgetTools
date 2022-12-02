export interface Receipt {
    id: number;
    name: string;
    total: number;
    items: number[];
}

export interface Payer {
    id: number;
    name: string;
    amountDue: number;
    receipts: number[];
}
