

export interface Transaction {
    id?: number;
    amount: number ;
    businessName: string;
    name: string;
    transactionDate: string;
}

export interface ErrorResponse {
    status: number;
    error: string;
    message: string;
    details?: string[];
    timestamp: string;
    path: string;
}
