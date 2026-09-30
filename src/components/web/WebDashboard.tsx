import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Activity,
  Cpu,
  ArrowRightLeft,
  AlertTriangle,
  ShieldCheck,
  Database,
  FileText,
  FileCode,
  History,
  Settings,
  Search,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Plus,
  ExternalLink,
  Flame,
  Thermometer,
  Droplets,
  Clock,
  ShieldAlert,
  ChevronRight,
  Filter,
  Check,
  X,
  Printer,
  Sparkles,
  Link,
  Bug,
  QrCode,
  Truck,
  Box,
  MapPin,
  Calendar,
  Battery,
  User,
  Users,
  Sliders,
  HelpCircle,
  Video,
  Download,
} from 'lucide-react';
import { useTrustChain } from '../../context/TrustChainContext';
import { SensorDeviceSvg } from '../common/SensorDeviceSvg';
import { TrustChainLogo } from '../common/TrustChainLogo';
import { SupplyChainStage, VerificationState, UserRole } from '../../types/trustchain';

interface WebDashboardProps {
  onOpenQrScanner: () => void;
  onOpenHandover: () => void;
  onOpenReportExport: () => void;
  onOpenCalibration: () => void;
  onOpenAttackSim: () => void;
  onOpenHelp: () => void;
  onOpenNodeQr?: (node: any) => void;
}

export type WebScreenMode =
  | '1_OVERVIEW'
  | '2_JOURNEY'
  | '3_NODE_DETAILS'
  | '4_BLOCKCHAIN'
  | 'EXTRA_SCREENS';

export const WebDashboard: React.FC<WebDashboardProps> = ({
  onOpenQrScanner,
  onOpenHandover,
  onOpenReportExport,
  onOpenCalibration,
  onOpenAttackSim,
  onOpenHelp,
  onOpenNodeQr,
}) => {
  const {
    currentUser,
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    batches,
    selectedBatchId,
    setSelectedBatchId,
    telemetry,
    incidents,
    alerts,
    blockchainAnchors,
    epcisEvents,
    auditLogs,
    diagnostics,
    runDiagnostics,
    isDiagnosing,
    verifyBatchEvidence,
    replaceNode,
    createBatch,
  } = useTrustChain();

  const [activeWebScreen, setActiveWebScreen] = useState<WebScreenMode>('1_OVERVIEW');
  const [activeExtraTab, setActiveExtraTab] = useState<number>(1);
  const [journeyTab, setJourneyTab] = useState<
    'ENVIRONMENTAL' | 'CUSTODY' | 'EVENTS' | 'BLOCKCHAIN' | 'EPCIS'
  >('ENVIRONMENTAL');
  const [nodeDetailsTab, setNodeDetailsTab] = useState<
    'LIVE_DATA' | 'EVENTS' | 'CHECKPOINTS' | 'DIAGNOSTICS' | 'SETTINGS'
  >('LIVE_DATA');
  const [timeFilter, setTimeFilter] = useState<'1H' | '6H' | '24H' | '7D' | 'CUSTOM'>('24H');
  const [searchQuery, setSearchQuery] = useState('');

  // Extra screen form states
  const [newBatchName, setNewBatchName] = useState('Tomato');
  const [newBatchQty, setNewBatchQty] = useState('500 kg');
  const [newBatchSource, setNewBatchSource] = useState('Green Valley Farms');
  const [batchCreatedSuccess, setBatchCreatedSuccess] = useState(false);

  // Node replacement states
  const [replaceNewNodeId, setReplaceNewNodeId] = useState('TC-005-X7D1');
  const [replacementSuccess, setReplacementSuccess] = useState(false);

  const activeBatch = batches.find((b) => b.batchId === selectedBatchId) || batches[0];
  const activeNode = nodes.find((n) => n.nodeId === selectedNodeId) || nodes[0];
  const verification = verifyBatchEvidence(activeBatch?.batchId || '');

  const STAGES_TIMELINE = [
    { name: 'Farm', date: '29 Sep 08:00', icon: Box, current: false },
    { name: 'Transport', date: '29 Sep 14:20', icon: Truck, current: true },
    { name: 'Cold Storage', date: '30 Sep 02:10', icon: Box, current: false },
    { name: 'Processing', date: '30 Sep 12:00', icon: Activity, current: false },
    { name: 'Warehouse', date: '01 Oct 08:30', icon: Box, current: false },
    { name: 'Retail', date: '02 Oct 11:00', icon: ShieldCheck, current: false },
  ];

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    createBatch({
      productName: `${newBatchName} (Fresh Produce)`,
      quantity: newBatchQty,
      sourceOrigin: newBatchSource,
      nodeAssigned: activeNode.nodeId,
    });
    setBatchCreatedSuccess(true);
    setTimeout(() => setBatchCreatedSuccess(false), 3000);
  };

  const handleExecuteNodeReplacement = () => {
    replaceNode(activeNode.nodeId, replaceNewNodeId, 'Upgraded High-Yield ColdChain Node');
    setReplacementSuccess(true);
    setTimeout(() => setReplacementSuccess(false), 3000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* 260px Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Platform Info */}
          <div className="px-2">
            <TrustChainLogo size="md" />
            <div className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Consortium Node: Besu QBFT</span>
            </div>
          </div>

          {/* Web Dashboard Core Views (1 to 4 matching UI Guide) */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Core Dashboard Views
            </div>

            <button
              onClick={() => setActiveWebScreen('1_OVERVIEW')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeWebScreen === '1_OVERVIEW'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>1. Overview Dashboard</span>
            </button>

            <button
              onClick={() => setActiveWebScreen('2_JOURNEY')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeWebScreen === '2_JOURNEY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. Batch Journey &amp; Trace</span>
            </button>

            <button
              onClick={() => setActiveWebScreen('3_NODE_DETAILS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeWebScreen === '3_NODE_DETAILS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>3. Node Details (3D Sensor)</span>
            </button>

            <button
              onClick={() => setActiveWebScreen('4_BLOCKCHAIN')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeWebScreen === '4_BLOCKCHAIN'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>4. Blockchain &amp; Verify</span>
            </button>
          </div>

          {/* Additional Important Screens (A to Z) */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Additional Screens (A to Z)
            </div>

            <button
              onClick={() => {
                setActiveWebScreen('EXTRA_SCREENS');
                setActiveExtraTab(1);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeWebScreen === 'EXTRA_SCREENS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4" />
                <span>10 Additional Screens</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                A-Z
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-900 space-y-2">
          <button
            onClick={onOpenAttackSim}
            className="w-full px-3 py-2 bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 rounded-xl text-xs font-semibold text-red-300 flex items-center gap-2 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Attack Simulator</span>
          </button>
          <div className="text-[10px] font-mono text-slate-600 text-center">
            TrustChain Consortium UI v1.4
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto">
        {/* Top Search Bar & Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Batch, Node, Date..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">Admin (Consortium)</span>
            </div>
            <button
              onClick={() => onOpenNodeQr && onOpenNodeQr(activeNode)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" /> Identity QR Tag
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WEB SCREEN 1: OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeWebScreen === '1_OVERVIEW' && (
          <div className="space-y-6">
            {/* 8 Stat Cards Strip matching UI Guide */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Box className="w-4 h-4 text-emerald-400" />
                  <span>Active Batches</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">128</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Active Nodes</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">96</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>In Transit</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">12</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Alerts</span>
                </div>
                <div className="text-2xl font-bold font-mono text-red-400 tabular-nums">
                  8 <span className="text-xs font-normal text-slate-400">(2 Critical)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  <span>Avg. Temperature</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">24.8 °C</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Avg. Humidity</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">68 %</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Avg. Ethylene</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">0.42 ppm</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Data Integrity</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">99.7 %</div>
              </div>
            </div>

            {/* Farm-to-Fork Horizontal Map & Recent Alerts Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Horizontal Map Graphic (2 cols) */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Farm-to-Fork Active Route &bull; Batch #BF-2026-001</span>
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">En Route to Cold Storage</span>
                </div>

                {/* Styled Map Graphic Route */}
                <div className="relative py-8 px-4 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Route Line */}
                  <div className="relative flex items-center justify-between z-10">
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 z-0" />
                    <div className="absolute top-1/2 left-4 w-1/3 h-1 bg-emerald-500 -translate-y-1/2 z-0" />

                    {[
                      { name: 'Farm', status: 'Passed' },
                      { name: 'Transport', status: 'Current' },
                      { name: 'Cold Storage', status: 'Next' },
                      { name: 'Processing', status: 'Pending' },
                      { name: 'Warehouse', status: 'Pending' },
                      { name: 'Retail', status: 'Pending' },
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 z-10">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono border-2 ${
                            step.status === 'Current'
                              ? 'bg-emerald-500 text-slate-950 border-white shadow-lg shadow-emerald-500/50 animate-pulse'
                              : step.status === 'Passed'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-semibold ${
                            step.status === 'Current' ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {step.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <span>Current Custodian: <strong className="text-white">CoolTrans Logistics</strong></span>
                  <span>Vehicle: <strong className="text-white font-mono">MH-15-TC-4401</strong></span>
                  <span>Monitored by Node: <strong className="text-emerald-400 font-mono">TC-001-A3F2</strong></span>
                </div>
              </div>

              {/* Recent Alerts (1 col) matching Web Screen 1 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Recent Alerts
                  </h3>
                  <button
                    onClick={() => {
                      setActiveWebScreen('EXTRA_SCREENS');
                      setActiveExtraTab(3);
                    }}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    View All &gt;
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div>
                        <div className="font-semibold text-white">Temperature Excursion</div>
                        <div className="text-[10px] text-slate-400 font-mono">BF-2026-001</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">10:24 AM</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div>
                        <div className="font-semibold text-white">Ethylene Threshold</div>
                        <div className="text-[10px] text-slate-400 font-mono">BF-2026-002</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">09:41 AM</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div>
                        <div className="font-semibold text-white">Tamper Event</div>
                        <div className="text-[10px] text-slate-400 font-mono">BF-2026-003</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">08:12 AM</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <div>
                        <div className="font-semibold text-white">Sync Failure</div>
                        <div className="text-[10px] text-slate-400 font-mono">BF-2026-004</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">07:20 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* WEB SCREEN 2: BATCH JOURNEY & TRACEABILITY */}
        {/* ========================================================================= */}
        {activeWebScreen === '2_JOURNEY' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white font-mono">Batch #BF-2026-001</h2>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              {/* Time Filters */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
                {(['1H', '6H', '24H', '7D', 'CUSTOM'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      timeFilter === t ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 6 Stage Timeline matching Web Screen 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {STAGES_TIMELINE.map((st, i) => {
                  const Icon = st.icon;
                  return (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border text-center space-y-1.5 ${
                        st.current
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mx-auto ${st.current ? 'text-emerald-400' : 'text-slate-500'}`}
                      />
                      <div className="text-xs font-bold text-slate-200">{st.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{st.date}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Tabs: Environmental Data, Custody Chain, Events, Blockchain, EPCIS */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
              {(
                [
                  { id: 'ENVIRONMENTAL', label: 'Environmental Data' },
                  { id: 'CUSTODY', label: 'Custody Chain' },
                  { id: 'EVENTS', label: 'Events' },
                  { id: 'BLOCKCHAIN', label: 'Blockchain' },
                  { id: 'EPCIS', label: 'EPCIS' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setJourneyTab(tab.id)}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    journeyTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic Content based on journeyTab */}
            {journeyTab === 'ENVIRONMENTAL' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Temperature Graph */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Temperature (°C)</span>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[11px] font-bold">
                      Peak: 28.4 °C
                    </span>
                  </div>
                  <div className="h-28 w-full flex items-end gap-1.5 pt-4">
                    {[20, 22, 24, 25, 28.4, 26, 25, 24.8].map((v, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div
                          style={{ height: `${(v / 35) * 100}%` }}
                          className={`w-full rounded-t ${
                            v > 26 ? 'bg-red-500 shadow-sm shadow-red-500/50' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>29 Sep</span>
                    <span>30 Sep</span>
                    <span>01 Oct</span>
                  </div>
                </div>

                {/* Humidity Graph */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Humidity (%)</span>
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[11px] font-bold">
                      Target: 72%
                    </span>
                  </div>
                  <div className="h-28 w-full flex items-end gap-1.5 pt-4">
                    {[65, 68, 70, 72, 71, 69, 68, 68].map((v, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div
                          style={{ height: `${(v / 100) * 100}%` }}
                          className="w-full rounded-t bg-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>29 Sep</span>
                    <span>30 Sep</span>
                    <span>01 Oct</span>
                  </div>
                </div>

                {/* Ethylene Graph */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Ethylene (ppm)</span>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[11px] font-bold">
                      0.35 ppm
                    </span>
                  </div>
                  <div className="h-28 w-full flex items-end gap-1.5 pt-4">
                    {[0.1, 0.2, 0.25, 0.3, 0.35, 0.35, 0.38, 0.42].map((v, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div
                          style={{ height: `${(v / 1.0) * 100}%` }}
                          className="w-full rounded-t bg-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>29 Sep</span>
                    <span>30 Sep</span>
                    <span>01 Oct</span>
                  </div>
                </div>
              </div>
            )}

            {journeyTab === 'CUSTODY' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white">Chain of Custody Handover Ledger</h4>
                  <button
                    onClick={onOpenHandover}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                  >
                    + New Handover
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between font-mono">
                    <span className="text-white font-bold">HO-2026-001</span>
                    <span className="text-emerald-400 font-bold">&bull; DUAL-SIGNED VERIFIED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>From: <strong className="text-white">Farm Fresh Producer</strong></div>
                    <div>To: <strong className="text-white">CoolTrans Logistics</strong></div>
                    <div>Location: Green Valley Dispatch Gate 1</div>
                    <div>Sequence: #12,458</div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                    Head HMAC: 7a3f8920194812340918230948123409182309481234091823094812349d21
                  </div>
                </div>
              </div>
            )}

            {journeyTab === 'EVENTS' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white mb-2">Cryptographic Signed Events</h4>
                <div className="space-y-2 font-mono">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold">BOOT</span>
                      <span className="text-slate-300 ml-2 font-sans">Secure Boot v1.2.0 Validated</span>
                    </div>
                    <span className="text-slate-500">Seq #1</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <div>
                      <span className="text-cyan-400 font-bold">CUSTODY_HANDOVER</span>
                      <span className="text-slate-300 ml-2 font-sans">Farm to Transport Carrier</span>
                    </div>
                    <span className="text-slate-500">Seq #12458</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <div>
                      <span className="text-amber-400 font-bold">EXCURSION_RATE_JUMP</span>
                      <span className="text-slate-300 ml-2 font-sans">Sampling switched to 1-min</span>
                    </div>
                    <span className="text-slate-500">Seq #12454</span>
                  </div>
                </div>
              </div>
            )}

            {journeyTab === 'BLOCKCHAIN' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs font-mono">
                <h4 className="font-bold text-white font-sans">Besu QBFT Anchor Certificate</h4>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Block Number:</span>
                    <span className="text-white font-bold">#128,451</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction Hash:</span>
                    <span className="text-emerald-400">0x7a3f.....9d21</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Merkle Root:</span>
                    <span className="text-emerald-400">0x9c2b...4e1f</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sequence Range:</span>
                    <span className="text-white">12,001 - 12,458</span>
                  </div>
                </div>
              </div>
            )}

            {journeyTab === 'EPCIS' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white">GS1 EPCIS 2.0 Representation</h4>
                  <button
                    onClick={onOpenReportExport}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download JSON-LD
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-emerald-400 overflow-x-auto max-h-56">
                  <pre>{JSON.stringify(epcisEvents[0], null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* WEB SCREEN 3: NODE DETAILS */}
        {/* ========================================================================= */}
        {activeWebScreen === '3_NODE_DETAILS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white font-mono">Node TC-001-A3F2</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-semibold flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" /> 78%
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onOpenNodeQr && onOpenNodeQr(activeNode)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" /> Identity QR Tag
                </button>
                <button
                  onClick={() => runDiagnostics()}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
                  <span>Run Self-Test</span>
                </button>
              </div>
            </div>

            {/* Split: 3D Sensor Graphic vs Hardware Specs */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: 3D Enclosure Rendering */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800/80">
                <SensorDeviceSvg size={180} />
                <div className="text-xs font-mono text-slate-400 mt-4 text-center">
                  Model: TrustChain Multi-Sensor Hub A3 &bull; IP65 Rated
                </div>
              </div>

              {/* Right: Spec List matching Web Screen 3 */}
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Firmware:</span>
                  <span className="text-white font-bold">v1.2.0</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Hardware Rev:</span>
                  <span className="text-white font-bold">A3</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Public Key:</span>
                  <span className="text-emerald-400 font-bold">04:7a:3f...9d21</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Last Sync:</span>
                  <span className="text-slate-200">10:24 AM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Storage Used:</span>
                  <span className="text-white font-bold">45% (FRAM + Flash)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Time Quality:</span>
                  <span className="text-emerald-400 font-bold">Synced</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Witness:</span>
                  <span className="text-slate-200 font-bold">Gateway-01</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Integrity Status:</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </div>
              </div>
            </div>

            {/* Sub-Tabs matching Web Screen 3: Live Data, Events, Checkpoints, Diagnostics, Settings */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
              {(
                [
                  { id: 'LIVE_DATA', label: 'Live Data' },
                  { id: 'EVENTS', label: 'Events' },
                  { id: 'CHECKPOINTS', label: 'Checkpoints' },
                  { id: 'DIAGNOSTICS', label: 'Diagnostics' },
                  { id: 'SETTINGS', label: 'Settings' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setNodeDetailsTab(tab.id)}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    nodeDetailsTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: Live Data (4 Cards) */}
            {nodeDetailsTab === 'LIVE_DATA' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <Thermometer className="w-5 h-5 text-cyan-400 mx-auto" />
                  <div className="text-lg font-bold font-mono text-white">24.8°C</div>
                  <div className="text-[11px] text-slate-400">Temperature</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <Droplets className="w-5 h-5 text-blue-400 mx-auto" />
                  <div className="text-lg font-bold font-mono text-white">68 %</div>
                  <div className="text-[11px] text-slate-400">Humidity</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <Flame className="w-5 h-5 text-amber-400 mx-auto" />
                  <div className="text-lg font-bold font-mono text-white">0.42 ppm</div>
                  <div className="text-[11px] text-slate-400">Ethylene</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                  <div className="text-lg font-bold text-white">No Tamper</div>
                  <div className="text-[11px] text-slate-400">Motion Normal</div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Events */}
            {nodeDetailsTab === 'EVENTS' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-emerald-400 font-bold">BOOT_SECURE_INIT</span>
                  <span className="text-slate-400">Seq #1 &bull; 29 Sep 08:00</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-cyan-400 font-bold">CUSTODY_HANDOVER_WITNESS</span>
                  <span className="text-slate-400">Seq #12458 &bull; 02 Oct 11:20</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-amber-400 font-bold">SAMPLING_RATE_1MIN</span>
                  <span className="text-slate-400">Seq #12454 &bull; 08:12 AM</span>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Checkpoints */}
            {nodeDetailsTab === 'CHECKPOINTS' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs font-mono">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Checkpoint #389</span>
                    <span className="text-emerald-400 font-bold">ATECC608B SIGNED</span>
                  </div>
                  <div className="text-slate-400">Coverage: Sequence #12,001 &ndash; #12,458</div>
                  <div className="text-slate-400">Merkle Root: 0x9c2b4e1f81309dc47120a1bc34991209fbca38491820...</div>
                  <div className="text-[11px] text-slate-500">Witness: Gateway-01 &bull; 02 Oct 2026 11:20 AM</div>
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Diagnostics */}
            {nodeDetailsTab === 'DIAGNOSTICS' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white">Hardware Subsystems Diagnostic Status</h4>
                  <button
                    onClick={() => runDiagnostics()}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                  >
                    Run Self-Test
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {diagnostics.map((d, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-300 font-medium">{d.name}</span>
                      <span className="text-emerald-400 font-mono font-bold">PASS</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 5: Settings */}
            {nodeDetailsTab === 'SETTINGS' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-white">Node Calibration &amp; Security Settings</h4>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Ethylene Sensor Zero &amp; Span Calibration</div>
                    <div className="text-slate-400 text-[11px]">Electrochemical gas cell baseline adjustment</div>
                  </div>
                  <button
                    onClick={onOpenCalibration}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg font-semibold border border-slate-700"
                  >
                    Calibrate
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* WEB SCREEN 4: BLOCKCHAIN & VERIFICATION */}
        {/* ========================================================================= */}
        {activeWebScreen === '4_BLOCKCHAIN' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latest Anchor Card matching Web Screen 4 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    <span>Latest Anchor</span>
                  </h3>
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Block Number:</span>
                    <span className="text-white font-bold">128,451</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Transaction Hash:</span>
                    <span className="text-emerald-400 font-bold">0x7a3f.....9d21</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Merkle Root:</span>
                    <span className="text-emerald-400 font-bold">0x9c2b...4e1f</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Sequence Range:</span>
                    <span className="text-white font-bold">12,001 - 12,458</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Anchored At:</span>
                    <span className="text-slate-200">02 Oct 2026, 11:20 AM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Validator Status:</span>
                    <span className="text-emerald-400 font-bold">4/4 (Besu QBFT)</span>
                  </div>
                </div>
              </div>

              {/* Verification Steps Checklist matching Web Screen 4 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Verification Steps</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">HMAC Chain Valid</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Chained hashes match all 458 records
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Checkpoint Signature Valid</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ATECC608B Secp256r1 signature validated
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Counter Monotonic</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Anti-rollback hardware counter strictly +1
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">No Missing Records</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Gap analysis continuous without omissions
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Merkle Root Match</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Recomputed root identical to anchored root
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/40 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-emerald-300">
                        Blockchain Anchor Verified
                      </div>
                      <div className="text-[11px] text-emerald-400/80 font-mono">
                        Besu QBFT Block #128,451 confirmed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADDITIONAL IMPORTANT SCREENS (A to Z) */}
        {/* ========================================================================= */}
        {activeWebScreen === 'EXTRA_SCREENS' && (
          <div className="space-y-6">
            {/* 10 Screen Selector Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto text-xs">
              {[
                { id: 1, label: '1. Create Batch' },
                { id: 2, label: '2. Sensor Calibration' },
                { id: 3, label: '3. Incidents' },
                { id: 4, label: '4. Reports & Export' },
                { id: 5, label: '5. Node Replacement' },
                { id: 6, label: '6. Diagnostics' },
                { id: 7, label: '7. Audit Logs' },
                { id: 8, label: '8. User Management' },
                { id: 9, label: '9. Settings' },
                { id: 10, label: '10. Help & Support' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveExtraTab(s.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors ${
                    activeExtraTab === s.id
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* SCREEN 1: CREATE BATCH */}
            {activeExtraTab === 1 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4">
                <h3 className="text-base font-bold text-white">Create New Batch</h3>
                <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Product Details / Name</label>
                    <input
                      type="text"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Quantity</label>
                    <input
                      type="text"
                      value={newBatchQty}
                      onChange={(e) => setNewBatchQty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Source / Origin Farm</label>
                    <input
                      type="text"
                      value={newBatchSource}
                      onChange={(e) => setNewBatchSource(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                    />
                  </div>

                  {batchCreatedSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Batch Created &amp; Chained
                      Successfully!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider"
                  >
                    Create Batch
                  </button>
                </form>
              </div>
            )}

            {/* SCREEN 2: SENSOR CALIBRATION */}
            {activeExtraTab === 2 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs">
                <h3 className="text-base font-bold text-white">Ethylene Sensor Calibration</h3>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-amber-400 font-bold">Warm-up</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Warm-up Time:</span>
                    <span className="text-white font-mono">10 / 30 min</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={onOpenCalibration}
                    className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl"
                  >
                    Zero Calibration
                  </button>
                  <button
                    onClick={onOpenCalibration}
                    className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
                  >
                    Span Check
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 3: INCIDENTS MANAGEMENT */}
            {activeExtraTab === 3 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-mono">
                    Incident #INC-2026-012
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                    Investigating
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Event:</span>
                    <span className="text-white font-bold">Tamper Event</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Node:</span>
                    <span className="text-emerald-400">TC-001-A3F2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch:</span>
                    <span className="text-white">BF-2026-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time:</span>
                    <span className="text-slate-300">08:12 AM</span>
                  </div>
                  <div className="pt-2 text-slate-400 font-sans leading-relaxed">
                    Motion detected during transit. Container seal acceleration exceeded 1.8g.
                  </div>
                </div>

                <button
                  onClick={onOpenAttackSim}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl"
                >
                  Add Investigation Notes
                </button>
              </div>
            )}

            {/* SCREEN 4: REPORTS & EXPORT */}
            {activeExtraTab === 4 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs">
                <h3 className="text-base font-bold text-white">Generate Report</h3>
                <div className="space-y-2 font-medium text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    &bull; Batch Traceability Report
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    &bull; Environmental Telemetry Report
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    &bull; Incident &amp; Excursion Report
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    &bull; EPCIS 2.0 Export Document
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    &bull; Blockchain Proof Verification
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={onOpenReportExport}
                    className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                  >
                    PDF &amp; CSV
                  </button>
                  <button
                    onClick={onOpenReportExport}
                    className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                  >
                    Download Dossier
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 5: NODE REPLACEMENT */}
            {activeExtraTab === 5 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs">
                <h3 className="text-base font-bold text-white">Replace Node</h3>
                <p className="text-slate-400">
                  Old node revocation &rarr; New node genesis referencing previous anchored
                  sequence.
                </p>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Node:</span>
                    <span className="text-white font-bold">{activeNode.nodeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">New Target Node:</span>
                    <span className="text-emerald-400 font-bold">{replaceNewNodeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Previous Sequence:</span>
                    <span className="text-white font-bold">#12,458</span>
                  </div>
                </div>

                {replacementSuccess && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl">
                    New node activated &amp; chain continued from #12,458!
                  </div>
                )}

                <button
                  onClick={handleExecuteNodeReplacement}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl uppercase tracking-wider"
                >
                  Activate New Node
                </button>
              </div>
            )}

            {/* SCREEN 6: DIAGNOSTICS */}
            {activeExtraTab === 6 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs font-mono">
                <h3 className="text-base font-bold text-white font-sans">Subsystem Diagnostics</h3>
                <div className="space-y-2">
                  {diagnostics.map((d, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-slate-300 font-sans">{d.name}</span>
                      <span className="text-emerald-400 font-bold">Pass</span>
                    </div>
                  ))}
                </div>

                <button
                  disabled={isDiagnosing}
                  onClick={() => runDiagnostics()}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl font-sans"
                >
                  {isDiagnosing ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
                </button>
              </div>
            )}

            {/* SCREEN 7: AUDIT LOGS */}
            {activeExtraTab === 7 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs font-mono">
                <h3 className="text-base font-bold text-white font-sans">Audit Logs</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <div>
                      <span className="text-white font-bold block">User Login</span>
                      <span className="text-slate-500">Admin</span>
                    </div>
                    <span className="text-slate-400">10:24 AM</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <div>
                      <span className="text-white font-bold block">Node Connected</span>
                      <span className="text-slate-500">TC-001-A3F2</span>
                    </div>
                    <span className="text-slate-400">10:20 AM</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <div>
                      <span className="text-white font-bold block">Custody Handover</span>
                      <span className="text-slate-500">BF-2026-001</span>
                    </div>
                    <span className="text-slate-400">09:15 AM</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <div>
                      <span className="text-white font-bold block">Sync Completed</span>
                      <span className="text-slate-500">TC-001-A3F2</span>
                    </div>
                    <span className="text-slate-400">07:55 AM</span>
                  </div>
                </div>

                <button
                  onClick={onOpenReportExport}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl font-sans"
                >
                  View All Logs
                </button>
              </div>
            )}

            {/* SCREEN 8: USER MANAGEMENT */}
            {activeExtraTab === 8 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Users</h3>
                  <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold">
                    + Add User
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Arjun', role: 'Farmer' },
                    { name: 'Priya', role: 'Transporter' },
                    { name: 'Rakesh', role: 'Warehouse' },
                    { name: 'Anita', role: 'Auditor' },
                  ].map((u, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div className="font-semibold text-white">{u.name}</div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[11px]">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 9: SETTINGS */}
            {activeExtraTab === 9 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs">
                <h3 className="text-base font-bold text-white">Alert Thresholds</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Temperature (°C)</span>
                      <span className="font-mono text-white">2 &ndash; 8 °C</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      defaultValue="8"
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Humidity (%)</span>
                      <span className="font-mono text-white">60 &ndash; 90 %</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      defaultValue="90"
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Ethylene (ppm)</span>
                      <span className="font-mono text-white">1.0 ppm max</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.1"
                      defaultValue="1.0"
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <h4 className="font-bold text-white mb-2">Sync Settings</h4>
                  <div className="flex justify-between text-slate-400">
                    <span>Chunk Size</span>
                    <span className="font-mono text-white">32 records</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 10: HELP & SUPPORT */}
            {activeExtraTab === 10 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 text-xs">
                <h3 className="text-base font-bold text-white">How can we help?</h3>
                <div className="space-y-2">
                  <div
                    onClick={onOpenHelp}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
                  >
                    <span>User Guide &amp; Protocol</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                    <span>Video Tutorials</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div
                    onClick={onOpenHelp}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
                  >
                    <span>FAQs &amp; Cryptographic Architecture</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div
                    onClick={onOpenAttackSim}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
                  >
                    <span>Report an Issue / Attack Simulation</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                    <span>Contact Consortium Support</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
