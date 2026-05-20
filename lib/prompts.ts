import type { Pillar } from './types';

const TONE = `말투: 현직 PT 트레이너의 구어체 (~에요, ~거든요, ~했는데, ~더라고요). 친근하면서도 전문성 있게. 과장이나 비현실적 약속 없이.`;

const LENGTH_RULE = `분량: 총 1,600자 이상. 소제목마다 충분히 써야 해요 — 각 섹션 최소 280자 이상.`;

const FORMAT = `JSON만 출력 (다른 텍스트 없음):
{"title":"제목","content":"마크다운 본문","naverTags":["태그1","태그2","태그3","태그4","태그5","태그6"]}

제목: 주제를 직접 반영, 검색 키워드 앞에 배치, 30자 이내
본문: 마크다운 ## 소제목 사용
태그: 주제와 직접 관련된 키워드 6개`;

export function buildPrompt(pillar: Pillar, topic: string, keywords = '', memo = ''): string {
  switch (pillar) {
    case 'daily':   return buildDaily(topic, keywords, memo);
    case 'member':  return buildMember(topic, keywords, memo);
    case 'health':  return buildHealth(topic, keywords, memo);
  }
}

function buildDaily(topic: string, keywords: string, memo: string): string {
  const hasMemo = memo.trim().length > 0;

  return `당신은 현직 PT 트레이너입니다. 오늘 있었던 일을 블로그에 씁니다.
${TONE}

주제: ${topic}
${keywords ? `자연스럽게 포함할 키워드: ${keywords}` : ''}
${hasMemo ? `\n[오늘 있었던 일 — 이 내용이 글의 뼈대입니다]\n${memo}\n` : ''}

글 구성 지침:
${hasMemo
  ? `위 에피소드를 읽고, 이 이야기가 자연스럽게 전달되도록 소제목 구조를 직접 잡으세요.
- 소제목은 에피소드의 장면·감정·전환점 등 실제 흐름에서 뽑아내세요 (정해진 틀 없음)
- "오늘의 트레이닝", "트레이너의 감정" 같은 뻔한 소제목 금지
- 이 에피소드에서만 나올 수 있는 구체적인 소제목을 만드세요`
  : `트레이너 일상의 한 장면에서 시작해 독자가 공감하는 구조로 소제목을 자유롭게 잡으세요.`}
- 첫 문장: 독자를 끌어당기는 현장감 있는 장면 또는 질문
- 마지막: 독자에게 질문 던지며 댓글 유도
- 회원 등장 시 익명 처리

${LENGTH_RULE}
${FORMAT}`;
}

function buildMember(topic: string, keywords: string, memo: string): string {
  const hasMemo = memo.trim().length > 0;

  return `당신은 현직 PT 트레이너입니다. 회원의 변화 스토리를 블로그에 씁니다.
${TONE}

주제: ${topic}
${keywords ? `자연스럽게 포함할 키워드: ${keywords}` : ''}
${hasMemo ? `\n[회원 스토리 소재 — 이 내용이 글의 뼈대입니다]\n${memo}\n` : ''}

글 구성 지침:
${hasMemo
  ? `위 소재를 읽고, 이 회원의 고유한 여정이 생생하게 전달되도록 소제목 구조를 직접 잡으세요.
- 소제목은 이 회원만의 상황·감정·전환점에서 뽑아내세요 — "시작", "과정", "결과" 같은 일반 소제목 금지
- 소재에 없는 내용은 만들지 마세요. 있는 내용을 더 깊이 있게 살려 쓰세요
- 독자가 "나도 저럴 수 있겠다"고 느끼는 공감 포인트를 부각하세요`
  : `회원의 고민 → 변화 과정 → 결과 흐름을 소제목으로 자유롭게 구성하세요.`}
- 변화는 구체적 수치나 행동 변화로 표현
- 회원 실명·사진 없이 (개인정보 보호)
- 의료 효과 과장 금지
- 마지막: 비슷한 고민 독자에게 공감하며 댓글 유도

${LENGTH_RULE}
${FORMAT}`;
}

function buildHealth(topic: string, keywords: string, memo: string): string {
  const hasMemo = memo.trim().length > 0;

  return `당신은 현직 PT 트레이너입니다. 운동·건강 정보를 블로그에 씁니다.
${TONE}

주제: ${topic}
${keywords ? `자연스럽게 포함할 키워드: ${keywords}` : ''}
${hasMemo ? `\n[PT 현장에서 겪은 에피소드 — 이 경험을 글 안에 녹여 쓰세요]\n${memo}\n` : ''}

글 구성 지침:
${hasMemo
  ? `위 현장 경험을 글의 핵심 스토리로 삼아 소제목 구조를 직접 잡으세요.
- 이 에피소드가 왜 이 주제와 연결되는지를 소제목 흐름으로 보여주세요
- 에피소드에서 시작 → 정보·근거로 심화 → 독자 실천 팁으로 마무리 (하지만 소제목 이름은 이 글의 흐름에 맞게 자유롭게)
- "흔한 오해", "올바른 정보" 같은 뻔한 소제목 대신 이 에피소드에서 나올 수 있는 구체적 소제목을 만드세요`
  : `이 주제에 대해 독자가 실제로 궁금해할 것에서 시작해 소제목을 자유롭게 잡으세요.`}
- 근거 있는 정보 + 구체적 수치나 예시 포함
- 초보자도 바로 실천 가능한 팁 포함
- 마지막: 독자 경험 묻는 댓글 유도

${LENGTH_RULE}
${FORMAT}`;
}
