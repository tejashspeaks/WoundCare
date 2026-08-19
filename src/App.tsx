import React, { useState, useEffect } from 'react';
import { Language, WoundAnalysisResult, CaseRecord, PatientMode, AllergyProfile, EmergencyContact } from './types';
import { motion, AnimatePresence } from 'motion/react';
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
      if (savedCases) {
        setCases(JSON.parse(savedCases));
      } else {
        // Initial diverse seed cases across anatomical body regions
        const initialCases: CaseRecord[] = [
          {
            id: 'case-seed-1',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            patientName: 'Ramesh K. (Farmer, 46y)',
            location: 'Right Forearm • Farm Tool Injury',
            bodyRegion: 'right-arm',
            imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
            status: 'Dressed',
            result: {
              id: 'res-seed-1',
              timestamp: new Date().toISOString(),
              woundType: 'Laceration',
              woundTypeDescription: {
                en: 'Deep longitudinal laceration on right forearm ventral surface.',
                hi: 'दाहिने अग्रभाग पर गहरा लकीरदार घाव।',
                ta: 'வலது முன்கையில் ஆழமான வெட்டுக் காயம்.'
              },
              severity: 'Severe',
              confidenceScore: 94.8,
              affectedAreaEstimate: '6.2 cm x 2.8 cm',
              infectionRisk: 'High',
              infectionRiskScore: 78,
              triageSummary: {
                en: 'Acute laceration on right forearm with active bleeding. Immediate sterile pressure and TT booster indicated.',
                hi: 'दाहिने हाथ पर गहरा घाव, तत्काल रक्तस्राव नियंत्रण और टीटी का टीका आवश्यक है।',
                ta: 'வலது கையில் ஆழமான காயம். உடனடியாக இரத்தப்போக்கை நிறுத்தி மருத்துவமனைக்கு செல்லவும்.'
              },
              immediateActionRequired: true,
              firstAidSteps: [
                { stepNumber: 1, text: { en: 'Apply direct pressure with clean gauze for 10 minutes.', hi: 'साफ पट्टी से 10 मिनट तक सीधा दबाव बनाएं।', ta: 'சுத்தமான துணியால் 10 நிமிடங்கள் அழுத்தம் கொடுக்கவும்.' }, iconType: 'bandage' },
                { stepNumber: 2, text: { en: 'Elevate right arm above heart level.', hi: 'दाहिने हाथ को दिल के स्तर से ऊपर उठाएं।', ta: 'வலது கையை இதய மட்டத்திற்கு மேல் உயர்த்தவும்.' }, iconType: 'clean' }
              ],
              criticalWarnings: [{ en: 'Administer Tetanus Toxoid within 24h for farm soil exposure.', hi: 'मिट्टी के संपर्क के कारण 24 घंटे के भीतर टीटी लगाएं।', ta: '24 மணி நேரத்திற்குள் டெட்டானஸ் ஊசி போடவும்.' }],
              recommendedMedicinesOrDressings: [{ en: 'Povidone-Iodine 5% Ointment & Sterile Pad', hi: 'पोवीडोन आयोडीन 5% और स्टेराइल पैड', ta: 'போவிடோன் அயோடின் 5% மற்றும் கட்டு' }],
              tetanusRiskDetected: true,
              doctorVisitUrgency: { en: 'Hospital Referral Needed within 4 Hours', hi: '4 घंटे के भीतर नजदीकी पीएचसी/अस्पताल जाएं', ta: '4 மணி நேரத்திற்குள் மருத்துவமனைக்கு செல்லவும்' },
              modelEngineUsed: 'Fine-Tuned BLIP-2 + LoRA (Offline Edge)',
              processingTimeMs: 290
            }
          },
          {
            id: 'case-seed-2',
            timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
            patientName: 'Aarav M. (Child, 7y)',
            location: 'Forehead • Playground Fall',
            bodyRegion: 'head',
            imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
            status: 'Dressed',
            result: {
              id: 'res-seed-2',
              timestamp: new Date().toISOString(),
              woundType: 'Abrasion',
              woundTypeDescription: {
                en: 'Superficial facial abrasion over frontal brow region.',
                hi: 'माथे पर सतही रगड़ का घाव।',
                ta: 'நெற்றியில் லேசான சிராய்ப்பு காயம்.'
              },
              severity: 'Minor',
              confidenceScore: 97.2,
              affectedAreaEstimate: '2.5 cm x 1.4 cm',
              infectionRisk: 'Low',
              infectionRiskScore: 18,
              triageSummary: {
                en: 'Superficial pediatric abrasion on forehead. No active bleeding, clean with sterile saline and apply antibiotic balm.',
                hi: 'माथे पर हल्की रगड़। सेलाइन से साफ करें और एंटीसेप्टिक क्रीम लगाएं।',
                ta: 'நெற்றியில் லேசான சிராய்ப்பு. தூய நீரால் கழுவி களிம்பு தடவவும்.'
              },
              immediateActionRequired: false,
              firstAidSteps: [
                { stepNumber: 1, text: { en: 'Wash gently with mild soap and potable water.', hi: 'हल्के साबुन और पानी से धीरे से साफ करें।', ta: 'லேசான சோப்பு மற்றும் நீரால் மென்மையாக கழுவவும்.' }, iconType: 'clean' },
                { stepNumber: 2, text: { en: 'Apply a thin layer of petroleum jelly or Soframycin.', hi: 'एंटीबायोटिक या पेट्रोलियम जेली की हल्की परत लगाएं।', ta: 'ஆன்டிபயாடிக் களிம்பு தடவவும்.' }, iconType: 'antiseptic' }
              ],
              criticalWarnings: [{ en: 'Avoid touching with unwashed hands to prevent facial scarring.', hi: 'चेहरे पर दाग से बचने के लिए गंदे हाथों से न छुएं।', ta: 'தழும்பைத் தவிர்க்க கைகளால் தொட வேண்டாம்.' }],
              recommendedMedicinesOrDressings: [{ en: 'Bacitracin / Neosporin Ointment', hi: 'नियोस्पोरिन ऑइंटमेंट', ta: 'நியோஸ்போரின் களிம்பு' }],
              tetanusRiskDetected: false,
              doctorVisitUrgency: { en: 'Home Care / Monitor at Home', hi: 'घर पर प्राथमिक उपचार पर्याप्त है', ta: 'வீட்டுப் பராமரிப்பு போதுமானது' },
              modelEngineUsed: 'Fine-Tuned BLIP-2 + LoRA (Offline Edge)',
              processingTimeMs: 310
            }
          },
          {
            id: 'case-seed-3',
            timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
            patientName: 'Suman Devi (Homemaker, 54y)',
            location: 'Left Plantar Heel • Diabetic Ulcer',
            bodyRegion: 'hands-feet',
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
            status: 'Referred to Hospital',
            result: {
              id: 'res-seed-3',
              timestamp: new Date().toISOString(),
              woundType: 'Diabetic Foot Ulcer',
              woundTypeDescription: {
                en: 'Wagner Grade 2 chronic neurotrophic ulcer on left plantar heel.',
                hi: 'बाएं पैर की एड़ी पर क्रोनिक डायबिटिक अल्सर।',
                ta: 'இடது கால் பாதத்தில் நீரிழிவு புண்.'
              },
              severity: 'Severe',
              confidenceScore: 95.4,
              affectedAreaEstimate: '3.8 cm x 3.2 cm',
              infectionRisk: 'High',
              infectionRiskScore: 72,
              triageSummary: {
                en: 'Chronic plantar ulcer with surrounding macerated callus. Mandatory offloading and endocrinology review required.',
                hi: 'पैर के तलवे पर अल्सर। वजन न डालें और डॉक्टर से तुरंत जांच कराएं।',
                ta: 'நீரிழிவு கால் புண். எடையை ஊன்றாமல் உடனடியாக மருத்துவரை அணுகவும்.'
              },
              immediateActionRequired: true,
              firstAidSteps: [
                { stepNumber: 1, text: { en: 'Do not walk barefoot. Use specialized offloading footwear.', hi: 'नंगे पैर बिल्कुल न चलें। विशेष फुटवियर का प्रयोग करें।', ta: 'வெறும் காலில் நடக்க வேண்டாம். சிறப்பு காலணிகளை அணியவும்.' }, iconType: 'bandage' },
                { stepNumber: 2, text: { en: 'Dress with hydrogel / silver sulfadiazine foam.', hi: 'हाइड्रोजेल या सिल्वर फोम ड्रेसिंग लगाएं।', ta: 'ஹைட்ரோஜெல் கட்டு போடவும்.' }, iconType: 'bandage' }
              ],
              criticalWarnings: [{ en: 'High amputation risk if left untreated without strict glycemic control.', hi: 'समय पर इलाज न मिलने पर गंभीर संक्रमण का खतरा।', ta: 'சிகிச்சை எடுக்காவிட்டால் கடுமையான தொற்று ஏற்படும் அபாயம்.' }],
              recommendedMedicinesOrDressings: [{ en: 'Silver Hydrogel & Polyurethane Foam Dressing', hi: 'सिल्वर हाइड्रोजेल और फोम ड्रेसिंग', ta: 'சில்வர் ஹைட்ரோஜெல் கட்டு' }],
              tetanusRiskDetected: false,
              doctorVisitUrgency: { en: 'Urgent Diabetic Clinic Visit (Within 12 Hours)', hi: '12 घंटे के भीतर डायबिटिक क्लिनिक जाएं', ta: '12 மணி நேரத்திற்குள் மருத்துவமனைக்கு செல்லவும்' },
              modelEngineUsed: 'Fine-Tuned BLIP-2 + LoRA (Offline Edge)',
              processingTimeMs: 340
            }
          },
          {
            id: 'case-seed-4',
            timestamp: new Date(Date.now() - 3600000 * 50).toISOString(),
            patientName: 'Kavita Bai (Farm Worker, 38y)',
            location: 'Abdominal Wall • Minor Puncture',
            bodyRegion: 'torso',
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
            status: 'Dressed',
            result: {
              id: 'res-seed-4',
              timestamp: new Date().toISOString(),
              woundType: 'Puncture',
              woundTypeDescription: {
                en: 'Small diameter puncture wound on lower right abdominal quadrant.',
                hi: 'पेट के निचले दाहिने हिस्से में नुकीली वस्तु से घाव।',
                ta: 'வயிற்றின் கீழ் பகுதியில் சிறிய குத்துக் காயம்.'
              },
              severity: 'Moderate',
              confidenceScore: 93.1,
              affectedAreaEstimate: '1.2 cm x 0.8 cm',
              infectionRisk: 'Moderate',
              infectionRiskScore: 52,
              triageSummary: {
                en: 'Puncture wound on abdominal wall. No signs of peritoneal penetration. Clean thoroughly with antiseptic solution.',
                hi: 'पेट की दीवार पर घाव। एंटीसेप्टिक से साफ करें और टीटी का इंजेक्शन लें।',
                ta: 'வயிற்றில் குத்துக் காயம். தொற்றைத் தவிர்க்க உடனடியாக சுத்தம் செய்யவும்.'
              },
              immediateActionRequired: false,
              firstAidSteps: [
                { stepNumber: 1, text: { en: 'Flush gently with saline. Do not probe inside.', hi: 'सेलाइन से धोएं, घाव के अंदर कुछ न डालें।', ta: 'சுத்தமான நீரால் கழுவவும்.' }, iconType: 'clean' }
              ],
              criticalWarnings: [{ en: 'Watch for abdominal rigidity, fever, or localized warmth.', hi: 'पेट में दर्द या बुखार होने पर तुरंत डॉक्टर से संपर्क करें।', ta: 'காய்ச்சல் அல்லது வலி இருந்தால் மருத்துவரை அணுகவும்.' }],
              recommendedMedicinesOrDressings: [{ en: 'Cefalexin 500mg (as prescribed) & Povidone Pack', hi: 'पोवीडोन आयोडीन और एंटीबायोटिक', ta: 'ஆன்டிபயாடிக் மற்றும் கட்டு' }],
              tetanusRiskDetected: true,
              doctorVisitUrgency: { en: 'PHC Doctor Evaluation within 24 Hours', hi: '24 घंटे के भीतर प्राथमिक स्वास्थ्य केंद्र जाएं', ta: '24 மணி நேரத்திற்குள் மருத்துவரை பார்க்கவும்' },
              modelEngineUsed: 'Fine-Tuned BLIP-2 + LoRA (Offline Edge)',
              processingTimeMs: 275
            }
          },
          {
            id: 'case-seed-5',
            timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
            patientName: 'Vikram S. (Biker, 29y)',
            location: 'Left Knee & Shin • Road Abrasion',
            bodyRegion: 'left-leg',
            imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
            status: 'Dressed',
            result: {
              id: 'res-seed-5',
              timestamp: new Date().toISOString(),
              woundType: 'Abrasion',
              woundTypeDescription: {
                en: 'Deep road rash abrasion across left patellar region with gravel dirt.',
                hi: 'बाएं घुटने पर सड़क दुर्घटना की रगड़ और धूल-मिट्टी।',
                ta: 'இடது முழங்காலில் சிராய்ப்புக் காயம்.'
              },
              severity: 'Moderate',
              confidenceScore: 96.0,
              affectedAreaEstimate: '5.5 cm x 3.8 cm',
              infectionRisk: 'Moderate',
              infectionRiskScore: 48,
              triageSummary: {
                en: 'Motorcycle abrasion over left patella. Superficial grit washed out. Non-stick paraffin gauze dressing applied.',
                hi: 'घुटने पर रगड़। धूल-मिट्टी साफ कर पैराफिन गॉज पट्टी बांधी गई।',
                ta: 'முழங்காலில் சிராய்ப்பு காயம். சுத்தப்படுத்தி கட்டு போடப்பட்டது.'
              },
              immediateActionRequired: false,
              firstAidSteps: [
                { stepNumber: 1, text: { en: 'Copious irrigation with saline to flush micro-grit.', hi: 'धूल-मिट्टी हटाने के लिए खूब सारे पानी से धोएं।', ta: 'அழுக்கை அகற்ற நீரால் நன்றாக கழுவவும்.' }, iconType: 'clean' },
                { stepNumber: 2, text: { en: 'Apply non-adherent sterile dressing (Jelonet).', hi: 'न चिपकने वाली पैराफिन पट्टी लगाएं।', ta: 'ஒட்டாத கட்டைப் பயன்படுத்தவும்.' }, iconType: 'bandage' }
              ],
              criticalWarnings: [{ en: 'Do not scrub aggressively to avoid dermal scarring.', hi: 'त्वचा को रगड़कर साफ न करें।', ta: 'தேய்த்து கழுவ வேண்டாம்.' }],
              recommendedMedicinesOrDressings: [{ en: 'Framycetin Cream & Paraffin Gauze', hi: 'सोफ्रामाइसिन क्रीम और जालीदार पट्टी', ta: 'களிம்பு மற்றும் கட்டு' }],
              tetanusRiskDetected: true,
              doctorVisitUrgency: { en: 'Routine Care / Review in 48 Hours', hi: '48 घंटे में दोबारा जांच करें', ta: '48 மணி நேரத்தில் மீண்டும் பரிசோதிக்கவும்' },
              modelEngineUsed: 'Fine-Tuned BLIP-2 + LoRA (Offline Edge)',
              processingTimeMs: 295
            }
          }
        ];
        setCases(initialCases);
        localStorage.setItem('woundcare_vlm_case_records', JSON.stringify(initialCases));
      }

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
      <main className="max-w-7xl mx-auto px-4 py-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
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
                patientMode={patientMode}
                cases={cases}
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
          </motion.div>
        </AnimatePresence>
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

