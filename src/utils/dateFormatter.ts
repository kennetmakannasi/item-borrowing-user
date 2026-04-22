export default function useFormatDate(date: string) {
    const formatedDate = new Date(date).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    return formatedDate;
}