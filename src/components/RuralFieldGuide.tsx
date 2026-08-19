import React, { useState } from 'react';
import { Language } from '../types';
import { BookOpen, Search, ShieldAlert, Heart, Droplet, Flame, Bug, ShieldCheck, Check } from 'lucide-react';

interface RuralFieldGuideProps {
  currentLang: Language;
  highContrast: boolean;
}

interface GuideTopic {
  id: string;
  category: string;
  icon: React.ReactNode;
  title: { en: string; hi: string; ta: string };
  summary: { en: string; hi: string; ta: string };
  steps: { en: string[]; hi: string[]; ta: string[] };
  myths: { en: string[]; hi: string[]; ta: string[] };
}

const FIELD_GUIDE_TOPICS: GuideTopic[] = [
  {
    id: 'bleeding',
    category: 'Trauma & Hemorrhage',
    icon: <Droplet className="w-4 h-4 text-red-500" />,
    title: {
      en: 'Severe Arterial Bleeding Control',
      hi: 'गंभीर खून बहना रोकना (रक्तस्राव नियंत्रण)',
      ta: 'கடுமையான இரத்தப்போக்கு கட்டுப்பாடு'
    },
    summary: {
      en: 'Arterial spurting can lead to fatal shock in under 3 minutes. Continuous direct pressure is mandatory.',
      hi: 'धमनी से बहता खून 3 मिनट में जानलेवा हो सकता है। सीधा दबाव बनाएं।',
      ta: '3 நிமிடங்களில் அதிக இரத்தப்போக்கு உயிருக்கு ஆபத்தானது. அழுத்தத்தைக் கொடுக்கவும்.'
    },
    steps: {
      en: [
        'Press firmly directly over the bleeding site with a clean cloth or gloved hand.',
        'Do NOT release pressure to check the wound for at least 10 full minutes.',
        'Elevate the injured limb above the chest level if no bone fracture is suspected.',
        'Apply a tight pressure dressing over the pad.',
        'If blood soaks through, do NOT remove the first pad; add a second pad on top.',
        'Call 108 Ambulance immediately for rapid hospital transport.'
      ],
      hi: [
        'साफ कपड़े या दस्ताने से खून बहने वाले स्थान पर सीधा तेज दबाव बनाएं।',
        'कम से कम 10 मिनट तक पट्टी हटाकर घाव को देखने की गलती न करें।',
        'यदि हड्डी न टूटी हो, तो घायल अंग को छाती के स्तर से ऊपर उठाएं।',
        'कपड़े के ऊपर कसकर पट्टी बांधें।',
        'यदि पहली पट्टी खून से भीग जाए, तो उसे न हटाएं; उसके ऊपर दूसरी पट्टी रखें।',
        'तुरंत 108 एम्बुलेंस को कॉल करें।'
      ],
      ta: [
        'சுத்தமான துணியால் இரத்தம் வரும் இடத்தின் மீது நேரடியாக அழுத்தம் கொடுக்கவும்.',
        '10 நிமிடங்களுக்கு கட்டை அவிழ்த்து காயத்தைப் பார்க்கக் கூடாது.',
        'எலும்பு முறிவு இல்லையெனில், காயம்பட்ட உறுப்பை உயர்த்திப் பிடிக்கவும்.',
        'துணியின் மீது இறுக்கமாகக் கட்டு போடவும்.',
        'முதல் துணி இரத்தத்தில் நனைந்தால், அதை அகற்றாமல் அதன் மேல் மற்றொரு துணியை வைக்கவும்.',
        'உடனடியாக 108 ஆம்புலன்ஸை அழைக்கவும்.'
      ]
    },
    myths: {
      en: [
        'DO NOT apply dirty ropes or thin wires as improvised tourniquets; they cause permanent nerve death.',
        'DO NOT apply coffee powder, mud, or cow dung on open spurting arteries.'
      ],
      hi: [
        'रस्सी या पतले तार को कसकर न बांधें, इससे नसें हमेशा के लिए खराब हो सकती हैं।',
        'गहरे घाव पर कॉफी पाउडर, मिट्टी या गोबर न लगाएं।'
      ],
      ta: [
        'கயிற்றால் இறுக்கமாகக் கட்டக் கூடாது; நரம்புகள் செயலிழக்கக் கூடும்.',
        'காயத்தில் காபி தூள், மண் அல்லது சாணம் இடக் கூடாது.'
      ]
    }
  },
  {
    id: 'tetanus',
    category: 'Infection Protocol',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
    title: {
      en: 'Tetanus Toxoid (TT) Immunization Protocol',
      hi: 'टिटनेस का टीका और सुरक्षा नियम',
      ta: 'டெட்டானஸ் தடுப்பூசி வழிகாட்டுதல்'
    },
    summary: {
      en: 'Clostridium tetani spores live in farm soil and animal manure. Puncture wounds carry extreme risk.',
      hi: 'मिट्टी और गोबर में टिटनेस के जीवाणु पाए जाते हैं। जंग लगी वस्तु या पंचर घाव में अधिक खतरा होता है।',
      ta: 'மண் மற்றும் சாணத்தில் டெட்டானஸ் கிருமிகள் உள்ளன. ஆழமான துளைக் காயங்களுக்கு அதிக ஆபத்து.'
    },
    steps: {
      en: [
        'Clean all deep or soil-contaminated wounds with clean running water.',
        'Verify patient vaccination status. If last TT shot was >5 years ago, give 1 dose of TT within 24 hours.',
        'For high-risk dirty puncture wounds in unvaccinated individuals, give Tetanus Immunoglobulin (TIG).'
      ],
      hi: [
        'मिट्टी से गंदे सभी घावों को बहते साफ पानी से धोएं।',
        'यदि आखिरी टिटनेस का टीका 5 साल से अधिक पुराना है, तो 24 घंटे में टीका लगवाएं।',
        'अत्यधिक गंदे घाव में टिटनेस इम्यूनोग्लोबुलिन (TIG) का इंजेक्शन लगवाएं।'
      ],
      ta: [
        'மண்ணால் அழுக்கான காயங்களை ஓடும் நீரில் கழுவவும்.',
        'கடைசி தடுப்பூசி போட்டு 5 ஆண்டுகளுக்கு மேலாகியிருந்தால், 24 மணி நேரத்திற்குள் டெட்டானஸ் ஊசி போடவும்.'
      ]
    },
    myths: {
      en: ['DO NOT rely on washing with kerosene or petrol to kill tetanus spores.'],
      hi: ['टिटनेस खत्म करने के लिए घाव पर मिट्टी का तेल या पेट्रोल न डालें।'],
      ta: ['டெட்டானஸ் கிருமிகளை அழிக்க பெட்ரோல் ஊற்றக் கூடாது.']
    }
  },
  {
    id: 'burns',
    category: 'Thermal Care',
    icon: <Flame className="w-4 h-4 text-amber-500" />,
    title: {
      en: 'Cookstove & Hot Oil Burn First Aid',
      hi: 'जले हुए स्थान का तुरंत उपचार (बर्न केयर)',
      ta: 'தீக்காய முதலுதவி சிகிச்சை'
    },
    summary: {
      en: 'Cooling the burn with water reduces tissue thermal propagation and prevents deep scarring.',
      hi: 'जले हुए स्थान पर ठंडा पानी डालने से जलन और घाव की गहराई कम होती है।',
      ta: 'குளிர்ந்த நீரை ஊற்றுவது தோலின் ஆழமான பாதிப்பைத் தடுக்கும்.'
    },
    steps: {
      en: [
        'Immediately pour cool (not freezing ice water) running water over the burn for 15 to 20 minutes.',
        'Gently remove rings or tight wrist clothing before swelling occurs.',
        'Apply Silver Sulfadiazine cream 1% or sterile burn gel.',
        'Cover loosely with a clean, dry non-stick cloth.'
      ],
      hi: [
        'जले हुए स्थान पर तुरंत 15 से 20 मिनट तक ठंडा बहता पानी डालें।',
        'सूजन आने से पहले अंगूठी या कसकर बंधे कपड़े उतार दें।',
        'सिल्वर सल्फाडायजीन क्रीम या बर्न जेल धीरे से लगाएं।',
        'साफ और सूखे सूती कपड़े से ढके।'
      ],
      ta: [
        'எரிந்த இடத்தில் 15-20 நிமிடங்கள் குளிர்ந்த நீரை ஊற்றவும்.',
        'வீக்கம் அடைவதற்கு முன் மோதிரம் போன்றவற்றை கழற்றவும்.',
        'பர்ன் ஜெல் அல்லது கிரீம் தடவவும்.',
        'சுத்தமான துணியால் லேசாக மூடவும்.'
      ]
    },
    myths: {
      en: ['NEVER apply toothpaste, ghee, raw eggs, or butter. They trap heat and cause sepsis.'],
      hi: ['टूथपेस्ट, घी, कच्चा अंडा या मक्खन न लगाएं। इनसे संक्रमण का खतरा बढ़ता है।'],
      ta: ['டூத்பேஸ்ட், நெய் அல்லது முட்டை தடவக் கூடாது; இது கிருமித் தொற்றை உண்டாக்கும்.']
    }
  }
];

export const RuralFieldGuide: React.FC<RuralFieldGuideProps> = ({ currentLang, highContrast }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = FIELD_GUIDE_TOPICS.filter((topic) => {
    const titleText = topic.title[currentLang] || topic.title.en;
    const summaryText = topic.summary[currentLang] || topic.summary.en;
    return (
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summaryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={`p-6 rounded-[28px] border space-y-6 ${
      highContrast ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-[#e2dfd5] text-[#2c2c2c] shadow-sm'
    }`}>
      
      {/* Header */}
      <div className="border-b border-[#e2dfd5] pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#5A5A40]" />
          <h2 className="text-xl font-serif font-bold text-[#5A5A40]">Rural First-Aid Reference Field Guide</h2>
        </div>
        <p className="text-xs text-[#8e8b82] mt-0.5">
          Offline clinical reference for village health workers, ASHA volunteers, and emergency first responders.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8e8b82] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search field guide (e.g. bleeding, burn, tetanus, pressure)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#fdfcfb] border border-[#e2dfd5] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#2c2c2c] focus:outline-none focus:border-[#5A5A40]"
        />
      </div>

      {/* Topic Cards */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-5 rounded-2xl border bg-[#fdfcfb] border-[#e2dfd5] space-y-3 shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#f0ede4] border border-[#e2dfd5]">
                {topic.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8e8b82] uppercase tracking-wider block">
                  {topic.category}
                </span>
                <h3 className="text-base font-serif font-bold text-[#2c2c2c]">
                  {topic.title[currentLang] || topic.title.en}
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#2c2c2c] bg-[#f0ede4] p-3 rounded-xl border border-[#e2dfd5] leading-relaxed">
              {topic.summary[currentLang] || topic.summary.en}
            </p>

            {/* Action Steps */}
            <div>
              <h4 className="text-xs font-bold text-[#2e7d32] mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                <Check className="w-3.5 h-3.5" />
                <span>Action Protocol</span>
              </h4>
              <ul className="space-y-1 text-xs text-[#2c2c2c] pl-4 list-disc leading-relaxed">
                {(topic.steps[currentLang] || topic.steps.en).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Myth Busters */}
            <div className="p-3 rounded-xl bg-[#fff3f3] border border-[#ffcdd2] text-xs space-y-1">
              <span className="font-bold text-[#c62828] block text-[11px] uppercase tracking-wider">Contraindicated Myths</span>
              {(topic.myths[currentLang] || topic.myths.en).map((m, idx) => (
                <p key={idx} className="text-[#2c2c2c] pl-3 relative before:content-['✕'] before:absolute before:left-0 before:text-[#c62828] font-medium">
                  {m}
                </p>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
