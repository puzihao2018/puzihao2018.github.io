/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-Hans', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate reading time in minutes
 * @param content - The text content to calculate reading time for
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * Get all unique tags from posts
 */
export function getUniqueTags(posts: { data: { tags: string[] } }[]): string[] {
  const allTags = posts.flatMap((post) => post.data.tags);
  return [...new Set(allTags)].sort();
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate<T extends { data: { date: Date } }>(
  posts: T[]
): T[] {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Filter posts by tag
 */
export function filterPostsByTag<T extends { data: { tags: string[] } }>(
  posts: T[],
  tag: string
): T[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}