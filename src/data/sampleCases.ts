import { SampleWoundCase, ResearchMetric } from '../types';

export const SAMPLE_WOUND_CASES: SampleWoundCase[] = [
  {
    id: 'case-abrasion-1',
    title: 'Motorbike Road Scrape (Knee)',
    woundType: 'Abrasion',
    severity: 'Minor',
    description: 'Superficial scraping of the epidermis layer with slight capillary bleeding and dirt particles.',
    patientContext: '24-year-old farmer, fell from two-wheeler on gravel village road.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-laceration-1',
    title: 'Sickle Cut on Forearm',
    woundType: 'Laceration',
    severity: 'Moderate',
    description: 'Deep jagged cut extending into subcutaneous tissue with active bleeding.',
    patientContext: '38-year-old agricultural worker injured while harvesting wheat.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-puncture-1',
    title: 'Rusty Nail Foot Puncture',
    woundType: 'Puncture',
    severity: 'Severe',
    description: 'Narrow, deep penetration wound on sole of foot caused by a corroded iron nail.',
    patientContext: '12-year-old boy walking barefoot near construction site. High tetanus risk.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-burn-1',
    title: 'Hot Oil Cookstove Splash',
    woundType: 'Burn',
    severity: 'Moderate',
    description: 'Second-degree thermal burn with blistering and reddened periwound skin on dorsal wrist.',
    patientContext: '30-year-old woman cooking on biomass stove in village kitchen.',
    imageUrl: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-contusion-1',
    title: 'Wood Log Impact Bruise',
    woundType: 'Contusion',
    severity: 'Minor',
    description: 'Closed trauma with subcutaneous hematoma (purplish discoloration) and localized swelling.',
    patientContext: '45-year-old laborer struck by falling timber log.',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-surgical-1',
    title: 'Post-Op Abdominal Incision',
    woundType: 'Surgical Incision',
    severity: 'Moderate',
    description: 'Clean surgical incision with intact sutures, mild periwound erythema, requiring sterile dressing.',
    patientContext: '52-year-old post-appendectomy patient returning for routine wound inspection.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-diabetic-1',
    title: 'Plantar Diabetic Foot Ulcer',
    woundType: 'Diabetic Foot Ulcer',
    severity: 'Severe',
    description: 'Chronic non-healing plantar lesion with slough formation and loss of protective sensation.',
    patientContext: '61-year-old diabetic farmer with peripheral neuropathy.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-bite-1',
    title: 'Stray Dog Bite (Lower Leg)',
    woundType: 'Bite Wound',
    severity: 'Severe',
    description: 'Puncture and tearing wound with high microbial inoculation risk; requires urgent anti-rabies protocol.',
    patientContext: '19-year-old villager bitten by stray canine while walking near field.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'case-pressure-1',
    title: 'Sacral Decubitus Bed Sore',
    woundType: 'Pressure Ulcer',
    severity: 'Severe',
    description: 'Stage 2/3 decubitus pressure sore over sacral prominence with partial thickness skin loss.',
    patientContext: '73-year-old bedridden stroke patient cared for at home.',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
  }
];

export const RESEARCH_METRICS: ResearchMetric[] = [
  { woundType: 'Abrasion', precision: 0.942, recall: 0.938, f1Score: 0.940, datasetSamples: 1420 },
  { woundType: 'Laceration', precision: 0.915, recall: 0.928, f1Score: 0.921, datasetSamples: 1280 },
  { woundType: 'Puncture', precision: 0.898, recall: 0.905, f1Score: 0.901, datasetSamples: 950 },
  { woundType: 'Burn', precision: 0.951, recall: 0.946, f1Score: 0.948, datasetSamples: 1650 },
  { woundType: 'Contusion', precision: 0.924, recall: 0.910, f1Score: 0.917, datasetSamples: 1100 },
  { woundType: 'Surgical Incision', precision: 0.935, recall: 0.941, f1Score: 0.938, datasetSamples: 820 },
  { woundType: 'Diabetic Foot Ulcer', precision: 0.908, recall: 0.912, f1Score: 0.910, datasetSamples: 740 },
  { woundType: 'Bite Wound', precision: 0.929, recall: 0.920, f1Score: 0.924, datasetSamples: 610 },
  { woundType: 'Pressure Ulcer', precision: 0.892, recall: 0.889, f1Score: 0.890, datasetSamples: 580 }
];

export const LOCAL_BLIP2_LOORA_SIMULATOR = {
  modelName: 'WoundCare-BLIP2-LoRA-v1.4 (OPT-2.7B + ViT-G)',
  weightsSizeMB: 18.4,
  quantization: 'INT8 Edge Tensor',
  avgInferenceLatencyMs: 340,
  architectureNotes: 'ViT-G visual encoder paired with Q-Former query transformer and LoRA adapter layer fine-tuned on 6,400 rural clinical wound photos.'
};
