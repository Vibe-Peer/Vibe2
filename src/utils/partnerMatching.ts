export type MedicalExam = 'NEET_PG' | 'INICET' | 'FMGE';
export type Gender = 'male' | 'female' | 'other';
export type PartnerGenderPref = 'male' | 'female' | 'opposite' | 'any';
export type StudyRhythm = 'early_bird' | 'night_owl' | 'flexible';

export const MBBS_SUBJECTS = [
  'Anatomy',
  'Physiology',
  'Biochemistry',
  'Pathology',
  'Pharmacology',
  'Microbiology',
  'Forensic Medicine',
  'PSM (Community Medicine)',
  'ENT',
  'Ophthalmology',
  'General Medicine',
  'General Surgery',
  'OBGYN',
  'Pediatrics',
  'Orthopedics',
  'Radio-diagnosis',
  'Dermatology',
  'Psychiatry',
  'Anaesthesia',
] as const;

export type Subject = (typeof MBBS_SUBJECTS)[number];

export const POPULAR_ACADEMIC_INTERESTS = [
  'Clinical Case Vignettes',
  'Image-Based Questions (IBQs)',
  'High-Yield 20th Notebook Revision',
  'Grand Test (GT) Analysis',
  'Active Recall & Spaced Repetition',
  'Marrow Q-Bank Drilling',
  'PrepLadder Rapid Revision',
  'ECG & Arrhythmia Interpretation',
  'Radiology CT/MRI Signs',
  'Histopathology & IHC Markers',
  'Surgical Anatomy & Instruments',
  'Pharmacotherapy & Antimicrobial Stewards',
  'Obstetric Protocols & Partograph',
  'Pediatric Milestones & Genetics',
  'Forensic Autopsy & Toxicological Signs',
] as const;

export const NEET_SS_BRANCHES = [
  // Medicine Group (DM tracks)
  'DM Cardiology (MD Gen Med)',
  'DM Neurology (MD Gen Med)',
  'DM Gastroenterology (MD Gen Med)',
  'DM Nephrology (MD Gen Med)',
  'DM Medical Oncology (MD Gen Med)',
  'DM Endocrinology (MD Gen Med)',
  'DM Critical Care Medicine (MD Gen Med / Anaesthesia)',
  // Surgery Group (MCh tracks)
  'MCh Neurosurgery (MS Gen Surgery)',
  'MCh Urology (MS Gen Surgery)',
  'MCh Surgical Oncology (MS Gen Surgery)',
  'MCh Plastic & Reconstructive Surgery (MS Gen Surgery)',
  'MCh CTVS Cardio-Thoracic Surgery (MS Gen Surgery)',
  'MCh Pediatric Surgery (MS Gen Surgery)',
  // Pediatrics Group (DM tracks)
  'DM Neonatology (MD Pediatrics)',
  'DM Pediatric Neurology (MD Pediatrics)',
  'DM Pediatric Cardiology (MD Pediatrics)',
  // Radiology Group
  'Interventional Radiology & Neuro-Imaging (MD Radio)',
  'Body Imaging & Musculoskeletal Radio (MD Radio)',
  // OBGYN Group
  'Gynaecological Oncology (MS OBGYN)',
  'Reproductive Medicine & Maternal Fetal Medicine (MS OBGYN)',
  // Orthopedics Group
  'Joint Replacement & Spine Surgery (MS Ortho)',
  'Arthroscopy & Sports Medicine (MS Ortho)',
  // Dermatology Group
  'Dermatosurgery & Aesthetic Medicine (MD Dermatology)',
  // Anaesthesia & Pathology
  'Cardiac Anaesthesia & Neuroanaesthesia (MD Anaesthesia)',
  'Oncopathology & Hematopathology (MD Pathology)',
] as const;

export type NeetSsBranch = (typeof NEET_SS_BRANCHES)[number];

export interface StudyPartnerPreferences {
  preferredGender: PartnerGenderPref;
  targetStudyHoursPerDay: number;
  studyRhythm: StudyRhythm;
  complementarySubjectsNeeded: Subject[];
  qBankPlatform: 'Marrow' | 'PrepLadder' | 'Cerebellum' | 'DAMS' | 'Bhatia';
}

export interface DailyStudyLog {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  studied: boolean;
  hours: number;
  mcqsSolved: number;
  subject?: string;
}

export interface StudyStreakInfo {
  currentStreakDays: number;
  longestStreakDays: number;
  lastStudyDate: string; // YYYY-MM-DD
  todayCheckedIn: boolean;
  weeklyActivity: DailyStudyLog[]; // past 7 days
  totalHoursStudied: number;
  totalMcqsSolved: number;
  streakFreezeAvailable: number; // 0 or 1
  streakFreezeUsed: boolean;
  targetStreakGoalDays: number; // e.g. 21, 30, 60
}

export interface MedicalProfile {
  id: string;
  name: string;
  gender: Gender;
  targetPgBranch: NeetSsBranch | string; // Replaced Major with NEET SS & Target PG Branch Block
  academicInterests: string[]; // List of specific interests
  targetExam: MedicalExam; // NEET PG, INICET, FMGE
  targetYear: number;
  studyPartnerPreferences: StudyPartnerPreferences;
  college: string;
  stage: 'Intern' | 'Post-Intern' | 'Final MBBS' | 'Foreign Graduate';
  strongSubjects: Subject[];
  weakSubjects: Subject[];
  dailyTargetMCQs: number;
  bio: string;
  verifiedStudent: boolean;
  avatarUrl: string;
  isOnline?: boolean;
  studyStreak?: StudyStreakInfo;
}

export function createDefaultStudyStreak(
  currentStreakDays: number = 0,
  longestStreakDays?: number,
  todayCheckedIn: boolean = false
): StudyStreakInfo {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseSubjects = ['Pathology', 'Pharmacology', 'Cardiology', 'Surgery', 'Radiology', 'Physiology', 'Medicine'];
  
  const weeklyActivity: DailyStudyLog[] = daysOfWeek.map((day, idx) => {
    const isToday = idx === 6;
    const studied = currentStreakDays > 0 && (isToday ? todayCheckedIn : (idx >= 7 - Math.min(currentStreakDays, 6)));
    return {
      date: `2026-10-${12 + idx}`,
      dayLabel: day,
      studied,
      hours: studied ? (isToday ? 7 : 6 + (idx % 3)) : 0,
      mcqsSolved: studied ? (isToday ? 100 : 80 + (idx * 5)) : 0,
      subject: studied ? baseSubjects[idx] : undefined,
    };
  });

  return {
    currentStreakDays,
    longestStreakDays: longestStreakDays ?? currentStreakDays,
    lastStudyDate: todayCheckedIn ? '2026-10-18' : '',
    todayCheckedIn,
    weeklyActivity,
    totalHoursStudied: Math.round(currentStreakDays * 7.5),
    totalMcqsSolved: Math.round(currentStreakDays * 95),
    streakFreezeAvailable: 1,
    streakFreezeUsed: false,
    targetStreakGoalDays: currentStreakDays >= 30 ? 60 : currentStreakDays >= 21 ? 30 : currentStreakDays >= 14 ? 21 : 7,
  };
}

export function getStreakMilestone(streakDays: number) {
  if (streakDays >= 60) {
    return { title: 'Diamond Hall of Fame', icon: '🛡️', tier: 'Diamond', nextGoal: 100, color: 'text-cyan-400' };
  }
  if (streakDays >= 30) {
    return { title: '30-Day NEET PG Elite', icon: '👑', tier: 'Elite', nextGoal: 60, color: 'text-amber-400' };
  }
  if (streakDays >= 21) {
    return { title: '21-Day Habit Champion', icon: '🏆', tier: 'Master', nextGoal: 30, color: 'text-yellow-400' };
  }
  if (streakDays >= 14) {
    return { title: '2-Week Momentum Titan', icon: '⚡', tier: 'Titan', nextGoal: 21, color: 'text-emerald-400' };
  }
  if (streakDays >= 7) {
    return { title: '7-Day Consistency Master', icon: '🔥', tier: 'Expert', nextGoal: 14, color: 'text-orange-400' };
  }
  return { title: 'Rookie Habit Builder', icon: '🌱', tier: 'Rising', nextGoal: 7, color: 'text-blue-400' };
}

// Complementary NEET SS Super-Specialty Pairings (Synergy in Clinical Case Discussion)
export const COMPLEMENTARY_NEET_SS_MAP: Record<string, string[]> = {
  'DM Cardiology (MD Gen Med)': [
    'Interventional Radiology & Neuro-Imaging (MD Radio)',
    'MCh CTVS Cardio-Thoracic Surgery (MS Gen Surgery)',
    'DM Critical Care Medicine (MD Gen Med / Anaesthesia)',
    'DM Nephrology (MD Gen Med)',
  ],
  'DM Neurology (MD Gen Med)': [
    'MCh Neurosurgery (MS Gen Surgery)',
    'Interventional Radiology & Neuro-Imaging (MD Radio)',
    'DM Critical Care Medicine (MD Gen Med / Anaesthesia)',
  ],
  'DM Gastroenterology (MD Gen Med)': [
    'MCh Surgical Oncology (MS Gen Surgery)',
    'Interventional Radiology & Neuro-Imaging (MD Radio)',
    'Oncopathology & Hematopathology (MD Pathology)',
  ],
  'DM Nephrology (MD Gen Med)': [
    'MCh Urology (MS Gen Surgery)',
    'DM Cardiology (MD Gen Med)',
    'DM Critical Care Medicine (MD Gen Med / Anaesthesia)',
  ],
  'MCh Neurosurgery (MS Gen Surgery)': [
    'DM Neurology (MD Gen Med)',
    'Interventional Radiology & Neuro-Imaging (MD Radio)',
    'Cardiac Anaesthesia & Neuroanaesthesia (MD Anaesthesia)',
  ],
  'MCh Urology (MS Gen Surgery)': [
    'DM Nephrology (MD Gen Med)',
    'Interventional Radiology & Neuro-Imaging (MD Radio)',
    'MCh Surgical Oncology (MS Gen Surgery)',
  ],
  'MCh Surgical Oncology (MS Gen Surgery)': [
    'DM Medical Oncology (MD Gen Med)',
    'Oncopathology & Hematopathology (MD Pathology)',
    'Interventional Radiology & Neuro-Imaging (MD Radio)',
  ],
  'DM Neonatology (MD Pediatrics)': [
    'Reproductive Medicine & Maternal Fetal Medicine (MS OBGYN)',
    'Gynaecological Oncology (MS OBGYN)',
    'DM Pediatric Cardiology (MD Pediatrics)',
  ],
  'Gynaecological Oncology (MS OBGYN)': [
    'DM Medical Oncology (MD Gen Med)',
    'MCh Surgical Oncology (MS Gen Surgery)',
    'Oncopathology & Hematopathology (MD Pathology)',
  ],
  'Interventional Radiology & Neuro-Imaging (MD Radio)': [
    'DM Cardiology (MD Gen Med)',
    'DM Neurology (MD Gen Med)',
    'MCh Neurosurgery (MS Gen Surgery)',
    'MCh Urology (MS Gen Surgery)',
  ],
  'Joint Replacement & Spine Surgery (MS Ortho)': [
    'Interventional Radiology & Neuro-Imaging (MD Radio)',
    'MCh Plastic & Reconstructive Surgery (MS Gen Surgery)',
  ],
  'Dermatosurgery & Aesthetic Medicine (MD Dermatology)': [
    'MCh Plastic & Reconstructive Surgery (MS Gen Surgery)',
    'Oncopathology & Hematopathology (MD Pathology)',
  ],
};

export interface CompatibilityResult {
  isEligibleOppositeGender: boolean;
  overallScore: number; // 0 - 100
  breakdown: {
    targetExamScore: number; // max 40 (Priority 1)
    academicInterestsScore: number; // max 35 (Priority 2)
    neetSsSynergyScore: number; // max 25 (Priority 3 - Replaces Major)
  };
  synergyHighlights: string[];
  sharedInterests: string[];
  neetSsSynergyType:
    | 'Identical NEET SS Super-Specialty Goal'
    | 'Complementary NEET SS Clinical Pairing'
    | 'Related Medical/Surgical Specialty Track'
    | 'General Medical Postgraduate Match';
  mutualComplements: {
    partnerHelpsUserWith: Subject[];
    userHelpsPartnerWith: Subject[];
  };
}

/**
 * Checks if user and partner satisfy the opposite gender preference criteria.
 */
export function matchesGenderCriteria(user: MedicalProfile, partner: MedicalProfile): boolean {
  if (user.id === partner.id) return false;

  const userPref = user.studyPartnerPreferences?.preferredGender || 'opposite';
  const partnerPref = partner.studyPartnerPreferences?.preferredGender || 'opposite';

  const userExpectsFemale = userPref === 'female' || (userPref === 'opposite' && user.gender === 'male');
  const userExpectsMale = userPref === 'male' || (userPref === 'opposite' && user.gender === 'female');

  if (userExpectsFemale && partner.gender !== 'female') return false;
  if (userExpectsMale && partner.gender !== 'male') return false;

  const partnerExpectsFemale = partnerPref === 'female' || (partnerPref === 'opposite' && partner.gender === 'male');
  const partnerExpectsMale = partnerPref === 'male' || (partnerPref === 'opposite' && partner.gender === 'female');

  if (partnerExpectsFemale && user.gender !== 'female') return false;
  if (partnerExpectsMale && user.gender !== 'male') return false;

  return true;
}

/**
 * Matching Algorithm prioritizing:
 * 1. Same Target Exam (e.g., NEET PG, INICET, FMGE) -> Max 40 points
 * 2. Overlapping Academic Interests (e.g. IBQs, Grand Test review) -> Max 35 points
 * 3. Similar or Complementary NEET SS Super-Specialty PG Branches -> Max 25 points
 */
export function calculateCompatibility(
  user: MedicalProfile,
  partner: MedicalProfile
): CompatibilityResult {
  const isEligible = matchesGenderCriteria(user, partner);

  // -------------------------------------------------------------
  // PRIORITY 1: Target Exam Alignment (Max 40 points)
  // -------------------------------------------------------------
  let targetExamScore = 0;
  if (user.targetExam === partner.targetExam) {
    targetExamScore = 40;
  } else {
    // Both Indian PG exams share ~90% syllabus overlap
    const isBothIndianPG =
      (user.targetExam === 'NEET_PG' && partner.targetExam === 'INICET') ||
      (user.targetExam === 'INICET' && partner.targetExam === 'NEET_PG');
    if (isBothIndianPG) {
      targetExamScore = 24;
    } else {
      targetExamScore = 10;
    }
  }

  // -------------------------------------------------------------
  // PRIORITY 2: Overlapping Academic Interests (Max 35 points)
  // -------------------------------------------------------------
  const userInterests = user.academicInterests || [];
  const partnerInterests = partner.academicInterests || [];
  const sharedInterests = userInterests.filter((interest) =>
    partnerInterests.some((pInt) => pInt.toLowerCase() === interest.toLowerCase())
  );

  let academicInterestsScore = 0;
  if (sharedInterests.length >= 4) {
    academicInterestsScore = 35;
  } else if (sharedInterests.length === 3) {
    academicInterestsScore = 28;
  } else if (sharedInterests.length === 2) {
    academicInterestsScore = 20;
  } else if (sharedInterests.length === 1) {
    academicInterestsScore = 12;
  } else {
    academicInterestsScore = 4;
  }

  // -------------------------------------------------------------
  // PRIORITY 3: NEET SS & Target PG Branch Block Synergy (Max 25 points)
  // -------------------------------------------------------------
  const userBranch = (user.targetPgBranch || '').trim();
  const partnerBranch = (partner.targetPgBranch || '').trim();

  let neetSsSynergyScore = 0;
  let neetSsSynergyType: CompatibilityResult['neetSsSynergyType'] =
    'General Medical Postgraduate Match';

  if (userBranch && partnerBranch && userBranch.toLowerCase() === partnerBranch.toLowerCase()) {
    neetSsSynergyScore = 25;
    neetSsSynergyType = 'Identical NEET SS Super-Specialty Goal';
  } else {
    // Check complementary pairings from COMPLEMENTARY_NEET_SS_MAP
    const complements = COMPLEMENTARY_NEET_SS_MAP[userBranch] || [];
    const isComplementary = complements.some(
      (comp) => comp.toLowerCase() === partnerBranch.toLowerCase()
    );

    if (isComplementary) {
      neetSsSynergyScore = 22;
      neetSsSynergyType = 'Complementary NEET SS Clinical Pairing';
    } else {
      // Related medical/surgical category match
      const isBothSurgical =
        (userBranch.includes('MS') || userBranch.includes('MCh')) &&
        (partnerBranch.includes('MS') || partnerBranch.includes('MCh'));
      const isBothMedical =
        (userBranch.includes('MD') || userBranch.includes('DM')) &&
        (partnerBranch.includes('MD') || partnerBranch.includes('DM'));

      if (isBothSurgical || isBothMedical) {
        neetSsSynergyScore = 16;
        neetSsSynergyType = 'Related Medical/Surgical Specialty Track';
      } else {
        neetSsSynergyScore = 10;
        neetSsSynergyType = 'General Medical Postgraduate Match';
      }
    }
  }

  const overallScore = Math.min(
    100,
    Math.round(targetExamScore + academicInterestsScore + neetSsSynergyScore)
  );

  // Subject complement insights
  const partnerHelpsUser = user.weakSubjects.filter((subj) =>
    partner.strongSubjects.includes(subj)
  );
  const userHelpsPartner = partner.weakSubjects.filter((subj) =>
    user.strongSubjects.includes(subj)
  );

  const synergyHighlights: string[] = [];

  // P1 highlight
  if (user.targetExam === partner.targetExam) {
    synergyHighlights.push(`Direct ${user.targetExam.replace('_', ' ')} candidate alignment (Priority 1)`);
  }

  // P2 highlight
  if (sharedInterests.length > 0) {
    synergyHighlights.push(
      `Shared academic focus: ${sharedInterests.slice(0, 3).join(', ')} (Priority 2)`
    );
  }

  // P3 highlight (NEET SS Track)
  if (neetSsSynergyType === 'Identical NEET SS Super-Specialty Goal') {
    synergyHighlights.push(`Both targeting ${user.targetPgBranch} (Priority 3)`);
  } else if (neetSsSynergyType === 'Complementary NEET SS Clinical Pairing') {
    synergyHighlights.push(
      `Complementary NEET SS Super-Specialty Pairing: ${user.targetPgBranch} & ${partner.targetPgBranch} (Priority 3)`
    );
  }

  return {
    isEligibleOppositeGender: isEligible,
    overallScore,
    breakdown: {
      targetExamScore,
      academicInterestsScore,
      neetSsSynergyScore,
    },
    synergyHighlights,
    sharedInterests,
    neetSsSynergyType,
    mutualComplements: {
      partnerHelpsUserWith: partnerHelpsUser,
      userHelpsPartnerWith: userHelpsPartner,
    },
  };
}

/**
 * Filter and rank potential opposite-gender study partners for a user based on the prioritized algorithm.
 */
export function getRecommendedPartners(
  currentUser: MedicalProfile,
  allProfiles: MedicalProfile[],
  filterExam?: MedicalExam | 'ALL'
): Array<{ profile: MedicalProfile; compatibility: CompatibilityResult }> {
  return allProfiles
    .filter((partner) => partner.id !== currentUser.id)
    .filter((partner) => matchesGenderCriteria(currentUser, partner))
    .filter((partner) => !filterExam || filterExam === 'ALL' || partner.targetExam === filterExam)
    .map((partner) => ({
      profile: partner,
      compatibility: calculateCompatibility(currentUser, partner),
    }))
    .sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);
}
