export default function useSubstring(text:string){
    const parsedText = text.length >= 15 ? (text.substring(0,12) + '...') : text
    return parsedText
}