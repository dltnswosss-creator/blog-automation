export type Pillar = 'daily' | 'member' | 'health';

export interface GenerateRequest {
  pillar: Pillar;
  topic: string;
  keywords?: string;
  memo?: string;
}

export interface BlogPost {
  id: string;
  pillar: Pillar;
  topic: string;
  keywords: string;
  title: string;
  content: string;
  naverTags: string[];
  charCount: number;
  createdAt: string;
}

export const PILLAR_LABELS: Record<Pillar, string> = {
  daily: '트레이너 일상',
  member: '회원 변화 스토리',
  health: '운동 건강 정보',
};

export const PILLAR_COLORS: Record<Pillar, string> = {
  daily: 'bg-amber-100 text-amber-700',
  member: 'bg-emerald-100 text-emerald-700',
  health: 'bg-sky-100 text-sky-700',
};
