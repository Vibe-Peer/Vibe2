import React, { useState } from 'react';
import {
  Upload,
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import { MedicalProfile } from '../utils/partnerMatching.ts';
import { SAMPLE_CLINICAL_IMAGES, ClinicalSampleImage } from '../data/mockProfiles.ts';

interface ImageLabProps {
  currentUser: MedicalProfile;
  activePartner: MedicalProfile;
  onShareToPartnerChat: (mcqCase: any) => void;
}

export const ImageLab: React.FC<ImageLabProps> = ({
  currentUser,
  activePartner,
  onShareToPartnerChat,
}) => {
  const defaultSample = SAMPLE_CLINICAL_IMAGES[0] || {
    id: 'none',
    title: 'Custom Clinical Image',
    category: 'Radiology',
    examTag: 'NEET_PG',
    description: 'Upload a clinical image, X-ray, or scan for AI analysis.',
    dataUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
    query: 'Analyze this clinical image for high-yield exam findings.',
  };
  const [selectedImage, setSelectedImage] = useState<string>(defaultSample.dataUrl);
  const [selectedSample, setSelectedSample] = useState<ClinicalSampleImage | null>(defaultSample);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // MCQ state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [sharedToast, setSharedToast] = useState<boolean>(false);

  // Analyze image with gemini-4-argon
  const handleAnalyze = async (imageSrc?: string, queryText?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setSharedToast(false);

    const targetImage = imageSrc || selectedImage;
    const targetQuery = queryText !== undefined ? queryText : customQuery;

    try {
      const response = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetImage,
          query: targetQuery,
          exam: currentUser.targetExam,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze clinical image');
      }

      setAnalysisResult(data.data);
    } catch (err: any) {
      console.error('Image analysis error:', err);
      setErrorMsg(err.message || 'Error communicating with analysis service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setSelectedSample(null);
      handleAnalyze(base64, customQuery);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: ClinicalSampleImage) => {
    setSelectedSample(sample);
    setSelectedImage(sample.dataUrl);
    setCustomQuery(sample.query);
    handleAnalyze(sample.dataUrl, sample.query);
  };

  const handleShareToChat = () => {
    if (analysisResult?.examVignetteMCQ) {
      onShareToPartnerChat({
        ...analysisResult.examVignetteMCQ,
        imageTitle: analysisResult.title,
        modality: analysisResult.modality,
      });
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-xs font-semibold border border-cyan-800 mb-2">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Image Understanding Powered by gemini-4-argon</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              AI Clinical Image Lab &amp; Diagnostic Vignettes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Upload any medical image (histopathology slides, chest radiographs, ECG tracings, CT/MRI scans, or dermatological lesions). Gemini 4 Argon extracts classical pathognomonic signs and generates interactive clinical MCQs for you and your study partner.
            </p>
          </div>

          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Active Study Partner</span>
            <span className="text-xs font-bold text-emerald-400">{activePartner.name}</span>
            <span className="text-[10px] text-slate-500 block">({activePartner.targetExam.replace('_', ' ')})</span>
          </div>
        </div>
      </div>

      {/* Preset High-Yield Medical Samples */}
      {SAMPLE_CLINICAL_IMAGES.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Quick 1-Click High-Yield NEET PG / INICET Exam Cases:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SAMPLE_CLINICAL_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedSample?.id === sample.id
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                    {sample.category}
                  </span>
                  <h4 className="text-xs font-semibold mt-1 text-slate-100 line-clamp-1">{sample.title}</h4>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">{sample.examTag.replace('_', ' ')} repeat</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Workspace: Image Preview & Upload Left, Analysis Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image viewer & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                Diagnostic Image View
              </span>
              <label className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview Box */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square flex items-center justify-center group">
              <img
                src={selectedImage}
                alt="Clinical specimen"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                <span className="text-xs bg-slate-900/90 text-slate-200 px-3 py-1 rounded-full border border-slate-700">
                  High-Resolution Diagnostic Asset
                </span>
              </div>
            </div>

            {/* Custom Question input */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-medium text-slate-400">
                Custom Clinical Inquiry or Differential Query:
              </label>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="e.g. Identify pathognomonic radiological signs and rule out acute mimics..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleAnalyze()}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Image with gemini-4-argon...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4" />
                    <span>Run gemini-4-argon Image Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Clinical Findings & Vignette MCQ (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!analysisResult && !isLoading && (
            <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 space-y-3">
              <BrainCircuit className="w-12 h-12 text-cyan-500/40 mx-auto" />
              <h3 className="text-base font-semibold text-slate-200">No Image Analyzed Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select one of the high-yield cases above or upload your own clinical image to get diagnostic findings and challenge your study partner.
              </p>
              <button
                onClick={() => handleAnalyze()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Analyze Sample Case Now
              </button>
            </div>
          )}

          {isLoading && (
            <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">gemini-4-argon is analyzing the image...</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Scanning microscopic cytologic morphology, radiological silhouettes, and synthesizing NEET PG high-yield exam takeaways.
              </p>
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="space-y-4 animate-fade-in">
              {/* Diagnostic Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {analysisResult.modality || 'Diagnostic Imaging'}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">
                      {analysisResult.title || 'Clinical Diagnostic Findings'}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                      Likely Diagnosis: {analysisResult.likelyDiagnosis}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    gemini-4-argon
                  </span>
                </div>

                {/* Classical Signs */}
                {analysisResult.classicalSigns && analysisResult.classicalSigns.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Classical / Pathognomonic Signs:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.classicalSigns.map((sign: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/60"
                        >
                          {sign}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Differential Diagnosis */}
                {analysisResult.differentialDiagnosis && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      Key Differentials to Exclude:
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {analysisResult.differentialDiagnosis.map((diff: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* NEET PG / INICET High-Yield Points */}
                {analysisResult.highYieldPoints && (
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      High-Yield 20th Notebook Exam Pearls:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {analysisResult.highYieldPoints.map((pt: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Study Partner Interactive Vignette MCQ */}
              {analysisResult.examVignetteMCQ && (
                <div className="bg-slate-900 border border-purple-800/50 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        Study Partner Peer Challenge Question
                      </h4>
                    </div>
                    <button
                      onClick={handleShareToChat}
                      className="flex items-center gap-1.5 px-3 py-1 bg-purple-900/60 hover:bg-purple-800/60 text-purple-200 border border-purple-700/60 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{sharedToast ? 'Sent to Study Hub!' : 'Quiz Partner in Hub'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {analysisResult.examVignetteMCQ.question}
                  </p>

                  {/* MCQ Options */}
                  <div className="space-y-2">
                    {analysisResult.examVignetteMCQ.options?.map((opt: string, idx: number) => {
                      const isCorrect = idx === analysisResult.examVignetteMCQ.correctOptionIndex;
                      const isSelected = selectedOption === idx;

                      let btnStyle = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300';
                      if (hasSubmittedAnswer) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-red-950 border-red-500 text-red-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-cyan-950 border-cyan-500 text-cyan-200';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!hasSubmittedAnswer) {
                              setSelectedOption(idx);
                            }
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {hasSubmittedAnswer && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Reveal Button */}
                  {!hasSubmittedAnswer && (
                    <button
                      onClick={() => {
                        if (selectedOption !== null) {
                          setHasSubmittedAnswer(true);
                        }
                      }}
                      disabled={selectedOption === null}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Check Answer
                    </button>
                  )}

                  {/* Explanation */}
                  {hasSubmittedAnswer && (
                    <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs text-purple-200 space-y-1">
                      <span className="font-bold text-purple-300 block">Explanation &amp; High-Yield Rationale:</span>
                      <p>{analysisResult.examVignetteMCQ.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
