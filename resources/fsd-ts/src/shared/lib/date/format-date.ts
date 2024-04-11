export function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.getMonth().toString().padStart(2, '0');

    return `${day}.${month}.${date.getFullYear()}`;
}
