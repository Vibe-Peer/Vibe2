import test from 'node:test';
import assert from 'node:assert/strict';
import {
  matchesGenderCriteria,
  calculateCompatibility,
  getRecommendedPartners,
} from './partnerMatching.ts';
import type { MedicalProfile } from './partnerMatching.ts';

const mockMaleDoctor: MedicalProfile = {
  id: 'doc-aarav',
  name: 'Dr. Aarav Sharma',
  gender: 'male',
  targetPgBranch: 'DM Cardiology (MD Gen Med)', // Replaced Major with NEET SS Block
  academicInterests: [
    'Clinical Case Vignettes',
    'Image-Based Questions (IBQs)',
    'High-Yield 20th Notebook Revision',
    'Grand Test (GT) Analysis',
  ],
  targetExam: 'NEET_PG',
  targetYear: 2026,
  studyPartnerPreferences: {
    preferredGender: 'opposite',
    targetStudyHoursPerDay: 8,
    studyRhythm: 'night_owl',
    complementarySubjectsNeeded: ['Pathology', 'General Surgery'],
    qBankPlatform: 'Marrow',
  },
  college: 'King George’s Medical University (KGMU)',
  stage: 'Intern',
  strongSubjects: ['Pharmacology', 'Physiology', 'Forensic Medicine'],
  weakSubjects: ['Pathology', 'General Surgery', 'OBGYN'],
  dailyTargetMCQs: 100,
  bio: 'Marrow Plan C user aiming for DM Cardiology in NEET SS.',
  verifiedStudent: true,
  avatarUrl: '',
};

// Female candidate 1: Same exam (NEET_PG), 4 shared interests, Complementary NEET SS Track (Interventional Radiology)
const mockFemaleDoctorHighSynergy: MedicalProfile = {
  id: 'doc-ananya',
  name: 'Dr. Ananya Iyer',
  gender: 'female',
  targetPgBranch: 'Interventional Radiology & Neuro-Imaging (MD Radio)', // Complementary NEET SS Track!
  academicInterests: [
    'Clinical Case Vignettes',
    'Image-Based Questions (IBQs)',
    'Grand Test (GT) Analysis',
    'Radiology CT/MRI Signs',
    'High-Yield 20th Notebook Revision',
  ],
  targetExam: 'NEET_PG', // Same Target Exam (Priority 1)
  targetYear: 2026,
  studyPartnerPreferences: {
    preferredGender: 'opposite',
    targetStudyHoursPerDay: 8,
    studyRhythm: 'night_owl',
    complementarySubjectsNeeded: ['Pharmacology'],
    qBankPlatform: 'Marrow',
  },
  college: 'AIIMS New Delhi',
  stage: 'Post-Intern',
  strongSubjects: ['Pathology', 'General Surgery', 'Microbiology'],
  weakSubjects: ['Pharmacology', 'Physiology'],
  dailyTargetMCQs: 120,
  bio: 'Post-intern targeting top 500 in NEET PG & Interventional Radiology in NEET SS.',
  verifiedStudent: true,
  avatarUrl: '',
};

// Female candidate 2: Different exam (FMGE), fewer shared interests, unrelated NEET SS track
const mockFemaleDoctorLowerSynergy: MedicalProfile = {
  id: 'doc-priya',
  name: 'Dr. Priya Nair',
  gender: 'female',
  targetPgBranch: 'Dermatosurgery & Aesthetic Medicine (MD Dermatology)',
  academicInterests: ['Pediatric Milestones & Genetics'],
  targetExam: 'FMGE', // Different Exam
  targetYear: 2026,
  studyPartnerPreferences: {
    preferredGender: 'opposite',
    targetStudyHoursPerDay: 6,
    studyRhythm: 'early_bird',
    complementarySubjectsNeeded: ['Anatomy'],
    qBankPlatform: 'PrepLadder',
  },
  college: 'Tbilisi State Medical University',
  stage: 'Foreign Graduate',
  strongSubjects: ['OBGYN', 'Pediatrics'],
  weakSubjects: ['Anatomy', 'Biochemistry'],
  dailyTargetMCQs: 80,
  bio: 'FMGE aspirant.',
  verifiedStudent: true,
  avatarUrl: '',
};

const mockMaleDoctorSameGender: MedicalProfile = {
  id: 'doc-rohit',
  name: 'Dr. Rohit Varma',
  gender: 'male',
  targetPgBranch: 'DM Cardiology (MD Gen Med)',
  academicInterests: ['Clinical Case Vignettes'],
  targetExam: 'NEET_PG',
  targetYear: 2026,
  studyPartnerPreferences: {
    preferredGender: 'opposite',
    targetStudyHoursPerDay: 8,
    studyRhythm: 'night_owl',
    complementarySubjectsNeeded: [],
    qBankPlatform: 'Marrow',
  },
  college: 'CMC Vellore',
  stage: 'Intern',
  strongSubjects: ['Radio-diagnosis'],
  weakSubjects: ['Pharmacology'],
  dailyTargetMCQs: 100,
  bio: 'Looking for female study buddy.',
  verifiedStudent: true,
  avatarUrl: '',
};

test('matchesGenderCriteria filters out same gender when opposite is preferred', () => {
  assert.equal(matchesGenderCriteria(mockMaleDoctor, mockMaleDoctorSameGender), false);
  assert.equal(matchesGenderCriteria(mockMaleDoctor, mockFemaleDoctorHighSynergy), true);
  assert.equal(matchesGenderCriteria(mockMaleDoctor, mockMaleDoctor), false);
});

test('Matching Algorithm prioritizes 1. Same Target Exam, 2. Academic Interests, 3. NEET SS PG Branch Synergy', () => {
  const resultHigh = calculateCompatibility(mockMaleDoctor, mockFemaleDoctorHighSynergy);

  // Priority 1: Target Exam (NEET_PG == NEET_PG) -> 40 points
  assert.equal(resultHigh.breakdown.targetExamScore, 40);

  // Priority 2: Overlapping Academic Interests (4 shared items) -> 35 points
  assert.equal(resultHigh.breakdown.academicInterestsScore, 35);
  assert.ok(resultHigh.sharedInterests.includes('Clinical Case Vignettes'));
  assert.ok(resultHigh.sharedInterests.includes('Image-Based Questions (IBQs)'));

  // Priority 3: Complementary NEET SS Track (DM Cardiology & Interventional Radiology) -> 22 points
  assert.equal(resultHigh.neetSsSynergyType, 'Complementary NEET SS Clinical Pairing');
  assert.equal(resultHigh.breakdown.neetSsSynergyScore, 22);

  // Overall Score should be 40 + 35 + 22 = 97
  assert.equal(resultHigh.overallScore, 97);

  // Lower synergy profile test
  const resultLow = calculateCompatibility(mockMaleDoctor, mockFemaleDoctorLowerSynergy);
  assert.ok(resultLow.overallScore < 50);
});

test('getRecommendedPartners ranks candidate list for a given user', () => {
  const all = [mockFemaleDoctorHighSynergy, mockFemaleDoctorLowerSynergy, mockMaleDoctorSameGender];
  const recommendations = getRecommendedPartners(mockMaleDoctor, all);

  assert.equal(recommendations.length, 2); // Excludes same-gender male
  assert.equal(recommendations[0].profile.id, 'doc-ananya'); // High synergy candidate ranked #1
  assert.equal(recommendations[0].compatibility.overallScore, 97);
});
