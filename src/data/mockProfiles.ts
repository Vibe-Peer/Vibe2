import { MedicalProfile, createDefaultStudyStreak } from '../utils/partnerMatching.ts';

export const INITIAL_USER_MALE: MedicalProfile = {
  id: 'doc-aarav',
  name: 'Dr. Aarav Sharma',
  gender: 'male',
  targetPgBranch: 'DM Cardiology (MD Gen Med)',
  academicInterests: [
    'Clinical Case Vignettes',
    'Image-Based Questions (IBQs)',
    'High-Yield 20th Notebook Revision',
    'Grand Test (GT) Analysis',
    'ECG & Arrhythmia Interpretation',
  ],
  targetExam: 'NEET_PG',
  targetYear: 2026,
  studyPartnerPreferences: {
    preferredGender: 'opposite',
    targetStudyHoursPerDay: 8,
    studyRhythm: 'night_owl',
    complementarySubjectsNeeded: ['Pathology', 'General Surgery', 'OBGYN'],
    qBankPlatform: 'Marrow',
  },
  college: 'King George’s Medical University (KGMU), Lucknow',
  stage: 'Intern',
  strongSubjects: ['Pharmacology', 'Physiology', 'Forensic Medicine'],
  weakSubjects: ['Pathology', 'General Surgery', 'OBGYN'],
  dailyTargetMCQs: 100,
  bio: 'MBBS intern preparing for NEET PG 2026.',
  verifiedStudent: true,
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
  isOnline: true,
  studyStreak: createDefaultStudyStreak(0, 0, false),
};

export const INITIAL_USER_FEMALE: MedicalProfile = {
  id: 'doc-ananya',
  name: 'Dr. Ananya Iyer',
  gender: 'female',
  targetPgBranch: 'Interventional Radiology & Neuro-Imaging (MD Radio)',
  academicInterests: [
    'Clinical Case Vignettes',
    'Image-Based Questions (IBQs)',
    'Radiology CT/MRI Signs',
    'Grand Test (GT) Analysis',
    'High-Yield 20th Notebook Revision',
  ],
  targetExam: 'NEET_PG',
  targetYear: 2026,
  studyPartnerPreferences: {
    preferredGender: 'opposite',
    targetStudyHoursPerDay: 9,
    studyRhythm: 'night_owl',
    complementarySubjectsNeeded: ['Pharmacology', 'Physiology'],
    qBankPlatform: 'Marrow',
  },
  college: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
  stage: 'Post-Intern',
  strongSubjects: ['Pathology', 'General Surgery', 'Microbiology'],
  weakSubjects: ['Pharmacology', 'Physiology', 'Biochemistry'],
  dailyTargetMCQs: 120,
  bio: 'Post-intern dropper targeting NEET PG & Interventional Radiology.',
  verifiedStudent: true,
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
  isOnline: true,
  studyStreak: createDefaultStudyStreak(0, 0, false),
};

// All dummy mock profiles deleted as requested
export const MOCK_ALL_PROFILES: MedicalProfile[] = [];

export interface ClinicalSampleImage {
  id: string;
  title: string;
  category: 'Histopathology' | 'Radiology' | 'ECG' | 'Dermatology' | 'Neurology';
  examTag: 'NEET_PG' | 'INICET' | 'FMGE';
  description: string;
  dataUrl: string;
  query: string;
}

// All dummy sample clinical images deleted as requested
export const SAMPLE_CLINICAL_IMAGES: ClinicalSampleImage[] = [];
