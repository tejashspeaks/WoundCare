import React from 'react';
import { Language, PatientMode } from '../types';
import { motion } from 'motion/react';
import { ShieldAlert, Globe, Cpu, Sun, PhoneCall, Radio, WifiOff, Sparkles, User, Baby, Activity, Building2, UserCheck, Heart } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  useOfflineEngine: boolean;
  onToggleEngine: (offline: boolean) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenEmergencyModal: () => void;
  patientMode: PatientMode;
  onTogglePatientMode: (mode: PatientMode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  useOfflineEngine,
  onToggleEngine,
  highContrast,
  onToggleHighContrast,
  onOpenEmergencyModal,
  patientMode,
  onTogglePatientMode,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className={`border-b transition-colors shadow-xs sticky top-0 z-40 backdrop-blur-md ${
      highContrast 
        ? 'bg-black text-yellow-300 border-yellow-400' 
        : 'bg-white/95 text-[#2c2c2c] border-[#e2dfd5]'
    }`}>
      {/* Top Banner for Emergency & Rural Triage Notice */}
      <div className="bg-gradient-to-r from-[#b71c1c] via-[#c62828] to-[#d32f2f] text-white px-6 py-2 text-xs font-medium flex flex-wrap items-center justify-between gap-2 shadow-inner relative overflow-hidden">
        {/* Ambient shimmer line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
        
        <div className="flex items-center gap-2 relative z-10">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-3.5 h-3.5 rounded-full bg-yellow-400/60 animate-ping" />
            <ShieldAlert className="w-4 h-4 text-yellow-300 relative z-10" />
          </div>
          <span>
            <strong>RURAL TRIAGE ALERT:</strong> For uncontrolled arterial bleeding, snakebite venomation, or deep puncturing, dispatch immediate emergency care.
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenEmergencyModal}
          id="btn-emergency-108"
          className="bg-white text-[#c62828] hover:bg-[#fff3f3] px-3.5 py-1 rounded-full font-bold transition flex items-center gap-1.5 shadow-sm text-xs uppercase tracking-wider cursor-pointer relative z-10"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          <span>CALL 108 AMBULANCE</span>
        </motion.button>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-serif font-bold text-xl shadow-md border relative overflow-hidden ${
                highContrast ? 'bg-yellow-400 text-black border-yellow-500' : 'bg-[#5A5A40] text-white border-[#4a4a34]'
              }`}
            >
              <CrossIcon className="w-6 h-6 relative z-10" />
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-serif font-bold tracking-tight text-[#5A5A40]">WoundCare-VLM</h1>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  highContrast 
                    ? 'bg-yellow-400 text-black border-yellow-500' 
                    : 'bg-[#f0ede4] text-[#5A5A40] border-[#e2dfd5]'
                }`}>
                  Rural Triage V1.5
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
              </div>
              <p className="text-xs text-[#8e8b82] font-medium mt-0.5 flex items-center gap-1.5">
                <span>Visual First-Aid AI</span>
                <span>•</span>
                <span className="text-[#5A5A40] font-semibold">Fine-tuned BLIP-2 LoRA</span>
                <span>•</span>
                <span>EN / हिंदी / தமிழ்</span>
              </p>
            </div>
          </div>

          {/* Quick Control Bar: Patient Mode, Language, Engine Toggle, High Contrast */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            
            {/* Patient Mode Toggle */}
            <div className={`flex items-center rounded-full p-1 border text-xs shadow-2xs ${
              highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-[#f0ede4] border-[#e2dfd5]'
            }`}>
              <button
                id="btn-mode-adult"
                onClick={() => onTogglePatientMode('adult')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                  patientMode === 'adult'
                    ? highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-[#5A5A40] text-white shadow-xs'
                    : 'text-[#8e8b82] hover:text-[#2c2c2c]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Adult</span>
              </button>
              <button
                id="btn-mode-child"
                onClick={() => onTogglePatientMode('child')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                  patientMode === 'child'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-[#8e8b82] hover:text-[#2c2c2c]'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Child (&lt;18)</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className={`flex items-center rounded-full p-1 border text-xs shadow-2xs ${
              highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-[#f0ede4] border-[#e2dfd5]'
            }`}>
              <Globe className="w-3.5 h-3.5 ml-2 mr-1 text-[#8e8b82]" />
              {(['en', 'hi', 'ta'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  id={`btn-lang-${lang}`}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                    currentLang === lang
                      ? highContrast
                        ? 'bg-yellow-400 text-black font-bold'
                        : 'bg-white text-[#2c2c2c] shadow-xs font-bold'
                      : 'text-[#8e8b82] hover:text-[#5A5A40]'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'தமிழ்'}
                </button>
              ))}
            </div>

            {/* Offline vs Online VLM Toggle */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="btn-toggle-engine"
              onClick={() => onToggleEngine(!useOfflineEngine)}
              title={useOfflineEngine ? "Using On-Device BLIP-2 LoRA (Offline Edge)" : "Using Cloud Gemini 3.6 Flash VLM"}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-2xs ${
                useOfflineEngine
                  ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9] hover:bg-[#dcedc8]'
                  : 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb] hover:bg-[#bbdefb]'
              }`}
            >
              {useOfflineEngine ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse"></div>
                  <WifiOff className="w-3.5 h-3.5 text-[#2e7d32]" />
                  <span>BLIP-2 LoRA (Edge)</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-[#1565c0]"></div>
                  <Sparkles className="w-3.5 h-3.5 text-[#1565c0]" />
                  <span>Gemini Cloud VLM</span>
                </>
              )}
            </motion.button>

            {/* Outdoor High Contrast Toggle */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              id="btn-toggle-contrast"
              onClick={onToggleHighContrast}
              title="Toggle Outdoor High-Contrast Mode for Direct Sunlight"
              className={`p-2 rounded-full border text-xs transition cursor-pointer shadow-2xs ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500 font-bold'
                  : 'bg-[#f0ede4] text-[#5A5A40] border-[#e2dfd5] hover:bg-[#e2dfd5]'
              }`}
            >
              <Sun className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Navigation Tabs with Smooth Animated Gliding Pill */}
        <nav className="flex items-center gap-1 mt-4 pt-2.5 border-t border-[#e2dfd5] overflow-x-auto text-xs font-medium no-scrollbar">
          <TabButton
            id="tab-scanner"
            active={activeTab === 'scanner'}
            onClick={() => setActiveTab('scanner')}
            icon={<Cpu className="w-3.5 h-3.5" />}
            label="Wound Scanner & Triage"
            highContrast={highContrast}
          />
          <TabButton
            id="tab-profile"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<UserCheck className="w-3.5 h-3.5 text-blue-600" />}
            label="Patient Profile"
            highContrast={highContrast}
          />
          <TabButton
            id="tab-progress"
            active={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
            icon={<Activity className="w-3.5 h-3.5 text-emerald-600" />}
            label="Progress Tracker"
            highContrast={highContrast}
          />
          <TabButton
            id="tab-hospitals"
            active={activeTab === 'hospitals'}
            onClick={() => setActiveTab('hospitals')}
            icon={<Building2 className="w-3.5 h-3.5 text-red-600" />}
            label="Hospital Locator"
            highContrast={highContrast}
          />
          <TabButton
            id="tab-history"
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            icon={<Radio className="w-3.5 h-3.5" />}
            label="Case Records"
            highContrast={highContrast}
          />
          <TabButton
            id="tab-architecture"
            active={activeTab === 'architecture'}
            onClick={() => setActiveTab('architecture')}
            icon={<Sparkles className="w-3.5 h-3.5" />}
            label="BLIP-2 Benchmarks"
            highContrast={highContrast}
          />
          <TabButton
            id="tab-deliverables"
            active={activeTab === 'deliverables'}
            onClick={() => setActiveTab('deliverables')}
            icon={<ShieldAlert className="w-3.5 h-3.5" />}
            label="Research & Patents"
            highContrast={highContrast}
          />
          <TabButton
            id="tab-guide"
            active={activeTab === 'guide'}
            onClick={() => setActiveTab('guide')}
            icon={<Globe className="w-3.5 h-3.5" />}
            label="Rural Field Guide"
            highContrast={highContrast}
          />
        </nav>
      </div>
    </header>
  );
};

interface TabButtonProps {
  id: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  highContrast: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ id, active, onClick, icon, label, highContrast }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer text-xs uppercase tracking-wider font-semibold z-10 ${
        active
          ? highContrast
            ? 'text-black font-bold'
            : 'text-white'
          : 'text-[#8e8b82] hover:text-[#5A5A40] hover:bg-[#f0ede4]/60'
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTabBadge"
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
          className={`absolute inset-0 rounded-full shadow-xs -z-10 ${
            highContrast ? 'bg-yellow-400' : 'bg-[#5A5A40]'
          }`}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </span>
    </button>
  );
};

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

