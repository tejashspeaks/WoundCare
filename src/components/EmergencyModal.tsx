import React from 'react';
import { PhoneCall, ShieldAlert, X, HeartPulse, MapPin, AlertTriangle, Droplet } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, highContrast }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-[28px] border p-7 space-y-5 shadow-2xl relative animate-scale-in ${
        highContrast ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-[#e2dfd5] text-[#2c2c2c]'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8e8b82] hover:text-[#2c2c2c] bg-[#f0ede4] cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-[#e2dfd5] pb-4">
          <div className="w-12 h-12 rounded-full bg-[#c62828] flex items-center justify-center text-white shrink-0 animate-pulse shadow">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#c62828] uppercase tracking-wide">
              EMERGENCY RURAL TRIAGE HOTLINE
            </h2>
            <p className="text-xs text-[#8e8b82]">
              Immediate transport & trauma response for rural India
            </p>
          </div>
        </div>

        {/* Main 108 Call Banner */}
        <div className="p-5 rounded-2xl bg-[#c62828] text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-100 block">
              National Emergency Ambulance
            </span>
            <span className="text-3xl font-serif font-black tracking-tight">108</span>
            <span className="text-xs block text-red-100 mt-0.5">Free 24/7 Rural Medical Transport</span>
          </div>
          <a
            href="tel:108"
            className="bg-white text-[#c62828] hover:bg-[#f0ede4] font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition shadow cursor-pointer flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>DIAL 108</span>
          </a>
        </div>

        {/* Quick Emergency Triage Steps */}
        <div className="space-y-2.5 text-xs">
          <h3 className="font-serif font-bold text-[#5A5A40] flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-[#c62828]" />
            <span>Life-Threatening Hemorrhage Triage Protocol:</span>
          </h3>

          <div className="p-4 rounded-2xl bg-[#fdfcfb] border border-[#e2dfd5] space-y-2 text-[#2c2c2c] leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="bg-[#c62828] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">1</span>
              <p><strong>Pulsatile / Spurting Blood:</strong> Press hard on bleeding point with clean cloth without lifting hand for 10 minutes.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="bg-[#c62828] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">2</span>
              <p><strong>Airway Check:</strong> Ensure patient is breathing and lying flat on back with legs slightly elevated.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="bg-[#c62828] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">3</span>
              <p><strong>Nearest PHC Transport:</strong> Direct driver to Primary Health Centre (PHC) with anti-venom & tetanus stock.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-[#f0ede4] hover:bg-[#e2dfd5] text-[#5A5A40] py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer border border-[#e2dfd5]"
          >
            Return to Wound Scanner
          </button>
        </div>

      </div>
    </div>
  );
};
