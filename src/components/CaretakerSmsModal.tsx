import React, { useState, useEffect } from 'react';
import { EmergencyContact, PatientMode } from '../types';
import { Send, Phone, User, Plus, Trash2, ShieldAlert, CheckCircle2, MapPin } from 'lucide-react';

interface CaretakerSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
  woundType?: string;
  severity?: string;
  firstAidSummary?: string;
  patientMode?: PatientMode;
}

export const CaretakerSmsModal: React.FC<CaretakerSmsModalProps> = ({
  isOpen,
  onClose,
  highContrast,
  woundType = 'Laceration',
  severity = 'Severe',
  firstAidSummary = 'Deep wound with active bleeding. Clean irrigation and pressure applied.',
  patientMode = 'adult'
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactRelation, setNewContactRelation] = useState<string>('ASHA Worker');
  const [sendingSms, setSendingSms] = useState<boolean>(false);
  const [smsStatusMessage, setSmsStatusMessage] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('woundcare_emergency_contacts');
      if (saved) {
        const parsed = JSON.parse(saved);
        setContacts(parsed);
        if (parsed.length > 0) setSelectedContactId(parsed[0].id);
      } else {
        const initialContacts: EmergencyContact[] = [
          { id: 'c1', name: 'Ramesh (Primary Caretaker)', phone: '+91 98765 43210', relation: 'Family / Guardian' },
          { id: 'c2', name: 'Lakshmi (ASHA Health Worker)', phone: '+91 91234 56789', relation: 'Village ASHA Worker' }
        ];
        setContacts(initialContacts);
        setSelectedContactId('c1');
        localStorage.setItem('woundcare_emergency_contacts', JSON.stringify(initialContacts));
      }
    } catch (e) {
      console.warn('Failed to load emergency contacts', e);
    }

    // Acquire GPS for SMS dispatch
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.warn('Geolocation for SMS denied:', err)
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveContacts = (updated: EmergencyContact[]) => {
    setContacts(updated);
    try {
      localStorage.setItem('woundcare_emergency_contacts', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save contacts:', e);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) {
      alert('Please enter both name and phone number.');
      return;
    }
    if (contacts.length >= 3) {
      alert('You can save up to 3 emergency contacts.');
      return;
    }

    const newContact: EmergencyContact = {
      id: 'c-' + Date.now(),
      name: newContactName,
      phone: newContactPhone,
      relation: newContactRelation
    };

    const updated = [...contacts, newContact];
    saveContacts(updated);
    setSelectedContactId(newContact.id);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    saveContacts(updated);
  };

  const handleSendSms = async () => {
    const contact = contacts.find(c => c.id === selectedContactId);
    if (!contact) {
      alert('Please select a caretaker contact number.');
      return;
    }

    setSendingSms(true);
    setSmsStatusMessage(null);

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toPhone: contact.phone,
          patientMode,
          woundType,
          severity,
          firstAidSummary,
          gpsCoords
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSmsStatusMessage(`✅ Emergency alert dispatched to ${contact.name} (${contact.phone})!`);
      } else {
        setSmsStatusMessage(`⚠️ ${data.error || 'Failed to send SMS.'}`);
      }
    } catch (err: any) {
      setSmsStatusMessage('⚠️ Server connectivity error while sending SMS.');
    } finally {
      setSendingSms(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`p-6 rounded-[24px] border max-w-lg w-full text-[#2c2c2c] shadow-2xl space-y-4 ${
        highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-400' : 'bg-white border-[#e2dfd5]'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-[#e2dfd5]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-[#5A5A40]">
              Emergency Caretaker SMS Alert (Twilio)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#8e8b82] hover:text-[#2c2c2c]"
          >
            ✕
          </button>
        </div>

        {/* Current Wound Alert Info */}
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
          <div className="flex items-center justify-between font-bold">
            <span>Patient: {patientMode === 'child' ? 'Child (<18 Yrs)' : 'Adult (18+)'}</span>
            <span className="uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-red-600 text-white">
              {severity} SEVERITY
            </span>
          </div>
          <p><strong>Wound Type:</strong> {woundType}</p>
          <p><strong>First Aid Summary:</strong> {firstAidSummary}</p>
          {gpsCoords && (
            <p className="flex items-center gap-1 text-[11px] text-red-700">
              <MapPin className="w-3 h-3" /> Live GPS: {gpsCoords.latitude.toFixed(4)}°N, {gpsCoords.longitude.toFixed(4)}°E
            </p>
          )}
        </div>

        {/* Saved Emergency Contacts List */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
            Select Recipient Caretaker Contact:
          </label>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition ${
                selectedContactId === contact.id
                  ? 'border-[#5A5A40] bg-[#f0ede4] font-bold shadow-2xs'
                  : 'border-[#e2dfd5] bg-white hover:bg-[#fdfcf8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="contact"
                  checked={selectedContactId === contact.id}
                  onChange={() => setSelectedContactId(contact.id)}
                  className="accent-[#5A5A40]"
                />
                <div>
                  <div className="font-bold text-[#2c2c2c]">{contact.name}</div>
                  <div className="text-[11px] text-[#8e8b82]">{contact.phone} • {contact.relation}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteContact(contact.id);
                }}
                className="text-red-600 hover:text-red-800 p-1"
                title="Remove contact"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Contact Form (Up to 3) */}
        {contacts.length < 3 && (
          <form onSubmit={handleAddContact} className="pt-2 border-t border-[#e2dfd5] space-y-2 text-xs">
            <span className="block font-bold text-[#8e8b82] text-[11px] uppercase tracking-wider">
              Add Emergency Contact ({contacts.length}/3 Saved):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Name (e.g. Dr. Vijay / ASHA)"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="p-2 border rounded-xl bg-white text-xs"
              />
              <input
                type="tel"
                placeholder="Phone (e.g. +91 9876543210)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="p-2 border rounded-xl bg-white text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 rounded-xl border border-[#5A5A40] text-[#5A5A40] hover:bg-[#f0ede4] font-bold text-xs flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Save Contact Number
            </button>
          </form>
        )}

        {smsStatusMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{smsStatusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2dfd5]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSendSms}
            disabled={sendingSms || contacts.length === 0}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer uppercase tracking-wider"
          >
            <Send className="w-4 h-4" />
            <span>{sendingSms ? 'Dispatching SMS...' : 'SEND EMERGENCY SMS NOW'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
