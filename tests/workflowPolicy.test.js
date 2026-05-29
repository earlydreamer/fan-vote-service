import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path) =>
  readFileSync(join(process.cwd(), path), 'utf8');

const AsyncFunction = async function () {}.constructor;

function extractGithubScript(workflow) {
  const normalized = workflow.replace(/\r\n/g, '\n');
  const [, scriptBlock] = normalized.split('          script: |\n');

  return scriptBlock
    .split('\n')
    .map((line) => line.startsWith('            ') ? line.slice(12) : line)
    .join('\n');
}

describe('Codex review automation policy', () => {
  it('documents that follow-up issues do not block the current PR merge', () => {
    const docs = [
      'AGENTS.md',
      'README.md',
      '.md/rallyroom_delivery_workflow_20260529.md',
      '.md/rallyroom_github_review_workflow_20260529.md',
    ].map((path) => readProjectFile(path)).join('\n');

    expect(docs).toContain('follow-up issue는 현재 PR의 merge gate가 아니다');
    expect(docs).not.toContain('Codex follow-up issue가 있으면 처리 여부 확인');
  });

  it('copies Codex feedback to issues and then attempts automatic merge when checks and threads are clean', () => {
    const workflow = readProjectFile('.github/workflows/codex-review-followup.yml');

    expect(workflow).toContain('listUnresolvedReviewThreads');
    expect(workflow).toContain('listReviewThreadComments');
    expect(workflow).toContain('resolveReviewThread');
    expect(workflow).toContain('hasBlockingChecks');
    expect(workflow).toContain('contents: write');
    expect(workflow).toContain('github.rest.pulls.merge');
    expect(workflow).toContain('SELF_CHECK_NAMES');
    expect(workflow).toContain("'codex-review-followup'");
    expect(workflow).toContain('schedule:');
    expect(workflow).toContain('getPullRequestRefs');
    expect(workflow).toContain('isPureCodexThread');
    expect(workflow).toContain('isFeedbackForCurrentHead');
    expect(workflow).toContain('getFeedbackCommitSha');
    expect(workflow).toContain('recordCodexReviewRequest');
    expect(workflow).not.toContain('- [ ] merge 전 관련 PR conversation 또는 review thread resolved 처리');
  });

  it('paginates review thread comments before classifying pure Codex threads', () => {
    const workflow = readProjectFile('.github/workflows/codex-review-followup.yml');

    expect(workflow).toContain('comments(first: 100, after: $cursor)');
    expect(workflow).toContain('listReviewThreadComments(thread.id)');
    expect(workflow).not.toContain('comments(first: 50)');
  });

  it('explicitly closes same-repository linked issues after workflow-driven merge', () => {
    const workflow = readProjectFile('.github/workflows/codex-review-followup.yml');

    expect(workflow).toContain('extractClosingIssueNumbers');
    expect(workflow).toContain('closeLinkedIssuesAfterMerge(pr)');
    expect(workflow).toContain('github.rest.issues.update');
    expect(workflow).toContain("state_reason: 'completed'");
  });

  it('keeps the embedded github-script body syntactically valid', () => {
    const workflow = readProjectFile('.github/workflows/codex-review-followup.yml');
    const script = extractGithubScript(workflow);

    expect(() => new AsyncFunction('github', 'context', 'core', script)).not.toThrow();
  });
});
