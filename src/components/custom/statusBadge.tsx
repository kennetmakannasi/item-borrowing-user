import { Badge } from 'konsta/react';
import {
    borrowingStatusMapper,
    transactionStatusMapper,
    returningStatusMapper
} from '../../utils/statusMappers';

interface StatusBadgeProps {
    status: string;
    type?: 'borrowing' | 'transaction' | 'returning';
    className?: string;
}

export default function StatusBadge({ status, type = 'borrowing', className = '' }: StatusBadgeProps) {
    const s = status?.toLowerCase();

    const getStatusStyles = () => {
        if (['pending', 'unpaid'].includes(s)) {
            return 'border-yellow-400 text-yellow-400 bg-yellow-50';
        }
        if (['approved'].includes(s)) {
            return 'border-green-400 text-green-400 bg-green-50';
        }
        if (['paid', 'returned'].includes(s)) {
            return 'border-blue-400 text-blue-400 bg-blue-50';
        }
        if (['failed', 'expired', 'rejected'].includes(s)) {
            return 'border-red-400 text-red-400 bg-red-50';
        }
        if (['overdue'].includes(s)) {
            return 'border-orange-400 text-orange-400 bg-orange-50';
        }

        return 'border-gray-400 text-gray-400 bg-gray-50';
    };

    const getLabel = () => {
        if (type === 'transaction') return transactionStatusMapper(status);
        if (type === 'returning') return returningStatusMapper(status);
        return borrowingStatusMapper(status);
    };

    return (
        <Badge
            className={`capitalize border-2 bg-transparent font-semibold px-2 py-0.5 ${getStatusStyles()} ${className}`}
            colors={{
                bg: 'bg-transparent'
            }}
        >
            {getLabel()}
        </Badge>
    );
}