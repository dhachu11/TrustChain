import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  Flame,
  Thermometer,
  Droplets,
  Activity,
  Layers,
  ArrowRightLeft,
  RefreshCw,
  Bell,
  Cpu,
  Clock,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Database,
  Lock,
  Wrench,
  Search,
  Filter,
  Plus,
  Play,
  FileText,
  ShieldAlert,
  Truck,
  Check,
  MapPin,
  Calendar,
  Box,
  User,
  Users,
  Settings,
  HelpCircle,
  Info,
  CircleSlash,
  AlertOctagon,
  X,
} from 'lucide-react';
import { useTrustChain } from '../../context/TrustChainContext';
import { TrustChainLogo } from '../common/TrustChainLogo';
import { SensorDeviceSvg } from '../common/SensorDeviceSvg';
import { UserRole } from '../../types/trustchain';

interface MobileAppProps {
  onOpenQrScanner: () => void;
  onOpenHandover: () => void;
  onOpenReportExport: () => void;
  onOpenCalibration: () => void;
  onOpenAttackSim: () => void;
  onOpenNodeQr?: (node: any) => void;
  onOpenHelp?: () => void;
}

export type MobileScreenId =
  | '1_SPLASH'
  | '2_ROLE'
  | '3_PAIRING'
  | '4_DASHBOARD'
  | '5_MONITOR'
  | '6_HANDOVER'
  | '7_SYNC'
  | '8_ALERTS'
  | '9_BATCH'
  | '10_MORE';

export const MobileApp: React.FC<MobileAppProps> = ({
  onOpenQrScanner,
  onOpenHandover,
  onOpenReportExport,
  onOpenCalibration,
  onOpenAttackSim,
  onOpenNodeQr,
  onOpenHelp,
}) => {
  const {
    currentUser,
    setCurrentUserRole,
    isInternetOnline,
    setIsInternetOnline,
    isBleConnected,
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    batches,
    selectedBatchId,
    setSelectedBatchId,
    telemetry,
    alerts,
    offlineQueue,
    syncNow,
    isSyncing,
    syncProgress,
    acknowledgeAlert,
  } = useTrustChain();

  const [currentScreen, setCurrentScreen] = useState<MobileScreenId>('4_DASHBOARD');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Transporter');
  const [monitorTimeFilter, setMonitorTimeFilter] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  const [alertsTab, setAlertsTab] = useState<'ALERTS' | 'EVENTS'>('ALERTS');
  const [isSyncPaused, setIsSyncPaused] = useState(false);

  const activeNode = nodes.find((n) => n.nodeId === selectedNodeId) || nodes[0];
  const activeBatch = batches.find((b) => b.batchId === selectedBatchId) || batches[0];
  const latestTelemetry = telemetry[0] || {
    sequence: 12458,
    temperatureC: 24.8,
    humidityRH: 68.0,
    ethylenePpm: 0.42,
    ethyleneQuality: 'OK',
    batteryPct: 78,
    motionDetected: false,
    lidOpen: false,
    headHmac: '0x7a3f8920194812340918230948123409182309481234091823094812349d21',
    timeQuality: 'SYNCED',
  };

  const ROLES_LIST = [
    {
      role: 'Farmer / Producer' as UserRole,
      title: 'Farmer',
      desc: 'Create & manage batches',
      icon: Users,
    },
    {
      role: 'Transporter' as UserRole,
      title: 'Transporter',
      desc: 'Monitor & transfer custody',
      icon: Truck,
    },
    {
      role: 'Warehouse' as UserRole,
      title: 'Warehouse',
      desc: 'Receive & store products',
      icon: Box,
    },
    {
      role: 'Processor' as UserRole,
      title: 'Processor',
      desc: 'Process & verify quality',
      icon: Activity,
    },
    {
      role: 'Buyer' as UserRole,
      title: 'Buyer / Retailer',
      desc: 'Verify product journey',
      icon: ShieldCheck,
    },
    {
      role: 'Auditor' as UserRole,
      title: 'Auditor / Regulator',
      desc: 'Access audit & reports',
      icon: FileText,
    },
  ];

  const NEARBY_NODES = [
    { id: 'TC-001-A3F2', rssi: '-52 dBm', connected: true },
    { id: 'TC-002-B7C1', rssi: '-60 dBm', connected: false },
    { id: 'TC-003-D4E9', rssi: '-71 dBm', connected: false },
  ];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto my-2 flex flex-col items-center">
      {/* Top Screen Quick Navigator (1 to 10 matching the UI / UX Guide) */}
      <div className="w-full mb-3 bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center justify-between text-xs overflow-x-auto gap-1">
        <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 shrink-0">
          MOBILE GUIDE:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {[
            { id: '1_SPLASH', label: '1. Splash' },
            { id: '2_ROLE', label: '2. Role' },
            { id: '3_PAIRING', label: '3. Pairing' },
            { id: '4_DASHBOARD', label: '4. Home' },
            { id: '5_MONITOR', label: '5. Monitor' },
            { id: '6_HANDOVER', label: '6. Handover' },
            { id: '7_SYNC', label: '7. Sync' },
            { id: '8_ALERTS', label: '8. Alerts' },
            { id: '9_BATCH', label: '9. Batch' },
            { id: '10_MORE', label: '10. More' },
          ].map((screen) => (
            <button
              key={screen.id}
              onClick={() => setCurrentScreen(screen.id as MobileScreenId)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                currentScreen === screen.id
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Device Frame */}
      <div className="w-full bg-slate-950 rounded-[38px] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-100 min-h-[760px] relative">
        {/* Device Speaker Notch & Status Bar */}
        <div className="pt-3 px-6 pb-2 bg-slate-950 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none border-b border-slate-900/60 z-20">
          <div className="flex items-center gap-1.5 font-sans font-bold text-white">
            <span>08:42</span>
          </div>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <Bluetooth className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-emerald-400 font-bold">78%</span>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 1: SPLASH & LOGIN */}
        {/* ========================================================================= */}
        {currentScreen === '1_SPLASH' && (
          <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-center">
            <div className="pt-16 flex flex-col items-center">
              <TrustChainLogo size="lg" className="flex-col gap-3" />
              <div className="mt-8 p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Field Operator &amp; Gateway Client</span>
              </div>
            </div>

            <div className="space-y-3 pb-8">
              <button
                onClick={() => setCurrentScreen('2_ROLE')}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-sm shadow-lg shadow-emerald-500/20 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentScreen('2_ROLE')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl text-sm border border-slate-800 transition-all"
              >
                Create Account
              </button>
              <div className="text-[11px] font-mono text-slate-600 pt-2">v1.0.0 &bull; Besu QBFT</div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: ROLE SELECTION */}
        {/* ========================================================================= */}
        {currentScreen === '2_ROLE' && (
          <div className="flex-1 flex flex-col p-6 bg-slate-950 space-y-4">
            <div className="pt-2">
              <h2 className="text-xl font-bold text-white">Select Your Role</h2>
              <p className="text-xs text-slate-400 mt-0.5">Choose your role to continue</p>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto">
              {ROLES_LIST.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    onClick={() => {
                      setSelectedRole(item.role);
                      setCurrentUserRole(item.role);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentScreen('3_PAIRING')}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
            >
              Continue to Node Pairing &rarr;
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: NODE PAIRING */}
        {/* ========================================================================= */}
        {currentScreen === '3_PAIRING' && (
          <div className="flex-1 flex flex-col p-6 bg-slate-950 justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-white">Connect to TRUSTCHAIN Node</h2>
                <p className="text-xs text-slate-400 mt-0.5">BLE GATT Hardware Discovery</p>
              </div>

              {/* 3D Sensor Rendering */}
              <div className="py-2 flex flex-col items-center justify-center">
                <SensorDeviceSvg size={140} />
                <div className="flex items-center gap-2 mt-3 text-xs text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Scanning for nearby nodes...</span>
                </div>
              </div>

              {/* Nearby Nodes List */}
              <div className="space-y-2">
                {NEARBY_NODES.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      n.id === selectedNodeId
                        ? 'bg-slate-900 border-emerald-500 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono">
                      {n.connected ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                      <span className="font-semibold text-slate-200">{n.id}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{n.rssi}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('4_DASHBOARD')}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
            >
              Connect
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: DASHBOARD (HOME) */}
        {/* ========================================================================= */}
        {currentScreen === '4_DASHBOARD' && (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <TrustChainLogo size="sm" showSubtitle={false} />
              <button
                onClick={() => setCurrentScreen('8_ALERTS')}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>
            </div>

            {/* Node Connected Status Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Node Connected</span>
                </div>
                <div className="text-xs font-mono text-emerald-400 font-semibold">
                  {activeNode.nodeId}
                </div>
              </div>
              <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1">
                <Battery className="w-3.5 h-3.5" /> 78%
              </div>
            </div>

            {/* 4 Sensor Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Temperature */}
              <div
                onClick={() => setCurrentScreen('5_MONITOR')}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 cursor-pointer hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] text-emerald-400 font-mono">Normal</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  24.8 <span className="text-xs font-normal text-slate-400">°C</span>
                </div>
                <div className="text-[11px] text-slate-400">Temperature</div>
              </div>

              {/* Humidity */}
              <div
                onClick={() => setCurrentScreen('5_MONITOR')}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 cursor-pointer hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] text-emerald-400 font-mono">Normal</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  68 <span className="text-xs font-normal text-slate-400">%</span>
                </div>
                <div className="text-[11px] text-slate-400">Humidity</div>
              </div>

              {/* Tamper State */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-mono">Normal</span>
                </div>
                <div className="text-base font-bold text-white pt-1">No Tamper</div>
                <div className="text-[11px] text-slate-400">Motion Normal</div>
              </div>

              {/* Sync Status */}
              <div
                onClick={() => setCurrentScreen('7_SYNC')}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 cursor-pointer hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] text-emerald-400 font-mono">OK</span>
                </div>
                <div className="text-base font-bold text-white pt-1">Synced</div>
                <div className="text-[11px] text-slate-400 font-mono">Last: 10:24 AM</div>
              </div>
            </div>

            {/* 4 Quick Actions */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => setCurrentScreen('9_BATCH')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-center flex flex-col items-center gap-1 text-[10px] text-slate-300 font-medium"
              >
                <Box className="w-4 h-4 text-emerald-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => setCurrentScreen('7_SYNC')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-center flex flex-col items-center gap-1 text-[10px] text-slate-300 font-medium"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>Sync Now</span>
              </button>

              <button
                onClick={() => setCurrentScreen('6_HANDOVER')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-center flex flex-col items-center gap-1 text-[10px] text-slate-300 font-medium"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>Handover</span>
              </button>

              <button
                onClick={() => setCurrentScreen('9_BATCH')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-center flex flex-col items-center gap-1 text-[10px] text-slate-300 font-medium"
              >
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>View Map</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: LIVE MONITORING */}
        {/* ========================================================================= */}
        {currentScreen === '5_MONITOR' && (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Live Sensor Data</h2>
              <button
                onClick={() => setCurrentScreen('4_DASHBOARD')}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
              {(['1H', '6H', '24H', '7D'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setMonitorTimeFilter(t)}
                  className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                    monitorTimeFilter === t
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Temperature Graph Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Temperature (°C)</span>
                <span className="text-sm font-bold font-mono text-cyan-400">24.8 °C</span>
              </div>
              <div className="h-16 w-full flex items-end gap-1.5 pt-2">
                {[18, 20, 22, 24, 25, 28, 25, 24.8].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div
                      style={{ height: `${(v / 35) * 100}%` }}
                      className={`w-full rounded-t ${v > 26 ? 'bg-red-400' : 'bg-cyan-500'}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Humidity Graph Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Humidity (%)</span>
                <span className="text-sm font-bold font-mono text-blue-400">68 %</span>
              </div>
              <div className="h-16 w-full flex items-end gap-1.5 pt-2">
                {[65, 66, 68, 70, 72, 69, 68, 68].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div
                      style={{ height: `${(v / 100) * 100}%` }}
                      className="w-full rounded-t bg-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Ethylene Graph Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Ethylene (ppm)</span>
                <span className="text-sm font-bold font-mono text-amber-400">0.42 ppm</span>
              </div>
              <div className="h-16 w-full flex items-end gap-1.5 pt-2">
                {[0.2, 0.25, 0.3, 0.35, 0.38, 0.4, 0.42, 0.42].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div
                      style={{ height: `${(v / 1.0) * 100}%` }}
                      className="w-full rounded-t bg-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: CUSTODY HANDOVER */}
        {/* ========================================================================= */}
        {currentScreen === '6_HANDOVER' && (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
            <h2 className="text-base font-bold text-white">Transfer Custody</h2>

            {/* Stepper matching Screen 6 */}
            <div className="flex items-center justify-between px-2 text-[10px] font-mono">
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
                  1
                </div>
                <span className="text-emerald-400 font-semibold">Select</span>
              </div>
              <div className="h-0.5 flex-1 bg-emerald-500 mx-1" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
                  2
                </div>
                <span className="text-emerald-400 font-semibold">Sign</span>
              </div>
              <div className="h-0.5 flex-1 bg-slate-800 mx-1" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center">
                  3
                </div>
                <span className="text-slate-500">Counter Sign</span>
              </div>
              <div className="h-0.5 flex-1 bg-slate-800 mx-1" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center">
                  4
                </div>
                <span className="text-slate-500">Complete</span>
              </div>
            </div>

            {/* From / To Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  F
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">From</span>
                  <span className="text-xs font-semibold text-white">Farm Fresh Producer</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  C
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">To</span>
                  <span className="text-xs font-semibold text-white">CoolTrans Logistics</span>
                </div>
              </div>
            </div>

            {/* Node Sequence & Evidence Head */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Node Sequence:</span>
                <span className="text-white font-bold">#12,458</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Evidence Head:</span>
                <span className="text-emerald-400 font-bold">7a3f...9d21</span>
              </div>
            </div>

            {/* Signature Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-2">
              <div className="h-16 flex items-center justify-center text-slate-500 text-xs italic">
                Waiting for receiver to sign...
              </div>
            </div>

            <button
              onClick={() => {
                onOpenHandover();
                setCurrentScreen('4_DASHBOARD');
              }}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
            >
              Complete Handover
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 7: SYNC & OFFLINE */}
        {/* ========================================================================= */}
        {currentScreen === '7_SYNC' && (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
            <h2 className="text-base font-bold text-white">Data Synchronization</h2>

            {/* Circular Progress Gauge */}
            <div className="py-4 flex flex-col items-center justify-center space-y-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#1E293B"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * 68) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white font-mono">68%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-white">Syncing records...</div>
                <div className="text-[11px] font-mono text-slate-400">856 / 1,248 records</div>
              </div>
            </div>

            {/* Sync Checklist */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Connected to node</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Finding missing records</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Uploading chunk (16/32)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-4 h-4 rounded-full border border-slate-700" />
                <span>Waiting for acknowledgement</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-4 h-4 rounded-full border border-slate-700" />
                <span>Verifying integrity</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-4 h-4 rounded-full border border-slate-700" />
                <span>Sync complete</span>
              </div>
            </div>

            <button
              onClick={() => setIsSyncPaused(!isSyncPaused)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold rounded-2xl text-xs transition-all"
            >
              {isSyncPaused ? 'Resume Sync' : 'Pause Sync'}
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 8: ALERTS & EVENTS */}
        {/* ========================================================================= */}
        {currentScreen === '8_ALERTS' && (
          <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
            {/* Segmented Tabs */}
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setAlertsTab('ALERTS')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  alertsTab === 'ALERTS' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Alerts
              </button>
              <button
                onClick={() => setAlertsTab('EVENTS')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  alertsTab === 'EVENTS' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Events
              </button>
            </div>

            {/* Alert List Items or Events List matching Screen 8 */}
            <div className="space-y-2">
              {alertsTab === 'ALERTS' ? (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Temperature Excursion</div>
                        <div className="text-[11px] text-red-400 font-mono">33.4 °C</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">10:24 AM</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Ethylene Threshold</div>
                        <div className="text-[11px] text-amber-400 font-mono">1.2 ppm</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">09:41 AM</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Tamper Motion</div>
                        <div className="text-[11px] text-slate-400">Movement detected</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">08:12 AM</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Sync Completed</div>
                        <div className="text-[11px] text-emerald-400 font-mono">1,248 records</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">07:50 AM</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Low Battery</div>
                        <div className="text-[11px] text-amber-400 font-mono">18% remaining</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">06:30 AM</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Time Reset Detected</div>
                        <div className="text-[11px] text-slate-400">RTC resynced</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">04:22 AM</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">BOOT &bull; Secure Boot Valid</div>
                        <div className="text-[11px] text-emerald-400 font-mono">eFuse HMAC &amp; ATECC608B</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Seq #1</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">CUSTODY_HANDOVER</div>
                        <div className="text-[11px] text-slate-300">Dual-Signed by Farm Fresh &amp; CoolTrans</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Seq #12458</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">POWER_FAIL_RECOVERY</div>
                        <div className="text-[11px] text-slate-300">FRAM journal committed 0 records lost</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Seq #12450</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">BLOCKCHAIN_ANCHOR</div>
                        <div className="text-[11px] text-emerald-400 font-mono">Besu QBFT Block #128,451</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">11:20 AM</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 9: BATCH DETAILS */}
        {/* ========================================================================= */}
        {currentScreen === '9_BATCH' && (
          <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
            <h2 className="text-base font-bold text-white font-mono">Batch #BF-2026-001</h2>

            {/* Tomato Banner Card */}
            <div className="relative rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-slate-800 p-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Tomato (Fresh Produce)</div>
                  <div className="text-[10px] font-mono text-slate-400">Grade A Export Quality</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  Active
                </span>
              </div>
            </div>

            {/* Spec List matching Screen 9 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Stage:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" /> Transport
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Origin:</span>
                <span className="text-slate-200">Green Valley Farms</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Location:</span>
                <span className="text-slate-200">En Route to Cold Storage</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Node:</span>
                <span className="font-mono text-emerald-400 font-semibold">TC-001-A3F2</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Start Date:</span>
                <span className="text-slate-200">29 Sep 2026</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Quantity:</span>
                <span className="text-slate-200">500 kg (20 crates)</span>
              </div>
            </div>

            <button
              onClick={() => onOpenNodeQr && onOpenNodeQr(activeNode)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4" /> View Node Identity QR Tag
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10: MORE / MENU */}
        {/* ========================================================================= */}
        {currentScreen === '10_MORE' && (
          <div className="flex-1 flex flex-col p-4 space-y-2 overflow-y-auto">
            <h2 className="text-base font-bold text-white mb-1">More</h2>

            {[
              {
                label: 'Nodes',
                icon: Cpu,
                action: () => setCurrentScreen('3_PAIRING'),
              },
              {
                label: 'Batches',
                icon: Box,
                action: () => setCurrentScreen('9_BATCH'),
              },
              {
                label: 'Blockchain Proof',
                icon: Database,
                action: onOpenReportExport,
              },
              {
                label: 'EPCIS Events',
                icon: FileText,
                action: onOpenReportExport,
              },
              {
                label: 'Reports',
                icon: FileText,
                action: onOpenReportExport,
              },
              {
                label: 'Diagnostics',
                icon: Activity,
                action: onOpenAttackSim,
              },
              {
                label: 'Settings',
                icon: Settings,
                action: onOpenCalibration,
              },
              {
                label: 'Help & Support',
                icon: HelpCircle,
                action: () => (onOpenHelp ? onOpenHelp() : onOpenCalibration()),
              },
              {
                label: 'About',
                icon: Info,
                action: () => setCurrentScreen('1_SPLASH'),
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-left flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* BOTTOM NAVIGATION BAR (Home, Batches, Monitor, Alerts, More) */}
        {/* ========================================================================= */}
        <div className="px-2 py-2 bg-slate-950 border-t border-slate-900 grid grid-cols-5 gap-1 z-20">
          <button
            onClick={() => setCurrentScreen('4_DASHBOARD')}
            className={`py-1.5 flex flex-col items-center justify-center rounded-lg transition-colors ${
              currentScreen === '4_DASHBOARD'
                ? 'text-emerald-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>

          <button
            onClick={() => setCurrentScreen('9_BATCH')}
            className={`py-1.5 flex flex-col items-center justify-center rounded-lg transition-colors ${
              currentScreen === '9_BATCH' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Box className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Batches</span>
          </button>

          <button
            onClick={() => setCurrentScreen('5_MONITOR')}
            className={`py-1.5 flex flex-col items-center justify-center rounded-lg transition-colors ${
              currentScreen === '5_MONITOR'
                ? 'text-emerald-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Monitor</span>
          </button>

          <button
            onClick={() => setCurrentScreen('8_ALERTS')}
            className={`py-1.5 flex flex-col items-center justify-center rounded-lg transition-colors ${
              currentScreen === '8_ALERTS'
                ? 'text-emerald-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Alerts</span>
          </button>

          <button
            onClick={() => setCurrentScreen('10_MORE')}
            className={`py-1.5 flex flex-col items-center justify-center rounded-lg transition-colors ${
              currentScreen === '10_MORE' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">More</span>
          </button>
        </div>
      </div>
    </div>
  );
};
