import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Award,
  Layers,
  Filter,
  Search,
  Plus,
  BookOpen,
  TrendingUp,
  Flame,
  Check,
  Star,
  Users,
  Clock,
  FileText,
  X,
  Stethoscope,
} from 'lucide-react';
import { MedicalProfile, MBBS_SUBJECTS, Subject } from '../utils/partnerMatching.ts';
import {
  SyllabusMilestone,
  SubjectCluster,
  calculateSyllabusProgress,
  filterSyllabusMilestones,
  toggleMilestoneCompletion,
  INITIAL_SYLLABUS_MILESTONES,
} from '../utils/syllabusTracker.ts';

interface SyllabusTrackerViewProps {
  currentUser: MedicalProfile;
  activePartner: MedicalProfile;
}

export const SyllabusTrackerView: React.FC<SyllabusTrackerViewProps> = ({
  currentUser,
  activePartner,
}) => {
  const [milestones, setMilestones] = useState<SyllabusMilestone[]>(
    INITIAL_SYLLABUS_MILESTONES
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'joint' | 'user' | 'partner' | 'pending'>('all');
  const [clusterFilter, setClusterFilter] = useState<'all' | SubjectCluster>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state for logging new topic
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [logSubject, setLogSubject] = useState<Subject>('General Medicine');
  const [logTopicTitle, setLogTopicTitle] = useState<string>('');
  const [logCluster, setLogCluster] = useState<SubjectCluster>('Clinical_Major');
  const [logHighYield, setLogHighYield] = useState<'High' | 'Very High' | 'Crucial Repeat'>('Crucial Repeat');
  const [logStage, setLogStage] = useState<'1st_read' | 'qbank_solved' | 'mastered'>('qbank_solved');
  const [logMcqs, setLogMcqs] = useState<number>(50);
  const [logCompletedBy, setLogCompletedBy] = useState<'me' | 'partner' | 'both'>('both');
  const [logNotes, setLogNotes] = useState<string>('');

  // Summary calculations
  const progress = calculateSyllabusProgress(milestones);
  const totalMcqsSolved = milestones.reduce((sum, m) => sum + (m.mcqsSolved || 0), 0);

  // Filtered milestones list
  const filteredMilestones = filterSyllabusMilestones(
    milestones,
    statusFilter,
    clusterFilter,
    searchQuery
  );

  const handleToggle = (id: string, target: 'user' | 'partner' | 'both') => {
    setMilestones((prev) => toggleMilestoneCompletion(prev, id, target));
  };

  const handleAddNewTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTopicTitle.trim()) return;

    const newMilestone: SyllabusMilestone = {
      id: `custom-${Date.now()}`,
      subject: logSubject,
      cluster: logCluster,
      topic: logTopicTitle.trim(),
      exam: currentUser.targetExam,
      highYieldWeight: logHighYield,
      completedByUser: logCompletedBy === 'me' || logCompletedBy === 'both',
      completedByPartner: logCompletedBy === 'partner' || logCompletedBy === 'both',
      revisionStage: logStage,
      mcqsSolved: logMcqs,
      lastUpdatedDate: 'Just now',
      notes: logNotes.trim() || undefined,
    };

    setMilestones((prev) => [newMilestone, ...prev]);
    setIsLogModalOpen(false);
    setLogTopicTitle('');
    setLogNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Tracker Top Banner & Joint Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-400 text-xs font-semibold border border-emerald-800/80 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shared Syllabus &amp; Milestones Tracker • {currentUser.targetExam.replace('_', ' ')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Joint Syllabus Progress &amp; Topic Log
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track mutual syllabus completion with <strong>{activePartner.name}</strong> ({activePartner.college.split(',')[0]}). Log topics as you solve Q-Banks, review 20th notebook pearls, and achieve joint mastery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Completed Topic</span>
            </button>
          </div>
        </div>

        {/* 4 Quantitative Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {/* Card 1: Jointly Mastered */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-800/60 shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-emerald-400" /> Joint Mastery
              </span>
              <span className="text-xs font-bold text-slate-400">{progress.jointPercentage}%</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-white">
                {progress.jointlyCompletedCount}
                <span className="text-xs text-slate-400 font-normal"> / {progress.totalMilestones} topics</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 rounded-full"
                  style={{ width: `${progress.jointPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Completed by Current User */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                You ({currentUser.name.split(' ')[1]})
              </span>
              <span className="text-xs font-bold text-slate-400">{progress.userPercentage}%</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-white">
                {progress.userCompletedCount}
                <span className="text-xs text-slate-400 font-normal"> / {progress.totalMilestones}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-cyan-500 h-1.5 rounded-full"
                  style={{ width: `${progress.userPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Completed by Partner */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                Partner ({activePartner.name.split(' ')[1]})
              </span>
              <span className="text-xs font-bold text-slate-400">{progress.partnerPercentage}%</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-white">
                {progress.partnerCompletedCount}
                <span className="text-xs text-slate-400 font-normal"> / {progress.totalMilestones}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-1.5 rounded-full"
                  style={{ width: `${progress.partnerPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Total MCQs Solved */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Total Q-Bank MCQs
              </span>
              <span className="text-xs text-emerald-400 font-semibold">Active Prep</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-white">
                {totalMcqsSolved.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> solved</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Across Marrow, PrepLadder &amp; Cerebellum
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Cluster Breakdown Progress Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          Syllabus Milestones by Medical Prof Clusters:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              { key: 'Pre-Clinical', label: '1st Prof: Pre-Clinical', sub: 'Anatomy, Physio, Biochem' },
              { key: 'Para-Clinical', label: '2nd Prof: Para-Clinical', sub: 'Path, Pharma, Micro, FMT' },
              { key: 'Clinical_Minor', label: '3rd Prof: Minor Clinical', sub: 'PSM, Ophtha, ENT' },
              { key: 'Clinical_Major', label: '3rd Prof: Major Clinical', sub: 'Med, Surg, OBG, Peds, Radio' },
            ] as const
          ).map((item) => {
            const clusterData = progress.clusterProgress[item.key];
            return (
              <div
                key={item.key}
                onClick={() =>
                  setClusterFilter(clusterFilter === item.key ? 'all' : item.key)
                }
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  clusterFilter === item.key
                    ? 'bg-emerald-950/40 border-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{item.label}</span>
                  <span className="text-emerald-400 font-extrabold">{clusterData.percentage}%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${clusterData.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 text-right">
                  {clusterData.completed}/{clusterData.total} milestones active
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters and Search Toolbar */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Status:</span>
          {(
            [
              { id: 'all', label: 'All Topics' },
              { id: 'joint', label: '★ Jointly Mastered' },
              { id: 'user', label: `Logged by You` },
              { id: 'partner', label: `Logged by ${activePartner.name.split(' ')[1]}` },
              { id: 'pending', label: 'Pending' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topic or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Milestones Checklist Feed */}
      <div className="space-y-3">
        {filteredMilestones.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-200">No milestones match the filter</h4>
            <p className="text-xs text-slate-500">Try changing your status or cluster filter.</p>
          </div>
        ) : (
          filteredMilestones.map((m) => {
            const isJoint = m.completedByUser && m.completedByPartner;

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isJoint
                    ? 'bg-emerald-950/20 border-emerald-800/60 shadow-sm'
                    : m.completedByUser || m.completedByPartner
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-75'
                }`}
              >
                {/* Milestone Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {m.subject}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.highYieldWeight === 'Crucial Repeat'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : m.highYieldWeight === 'Very High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {m.highYieldWeight}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      Stage:{' '}
                      <strong className="text-slate-200">
                        {m.revisionStage === 'mastered'
                          ? '★ Mastered'
                          : m.revisionStage === 'qbank_solved'
                          ? 'Q-Bank Solved'
                          : '1st Read'}
                      </strong>
                    </span>

                    {m.mcqsSolved > 0 && (
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-900">
                        {m.mcqsSolved} MCQs
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{m.topic}</h4>

                  {m.notes && (
                    <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      "{m.notes}"
                    </p>
                  )}
                </div>

                {/* Partner Completion Status Badges & Quick Action Toggles */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* User Toggle */}
                  <button
                    onClick={() => handleToggle(m.id, 'user')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      m.completedByUser
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Toggle your completion status"
                  >
                    {m.completedByUser ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                    <span>You</span>
                  </button>

                  {/* Partner Toggle */}
                  <button
                    onClick={() => handleToggle(m.id, 'partner')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      m.completedByPartner
                        ? 'bg-purple-950 border-purple-500 text-purple-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title={`Toggle ${activePartner.name.split(' ')[1]}'s completion status`}
                  >
                    {m.completedByPartner ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                    <span>{activePartner.name.split(' ')[1]}</span>
                  </button>

                  {/* Joint Star Button */}
                  <button
                    onClick={() => handleToggle(m.id, 'both')}
                    className={`p-2 rounded-lg border transition cursor-pointer ${
                      isJoint
                        ? 'bg-emerald-600 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-emerald-400'
                    }`}
                    title="Mark as Jointly Mastered by both study partners"
                  >
                    <Star className={`w-3.5 h-3.5 ${isJoint ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* LOG COMPLETED TOPIC MODAL */}
      {/* ========================================================= */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Log Completed Syllabus Topic
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sync topic progress with {activePartner.name} for {currentUser.targetExam.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddNewTopic} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    MBBS Subject:
                  </label>
                  <select
                    value={logSubject}
                    onChange={(e) => setLogSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {MBBS_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject Cluster:
                  </label>
                  <select
                    value={logCluster}
                    onChange={(e) => setLogCluster(e.target.value as SubjectCluster)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Pre-Clinical">1st Prof: Pre-Clinical</option>
                    <option value="Para-Clinical">2nd Prof: Para-Clinical</option>
                    <option value="Clinical_Minor">3rd Prof: Minor Clinical</option>
                    <option value="Clinical_Major">3rd Prof: Major Clinical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Topic Title / Chapter Milestone:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acid-Base Disorders & Arterial Blood Gas Interpretation"
                  value={logTopicTitle}
                  onChange={(e) => setLogTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    High Yield Weight:
                  </label>
                  <select
                    value={logHighYield}
                    onChange={(e) => setLogHighYield(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Crucial Repeat">Crucial Repeat</option>
                    <option value="Very High">Very High</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Revision Stage:
                  </label>
                  <select
                    value={logStage}
                    onChange={(e) => setLogStage(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="1st_read">1st Read Completed</option>
                    <option value="qbank_solved">Q-Bank Solved</option>
                    <option value="mastered">★ Mastered / Revision 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    MCQs Solved:
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={logMcqs}
                    onChange={(e) => setLogMcqs(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Who Completed This Topic:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setLogCompletedBy('me')}
                    className={`py-2 rounded-lg font-bold border transition cursor-pointer ${
                      logCompletedBy === 'me'
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Logged by Me
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogCompletedBy('partner')}
                    className={`py-2 rounded-lg font-bold border transition cursor-pointer ${
                      logCompletedBy === 'partner'
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Logged by {activePartner.name.split(' ')[1]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogCompletedBy('both')}
                    className={`py-2 rounded-lg font-bold border transition cursor-pointer flex items-center justify-center gap-1 ${
                      logCompletedBy === 'both'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Jointly Studied</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  High-Yield Study Notes / Pearl:
                </label>
                <textarea
                  placeholder="e.g. Reviewed Winter's formula and high anion gap causes..."
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
