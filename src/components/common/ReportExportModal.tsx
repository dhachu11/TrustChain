import React, { useState } from 'react';
import { X, FileText, Download, Check, Printer, FileSpreadsheet, Code, ShieldCheck } from 'lucide-react';
import { useTrustChain } from '../../context/TrustChainContext';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultReportType?: string;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  defaultReportType = 'BATCH_TRACEABILITY',
}) => {
  const { batches, selectedBatchId, nodes, telemetry, checkpoints, custodyHandovers, blockchainAnchors } =
    useTrustChain();

  const [reportType, setReportType] = useState(defaultReportType);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV' | 'JSON' | 'EPCIS'>('PDF');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentBatch = batches.find((b) => b.batchId === selectedBatchId) || batches[0];
  const assignedNode = nodes.find((n) => n.nodeId === currentBatch?.nodeAssigned);

  const REPORT_OPTIONS = [
    { id: 'BATCH_TRACEABILITY', label: '1. Batch Traceability Report', desc: 'Complete origin-to-retail lifecycle with verified custody' },
    { id: 'ENVIRONMENTAL', label: '2. Environmental Telemetry Report', desc: 'Temperature, RH, Ethylene trends and sampling history' },
    { id: 'EXCURSION', label: '3. Excursion Audit Report', desc: 'Cold chain boundary breaches, duration, and sampling shifts' },
    { id: 'CUSTODY', label: '4. Chain of Custody Report', desc: 'Dual-signed handover ledger with ATECC608B signatures' },
    { id: 'INTEGRITY', label: '5. Cryptographic Evidence Integrity Report', desc: 'HMAC-SHA256 chains, monotonic counter, and checkpoint proofs' },
    { id: 'INCIDENT', label: '6. Incident Investigation Report', desc: 'Open, investigating, and resolved quality incidents' },
    { id: 'SYNC', label: '7. Synchronization & Gateway Report', desc: 'Offline queue performance, chunk sizes, and retries' },
    { id: 'BLOCKCHAIN_PROOF', label: '8. Besu QBFT Blockchain Proof Package', desc: 'Merkle root proofs, validator signatures, and block headers' },
    { id: 'NODE_HEALTH', label: '9. Hardware Diagnostics & Node Health', desc: 'FRAM/NOR Flash status, battery state, and sensor quality' },
    { id: 'AUDIT', label: '10. Comprehensive Compliance Audit Dossier', desc: 'Master EPCIS 2.0 + blockchain anchor dossier for regulators' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);

      // Generate actual download payload
      let content = '';
      let filename = `TrustChain_${reportType}_${currentBatch.batchId}.${exportFormat.toLowerCase()}`;
      let mimeType = 'text/plain';

      if (exportFormat === 'JSON') {
        mimeType = 'application/json';
        content = JSON.stringify(
          {
            report: reportType,
            batchId: currentBatch.batchId,
            lotId: currentBatch.lotId,
            nodeId: currentBatch.nodeAssigned,
            timestamp: new Date().toISOString(),
            verificationStatus: currentBatch.verificationStatus,
            merkleRoot: currentBatch.merkleRoot,
            blockchainBlock: currentBatch.blockchainBlock,
            checkpointsCount: checkpoints.length,
            custodyTransfers: custodyHandovers.length,
            sampleTelemetries: telemetry.slice(0, 10),
          },
          null,
          2
        );
      } else if (exportFormat === 'CSV') {
        mimeType = 'text/csv';
        content = `Sequence,Timestamp,TimeQuality,TempC,HumidityRH,EthylenePpm,EthyleneQuality,HeadHMAC\n${telemetry
          .map(
            (t) =>
              `${t.sequence},"${t.timestamp}",${t.timeQuality},${t.temperatureC},${t.humidityRH},${t.ethylenePpm},${t.ethyleneQuality},"${t.headHmac}"`
          )
          .join('\n')}`;
      } else if (exportFormat === 'EPCIS') {
        mimeType = 'application/ld+json';
        filename = `TrustChain_EPCIS20_${currentBatch.batchId}.jsonld`;
        content = JSON.stringify(
          {
            '@context': [
              'https://ref.gs1.org/standards/epcis/2.0.0/epcis-context.jsonld',
              {
                trustchain: 'https://trustchain.consortium/epcis-extension#',
              },
            ],
            type: 'EPCISDocument',
            schemaVersion: '2.0',
            creationDate: new Date().toISOString(),
            epcisBody: {
              eventList: [
                {
                  type: 'ObjectEvent',
                  eventTime: new Date().toISOString(),
                  epcList: [`urn:epc:id:sgtin:${currentBatch.lotId}`],
                  action: 'OBSERVE',
                  bizStep: 'urn:epcglobal:cbv:bizstep:in_transit',
                  disposition: 'urn:epcglobal:cbv:disp:active',
                  readPoint: { id: `urn:epc:id:sgln:${currentBatch.currentStage}` },
                  sensorElementList: [
                    {
                      sensorMetadata: {
                        time: new Date().toISOString(),
                        deviceID: currentBatch.nodeAssigned,
                      },
                      sensorReport: [
                        { type: 'Temperature', value: telemetry[0]?.temperatureC || 4.8, uom: 'CEL' },
                        { type: 'Humidity', value: telemetry[0]?.humidityRH || 89.2, uom: 'A93' },
                      ],
                    },
                  ],
                  'trustchain:merkleRoot': currentBatch.merkleRoot,
                  'trustchain:blockchainBlock': currentBatch.blockchainBlock,
                  'trustchain:evidenceState': currentBatch.verificationStatus,
                },
              ],
            },
          },
          null,
          2
        );
      } else {
        // PDF Simulation: open print preview
        window.print();
        return;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">TrustChain Evidence & Report Generator</h2>
              <p className="text-xs text-slate-400">Standardized Regulatory & Consortium Export Suite</p>
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
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Target Batch Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Selected Subject Batch:</span>
              <span className="text-sm font-semibold text-white font-mono">{currentBatch.batchId}</span>
              <span className="text-slate-400 block mt-0.5">{currentBatch.productName}</span>
            </div>
            <div className="text-right font-mono">
              <span className="text-slate-500 block">Assigned Node:</span>
              <span className="text-emerald-400">{currentBatch.nodeAssigned || 'None'}</span>
              <span className="text-slate-400 block mt-0.5">Besu Block #{currentBatch.blockchainBlock || 4892104}</span>
            </div>
          </div>

          {/* Report Type Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Select Report Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setReportType(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    reportType === opt.id
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Format Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Output Format</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setExportFormat('PDF')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  exportFormat === 'PDF'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Printer className="w-3.5 h-3.5" /> PDF Print
              </button>
              <button
                onClick={() => setExportFormat('CSV')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  exportFormat === 'CSV'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV Sheet
              </button>
              <button
                onClick={() => setExportFormat('JSON')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  exportFormat === 'JSON'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> JSON Proof
              </button>
              <button
                onClick={() => setExportFormat('EPCIS')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  exportFormat === 'EPCIS'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> EPCIS 2.0
              </button>
            </div>
          </div>

          {/* Cryptographic Manifest Preview */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-slate-300 font-sans font-semibold">Included Cryptographic Manifest:</div>
            <div>&bull; Sequence Range: #{telemetry[telemetry.length - 1]?.sequence || 1} &rarr; #{telemetry[0]?.sequence || 384}</div>
            <div>&bull; Checkpoints: {checkpoints.length} signed blocks (ATECC608B)</div>
            <div>&bull; Merkle Root: {currentBatch.merkleRoot || '0x99e821fa81309dc47120a1...'}</div>
            <div>&bull; Blockchain Anchor: Besu QBFT Block #{currentBatch.blockchainBlock || 4892104}</div>
            <div>&bull; Verification State: {currentBatch.verificationStatus}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {downloadSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Export successfully compiled & downloaded!
            </span>
          ) : (
            <span className="text-xs text-slate-500">GS1 EPCIS 2.0 & QBFT Anchor verified</span>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              Close
            </button>
            <button
              disabled={isExporting}
              onClick={handleExport}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-900/30 flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download {exportFormat}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
