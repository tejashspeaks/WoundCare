import React, { useState, useEffect } from 'react';
import { Language, WoundAnalysisResult, CaseRecord, PatientMode, AllergyProfile, EmergencyContact } from './types';
import { Header } from './components/Header';
import { WoundScanner } from './components/WoundScanner';
import { CaseHistory } from './components/CaseHistory';
import { ModelArchitectureAndMetrics } from './components/ModelArchitectureAndMetrics';
import { DeliverablesHub } from './components/DeliverablesHub';
import { RuralFieldGuide } from './components/RuralFieldGuide';
import { EmergencyModal } from './components/EmergencyModal';
import { WoundProgressTracker } from './components/WoundProgressTracker';
import { HospitalLocator } from './components/HospitalLocator';
import { PatientProfileTab } from './components/PatientProfileTab';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [useOfflineEngine, setUseOfflineEngine] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('scanner');
  const [patientMode, setPatientMode] = useState<PatientMode>('adult');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [cases, setCases] = useState<CaseRecord[]>([]);

  // Safety & Patient State
  const [allergies, setAllergies] = useState<AllergyProfile>({
    iodine: false,
    latex: false,
    adhesiveBandages: false,
    penicillin: false,
    aspirin: false
  });
  const [isDiabeticMode, setIsDiabeticMode] = useState<boolean>(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: 'c1', name: 'Primary Caretaker', phone: '+919876543210', relation: 'Family' }
  ]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedCases = localStorage.getItem('woundcare_vlm_case_records');
      if (savedCases) setCases(JSON.parse(savedCases));

      const savedAllergies = localStorage.getItem('woundcare_vlm_allergies');
      if (savedAllergies) setAllergies(JSON.parse(savedAllergies));

      const savedDiabetic = localStorage.getItem('woundcare_vlm_diabetic_mode');
      if (savedDiabetic) setIsDiabeticMode(JSON.parse(savedDiabetic));

      const savedContacts = localStorage.getItem('woundcare_vlm_emergency_contacts');
      if (savedContacts) setEmergencyContacts(JSON.parse(savedContacts));
    } catch (e) {
      console.warn('Failed to load local storage state', e);
    }
  }, []);

  const handleUpdateAllergies = (updated: AllergyProfile) => {
    setAllergies(updated);
    try {
      localStorage.setItem('woundcare_vlm_allergies', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleDiabeticMode = (val: boolean) => {
    setIsDiabeticMode(val);
    try {
      localStorage.setItem('woundcare_vlm_diabetic_mode', JSON.stringify(val));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const updated = [...emergencyContacts, { ...contact, id: 'c-' + Date.now() }];
    setEmergencyContacts(updated);
    try {
      localStorage.setItem('woundcare_vlm_emergency_contacts', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteContact = (id: string) => {
    const updated = emergencyContacts.filter((c) => c.id !== id);
    setEmergencyContacts(updated);
    try {
      localStorage.setItem('woundcare_vlm_emergency_contacts', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Save case record
  const handleSaveCase = (
    result: WoundAnalysisResult,
    imageUrl: string,
    patientName?: string,
    notes?: string
  ) => {
    const newRecord: CaseRecord = {
      id: 'case-' + Date.now(),
      timestamp: new Date().toISOString(),
      patientName,
      location: notes || 'Rural Field Clinic',
      imageUrl,
      result,
      status: result.severity === 'Severe' ? 'Referred to Hospital' : 'Dressed'
    };

    const updated = [newRecord, ...cases];
    setCases(updated);
    try {
      localStorage.setItem('woundcare_vlm_case_records', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  // Delete single case
  const handleDeleteCase = (id: string) => {
    const updated = cases.filter((c) => c.id !== id);
    setCases(updated);
    try {
      localStorage.setItem('woundcare_vlm_case_records', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  // Clear all cases
  const handleClearAllCases = () => {
    setCases([]);
    localStorage.removeItem('woundcare_vlm_case_records');
  };

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      highContrast ? 'bg-black text-yellow-300' : 'bg-[#f7f5f0] text-[#2c2c2c]'
    }`}>
      {/* Top Navigation & Status Bar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        useOfflineEngine={useOfflineEngine}
        onToggleEngine={setUseOfflineEngine}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patientMode={patientMode}
        onTogglePatientMode={setPatientMode}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'scanner' && (
          <WoundScanner
            currentLang={currentLang}
            useOfflineEngine={useOfflineEngine}
            highContrast={highContrast}
            patientMode={patientMode}
            onSaveCase={handleSaveCase}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <PatientProfileTab
            allergies={allergies}
            onUpdateAllergies={handleUpdateAllergies}
            isDiabeticMode={isDiabeticMode}
            onToggleDiabeticMode={handleToggleDiabeticMode}
            patientMode={patientMode}
            onTogglePatientMode={setPatientMode}
            emergencyContacts={emergencyContacts}
            onAddContact={handleAddContact}
            onDeleteContact={handleDeleteContact}
            currentLang={currentLang}
            highContrast={highContrast}
          />
        )}

        {activeTab === 'progress' && (
          <WoundProgressTracker
            currentLang={currentLang}
            highContrast={highContrast}
            useOfflineEngine={useOfflineEngine}
          />
        )}

        {activeTab === 'hospitals' && (
          <HospitalLocator
            currentLang={currentLang}
            highContrast={highContrast}
          />
        )}

        {activeTab === 'history' && (
          <CaseHistory
            cases={cases}
            currentLang={currentLang}
            onDeleteCase={handleDeleteCase}
            onClearAll={handleClearAllCases}
            highContrast={highContrast}
          />
        )}

        {activeTab === 'architecture' && (
          <ModelArchitectureAndMetrics highContrast={highContrast} />
        )}

        {activeTab === 'deliverables' && (
          <DeliverablesHub highContrast={highContrast} />
        )}

        {activeTab === 'guide' && (
          <RuralFieldGuide currentLang={currentLang} highContrast={highContrast} />
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 px-6 text-xs transition-colors ${
        highContrast ? 'bg-black text-yellow-400 border-yellow-500' : 'bg-white text-[#8e8b82] border-[#e2dfd5] shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 uppercase tracking-wider text-[11px] font-semibold">
          <p>
            <strong className="font-serif text-[#5A5A40]">WoundCare-VLM</strong> • Fine-tuned BLIP-2 + LoRA Architecture
          </p>
          <p className="text-[#8e8b82]">
            Fine-tuned for Indian Skin Tones • Project ID: VIT-WCV-2026-09
          </p>
        </div>
      </footer>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        highContrast={highContrast}
      />
    </div>
  );
}

