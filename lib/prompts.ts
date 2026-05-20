import type { Pillar } from './types';

const pillarGuides = {
  daily: {
    type: '트레이너 일상 블로그',
    voice: '현직 PT 트레이너의 하루 이야기 (친근하고 솔직한 구어체)',
    sections: ['오늘 있었던 트레이닝 현장 이야기', '트레이너로서 느낀 감정과 생각', '회원과 나눈 대화나 변화 모습 (익명)', '이 직업의 보람과 힘든 점'],
  },
  member: {
    type: '회원 변화 스토리',
    voice: '비포&애프터 변화 여정을 공감 있게 전달 (개인정보 보호, 의료 효과 과장 금지)',
    sections: ['회원의 시작 고민과 상황', '훈련 과정과 어려운 순간', '달라진 수치와 결과', '회원 소감과 트레이너 코멘트'],
  },
  health: {
    type: '운동·건강 정보',
    voice: '운동 과학 기반의 실용적인 정보 (PT 현장 경험 포함, 구체적 수치와 예시)',
    sections: ['흔한 오해와 잘못된 상식', '올바른 정보 (과학적 근거)', 'PT 현장에서 실제 적용하는 법', '초보자를 위한 실천 팁'],
  },
};

export function buildPrompt(pillar: Pillar, topic: string, keywords = '', memo = ''): string {
  const guide = pillarGuides[pillar];

  return `당신은 한국 PT 트레이너 블로그 작가입니다.

다음 주제로 블로그 글을 써주세요: ${topic}

글 유형: ${guide.type}
글 톤: ${guide.voice}
${keywords ? `포함할 키워드: ${keywords}` : ''}
${memo ? `참고할 내용: ${memo}` : ''}

본문 구성 (각 섹션 별도의 ## 소제목, 각 섹션 250자 이상):
${guide.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}
마지막: 독자 댓글 유도 질문으로 마무리

요구사항:
- 주제: ${topic} (이 주제에만 집중, 다른 주제 금지)
- 총 본문 1,500자 이상
- 말투: ~에요, ~거든요, ~해봤는데 (구어체)

JSON만 출력:
{"title":"제목(주제 키워드 포함, 30자 이내)","content":"마크다운 본문","naverTags":["태그1","태그2","태그3","태그4","태그5","태그6"]}`;
}
