interface UseErrorProps {
    code: number;
    message: string;
    data?: any;
}

export default function useError({code, message, data}: UseErrorProps) {
    return {
        success: false,
        code: code ?? 500,
        message: message,
        data: data ?? null,
        pagination: null
    };
}