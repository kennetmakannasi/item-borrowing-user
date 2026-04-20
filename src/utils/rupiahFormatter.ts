export default function useFormatRupiah(text:number){
    const parsedText =  Number(text).toLocaleString('id-ID');
    return `Rp. ${parsedText }`
}