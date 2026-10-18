import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Download,
  Share2,
  RefreshCw,
  Edit3,
  Upload,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { MedicalProfile } from '../utils/partnerMatching.ts';

interface MnemonicStudioProps {
  currentUser: MedicalProfile;
  activePartner: MedicalProfile;
  onShareToHub: (imageObj: { title: string; imageUrl: string }) => void;
}

const MNEMONIC_TEMPLATES = [
  {
    title: 'Anion Gap Acidosis (HARDCAR)',
    prompt:
      'High-yield visual medical mnemonic diagram for Normal Anion Gap Metabolic Acidosis: HARDCAR (Hyperalimentation, Acetazolamide, Renal tubular acidosis, Diarrhea, Carbonic anhydrase inhibitors, Ammonium chloride, Recovery phase of DKA). Clean, high contrast medical PG review card.',
  },
  {
    title: 'Coeliac Trunk Branches',
    prompt:
      'Clear anatomical diagram showing Coeliac Trunk trifurcation: Left Gastric Artery, Splenic Artery, and Common Hepatic Artery with labels and clinical gastric ulcer bleeding territories.',
  },
  {
    title: 'Glycogen Storage Diseases',
    prompt:
      'High-yield comparative study chart for Glycogen Storage Diseases: Type 1 (Von Gierke - Glucose-6-phosphatase), Type 2 (Pompe - Lysosomal alpha-glucosidase / cardiomegaly), Type 5 (McArdle - Muscle phosphorylase).',
  },
  {
    title: 'Cranial Nerve Foramina',
    prompt:
      'Medical revision infographic of skull base showing Superior Orbital Fissure (CN III, IV, V1, VI), Foramen Rotundum (V2), Foramen Ovale (V3), and Jugular Foramen (CN IX, X, XI).',
  },
];

export const MnemonicStudio: React.FC<MnemonicStudioProps> = ({
  currentUser,
  activePartner,
  onShareToHub,
}) => {
  const [prompt, setPrompt] = useState<string>(MNEMONIC_TEMPLATES[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [imageSize, setImageSize] = useState<string>('1K');
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [uploadedBaseImage, setUploadedBaseImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sharedToast, setSharedToast] = useState<boolean>(false);

  const handleGenerateOrEdit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setSharedToast(false);

    try {
      const response = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          imageSize,
          editImageBase64: isEditingMode && uploadedBaseImage ? uploadedBaseImage : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate visual');
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error('Mnemonic generation error:', err);
      setErrorMsg(err.message || 'Error communicating with visual generation service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImageForEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedBaseImage(reader.result as string);
      setIsEditingMode(true);
    };
    reader.readAsDataURL(file);
  };

  const handleShareToPartner = () => {
    if (generatedImageUrl) {
      onShareToHub({
        title: prompt.slice(0, 45) + '...',
        imageUrl: generatedImageUrl,
      });
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-400 text-xs font-semibold border border-purple-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Image Creation &amp; Editing Powered by gemini-nano-banana-2.1</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              AI Mnemonic &amp; Medical Visual Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Turn dense medical facts, pharmacology tables, and anatomical relationships into vivid study diagrams and visual mnemonics using <strong>gemini-nano-banana-2.1</strong>. You can also upload an existing diagram and edit or annotate it for peer revision.
            </p>
          </div>

          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Shared with Study Room</span>
            <span className="text-xs font-bold text-emerald-400">{activePartner.name}</span>
          </div>
        </div>
      </div>

      {/* Preset Templates */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          High-Yield Mnemonic Prompt Starters:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {MNEMONIC_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(tmpl.prompt);
                setIsEditingMode(false);
                setUploadedBaseImage(null);
              }}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/40 hover:border-purple-600/60 text-left transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-purple-300">{tmpl.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{tmpl.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Input & Mode Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            {/* Mode Toggle: Create New vs Edit Existing */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  setIsEditingMode(false);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  !isEditingMode ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Text Prompt to Image</span>
              </button>
              <button
                onClick={() => {
                  setIsEditingMode(true);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  isEditingMode ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Existing Image</span>
              </button>
            </div>

            {/* If in edit mode, show image upload */}
            {isEditingMode && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-purple-900/60 space-y-2">
                <span className="text-xs font-bold text-purple-300 block">
                  Step 1: Upload Source Image to Edit
                </span>
                {uploadedBaseImage ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800">
                    <img src={uploadedBaseImage} alt="Base" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setUploadedBaseImage(null)}
                      className="absolute top-2 right-2 bg-slate-900/90 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                    <Upload className="w-6 h-6 text-purple-400" />
                    <span className="text-xs text-slate-300 font-medium">Click to upload medical sketch or diagram</span>
                    <span className="text-[10px] text-slate-500">PNG, JPG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImageForEdit}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {/* Prompt Text Input */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                {isEditingMode
                  ? 'Step 2: Describe edits or annotations to add using gemini-nano-banana-2.1:'
                  : 'Describe the medical diagram, mnemonic visual, or anatomy chart:'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                placeholder={
                  isEditingMode
                    ? 'e.g. Add red arrows pointing to the anterior descending artery and place high-yield NEET PG text labels...'
                    : 'e.g. Create a clear visual mnemonic diagram for Autosomal Dominant disorders with mnemonic "VERY POWERFUL MALES"...'
                }
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Config Options */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Aspect Ratio:</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="1:1">1:1 Square (Card)</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="4:3">4:3 Slide Format</option>
                  <option value="9:16">9:16 Mobile Story</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Resolution:</label>
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="1K">1K Standard HD</option>
                  <option value="2K">2K Ultra Sharp</option>
                </select>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateOrEdit}
              disabled={isLoading || !prompt.trim() || (isEditingMode && !uploadedBaseImage)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing with gemini-nano-banana-2.1...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isEditingMode ? 'Edit Image with gemini-nano-banana-2.1' : 'Generate with gemini-nano-banana-2.1'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Result Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!generatedImageUrl && !isLoading && (
            <div className="p-16 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 space-y-3">
              <Sparkles className="w-12 h-12 text-purple-500/40 mx-auto" />
              <h3 className="text-base font-semibold text-slate-200">No Visual Generated Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select one of the high-yield mnemonic starters or describe your own medical topic to create an educational visual for your study buddy.
              </p>
              <button
                onClick={handleGenerateOrEdit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Generate First Mnemonic Visual
              </button>
            </div>
          )}

          {isLoading && (
            <div className="p-16 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-400 animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">
                gemini-nano-banana-2.1 is creating your visual...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Synthesizing high-contrast medical diagrams, mnemonic anchors, and exam pearls.
              </p>
            </div>
          )}

          {generatedImageUrl && !isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    High-Yield Visual Study Card
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {prompt.slice(0, 50)}...
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded">
                    gemini-nano-banana-2.1
                  </span>
                </div>
              </div>

              {/* Rendered Image Display */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <img
                  src={generatedImageUrl}
                  alt="Generated mnemonic"
                  className="w-full max-h-[480px] object-contain"
                />
              </div>

              {/* Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ready for peer review &amp; Grand Test active recall</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generatedImageUrl}
                    download="medpeer-mnemonic.png"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download</span>
                  </a>

                  <button
                    onClick={handleShareToPartner}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white shadow-md shadow-purple-600/20 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{sharedToast ? 'Sent to Study Hub!' : 'Share to Study Room'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
