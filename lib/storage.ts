import type { BlogPost } from './types';

const STORAGE_KEY = 'blog_posts';

export function getAllPosts(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BlogPost[]) : [];
  } catch {
    return [];
  }
}

export function savePost(post: BlogPost): void {
  const posts = getAllPosts();
  posts.unshift(post);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function deletePost(id: string): void {
  const posts = getAllPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
