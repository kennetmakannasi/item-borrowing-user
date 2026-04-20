export function returningStatusMapper(status: string): string {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'pending';
        case 'rejected':
            return 'ditolak';
        case 'approved':
            return 'diterima';
        default:
            return status;
    }
}

export function borrowingStatusMapper(status: string): string {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'pending';
        case 'rejected':
            return 'ditolak';
        case 'approved':
            return 'diterima';
        case 'overdue':
            return 'telat';
        case 'returned':
            return 'dikembalikan';
        default:
            return status;
    }
}

export function transactionStatusMapper(status: string): string {
    switch (status?.toLowerCase()) {
        case 'unpaid':
            return 'belum dibayar';
        case 'paid':
            return 'dibayar';
        case 'failed':
            return 'gagal';
        case 'expired':
            return 'kedarluasa';
        default:
            return status;
    }
}