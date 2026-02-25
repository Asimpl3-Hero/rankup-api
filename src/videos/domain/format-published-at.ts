const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_HOURS = 24;
const MONTH_IN_DAYS = 30;

function formatAmount(value: number, singular: string, plural: string): string {
  const unit = value === 1 ? singular : plural;
  return `Hace ${value} ${unit}`;
}

export function formatPublishedAt(isoDate: string, now: Date = new Date()): string {
  const publishedAt = new Date(isoDate);
  if (Number.isNaN(publishedAt.getTime())) {
    return 'Hace 0 horas';
  }

  const diffInMs = now.getTime() - publishedAt.getTime();
  if (diffInMs <= 0) {
    return 'Hace 0 horas';
  }

  const totalHours = Math.floor(diffInMs / HOUR_IN_MS);
  if (totalHours < DAY_IN_HOURS) {
    return formatAmount(totalHours, 'hora', 'horas');
  }

  const totalDays = Math.floor(totalHours / DAY_IN_HOURS);
  if (totalDays < MONTH_IN_DAYS) {
    return formatAmount(totalDays, 'dia', 'dias');
  }

  const totalMonths = Math.floor(totalDays / MONTH_IN_DAYS);
  return formatAmount(totalMonths, 'mes', 'meses');
}
