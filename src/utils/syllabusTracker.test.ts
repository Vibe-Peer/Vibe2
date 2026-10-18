import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSyllabusProgress,
  filterSyllabusMilestones,
  toggleMilestoneCompletion,
  INITIAL_SYLLABUS_MILESTONES,
} from './syllabusTracker.ts';
import type { SyllabusMilestone } from './syllabusTracker.ts';

test('calculateSyllabusProgress accurately aggregates joint and individual completion metrics', () => {
  const summary = calculateSyllabusProgress(INITIAL_SYLLABUS_MILESTONES);

  assert.equal(summary.totalMilestones, 19);
  assert.ok(summary.userCompletedCount > 0);
  assert.ok(summary.partnerCompletedCount > 0);
  assert.ok(summary.jointlyCompletedCount > 0);

  // Jointly completed should be <= individual completions
  assert.ok(summary.jointlyCompletedCount <= summary.userCompletedCount);
  assert.ok(summary.jointlyCompletedCount <= summary.partnerCompletedCount);

  // Percentages are between 0 and 100
  assert.ok(summary.jointPercentage >= 0 && summary.jointPercentage <= 100);
  assert.ok(summary.userPercentage >= 0 && summary.userPercentage <= 100);
  assert.ok(summary.partnerPercentage >= 0 && summary.partnerPercentage <= 100);

  // Clusters should exist and have positive counts
  assert.ok(summary.clusterProgress['Pre-Clinical'].total > 0);
  assert.ok(summary.clusterProgress['Para-Clinical'].total > 0);
  assert.ok(summary.clusterProgress['Clinical_Major'].total > 0);
});

test('filterSyllabusMilestones filters by joint status and clusters accurately', () => {
  const jointOnly = filterSyllabusMilestones(
    INITIAL_SYLLABUS_MILESTONES,
    'joint',
    'all'
  );
  for (const m of jointOnly) {
    assert.equal(m.completedByUser, true);
    assert.equal(m.completedByPartner, true);
  }

  const preClinical = filterSyllabusMilestones(
    INITIAL_SYLLABUS_MILESTONES,
    'all',
    'Pre-Clinical'
  );
  for (const m of preClinical) {
    assert.equal(m.cluster, 'Pre-Clinical');
  }

  const searched = filterSyllabusMilestones(
    INITIAL_SYLLABUS_MILESTONES,
    'all',
    'all',
    'Hematology'
  );
  assert.ok(searched.length >= 1);
  assert.ok(searched[0].topic.includes('Hematology'));
});

test('toggleMilestoneCompletion updates completion and logs study revision', () => {
  const targetId = 'm6'; // initially completedByUser: false, completedByPartner: true
  const initial = INITIAL_SYLLABUS_MILESTONES.find((m) => m.id === targetId)!;
  assert.equal(initial.completedByUser, false);

  const updatedList = toggleMilestoneCompletion(
    INITIAL_SYLLABUS_MILESTONES,
    targetId,
    'user',
    'mastered',
    30
  );

  const updated = updatedList.find((m) => m.id === targetId)!;
  assert.equal(updated.completedByUser, true);
  assert.equal(updated.completedByPartner, true);
  assert.equal(updated.mcqsSolved, initial.mcqsSolved + 30);
  assert.equal(updated.revisionStage, 'mastered');
});
