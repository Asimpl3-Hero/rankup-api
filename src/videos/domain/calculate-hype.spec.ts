import { calculateHype } from './calculate-hype';

describe('calculateHype', () => {
  it('calculates hype using (likes + comments) / views', () => {
    const result = calculateHype({
      title: 'NestJS tips',
      views: 100,
      likes: 50,
      comments: 10,
    });

    expect(result).toBeCloseTo(0.6);
  });

  it('multiplies hype by 2 when title contains tutorial (case insensitive)', () => {
    const result = calculateHype({
      title: 'React avanzado - TuToRiAl',
      views: 100,
      likes: 30,
      comments: 20,
    });

    expect(result).toBeCloseTo(1);
  });

  it('returns 0 when comments are missing', () => {
    const result = calculateHype({
      title: 'React tips',
      views: 100,
      likes: 30,
      comments: null,
    });

    expect(result).toBe(0);
  });

  it('returns 0 when views are 0', () => {
    const result = calculateHype({
      title: 'Mi primer Hola Mundo',
      views: 0,
      likes: 30,
      comments: 10,
    });

    expect(result).toBe(0);
  });
});
