import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  ProgressLogEntry,
  Language,
  PatientMode,
  CaseRecord,
  WoundType
} from '../types';
import {
  Activity,
  Plus,
  Camera,
  Trash2,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Ruler,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Eye,
  AlertTriangle,
  HeartPulse,
  Info,
  Calendar
} from 'lucide-react';

interface WoundProgressTrackerProps {
  currentLang: Language;
  highContrast: boolean;
  patientMode?: PatientMode;
  cases?: CaseRecord[];
  useOfflineEngine?: boolean;
  onSelectProgressImage?: (imageUrl: string) => void;
}

type ChartMetricMode = 'combined' | 'infection' | 'area' | 'dimensions' | 'granulation' | 'pain';

// Rich Clinical Seed Cases with multi-day healing trajectories for distinct wounds
const DEFAULT_WOUND_TRACKS: Record<string, { title: string; woundType: WoundType; location: string; patient: string; logs: ProgressLogEntry[] }> = {
  'track-laceration-forearm': {
    title: 'Forearm Deep Laceration',
    woundType: 'Laceration',
    location: 'Right Forearm (Ventral)',
    patient: 'Ramesh K. (Adult)',
    logs: [
      {
        id: 'log-lac-d1',
        woundTrackId: 'track-laceration-forearm',
        woundTitle: 'Forearm Deep Laceration',
        patientName: 'Ramesh K.',
        woundLocation: 'Right Forearm (Ventral)',
        date: '2026-08-11',
        dayNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
        woundType: 'Laceration',
        severity: 'Severe',
        infectionRiskScore: 82,
        lengthCm: 6.2,
        widthCm: 2.8,
        areaCm2: 13.6,
        granulationPercent: 15,
        painLevel: 8,
        comparisonStatus: 'Stable',
        comparisonNotes: 'Day 1 Baseline scan post-injury. Open laceration margins with active serosanguinous exudate and periwound edema.',
        patientMode: 'adult'
      },
      {
        id: 'log-lac-d3',
        woundTrackId: 'track-laceration-forearm',
        woundTitle: 'Forearm Deep Laceration',
        patientName: 'Ramesh K.',
        woundLocation: 'Right Forearm (Ventral)',
        date: '2026-08-13',
        dayNumber: 3,
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
        woundType: 'Laceration',
        severity: 'Moderate',
        infectionRiskScore: 58,
        lengthCm: 5.4,
        widthCm: 2.2,
        areaCm2: 9.3,
        granulationPercent: 42,
        painLevel: 6,
        comparisonStatus: 'Healing',
        comparisonNotes: 'Day 3 Checkpoint. Erythema reduced significantly. Fresh vascular granulation beds visible in wound bed.',
        patientMode: 'adult'
      },
      {
        id: 'log-lac-d5',
        woundTrackId: 'track-laceration-forearm',
        woundTitle: 'Forearm Deep Laceration',
        patientName: 'Ramesh K.',
        woundLocation: 'Right Forearm (Ventral)',
        date: '2026-08-15',
        dayNumber: 5,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
        woundType: 'Laceration',
        severity: 'Moderate',
        infectionRiskScore: 36,
        lengthCm: 4.5,
        widthCm: 1.6,
        areaCm2: 5.6,
        granulationPercent: 70,
        painLevel: 4,
        comparisonStatus: 'Healing',
        comparisonNotes: 'Day 5 Progress. Good wound margin contraction. Marginal epithelial islands migrating inwards.',
        patientMode: 'adult'
      },
      {
        id: 'log-lac-d8',
        woundTrackId: 'track-laceration-forearm',
        woundTitle: 'Forearm Deep Laceration',
        patientName: 'Ramesh K.',
        woundLocation: 'Right Forearm (Ventral)',
        date: '2026-08-18',
        dayNumber: 8,
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
        woundType: 'Laceration',
        severity: 'Minor',
        infectionRiskScore: 16,
        lengthCm: 3.1,
        widthCm: 0.9,
        areaCm2: 2.2,
        granulationPercent: 92,
        painLevel: 2,
        comparisonStatus: 'Healing',
        comparisonNotes: 'Day 8 Rapid Epithelialization. Clean pink scar line forming without signs of localized heat or purulence.',
        patientMode: 'adult'
      }
    ]
  },
  'track-ulcer-heel': {
    title: 'Diabetic Plantar / Heel Ulcer',
    woundType: 'Diabetic Foot Ulcer',
    location: 'Left Plantar Heel',
    patient: 'Suman Devi (Diabetic)',
    logs: [
      {
        id: 'log-ulc-d1',
        woundTrackId: 'track-ulcer-heel',
        woundTitle: 'Diabetic Plantar / Heel Ulcer',
        patientName: 'Suman Devi',
        woundLocation: 'Left Plantar Heel',
        date: '2026-08-08',
        dayNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
        woundType: 'Diabetic Foot Ulcer',
        severity: 'Severe',
        infectionRiskScore: 76,
        lengthCm: 3.8,
        widthCm: 3.2,
        areaCm2: 9.5,
        granulationPercent: 20,
        painLevel: 5,
        comparisonStatus: 'Stable',
        comparisonNotes: 'Day 1 Wagner Grade 2 ulcer. Slough tissue present, offloading footwear initiated.',
        patientMode: 'adult'
      },
      {
        id: 'log-ulc-d4',
        woundTrackId: 'track-ulcer-heel',
        woundTitle: 'Diabetic Plantar / Heel Ulcer',
        patientName: 'Suman Devi',
        woundLocation: 'Left Plantar Heel',
        date: '2026-08-12',
        dayNumber: 4,
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
        woundType: 'Diabetic Foot Ulcer',
        severity: 'Moderate',
        infectionRiskScore: 62,
        lengthCm: 3.4,
        widthCm: 2.8,
        areaCm2: 7.5,
        granulationPercent: 38,
        painLevel: 4,
        comparisonStatus: 'Healing',
        comparisonNotes: 'Day 4 Debridement completed. Healthy capillary budding forming in base.',
        patientMode: 'adult'
      },
      {
        id: 'log-ulc-d8',
        woundTrackId: 'track-ulcer-heel',
        woundTitle: 'Diabetic Plantar / Heel Ulcer',
        patientName: 'Suman Devi',
        woundLocation: 'Left Plantar Heel',
        date: '2026-08-16',
        dayNumber: 8,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
        woundType: 'Diabetic Foot Ulcer',
        severity: 'Moderate',
        infectionRiskScore: 44,
        lengthCm: 2.8,
        widthCm: 2.1,
        areaCm2: 4.6,
        granulationPercent: 65,
        painLevel: 3,
        comparisonStatus: 'Healing',
        comparisonNotes: 'Day 8 Ulcer depth reduced by 40%. Glucose tightly monitored.',
        patientMode: 'adult'
      },
      {
        id: 'log-ulc-d11',
        woundTrackId: 'track-ulcer-heel',
        woundTitle: 'Diabetic Plantar / Heel Ulcer',
        patientName: 'Suman Devi',
        woundLocation: 'Left Plantar Heel',
        date: '2026-08-19',
        dayNumber: 11,
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
        woundType: 'Diabetic Foot Ulcer',
        severity: 'Minor',
        infectionRiskScore: 28,
        lengthCm: 2.0,
        widthCm: 1.4,
        areaCm2: 2.2,
        granulationPercent: 85,
        painLevel: 2,
        comparisonStatus: 'Healing',
        comparisonNotes: 'Day 11 Strong periwound contraction. Continuing silver hydrogel dressing.',
        patientMode: 'adult'
      }
    ]
  },
  'track-pediatric-abrasion': {
    title: 'Pediatric Knee Road Rash',
    woundType: 'Abrasion',
    location: 'Right Patella / Knee',
    patient: 'Aarav M. (Child - Age 7)',
    logs: [
      {
        id: 'log-abr-d1',
        woundTrackId: 'track-pediatric-abrasion',
        woundTitle: 'Pediatric Knee Road Rash',
        patientName: 'Aarav M.',
        woundLocation: 'Right Patella / Knee',
        date: '2026-08-14',
        dayNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
        woundType: 'Abrasion',
        severity: 'Moderate',
        infectionRiskScore: 65,
        lengthCm: 4.8,
        widthCm: 3.5,
        areaCm2: 13.2,
        granulationPercent: 10,
        painLevel: 7,
        comparisonStatus: 'Stable',
        comparisonNotes: 'Bicycle fall with superficial gravel debris. Cleaned with sterile saline.',
        patientMode: 'child'
      },
      {
        id: 'log-abr-d3',
        woundTrackId: 'track-pediatric-abrasion',
        woundTitle: 'Pediatric Knee Road Rash',
        patientName: 'Aarav M.',
        woundLocation: 'Right Patella / Knee',
        date: '2026-08-16',
        dayNumber: 3,
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
        woundType: 'Abrasion',
        severity: 'Minor',
        infectionRiskScore: 35,
        lengthCm: 3.9,
        widthCm: 2.8,
        areaCm2: 8.6,
        granulationPercent: 55,
        painLevel: 4,
        comparisonStatus: 'Healing',
        comparisonNotes: 'Day 3 Healthy dry crust forming over denuded dermis.',
        patientMode: 'child'
      },
      {
        id: 'log-abr-d5',
        woundTrackId: 'track-pediatric-abrasion',
        woundTitle: 'Pediatric Knee Road Rash',
        patientName: 'Aarav M.',
        woundLocation: 'Right Patella / Knee',
        date: '2026-08-18',
        dayNumber: 5,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
        woundType: 'Abrasion',
        severity: 'Minor',
        infectionRiskScore: 12,
        lengthCm: 2.6,
        widthCm: 1.8,
        areaCm2: 3.7,
        granulationPercent: 95,
        painLevel: 1,
        comparisonStatus: 'Healing',
        comparisonNotes: 'Day 5 Fully re-epithelialized with healthy pink epidermis. No infection signs.',
        patientMode: 'child'
      }
    ]
  }
};

export const WoundProgressTracker: React.FC<WoundProgressTrackerProps> = ({
  currentLang,
  highContrast,
  patientMode = 'adult',
  cases = [],
  onSelectProgressImage
}) => {
  // All tracked logs state
  const [allLogs, setAllLogs] = useState<ProgressLogEntry[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('track-laceration-forearm');
  const [metricMode, setMetricMode] = useState<ChartMetricMode>('combined');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Modal State for adding new daily check point
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<string>('');
  const [newWoundTitle, setNewWoundTitle] = useState<string>('Forearm Deep Laceration');
  const [newPatientName, setNewPatientName] = useState<string>('Ramesh K.');
  const [newWoundLocation, setNewWoundLocation] = useState<string>('Right Forearm');
  const [newWoundType, setNewWoundType] = useState<WoundType>('Laceration');
  const [newSeverity, setNewSeverity] = useState<'Minor' | 'Moderate' | 'Severe'>('Moderate');
  const [newInfectionScore, setNewInfectionScore] = useState<number>(40);
  const [newLength, setNewLength] = useState<number>(3.8);
  const [newWidth, setNewWidth] = useState<number>(1.6);
  const [newGranulation, setNewGranulation] = useState<number>(65);
  const [newPainLevel, setNewPainLevel] = useState<number>(3);
  const [notesInput, setNotesInput] = useState<string>('');

  // Load from localStorage or populate default tracks
  useEffect(() => {
    try {
      const saved = localStorage.getItem('woundcare_vlm_progress_tracker_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllLogs(parsed);
          return;
        }
      }

      // Initial flat seed of all tracks
      const initialLogs: ProgressLogEntry[] = Object.values(DEFAULT_WOUND_TRACKS).flatMap(t => t.logs);
      setAllLogs(initialLogs);
      localStorage.setItem('woundcare_vlm_progress_tracker_v2', JSON.stringify(initialLogs));
    } catch (e) {
      console.warn('Failed to load progress logs from storage:', e);
    }
  }, []);

  // Save logs helper
  const saveLogs = (updated: ProgressLogEntry[]) => {
    setAllLogs(updated);
    try {
      localStorage.setItem('woundcare_vlm_progress_tracker_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save progress logs:', e);
    }
  };

  // Group logs into distinct wound tracking series
  const uniqueWoundTracks = useMemo(() => {
    const map = new Map<string, { id: string; title: string; woundType: string; patient: string; location: string; count: number }>();
    
    // First include pre-defined keys
    Object.entries(DEFAULT_WOUND_TRACKS).forEach(([id, t]) => {
      map.set(id, {
        id,
        title: t.title,
        woundType: t.woundType,
        patient: t.patient,
        location: t.location,
        count: 0
      });
    });

    // Populate counts and dynamically discovered track IDs
    allLogs.forEach(log => {
      const trackKey = log.woundTrackId || `track-${log.woundType.toLowerCase().replace(/\s+/g, '-')}`;
      const existing = map.get(trackKey);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(trackKey, {
          id: trackKey,
          title: log.woundTitle || `${log.woundType} Progress`,
          woundType: log.woundType,
          patient: log.patientName || 'Patient',
          location: log.woundLocation || 'Localized Lesion',
          count: 1
        });
      }
    });

    return Array.from(map.values()).filter(t => t.count > 0 || allLogs.some(l => (l.woundTrackId || '') === t.id));
  }, [allLogs]);

  // Filter logs for the currently selected wound
  const activeTrackLogs = useMemo(() => {
    let filtered = allLogs.filter(log => {
      if (selectedTrackId === 'all') return true;
      const key = log.woundTrackId || `track-${log.woundType.toLowerCase().replace(/\s+/g, '-')}`;
      return key === selectedTrackId;
    });

    // Sort chronologically by date
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allLogs, selectedTrackId]);

  // Format data specifically for Recharts LineChart
  const chartData = useMemo(() => {
    return activeTrackLogs.map((log, index) => {
      const calcArea = log.areaCm2 || parseFloat((log.lengthCm * log.widthCm * 0.7854).toFixed(2));
      const healingVelocity = Math.max(0, Math.min(100, Math.round(100 - (log.infectionRiskScore * 0.6 + (log.lengthCm / 8) * 40))));
      
      // Relative day indicator (e.g., Day 1, Day 3, Day 5)
      const dayLabel = log.dayNumber ? `Day ${log.dayNumber}` : `Day ${index + 1}`;
      
      return {
        id: log.id,
        index,
        date: log.date,
        dayLabel: `${dayLabel} (${log.date.slice(5)})`,
        shortDate: log.date.slice(5),
        infectionRiskScore: log.infectionRiskScore,
        surfaceAreaCm2: calcArea,
        lengthCm: log.lengthCm,
        widthCm: log.widthCm,
        granulationPercent: log.granulationPercent ?? Math.max(10, 100 - log.infectionRiskScore),
        painLevel: log.painLevel ?? 4,
        healingVelocity,
        comparisonStatus: log.comparisonStatus,
        comparisonNotes: log.comparisonNotes,
        imageUrl: log.imageUrl,
        severity: log.severity,
        woundType: log.woundType,
        patientName: log.patientName
      };
    });
  }, [activeTrackLogs]);

  // Clinical Summary Trajectory Metrics
  const summaryMetrics = useMemo(() => {
    if (chartData.length < 1) return null;
    const first = chartData[0];
    const latest = chartData[chartData.length - 1];
    
    const infectionDiff = first.infectionRiskScore - latest.infectionRiskScore;
    const infectionPercentReduction = first.infectionRiskScore > 0 
      ? Math.round((infectionDiff / first.infectionRiskScore) * 100)
      : 0;

    const areaDiff = first.surfaceAreaCm2 - latest.surfaceAreaCm2;
    const areaPercentReduction = first.surfaceAreaCm2 > 0
      ? Math.round((areaDiff / first.surfaceAreaCm2) * 100)
      : 0;

    const daysTracked = chartData.length;
    const dailyContractionRate = daysTracked > 1 
      ? parseFloat((areaDiff / (daysTracked * 2)).toFixed(2)) 
      : 0.3;

    // Linear projection to zero area
    const daysToFullClosure = dailyContractionRate > 0 && latest.surfaceAreaCm2 > 0
      ? Math.max(1, Math.round(latest.surfaceAreaCm2 / dailyContractionRate))
      : 0;

    return {
      first,
      latest,
      infectionDiff,
      infectionPercentReduction,
      areaDiff: parseFloat(areaDiff.toFixed(1)),
      areaPercentReduction,
      dailyContractionRate,
      daysToFullClosure,
      isHealingTrend: latest.infectionRiskScore <= first.infectionRiskScore && latest.surfaceAreaCm2 <= first.surfaceAreaCm2
    };
  }, [chartData]);

  // FEATURE: Aggregate Healing Rate & Regimen Effectiveness across all active wounds
  const aggregateHealingAnalytics = useMemo(() => {
    // Group all logs by distinct wound track
    const tracksMap = new Map<string, { id: string; title: string; woundType: string; logs: ProgressLogEntry[] }>();
    
    allLogs.forEach(log => {
      const trackId = log.woundTrackId || `track-${log.woundType.toLowerCase().replace(/\s+/g, '-')}`;
      if (!tracksMap.has(trackId)) {
        tracksMap.set(trackId, {
          id: trackId,
          title: log.woundTitle || log.woundType,
          woundType: log.woundType,
          logs: []
        });
      }
      tracksMap.get(trackId)!.logs.push(log);
    });

    const activeWoundStats: Array<{
      trackId: string;
      title: string;
      woundType: string;
      initialArea: number;
      latestArea: number;
      areaReductionPercent: number;
      dailyRateCm2: number;
      infectionReduction: number;
      daysTracked: number;
      status: 'Healing' | 'Stable' | 'Worsening';
    }> = [];

    let totalAreaReductionPct = 0;
    let totalDailyVelocity = 0;
    let totalInfectionReductionPct = 0;
    let validTracksCount = 0;

    tracksMap.forEach(track => {
      const sorted = [...track.logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (sorted.length === 0) return;

      const first = sorted[0];
      const latest = sorted[sorted.length - 1];

      const initialArea = first.areaCm2 || parseFloat((first.lengthCm * first.widthCm * 0.7854).toFixed(2));
      const latestArea = latest.areaCm2 || parseFloat((latest.lengthCm * latest.widthCm * 0.7854).toFixed(2));
      
      const areaDiff = initialArea - latestArea;
      const areaReductionPercent = initialArea > 0
        ? Math.round((areaDiff / initialArea) * 100)
        : 0;

      const infectionDiff = first.infectionRiskScore - latest.infectionRiskScore;
      const infectionReduction = first.infectionRiskScore > 0
        ? Math.round((infectionDiff / first.infectionRiskScore) * 100)
        : 0;

      const daysDiff = Math.max(
        1,
        Math.round((new Date(latest.date).getTime() - new Date(first.date).getTime()) / (1000 * 3600 * 24)) ||
        (sorted.length > 1 ? (sorted.length - 1) * 2 : 1)
      );

      const dailyRateCm2 = sorted.length > 1 && areaDiff > 0
        ? parseFloat((areaDiff / daysDiff).toFixed(2))
        : sorted.length === 1 ? 0.35 : 0;

      const status: 'Healing' | 'Stable' | 'Worsening' = 
        areaReductionPercent > 10 || (sorted.length > 1 && infectionReduction > 15)
          ? 'Healing'
          : areaReductionPercent < -5
          ? 'Worsening'
          : 'Stable';

      activeWoundStats.push({
        trackId: track.id,
        title: track.title,
        woundType: track.woundType,
        initialArea,
        latestArea,
        areaReductionPercent,
        dailyRateCm2,
        infectionReduction,
        daysTracked: daysDiff,
        status
      });

      totalAreaReductionPct += areaReductionPercent;
      totalDailyVelocity += dailyRateCm2;
      totalInfectionReductionPct += infectionReduction;
      validTracksCount++;
    });

    const activeWoundsCount = validTracksCount;
    const avgHealingRatePercent = activeWoundsCount > 0
      ? Math.round(totalAreaReductionPct / activeWoundsCount)
      : 0;
    
    const avgDailyContractionRate = activeWoundsCount > 0
      ? parseFloat((totalDailyVelocity / activeWoundsCount).toFixed(2))
      : 0;

    const avgInfectionClearance = activeWoundsCount > 0
      ? Math.round(totalInfectionReductionPct / activeWoundsCount)
      : 0;

    // Regimen Effectiveness Evaluation
    let regimenStatus: 'optimal' | 'moderate' | 'review';
    let regimenTitle = {
      en: 'Care Regimen: Highly Effective',
      hi: 'देखभाल पद्धति: अत्यधिक प्रभावी',
      ta: 'சிகிச்சை முறை: மிகவும் பயனுள்ளது'
    };
    let regimenInsight = {
      en: 'Active tissue contraction exceeds clinical baseline expectations (>0.30 cm²/day). Antiseptic dressing protocol and wound hygiene are optimal.',
      hi: 'घाव संकुचन दर अपेक्षित स्तर (>0.30 सेमी²/दिन) से बेहतर है। एंटीसेप्टिक ड्रेसिंग और देखभाल प्रोटोकॉल सही ढंग से काम कर रहा है।',
      ta: 'காயம் சுருங்கும் வேகம் மருத்துவ எதிர்பார்ப்பை விட அதிகமாக உள்ளது (>0.30 செ.மீ²/நாள்). தற்போதைய சிகிச்சை முறை மிகச் சரியாக செயல்படுகிறது.'
    };

    if (avgHealingRatePercent >= 50 || avgDailyContractionRate >= 0.3) {
      regimenStatus = 'optimal';
      regimenTitle = {
        en: 'Care Regimen: Highly Effective (Optimal Recovery)',
        hi: 'देखभाल पद्धति: अत्यधिक प्रभावी (सफल सुधार)',
        ta: 'சிகிச்சை முறை: மிகவும் பயனுள்ளது (விரைவான குணம்)'
      };
      regimenInsight = {
        en: 'Average healing velocity is robust across active wounds. Current topical dressing cadence and wound protection protocols are strongly accelerating closure.',
        hi: 'सभी सक्रिय घावों में तेजी से सुधार हो रहा है। नियमित एंटीसेप्टिक पट्टी और सफाई जारी रखें।',
        ta: 'அனைத்து காயங்களிலும் சிறந்த குணமடைதல் வேகம் காணப்படுகிறது. தினசரி தூய கட்டு போடுவதைத் தொடரவும்.'
      };
    } else if (avgHealingRatePercent >= 20 || avgDailyContractionRate >= 0.1) {
      regimenStatus = 'moderate';
      regimenTitle = {
        en: 'Care Regimen: Steady Progress (Monitoring Advised)',
        hi: 'देखभाल पद्धति: स्थिर सुधार (निगरानी आवश्यक)',
        ta: 'சிகிச்சை முறை: சீரான முன்னேற்றம் (கண்காணிப்பு தேவை)'
      };
      regimenInsight = {
        en: 'Moderate tissue regeneration observed. Ensure dressing changes remain sterile and inspect for adequate blood perfusion.',
        hi: 'मध्यम गति से ऊतक सुधार हो रहा है। पट्टी बदलते समय स्वच्छता का विशेष ध्यान रखें।',
        ta: 'மிதமான குணமடைதல் வேகம். கட்டு மாற்றும்போது தூய்மையைப் பேணவும்.'
      };
    } else {
      regimenStatus = 'review';
      regimenTitle = {
        en: 'Care Regimen: Stalled / Clinical Review Recommended',
        hi: 'देखभाल पद्धति: सुधार धीमा / डॉक्टर की सलाह लें',
        ta: 'சிகிச்சை முறை: மந்தமான முன்னேற்றம் / மருத்துவ ஆலோசனை தேவை'
      };
      regimenInsight = {
        en: 'Healing rate is below expected benchmark. Evaluate for occult bioburden, uncontrolled blood glucose, or inadequate pressure relief.',
        hi: 'उपचार दर सामान्य से कम है। संक्रमण या डायबिटीज़ की जांच कराएं और प्राथमिक स्वास्थ्य केंद्र जाएं।',
        ta: 'குணமடைதல் வேகம் குறைவாக உள்ளது. தொற்று அல்லது நீரிழிவு அளவை பரிசோதித்து மருத்துவரை அணுகவும்.'
      };
    }

    return {
      activeWoundsCount,
      avgHealingRatePercent,
      avgDailyContractionRate,
      avgInfectionClearance,
      regimenStatus,
      regimenTitle,
      regimenInsight,
      activeWoundStats
    };
  }, [allLogs]);

  // Handle adding new log
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = newImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80';

    const prevLog = activeTrackLogs[activeTrackLogs.length - 1];
    let status: 'Healing' | 'Stable' | 'Worsening' = 'Stable';
    let compNotes = 'Routine daily checkpoint logged.';

    if (prevLog) {
      if (newInfectionScore < prevLog.infectionRiskScore || newLength < prevLog.lengthCm) {
        status = 'Healing';
        compNotes = `Infection risk reduced to ${newInfectionScore}% (was ${prevLog.infectionRiskScore}%). Area contracted from ${(prevLog.lengthCm * prevLog.widthCm * 0.785).toFixed(1)}cm² to ${(newLength * newWidth * 0.785).toFixed(1)}cm².`;
      } else if (newInfectionScore > prevLog.infectionRiskScore || newLength > prevLog.lengthCm) {
        status = 'Worsening';
        compNotes = `Elevated erythema or perimeter expansion noted compared to prior checkpoint.`;
      }
    }

    const calculatedArea = parseFloat((newLength * newWidth * 0.7854).toFixed(2));
    const nextDay = activeTrackLogs.length > 0 ? (activeTrackLogs[activeTrackLogs.length - 1].dayNumber || activeTrackLogs.length) + 2 : 1;

    const newEntry: ProgressLogEntry = {
      id: 'log-' + Date.now(),
      woundTrackId: selectedTrackId === 'all' ? 'track-laceration-forearm' : selectedTrackId,
      woundTitle: newWoundTitle,
      patientName: newPatientName,
      woundLocation: newWoundLocation,
      date: new Date().toISOString().split('T')[0],
      dayNumber: nextDay,
      imageUrl: finalImage,
      woundType: newWoundType,
      severity: newSeverity,
      infectionRiskScore: newInfectionScore,
      lengthCm: newLength,
      widthCm: newWidth,
      areaCm2: calculatedArea,
      granulationPercent: newGranulation,
      painLevel: newPainLevel,
      comparisonStatus: status,
      comparisonNotes: notesInput || compNotes,
      patientMode: (patientMode as PatientMode) || 'adult'
    };

    saveLogs([...allLogs, newEntry]);
    setShowAddModal(false);
    setNewImage('');
    setNotesInput('');
  };

  const handleDeleteLog = (id: string) => {
    const updated = allLogs.filter(l => l.id !== id);
    saveLogs(updated);
    if (selectedPointIndex !== null) setSelectedPointIndex(null);
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

  // Custom Tooltip Component for Recharts Line Chart
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#e2dfd5] shadow-xl text-[#2c2c2c] max-w-xs space-y-2.5 z-50 text-xs">
          <div className="flex items-center justify-between border-b border-[#f0ede4] pb-1.5">
            <span className="font-serif font-bold text-[#5A5A40] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
              {data.dayLabel}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              data.comparisonStatus === 'Healing'
                ? 'bg-emerald-100 text-emerald-800'
                : data.comparisonStatus === 'Worsening'
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {data.comparisonStatus}
            </span>
          </div>

          {/* Miniature Photo Preview on Hover */}
          {data.imageUrl && (
            <div className="relative h-20 w-full rounded-lg overflow-hidden bg-[#f0ede4] border border-[#e2dfd5]">
              <img
                src={data.imageUrl}
                alt="Wound Point"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.2 rounded">
                {data.lengthCm}x{data.widthCm} cm
              </div>
            </div>
          )}

          {/* Metric Stats */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-[#fdfcf8] p-1.5 rounded-lg border border-[#e2dfd5]">
              <span className="text-[#8e8b82] block text-[10px]">Infection Risk</span>
              <strong className={`font-mono text-xs ${data.infectionRiskScore > 50 ? 'text-red-600' : 'text-emerald-700'}`}>
                {data.infectionRiskScore}%
              </strong>
            </div>
            <div className="bg-[#fdfcf8] p-1.5 rounded-lg border border-[#e2dfd5]">
              <span className="text-[#8e8b82] block text-[10px]">Surface Area</span>
              <strong className="font-mono text-xs text-indigo-700">
                {data.surfaceAreaCm2} cm²
              </strong>
            </div>
            <div className="bg-[#fdfcf8] p-1.5 rounded-lg border border-[#e2dfd5]">
              <span className="text-[#8e8b82] block text-[10px]">Granulation</span>
              <strong className="font-mono text-xs text-emerald-600">
                {data.granulationPercent}%
              </strong>
            </div>
            <div className="bg-[#fdfcf8] p-1.5 rounded-lg border border-[#e2dfd5]">
              <span className="text-[#8e8b82] block text-[10px]">Pain VAS Score</span>
              <strong className="font-mono text-xs text-amber-700">
                {data.painLevel}/10
              </strong>
            </div>
          </div>

          <p className="text-[10px] text-[#8e8b82] italic line-clamp-2 border-t border-[#f0ede4] pt-1">
            "{data.comparisonNotes}"
          </p>
        </div>
      );
    }
    return null;
  };

  const selectedPoint = selectedPointIndex !== null && chartData[selectedPointIndex] ? chartData[selectedPointIndex] : chartData[chartData.length - 1];

  return (
    <div className={`p-6 rounded-[28px] border transition shadow-sm space-y-6 ${
      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-white border-[#e2dfd5] text-[#2c2c2c]'
    }`}>
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e2dfd5]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#5A5A40] leading-tight">
                {currentLang === 'hi'
                  ? 'घाव सुधार और उपचार प्रगति चार्ट'
                  : currentLang === 'ta'
                  ? 'காயம் குணமடைதல் முன்னேற்ற வரைபடம்'
                  : 'Wound Healing Trajectory & Progress Analytics'}
              </h2>
              <p className="text-xs text-[#8e8b82]">
                Interactive Recharts time-series visualization tracking infection risk reduction, surface area contraction, and tissue regeneration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            id="btn-add-progress-log"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#5A5A40] text-white hover:bg-[#4a4a34] transition text-xs font-bold uppercase tracking-wider cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Follow-Up Scan</span>
          </button>
        </div>
      </div>

      {/* Track Selector Bar (Tabs for Specific Wounds) */}
      <div className="bg-[#f9f8f5] p-3 rounded-2xl border border-[#e2dfd5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40]">
          <Filter className="w-4 h-4 text-[#5A5A40]" />
          <span>Select Tracked Wound Case:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {uniqueWoundTracks.map(track => (
            <button
              key={track.id}
              onClick={() => {
                setSelectedTrackId(track.id);
                setSelectedPointIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                selectedTrackId === track.id
                  ? 'bg-[#5A5A40] text-white font-bold shadow-xs'
                  : 'bg-white text-[#5A5A40] border border-[#e2dfd5] hover:bg-[#f0ede4]'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{track.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedTrackId === track.id ? 'bg-white/20 text-white' : 'bg-[#e2dfd5] text-[#5A5A40]'
              }`}>
                {track.count}
              </span>
            </button>
          ))}
          
          <button
            onClick={() => {
              setSelectedTrackId('all');
              setSelectedPointIndex(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              selectedTrackId === 'all'
                ? 'bg-[#5A5A40] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5A40] border border-[#e2dfd5] hover:bg-[#f0ede4]'
            }`}
          >
            All Tracks ({allLogs.length})
          </button>
        </div>
      </div>

      {/* FEATURE: Global Average Healing Rate & Care Regimen Effectiveness Summary Card */}
      {aggregateHealingAnalytics && aggregateHealingAnalytics.activeWoundsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          id="card-average-healing-rate"
          className={`p-5 rounded-3xl border shadow-sm transition space-y-4 ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
              : aggregateHealingAnalytics.regimenStatus === 'optimal'
              ? 'bg-[#f4f7f2] border-[#cddbc8]'
              : aggregateHealingAnalytics.regimenStatus === 'moderate'
              ? 'bg-[#fdf9f0] border-[#eddcc4]'
              : 'bg-[#fff5f5] border-[#f5cccc]'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left: Headline, Badge & Regimen Effectiveness Verdict */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#5A5A40]" />
                  {currentLang === 'hi'
                    ? 'औसत उपचार दर (सभी सक्रिय घाव)'
                    : currentLang === 'ta'
                    ? 'சராசரி குணமடைதல் விகிதம் (அனைத்து காயங்கள்)'
                    : 'Average Healing Rate (Across Active Wounds)'}
                </span>

                {/* Regimen Efficacy Status Pill */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs ${
                  aggregateHealingAnalytics.regimenStatus === 'optimal'
                    ? 'bg-emerald-700 text-white'
                    : aggregateHealingAnalytics.regimenStatus === 'moderate'
                    ? 'bg-amber-700 text-white'
                    : 'bg-rose-700 text-white'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  {aggregateHealingAnalytics.regimenTitle[currentLang] || aggregateHealingAnalytics.regimenTitle.en}
                </span>
              </div>

              <p className="text-xs text-[#444444] leading-relaxed max-w-2xl">
                {aggregateHealingAnalytics.regimenInsight[currentLang] || aggregateHealingAnalytics.regimenInsight.en}
              </p>

              {/* Progress Velocity Bar */}
              <div className="space-y-1 pt-1 max-w-xl">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#5A5A40]">
                  <span>Care Regimen Velocity Index</span>
                  <span>{aggregateHealingAnalytics.avgHealingRatePercent}% Target Progress</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/10 overflow-hidden">
                  <div
                    style={{ width: `${Math.max(5, Math.min(100, aggregateHealingAnalytics.avgHealingRatePercent))}%` }}
                    className={`h-full transition-all duration-700 rounded-full ${
                      aggregateHealingAnalytics.regimenStatus === 'optimal'
                        ? 'bg-emerald-600'
                        : aggregateHealingAnalytics.regimenStatus === 'moderate'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Right: Aggregate Metric Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
              <motion.div whileHover={{ scale: 1.03 }} className="bg-white/95 p-3 rounded-2xl border border-black/5 shadow-2xs text-center min-w-[115px]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8e8b82]">
                  Avg Contraction
                </span>
                <div className="flex items-center justify-center gap-1 text-emerald-700 my-0.5">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-2xl font-serif font-bold">
                    {aggregateHealingAnalytics.avgHealingRatePercent}%
                  </span>
                </div>
                <span className="text-[10px] text-[#8e8b82] block">Area Reduction</span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="bg-white/95 p-3 rounded-2xl border border-black/5 shadow-2xs text-center min-w-[115px]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8e8b82]">
                  Daily Velocity
                </span>
                <div className="flex items-center justify-center gap-1 text-indigo-700 my-0.5">
                  <Ruler className="w-4 h-4" />
                  <span className="text-2xl font-serif font-bold">
                    {aggregateHealingAnalytics.avgDailyContractionRate}
                  </span>
                </div>
                <span className="text-[10px] text-[#8e8b82] block">cm² / day</span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="bg-white/95 p-3 rounded-2xl border border-black/5 shadow-2xs text-center col-span-2 sm:col-span-1 min-w-[115px]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8e8b82]">
                  Active Wounds
                </span>
                <div className="flex items-center justify-center gap-1 text-[#5A5A40] my-0.5">
                  <HeartPulse className="w-4 h-4" />
                  <span className="text-2xl font-serif font-bold">
                    {aggregateHealingAnalytics.activeWoundsCount}
                  </span>
                </div>
                <span className="text-[10px] text-[#8e8b82] block">Active Tracks</span>
              </motion.div>
            </div>

          </div>

          {/* Active Wounds Trajectory Breakdown Pills */}
          <div className="pt-2 border-t border-black/5 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-[#5A5A40] text-[11px]">Individual Wound Trajectories:</span>
            {aggregateHealingAnalytics.activeWoundStats.map((stat) => (
              <div
                key={stat.trackId}
                className="bg-white/90 px-3 py-1 rounded-xl border border-black/5 flex items-center gap-2 text-[11px] shadow-2xs"
              >
                <span className="font-semibold text-[#2c2c2c]">{stat.title}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  stat.status === 'Healing'
                    ? 'bg-emerald-100 text-emerald-800'
                    : stat.status === 'Worsening'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  ▼ {stat.areaReductionPercent}% ({stat.dailyRateCm2} cm²/d)
                </span>
              </div>
            ))}
          </div>

        </motion.div>
      )}

      {/* Clinical Trajectory KPI Cards */}
      {summaryMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Infection Risk Reduction */}
          <div className="p-4 rounded-2xl bg-[#fdfcf8] border border-[#e2dfd5] space-y-1 relative overflow-hidden">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8b82] flex items-center justify-between">
              <span>Infection Clearance</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-emerald-700">
                {summaryMetrics.infectionPercentReduction >= 0 ? `▼ ${summaryMetrics.infectionPercentReduction}%` : `▲ +${Math.abs(summaryMetrics.infectionPercentReduction)}%`}
              </span>
              <span className="text-xs text-[#8e8b82]">
                {summaryMetrics.first.infectionRiskScore}% → {summaryMetrics.latest.infectionRiskScore}%
              </span>
            </div>
            <p className="text-[11px] text-[#8e8b82]">
              {summaryMetrics.latest.infectionRiskScore <= 25 ? 'Low active inflammation. Favorable sterile healing.' : 'Ongoing pathogen surveillance advised.'}
            </p>
          </div>

          {/* Area Contraction Metric */}
          <div className="p-4 rounded-2xl bg-[#fdfcf8] border border-[#e2dfd5] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8b82] flex items-center justify-between">
              <span>Surface Contraction</span>
              <Ruler className="w-3.5 h-3.5 text-indigo-600" />
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-indigo-700">
                {summaryMetrics.areaPercentReduction >= 0 ? `▼ ${summaryMetrics.areaPercentReduction}%` : `▲ +${Math.abs(summaryMetrics.areaPercentReduction)}%`}
              </span>
              <span className="text-xs text-[#8e8b82]">
                {summaryMetrics.first.surfaceAreaCm2} → {summaryMetrics.latest.surfaceAreaCm2} cm²
              </span>
            </div>
            <p className="text-[11px] text-[#8e8b82]">
              Contraction rate: ~{summaryMetrics.dailyContractionRate} cm²/day
            </p>
          </div>

          {/* Tissue Regeneration / Granulation */}
          <div className="p-4 rounded-2xl bg-[#fdfcf8] border border-[#e2dfd5] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8b82] flex items-center justify-between">
              <span>Granulation Bed</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-[#5A5A40]">
                {summaryMetrics.latest.granulationPercent}%
              </span>
              <span className="text-xs text-[#8e8b82]">Healthy Vascular Bed</span>
            </div>
            <p className="text-[11px] text-[#8e8b82]">
              {summaryMetrics.latest.granulationPercent >= 80 ? 'Epithelial migration actively bridging edges.' : 'Proliferative tissue stage active.'}
            </p>
          </div>

          {/* Estimated Epithelial Closure Horizon */}
          <div className="p-4 rounded-2xl bg-[#f5f7f2] border border-[#d8e0d0] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A40] flex items-center justify-between">
              <span>Est. Closure Horizon</span>
              <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-serif font-bold text-[#2c2c2c]">
                {summaryMetrics.daysToFullClosure > 0 ? `~${summaryMetrics.daysToFullClosure} Days` : 'Healed'}
              </span>
              <span className="text-xs text-[#8e8b82]">To 0 cm² Target</span>
            </div>
            <p className="text-[11px] text-[#8e8b82]">
              Assumes maintained dressing & nutrition.
            </p>
          </div>

        </div>
      )}

      {/* Main Recharts Line Chart Container */}
      <div className="p-5 rounded-3xl bg-[#fdfcf8] border border-[#e2dfd5] shadow-inner space-y-4">
        
        {/* Chart Metric Mode Selector & Legend Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-[#e2dfd5]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="text-sm font-serif font-bold text-[#5A5A40]">
              Healing Progress Line Chart (Recharts Dynamic Trajectory)
            </h3>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#8e8b82] font-semibold mr-1">Display Metric:</span>
            
            <button
              onClick={() => setMetricMode('combined')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                metricMode === 'combined'
                  ? 'bg-[#5A5A40] text-white font-bold'
                  : 'bg-white text-[#525252] border border-[#e2dfd5] hover:bg-[#f0ede4]'
              }`}
            >
              Multi-Metric (Dual Axis)
            </button>

            <button
              onClick={() => setMetricMode('infection')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                metricMode === 'infection'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-white text-[#525252] border border-[#e2dfd5] hover:bg-[#f0ede4]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Infection Risk %
            </button>

            <button
              onClick={() => setMetricMode('area')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                metricMode === 'area'
                  ? 'bg-indigo-700 text-white font-bold'
                  : 'bg-white text-[#525252] border border-[#e2dfd5] hover:bg-[#f0ede4]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Surface Area (cm²)
            </button>

            <button
              onClick={() => setMetricMode('dimensions')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                metricMode === 'dimensions'
                  ? 'bg-cyan-700 text-white font-bold'
                  : 'bg-white text-[#525252] border border-[#e2dfd5] hover:bg-[#f0ede4]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              Dimensions (L x W cm)
            </button>

            <button
              onClick={() => setMetricMode('granulation')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                metricMode === 'granulation'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-white text-[#525252] border border-[#e2dfd5] hover:bg-[#f0ede4]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Granulation %
            </button>
          </div>
        </div>

        {/* Recharts Render Stage */}
        {chartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-dashed border-[#e2dfd5]">
            <Activity className="w-8 h-8 text-[#8e8b82] mb-2" />
            <p className="text-sm font-serif font-bold text-[#5A5A40]">No Checkpoint Logs for this Wound Case</p>
            <p className="text-xs text-[#8e8b82] max-w-xs mt-1">
              Upload or capture a wound photograph to begin tracking the healing curve over time.
            </p>
          </div>
        ) : (
          <div className="w-full h-80 pt-2 pb-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    setSelectedPointIndex(e.activeTooltipIndex);
                  }
                }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338ca" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4338ca" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="infectionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="granulationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2dfd5" vertical={false} />
                
                <XAxis
                  dataKey="dayLabel"
                  stroke="#8e8b82"
                  tick={{ fontSize: 11, fill: '#525252' }}
                  tickLine={{ stroke: '#e2dfd5' }}
                />

                {/* Left Y Axis (% for Risk, Granulation, Velocity) */}
                <YAxis
                  yAxisId="left"
                  stroke="#8e8b82"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#525252' }}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={{ stroke: '#e2dfd5' }}
                />

                {/* Right Y Axis (Dimensions & Surface Area in cm² / cm) */}
                {(metricMode === 'combined' || metricMode === 'area' || metricMode === 'dimensions') && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#4338ca"
                    domain={[0, 'dataMax + 2']}
                    tick={{ fontSize: 11, fill: '#4338ca' }}
                    tickFormatter={(val) => `${val} cm²`}
                    tickLine={{ stroke: '#e2dfd5' }}
                  />
                )}

                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />

                {/* Clinical Reference Lines */}
                <ReferenceLine
                  yAxisId="left"
                  y={65}
                  stroke="#dc2626"
                  strokeDasharray="4 4"
                  label={{ value: 'High Infection Alert (>65%)', fill: '#dc2626', fontSize: 10, position: 'insideTopLeft' }}
                />

                <ReferenceLine
                  yAxisId="left"
                  y={20}
                  stroke="#059669"
                  strokeDasharray="3 3"
                  label={{ value: 'Low Risk Safe Threshold (20%)', fill: '#059669', fontSize: 10, position: 'insideBottomLeft' }}
                />

                {/* Dynamic Line & Area Curves based on metricMode */}
                {(metricMode === 'combined' || metricMode === 'infection') && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="infectionRiskScore"
                    name="Infection Risk Score (%)"
                    stroke="#dc2626"
                    strokeWidth={3}
                    fill="url(#infectionGradient)"
                    dot={{ r: 5, fill: '#dc2626', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, stroke: '#dc2626', strokeWidth: 2, fill: '#fff' }}
                  />
                )}

                {(metricMode === 'combined' || metricMode === 'area') && (
                  <Area
                    yAxisId={metricMode === 'area' ? 'left' : 'right'}
                    type="monotone"
                    dataKey="surfaceAreaCm2"
                    name="Wound Surface Area (cm²)"
                    stroke="#4338ca"
                    strokeWidth={3}
                    fill="url(#areaGradient)"
                    dot={{ r: 5, fill: '#4338ca', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, stroke: '#4338ca', strokeWidth: 2, fill: '#fff' }}
                  />
                )}

                {(metricMode === 'combined' || metricMode === 'granulation') && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="granulationPercent"
                    name="Healthy Granulation Bed (%)"
                    stroke="#059669"
                    strokeWidth={2.5}
                    strokeDasharray={metricMode === 'combined' ? '4 2' : undefined}
                    dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, stroke: '#059669', strokeWidth: 2, fill: '#fff' }}
                  />
                )}

                {metricMode === 'dimensions' && (
                  <>
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="lengthCm"
                      name="Wound Length (cm)"
                      stroke="#0284c7"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="widthCm"
                      name="Wound Width (cm)"
                      stroke="#0d9488"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </>
                )}

                {metricMode === 'pain' && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="painLevel"
                    name="Subjective Pain VAS (1-10)"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }}
                  />
                )}

              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Selected Data Point Inspector Box */}
        {selectedPoint && (
          <div className="p-4 rounded-2xl bg-white border border-[#e2dfd5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#f0ede4] shrink-0 border border-[#e2dfd5]">
                <img
                  src={selectedPoint.imageUrl}
                  alt={selectedPoint.dayLabel}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => onSelectProgressImage && onSelectProgressImage(selectedPoint.imageUrl)}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#2c2c2c]">
                    {selectedPoint.dayLabel} • {selectedPoint.woundType}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedPoint.comparisonStatus === 'Healing'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedPoint.comparisonStatus === 'Worsening'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedPoint.comparisonStatus}
                  </span>
                </div>
                <p className="text-xs text-[#8e8b82] mt-0.5">
                  {selectedPoint.comparisonNotes}
                </p>
                <div className="flex items-center gap-3 text-[11px] font-mono mt-1 text-[#525252]">
                  <span>📏 {selectedPoint.lengthCm}x{selectedPoint.widthCm} cm ({selectedPoint.surfaceAreaCm2} cm²)</span>
                  <span>🦠 Risk: {selectedPoint.infectionRiskScore}%</span>
                  <span>🌱 Granulation: {selectedPoint.granulationPercent}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-[#8e8b82] bg-[#f9f8f5] px-2.5 py-1 rounded-lg border border-[#e2dfd5]">
                Click chart points to inspect history
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Milestone Comparison (Baseline Day 1 vs Latest Follow-Up) */}
      {chartData.length >= 2 && (
        <div className="p-5 rounded-3xl bg-[#f5f7f2] border border-[#d8e0d0] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#5A5A40] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5A5A40]" />
              Baseline vs. Latest Follow-Up Photographic Comparison
            </h3>
            <span className="text-[11px] font-mono text-[#5A5A40] font-bold">
              {chartData.length} Scans in Series
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* Day 1 Baseline Card */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#e2dfd5] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#5A5A40]">
                <span>Day 1 (Initial Injury Baseline)</span>
                <span className="text-[#8e8b82] font-mono">{chartData[0].date}</span>
              </div>
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#f0ede4] border border-[#e2dfd5]">
                <img
                  src={chartData[0].imageUrl}
                  alt="Day 1 Baseline"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Baseline Day 1
                </span>
                <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                  Area: {chartData[0].surfaceAreaCm2} cm² • Risk: {chartData[0].infectionRiskScore}%
                </span>
              </div>
              <p className="text-[11px] text-[#8e8b82] italic">
                {chartData[0].comparisonNotes}
              </p>
            </div>

            {/* Latest Follow-Up Card */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#e2dfd5] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#5A5A40]">
                <span>{chartData[chartData.length - 1].dayLabel} (Current Status)</span>
                <span className="text-emerald-700 font-bold font-mono">
                  ▼ {summaryMetrics?.areaPercentReduction}% Contraction
                </span>
              </div>
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#f0ede4] border border-[#e2dfd5]">
                <img
                  src={chartData[chartData.length - 1].imageUrl}
                  alt="Latest Follow-up"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Latest Scan ({chartData[chartData.length - 1].date})
                </span>
                <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                  Area: {chartData[chartData.length - 1].surfaceAreaCm2} cm² • Risk: {chartData[chartData.length - 1].infectionRiskScore}%
                </span>
              </div>
              <p className="text-[11px] text-[#8e8b82] italic">
                {chartData[chartData.length - 1].comparisonNotes}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Grid of All Individual Daily Photo Checkpoint Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] font-serif flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#5A5A40]" />
            Logged Photographic Chronology ({activeTrackLogs.length} Checkpoints)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTrackLogs.map((log, idx) => (
            <div
              key={log.id}
              className={`p-3.5 rounded-2xl border transition bg-white text-[#2c2c2c] space-y-2.5 shadow-2xs relative group ${
                selectedPointIndex === idx ? 'ring-2 ring-[#5A5A40] border-[#5A5A40]' : 'border-[#e2dfd5]'
              }`}
            >
              <div className="relative h-36 rounded-xl overflow-hidden bg-[#f0ede4] border border-[#e2dfd5]">
                <img
                  src={log.imageUrl}
                  alt={`Checkpoint Day ${log.dayNumber || idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedPointIndex(idx)}
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur">
                  Day {log.dayNumber || idx + 1}
                </span>
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow ${
                  log.comparisonStatus === 'Healing' ? 'bg-emerald-600' : log.comparisonStatus === 'Worsening' ? 'bg-red-600' : 'bg-amber-600'
                }`}>
                  {log.comparisonStatus}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#5A5A40] truncate max-w-[140px]">{log.woundType}</span>
                  <span className="font-mono text-[11px] text-[#8e8b82]">{log.lengthCm}x{log.widthCm} cm</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8e8b82]">Infection Risk:</span>
                  <strong className={`font-mono ${log.infectionRiskScore > 50 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {log.infectionRiskScore}%
                  </strong>
                </div>
                <p className="text-[11px] text-[#8e8b82] line-clamp-2 leading-tight italic">
                  "{log.comparisonNotes}"
                </p>
              </div>

              <div className="pt-2 border-t border-[#f0ede4] flex items-center justify-between text-[11px]">
                <span className="text-[#8e8b82] font-mono text-[10px]">{log.date}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedPointIndex(idx)}
                    className="text-[#5A5A40] hover:text-[#333] p-1 cursor-pointer"
                    title="Highlight on chart"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                    title="Delete log entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add New Daily Progress Checkpoint */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-lg w-full text-[#2c2c2c] border border-[#e2dfd5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#e2dfd5] pb-3">
              <h3 className="text-base font-serif font-bold text-[#5A5A40] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#5A5A40]" />
                <span>Log Daily Wound Follow-Up Scan</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8e8b82] hover:text-[#2c2c2c] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              
              {/* Wound Title / Case Name */}
              <div>
                <label className="block font-bold mb-1 text-[#5A5A40]">Wound Track / Patient Name:</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newWoundTitle}
                    onChange={(e) => setNewWoundTitle(e.target.value)}
                    placeholder="e.g. Forearm Laceration"
                    className="w-full p-2.5 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8]"
                  />
                  <input
                    type="text"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="Patient Name"
                    className="w-full p-2.5 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8]"
                  />
                </div>
              </div>

              {/* Photo Input */}
              <div>
                <label className="block font-bold mb-1 text-[#5A5A40]">Upload Wound Checkpoint Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8] text-xs"
                />
                {newImage && (
                  <div className="mt-2 h-28 rounded-xl overflow-hidden border border-[#e2dfd5]">
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[#5A5A40]">Length (cm):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLength}
                    onChange={(e) => setNewLength(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-[#5A5A40]">Width (cm):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWidth}
                    onChange={(e) => setNewWidth(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8]"
                  />
                </div>
              </div>

              {/* Clinical Scores */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[#5A5A40]">Infection Risk (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newInfectionScore}
                    onChange={(e) => setNewInfectionScore(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-[#5A5A40]">Granulation (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newGranulation}
                    onChange={(e) => setNewGranulation(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-[#5A5A40]">Pain VAS (1-10):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newPainLevel}
                    onChange={(e) => setNewPainLevel(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8]"
                  />
                </div>
              </div>

              {/* Observation Notes */}
              <div>
                <label className="block font-bold mb-1 text-[#5A5A40]">Daily Clinical Notes:</label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Bandage changed, dressing clean, noticeable contraction around lateral borders..."
                  className="w-full p-2 border border-[#e2dfd5] rounded-xl bg-[#fdfcf8] text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#e2dfd5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-[#e2dfd5] text-xs font-bold hover:bg-[#f0ede4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#4a4a34] shadow cursor-pointer uppercase tracking-wider"
                >
                  Save to Trajectory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
