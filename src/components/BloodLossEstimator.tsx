import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight, 
  Sliders, 
  Heart, 
  Activity, 
  Timer, 
  CheckCircle2, 
  Baby, 
  User, 
  HelpCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { BloodLossData, Language, PatientMode, HemorrhageClass, BleedingFlowRate } from '../types';

interface BloodLossEstimatorProps {
  data?: BloodLossData;
  currentLang: Language;
  patientMode?: PatientMode;
  onLaunchTourniquetGuide?: () => void;
  highContrast?: boolean;
}

export const BloodLossEstimator: React.FC<BloodLossEstimatorProps> = ({
  data,
  currentLang,
  patientMode = 'adult',
  onLaunchTourniquetGuide,
  highContrast
}) => {
  const isChild = patientMode === 'child';

  // Base state & multi-factor calibration
  const [volumeMl, setVolumeMl] = useState<number>(data?.estimatedVolumeMl || 45);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(isChild ? 18 : 70);
  const [gauzeCount, setGauzeCount] = useState<number>(1);
  const [lapPadCount, setLapPadCount] = useState<number>(0);
  const [poolDiameterCm, setPoolDiameterCm] = useState<number>(10);
  const [flowRate, setFlowRate] = useState<BleedingFlowRate>('Capillary Ooze (Slow Trickle)');
  const [showAdvancedEstimator, setShowAdvancedEstimator] = useState<boolean>(false);

  // Shock Index state (HR / SBP)
  const [heartRate, setHeartRate] = useState<number>(isChild ? 110 : 80);
  const [systolicBp, setSystolicBp] = useState<number>(isChild ? 95 : 120);

  // 10-Minute Direct Pressure Timer State
  const [pressureSecondsLeft, setPressureSecondsLeft] = useState<number>(600);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && pressureSecondsLeft > 0) {
      interval = setInterval(() => {
        setPressureSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (pressureSecondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, pressureSecondsLeft]);

  // Real-world Estimated Total Blood Volume (EBV)
  // Adult: ~70 mL/kg | Child: ~80 mL/kg
  const totalBloodVolumeMl = isChild ? patientWeightKg * 80 : patientWeightKg * 70;
  const percentLoss = Math.min(100, parseFloat(((volumeMl / totalBloodVolumeMl) * 100).toFixed(1)));

  // ATLS Hemorrhagic Shock Staging
  let hemorrhageClass: HemorrhageClass = 'Class I (<15%)';
  if (percentLoss >= 40) hemorrhageClass = 'Class IV (>40%)';
  else if (percentLoss >= 30) hemorrhageClass = 'Class III (30-40%)';
  else if (percentLoss >= 15) hemorrhageClass = 'Class II (15-30%)';

  // Shock Index: SI = HR / SBP. Normal adult 0.5 - 0.7. SI > 0.9 is critical shock marker.
  const shockIndex = systolicBp > 0 ? parseFloat((heartRate / systolicBp).toFixed(2)) : 0.7;
  const isShockCritical = shockIndex > (isChild ? 1.3 : 0.9) || percentLoss >= 15;

  const isSevere = percentLoss >= 15 || volumeMl >= (isChild ? 150 : 500) || flowRate.includes('Arterial');

  // Compute estimate from multi-factor inputs
  const computeMultiFactorVolume = () => {
    const gauzeVol = gauzeCount * 12; // 4x4 gauze holds ~12ml
    const lapVol = lapPadCount * 120; // laparotomy pad holds ~120ml
    const poolRadius = poolDiameterCm / 2;
    const poolArea = Math.PI * poolRadius * poolRadius;
    const poolVol = Math.round(poolArea * 0.15); // ~0.15ml per cm2 on floor/surface
    let flowBonus = 0;
    if (flowRate.includes('Venous')) flowBonus = 50;
    if (flowRate.includes('Arterial')) flowBonus = 250;

    const total = Math.max(10, gauzeVol + lapVol + poolVol + flowBonus);
    setVolumeMl(total);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const labels = {
    en: {
      title: 'Precision Blood Loss & Hemorrhage Triage',
      adultMode: 'Adult EBV Model (70 mL/kg)',
      childMode: 'Pediatric EBV Model (80 mL/kg)',
      estLoss: 'Estimated Blood Loss',
      percentTotal: '% of Total Blood Volume',
      shockStage: 'ATLS Hemorrhagic Shock Stage',
      shockIndex: 'Shock Index (HR / SBP)',
      flowRate: 'Bleeding Dynamic',
      openCalculator: 'Multi-Factor Visual Blood Loss Calibrator',
      closeCalculator: 'Close Calibrator',
      gauzeLabel: 'Saturated 4×4 Gauze Pads (~12mL each)',
      lapLabel: 'Saturated Towels / Large Pads (~120mL each)',
      poolLabel: 'Blood Pool Diameter on Ground (cm)',
      applyMultiFactor: 'Calculate Calibrated Volume',
      directPressure: 'Continuous Direct Pressure Timer (10 Min)',
      startTimer: 'Start 10-Min Pressure',
      pauseTimer: 'Pause',
      resetTimer: 'Reset',
      pressureDesc: 'Do NOT lift gauze to peek during continuous 10-minute direct firm pressure.',
      tourniquetWarning: 'CRITICAL ARTERIAL / CLASS III+ HEMORRHAGE! Apply arterial tourniquet 2-3 inches proximal to injury immediately.',
      tourniquetBtn: 'Launch Interactive Tourniquet Guide',
      pediatricAlert: 'PEDIATRIC WARNING: Small absolute blood loss (<150mL) causes rapid hypovolemic shock in children.'
    },
    hi: {
      title: 'रक्तस्राव मात्रा एवं शॉक आकलन (Blood Loss)',
      adultMode: 'वयस्क रक्त मात्रा मॉडल (70 mL/kg)',
      childMode: 'बाल चिकित्सा मॉडल (80 mL/kg)',
      estLoss: 'अनुमानित रक्तस्राव',
      percentTotal: 'कुल रक्त का प्रतिशत',
      shockStage: 'शॉक श्रेणी (ATLS Stage)',
      shockIndex: 'शॉक इंडेक्स (HR / SBP)',
      flowRate: 'रक्त प्रवाह का प्रकार',
      openCalculator: 'सटीक कपड़ा व सतह आधारित मापक',
      closeCalculator: 'कैलकुलेटर बंद करें',
      gauzeLabel: 'भीगी हुई कॉटन पट्टियां (12ml प्रत्येक)',
      lapLabel: 'भीगे हुए कपड़े या तौलिए (120ml प्रत्येक)',
      poolLabel: 'जमीन पर फैले रक्त का व्यास (सेमी)',
      applyMultiFactor: 'सटीक मात्रा की गणना करें',
      directPressure: '10 मिनट निरंतर सीधा दबाव टाइमर',
      startTimer: 'दबाव टाइमर शुरू करें',
      pauseTimer: 'रोकें',
      resetTimer: 'रीसेट',
      pressureDesc: '10 मिनट तक बिना पट्टी हटाए लगातार सीधा और मजबूत दबाव बनाए रखें।',
      tourniquetWarning: 'गंभीर रक्तस्राव! शॉक का खतरा। घाव से 2-3 इंच ऊपर कसकर पट्टी (Tourniquet) बांधें।',
      tourniquetBtn: 'टूर्निकेट (Tourniquet) गाइड खोलें',
      pediatricAlert: 'बाल रोगी चेतावनी: बच्चों में 150ml से कम रक्त की कमी भी जानलेवा शॉक पैदा कर सकती है।'
    },
    ta: {
      title: 'இரத்த இழப்பு & அதிர்ச்சி நிலை அளவீடு',
      adultMode: 'பெரியவர் மாதிரி (70 mL/kg)',
      childMode: 'குழந்தை மாதிரி (80 mL/kg)',
      estLoss: 'மதிப்பிடப்பட்ட இரத்த இழப்பு',
      percentTotal: 'மொத்த இரத்தத்தில் சதவீதம்',
      shockStage: 'அதிர்ச்சி நிலை (ATLS Stage)',
      shockIndex: 'அதிர்ச்சி குறியீடு (HR / SBP)',
      flowRate: 'இரத்தப்போக்கு வகை',
      openCalculator: 'துல்லிய இரத்த இழப்பு கணக்கீட்டுக் கருவி',
      closeCalculator: 'மூடவும்',
      gauzeLabel: 'நனைந்த பஞ்சு கட்டுகள் (12ml ஒவ்வொன்றும்)',
      lapLabel: 'நனைந்த துணிகள் / டவல்கள் (120ml ஒவ்வொன்றும்)',
      poolLabel: 'தரையில் தேங்கிய இரத்த விட்டம் (செ.மீ)',
      applyMultiFactor: 'அளவைக் கணக்கிடுங்கள்',
      directPressure: '10 நிமிட தொடர் நேரடி அழுத்தம்',
      startTimer: 'டைமரைத் தொடங்கு',
      pauseTimer: 'நிறுத்து',
      resetTimer: 'மீட்டமை',
      pressureDesc: '10 நிமிடங்களுக்கு கட்டை எடுக்காமல் தொடர்ந்து உறுதியாக அழுத்திப் பிடிக்கவும்.',
      tourniquetWarning: 'கடுமையான இரத்தப்போக்கு! காயத்திற்கு 2-3 அங்குலம் மேலே டூர்னிகெட் கட்டு போடவும்.',
      tourniquetBtn: 'டூர்னிகெட் வழிகாட்டியைத் திறக்கவும்',
      pediatricAlert: 'குழந்தைகளுக்கான எச்சரிக்கை: 150ml க்கும் குறைவான இரத்த இழப்பும் உயிருக்கு ஆபத்தை விளைவிக்கும்.'
    }
  };

  const curr = labels[currentLang] || labels.en;

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
      isSevere 
        ? 'bg-red-950/20 border-red-500/70 text-[#1a1a1a]' 
        : 'bg-[#fdfcf8] border-[#e2dfd5] text-[#2c2c2c]'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isSevere ? 'bg-red-600 text-white border-red-700 animate-pulse' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1e231c]">
              {curr.title}
            </h4>
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
              {isChild ? (
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  <Baby className="w-3.5 h-3.5" /> {curr.childMode}
                </span>
              ) : (
                <span className="text-gray-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-500" /> {curr.adultMode}
                </span>
              )}
              <span>• Total EBV ~{Math.round(totalBloodVolumeMl)} mL</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAdvancedEstimator(!showAdvancedEstimator)}
          className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#d5d2c8] bg-[#f9f8f4] hover:bg-[#eae7dc] transition flex items-center gap-1.5 cursor-pointer text-gray-700"
        >
          <Sliders className="w-3.5 h-3.5 text-red-600" />
          <span>{showAdvancedEstimator ? curr.closeCalculator : curr.openCalculator}</span>
        </button>
      </div>

      {/* Pediatric Specific Warning Banner */}
      {isChild && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
          <Baby className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {curr.pediatricAlert} (Current weight calibrated: <strong>{patientWeightKg} kg</strong>).
          </p>
        </div>
      )}

      {/* Advanced Multi-Factor Calibrator Drawer */}
      {showAdvancedEstimator && (
        <div className="p-4 rounded-xl bg-white border border-[#e2ded2] space-y-3.5 shadow-xs">
          <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Visual Clinical Blood Loss Calibrator:
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-gray-600 font-medium">{curr.gauzeLabel}:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={gauzeCount}
                  onChange={(e) => setGauzeCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-1.5 border rounded-lg bg-gray-50 text-sm font-bold"
                />
                <span className="text-gray-400 font-mono">pads</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-600 font-medium">{curr.lapLabel}:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={lapPadCount}
                  onChange={(e) => setLapPadCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-1.5 border rounded-lg bg-gray-50 text-sm font-bold"
                />
                <span className="text-gray-400 font-mono">items</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-600 font-medium">{curr.poolLabel}:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={poolDiameterCm}
                  onChange={(e) => setPoolDiameterCm(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-1.5 border rounded-lg bg-gray-50 text-sm font-bold"
                />
                <span className="text-gray-400 font-mono">cm</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1 text-xs">
              <label className="text-gray-600 font-medium">{curr.flowRate}:</label>
              <select
                value={flowRate}
                onChange={(e) => setFlowRate(e.target.value as BleedingFlowRate)}
                className="w-full p-2 border rounded-lg bg-gray-50 font-medium text-xs cursor-pointer"
              >
                <option value="Capillary Ooze (Slow Trickle)">Capillary Ooze (Slow Trickle)</option>
                <option value="Venous Bleed (Steady Flow)">Venous Bleed (Steady Flow)</option>
                <option value="Arterial Bleed (Pulsatile Spurting)">Arterial Bleed (Pulsatile Spurting)</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-gray-600 font-medium">Patient Weight (kg):</label>
              <input
                type="number"
                min="3"
                max="150"
                value={patientWeightKg}
                onChange={(e) => setPatientWeightKg(Math.max(3, parseInt(e.target.value) || (isChild ? 18 : 70)))}
                className="w-full p-1.5 border rounded-lg bg-gray-50 text-sm font-bold"
              />
            </div>
          </div>

          <button
            onClick={computeMultiFactorVolume}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{curr.applyMultiFactor}</span>
          </button>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Estimated Volume */}
        <div className="p-3 rounded-xl bg-white border border-[#e5e2d8] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            {curr.estLoss}
          </span>
          <div className="text-xl font-serif font-bold text-red-700">
            ~{volumeMl} <span className="text-xs font-normal text-gray-500">mL</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            Measured fluid
          </span>
        </div>

        {/* % Total Blood Volume */}
        <div className="p-3 rounded-xl bg-white border border-[#e5e2d8] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            {curr.percentTotal}
          </span>
          <div className={`text-xl font-serif font-bold ${
            percentLoss >= 30 ? 'text-red-600' : percentLoss >= 15 ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {percentLoss}%
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            of ~{Math.round(totalBloodVolumeMl)} mL
          </span>
        </div>

        {/* ATLS Shock Stage */}
        <div className="p-3 rounded-xl bg-white border border-[#e5e2d8] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            {curr.shockStage}
          </span>
          <div className="text-xs font-bold text-gray-900 truncate">
            {hemorrhageClass}
          </div>
          <span className={`text-[10px] font-bold ${
            percentLoss >= 30 ? 'text-red-600' : percentLoss >= 15 ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {percentLoss >= 30 ? 'Severe Shock' : percentLoss >= 15 ? 'Moderate Shock' : 'Compensated'}
          </span>
        </div>

        {/* Shock Index */}
        <div className="p-3 rounded-xl bg-white border border-[#e5e2d8] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            {curr.shockIndex}
          </span>
          <div className={`text-lg font-serif font-bold ${shockIndex > 0.9 ? 'text-red-600' : 'text-gray-900'}`}>
            {shockIndex}
          </div>
          <span className="text-[10px] text-gray-500">
            {shockIndex > 0.9 ? '⚠️ Occult Shock' : 'Normal Hemodynamics'}
          </span>
        </div>
      </div>

      {/* Visual Volume Gauge Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
          <span>0% (Normal)</span>
          <span>15% (Class II)</span>
          <span>30% (Class III)</span>
          <span>40%+ (Class IV)</span>
        </div>

        <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden border border-gray-300 relative">
          <div className="absolute left-[15%] top-0 bottom-0 w-0.5 bg-amber-400 z-10" />
          <div className="absolute left-[30%] top-0 bottom-0 w-0.5 bg-red-500 z-10" />
          <div className="absolute left-[40%] top-0 bottom-0 w-0.5 bg-red-800 z-10" />

          <div
            className={`h-full transition-all duration-1000 ${
              percentLoss >= 30 
                ? 'bg-gradient-to-r from-amber-500 via-red-600 to-red-800' 
                : percentLoss >= 15 
                ? 'bg-gradient-to-r from-emerald-500 to-amber-500' 
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.max(5, percentLoss)}%` }}
          />
        </div>
      </div>

      {/* 10-Minute Continuous Direct Pressure Timer */}
      <div className="p-3.5 rounded-xl bg-white border border-[#e2ded2] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">
              {curr.directPressure}
            </div>
            <p className="text-[11px] text-gray-500">
              {curr.pressureDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-xl font-bold px-3 py-1 bg-gray-900 text-white rounded-lg tracking-widest">
            {formatTimer(pressureSecondsLeft)}
          </div>

          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer transition"
            title={timerRunning ? curr.pauseTimer : curr.startTimer}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => { setTimerRunning(false); setPressureSecondsLeft(600); }}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition"
            title={curr.resetTimer}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Severe Blood Loss & Tourniquet Launcher */}
      {isSevere && (
        <div className="p-4 rounded-xl bg-red-900/90 text-white border border-red-500 space-y-3 shadow-md animate-pulse">
          <div className="flex items-start gap-2.5 text-xs text-red-100">
            <ShieldAlert className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {curr.tourniquetWarning}
            </p>
          </div>

          {onLaunchTourniquetGuide && (
            <button
              onClick={onLaunchTourniquetGuide}
              className="w-full bg-white hover:bg-red-50 text-red-900 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{curr.tourniquetBtn}</span>
              <ArrowRight className="w-4 h-4 text-red-700" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
