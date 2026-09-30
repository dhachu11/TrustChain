import React from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, WifiOff, FileSignature } from 'lucide-react';
import { useTrustChain } from '../../context/TrustChainContext';

interface DemoScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHandover: () => void;
  onOpenAttackSim: () => void;
}

export const DemoScenariosModal: React.FC<DemoScenariosModalProps> = ({
  isOpen,
  onClose,
  onOpenHandover,
  onOpenAttackSim,
}) => {
  const { loadDemoScenario } = useTrustChain();

  if (!isOpen) return null;

  const SCENARIOS = [
    {
      id: 'nominal' as const,
      title: 'Scenario 1: Nominal Cold Chain (Golden Path)',
      desc: 'Nashik Organic Mangoes in reefer transit to London. All 384 sequence HMAC chains match ATECC608B signatures and Besu QBFT Block #4892104.',
      badge: '100% VERIFIED',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      action: () => {
        loadDemoScenario('nominal');
        onClose();
      },
    },
    {
      id: 'excursion' as const,
      title: 'Scenario 2: Refrigeration Excursion Event',
      desc: 'Ambient reefer temperature jumps from 4.8°C to 11.8°C. ATECC608B event triggers automatic rate switch from 5 min to 1 min sampling and emits signed alert.',
      badge: 'RATE SWITCHED (1 MIN)',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      action: () => {
        loadDemoScenario('excursion');
        onClose();
      },
    },
    {
      id: 'tamper' as const,
      title: 'Scenario 3: Container Physical Tamper (Lid Opened)',
      desc: 'Microswitch seal broken in transit (TAMPER_LID). Accelerometer reports shock impulse. Immediate emergency checkpoint signed by hardware root of trust.',
      badge: 'TAMPER_LID FIRED',
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      action: () => {
        loadDemoScenario('tamper');
        onClose();
      },
    },
    {
      id: 'offline_sync' as const,
      title: 'Scenario 4: Offline Rural Gateway & SQLite Queue',
      desc: 'No cellular connection in remote orchard. Gateway switches to Offline Mode over BLE, queuing signed witness receipts in local SQLite for resumable sync.',
      badge: 'OFFLINE SQLITE ACTIVE',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      action: () => {
        loadDemoScenario('offline_sync');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">SIH Demo Scenarios</h2>
              <p className="text-xs text-slate-400">Rapid Evaluation Presets for Smart India Hackathon</p>
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
        <div className="p-6 space-y-3 overflow-y-auto max-h-[75vh]">
          {SCENARIOS.map((scen) => (
            <div
              key={scen.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xs font-bold text-white">{scen.title}</h3>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${scen.badgeColor}`}>
                    {scen.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{scen.desc}</p>
              </div>
              <button
                onClick={scen.action}
                className="self-end px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Load Scenario &rarr;
              </button>
            </div>
          ))}

          {/* Interactive Flow shortcuts */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenHandover();
              }}
              className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                <FileSignature className="w-4 h-4 text-emerald-400" />
                <span>Test Offline Handover</span>
              </div>
              <p className="text-[11px] text-slate-500">Dual-signature BLE custody transfer wizard</p>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAttackSim();
              }}
              className="p-3 bg-slate-950 border border-slate-800 hover:border-red-500/50 rounded-xl text-left transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Attack Simulator</span>
              </div>
              <p className="text-[11px] text-slate-500">Simulate 8 cryptographic attack vectors</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
