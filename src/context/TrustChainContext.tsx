import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  VerificationState,
  TimeQualityState,
  GasQualityState,
  SupplyChainStage,
  TrustNode,
  BatchLot,
  TelemetryRecord,
  CheckpointRecord,
  WitnessReceipt,
  CustodyHandoverRecord,
  ExcursionEvent,
  SystemEvent,
  BlockchainAnchor,
  IncidentRecord,
  AlertNotification,
  OfflineQueueItem,
  EPCISEvent,
  DiagnosticTestResult,
} from '../types/trustchain';
import {
  INITIAL_NODES,
  INITIAL_BATCHES,
  INITIAL_TELEMETRY,
  INITIAL_CHECKPOINTS,
  INITIAL_CUSTODY_HANDOVERS,
  INITIAL_EXCURSIONS,
  INITIAL_INCIDENTS,
  INITIAL_ALERTS,
  INITIAL_BLOCKCHAIN_ANCHORS,
  INITIAL_OFFLINE_QUEUE,
  INITIAL_EPCIS_EVENTS,
  INITIAL_DIAGNOSTICS,
} from '../data/mockDatabase';

export type AppInterfaceMode = 'MOBILE' | 'WEB';

export interface AuditTrailLog {
  id: string;
  action: string;
  user: string;
  role: UserRole;
  timestamp: string;
  details: string;
}

interface TrustChainContextType {
  // Navigation & User
  interfaceMode: AppInterfaceMode;
  setInterfaceMode: (mode: AppInterfaceMode) => void;
  currentUser: {
    userId: string;
    name: string;
    organization: string;
    role: UserRole;
    isBiometricActive: boolean;
    appPin: string;
    deviceTrusted: boolean;
  };
  setCurrentUserRole: (role: UserRole) => void;
  updateUserProfile: (name: string, org: string) => void;

  // Global Hardware / Connectivity Flags
  isInternetOnline: boolean;
  setIsInternetOnline: (online: boolean) => void;
  isBleConnected: boolean;
  toggleBleConnection: () => void;
  selectedBatchId: string;
  setSelectedBatchId: (batchId: string) => void;
  selectedNodeId: string;
  setSelectedNodeId: (nodeId: string) => void;

  // Core Data
  nodes: TrustNode[];
  batches: BatchLot[];
  telemetry: TelemetryRecord[];
  checkpoints: CheckpointRecord[];
  custodyHandovers: CustodyHandoverRecord[];
  excursions: ExcursionEvent[];
  incidents: IncidentRecord[];
  alerts: AlertNotification[];
  blockchainAnchors: BlockchainAnchor[];
  offlineQueue: OfflineQueueItem[];
  epcisEvents: EPCISEvent[];
  systemEvents: SystemEvent[];
  auditLogs: AuditTrailLog[];
  diagnostics: DiagnosticTestResult[];

  // Node Actions
  activateNode: (nodeId: string, name: string, token: string, org: string) => boolean;
  revokeNode: (nodeId: string, reason: string) => void;
  replaceNode: (oldNodeId: string, newNodeId: string, name: string) => void;
  renameNode: (nodeId: string, newName: string) => void;

  // Batch Actions
  createBatch: (data: Partial<BatchLot>) => void;
  bindNodeToBatch: (batchId: string, nodeId: string) => void;
  unbindNodeFromBatch: (batchId: string) => void;

  // Handover & Verification
  executeCustodyHandover: (params: {
    batchId: string;
    nodeId: string;
    fromParty: string;
    toParty: string;
    fromRole: UserRole;
    toRole: UserRole;
    stage: SupplyChainStage;
    locationName: string;
  }) => void;
  verifyBatchEvidence: (batchId: string) => {
    status: VerificationState;
    details: string;
    merkleRootMatch: boolean;
    counterMonotonic: boolean;
    gapsCount: number;
  };

  // Sync & Queue
  syncNow: () => Promise<void>;
  isSyncing: boolean;
  syncProgress: number;

  // Alerts & Incidents
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  createIncident: (incident: Partial<IncidentRecord>) => void;
  resolveIncident: (incidentId: string, resolution: string) => void;

  // Attack Simulator
  simulateAttack: (attackType: string) => {
    attackName: string;
    baselineVulnerability: string;
    trustChainDetection: string;
    status: VerificationState;
    evidenceGenerated: string;
  };
  activeAttackState: {
    attackName: string;
    status: VerificationState;
    alertGenerated: string;
    isCompromised: boolean;
  } | null;
  resetAttackState: () => void;

  // Diagnostics & Calibration
  runDiagnostics: () => void;
  isDiagnosing: boolean;
  calibrateEthyleneSensor: (operator: string, zeroPpm: number, spanPpm: number) => void;

  // Demo Scenarios
  loadDemoScenario: (scenario: 'nominal' | 'excursion' | 'tamper' | 'offline_sync' | 'attack') => void;
}

const TrustChainContext = createContext<TrustChainContextType | undefined>(undefined);

export const TrustChainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interfaceMode, setInterfaceMode] = useState<AppInterfaceMode>('MOBILE');
  const [currentUser, setCurrentUser] = useState({
    userId: 'USR-TC-9801',
    name: 'Vikram Mehta',
    organization: 'Apex AgriLogistics Consortium',
    role: 'Transporter' as UserRole,
    isBiometricActive: true,
    appPin: '4820',
    deviceTrusted: true,
  });

  const [isInternetOnline, setIsInternetOnline] = useState<boolean>(true);
  const [isBleConnected, setIsBleConnected] = useState<boolean>(true);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('BF-2026-001');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('TC-001-A3F2');

  const [nodes, setNodes] = useState<TrustNode[]>(INITIAL_NODES);
  const [batches, setBatches] = useState<BatchLot[]>(INITIAL_BATCHES);
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>(INITIAL_TELEMETRY);
  const [checkpoints, setCheckpoints] = useState<CheckpointRecord[]>(INITIAL_CHECKPOINTS);
  const [custodyHandovers, setCustodyHandovers] = useState<CustodyHandoverRecord[]>(INITIAL_CUSTODY_HANDOVERS);
  const [excursions, setExcursions] = useState<ExcursionEvent[]>(INITIAL_EXCURSIONS);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(INITIAL_INCIDENTS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [blockchainAnchors, setBlockchainAnchors] = useState<BlockchainAnchor[]>(INITIAL_BLOCKCHAIN_ANCHORS);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>(INITIAL_OFFLINE_QUEUE);
  const [epcisEvents, setEpcisEvents] = useState<EPCISEvent[]>(INITIAL_EPCIS_EVENTS);
  const [diagnostics, setDiagnostics] = useState<DiagnosticTestResult[]>(INITIAL_DIAGNOSTICS);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>([
    {
      id: 'LOG-001',
      action: 'BATCH_BINDING',
      user: 'Vikram Mehta',
      role: 'Transporter',
      timestamp: '2026-09-29 06:45:00 UTC',
      details: 'Bound TC-NODE-8821 to BATCH-2026-ALPH-09 at Nashik Hub',
    },
    {
      id: 'LOG-002',
      action: 'CUSTODY_HANDOVER',
      user: 'Ramesh Patil',
      role: 'Farmer / Producer',
      timestamp: '2026-09-28 09:15:00 UTC',
      details: 'Signed custody transfer to Deogad Collection Center',
    },
    {
      id: 'LOG-003',
      action: 'BLOCKCHAIN_ANCHOR',
      user: 'Besu QBFT Daemon',
      role: 'System Administrator',
      timestamp: '2026-09-30 08:35:14 UTC',
      details: 'Anchored Merkle Root 0x99e821fa in Block #4892104',
    },
  ]);

  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([
    {
      id: 'EVT-01',
      eventType: 'BOOT',
      sequence: 1,
      timestamp: '2026-09-27 06:00:00 UTC',
      timeQuality: 'SYNCED',
      batchId: 'BATCH-2026-ALPH-09',
      nodeId: 'TC-NODE-8821',
      verified: true,
      description: 'Secure Boot v1.4.2 validated with eFuse HMAC and ATECC608B root',
    },
    {
      id: 'EVT-02',
      eventType: 'POWER_FAIL_RECOVERY',
      sequence: 288,
      timestamp: '2026-09-30 02:40:00 UTC',
      timeQuality: 'SYNCED',
      batchId: 'BATCH-2026-ALPH-09',
      nodeId: 'TC-NODE-8821',
      verified: true,
      description: 'FRAM journal committed seamlessly during reefer restart. 0 records lost.',
    },
  ]);

  // Sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(100);

  // Attack simulator state
  const [activeAttackState, setActiveAttackState] = useState<{
    attackName: string;
    status: VerificationState;
    alertGenerated: string;
    isCompromised: boolean;
  } | null>(null);

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    addAuditLog('ROLE_SWITCH', `Switched active perspective to ${role}`);
  };

  const updateUserProfile = (name: string, org: string) => {
    setCurrentUser((prev) => ({ ...prev, name, organization: org }));
    addAuditLog('PROFILE_UPDATE', `Updated user credentials for ${name} (${org})`);
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditTrailLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      action,
      user: currentUser.name,
      role: currentUser.role,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const toggleBleConnection = () => {
    setIsBleConnected((prev) => {
      const next = !prev;
      setNodes((nodesList) =>
        nodesList.map((n) => (n.nodeId === selectedNodeId ? { ...n, isBleConnected: next } : n))
      );
      addAuditLog(next ? 'BLE_CONNECTED' : 'BLE_DISCONNECTED', `BLE Gateway link ${next ? 'established' : 'severed'}`);
      return next;
    });
  };

  // Node Actions
  const activateNode = (nodeId: string, name: string, token: string, org: string): boolean => {
    if (!token.startsWith('ACT-')) {
      return false;
    }
    const newNode: TrustNode = {
      nodeId,
      name,
      status: 'CONNECTED',
      organization: org,
      lastSeen: 'Just now',
      lastSync: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      batteryPct: 100,
      batteryState: 'NOMINAL',
      firmwareVersion: 'v1.4.2-qbft',
      hardwareRevision: 'HW-REV-C-ATECC608B',
      hardwareStatus: 'NOMINAL',
      verificationStatus: 'VERIFIED',
      publicKeyFingerprint: '04:' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':'),
      activationTokenUsed: token,
      counterValue: 1,
      latestSequenceNumber: 1,
      latestCheckpoint: 0,
      lastWitness: 'GATEWAY-MOBILE-01',
      timeQuality: 'SYNCED',
      framUtilizationPct: 2,
      norFlashUtilizationPct: 1,
      supercapacitorVolts: 3.3,
      isBleConnected: true,
    };
    setNodes((prev) => [newNode, ...prev]);
    setSelectedNodeId(nodeId);
    addAuditLog('NODE_ACTIVATION', `Activated node ${nodeId} via QR activation token`);
    return true;
  };

  const revokeNode = (nodeId: string, reason: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.nodeId === nodeId ? { ...n, status: 'REVOKED', verificationStatus: 'INTEGRITY CONFLICT' } : n))
    );
    addAuditLog('NODE_REVOKED', `Revoked node ${nodeId}. Reason: ${reason}`);
  };

  const replaceNode = (oldNodeId: string, newNodeId: string, name: string) => {
    const oldNode = nodes.find((n) => n.nodeId === oldNodeId);
    const prevAnchorSeq = oldNode ? oldNode.latestSequenceNumber : 0;
    revokeNode(oldNodeId, 'Superseded by hardware replacement workflow');
    
    const newNode: TrustNode = {
      nodeId: newNodeId,
      name,
      status: 'CONNECTED',
      batchAssigned: oldNode?.batchAssigned,
      organization: oldNode?.organization || 'Apex AgriLogistics Consortium',
      lastSeen: 'Just now',
      lastSync: 'Pending genesis sync',
      batteryPct: 100,
      batteryState: 'NOMINAL',
      firmwareVersion: 'v1.4.2-qbft',
      hardwareRevision: 'HW-REV-C-ATECC608B',
      hardwareStatus: 'NOMINAL',
      verificationStatus: 'VERIFIED',
      publicKeyFingerprint: '04:DD:88:' + Math.random().toString(16).slice(2, 8).toUpperCase(),
      activationTokenUsed: 'ACT-REPLACE-GENESIS',
      counterValue: 1,
      latestSequenceNumber: prevAnchorSeq + 1,
      latestCheckpoint: oldNode ? oldNode.latestCheckpoint + 1 : 1,
      lastWitness: 'GATEWAY-GENESIS-CHAIN',
      timeQuality: 'SYNCED',
      framUtilizationPct: 4,
      norFlashUtilizationPct: 2,
      supercapacitorVolts: 3.3,
      isBleConnected: true,
    };
    setNodes((prev) => [newNode, ...prev]);
    setSelectedNodeId(newNodeId);

    if (oldNode?.batchAssigned) {
      setBatches((prev) =>
        prev.map((b) => (b.batchId === oldNode.batchAssigned ? { ...b, nodeAssigned: newNodeId } : b))
      );
    }
    addAuditLog('NODE_REPLACEMENT', `Replaced ${oldNodeId} with ${newNodeId}. Continued chain from SEQ ${prevAnchorSeq}`);
  };

  const renameNode = (nodeId: string, newName: string) => {
    setNodes((prev) => prev.map((n) => (n.nodeId === nodeId ? { ...n, name: newName } : n)));
    addAuditLog('NODE_RENAME', `Renamed node ${nodeId} to ${newName}`);
  };

  // Batch Actions
  const createBatch = (data: Partial<BatchLot>) => {
    const newBatchId = data.batchId || `BATCH-2026-N${Math.floor(1000 + Math.random() * 9000)}`;
    const newBatch: BatchLot = {
      batchId: newBatchId,
      lotId: data.lotId || `LOT-${Math.floor(100 + Math.random() * 900)}`,
      productName: data.productName || 'Export Agricultural Batch',
      productCategory: data.productCategory || 'Horticulture',
      quantity: data.quantity || '1,000 kg',
      sourceOrigin: data.sourceOrigin || 'Certified Producer Farm',
      currentStage: data.currentStage || 'FARM',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      currentOwner: currentUser.name,
      nodeAssigned: data.nodeAssigned || '',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      excursionCount: 0,
      tamperCount: 0,
    };
    setBatches((prev) => [newBatch, ...prev]);
    setSelectedBatchId(newBatchId);
    addAuditLog('BATCH_CREATED', `Created new lot ${newBatch.lotId} under ${newBatchId}`);
  };

  const bindNodeToBatch = (batchId: string, nodeId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.batchId === batchId ? { ...b, nodeAssigned: nodeId } : b))
    );
    setNodes((prev) =>
      prev.map((n) => (n.nodeId === nodeId ? { ...n, batchAssigned: batchId } : n))
    );
    addAuditLog('BATCH_BOUND', `Bound node ${nodeId} to batch ${batchId}`);
  };

  const unbindNodeFromBatch = (batchId: string) => {
    const batch = batches.find((b) => b.batchId === batchId);
    if (batch?.nodeAssigned) {
      setNodes((prev) =>
        prev.map((n) => (n.nodeId === batch.nodeAssigned ? { ...n, batchAssigned: undefined } : n))
      );
    }
    setBatches((prev) =>
      prev.map((b) => (b.batchId === batchId ? { ...b, nodeAssigned: '' } : b))
    );
    addAuditLog('BATCH_UNBOUND', `Unbound node from batch ${batchId}`);
  };

  // Offline Custody Handover
  const executeCustodyHandover = (params: {
    batchId: string;
    nodeId: string;
    fromParty: string;
    toParty: string;
    fromRole: UserRole;
    toRole: UserRole;
    stage: SupplyChainStage;
    locationName: string;
  }) => {
    const latestSeq = telemetry.length > 0 ? telemetry[0].sequence : 384;
    const latestHmac = telemetry.length > 0 ? telemetry[0].headHmac : '0x7e8b91c049f...';

    const handoverRecord: CustodyHandoverRecord = {
      id: `HO-${Date.now().toString().slice(-4)}`,
      batchId: params.batchId,
      nodeId: params.nodeId,
      fromParty: params.fromParty,
      toParty: params.toParty,
      fromRole: params.fromRole,
      toRole: params.toRole,
      sequence: latestSeq,
      headHmac: latestHmac,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      signatureA: `SIG_ECDSA_ATECC608B_${params.fromRole.slice(0, 4).toUpperCase()}_${latestSeq}`,
      signatureB: `SIG_ECDSA_GATEWAY_${params.toRole.slice(0, 4).toUpperCase()}_${latestSeq}`,
      witnessStatus: isInternetOnline ? 'VERIFIED' : 'PENDING',
      locationName: params.locationName,
      stage: params.stage,
    };

    setCustodyHandovers((prev) => [handoverRecord, ...prev]);

    // Update batch owner & stage
    setBatches((prev) =>
      prev.map((b) =>
        b.batchId === params.batchId
          ? {
              ...b,
              currentStage: params.stage,
              currentOwner: `${params.toRole} (${params.toParty})`,
            }
          : b
      )
    );

    // Queue for sync if offline
    if (!isInternetOnline) {
      setOfflineQueue((prev) => [
        {
          id: `Q-HO-${handoverRecord.id}`,
          type: 'HANDOVER_SIGNATURE',
          sequenceRange: `SEQ: ${latestSeq}`,
          recordsCount: 1,
          createdAt: handoverRecord.timestamp,
          retryCount: 0,
          status: 'PENDING',
        },
        ...prev,
      ]);
    }

    addAuditLog(
      'CUSTODY_HANDOVER',
      `Custody transferred from ${params.fromParty} to ${params.toParty} at ${params.locationName}`
    );
  };

  // Verification
  const verifyBatchEvidence = (batchId: string) => {
    if (activeAttackState?.isCompromised) {
      return {
        status: activeAttackState.status,
        details: activeAttackState.alertGenerated,
        merkleRootMatch: false,
        counterMonotonic: false,
        gapsCount: 2,
      };
    }

    return {
      status: 'VERIFIED' as VerificationState,
      details: 'All 384 sequence HMAC chains match ATECC608B signatures and Besu QBFT Block #4892104.',
      merkleRootMatch: true,
      counterMonotonic: true,
      gapsCount: 0,
    };
  };

  // Sync now
  const syncNow = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(10);

    for (let i = 25; i <= 100; i += 25) {
      await new Promise((res) => setTimeout(res, 200));
      setSyncProgress(i);
    }

    setOfflineQueue((prev) =>
      prev.map((q) => ({ ...q, status: 'ACKNOWLEDGED' }))
    );

    // Update node last sync
    setNodes((prev) =>
      prev.map((n) =>
        n.nodeId === selectedNodeId
          ? {
              ...n,
              lastSync: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
              verificationStatus: 'VERIFIED',
            }
          : n
      )
    );

    setIsSyncing(false);
    addAuditLog('SYNC_COMPLETED', 'Synchronized 32 chunk records with Besu QBFT validation anchor');
  };

  // Alert & Incident
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true, acknowledged: true } : a))
    );
  };

  const createIncident = (incident: Partial<IncidentRecord>) => {
    const newInc: IncidentRecord = {
      incidentId: incident.incidentId || `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: incident.type || 'Telemetry Anomaly',
      nodeId: incident.nodeId || selectedNodeId,
      batchId: incident.batchId || selectedBatchId,
      sequence: incident.sequence || 384,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      evidenceStatus: incident.evidenceStatus || 'VERIFIED',
      description: incident.description || 'Cold chain observation flagged for review.',
      severity: incident.severity || 'WARNING',
      assignedUser: incident.assignedUser || currentUser.name,
      status: 'OPEN',
      notes: [`${new Date().toISOString().slice(0, 10)} - Incident filed by ${currentUser.name}`],
    };
    setIncidents((prev) => [newInc, ...prev]);
    addAuditLog('INCIDENT_CREATED', `Filed incident ${newInc.incidentId}: ${newInc.type}`);
  };

  const resolveIncident = (incidentId: string, resolution: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.incidentId === incidentId
          ? {
              ...inc,
              status: 'RESOLVED',
              resolution,
              closureTime: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            }
          : inc
      )
    );
    addAuditLog('INCIDENT_RESOLVED', `Resolved incident ${incidentId}`);
  };

  // Attack simulator
  const simulateAttack = (attackType: string) => {
    let outcome = {
      attackName: attackType,
      baselineVulnerability: 'Baseline system fails to detect tampering; data silently accepted.',
      trustChainDetection: 'Immediate HMAC mismatch detected. Evidence frozen.',
      status: 'INTEGRITY CONFLICT' as VerificationState,
      evidenceGenerated: 'Conflict event logged with signed mismatch proof.',
    };

    switch (attackType) {
      case 'EDIT_RECORD':
        outcome = {
          attackName: 'Malicious Record Mutation (Temp changed from 12°C to 4°C)',
          baselineVulnerability: 'Normal database / IoT platforms blindly accept altered values.',
          trustChainDetection: 'HMAC-SHA256 of Record #380 does not match chained head. Signature rejected by ATECC608B.',
          status: 'INTEGRITY CONFLICT',
          evidenceGenerated: 'SIGNATURE_INVALID at SEQ:380. Expected: 0x3a475d... Received: 0xbad000...',
        };
        break;
      case 'DELETE_RECORD':
        outcome = {
          attackName: 'Middle Record Deletion (Covering up an excursion)',
          baselineVulnerability: 'Traditional databases allow row deletion without trace.',
          trustChainDetection: 'Strict sequence validation detects missing Sequence 381 in 380..382 interval.',
          status: 'GAP DETECTED',
          evidenceGenerated: 'GAP_DETECTED: Missing SEQ:381. Monotonic counter jump +2 detected.',
        };
        break;
      case 'REORDER_RECORDS':
        outcome = {
          attackName: 'Record Reordering / Permutation',
          baselineVulnerability: 'Time-sorted SQL tables mask out-of-order injection.',
          trustChainDetection: 'Previous HMAC dependency breaks. Reordering fails cryptographic hash chain check.',
          status: 'INTEGRITY CONFLICT',
          evidenceGenerated: 'HMAC_CHAIN_BROKEN at SEQ:379. Parent link points to SEQ:381 instead of 378.',
        };
        break;
      case 'REHASH_CHAIN':
        outcome = {
          attackName: 'Rehash Entire Chain (Counterfeit HMACs)',
          baselineVulnerability: 'Without hardware root of trust, software can rehash its own table.',
          trustChainDetection: 'Fails ATECC608B hardware private-key signature validation on Checkpoint #12.',
          status: 'SIGNATURE INVALID',
          evidenceGenerated: 'ECDSA signature mismatch against public-key fingerprint 04:B2:99... Checkpoint rejected.',
        };
        break;
      case 'TRUNCATION_ROLLBACK':
        outcome = {
          attackName: 'Tail Truncation / Rollback Attack',
          baselineVulnerability: 'Attacker chops off last 50 excursion records and claims node went offline.',
          trustChainDetection: 'Hardware monotonic counter (14,280) exceeds sequence count (14,230). Besu QBFT anchor mismatch.',
          status: 'TRUNCATION / ROLLBACK',
          evidenceGenerated: 'COUNTER_MISMATCH: Monotonic hardware counter is 14280, but submitted records stop at 14230.',
        };
        break;
      case 'RESTORE_FLASH':
        outcome = {
          attackName: 'Flash Image Replay Attack',
          baselineVulnerability: 'Cloning flash memory replays previous authentic readings.',
          trustChainDetection: 'ATECC608B monotonic EEPROM counter increments on write and cannot be restored by flash write.',
          status: 'COUNTER MISMATCH',
          evidenceGenerated: 'REPLAY_DETECTED: Replayed flash counter 12000 < current physical counter 14280.',
        };
        break;
      case 'CLOCK_ROLLBACK':
        outcome = {
          attackName: 'Clock Rollback / RTC Manipulation',
          baselineVulnerability: 'Attacker sets RTC clock backward to forge earlier timestamps.',
          trustChainDetection: 'TrustChain uses Sequence-First ordering. Signed TimeQuality drops to RESET with drift flags.',
          status: 'GAP DETECTED',
          evidenceGenerated: 'TIME_RESET event logged. Reconstructed time flagged. Sequence monotonic order preserved.',
        };
        break;
      case 'SENSOR_RELOCATION':
        outcome = {
          attackName: 'Sensor Removal / Physical Relocation',
          baselineVulnerability: 'Attacker moves node into a cooler box while batch overheats.',
          trustChainDetection: 'Tamper switch tripped (TAMPER_LID) + Accelerometer impulse logged as signed critical event.',
          status: 'INTEGRITY CONFLICT',
          evidenceGenerated: 'TAMPER_LID & TAMPER_MOTION confirmed at SEQ:380. Checkpoint immediately emitted.',
        };
        break;
    }

    setActiveAttackState({
      attackName: outcome.attackName,
      status: outcome.status,
      alertGenerated: outcome.evidenceGenerated,
      isCompromised: true,
    });

    // Also inject an alert into the alert list
    setAlerts((prev) => [
      {
        id: `ALT-ATK-${Date.now().toString().slice(-4)}`,
        category: 'INTEGRITY_CONFLICT',
        severity: 'CRITICAL',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        nodeId: selectedNodeId,
        batchId: selectedBatchId,
        stage: 'TRANSPORT',
        description: `ATTACK SIMULATED: ${outcome.attackName}. ${outcome.evidenceGenerated}`,
        evidenceRef: 'ATECC608B / QBFT Anchor mismatch',
        acknowledged: false,
        resolved: false,
        read: false,
      },
      ...prev,
    ]);

    addAuditLog('ATTACK_SIMULATED', `Simulated attack: ${outcome.attackName}`);
    return outcome;
  };

  const resetAttackState = () => {
    setActiveAttackState(null);
    addAuditLog('ATTACK_RESET', 'Cleared simulated attack state. Restored nominal verification status.');
  };

  // Diagnostics
  const runDiagnostics = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setDiagnostics((prev) =>
        prev.map((d) => ({
          ...d,
          latencyMs: Math.floor(Math.random() * 30) + 4,
          status: 'PASS',
        }))
      );
      setIsDiagnosing(false);
      addAuditLog('DIAGNOSTICS_RUN', 'Self-test completed across 12 hardware and cryptographic subsystems: 12/12 PASS');
    }, 1200);
  };

  // Ethylene Calibration
  const calibrateEthyleneSensor = (operator: string, zeroPpm: number, spanPpm: number) => {
    addAuditLog(
      'ETHYLENE_CALIBRATION',
      `Calibrated electrochemical ethylene cell. Zero baseline: ${zeroPpm} ppm, Span: ${spanPpm} ppm. Operator: ${operator}. Drift flag reset.`
    );
    setTelemetry((prev) =>
      prev.map((t, idx) => (idx === 0 ? { ...t, ethyleneQuality: 'OK' } : t))
    );
  };

  // Demo Scenarios
  const loadDemoScenario = (scenario: 'nominal' | 'excursion' | 'tamper' | 'offline_sync' | 'attack') => {
    resetAttackState();
    switch (scenario) {
      case 'nominal':
        setSelectedBatchId('BATCH-2026-ALPH-09');
        setIsInternetOnline(true);
        setIsBleConnected(true);
        addAuditLog('DEMO_LOADED', 'Loaded Nominal Mango Cold Chain scenario (100% verified)');
        break;
      case 'excursion':
        setSelectedBatchId('BATCH-2026-ALPH-09');
        setTelemetry((prev) => [
          {
            sequence: 385,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            timeQuality: 'SYNCED',
            temperatureC: 11.8,
            humidityRH: 92.4,
            ethylenePpm: 1.45,
            ethyleneQuality: 'OK',
            batteryPct: 87,
            motionDetected: false,
            lidOpen: false,
            headHmac: '0x9999excursion0000111122223333444455556666777788889999aaaabbbbcccc',
            monotonicCounter: 14281,
          },
          ...prev,
        ]);
        setAlerts((prev) => [
          {
            id: `ALT-EXC-${Date.now().toString().slice(-4)}`,
            category: 'TEMPERATURE_EXCURSION',
            severity: 'CRITICAL',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            nodeId: selectedNodeId,
            batchId: selectedBatchId,
            stage: 'TRANSPORT',
            description: 'CRITICAL TEMPERATURE SPIKE: 11.8°C (Limit: 8.0°C). Excursion rate active (1 min).',
            evidenceRef: 'SEQ:385 [Signed by ATECC608B]',
            acknowledged: false,
            resolved: false,
            read: false,
          },
          ...prev,
        ]);
        addAuditLog('DEMO_LOADED', 'Loaded Live Temperature Excursion Scenario (11.8°C spike)');
        break;
      case 'tamper':
        setTelemetry((prev) => [
          {
            sequence: 386,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            timeQuality: 'SYNCED',
            temperatureC: 6.1,
            humidityRH: 89.0,
            ethylenePpm: 1.12,
            ethyleneQuality: 'OK',
            batteryPct: 86,
            motionDetected: true,
            lidOpen: true,
            headHmac: '0xtampersealbroken000111222333444555666777888999aaabbbcccdddeeefff',
            monotonicCounter: 14282,
          },
          ...prev,
        ]);
        setAlerts((prev) => [
          {
            id: `ALT-TMP-${Date.now().toString().slice(-4)}`,
            category: 'TAMPER_LID',
            severity: 'CRITICAL',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
            nodeId: selectedNodeId,
            batchId: selectedBatchId,
            stage: 'TRANSPORT',
            description: 'TAMPER DETECTED: Reefer compartment lid opened during transit. Instant checkpoint triggered.',
            evidenceRef: 'SEQ:386 [Signed by ATECC608B]',
            acknowledged: false,
            resolved: false,
            read: false,
          },
          ...prev,
        ]);
        addAuditLog('DEMO_LOADED', 'Loaded Physical Tamper Event Scenario (Lid Opened)');
        break;
      case 'offline_sync':
        setIsInternetOnline(false);
        setOfflineQueue((prev) => [
          {
            id: 'Q-OFFLINE-RURAL-01',
            type: 'TELEMETRY_CHUNK',
            sequenceRange: 'SEQ: 385..416',
            recordsCount: 32,
            createdAt: '2026-09-30 08:40:00 UTC',
            retryCount: 1,
            status: 'PENDING',
          },
          ...prev,
        ]);
        addAuditLog('DEMO_LOADED', 'Loaded Offline Rural Gateway scenario (Local SQLite queue active)');
        break;
      case 'attack':
        simulateAttack('TRUNCATION_ROLLBACK');
        break;
    }
  };

  return (
    <TrustChainContext.Provider
      value={{
        interfaceMode,
        setInterfaceMode,
        currentUser,
        setCurrentUserRole,
        updateUserProfile,
        isInternetOnline,
        setIsInternetOnline,
        isBleConnected,
        toggleBleConnection,
        selectedBatchId,
        setSelectedBatchId,
        selectedNodeId,
        setSelectedNodeId,
        nodes,
        batches,
        telemetry,
        checkpoints,
        custodyHandovers,
        excursions,
        incidents,
        alerts,
        blockchainAnchors,
        offlineQueue,
        epcisEvents,
        systemEvents,
        auditLogs,
        diagnostics,
        activateNode,
        revokeNode,
        replaceNode,
        renameNode,
        createBatch,
        bindNodeToBatch,
        unbindNodeFromBatch,
        executeCustodyHandover,
        verifyBatchEvidence,
        syncNow,
        isSyncing,
        syncProgress,
        acknowledgeAlert,
        resolveAlert,
        createIncident,
        resolveIncident,
        simulateAttack,
        activeAttackState,
        resetAttackState,
        runDiagnostics,
        isDiagnosing,
        calibrateEthyleneSensor,
        loadDemoScenario,
      }}
    >
      {children}
    </TrustChainContext.Provider>
  );
};

export const useTrustChain = () => {
  const context = useContext(TrustChainContext);
  if (!context) {
    throw new Error('useTrustChain must be used within a TrustChainProvider');
  }
  return context;
};
