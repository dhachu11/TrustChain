import React, { useState } from 'react';
import { X, ShieldAlert, AlertOctagon, CheckCircle2, RefreshCw, Lock, Bug, ArrowRight } from 'lucide-react';
import { useTrustChain } from '../../context/TrustChainContext';

interface AttackSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttackSimulatorModal: React.FC<AttackSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { simulateAttack, activeAttackState, resetAttackState } = useTrustChain();
  const [selectedAttackKey, setSelectedAttackKey] = useState<string>('EDIT_RECORD');
  const [attackOutcome, setAttackOutcome] = useState<{
    attackName: string;
    baselineVulnerability: string;
    trustChainDetection: string;
    status: string;
    evidenceGenerated: string;
  } | null>(null);

  if (!isOpen) return null;

  const ATTACK_VECTORS = [
    {
      id: 'EDIT_RECORD',
      name: '1. Malicious Record Mutation (Tamper with Values)',
      desc: 'Adversary modifies temperature in storage from 12°C down to 4°C to hide cold-chain spoilage.',
    },
    {
      id: 'DELETE_RECORD',
      name: '2. Middle Record Deletion (Gap Attack)',
      desc: 'Adversary deletes rows during high-temperature excursion period to present clean record.',
    },
    {
      id: 'REORDER_RECORDS',
      name: '3. Record Reordering / Permutation',
      desc: 'Adversary swaps timestamps and readings to shuffle excursion into an unmonitored window.',
    },
    {
      id: 'REHASH_CHAIN',
      name: '4. Rehash Entire Chain (Counterfeit HMACs)',
      desc: 'Adversary modifies data and recalculates all hashes using standard software SHA256.',
    },
    {
      id: 'TRUNCATION_ROLLBACK',
      name: '5. Tail Truncation / Rollback Attack',
      desc: 'Adversary lops off the last 50 excursion records and claims the node went dark early.',
    },
    {
      id: 'RESTORE_FLASH',
      name: '6. Flash Image Replay / Cloning Attack',
      desc: 'Adversary flashes an older authentic binary memory dump over SPI NOR Flash.',
    },
    {
      id: 'CLOCK_ROLLBACK',
      name: '7. Clock Rollback / RTC Manipulation',
      desc: 'Adversary sets hardware RTC backward to forge historical timestamps during transit.',
    },
    {
      id: 'SENSOR_RELOCATION',
      name: '8. Physical Sensor Removal / Relocation',
      desc: 'Adversary unmounts node from hot container into a chilled lunchbox.',
    },
  ];

  const handleLaunchAttack = () => {
    const res = simulateAttack(selectedAttackKey);
    setAttackOutcome(res);
  };

  const handleClear = () => {
    resetAttackState();
    setAttackOutcome(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-red-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">TrustChain Integrity Attack Simulator</h2>
              <p className="text-xs text-slate-400">SIH 2026 Adversarial Verification Testing Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Attack Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Select Adversarial Attack Vector
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ATTACK_VECTORS.map((atk) => (
                <button
                  key={atk.id}
                  onClick={() => setSelectedAttackKey(atk.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAttackKey === atk.id
                      ? 'bg-red-500/10 border-red-500/60 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200">{atk.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{atk.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLaunchAttack}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/40 transition-colors flex items-center justify-center gap-2"
            >
              <Bug className="w-4 h-4" /> Execute Attack Injection on Live Chain
            </button>
            {(activeAttackState || attackOutcome) && (
              <button
                onClick={handleClear}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restore Clean Chain
              </button>
            )}
          </div>

          {/* Comparative Baseline vs TrustChain Outcome */}
          {attackOutcome && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Adversarial Defense Result: Baseline IoT vs TrustChain
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Traditional Baseline */}
                <div className="p-4 rounded-xl bg-slate-950 border border-red-900/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400">Baseline IoT / Database</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      SILENT VULNERABILITY
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {attackOutcome.baselineVulnerability}
                  </p>
                  <div className="text-[11px] text-red-300/80 pt-1">
                    Outcome: Fraudulent data successfully accepted without audit trail.
                  </div>
                </div>

                {/* TrustChain Architecture */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/50 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">TrustChain Architecture</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {attackOutcome.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {attackOutcome.trustChainDetection}
                  </p>
                  <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] font-mono text-emerald-400 break-all border border-slate-800">
                    {attackOutcome.evidenceGenerated}
                  </div>
                </div>
              </div>

              {/* Mechanism explanation */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <span className="text-slate-300 font-semibold block">How TrustChain Prevented This:</span>
                <p>
                  Because the private key never leaves the ATECC608B hardware element, HMACs cannot be forged. The
                  monotonic counter detects rollback, and the Besu QBFT blockchain anchor prevents rewriting history.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Status: ATECC608B Active &bull; Besu QBFT Validator</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
