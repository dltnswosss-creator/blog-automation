'use client';

import { useState, useEffect } from 'react';
import type { BlogPost, Pillar } from '@/lib/types';
import { PILLAR_LABELS, PILLAR_COLORS } from '@/lib/types';
import { getAllPosts, deletePost } from '@/lib/storage';
import PostPreview from './PostPreview';

export default function PostHistoryClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [filterPillar, setFilterPillar] = useState<Pillar | 'all'>('all');

  useEffect(() => {
    setPosts(getAllPosts());
  }, []);

  function handleDelete(id: string) {
    deletePost(id);
    if (selected?.id === id) setSelected(null);
    setPosts(getAllPosts());
  }

  const filtered = filterPillar === 'all' ? posts : posts.filter((p) => p.pillar === filterPillar);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  const pillars: (Pillar | 'all')[] = ['all', 'daily', 'member', 'health'];
  const filterLabels: Record<Pillar | 'all', string> = { all: '전체', ...PILLAR_LABELS };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">생성 히스토리</h1>
          <p className="text-sm text-gray-500 mt-0.5">총 {posts.length}개의 블로그 글</p>
        </div>
        <a
          href="/generate"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          새 글 생성
        </a>
      </div>

      <div className="flex gap-2">
        {pillars.map((p) => (
          <button
            key={p}
            onClick={() => setFilterPillar(p)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filterPillar === p
                ? 'bg-sky-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterLabels[p]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-base font-medium">아직 생성된 글이 없어요</p>
          <p className="text-sm mt-1">위 버튼을 눌러 첫 번째 블로그 글을 만들어보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            {filtered.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelected(post)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selected?.id === post.id
                    ? 'border-sky-400 bg-sky-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${PILLAR_COLORS[post.pillar]}`}
                      >
                        {PILLAR_LABELS[post.pillar]}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm leading-snug truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{post.topic}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0"
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">{post.charCount.toLocaleString()}자</span>
                  {post.charCount >= 1500 && (
                    <span className="text-xs text-emerald-600">SEO 최적화</span>
                  )}
                  {post.keywords && (
                    <span className="text-xs text-gray-400 truncate">{post.keywords}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            {selected ? (
              <div className="sticky top-20">
                <PostPreview post={selected} />
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-sm text-gray-400">왼쪽에서 글을 선택하면 미리보기가 표시됩니다</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
