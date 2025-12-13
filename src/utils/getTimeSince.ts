
export function getTimeSince(date: Date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
        { unit: 'year', seconds: 31536000 },
        { unit: 'month', seconds: 2592000 },
        { unit: 'week', seconds: 604800 },
        { unit: 'day', seconds: 86400 },
        { unit: 'hour', seconds: 3600 },
        { unit: 'minute', seconds: 60 },
        { unit: 'second', seconds: 1 },
    ];

    const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });

    for (const { unit, seconds } of units) {
        const delta = Math.floor(diffInSeconds / seconds);
        if (Math.abs(delta) >= 1) {
            return rtf.format(-delta, unit); // negative for past times
        }
    }
    return 'الآن';
}
