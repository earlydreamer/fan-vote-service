import type { RallyRoom } from '../types/rallyroom';

export function getVoteTitle(room: RallyRoom): string {
  return room.voteTitle ?? deriveVoteTitle(room.title);
}

export function deriveVoteTitle(roomTitle: string): string {
  let title = roomTitle.trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of [' 투표방', ' 투표', ' 결과']) {
      if (title.endsWith(suffix)) {
        title = title.slice(0, -suffix.length).trim();
        changed = true;
      }
    }
  }
  return title.length > 0 ? title : roomTitle;
}
