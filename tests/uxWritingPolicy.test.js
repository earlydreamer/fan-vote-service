import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const rootDir = process.cwd();

const visibleCopyFiles = [
  'src/features/rooms/RoomCreatePage.tsx',
  'src/features/rooms/createRoomReceipt.ts',
  'src/features/pricing/PricingPage.tsx',
  'src/features/pricing/pricingIntent.ts',
  'src/features/result-cards/ResultCardPublishPanel.tsx',
  'src/features/missions/MissionList.tsx',
  'src/features/rooms/RoomDetailPage.tsx',
  'src/features/profile/ProfilePage.tsx',
  'src/features/profile/ProfileEditPage.tsx',
  'src/features/crew/CrewDashboardPage.tsx',
  'src/shared/api/commandErrors.ts'
];

const forbiddenPhrases = [
  '생성 intent 만들기',
  '생성 command preview',
  '생성 요청 receipt',
  '생성 요청 접수',
  'Mock command response',
  'Command payload',
  'Command boundary',
  '결제 intent preview',
  '구매 intent',
  '추가 참여 intent',
  '공식성 검증 문의 intent',
  'Owner action',
  'Business loop',
  'Reward spend',
  'Create vote room',
  'Poll options',
  'Vote detail',
  'Guest',
  'Missions',
  'My vote loop',
  'Settings',
  'Creator operations',
  '완료됨',
  '발행 요청 중',
  '결과 카드 발행 요청 완료',
  '수행할 권한',
  '앱 설정이 아직 완료되지 않았어요.',
  '요청한 대상을 찾을 수 없어요.'
];

function readProjectFile(projectPath) {
  return fs.readFileSync(path.join(rootDir, projectPath), 'utf8');
}

describe('UX writing policy', () => {
  it('keeps Toss-inspired writing principles in the design system', () => {
    const designDocument = readProjectFile('DESIGN.md');

    expect(designDocument).toContain('Toss UX Writing 참고 원칙');
    expect(designDocument).toContain('해요체');
    expect(designDocument).toContain('능동형');
    expect(designDocument).toContain('긍정형');
    expect(designDocument).toContain('캐주얼한 경어');
  });

  it.each(forbiddenPhrases)('does not expose stiff or developer-facing copy: %s', (phrase) => {
    const matches = visibleCopyFiles
      .map((filePath) => ({
        filePath,
        includesPhrase: readProjectFile(filePath).includes(phrase)
      }))
      .filter((result) => result.includesPhrase)
      .map((result) => result.filePath);

    expect(matches).toEqual([]);
  });
});
