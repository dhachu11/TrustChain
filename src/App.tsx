import React, { useState } from 'react';
import { TrustChainProvider, useTrustChain } from './context/TrustChainContext';
import { Header } from './components/layout/Header';
import { MobileApp } from './components/mobile/MobileApp';
import { WebDashboard } from './components/web/WebDashboard';
import { HelpGlossaryModal } from './components/common/HelpGlossaryModal';
import { QrScannerModal } from './components/common/QrScannerModal';
import { HandoverWizardModal } from './components/common/HandoverWizardModal';
import { ReportExportModal } from './components/common/ReportExportModal';
import { CalibrationModal } from './components/common/CalibrationModal';
import { AttackSimulatorModal } from './components/common/AttackSimulatorModal';
import { DemoScenariosModal } from './components/common/DemoScenariosModal';
import { NodeQrGeneratorModal } from './components/common/NodeQrGeneratorModal';
import { TrustNode } from './types/trustchain';

function AppContent() {
  const { interfaceMode, nodes, selectedNodeId } = useTrustChain();

  // Modals state
  const [helpOpen, setHelpOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [handoverOpen, setHandoverOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [calibrationOpen, setCalibrationOpen] = useState(false);
  const [attackSimOpen, setAttackSimOpen] = useState(false);
  const [nodeQrOpen, setNodeQrOpen] = useState(false);
  const [selectedQrNode, setSelectedQrNode] = useState<TrustNode | null>(null);

  const handleOpenNodeQr = (node: TrustNode) => {
    setSelectedQrNode(node);
    setNodeQrOpen(true);
  };

  const [showPillars, setShowPillars] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        onOpenHelp={() => setHelpOpen(true)}
        onOpenDemo={() => setDemoOpen(true)}
      />

      {/* Complete App Ecosystem Strip matching UI/UX Guide Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 hidden lg:flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-4 overflow-x-auto text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <strong className="text-white">Sense:</strong> T, H, Ethylene, Tamper
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <strong className="text-white">Secure:</strong> HMAC Chain, ATECC608B
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <strong className="text-white">Store:</strong> FRAM + NOR Flash
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <strong className="text-white">Transfer:</strong> Offline BLE Custody
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <strong className="text-white">Sync:</strong> Resumable Chunks
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <strong className="text-white">Verify:</strong> EPCIS 2.0 &bull; Besu QBFT
          </div>
        </div>

        <div className="flex items-center gap-2 text-emerald-400 font-sans text-[11px]">
          <span className="text-slate-400 font-mono">Principles:</span>
          <span>Role Based Views</span>
          <span>&bull;</span>
          <span>Data Focused</span>
          <span>&bull;</span>
          <span>Trust &amp; Transparency</span>
        </div>
      </div>

      {/* Main Interface Router */}
      <div className="flex-1 flex flex-col">
        {interfaceMode === 'MOBILE' ? (
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70">
            <MobileApp
              onOpenQrScanner={() => setQrOpen(true)}
              onOpenHandover={() => setHandoverOpen(true)}
              onOpenReportExport={() => setReportOpen(true)}
              onOpenCalibration={() => setCalibrationOpen(true)}
              onOpenAttackSim={() => setAttackSimOpen(true)}
              onOpenHelp={() => setHelpOpen(true)}
              onOpenNodeQr={handleOpenNodeQr}
            />
          </div>
        ) : (
          <WebDashboard
            onOpenQrScanner={() => setQrOpen(true)}
            onOpenHandover={() => setHandoverOpen(true)}
            onOpenReportExport={() => setReportOpen(true)}
            onOpenCalibration={() => setCalibrationOpen(true)}
            onOpenAttackSim={() => setAttackSimOpen(true)}
            onOpenHelp={() => setHelpOpen(true)}
            onOpenNodeQr={handleOpenNodeQr}
          />
        )}
      </div>

      {/* Shared Modals */}
      <HelpGlossaryModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <DemoScenariosModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        onOpenHandover={() => setHandoverOpen(true)}
        onOpenAttackSim={() => setAttackSimOpen(true)}
      />
      <QrScannerModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />
      <HandoverWizardModal isOpen={handoverOpen} onClose={() => setHandoverOpen(false)} />
      <ReportExportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
      <CalibrationModal isOpen={calibrationOpen} onClose={() => setCalibrationOpen(false)} />
      <AttackSimulatorModal isOpen={attackSimOpen} onClose={() => setAttackSimOpen(false)} />
      <NodeQrGeneratorModal
        isOpen={nodeQrOpen}
        onClose={() => setNodeQrOpen(false)}
        node={selectedQrNode || nodes.find((n) => n.nodeId === selectedNodeId) || nodes[0]}
      />
    </div>
  );
}

export default function App() {
  return (
    <TrustChainProvider>
      <AppContent />
    </TrustChainProvider>
  );
}
