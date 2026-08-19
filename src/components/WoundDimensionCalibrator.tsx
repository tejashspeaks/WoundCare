import React, { useState } from 'react';
import { 
  Ruler, 
  Coins, 
  CreditCard, 
  Fingerprint, 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Maximize2,
  Flame,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WoundMeasurement, WoundDepthGrade, Language, PatientMode, WoundType } from '../types';

interface WoundDimensionCalibratorProps {
  measurement?: WoundMeasurement;
  woundType: WoundType;
  patientMode: PatientMode;
  currentLang: Language;
  highContrast?: boolean;
  onUpdateMeasurement?: (updated: WoundMeasurement) => void;
}

export const WoundDimensionCalibrator: React.FC<WoundDimensionCalibratorProps> = ({
  measurement,
  woundType,
  patientMode,
  currentLang,
  highContrast,
  onUpdateMeasurement
}) => {
  const isChild = patientMode === 'child';
  const isBurn = typeof woundType === 'string' && woundType.toLowerCase().includes('burn');

  // Local interactive calibration states
  const [length, setLength] = useState<number>(measurement?.lengthCm || 3.5);
  const [width, setWidth] = useState<number>(measurement?.widthCm || 1.8);
  const [depthMm, setDepthMm] = useState<number>(measurement?.depthMm || 2.0);
  const [selectedRef, setSelectedRef] = useState<'Coin (25mm)' | 'Credit Card (85.6mm)' | 'Medical Ruler' | 'Fingertip (~18mm)' | 'Auto-Detected'>('Coin (25mm)');
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [showBurnCalculator, setShowBurnCalculator] = useState<boolean>(isBurn);

  // Burn TBSA states (Wallace Rule of Nines for Adult / Lund-Browder for Pediatric)
  const [headBurn, setHeadBurn] = useState<boolean>(false);
  const [torsoFrontBurn, setTorsoFrontBurn] = useState<boolean>(false);
  const [torsoBackBurn, setTorsoBackBurn] = useState<boolean>(false);
  const [armLeftBurn, setArmLeftBurn] = useState<boolean>(false);
  const [armRightBurn, setArmRightBurn] = useState<boolean>(false);
  const [legLeftBurn, setLegLeftBurn] = useState<boolean>(false);
  const [legRightBurn, setLegRightBurn] = useState<boolean>(false);

  // Derived calculations
  const surfaceArea = parseFloat((length * width).toFixed(2));
  const perimeter = parseFloat((2 * (length + width)).toFixed(1));

  // Determine Depth Grade
  let depthGrade: WoundDepthGrade = 'Partial Thickness (Dermal 1-3mm)';
  if (depthMm < 1.0) depthGrade = 'Superficial (Epidermal <1mm)';
  else if (depthMm > 3.0 && depthMm <= 6.0) depthGrade = 'Full Thickness (Subcutaneous >3mm)';
  else if (depthMm > 6.0) depthGrade = 'Deep (Exposed Fascia / Muscle / Bone)';

  // Calculate Primary Closure Golden Window (hours)
  let closureWindowHours = 12;
  if (depthMm > 5 || woundType.toLowerCase().includes('puncture') || woundType.toLowerCase().includes('bite')) {
    closureWindowHours = 6; // High infection risk requires earlier debridement or delayed closure
  } else if (woundType.toLowerCase().includes('abrasion')) {
    closureWindowHours = 0; // Secondary intention (no suturing)
  }

  // Calculate Total Burn Surface Area (TBSA %)
  // Pediatric Lund-Browder vs Adult Rule of Nines
  const headTbsa = isChild ? 18 : 9;
  const torsoFrontTbsa = isChild ? 18 : 18;
  const torsoBackTbsa = isChild ? 18 : 18;
  const armTbsa = isChild ? 9 : 9;
  const legTbsa = isChild ? 14 : 18;

  let calculatedTbsa = 0;
  if (headBurn) calculatedTbsa += headTbsa;
  if (torsoFrontBurn) calculatedTbsa += torsoFrontTbsa;
  if (torsoBackBurn) calculatedTbsa += torsoBackTbsa;
  if (armLeftBurn) calculatedTbsa += armTbsa;
  if (armRightBurn) calculatedTbsa += armTbsa;
  if (legLeftBurn) calculatedTbsa += legTbsa;
  if (legRightBurn) calculatedTbsa += legTbsa;

  const handleApplyChanges = () => {
    if (onUpdateMeasurement) {
      onUpdateMeasurement({
        lengthCm: length,
        widthCm: width,
        depthMm,
        depthGrade,
        surfaceAreaCm2: surfaceArea,
        perimeterCm: perimeter,
        formattedText: `${length} cm x ${width} cm (Area ~${surfaceArea} cm²)`,
        referenceCalibrated: true,
        referenceObject: selectedRef,
        goldenClosureWindowHours: closureWindowHours,
        burnTbsaPercent: isBurn ? calculatedTbsa : undefined
      });
    }
    setIsCalibrating(false);
  };

  const labels = {
    en: {
      title: 'Precision Wound Size & Depth Detector',
      subtitle: 'Edge Calibrated Reference Measurement',
      length: 'Length (cm)',
      width: 'Width (cm)',
      depth: 'Depth (mm)',
      area: 'Surface Area',
      perimeter: 'Perimeter',
      depthLabel: 'Depth Grade',
      refObject: 'Calibration Reference Object',
      recalibrateBtn: 'Calibrate with Coin / Scale',
      applyBtn: 'Apply Calibrated Measurements',
      closureWindow: 'Primary Closure Golden Window',
      closureWindowDesc: `${closureWindowHours} Hours limit for sterile surgical suturing before bacterial colonization.`,
      noSutureNeeded: 'Superficial wound: Heals by secondary intention (No sutures needed).',
      burnTitle: isChild ? 'Pediatric Lund-Browder Burn Chart' : 'Adult Rule of Nines Burn Surface Area (TBSA)',
      burnWarning: 'Burns >10% in children or >15% in adults require immediate IV fluid resuscitation (Parkland Formula).'
    },
    hi: {
      title: 'घाव आकार एवं गहराई मापक (Wound Calibrator)',
      subtitle: 'सटीक स्केल व सिक्का आधारित माप',
      length: 'लंबाई (सेमी)',
      width: 'चौड़ाई (सेमी)',
      depth: 'गहराई (मिमी)',
      area: 'कुल क्षेत्रफल',
      perimeter: 'परिधि',
      depthLabel: 'गहराई स्तर',
      refObject: 'मापक संदर्भ वस्तु (Reference)',
      recalibrateBtn: 'सिक्के या स्केल से जांचें',
      applyBtn: 'माप लागू करें',
      closureWindow: 'टांके लगाने की समय सीमा (Golden Window)',
      closureWindowDesc: `संक्रमण से पहले टांके लगाने के लिए ${closureWindowHours} घंटे का समय।`,
      noSutureNeeded: 'ऊपरी घाव: टांकों की आवश्यकता नहीं है।',
      burnTitle: isChild ? 'बाल चिकित्सा बर्न चार्ट (Lund-Browder)' : 'वयस्क बर्न क्षेत्रफल (Rule of Nines)',
      burnWarning: 'बच्चों में 10% से अधिक जलने पर तुरंत अस्पताल में सलाइन फ्लुइड की आवश्यकता होती है।'
    },
    ta: {
      title: 'காய அளவு & ஆழம் துல்லிய அளவீடு',
      subtitle: 'நாணயம் & அளவுகோல் அளவுத்திருத்தம்',
      length: 'நீளம் (செ.மீ)',
      width: 'அகலம் (செ.மீ)',
      depth: 'ஆழம் (மி.மீ)',
      area: 'பரப்பளவு',
      perimeter: 'சுற்றளவு',
      depthLabel: 'ஆழ நிலை',
      refObject: 'அளவுத்திருத்த குறிப்பு பொருள்',
      recalibrateBtn: 'நாணயம் மூலம் அளவிடு',
      applyBtn: 'அளவுகளை சேமிக்கவும்',
      closureWindow: 'தையல் போடுவதற்கான பொன்னான நேரம்',
      closureWindowDesc: `தொற்று ஏற்படுவதற்கு முன் தையல் போட ${closureWindowHours} மணி நேர அவகாசம்.`,
      noSutureNeeded: 'மேலோட்டமான காயம்: தையல் தேவையில்லை.',
      burnTitle: isChild ? 'குழந்தை தீக்காய விளக்கப்படம் (Lund-Browder)' : 'பெரியவர்களுக்கான தீக்காய பரப்பளவு (Rule of Nines)',
      burnWarning: 'குழந்தைகளுக்கு 10% க்கு மேல் தீக்காயம் ஏற்பட்டால் உடனடியாக திரவ சிகிச்சை தேவை.'
    }
  };

  const curr = labels[currentLang] || labels.en;

  return (
    <div className="p-5 rounded-2xl border bg-white border-[#e0ded8] shadow-sm space-y-4 text-[#2c2c2c]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0eee6] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1e231c]">
              {curr.title}
            </h4>
            <p className="text-[11px] text-gray-500 font-medium">
              {curr.subtitle} {isChild && <span className="text-blue-600 font-bold">• Pediatric Scaled</span>}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCalibrating(!isCalibrating)}
          className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#d5d2c8] bg-[#f9f8f4] hover:bg-[#eae7dc] transition flex items-center gap-1.5 cursor-pointer text-gray-700"
        >
          <Coins className="w-3.5 h-3.5 text-amber-600" />
          <span>{isCalibrating ? 'Close Calibration' : curr.recalibrateBtn}</span>
        </button>
      </div>

      {/* Interactive Calibration Panel (When Opened) */}
      {isCalibrating && (
        <div className="p-4 rounded-xl bg-[#faf9f5] border border-[#e2ded2] space-y-3.5">
          <div className="text-xs font-semibold text-gray-700 flex items-center justify-between">
            <span>{curr.refObject}:</span>
            <span className="font-bold text-amber-800">{selectedRef}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Coin (25mm)', label: '₹1/₹5 Coin (25mm)', icon: Coins },
              { id: 'Credit Card (85.6mm)', label: 'Card / ID (85mm)', icon: CreditCard },
              { id: 'Medical Ruler', label: '15cm Ruler', icon: Ruler },
              { id: 'Fingertip (~18mm)', label: isChild ? 'Child Finger (12mm)' : 'Adult Finger (18mm)', icon: Fingerprint }
            ].map(ref => {
              const IconComp = ref.icon;
              const isSelected = selectedRef === ref.id;
              return (
                <button
                  key={ref.id}
                  onClick={() => setSelectedRef(ref.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left flex flex-col gap-1 transition cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-bold shadow-xs' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-700' : 'text-gray-400'}`} />
                  <span className="truncate">{ref.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sliders for Length, Width, Depth */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>{curr.length}:</span>
                <span className="font-mono font-bold text-gray-900">{length.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="25.0"
                step="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>{curr.width}:</span>
                <span className="font-mono font-bold text-gray-900">{width.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="20.0"
                step="0.1"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>{curr.depth}:</span>
                <span className="font-mono font-bold text-gray-900">{depthMm.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="15.0"
                step="0.2"
                value={depthMm}
                onChange={(e) => setDepthMm(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleApplyChanges}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{curr.applyBtn}</span>
          </button>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Surface Area */}
        <div className="p-3 rounded-xl bg-[#f7f6f2] border border-[#e5e2d8] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            {curr.area}
          </span>
          <div className="text-lg font-serif font-bold text-[#1f2937]">
            ~{surfaceArea} <span className="text-xs font-normal text-gray-500">cm²</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            {length}cm × {width}cm
          </span>
        </div>

        {/* Perimeter */}
        <div className="p-3 rounded-xl bg-[#f7f6f2] border border-[#e5e2d8] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            {curr.perimeter}
          </span>
          <div className="text-lg font-serif font-bold text-[#1f2937]">
            ~{perimeter} <span className="text-xs font-normal text-gray-500">cm</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            Circumferential
          </span>
        </div>

        {/* Depth Grade */}
        <div className="p-3 rounded-xl bg-[#f7f6f2] border border-[#e5e2d8] space-y-1 sm:col-span-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            {curr.depthLabel}
          </span>
          <div className="text-xs font-bold text-amber-900 truncate">
            {depthGrade}
          </div>
          <span className="text-[10px] text-gray-500">
            Est. tissue penetration ~{depthMm.toFixed(1)} mm
          </span>
        </div>
      </div>

      {/* Primary Closure Golden Window Indicator */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <span>{curr.closureWindow}</span>
            {closureWindowHours > 0 ? (
              <span className="font-mono bg-amber-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-950">
                ≤ {closureWindowHours} Hours
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Secondary Intention
              </span>
            )}
          </div>
          <p className="text-amber-800/90 text-[11px] leading-relaxed">
            {closureWindowHours > 0 ? curr.closureWindowDesc : curr.noSutureNeeded}
          </p>
        </div>
      </div>

      {/* Burn Surface Area TBSA Calculator (Expandable) */}
      {(isBurn || showBurnCalculator) && (
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => setShowBurnCalculator(!showBurnCalculator)}
            className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-orange-900 hover:text-orange-950 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>{curr.burnTitle} ({calculatedTbsa}% TBSA)</span>
            </div>
            {showBurnCalculator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showBurnCalculator && (
            <div className="mt-3 p-3 rounded-xl bg-orange-50/60 border border-orange-200 space-y-3">
              <p className="text-[11px] text-orange-800 leading-relaxed">
                Select burned anatomical regions to compute accurate Total Burn Surface Area (% TBSA):
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-orange-200 cursor-pointer hover:bg-orange-100/40">
                  <input
                    type="checkbox"
                    checked={headBurn}
                    onChange={(e) => setHeadBurn(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span>Head & Neck ({headTbsa}%)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-orange-200 cursor-pointer hover:bg-orange-100/40">
                  <input
                    type="checkbox"
                    checked={torsoFrontBurn}
                    onChange={(e) => setTorsoFrontBurn(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span>Chest/Abdomen ({torsoFrontTbsa}%)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-orange-200 cursor-pointer hover:bg-orange-100/40">
                  <input
                    type="checkbox"
                    checked={torsoBackBurn}
                    onChange={(e) => setTorsoBackBurn(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span>Upper/Lower Back ({torsoBackTbsa}%)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-orange-200 cursor-pointer hover:bg-orange-100/40">
                  <input
                    type="checkbox"
                    checked={armLeftBurn}
                    onChange={(e) => setArmLeftBurn(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span>Left Arm ({armTbsa}%)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-orange-200 cursor-pointer hover:bg-orange-100/40">
                  <input
                    type="checkbox"
                    checked={armRightBurn}
                    onChange={(e) => setArmRightBurn(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span>Right Arm ({armTbsa}%)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-orange-200 cursor-pointer hover:bg-orange-100/40">
                  <input
                    type="checkbox"
                    checked={legLeftBurn}
                    onChange={(e) => setLegLeftBurn(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span>Left Leg ({legTbsa}%)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-orange-200 cursor-pointer hover:bg-orange-100/40">
                  <input
                    type="checkbox"
                    checked={legRightBurn}
                    onChange={(e) => setLegRightBurn(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span>Right Leg ({legTbsa}%)</span>
                </label>
              </div>

              {/* TBSA Critical Warning */}
              {calculatedTbsa >= (isChild ? 10 : 15) && (
                <div className="p-2.5 rounded-lg bg-red-600 text-white text-xs font-medium flex items-center gap-2 animate-pulse">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{curr.burnWarning}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
