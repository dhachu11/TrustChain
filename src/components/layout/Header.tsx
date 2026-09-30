import React, { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  LayoutDashboard,
  Wifi,
  WifiOff,
  Bluetooth,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useTrustChain, AppInterfaceMode } from '../../context/TrustChainContext';
import { TrustChainLogo } from '../common/TrustChainLogo';
import { UserRole } from '../../types/trustchain';

interface HeaderProps {
  onOpenHelp: () => void;
  onOpenDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp, onOpenDemo }) => {
  const {
    interfaceMode,
    setInterfaceMode,
    currentUser,
    setCurrentUserRole,
    isInternetOnline,
    setIsInternetOnline,
    isBleConnected,
    toggleBleConnection,
    activeAttackState,
    resetAttackState,
  } = useTrustChain();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const ROLES: UserRole[] = [
    'Farmer / Producer',
    'Collection Center',
    'Transporter',
    'Warehouse',
    'Processor',
    'Distributor',
    'Buyer',
    'Auditor',
    'Regulator',
    'System Administrator',
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between text-slate-100">
      {/* Zone 1: Single Text Element Brand Wordmark with Leaf Emblem */}
      <div className="flex items-center gap-3">
        <TrustChainLogo size="sm" showSubtitle={false} />

        {/* Attack indicator pill if simulated */}
        {activeAttackState && (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-red-950/60 border border-red-700/80 rounded text-xs text-red-200">
            <span className="font-semibold text-red-400">Attack Simulated:</span>
            <span className="truncate max-w-[200px]">{activeAttackState.attackName}</span>
            <button
              onClick={resetAttackState}
              className="ml-1 text-slate-400 hover:text-white underline text-[11px]"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Zone 2: Navigation Links / Primary Segmented View Switcher */}
      <nav className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setInterfaceMode('MOBILE')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            interfaceMode === 'MOBILE'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Gateway</span>
        </button>
        <button
          onClick={() => setInterfaceMode('WEB')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            interfaceMode === 'WEB'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Audit Web Console</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Offline Toggle, Role Selector, Demo/Help) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Offline / Online Network Toggle Button */}
        <button
          onClick={() => setIsInternetOnline(!isInternetOnline)}
          title={isInternetOnline ? 'Internet Connected (Click to test Offline Mode)' : 'Offline Mode Active (Click to go Online)'}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
            isInternetOnline
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              : 'bg-amber-950/70 border-amber-600/80 text-amber-300 shadow-sm'
          }`}
        >
          {isInternetOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">Offline Mode</span>
            </>
          )}
        </button>

        {/* BLE Gateway Link Toggle */}
        <button
          onClick={toggleBleConnection}
          title={isBleConnected ? 'BLE Connected to Local Node' : 'BLE Disconnected'}
          className={`p-1.5 rounded-lg border text-xs transition-colors hidden sm:flex items-center ${
            isBleConnected
              ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:border-slate-700'
              : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <Bluetooth className="w-4 h-4" />
        </button>

        {/* Demo Scenarios Button */}
        <button
          onClick={onOpenDemo}
          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">SIH Demos</span>
        </button>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <span className="text-slate-400 hidden xl:inline">Role:</span>
            <span className="truncate max-w-[110px]">{currentUser.role.split(' ')[0]}</span>
            <span className="text-[10px] text-slate-500">&or;</span>
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/80">
                Switch Stakeholder Role
              </div>
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentUserRole(role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    currentUser.role === role
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{role}</span>
                  {currentUser.role === role && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Help Glossary Modal Trigger */}
        <button
          onClick={onOpenHelp}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          title="Architecture Glossary"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
