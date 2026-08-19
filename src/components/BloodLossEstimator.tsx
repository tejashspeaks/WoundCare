import React from 'react';
import { Droplet, AlertCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { BloodLossData, Language } from '../types';

interface BloodLossEstimatorProps {
  data?: BloodLossData;
  currentLang: Language;
  onLaunchTourniquetGuide?: () => void;
  highContrast?: boolean;
}

export const BloodLossEstimator: React.FC<BloodLossEstimatorProps> = ({
  data,
  currentLang,
  onLaunchTourniquetGuide,
  highContrast
}) => {
  const volume = data?.estimatedVolumeMl || 35;
  const category = data?.category || (volume > 250 ? 'Severe (>250ml)' : volume > 50 ? 'Moderate (50-250ml)' : 'Minimal (<50ml)');
  const isSevere = volume > 250 || data?.requiresTourniquet;

  const maxMeterMl = 500;
  const percentage = Math.min(100, Math.max(5, (volume / maxMeterMl) * 100));

  const labels: Record<Language, { title: string; categoryLabel: string; tourniquetButton: string; warningText: string }> = {
    en: {
      title: 'Estimated Blood Loss Volume',
      categoryLabel: `Category: ${category}`,
      tourniquetButton: 'Launch Interactive Tourniquet Guide',
      warningText: 'CRITICAL BLOOD LOSS DETECTED (>250mL). Risk of hypovolemic shock. Apply arterial tourniquet 2-3 inches above wound site immediately.'
    },
    hi: {
      title: 'रक्तस्राव मात्रा अनुमान (Blood Loss)',
      categoryLabel: `श्रेणी: ${category}`,
      tourniquetButton: 'टूर्निकेट (Tourniquet) गाइड खोलें',
      warningText: 'अत्यधिक रक्तस्राव (>250ml)! हाइपोवोलेमिक शॉक का खतरा। घाव से 2-3 इंच ऊपर कसकर पट्टी (Tourniquet) बांधें।'
    },
    ta: {
      title: 'இரத்த இழப்பு அளவீடு',
      categoryLabel: `வகை: ${category}`,
      tourniquetButton: 'டூர்னிகெட் வழிகாட்டியைத் திறக்கவும்',
      warningText: 'அதிக இரத்த இழப்பு கண்டறியப்பட்டது (>250ml). காயத்திற்கு 2-3 அங்குலம் மேலே டூர்னிகெட் கட்டு போடவும்.'
    }
  };

  const curr = labels[currentLang] || labels.en;

  return (
    <div className={`p-5 rounded-2xl border space-y-4 ${
      isSevere 
        ? 'bg-red-950/30 border-red-500 text-red-100' 
        : 'bg-[#fdfcf8] border-[#e2dfd5] text-[#2c2c2c]'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplet className={`w-5 h-5 ${isSevere ? 'text-red-500 animate-bounce' : 'text-red-600'}`} />
          <h4 className="font-serif font-bold text-sm tracking-wide">
            {curr.title}
          </h4>
        </div>
        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
          isSevere 
            ? 'bg-red-600 text-white border-red-700 animate-pulse' 
            : volume > 50 
            ? 'bg-amber-100 text-amber-900 border-amber-300' 
            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
        }`}>
          ~{volume} mL
        </span>
      </div>

      {/* Visual Gauge Meter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider opacity-80">
          <span>0 mL (Minimal)</span>
          <span>250 mL (Severe)</span>
          <span>500+ mL (Critical)</span>
        </div>

        <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden border border-white/10 relative">
          {/* Threshold markers */}
          <div className="absolute left-[10%] top-0 bottom-0 w-0.5 bg-white/30 z-10" />
          <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-red-400 z-10" />

          <div
            className={`h-full transition-all duration-1000 ${
              isSevere 
                ? 'bg-gradient-to-r from-amber-500 via-red-600 to-red-700' 
                : volume > 50 
                ? 'bg-gradient-to-r from-emerald-500 to-amber-500' 
                : 'bg-emerald-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs font-semibold mt-1">
          {curr.categoryLabel}
        </p>
      </div>

      {/* Severe Blood Loss Warning & Tourniquet Launcher */}
      {isSevere && (
        <div className="p-4 rounded-xl bg-red-900/50 border border-red-500 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-red-200">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="leading-relaxed">
              {curr.warningText}
            </p>
          </div>

          {onLaunchTourniquetGuide && (
            <button
              onClick={onLaunchTourniquetGuide}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <span>{curr.tourniquetButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
