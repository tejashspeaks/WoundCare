import React from 'react';
import { RESEARCH_METRICS, LOCAL_BLIP2_LOORA_SIMULATOR } from '../data/sampleCases';
import { Sparkles, Cpu, Layers, BarChart2, Zap, CheckCircle2, Server, Database, Shield } from 'lucide-react';

interface ModelArchitectureAndMetricsProps {
  highContrast: boolean;
}

export const ModelArchitectureAndMetrics: React.FC<ModelArchitectureAndMetricsProps> = ({ highContrast }) => {
  return (
    <div className={`p-6 rounded-[28px] border space-y-6 ${
      highContrast ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-[#e2dfd5] text-[#2c2c2c] shadow-sm'
    }`}>
      
      {/* Title Header */}
      <div className="border-b border-[#e2dfd5] pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#5A5A40]" />
          <h2 className="text-xl font-serif font-bold text-[#5A5A40]">BLIP-2 LoRA Fine-Tuned VLM Architecture</h2>
        </div>
        <p className="text-xs text-[#8e8b82] mt-0.5">
          Deep learning model breakdown, parameter efficiency, and benchmark evaluation across 6,400 rural South Asian clinical wound images.
        </p>
      </div>

      {/* Pipeline Diagram Cards */}
      <div>
        <h3 className="text-sm font-serif font-bold text-[#5A5A40] mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5A5A40]" />
          <span>VLM Architecture Fusion Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Step 1: ViT-G */}
          <div className="p-4 rounded-2xl border bg-[#fdfcfb] border-[#e2dfd5] flex flex-col justify-between space-y-2 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block">Stage 1: Visual Encoder</span>
              <h4 className="text-base font-serif font-bold text-[#2c2c2c] mt-1">ViT-G / 14</h4>
              <p className="text-xs text-[#8e8b82] mt-1 leading-relaxed">
                Breaks 224x224 wound photo into 16x16 pixel patches. Extracts 1,400M parameters worth of high-level visual features (granulation, erythema, edema).
              </p>
            </div>
            <div className="pt-2 border-t border-[#e2dfd5] text-[11px] text-[#5A5A40] font-mono">
              Output: [257, 1408] patch vectors
            </div>
          </div>

          {/* Step 2: Q-Former */}
          <div className="p-4 rounded-2xl border bg-[#fdfcfb] border-[#e2dfd5] flex flex-col justify-between space-y-2 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-[#f57f17] uppercase tracking-wider block">Stage 2: Query Transformer</span>
              <h4 className="text-base font-serif font-bold text-[#2c2c2c] mt-1">Q-Former Bridge</h4>
              <p className="text-xs text-[#8e8b82] mt-1 leading-relaxed">
                32 learnable query tokens query the ViT-G features to extract cross-attention visual semantics and align them with language representations.
              </p>
            </div>
            <div className="pt-2 border-t border-[#e2dfd5] text-[11px] text-[#5A5A40] font-mono">
              Output: [32, 768] query embeddings
            </div>
          </div>

          {/* Step 3: OPT-2.7B + LoRA */}
          <div className="p-4 rounded-2xl border bg-[#fdfcfb] border-[#e2dfd5] flex flex-col justify-between space-y-2 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-[#2e7d32] uppercase tracking-wider block">Stage 3: Language Decoder</span>
              <h4 className="text-base font-serif font-bold text-[#2c2c2c] mt-1">OPT-2.7B + LoRA</h4>
              <p className="text-xs text-[#8e8b82] mt-1 leading-relaxed">
                Generates clinical triage, wound classification, severity grading, and step-by-step first aid in English, Hindi, and Tamil.
              </p>
            </div>
            <div className="pt-2 border-t border-[#e2dfd5] text-[11px] text-[#2e7d32] font-mono font-bold">
              Adapter Size: 18.4 MB (r=16, α=32)
            </div>
          </div>

          {/* Step 4: Multilingual Triage */}
          <div className="p-4 rounded-2xl border bg-[#fdfcfb] border-[#e2dfd5] flex flex-col justify-between space-y-2 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-[#c62828] uppercase tracking-wider block">Stage 4: Edge Deployment</span>
              <h4 className="text-base font-serif font-bold text-[#2c2c2c] mt-1">INT8 Edge VLM</h4>
              <p className="text-xs text-[#8e8b82] mt-1 leading-relaxed">
                Quantized for offline execution on standard smartphones or field laptops in rural clinics with 0 internet connection.
              </p>
            </div>
            <div className="pt-2 border-t border-[#e2dfd5] text-[11px] text-[#c62828] font-mono font-bold">
              Latency: ~340ms per scan
            </div>
          </div>

        </div>
      </div>

      {/* Model Performance Metrics Table */}
      <div>
        <h3 className="text-sm font-serif font-bold text-[#5A5A40] mb-3 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#2e7d32]" />
          <span>Wound Classification Performance Benchmarks</span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-[#e2dfd5] shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0ede4] text-[#5A5A40] font-bold uppercase text-[10px] border-b border-[#e2dfd5]">
              <tr>
                <th className="py-3 px-4">Wound Class</th>
                <th className="py-3 px-4">Dataset Size</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">Triage Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2dfd5] bg-[#fdfcfb] text-[#2c2c2c]">
              {RESEARCH_METRICS.map((row) => (
                <tr key={row.woundType} className="hover:bg-[#f0ede4]/50 transition">
                  <td className="py-3 px-4 font-bold text-[#2c2c2c] flex items-center gap-1.5 font-serif">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
                    <span>{row.woundType}</span>
                  </td>
                  <td className="py-3 px-4 text-[#8e8b82] font-mono">{row.datasetSamples} images</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#1565c0]">{(row.precision * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#f57f17]">{(row.recall * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#2e7d32]">{(row.f1Score * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-[#e2dfd5] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2e7d32] h-full rounded-full"
                        style={{ width: `${row.f1Score * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fine-Tuning Stats & Hardware Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* LoRA Training Hyperparameters */}
        <div className="p-5 rounded-2xl border bg-[#fdfcfb] border-[#e2dfd5] space-y-3">
          <h4 className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#5A5A40]" />
            <span>LoRA Hyperparameters (PEFT)</span>
          </h4>
          <ul className="text-xs space-y-2 text-[#2c2c2c] font-mono">
            <li className="flex justify-between border-b border-[#e2dfd5] pb-1.5">
              <span className="text-[#8e8b82]">LoRA Rank (r):</span>
              <span className="font-bold text-[#2c2c2c]">16</span>
            </li>
            <li className="flex justify-between border-b border-[#e2dfd5] pb-1.5">
              <span className="text-[#8e8b82]">LoRA Alpha (α):</span>
              <span className="font-bold text-[#2c2c2c]">32</span>
            </li>
            <li className="flex justify-between border-b border-[#e2dfd5] pb-1.5">
              <span className="text-[#8e8b82]">Target Modules:</span>
              <span className="font-bold text-[#2c2c2c]">q_proj, v_proj</span>
            </li>
            <li className="flex justify-between border-b border-[#e2dfd5] pb-1.5">
              <span className="text-[#8e8b82]">Learning Rate:</span>
              <span className="font-bold text-[#2c2c2c]">2e-4 (Cosine Decay)</span>
            </li>
            <li className="flex justify-between border-b border-[#e2dfd5] pb-1.5">
              <span className="text-[#8e8b82]">Batch Size:</span>
              <span className="font-bold text-[#2c2c2c]">16 (Grad Accum 4)</span>
            </li>
            <li className="flex justify-between">
              <span className="text-[#8e8b82]">Training HW:</span>
              <span className="font-bold text-[#5A5A40]">NVIDIA T4 GPU (16GB)</span>
            </li>
          </ul>
        </div>

        {/* Latency & Hardware Benchmarks */}
        <div className="p-5 rounded-2xl border bg-[#fdfcfb] border-[#e2dfd5] space-y-3">
          <h4 className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#5A5A40]" />
            <span>Execution Latency Comparison</span>
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#f0ede4] border border-[#e2dfd5]">
              <div className="flex justify-between font-bold text-[#2c2c2c]">
                <span>Gemini 3.6 Flash VLM (Cloud)</span>
                <span className="text-[#1565c0] font-mono">280 - 450 ms</span>
              </div>
              <p className="text-[11px] text-[#8e8b82] mt-1">High accuracy, requires active internet connectivity.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f0ede4] border border-[#e2dfd5]">
              <div className="flex justify-between font-bold text-[#2c2c2c]">
                <span>BLIP-2 OPT-2.7B LoRA (On-Device INT8)</span>
                <span className="text-[#2e7d32] font-mono">340 - 510 ms</span>
              </div>
              <p className="text-[11px] text-[#8e8b82] mt-1">100% offline edge execution, zero internet required.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
