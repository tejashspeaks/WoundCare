import React, { useState, useEffect } from 'react';
import { ProgressLogEntry, Language, PatientMode } from '../types';
import { Calendar, TrendingDown, TrendingUp, AlertCircle, Plus, Camera, Trash2, CheckCircle2, Ruler, Activity } from 'lucide-react';

interface WoundProgressTrackerProps {
  currentLang: Language;
  highContrast: boolean;
  patientMode: PatientMode;
  onSelectProgressImage?: (imageUrl: string) => void;
}

export const WoundProgressTracker: React.FC<WoundProgressTrackerProps> = ({
  currentLang,
  highContrast,
  patientMode,
  onSelectProgressImage
}) => {
  const [logs, setLogs] = useState<ProgressLogEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<string>('');
  const [newWoundType, setNewWoundType] = useState<string>('Laceration');
  const [newSeverity, setNewSeverity] = useState<'Minor' | 'Moderate' | 'Severe'>('Moderate');
  const [newInfectionScore, setNewInfectionScore] = useState<number>(45);
  const [newLength, setNewLength] = useState<number>(3.5);
  const [newWidth, setNewWidth] = useState<number>(1.8);
  const [notesInput, setNotesInput] = useState<string>('');

  // Load progress logs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('woundcare_vlm_progress_tracker');
      if (saved) {
        setLogs(JSON.parse(saved));
      } else {
        // Seed with sample progress logs for instant visual feedback
        const initialSeed: ProgressLogEntry[] = [
          {
            id: 'log-1',
            date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
            imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
            woundType: 'Laceration',
            severity: 'Severe',
            infectionRiskScore: 78,
            lengthCm: 5.2,
            widthCm: 2.4,
            comparisonStatus: 'Stable',
            comparisonNotes: 'Initial baseline scan post-injury. Open tissue margins and moderate swelling.',
            patientMode
          },
          {
            id: 'log-2',
            date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
            imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
            woundType: 'Laceration',
            severity: 'Moderate',
            infectionRiskScore: 48,
            lengthCm: 4.1,
            widthCm: 1.8,
            comparisonStatus: 'Healing',
            comparisonNotes: 'Granulation tissue forming. Reduced erythema and periwound edema.',
            patientMode
          },
          {
            id: 'log-3',
            date: new Date().toISOString().split('T')[0],
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
            woundType: 'Laceration',
            severity: 'Minor',
            infectionRiskScore: 22,
            lengthCm: 3.2,
            widthCm: 1.2,
            comparisonStatus: 'Healing',
            comparisonNotes: 'Significant contraction. Epithelialization observed around edges.',
            patientMode
          }
        ];
        setLogs(initialSeed);
        localStorage.setItem('woundcare_vlm_progress_tracker', JSON.stringify(initialSeed));
      }
    } catch (e) {
      console.warn('Failed to load progress tracker logs', e);
    }
  }, []);

  const saveLogs = (updated: ProgressLogEntry[]) => {
    setLogs(updated);
    try {
      localStorage.setItem('woundcare_vlm_progress_tracker', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save progress logs:', e);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) {
      alert('Please select or upload a wound image for daily logging.');
      return;
    }

    // Determine comparison against previous entry
    const prevLog = logs[logs.length - 1];
    let status: 'Healing' | 'Stable' | 'Worsening' = 'Stable';
    let compNotes = 'Initial entry logged.';

    if (prevLog) {
      if (newInfectionScore < prevLog.infectionRiskScore && newLength <= prevLog.lengthCm) {
        status = 'Healing';
        compNotes = `Infection risk dropped from ${prevLog.infectionRiskScore}% to ${newInfectionScore}%. Wound length contracted from ${prevLog.lengthCm}cm to ${newLength}cm.`;
      } else if (newInfectionScore > prevLog.infectionRiskScore || newLength > prevLog.lengthCm) {
        status = 'Worsening';
        compNotes = `Increased inflammation or size compared to previous log. Recommend clinical inspection.`;
      } else {
        status = 'Stable';
        compNotes = `Wound characteristics remain stable since last log on ${prevLog.date}.`;
      }
    }

    const newEntry: ProgressLogEntry = {
      id: 'log-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      imageUrl: newImage,
      woundType: newWoundType,
      severity: newSeverity,
      infectionRiskScore: newInfectionScore,
      lengthCm: newLength,
      widthCm: newWidth,
      comparisonStatus: status,
      comparisonNotes: notesInput || compNotes,
      patientMode
    };

    const updated = [...logs, newEntry];
    saveLogs(updated);
    setShowAddModal(false);
    setNewImage('');
    setNotesInput('');
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    saveLogs(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const latestLog = logs[logs.length - 1];

  return (
    <div className={`p-6 rounded-[24px] border transition shadow-sm ${
      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-white border-[#e2dfd5] text-[#2c2c2c]'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e2dfd5]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#5A5A40]" />
            <h2 className="text-lg font-serif font-bold text-[#5A5A40]">
              {currentLang === 'hi' ? 'घाव की प्रगति और सुधार ट्रैकर' : currentLang === 'ta' ? 'காயம் குணமடைதல் கண்காணிப்பு' : 'Wound Healing & Daily Progress Tracker'}
            </h2>
          </div>
          <p className="text-xs text-[#8e8b82] mt-0.5">
            Log daily photos to track healing trajectory, infection risk percentage, and dimension reduction over time.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-progress-log"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5A5A40] text-white hover:bg-[#4a4a34] transition text-xs font-bold uppercase tracking-wider cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" /> Log Today's Photo
        </button>
      </div>

      {/* Trajectory Summary Cards */}
      {latestLog && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[#fdfcf8] border border-[#e2dfd5] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#8e8b82] uppercase tracking-wider block">Latest Healing Status</span>
              <span className={`text-base font-bold font-serif flex items-center gap-1.5 mt-1 ${
                latestLog.comparisonStatus === 'Healing' ? 'text-emerald-700' : latestLog.comparisonStatus === 'Worsening' ? 'text-red-700' : 'text-amber-700'
              }`}>
                {latestLog.comparisonStatus === 'Healing' && <TrendingDown className="w-4 h-4 text-emerald-600" />}
                {latestLog.comparisonStatus === 'Worsening' && <TrendingUp className="w-4 h-4 text-red-600" />}
                {latestLog.comparisonStatus === 'Stable' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                {latestLog.comparisonStatus.toUpperCase()}
              </span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#e2dfd5] font-bold text-[#5A5A40]">
              Day {logs.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#fdfcf8] border border-[#e2dfd5]">
            <span className="text-[11px] font-bold text-[#8e8b82] uppercase tracking-wider block">Infection Risk Trend</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-serif text-[#2c2c2c]">{latestLog.infectionRiskScore}%</span>
              <span className="text-xs text-[#8e8b82]">Current Score</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#fdfcf8] border border-[#e2dfd5]">
            <span className="text-[11px] font-bold text-[#8e8b82] uppercase tracking-wider block">Dimensions (L x W)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-serif text-[#2c2c2c]">{latestLog.lengthCm} x {latestLog.widthCm} cm</span>
              <span className="text-xs text-[#8e8b82]">Est. Area ~{(latestLog.lengthCm * latestLog.widthCm).toFixed(1)} cm²</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Timeline Progress Chart */}
      <div className="mb-8 p-5 rounded-2xl bg-[#f0ede4]/60 border border-[#e2dfd5]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-4 flex items-center gap-1.5 font-serif">
          <Activity className="w-4 h-4" /> Healing Trajectory Timeline Chart (Infection Risk % Over Days)
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-[#8e8b82] text-center py-6">No progress logs recorded yet. Upload a photo to begin tracking.</p>
        ) : (
          <div className="space-y-4">
            {/* Visual Bar Chart */}
            <div className="h-40 flex items-end gap-3 pt-6 pb-2 px-4 bg-white rounded-xl border border-[#e2dfd5] relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] font-bold text-[#8e8b82]">100% Infection Risk</div>
              <div className="absolute bottom-2 left-3 text-[10px] font-bold text-[#8e8b82]">0% Low Risk</div>
              
              <div className="w-full flex items-end justify-around h-full pl-8">
                {logs.map((log, idx) => {
                  const barHeight = Math.max(15, log.infectionRiskScore);
                  return (
                    <div key={log.id} className="flex flex-col items-center gap-1 group flex-1 max-w-[60px]">
                      <span className="text-[10px] font-bold text-[#2c2c2c] opacity-90">{log.infectionRiskScore}%</span>
                      <div
                        style={{ height: `${barHeight}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 relative ${
                          log.infectionRiskScore > 65
                            ? 'bg-red-500'
                            : log.infectionRiskScore > 35
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none shadow">
                          {log.lengthCm}x{log.widthCm} cm
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8e8b82] font-mono whitespace-nowrap mt-1">{log.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily Photo Log Entries Cards */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-3 font-serif">
        Logged Daily Photos History
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {logs.map((log, idx) => (
          <div
            key={log.id}
            className="p-3.5 rounded-2xl border border-[#e2dfd5] bg-white text-[#2c2c2c] space-y-3 shadow-2xs relative group"
          >
            <div className="relative h-36 rounded-xl overflow-hidden bg-[#f0ede4]">
              <img
                src={log.imageUrl}
                alt={`Wound Log Day ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur">
                Day {idx + 1} ({log.date})
              </span>
              <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow ${
                log.comparisonStatus === 'Healing' ? 'bg-emerald-600' : log.comparisonStatus === 'Worsening' ? 'bg-red-600' : 'bg-amber-600'
              }`}>
                {log.comparisonStatus}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#5A5A40]">{log.woundType} ({log.severity})</span>
                <span className="font-mono text-[11px] text-[#8e8b82]">{log.lengthCm} cm x {log.widthCm} cm</span>
              </div>
              <p className="text-[11px] text-[#8e8b82] line-clamp-2 leading-tight">
                {log.comparisonNotes}
              </p>
            </div>

            <div className="pt-2 border-t border-[#f0ede4] flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#2c2c2c]">Infection Score: {log.infectionRiskScore}%</span>
              <button
                onClick={() => handleDeleteLog(log.id)}
                className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                title="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Progress Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-6 max-w-lg w-full text-[#2c2c2c] border border-[#e2dfd5] shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#5A5A40] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#5A5A40]" /> Log Daily Wound Photo
            </h3>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Select or Upload Wound Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded-xl bg-[#fdfcf8] text-xs"
                />
                {newImage && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border">
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Wound Length (cm):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLength}
                    onChange={(e) => setNewLength(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Wound Width (cm):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWidth}
                    onChange={(e) => setNewWidth(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Infection Score (0-100%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newInfectionScore}
                    onChange={(e) => setNewInfectionScore(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Severity Level:</label>
                  <select
                    value={newSeverity}
                    onChange={(e: any) => setNewSeverity(e.target.value)}
                    className="w-full p-2 border rounded-xl bg-white"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Daily Observation Notes:</label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Bandage changed, reduced swelling, mild itching..."
                  className="w-full p-2 border rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#5A5A40] text-white text-xs font-bold shadow"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
