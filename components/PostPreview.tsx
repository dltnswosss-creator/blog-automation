'use client';

import { useState } from 'react';
import type { BlogPost } from '@/lib/types';
import { PILLAR_LABELS, PILLAR_COLORS } from '@/lib/types';

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|u|l])(.+)$/gm, (line) => (line.trim() ? line : ''))
    .replace(/^([^<].+)$/gm, '$1')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<li')) return line;
      return `<p>${line}</p>`;
    })
    .join('');
}

export default function PostPreview({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false);
  const [titleCopied, setTitleCopied] = useState(false);
  const [tagsCopied, setTagsCopied] = useState(false);

  function copyText(text: string, setCopiedFn: (v: boolean) => void) {
    navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  }

  const fullCopyText = `${post.title}\n\n${post.content}\n\n#${post.naverTags.join(' #')}`;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PILLAR_COLORS[post.pillar]}`}>
              {PILLAR_LABELS[post.pillar]}
            </span>
            <span className="text-xs text-gray-400">{post.charCount.toLocaleString()}자</span>
            {post.charCount >= 1500 ? (
              <span className="text-xs text-emerald-600 font-medium">SEO 최적화</span>
            ) : (
              <span className="text-xs text-amber-600 font-medium">1,500자 미만</span>
            )}
          </div>
          <button
            onClick={() => copyText(fullCopyText, setCopied)}
            className="text-xs px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md font-medium transition-colors"
          >
            {copied ? '복사됨!' : '전체 복사'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* 제목 */}
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">제목</p>
            <p className="font-bold text-gray-900 text-base leading-snug">{post.title}</p>
          </div>
          <button
            onClick={() => copyText(post.title, setTitleCopied)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors shrink-0 mt-4"
          >
            {titleCopied ? '복사!' : '복사'}
          </button>
        </div>

        <hr className="border-gray-100" />

        {/* 본문 */}
        <div>
          <p className="text-xs text-gray-400 mb-2">본문</p>
          <div
            className="prose-blog text-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        </div>

        <hr className="border-gray-100" />

        {/* 네이버 태그 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">네이버 태그</p>
            <button
              onClick={() => copyText(post.naverTags.map((t) => `#${t}`).join(' '), setTagsCopied)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
            >
              {tagsCopied ? '복사!' : '복사'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {post.naverTags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-sky-50 text-sky-700 rounded-md border border-sky-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 네이버 업로드 가이드 */}
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-amber-800 mb-1.5">네이버 블로그 업로드 순서</p>
          <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
            <li>제목 복사 → 네이버 블로그 제목에 붙여넣기</li>
            <li>본문 복사 → 본문 에디터에 붙여넣기 후 이미지 추가</li>
            <li>태그 복사 → 블로그 글 태그 입력란에 붙여넣기</li>
            <li>카테고리 설정 후 발행</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
