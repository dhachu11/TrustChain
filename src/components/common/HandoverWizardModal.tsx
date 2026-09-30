import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, CheckCircle2, FileSignature, KeyRound, AlertTriangle } from 'lucide-react';
import { useTrustChain } from '../../context/TrustChainContext';
import { UserRole, SupplyChainStage } from '../../types/trustchain';

interface HandoverWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBatchId?: string;
}

export const HandoverWizardModal: React.FC<HandoverWizardModalProps> = ({
  isOpen,
  onClose,
  defaultBatchId,
}) => {
  const {
    batches,
    nodes,
    telemetry,
    currentUser,
    isInternetOnline,
    executeCustodyHandover,
  } = useTrustChain();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedBatch, setSelectedBatch] = useState<string>(
    defaultBatchId || (batches[0]?.batchId ?? '')
  );
  const [fromParty, setFromParty] = useState('Vikram Mehta (Intermodal Reefer Logistics)');
  const [fromRole, setFromRole] = useState<UserRole>('Transporter');
  const [toParty, setToParty] = useState('Central Heathrow ColdVault Handoff');
  const [toRole, setToRole] = useState<UserRole>('Warehouse');
  const [stage, setStage] = useState<SupplyChainStage>('COLD STORAGE');
  const [locationName, setLocationName] = useState('Heathrow Air Logistics Perishable Facility');

  // Signatures
  const [partyASigned, setPartyASigned] = useState(false);
  const [partyBSigned, setPartyBSigned] = useState(false);

  if (!isOpen) return null;

  const currentBatchObj = batches.find((b) => b.batchId === selectedBatch);
  const assignedNode = nodes.find((n) => n.nodeId === currentBatchObj?.nodeAssigned);
  const currentSeq = telemetry.length > 0 ? telemetry[0].sequence : 384;
  const currentHeadHmac = telemetry.length > 0 ? telemetry[0].headHmac : '0x7e8b91c049f...';

  const handleCompleteHandover = () => {
    executeCustodyHandover({
      batchId: selectedBatch,
      nodeId: currentBatchObj?.nodeAssigned || 'TC-NODE-8821',
      fromParty,
      toParty,
      fromRole,
      toRole,
      stage,
      locationName,
    });
    setStep(6);
  };

  const handleClose = () => {
    setStep(1);
    setPartyASigned(false);
    setPartyBSigned(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Offline Custody Handover</h2>
              <p className="text-xs text-slate-400">
                BLE Mutual Witness & Dual-Signature Evidence Anchor
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Notice banner if offline */}
        {!isInternetOnline && (
          <div className="bg-amber-950/40 border-b border-amber-800/40 px-6 py-2 text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Operating in OFFLINE MODE via direct BLE. Handover will be queued in SQLite for upstream sync.</span>
          </div>
        )}

        {/* Step Progress Indicator */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className={step >= 1 ? 'text-emerald-400 font-semibold' : ''}>1. Batch</span>
            <span>&rarr;</span>
            <span className={step >= 2 ? 'text-emerald-400 font-semibold' : ''}>2. Parties</span>
            <span>&rarr;</span>
            <span className={step >= 3 ? 'text-emerald-400 font-semibold' : ''}>3. Node Proof</span>
            <span>&rarr;</span>
            <span className={step >= 4 ? 'text-emerald-400 font-semibold' : ''}>4. Party A</span>
            <span>&rarr;</span>
            <span className={step >= 5 ? 'text-emerald-400 font-semibold' : ''}>5. Party B</span>
            <span>&rarr;</span>
            <span className={step === 6 ? 'text-emerald-400 font-semibold' : ''}>6. Verified</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          {/* STEP 1: Select Batch */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Batch to Transfer Custody</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {batches.map((b) => (
                    <option key={b.batchId} value={b.batchId}>
                      {b.batchId} — {b.productName} ({b.currentStage})
                    </option>
                  ))}
                </select>
              </div>

              {currentBatchObj && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Product / Lot:</span>
                    <span className="text-white font-medium">{currentBatchObj.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Node:</span>
                    <span className="font-mono text-emerald-400">{currentBatchObj.nodeAssigned || 'Unbound'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Owner:</span>
                    <span className="text-slate-300">{currentBatchObj.currentOwner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Stage:</span>
                    <span className="text-slate-300">{currentBatchObj.currentStage}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                Continue to Step 2 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Parties */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">From Party (Releasing)</label>
                  <input
                    type="text"
                    value={fromParty}
                    onChange={(e) => setFromParty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">From Role</label>
                  <select
                    value={fromRole}
                    onChange={(e) => setFromRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Farmer / Producer">Farmer / Producer</option>
                    <option value="Collection Center">Collection Center</option>
                    <option value="Transporter">Transporter</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Processor">Processor</option>
                    <option value="Distributor">Distributor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">To Party (Receiving)</label>
                  <input
                    type="text"
                    value={toParty}
                    onChange={(e) => setToParty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">To Role</label>
                  <select
                    value={toRole}
                    onChange={(e) => setToRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Collection Center">Collection Center</option>
                    <option value="Transporter">Transporter</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Processor">Processor</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Buyer">Buyer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">New Supply Chain Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as SupplyChainStage)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="COLLECTION">COLLECTION</option>
                    <option value="TRANSPORT">TRANSPORT</option>
                    <option value="COLD STORAGE">COLD STORAGE</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="WAREHOUSE">WAREHOUSE</option>
                    <option value="DISTRIBUTION">DISTRIBUTION</option>
                    <option value="RETAIL">RETAIL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Handoff Location / Facility</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  Confirm Parties &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Node Evidence Head */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-slate-400 font-sans text-xs mb-1 font-semibold text-slate-300">
                  Node Cryptographic State Extraction
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Node:</span>
                  <span className="text-emerald-400 font-semibold">{currentBatchObj?.nodeAssigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Sequence:</span>
                  <span className="text-white">#{currentSeq}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monotonic Counter:</span>
                  <span className="text-white">14,280</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Quality:</span>
                  <span className="text-emerald-400">SIGNED SYNCED</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-500 block mb-1">Current Head HMAC:</span>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-400 break-all text-[11px]">
                    {currentHeadHmac}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                The node has committed and sealed this head hash over BLE GATT. Next, both parties must cryptographically sign.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  Proceed to Signatures &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Party A Signs */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Party A Signature (Releasing Custodian)</span>
                </div>
                <p className="text-xs text-slate-400">
                  {fromParty} ({fromRole}) signs the release of {selectedBatch} at sequence #{currentSeq}.
                </p>

                <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300">
                  Signer: {fromParty}
                  <br />
                  Signature Payload: SHA256(BATCH:{selectedBatch} | SEQ:{currentSeq} | HMAC:{currentHeadHmac.slice(0, 16)})
                </div>

                {partyASigned ? (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Signed successfully with ATECC608B / Passkey (0x44a1b920fe...)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setPartyASigned(true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FileSignature className="w-4 h-4" /> Sign as Party A
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Back
                </button>
                <button
                  disabled={!partyASigned}
                  onClick={() => setStep(5)}
                  className="flex-1 py-2.5 bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  Next: Party B Countersign &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Party B Countersigns */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Party B Countersignature (Receiving Custodian)</span>
                </div>
                <p className="text-xs text-slate-400">
                  {toParty} ({toRole}) verifies the current temperature and physical integrity before accepting custody.
                </p>

                <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300">
                  Counter-Signer: {toParty}
                  <br />
                  Countersignature Payload: ECDSA_P256(SIG_A | WITNESS:GW-BLE-LOCAL)
                </div>

                {partyBSigned ? (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Countersigned successfully (0x99e812ca45...)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setPartyBSigned(true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FileSignature className="w-4 h-4" /> Countersign as Party B
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Back
                </button>
                <button
                  disabled={!partyBSigned}
                  onClick={handleCompleteHandover}
                  className="flex-1 py-2.5 bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-1.5"
                >
                  Finalize Handover
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmed Verified */}
          {step === 6 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">CUSTODY HANDOVER VERIFIED</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Signed custody handover sealed at Sequence #{currentSeq}. Both party signatures are cryptographically bound.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Batch ID:</span>
                  <span className="text-white">{selectedBatch}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Node:</span>
                  <span className="text-emerald-400">{currentBatchObj?.nodeAssigned}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>From:</span>
                  <span className="text-slate-300">{fromParty}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>To:</span>
                  <span className="text-slate-300">{toParty}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Witness Status:</span>
                  <span className="text-emerald-400 font-semibold">{isInternetOnline ? 'VERIFIED' : 'PENDING SYNC (OFFLINE)'}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Close & Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
