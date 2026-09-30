import React from 'react';
import { X, HelpCircle, Shield, Link2, Clock, Cpu, Database, Eye } from 'lucide-react';

interface HelpGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGlossaryModal: React.FC<HelpGlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const GLOSSARY_ITEMS = [
    {
      term: 'HMAC-SHA256 Chaining',
      tag: 'Cryptographic Integrity',
      icon: Shield,
      summary:
        'Every telemetry record embeds the cryptographic hash (HMAC) of the immediately preceding record, forming an unbroken chain. Any back-dated modification, record omission, or permutation breaks the mathematical link.',
    },
    {
      term: 'Monotonic Hardware Counter',
      tag: 'Anti-Rollback Protection',
      icon: Cpu,
      summary:
        'A dedicated write-only counter inside the ATECC608B secure hardware element that increments with every committed record. Unlike flash storage, it cannot be wound backwards, making silent rollback attacks mathematically impossible.',
    },
    {
      term: 'Signed Checkpoint (Every 32 Records)',
      tag: 'Batched Provenance',
      icon: Link2,
      summary:
        'At regular intervals (e.g. 32 readings or on tamper events), the node summarizes the chain into a cryptographic checkpoint signed by the private key sealed inside the tamper-resistant hardware element.',
    },
    {
      term: 'Time Quality (Sequence-First Ordering)',
      tag: 'Temporal Integrity',
      icon: Clock,
      summary:
        'Physical clocks can drift or experience reset during cold storage. TrustChain uses sequence number as the primary ordering key, accompanied by signed TimeQuality states: SYNCED, DRIFTING, or RESET. Reconstructed timestamps are visibly marked.',
    },
    {
      term: 'Besu QBFT Private Consortium Blockchain',
      tag: 'Enterprise Settlement',
      icon: Database,
      summary:
        'An enterprise Ethereum-compatible consortium blockchain utilizing Istanbul Byzantine Fault Tolerant (QBFT) consensus. High-volume raw telemetry stays securely off-chain; only cryptographic Merkle roots and custody signatures are anchored on-chain.',
    },
    {
      term: 'Offline Gateway Queue (SQLite)',
      tag: 'Rural & In-Transit Resilience',
      icon: Eye,
      summary:
        'When operating in remote orchards or deep refrigerated sea containers with no cellular network, the gateway operates in Offline Mode over BLE, queuing signed witness receipts and telemetry in an offline SQLite store for resumable sync.',
    },
    {
      term: 'EPCIS 2.0 Representation',
      tag: 'Supply Chain Standard',
      icon: Link2,
      summary:
        'The GS1 international standard for supply chain visibility. While the embedded node uses ultra-compact CBOR binary encoding, the backend dynamically produces standard EPCIS 2.0 JSON-LD events with cryptographic proof extensions.',
    },
    {
      term: 'Ethylene Trend & Threshold Monitoring',
      tag: 'Sensing Discipline',
      icon: Cpu,
      summary:
        'Ethylene indicates climacteric fruit ripening (e.g. Alphonso mangoes). In adherence to engineering rigor, ethylene is displayed as trend and threshold indicators with quality flags (WARMUP, OK, DRIFT_SUSPECT) until formal calibration.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">TrustChain Architecture Glossary</h2>
              <p className="text-xs text-slate-400">What do these cryptographic concepts mean?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {GLOSSARY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-sm text-slate-200">{item.term}</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400/90">{item.tag}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.summary}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Frozen Architecture Spec: SIH 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
