'use client';

import { useState } from 'react';
import type { Pillar, BlogPost } from '@/lib/types';
import { PILLAR_LABELS, PILLAR_COLORS } from '@/lib/types';
import { savePost } from '@/lib/storage';
import PostPreview from './PostPreview';

const PILLAR_DESCRIPTIONS: Record<Pillar, string> = {
  daily: '트레이닝 현장, 하루 일과, 트레이너로서의 생각 · Know/Like 단계',
  member: '회원 변화 여정, 비포&애프터, 극복 에피소드 · Like/Trust 단계',
  health: '운동 과학, 건강 정보, 실용적인 피트니스 팁 · Know/Trust 단계',
};

const TOPIC_EXAMPLES: Record<Pillar, string[]> = {
  daily: [
    '3:1 그룹PT 세션에서 있었던 일',
    '오늘 새벽 첫 회원 트레이닝 이야기',
    '트레이너가 되기까지의 이야기',
  ],
  member: [
    '3개월 만에 체지방 10% 감량한 직장인 사례',
    '무릎 통증이 있던 60대 회원의 변화',
    '운동을 3번 포기했다가 다시 시작한 20대 이야기',
  ],
  health: [
    '유산소 vs 무산소, 뭘 먼저 해야 할까?',
    '스쿼트 무릎 나간다는 말이 사실일까?',
    '단백질 하루 얼마나 먹어야 할까?',
  ],
};

export default function GenerateClient() {
  const [pillar, setPillar] = useState<Pillar>('health');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pillar, topic, keywords, memo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '생성 실패');
      const post = data as BlogPost;
      savePost(post);
      setResult(post);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">새 블로그 글 생성</h1>
        <p className="text-sm text-gray-500 mt-1">
          Hook/Story/Offer 구조 + 네이버 SEO 최적화로 자동 작성됩니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 입력 폼 */}
        <div className="space-y-5">
          {/* 필라 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              콘텐츠 필라
            </label>
            <div className="space-y-2">
              {(Object.keys(PILLAR_LABELS) as Pillar[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPillar(p)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    pillar === p
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PILLAR_COLORS[p]}`}
                    >
                      {PILLAR_LABELS[p]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{PILLAR_DESCRIPTIONS[p]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 주제 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              주제 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 스쿼트 무릎 아프다는 말이 사실일까?"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <div className="mt-1.5 flex flex-wrap gap-1">
              {TOPIC_EXAMPLES[pillar].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setTopic(ex)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* 키워드 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              타깃 키워드{' '}
              <span className="text-xs font-normal text-gray-400">(선택, 쉼표로 구분)</span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="예: 스쿼트 자세, 무릎 보호, 하체 운동"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              실제 에피소드 / 메모{' '}
              <span className="text-xs font-normal text-gray-400">(선택)</span>
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              placeholder="실제 있었던 에피소드, 회원 이야기, 넣고 싶은 포인트 등을 자유롭게 적어주세요."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI 글 작성 중...
              </>
            ) : (
              '블로그 글 생성하기'
            )}
          </button>
        </div>

        {/* 미리보기 */}
        <div>
          {result ? (
            <PostPreview post={result} />
          ) : (
            <div className="h-full min-h-64 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-4xl mb-3">✍️</p>
                <p className="text-sm">주제를 입력하고 생성하면</p>
                <p className="text-sm">여기에 블로그 글이 나타납니다</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
