/**
 * Formats a date string into a human-readable format based on the language.
 * @param dateString
 * @param lang
 * @returns formatted date string
 * @example
 * formatDate('2023-01-01T00:00:00', 'en-US') // 'Monday, January 1, 2023'
 * formatDate('2023-01-01T00:00:00', 'ru-RU') // 'Понедельник, 1 января 2023'
 * formatDate('2023-01-01T00:00:00', 'fr-FR') // 'Lundi 1 janvier 2023'
 */
export const formatDate = (dateString: string, lang: string) =>{
    const date = new Date(dateString)
    const locale = lang.startsWith('ru') ? 'ru-RU' : lang.startsWith('fr') ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, {weekday: 'long', day: 'numeric', month: 'long'})
}