export function useTextParser() {
    //Funcion: detecta si hay una url y la hace clickeable
    const parseLinks = (text: string): string => {
        if (!text) return ''

        const urlRegex = /(https?:\/\/[^\s]+)/g

        return text.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-red-600 underline hover:text-red-800 break-all">${url}</a>`
        })
    }

    return { parseLinks }
}