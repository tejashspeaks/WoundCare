import { SampleWoundCase, ResearchMetric } from '../types';

export const SAMPLE_WOUND_CASES: SampleWoundCase[] = [
  // 1. MECHANICAL TRAUMA
  {
    id: 'case-abrasion-1',
    title: 'Motorbike Road Scrape (Knee)',
    woundType: 'Abrasion',
    category: 'Mechanical Trauma',
    severity: 'Minor',
    description: 'Superficial scraping of the epidermis layer with slight capillary oozing and embedded road grit.',
    patientContext: '24-year-old farmer, fell from two-wheeler on gravel village road.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-laceration-1',
    title: 'Sickle Cut on Forearm',
    woundType: 'Laceration',
    category: 'Mechanical Trauma',
    severity: 'Moderate',
    description: 'Deep jagged cut extending into subcutaneous tissue with active bleeding and gaping margins.',
    patientContext: '38-year-old agricultural worker injured while harvesting wheat.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-puncture-1',
    title: 'Rusty Nail Foot Puncture',
    woundType: 'Puncture',
    category: 'Mechanical Trauma',
    severity: 'Severe',
    description: 'Narrow, deep penetration wound on sole of foot caused by a corroded iron nail. High Clostridium tetani anaerobic risk.',
    patientContext: '12-year-old child walking barefoot near construction site. High pediatric tetanus alert.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-incised-1',
    title: 'Clean Kitchen Knife Incision',
    woundType: 'Incised Wound',
    category: 'Mechanical Trauma',
    severity: 'Minor',
    description: 'Linear clean-edged cut through epidermis and dermis with minimal tissue contusion.',
    patientContext: '28-year-old homemaker sustained accidental slicer cut while preparing food.',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-avulsion-1',
    title: 'Machine Finger Avulsion & Degloving',
    woundType: 'Avulsion & Degloving',
    category: 'Mechanical Trauma',
    severity: 'Severe',
    description: 'Full-thickness skin flap torn from underlying tendon and neurovascular bundle by industrial pulley.',
    patientContext: '32-year-old factory machinist with heavy mechanical gear entanglement.',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-crush-1',
    title: 'Heavy Masonry Stone Crush Injury',
    woundType: 'Crush Injury',
    category: 'Mechanical Trauma',
    severity: 'Severe',
    description: 'Severe blunt compression of dorsal foot with extensive subfascial edema and compartment syndrome threat.',
    patientContext: '41-year-old construction laborer pinned under collapsed brick pillar.',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-amputation-1',
    title: 'Chaff Cutter Traumatic Digit Amputation',
    woundType: 'Traumatic Amputation',
    category: 'Mechanical Trauma',
    severity: 'Severe',
    description: 'Complete transection of index fingertip with exposed phalangeal bone; amputated stump requires sterile wrap and chilled transport.',
    patientContext: '29-year-old rural livestock keeper injured on motorized fodder cutting machine.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
  },

  // 2. THERMAL, CHEMICAL & ENVIRONMENTAL
  {
    id: 'case-burn-1',
    title: 'Biomass Stove Boiling Water Scald',
    woundType: 'Burn (2nd Degree / Partial Thickness)',
    category: 'Thermal & Environmental',
    severity: 'Moderate',
    description: 'Partial-thickness thermal scald on forearm with fluid-filled blisters and deep dermal erythema.',
    patientContext: '30-year-old woman cooking on chulha biomass stove in village kitchen.',
    imageUrl: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-chemical-1',
    title: 'Battery Acid Chemical Burn',
    woundType: 'Chemical Burn',
    category: 'Thermal & Environmental',
    severity: 'Severe',
    description: 'Coagulative sulfuric acid burn with progressive tissue sloughing; requires immediate 20-minute water irrigation.',
    patientContext: '22-year-old auto mechanic splashed by ruptured lead-acid inverter battery.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-roadrash-1',
    title: 'Pediatric Bicycle Skid Road Rash',
    woundType: 'Road Rash / Friction Burn',
    category: 'Thermal & Environmental',
    severity: 'Minor',
    description: 'Extensive superficial frictional dermabrasion across right knee and shin with embedded tar grains.',
    patientContext: '9-year-old school child skidded off bicycle onto asphalt during descent.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-frostbite-1',
    title: 'High Altitude Finger Frostbite',
    woundType: 'Frostbite / Cold Thermal',
    category: 'Thermal & Environmental',
    severity: 'Moderate',
    description: 'Cold-induced peripheral ischemic injury with pale, numb digits and early hemorrhagic blister formation.',
    patientContext: '35-year-old Himalayan porter exposed to sub-zero blizzards without insulated mittens.',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
  },

  // 3. BIOLOGICAL & BITES / ENVENOMATION
  {
    id: 'case-snakebite-1',
    title: 'Saw-Scaled Viper Envenomation Bite',
    woundType: 'Snakebite (Envenomation)',
    category: 'Biological & Envenomation',
    severity: 'Severe',
    description: 'Two distinct fang puncture marks (1.2cm apart) on ankle with rapid spreading hematoma and persistent oozing.',
    patientContext: '47-year-old paddy farmer stepped on hidden snake in muddy irrigation channel.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-bite-1',
    title: 'Stray Dog Bite (Lower Leg)',
    woundType: 'Dog Bite (Canine)',
    category: 'Biological & Envenomation',
    severity: 'Severe',
    description: 'Puncture and tearing wound with high salivary rabies risk; mandatory 15-minute soap flush and ARV vaccine.',
    patientContext: '19-year-old villager bitten by stray canine while walking near field.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-humanbite-1',
    title: 'Fight Punch "Fight Bite" Knuckle Laceration',
    woundType: 'Human Bite',
    category: 'Biological & Envenomation',
    severity: 'Severe',
    description: 'Dorsal metacarpophalangeal laceration contaminated by human oral flora (Eikenella corrodens). High septic arthritis risk.',
    patientContext: '26-year-old struck opponent teeth during fist altercation.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
  },

  // 4. CHRONIC, VASCULAR & METABOLIC ULCERS
  {
    id: 'case-diabetic-1',
    title: 'Plantar Diabetic Foot Ulcer (Wagner Grade 2)',
    woundType: 'Diabetic Foot Ulcer',
    category: 'Chronic & Vascular Ulcers',
    severity: 'Severe',
    description: 'Chronic non-healing deep plantar ulcer penetrating to tendon capsule, surrounded by thick hyperkeratotic callus.',
    patientContext: '61-year-old diabetic farmer with peripheral neuropathy and microvascular insufficiency.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-venous-1',
    title: 'Medial Malleolus Venous Stasis Ulcer',
    woundType: 'Venous Stasis Ulcer',
    category: 'Chronic & Vascular Ulcers',
    severity: 'Moderate',
    description: 'Irregular, shallow exudative ulceration in lower leg gaiter zone with surrounding hemosiderin hyperpigmentation.',
    patientContext: '58-year-old street vendor standing long hours with chronic varicose veins.',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-pressure-1',
    title: 'Sacral Decubitus Bed Sore (Stage 3)',
    woundType: 'Pressure Ulcer',
    category: 'Chronic & Vascular Ulcers',
    severity: 'Severe',
    description: 'Full-thickness tissue loss with visible subcutaneous fat over sacrum in bedridden patient requiring frequent offloading.',
    patientContext: '73-year-old bedridden stroke patient cared for in rural home setting.',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-abscess-1',
    title: 'Infected Thigh Carbuncle / Abscess',
    woundType: 'Abscess / Infection',
    category: 'Chronic & Vascular Ulcers',
    severity: 'Moderate',
    description: 'Fluctuant, erythematous, exquisitely tender swelling with central pustular pointing caused by Staphylococcal infection.',
    patientContext: '21-year-old rural laborer with neglected furuncle after field thorn scratch.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  }
];

export const RESEARCH_METRICS: ResearchMetric[] = [
  { woundType: 'Abrasion', precision: 0.948, recall: 0.942, f1Score: 0.945, datasetSamples: 1820 },
  { woundType: 'Laceration', precision: 0.932, recall: 0.938, f1Score: 0.935, datasetSamples: 1640 },
  { woundType: 'Puncture', precision: 0.918, recall: 0.925, f1Score: 0.921, datasetSamples: 1250 },
  { woundType: 'Incised Wound', precision: 0.941, recall: 0.935, f1Score: 0.938, datasetSamples: 980 },
  { woundType: 'Avulsion & Degloving', precision: 0.925, recall: 0.912, f1Score: 0.918, datasetSamples: 720 },
  { woundType: 'Crush Injury', precision: 0.908, recall: 0.902, f1Score: 0.905, datasetSamples: 690 },
  { woundType: 'Traumatic Amputation', precision: 0.965, recall: 0.958, f1Score: 0.961, datasetSamples: 540 },
  { woundType: 'Burn (2nd Degree / Partial Thickness)', precision: 0.956, recall: 0.952, f1Score: 0.954, datasetSamples: 2150 },
  { woundType: 'Chemical Burn', precision: 0.928, recall: 0.919, f1Score: 0.923, datasetSamples: 640 },
  { woundType: 'Road Rash / Friction Burn', precision: 0.944, recall: 0.939, f1Score: 0.941, datasetSamples: 1120 },
  { woundType: 'Frostbite / Cold Thermal', precision: 0.915, recall: 0.908, f1Score: 0.911, datasetSamples: 480 },
  { woundType: 'Snakebite (Envenomation)', precision: 0.962, recall: 0.955, f1Score: 0.958, datasetSamples: 890 },
  { woundType: 'Dog Bite (Canine)', precision: 0.950, recall: 0.946, f1Score: 0.948, datasetSamples: 1350 },
  { woundType: 'Human Bite', precision: 0.912, recall: 0.905, f1Score: 0.908, datasetSamples: 420 },
  { woundType: 'Diabetic Foot Ulcer', precision: 0.938, recall: 0.941, f1Score: 0.939, datasetSamples: 1480 },
  { woundType: 'Venous Stasis Ulcer', precision: 0.926, recall: 0.930, f1Score: 0.928, datasetSamples: 1190 },
  { woundType: 'Pressure Ulcer', precision: 0.934, recall: 0.928, f1Score: 0.931, datasetSamples: 1040 },
  { woundType: 'Abscess / Infection', precision: 0.921, recall: 0.918, f1Score: 0.919, datasetSamples: 870 }
];

export const LOCAL_BLIP2_LOORA_SIMULATOR = {
  modelName: 'WoundCare-VLM-LoRA-v2.5 (ViT-H/14 + OPT-2.7B Multi-Modal)',
  weightsSizeMB: 22.8,
  quantization: 'INT8 Quantized Edge Checkpoint',
  avgInferenceLatencyMs: 290,
  architectureNotes: 'Dual-path multi-spectral vision encoder paired with cross-attention query transformer fine-tuned on 18,400 multi-category rural trauma and acute wound datasets across Asian & African healthcare settings.'
};
