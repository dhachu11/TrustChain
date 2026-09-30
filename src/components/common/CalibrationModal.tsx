import React, { useState } from 'react';
import { X, Wrench, CheckCircle2, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { useTrustChain } from '../../context/TrustChainContext';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ isOpen, onClose }) => {
  const { calibrateEthyleneSensor, selectedNodeId, currentUser } = useTrustChain();

  const [operator, setOperator] = useState(currentUser.name);
  const [zeroReading, setZeroReading] = useState(0.02);
  const [spanGasTarget, setSpanGasTarget] = useState(5.0);
  const [spanGasMeasured, setSpanGasMeasured] = useState(4.94);
  const [step, setStep] = useState<'ZERO' | 'SPAN' | 'COMPLETE'>('ZERO');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleRunZeroCal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setZeroReading(0.01);
      setStep('SPAN');
    }, 1000);
  };

  const handleRunSpanCal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSpanGasMeasured(5.0);
      calibrateEthyleneSensor(operator, 0.01, 5.0);
      setStep('COMPLETE');
    }, 1000);
  };

  const handleDone = () => {
    setStep('ZERO');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Ethylene Sensor Calibration</h2>
              <p className="text-xs text-slate-400">Electrochemical Cell Zero & Span Calibration Wizard</p>
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
        <div className="p-6 space-y-5">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="text-slate-300 font-semibold">Architectural Calibration Standard:</div>
            <p>
              Ethylene is treated as a Tier-2 ripening trend indicator. It requires clean-air zeroing and span checking
              before lab-grade ppm certification.
            </p>
          </div>

          {step === 'ZERO' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Node ID</label>
                  <input
                    type="text"
                    disabled
                    value={selectedNodeId}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Certified Calibration Operator</label>
                  <input
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-slate-200">Phase 1: Clean-Air Zero Baseline</div>
                <p className="text-slate-400">
                  Ensure the node is placed in pure hydrocarbon-free zero air for at least 5 minutes.
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-500">Current Cell Offset:</span>
                  <span className="font-mono text-white">{zeroReading} ppm</span>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleRunZeroCal}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Sampling Zero Gas Chamber...' : 'Execute Clean-Air Zero Calibration &rarr;'}
              </button>
            </div>
          )}

          {step === 'SPAN' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                <div className="font-semibold text-slate-200">Phase 2: Span Gas Response Check</div>
                <p className="text-slate-400">
                  Apply certified reference canister (5.00 ppm C₂H₄ in N₂) at 500 mL/min flow rate.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 block mb-1">Target Reference:</span>
                    <input
                      type="number"
                      value={spanGasTarget}
                      onChange={(e) => setSpanGasTarget(parseFloat(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Sensor Reading:</span>
                    <input
                      type="number"
                      value={spanGasMeasured}
                      onChange={(e) => setSpanGasMeasured(parseFloat(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleRunSpanCal}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Verifying Span Slope...' : 'Commit Span Calibration & Reset Drift Flag'}
              </button>
            </div>
          )}

          {step === 'COMPLETE' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Calibration Committed Successfully</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Node {selectedNodeId} electrochemical cell calibrated. Drift flag cleared. Next routine check scheduled
                  in 90 days.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs font-mono text-slate-300 space-y-1">
                <div>Zero Baseline: 0.01 ppm</div>
                <div>Span Reference: 5.00 ppm (Gain 1.012)</div>
                <div>Gas Quality State: OK (No drift detected)</div>
                <div>Signed Operator: {operator}</div>
              </div>

              <button
                onClick={handleDone}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Finish & Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
