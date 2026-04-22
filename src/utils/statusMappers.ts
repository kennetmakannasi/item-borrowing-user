export function returningStatusMapper(status: string): string {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'Pending';
        case 'rejected':
            return 'Ditolak';
        case 'approved':
            return 'Diterima';
        default:
            return status;
    }
}

export function returningConditonStatusMapper(status: string): string {
    switch (status?.toLowerCase()) {
        case 'good':
            return 'Baik';
        case 'bad':
            return 'Rusak';
        case 'lost':
            return 'Hilang';
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