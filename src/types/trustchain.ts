/**
 * TrustChain TypeScript Type Definitions
 * Strictly adhering to the frozen architecture specifications:
 * - HMAC-SHA256 Chaining
 * - ATECC608B Hardware Cryptographic Root of Trust
 * - FRAM (Critical Journal) + NOR Flash (Bulk Telemetry)
 * - Besu QBFT Blockchain Anchoring
 * - EPCIS 2.0 Backend Standard
 * - Sequence-first ordering with signed Time Quality
 * - Factual verification states (No arbitrary single-number scoreboards)
 */

export type UserRole =
  | 'Farmer / Producer'
  | 'Collection Center'
  | 'Transporter'
  | 'Warehouse'
  | 'Processor'
  | 'Distributor'
  | 'Buyer'
  | 'Auditor'
  | 'Regulator'
  | 'System Administrator';

export type TimeQualityState = 'SYNCED' | 'DRIFTING' | 'RESET';

export type VerificationState =
  | 'VERIFIED'
  | 'VERIFYING'
  | 'INTEGRITY CONFLICT'
  | 'GAP DETECTED'
  | 'TRUNCATION / ROLLBACK'
  | 'SIGNATURE INVALID'
  | 'COUNTER MISMATCH';

export type GasQualityState = 'WARMUP' | 'OK' | 'DRIFT_SUSPECT';

export type SupplyChainStage =
  | 'FARM'
  | 'COLLECTION'
  | 'TRANSPORT'
  | 'COLD STORAGE'
  | 'PROCESSING'
  | 'WAREHOUSE'
  | 'DISTRIBUTION'
  | 'RETAIL';

export type IncidentStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'CLOSED';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface TelemetryRecord {
  sequence: number;
  timestamp: string;
  isReconstructedTime?: boolean;
  timeQuality: TimeQualityState;
  temperatureC: number;
  humidityRH: number;
  ethylenePpm: number;
  ethyleneQuality: GasQualityState;
  batteryPct: number;
  motionDetected: boolean;
  lidOpen: boolean;
  headHmac: string;
  monotonicCounter: number;
}

export interface CheckpointRecord {
  checkpointNumber: number;
  sequenceStart: number;
  sequenceEnd: number;
  counter: number;
  headHmac: string;
  merkleRoot: string;
  timeQuality: TimeQualityState;
  witnessId: string;
  signature: string;
  verificationResult: 'VALID' | 'INVALID' | 'PENDING';
  createdAt: string;
}

export interface WitnessReceipt {
  witnessId: string;
  gatewayId: string;
  timestamp: string;
  sequenceWitnessed: number;
  headWitnessed: string;
  signature: string;
  status: 'WITNESSED' | 'NOT YET WITNESSED' | 'PENDING SYNC' | 'VERIFIED';
}

export interface CustodyHandoverRecord {
  id: string;
  batchId: string;
  nodeId: string;
  fromParty: string;
  toParty: string;
  fromRole: UserRole;
  toRole: UserRole;
  sequence: number;
  headHmac: string;
  timestamp: string;
  signatureA: string;
  signatureB: string;
  witnessStatus: 'WITNESSED' | 'VERIFIED' | 'PENDING';
  locationName: string;
  stage: SupplyChainStage;
}

export interface TrustNode {
  nodeId: string;
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'REVOKED' | 'STANDBY';
  batchAssigned?: string;
  organization: string;
  lastSeen: string;
  lastSync: string;
  batteryPct: number;
  batteryState: 'NOMINAL' | 'LOW' | 'CHARGING' | 'HARVESTING_PV';
  firmwareVersion: string;
  hardwareRevision: string;
  hardwareStatus: 'NOMINAL' | 'FAULT' | 'MAINTENANCE_REQUIRED';
  verificationStatus: VerificationState;
  publicKeyFingerprint: string;
  activationTokenUsed: string;
  counterValue: number;
  latestSequenceNumber: number;
  latestCheckpoint: number;
  lastWitness: string;
  timeQuality: TimeQualityState;
  framUtilizationPct: number;
  norFlashUtilizationPct: number;
  supercapacitorVolts: number;
  isBleConnected: boolean;
}

export interface BatchLot {
  batchId: string;
  lotId: string;
  productName: string;
  productCategory: string;
  quantity: string;
  sourceOrigin: string;
  currentStage: SupplyChainStage;
  createdAt: string;
  currentOwner: string;
  nodeAssigned: string;
  status: 'ACTIVE' | 'IN_TRANSIT' | 'STORED' | 'CLOSED' | 'ARCHIVED';
  verificationStatus: VerificationState;
  blockchainTxHash?: string;
  blockchainBlock?: number;
  merkleRoot?: string;
  excursionCount: number;
  tamperCount: number;
}

export interface ExcursionEvent {
  id: string;
  batchId: string;
  nodeId: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'ETHYLENE' | 'TAMPER' | 'LOW_ENERGY' | 'TIME_RESET';
  startTime: string;
  endTime?: string;
  peakValue: number;
  minValue: number;
  durationMinutes: number;
  sequenceStart: number;
  sequenceEnd: number;
  verificationStatus: VerificationState;
  resolved: boolean;
}

export interface SystemEvent {
  id: string;
  eventType:
    | 'BOOT'
    | 'POWER_FAIL_RECOVERY'
    | 'LOW_ENERGY_MODE'
    | 'SENSOR_FAULT'
    | 'GAS_SENSOR_WARMUP'
    | 'TAMPER_LID'
    | 'TAMPER_MOTION'
    | 'TIME_RESET'
    | 'WITNESS_STORED'
    | 'CUSTODY_HANDOVER'
    | 'SYNC_START'
    | 'SYNC_END';
  sequence: number;
  timestamp: string;
  timeQuality: TimeQualityState;
  batchId: string;
  nodeId: string;
  verified: boolean;
  description: string;
}

export interface BlockchainAnchor {
  network: 'Besu QBFT Private Consortium' | 'Besu QBFT Testnet';
  blockNumber: number;
  txHash: string;
  merkleRoot: string;
  sequenceStart: number;
  sequenceEnd: number;
  counterMax: number;
  nodeId: string;
  batchId: string;
  timestamp: string;
  validatorAddresses: string[];
  verificationState: 'CONFIRMED' | 'PENDING' | 'REJECTED';
}

export interface IncidentRecord {
  incidentId: string;
  type: string;
  nodeId: string;
  batchId: string;
  sequence: number;
  timestamp: string;
  evidenceStatus: VerificationState;
  description: string;
  severity: AlertSeverity;
  assignedUser: string;
  status: IncidentStatus;
  notes: string[];
  resolution?: string;
  closureTime?: string;
}

export interface AlertNotification {
  id: string;
  category:
    | 'TEMPERATURE_EXCURSION'
    | 'HUMIDITY_EXCURSION'
    | 'ETHYLENE_THRESHOLD'
    | 'SENSOR_FAILURE'
    | 'GAS_WARMUP'
    | 'TAMPER_LID'
    | 'TAMPER_MOTION'
    | 'LOW_ENERGY'
    | 'TIME_RESET'
    | 'SYNC_FAILURE'
    | 'GAP_DETECTED'
    | 'INTEGRITY_CONFLICT'
    | 'ROLLBACK_DETECTED'
    | 'SIGNATURE_FAILURE'
    | 'BLOCKCHAIN_ANCHOR_PENDING';
  severity: AlertSeverity;
  timestamp: string;
  nodeId: string;
  batchId: string;
  stage: SupplyChainStage;
  description: string;
  evidenceRef: string;
  acknowledged: boolean;
  resolved: boolean;
  read: boolean;
}

export interface OfflineQueueItem {
  id: string;
  type: 'TELEMETRY_CHUNK' | 'HANDOVER_SIGNATURE' | 'WITNESS_RECEIPT' | 'EVENT';
  sequenceRange: string;
  recordsCount: number;
  createdAt: string;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'ACKNOWLEDGED';
}

export interface DiagnosticTestResult {
  name: string;
  category: 'HARDWARE' | 'CRYPTO' | 'STORAGE' | 'COMMUNICATION';
  status: 'PASS' | 'WARN' | 'FAIL' | 'TESTING';
  latencyMs: number;
  details: string;
}

export interface EPCISEvent {
  eventId: string;
  type: 'ObjectEvent' | 'TransformationEvent' | 'AggregationEvent';
  eventTime: string;
  eventTimeZoneOffset: string;
  epcList: string[];
  action: 'OBSERVE' | 'ADD' | 'DELETE';
  bizStep: string;
  disposition: string;
  readPoint: string;
  bizLocation: string;
  sensorElements: Array<{
    sensorReport: {
      type: string;
      value: number;
      uom: string;
    };
    time: string;
  }>;
  trustChainMetadata: {
    sequenceStart: number;
    sequenceEnd: number;
    headHmac: string;
    merkleRoot: string;
    blockchainAnchorBlock: number;
    timeQuality: TimeQualityState;
  };
}
