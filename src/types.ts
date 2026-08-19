export type MechanicalWoundType = 
  | 'Abrasion' 
  | 'Laceration' 
  | 'Puncture' 
  | 'Incised Wound' 
  | 'Contusion' 
  | 'Avulsion & Degloving' 
  | 'Crush Injury' 
  | 'Traumatic Amputation' 
  | 'Ballistic / Gunshot';

export type ThermalEnvironmentalWoundType = 
  | 'Burn (1st Degree / Superficial)' 
  | 'Burn (2nd Degree / Partial Thickness)' 
  | 'Burn (3rd Degree / Full Thickness)' 
  | 'Chemical Burn' 
  | 'Electrical Burn' 
  | 'Road Rash / Friction Burn' 
  | 'Frostbite / Cold Thermal';

export type BiologicalWoundType = 
  | 'Bite Wound' 
  | 'Snakebite (Envenomation)' 
  | 'Dog Bite (Canine)' 
  | 'Cat Scratch / Bite' 
  | 'Human Bite' 
  | 'Primate / Monkey Bite' 
  | 'Insect / Arachnid Sting' 
  | 'Marine Envenomation';

export type ChronicMedicalWoundType = 
  | 'Diabetic Foot Ulcer' 
  | 'Venous Stasis Ulcer' 
  | 'Arterial Ischemic Ulcer' 
  | 'Pressure Ulcer' 
  | 'Surgical Incision' 
  | 'Post-Op Dehiscence' 
  | 'Abscess / Infection';

export type WoundCategory = 
  | 'Mechanical Trauma' 
  | 'Thermal & Environmental' 
  | 'Biological & Envenomation' 
  | 'Chronic & Vascular Ulcers';

export type WoundType = 
  | MechanicalWoundType 
  | ThermalEnvironmentalWoundType 
  | BiologicalWoundType 
  | ChronicMedicalWoundType 
  | 'Abrasion' 
  | 'Laceration' 
  | 'Puncture' 
  | 'Burn' 
  | 'Contusion'
  | (string & {});

export type SeverityLevel = 'Minor' | 'Moderate' | 'Severe';
export type PatientMode = 'adult' | 'child';

export type Language = 'en' | 'hi' | 'ta';

export interface MultilingualText {
  en: string;
  hi: string;
  ta: string;
}

export interface FirstAidStep {
  stepNumber: number;
  text: MultilingualText;
  iconType: 'pressure' | 'water' | 'antiseptic' | 'bandage' | 'hospital' | 'ice' | 'clean' | 'elevation';
  isUrgent?: boolean;
}

export type MedicineCategory = 'Mild & Safe (OTC)' | 'Topical Antiseptic' | 'Pain Relief (Analgesic)' | 'Prescription Antibiotic' | 'Vaccine / Immunoglobulin';

export type HarmLevel = 'Very Low (Safe OTC)' | 'Low (Mild External)' | 'Moderate (Follow Dosage)' | 'High Caution (Rx Required)';

export interface MedicineRecommendation {
  name: string; // e.g. "Povidone-Iodine 5% Ointment (Betadine)"
  genericName: string; // e.g. "Povidone-Iodine"
  category: MedicineCategory;
  harmLevel: HarmLevel;
  estimatedPriceINR: string; // e.g. "₹35 - ₹65"
  estimatedPriceUSD?: string; // e.g. "$0.40 - $0.80"
  purpose: MultilingualText;
  dosageInstructions: MultilingualText;
  safetyPrecautions: MultilingualText;
  requiresPrescription: boolean;
  pediatricSafetyWarning?: MultilingualText;
}

export type WoundDepthGrade = 
  | 'Superficial (Epidermal <1mm)' 
  | 'Partial Thickness (Dermal 1-3mm)' 
  | 'Full Thickness (Subcutaneous >3mm)' 
  | 'Deep (Exposed Fascia / Muscle / Bone)';

export interface WoundMeasurement {
  lengthCm: number;
  widthCm: number;
  depthMm?: number;
  depthGrade?: WoundDepthGrade;
  surfaceAreaCm2: number;
  perimeterCm?: number;
  formattedText: string; // e.g. "3.5 cm x 1.8 cm (Area ~6.3 cm²)"
  referenceCalibrated?: boolean;
  referenceObject?: 'Coin (25mm)' | 'Credit Card (85.6mm)' | 'Medical Ruler' | 'Fingertip (~18mm)' | 'Auto-Detected';
  goldenClosureWindowHours?: number; // e.g. 8 hours for primary closure
  burnTbsaPercent?: number; // Total Burn Surface Area %
}

export interface RecoveryDiet {
  foodsToEat: MultilingualText[];
  foodsToAvoid: MultilingualText[];
  hydrationAdvice: MultilingualText;
  restAdvice: MultilingualText;
}

export interface ProgressLogEntry {
  id: string;
  date: string; // YYYY-MM-DD timestamp
  imageUrl: string;
  woundType: WoundType;
  severity: SeverityLevel;
  infectionRiskScore: number; // 0-100%
  lengthCm: number;
  widthCm: number;
  comparisonStatus: 'Healing' | 'Stable' | 'Worsening';
  comparisonNotes: string;
  patientMode: PatientMode;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface MedicalFacility {
  id: string;
  name: string;
  type: 'Primary Health Centre (PHC)' | 'Community Health Centre (CHC)' | 'Government Hospital' | '24x7 Clinic' | 'Vaccination Centre';
  distanceKm: number;
  phone: string;
  address: string;
  hasVaccines: boolean;
  has24x7Emergency: boolean;
  lat: number;
  lng: number;
}

export interface ForeignObjectData {
  detected: boolean;
  objectType?: 'glass' | 'metal' | 'wood' | 'gravel' | 'fabric' | 'unknown' | string;
  depth?: 'superficial' | 'deep';
  warningMessage?: MultilingualText;
  medicalRationale?: MultilingualText;
  firstAidSteps?: FirstAidStep[];
}

export type HemorrhageClass = 'Class I (<15%)' | 'Class II (15-30%)' | 'Class III (30-40%)' | 'Class IV (>40%)';
export type BleedingFlowRate = 'Capillary Ooze (Slow Trickle)' | 'Venous Bleed (Steady Flow)' | 'Arterial Bleed (Pulsatile Spurting)';

export interface BloodLossData {
  estimatedVolumeMl: number;
  category: 'Minimal (<50ml)' | 'Moderate (50-250ml)' | 'Severe (>250ml)';
  hemorrhageClass?: HemorrhageClass;
  bleedingFlowRate?: BleedingFlowRate;
  percentTotalBloodVolume?: number; // e.g. 18.5%
  patientWeightKg?: number; // Default 70kg adult or 20kg child
  shockIndex?: number; // Heart Rate / Systolic BP
  requiresTourniquet: boolean;
  visualCueDescription?: MultilingualText;
  pediatricSpecificAlert?: MultilingualText;
}

export interface BiteData {
  biteType: 'snake' | 'dog' | 'cat' | 'rat' | 'insect' | 'none';
  matchedSpecies?: string;
  isVenomous?: boolean;
  antiVenomGuide?: MultilingualText;
  rabiesSchedule?: string[]; // Day 0, Day 3, Day 7, Day 14, Day 28
  leptoWarning?: MultilingualText;
  antibioticAdvice?: MultilingualText;
}

export interface WoundAgeData {
  hoursOld: number;
  category: 'Fresh (0-6h)' | 'Recent (6-24h)' | 'Old (>24h)';
  closureGuidance: MultilingualText;
  confidenceScore: number;
  requiresMandatoryDoctor: boolean;
}

export interface AyurvedicRemedy {
  remedyName: MultilingualText;
  ingredients: MultilingualText[];
  applicationMethod: MultilingualText;
  classicalSource: string; // e.g., "Sushruta Samhita • Chikitsa Sthana"
}

export interface AllergyProfile {
  iodine: boolean;
  latex: boolean;
  adhesiveBandages: boolean;
  penicillin: boolean;
  aspirin: boolean;
}

export interface ScarRiskData {
  scorePercent: number; // 0-100%
  riskCategory: 'Low' | 'Medium' | 'High';
  recommendations: MultilingualText[];
  estimatedFadeTime: string; // e.g., "6 - 12 Months"
}

export interface PhotoQuality {
  scorePercent: number; // 0-100%
  isAcceptable: boolean;
  brightnessScore: number;
  sharpnessScore: number;
  centeringScore: number;
  issues: string[];
  suggestions: string[];
}

export interface MultiWoundItem {
  id: string;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] percentages 0-100
  woundType: WoundType;
  severity: SeverityLevel;
  priorityOrder: number;
  firstAidSummary: MultilingualText;
}

export interface WeatherData {
  tempC: number;
  humidityPercent: number;
  condition: string;
  isRaining: boolean;
  advice: MultilingualText;
}

export interface WorkplaceReport {
  id: string;
  companyName: string;
  employeeName: string;
  dateTime: string;
  locationGps: string;
  woundType: string;
  severity: string;
  firstAidAdministered: string;
  witnessName: string;
  supervisorName: string;
  hospitalVisitRequired: boolean;
  digitalSignature?: string;
}

export interface InsuranceClaim {
  id: string;
  patientName: string;
  dateTime: string;
  locationGps: string;
  woundType: string;
  severity: string;
  firstAidSteps: string;
  estimatedExpensesINR: number;
  hospitalName: string;
  policyNumber: string;
  providerName: string;
  qrCodeDataUrl?: string;
}

export interface WoundAnalysisResult {
  id: string;
  timestamp: string;
  woundType: WoundType;
  woundTypeDescription: MultilingualText;
  severity: SeverityLevel;
  confidenceScore: number; // 0-100
  affectedAreaEstimate: string; // e.g. "approx 3.5cm x 1.8cm"
  measurement?: WoundMeasurement;
  infectionRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  infectionRiskScore: number; // 0 to 100 percentage
  infectionVisualCues?: string[]; // e.g. ['Redness/Erythema', 'Tissue Swelling', 'Erythematous border']
  triageSummary: MultilingualText;
  immediateActionRequired: boolean;
  firstAidSteps: FirstAidStep[];
  criticalWarnings: MultilingualText[];
  recommendedMedicinesOrDressings: MultilingualText[];
  medicineRecommendations?: MedicineRecommendation[];
  recoveryDiet?: RecoveryDiet;
  tetanusRiskDetected: boolean;
  pediatricNotes?: MultilingualText;
  isChildMode?: boolean;
  doctorVisitUrgency: MultilingualText;
  modelEngineUsed: string;
  processingTimeMs: number;
  
  // Brand New Feature Analysis Extensions
  foreignObject?: ForeignObjectData;
  bloodLoss?: BloodLossData;
  biteData?: BiteData;
  woundAge?: WoundAgeData;
  ayurvedicRemedies?: AyurvedicRemedy[];
  scarRisk?: ScarRiskData;
  photoQuality?: PhotoQuality;
  multiWounds?: MultiWoundItem[];
  weatherData?: WeatherData;
  isDiabeticMode?: boolean;
  allergiesFiltered?: string[];
}


export interface SampleWoundCase {
  id: string;
  title: string;
  woundType: WoundType;
  category?: WoundCategory;
  severity: SeverityLevel;
  description: string;
  patientContext: string;
  imageUrl: string;
}

export interface CaseRecord {
  id: string;
  timestamp: string;
  patientName?: string;
  location?: string;
  imageUrl: string;
  result: WoundAnalysisResult;
  notes?: string;
  status: 'Fresh' | 'Dressed' | 'Healing' | 'Referred to Hospital';
}

export interface ResearchMetric {
  woundType: WoundType;
  precision: number;
  recall: number;
  f1Score: number;
  datasetSamples: number;
}
