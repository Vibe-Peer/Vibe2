import type { MedicalExam, Subject } from './partnerMatching.ts';
import { MBBS_SUBJECTS } from './partnerMatching.ts';

export type SubjectCluster =
  | 'Pre-Clinical'
  | 'Para-Clinical'
  | 'Clinical_Minor'
  | 'Clinical_Major';

export interface SyllabusMilestone {
  id: string;
  subject: Subject;
  cluster: SubjectCluster;
  topic: string;
  exam: MedicalExam;
  highYieldWeight: 'High' | 'Very High' | 'Crucial Repeat';
  completedByUser: boolean;
  completedByPartner: boolean;
  revisionStage: 'not_started' | '1st_read' | 'qbank_solved' | 'mastered';
  mcqsSolved: number;
  lastUpdatedDate: string;
  notes?: string;
}

export interface SyllabusProgressSummary {
  totalMilestones: number;
  userCompletedCount: number;
  partnerCompletedCount: number;
  jointlyCompletedCount: number;
  jointPercentage: number;
  userPercentage: number;
  partnerPercentage: number;
  clusterProgress: Record<
    SubjectCluster,
    { total: number; completed: number; percentage: number }
  >;
  subjectBreakdown: Record<
    string,
    { total: number; completed: number; percentage: number }
  >;
}

export const INITIAL_SYLLABUS_MILESTONES: SyllabusMilestone[] = [
  // 1. Pre-Clinical
  {
    id: 'm1',
    subject: 'Anatomy',
    cluster: 'Pre-Clinical',
    topic: 'Upper Limb Brachial Plexus & Nerve Injuries',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm2',
    subject: 'Anatomy',
    cluster: 'Pre-Clinical',
    topic: 'Head & Neck Cranial Nerve Foramina & Triangles',
    exam: 'NEET_PG',
    highYieldWeight: 'Very High',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm3',
    subject: 'Physiology',
    cluster: 'Pre-Clinical',
    topic: 'Cardiovascular Cardiac Cycle & Pressure-Volume Loops',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm4',
    subject: 'Biochemistry',
    cluster: 'Pre-Clinical',
    topic: 'Inborn Errors of Amino Acid Metabolism & Vitamins',
    exam: 'NEET_PG',
    highYieldWeight: 'High',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },

  // 2. Para-Clinical
  {
    id: 'm5',
    subject: 'Pathology',
    cluster: 'Para-Clinical',
    topic: 'Hematology Leukemias, Lymphomas & Blood Smear IBQs',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm6',
    subject: 'Pathology',
    cluster: 'Para-Clinical',
    topic: 'General Pathology Apoptosis, Necrosis & Amyloidosis',
    exam: 'NEET_PG',
    highYieldWeight: 'High',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm7',
    subject: 'Pharmacology',
    cluster: 'Para-Clinical',
    topic: 'Autonomic Nervous System & Anticholinesterases',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm8',
    subject: 'Pharmacology',
    cluster: 'Para-Clinical',
    topic: 'Antimicrobial Agents & Resistance Mechanisms',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm9',
    subject: 'Microbiology',
    cluster: 'Para-Clinical',
    topic: 'Bacteriology Culture Media, Stains & Gram Negatives',
    exam: 'NEET_PG',
    highYieldWeight: 'Very High',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm10',
    subject: 'Forensic Medicine',
    cluster: 'Para-Clinical',
    topic: 'Thanatology, Post-Mortem Lividity & Toxicology',
    exam: 'NEET_PG',
    highYieldWeight: 'High',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },

  // 3. Clinical Minor
  {
    id: 'm11',
    subject: 'PSM (Community Medicine)',
    cluster: 'Clinical_Minor',
    topic: 'Epidemiology Study Designs, Bias & Screening Tests',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm12',
    subject: 'Ophthalmology',
    cluster: 'Clinical_Minor',
    topic: 'Glaucoma, Cataract & Fundoscopy Signs',
    exam: 'NEET_PG',
    highYieldWeight: 'Very High',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm13',
    subject: 'ENT',
    cluster: 'Clinical_Minor',
    topic: 'Audiometry (Rinne/Weber) & CSOM Complications',
    exam: 'NEET_PG',
    highYieldWeight: 'High',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },

  // 4. Clinical Major
  {
    id: 'm14',
    subject: 'General Medicine',
    cluster: 'Clinical_Major',
    topic: 'Cardiology ECG Arrhythmias & Acute Coronary Syndromes',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm15',
    subject: 'General Medicine',
    cluster: 'Clinical_Major',
    topic: 'Nephrology Glomerulonephritis & Acid-Base Disorders',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm16',
    subject: 'General Surgery',
    cluster: 'Clinical_Major',
    topic: 'Trauma ATLS Protocols & Acute Abdomen Emergencies',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm17',
    subject: 'OBGYN',
    cluster: 'Clinical_Major',
    topic: 'Pre-Eclampsia, Eclampsia & Antenatal Protocols',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm18',
    subject: 'Pediatrics',
    cluster: 'Clinical_Major',
    topic: 'Neonatal Resuscitation & Congenital Heart Defects',
    exam: 'NEET_PG',
    highYieldWeight: 'Very High',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
  {
    id: 'm19',
    subject: 'Radio-diagnosis',
    cluster: 'Clinical_Major',
    topic: 'Emergency Brain CT Hemorrhage & Chest Imaging Signs',
    exam: 'NEET_PG',
    highYieldWeight: 'Crucial Repeat',
    completedByUser: false,
    completedByPartner: false,
    revisionStage: 'not_started',
    mcqsSolved: 0,
    lastUpdatedDate: '-',
  },
];

/**
 * Calculates quantitative syllabus completion metrics between both study partners.
 */
export function calculateSyllabusProgress(
  milestones: SyllabusMilestone[]
): SyllabusProgressSummary {
  const totalMilestones = milestones.length;
  if (totalMilestones === 0) {
    return {
      totalMilestones: 0,
      userCompletedCount: 0,
      partnerCompletedCount: 0,
      jointlyCompletedCount: 0,
      jointPercentage: 0,
      userPercentage: 0,
      partnerPercentage: 0,
      clusterProgress: {
        'Pre-Clinical': { total: 0, completed: 0, percentage: 0 },
        'Para-Clinical': { total: 0, completed: 0, percentage: 0 },
        Clinical_Minor: { total: 0, completed: 0, percentage: 0 },
        Clinical_Major: { total: 0, completed: 0, percentage: 0 },
      },
      subjectBreakdown: {},
    };
  }

  let userCompletedCount = 0;
  let partnerCompletedCount = 0;
  let jointlyCompletedCount = 0;

  const clusterProgress: SyllabusProgressSummary['clusterProgress'] = {
    'Pre-Clinical': { total: 0, completed: 0, percentage: 0 },
    'Para-Clinical': { total: 0, completed: 0, percentage: 0 },
    Clinical_Minor: { total: 0, completed: 0, percentage: 0 },
    Clinical_Major: { total: 0, completed: 0, percentage: 0 },
  };

  const subjectBreakdown: SyllabusProgressSummary['subjectBreakdown'] = {};

  for (const m of milestones) {
    if (m.completedByUser) userCompletedCount++;
    if (m.completedByPartner) partnerCompletedCount++;
    if (m.completedByUser && m.completedByPartner) jointlyCompletedCount++;

    // Cluster
    clusterProgress[m.cluster].total++;
    if (m.completedByUser || m.completedByPartner) {
      clusterProgress[m.cluster].completed++;
    }

    // Subject
    if (!subjectBreakdown[m.subject]) {
      subjectBreakdown[m.subject] = { total: 0, completed: 0, percentage: 0 };
    }
    subjectBreakdown[m.subject].total++;
    if (m.completedByUser || m.completedByPartner) {
      subjectBreakdown[m.subject].completed++;
    }
  }

  // Calculate percentages
  const jointPercentage = Math.round((jointlyCompletedCount / totalMilestones) * 100);
  const userPercentage = Math.round((userCompletedCount / totalMilestones) * 100);
  const partnerPercentage = Math.round((partnerCompletedCount / totalMilestones) * 100);

  for (const c of Object.keys(clusterProgress) as SubjectCluster[]) {
    const item = clusterProgress[c];
    item.percentage = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
  }

  for (const s of Object.keys(subjectBreakdown)) {
    const item = subjectBreakdown[s];
    item.percentage = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
  }

  return {
    totalMilestones,
    userCompletedCount,
    partnerCompletedCount,
    jointlyCompletedCount,
    jointPercentage,
    userPercentage,
    partnerPercentage,
    clusterProgress,
    subjectBreakdown,
  };
}

/**
 * Filter milestones based on completion status, cluster, or search text.
 */
export function filterSyllabusMilestones(
  milestones: SyllabusMilestone[],
  statusFilter: 'all' | 'joint' | 'user' | 'partner' | 'pending',
  clusterFilter: 'all' | SubjectCluster,
  searchQuery: string = ''
): SyllabusMilestone[] {
  return milestones.filter((m) => {
    // Cluster
    if (clusterFilter !== 'all' && m.cluster !== clusterFilter) {
      return false;
    }

    // Status
    if (statusFilter === 'joint' && (!m.completedByUser || !m.completedByPartner)) {
      return false;
    }
    if (statusFilter === 'user' && !m.completedByUser) {
      return false;
    }
    if (statusFilter === 'partner' && !m.completedByPartner) {
      return false;
    }
    if (statusFilter === 'pending' && (m.completedByUser || m.completedByPartner)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = m.topic.toLowerCase().includes(q);
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchNotes = (m.notes || '').toLowerCase().includes(q);
      if (!matchTopic && !matchSubject && !matchNotes) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Log or update milestone completion status by user, partner, or both.
 */
export function toggleMilestoneCompletion(
  milestones: SyllabusMilestone[],
  milestoneId: string,
  target: 'user' | 'partner' | 'both',
  revisionStage?: SyllabusMilestone['revisionStage'],
  additionalMcqs?: number
): SyllabusMilestone[] {
  return milestones.map((m) => {
    if (m.id !== milestoneId) return m;

    let updatedUser = m.completedByUser;
    let updatedPartner = m.completedByPartner;

    if (target === 'user') {
      updatedUser = !updatedUser;
    } else if (target === 'partner') {
      updatedPartner = !updatedPartner;
    } else if (target === 'both') {
      const willComplete = !(updatedUser && updatedPartner);
      updatedUser = willComplete;
      updatedPartner = willComplete;
    }

    return {
      ...m,
      completedByUser: updatedUser,
      completedByPartner: updatedPartner,
      revisionStage: revisionStage || (updatedUser && updatedPartner ? 'mastered' : m.revisionStage),
      mcqsSolved: m.mcqsSolved + (additionalMcqs || 0),
      lastUpdatedDate: 'Just now',
    };
  });
}
