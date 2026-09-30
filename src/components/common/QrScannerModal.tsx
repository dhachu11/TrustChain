import React, { useState } from 'react';
import { X, QrCode, Camera, ShieldCheck, Check, AlertCircle, Bluetooth, Cpu } from 'lucide-react';
import { useTrustChain } from '../../context/TrustChainContext';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: (nodeId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onActivated }) => {
  const { activateNode, nodes } = useTrustChain();
  const [nodeId, setNodeId] = useState('TC-NODE-5520');
  const [nodeAlias, setNodeAlias] = useState('Transit Reefer Gamma #3');
  const [activationToken, setActivationToken] = useState('ACT-5520-KEY-VALID');
  const [org, setOrg] = useState('Apex AgriLogistics Consortium');
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState<'SCAN' | 'AUTHENTICATE' | 'SUCCESS'>('SCAN');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setNodeId('TC-NODE-7730');
      setNodeAlias('ColdVault Portable Sensor 7');
      setActivationToken('ACT-7730-KEY-VALID');
      setStep('AUTHENTICATE');
    }, 800);
  };

  const handleConfirmActivation = () => {
    if (!activationToken.startsWith('ACT-')) {
      setErrorMsg('Invalid token format. Must be a signed one-time token starting with ACT-');
      return;
    }

    const success = activateNode(nodeId, nodeAlias, activationToken, org);
    if (success) {
      setStep('SUCCESS');
      if (onActivated) onActivated(nodeId);
    } else {
      setErrorMsg('Node activation failed. Cryptographic signature invalid.');
    }
  };

  const handleReset = () => {
    setStep('SCAN');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">TrustChain Node Activation</h2>
              <p className="text-xs text-slate-400">QR Pairing & ATECC608B Mutual Authentication</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {step === 'SCAN' && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                {isScanning ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-emerald-400">Reading optical QR payload...</p>
                  </div>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-slate-600 mb-2" />
                    <p className="text-sm font-medium text-slate-300">Point Gateway Camera at Node QR Code</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Payload encodes Node ID and hardware-signed one-time activation token.
                    </p>
                    <button
                      onClick={handleSimulateScan}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
                    >
                      Simulate Optical QR Scan
                    </button>
                  </>
                )}
              </div>

              <div className="relative flex items-center justify-center">
                <span className="text-xs text-slate-500 bg-slate-900 px-3">or manual token input</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Node ID</label>
                  <input
                    type="text"
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. TC-NODE-5520"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">One-Time Activation Token</label>
                  <input
                    type="text"
                    value={activationToken}
                    onChange={(e) => setActivationToken(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                    placeholder="ACT-XXXX-KEY-VALID"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep('AUTHENTICATE')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              >
                Proceed to Authentication
              </button>
            </div>
          )}

          {step === 'AUTHENTICATE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Detected Node:</span>
                  <span className="font-mono text-white font-medium">{nodeId}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Activation Token:</span>
                  <span className="font-mono text-emerald-400">{activationToken}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Security Element:</span>
                  <span className="text-slate-300 font-mono">ATECC608B (ECDSA secp256r1)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Storage Architecture:</span>
                  <span className="text-slate-300 font-mono">FRAM 64KB + NOR Flash 16MB</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assign Node Alias / Friendly Name</label>
                <input
                  type="text"
                  value={nodeAlias}
                  onChange={(e) => setNodeAlias(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Nashik Reefer Reefer Unit 4"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization / Consortium Member</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep('SCAN')}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmActivation}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-900/30 transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Activate Node
                </button>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Node Successfully Activated</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {nodeId} ({nodeAlias}) is now authenticated, connected over BLE GATT, and ready for batch binding.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs font-mono text-slate-300 space-y-1">
                <div>Public Key Fingerprint: 04:B2:99:A1:7E:62...</div>
                <div>Monotonic Counter Genesis: 1</div>
                <div>Time Anchor: Signed SYNCED</div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
