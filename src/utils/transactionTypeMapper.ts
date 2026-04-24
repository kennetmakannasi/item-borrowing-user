export function transactionTypeMapper(status: string): string {
    switch (status?.toLowerCase()) {
        case 'full_payment':
            return 'Pembayaran Full';
        case 'deposit_payment':
            return 'Pembayaran DP';
        case 'settlement_payment':
            return 'Pelunasan';
        case 'fine_payment':
            return 'Denda';
        default:
            return status;
    }
}

export function renderPaymentMethod(route: string) {
    switch (route.toLowerCase()) {
        case 'cash':
            return 'Tunai'
        case 'bank_transfer':
            return 'Transfer'
        default:
            return route
    }
}