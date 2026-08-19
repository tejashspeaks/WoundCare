import React from 'react';
import { ShieldAlert, AlertTriangle, Syringe, Building2, CheckCircle2, HeartPulse, Info } from 'lucide-react';
import { BiteData, Language } from '../types';

interface SnakeAndAnimalBiteIdentifierProps {
  data?: BiteData;
  currentLang: Language;
  onNavigateToHospitals?: () => void;
  highContrast?: boolean;
}

export const SnakeAndAnimalBiteIdentifier: React.FC<SnakeAndAnimalBiteIdentifierProps> = ({
  data,
  currentLang,
  onNavigateToHospitals,
  highContrast
}) => {
  if (!data || data.biteType === 'none') {
    return (
      <div className="p-5 rounded-2xl bg-[#fdfcf8] border border-[#e2dfd5] text-xs text-[#8e8b82] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#5A5A40]" />
          <span>No animal bite or snake envenomation patterns detected in this scan.</span>
        </div>
      </div>
    );
  }

  const biteType = data.biteType;
  const isSnake = biteType === 'snake';
  const isDog = biteType === 'dog';
  const isRat = biteType === 'rat';

  const rabiesSchedule = data.rabiesSchedule || [
    'Day 0 (Today - Immediate)',
    'Day 3 (Follow-up)',
    'Day 7 (Follow-up)',
    'Day 14 (Follow-up)',
    'Day 28 (Final Dose)'
  ];

  const texts: Record<Language, { title: string; warningTitle: string; antiVenomButton: string; rabiesTitle: string; leptoTitle: string }> = {
    en: {
      title: `Bite Identification: ${biteType.toUpperCase()} BITE DETECTED`,
      warningTitle: isSnake ? 'CRITICAL SNAKEBITE ENVENOMATION RISK' : isDog ? 'RABIES VIRUS INFECTION EXPOSURE' : 'LEPTOSPIROSIS / RAT-BITE FEVER RISK',
      antiVenomButton: 'Find Anti-Venom & Vaccine PHCs',
      rabiesTitle: 'Mandatory 5-Dose Anti-Rabies Vaccination (ARV) Schedule:',
      leptoTitle: 'Leptospirosis & Antibiotic Prophylaxis:'
    },
    hi: {
      title: `काटने का प्रकार: ${biteType === 'snake' ? 'सांप' : biteType === 'dog' ? 'कुत्ता' : biteType === 'rat' ? 'चूहा' : biteType} का काटना`,
      warningTitle: isSnake ? 'सांप काटने की अति गंभीर स्थिति' : isDog ? 'रेबीज (Rabies) संक्रमण का खतरा' : 'लेप्टोस्पायरोसिस व बुखार का खतरा',
      antiVenomButton: 'एंटी-वेनम / रेबीज सेंटर खोजें',
      rabiesTitle: 'रेबीज टीका (ARV) 5-खुराक समय सारिणी:',
      leptoTitle: 'एंटीबायोटिक व लेप्टोस्पायरोसिस चेतावनी:'
    },
    ta: {
      title: `கடி வகை: ${biteType === 'snake' ? 'பாம்பு' : biteType === 'dog' ? 'நாய்' : biteType === 'rat' ? 'எலி' : biteType} கடி`,
      warningTitle: isSnake ? 'பாம்பு கடி அவசர எச்சரிக்கை' : isDog ? 'ரேபிஸ் நோய் தொற்று அபாயம்' : 'எலி கடி காய்ச்சல் அபாயம்',
      antiVenomButton: 'தடுப்பூசி மையங்களை கண்டறியவும்',
      rabiesTitle: 'ரேபிஸ் தடுப்பூசி 5 தவணை அட்டவணை:',
      leptoTitle: 'எலி கடி ஆண்டிபயாடிக் எச்சரிக்கை:'
    }
  };

  const curr = texts[currentLang] || texts.en;

  return (
    <div className={`p-5 rounded-2xl border space-y-4 ${
      isSnake || isDog 
        ? 'bg-red-950/20 border-red-500 text-red-100' 
        : 'bg-[#fdfcf8] border-[#e2dfd5] text-[#2c2c2c]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-5 h-5 ${isSnake ? 'text-red-500 animate-pulse' : 'text-[#c62828]'}`} />
          <h4 className="font-serif font-bold text-sm tracking-wide">
            {curr.title}
          </h4>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600 text-white animate-pulse">
          URGENT BITE PROTOCOL
        </span>
      </div>

      {/* Warning Box */}
      <div className="p-4 rounded-xl bg-red-900/40 border border-red-500 space-y-2 text-xs">
        <strong className="text-red-300 uppercase font-bold tracking-wider block">
          {curr.warningTitle}
        </strong>

        {isSnake && (
          <p className="leading-relaxed text-red-100">
            {data.antiVenomGuide?.[currentLang] || data.antiVenomGuide?.en || 'Polyvalent Anti-Snake Venom (ASV) must be administered at nearest PHC/District Hospital. Do NOT slice wound or attempt to suck venom.'}
          </p>
        )}

        {isDog && (
          <p className="leading-relaxed text-red-100">
            Wash bite wound under running tap water with soap for 15 FULL MINUTES. Rush to PHC for Anti-Rabies Vaccine (ARV) and Rabies Immunoglobulin (RIG).
          </p>
        )}

        {isRat && (
          <p className="leading-relaxed text-red-100">
            {data.leptoWarning?.[currentLang] || data.leptoWarning?.en || 'Rat bites carry Leptospira bacteria risk. Clean wound thoroughly and take prescribed Oral Doxycycline/Amoxicillin course.'}
          </p>
        )}
      </div>

      {/* Dog Rabies Schedule Timeline */}
      {isDog && (
        <div className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-yellow-300">
            <Syringe className="w-4 h-4" />
            <span>{curr.rabiesTitle}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            {rabiesSchedule.map((dose, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-white/10 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-red-300 block">Dose {idx + 1}</span>
                <span className="font-bold text-white text-[11px] block mt-0.5">{dose}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Snake Anti-Venom Location Shortcut */}
      {(isSnake || isDog) && onNavigateToHospitals && (
        <button
          onClick={onNavigateToHospitals}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer animate-pulse"
        >
          <Building2 className="w-4 h-4" />
          <span>{curr.antiVenomButton}</span>
        </button>
      )}
    </div>
  );
};
