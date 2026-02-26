import { formatPublishedAt } from './format-published-at';

describe('formatPublishedAt', () => {
  const now = new Date('2026-02-25T12:00:00.000Z');

  it('returns hours when diff is less than a day', () => {
    const result = formatPublishedAt('2026-02-25T09:00:00.000Z', now);
    expect(result).toBe('Hace 3 horas');
  });

  it('returns days when diff is less than a month', () => {
    const result = formatPublishedAt('2026-02-20T12:00:00.000Z', now);
    expect(result).toBe('Hace 5 d\u00edas');
  });

  it('returns months when diff is a month or more', () => {
    const result = formatPublishedAt('2025-12-25T12:00:00.000Z', now);
    expect(result).toBe('Hace 2 meses');
  });

  it('returns 0 hours for invalid dates', () => {
    const result = formatPublishedAt('invalid-date', now);
    expect(result).toBe('Hace 0 horas');
  });

  it('returns 0 hours for future dates', () => {
    const result = formatPublishedAt('2026-03-01T12:00:00.000Z', now);
    expect(result).toBe('Hace 0 horas');
  });
});
