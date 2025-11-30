export function formatDate(date: Date | string | undefined, format = 'yyyy-MM-dd') {
    if (!date) return '';

    const d = date instanceof Date ? date : new Date(date);

    const pad = (n: number) => n.toString().padStart(2, '0');

    const map: Record<string, string> = {
        yyyy: d.getFullYear().toString(),
        MM: pad(d.getMonth() + 1),
        dd: pad(d.getDate()),
        HH: pad(d.getHours()),
        mm: pad(d.getMinutes()),
        ss: pad(d.getSeconds()),
    };

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (match) => map[match]);
}
