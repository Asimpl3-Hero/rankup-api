export interface CalculateHypeInput {
  title: string;
  views: number;
  likes: number;
  comments: number | null;
}

function toSafePositiveNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

export function calculateHype(input: CalculateHypeInput): number {
  const normalizedViews = toSafePositiveNumber(input.views);
  if (normalizedViews === 0 || input.comments === null) {
    return 0;
  }

  const normalizedLikes = toSafePositiveNumber(input.likes);
  const normalizedComments = toSafePositiveNumber(input.comments);

  let hype = (normalizedLikes + normalizedComments) / normalizedViews;
  if (input.title.toLowerCase().includes('tutorial')) {
    hype *= 2;
  }

  return hype;
}
