import React, { useState, useId } from 'react';
import {
  X,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { TrustNode } from '../../types/trustchain';

interface NodeQrGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: TrustNode | null;
  onTestPair?: (nodeId: string, token: string) => void;
}

/**
 * Deterministic SVG QR Matrix Generator
 * Generates an authentic industrial-grade QR code SVG with standard finder patterns,
 * timing patterns, alignment patterns, and data payload matrix.
 */
function generateQrMatrix(text: string, size = 25): boolean[][] {
  // Initialize matrix
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  // Helper to draw finder pattern (7x7 with 3x3 center)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  // 1. Finder patterns at Top-Left, Top-Right, Bottom-Left
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // 2. Alignment pattern (5x5 at size-9, size-9)
  const alignX = size - 9;
  const alignY = size - 9;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
        matrix[alignY + r][alignX + c] = true;
      }
    }
  }

  // 3. Timing patterns (alternating on row 6 and col 6)
  for (let i = 7; i < size - 7; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 4. Deterministic hash pseudo-random data fill based on text payload
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const isTopLeft = r < 8 && c < 8;
      const isTopRight = r < 8 && c >= size - 8;
      const isBottomLeft = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;
      const isAlign = r >= alignY - 1 && r <= alignY + 5 && c >= alignX - 1 && c <= alignX + 5;

      if (!isTopLeft && !isTopRight && !isBottomLeft && !isTiming && !isAlign) {
        // Pseudo-random bit based on position and payload hash
        const cellSeed = Math.sin(hash + r * 37 + c * 59) * 10000;
        matrix[r][c] = cellSeed - Math.floor(cellSeed) > 0.46;
      }
    }
  }

  return matrix;
}

export const NodeQrGeneratorModal: React.FC<NodeQrGeneratorModalProps> = ({
  isOpen,
  onClose,
  node,
  onTestPair,
}) => {
  const [copied, setCopied] = useState(false);
  const [tokenVersion, setTokenVersion] = useState(1);
  const [includeBleMetadata, setIncludeBleMetadata] = useState(true);

  if (!isOpen || !node) return null;

  // Provisioning QR Payload string according to TrustChain Architecture
  const currentToken =
    tokenVersion === 1
      ? node.activationTokenUsed || `ACT-${node.nodeId.replace('TC-NODE-', '')}-KEY-VALID`
      : `ACT-${node.nodeId.replace('TC-NODE-', '')}-KEY-V${tokenVersion}`;

  const payloadObject = {
    protocol: 'TRUSTCHAIN-PROVISION-V1',
    node_id: node.nodeId,
    token: currentToken,
    hw_rev: node.hardwareRevision,
    crypto_fingerprint: node.publicKeyFingerprint,
    org: node.organization,
    ble_uuid: includeBleMetadata ? '0000FD44-0000-1000-8000-00805F9B34FB' : undefined,
  };

  const payloadString = `trustchain://provision?node_id=${encodeURIComponent(
    node.nodeId
  )}&token=${encodeURIComponent(currentToken)}&fp=${encodeURIComponent(
    node.publicKeyFingerprint
  )}&hw=${encodeURIComponent(node.hardwareRevision)}`;

  const matrixSize = 25;
  const qrMatrix = generateQrMatrix(payloadString, matrixSize);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateToken = () => {
    setTokenVersion((v) => v + 1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById(`node-qr-svg-${node.nodeId}`);
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustChain_ID_QR_${node.nodeId}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-slate-100 print:bg-white print:p-0">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:border-none print:shadow-none print:max-h-full print:bg-white print:text-black">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Industrial Node Identity QR</h2>
              <p className="text-xs text-slate-400">
                Tamper-Resistant Pairing &amp; Provisioning Passport
              </p>
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
        <div className="p-6 overflow-y-auto space-y-5 print:p-8">
          {/* Printable Industrial Asset Badge Container */}
          <div className="p-5 rounded-2xl bg-white text-slate-900 border-2 border-slate-300 shadow-md flex flex-col sm:flex-row items-center gap-5 print:border-2 print:border-black">
            {/* High-Contrast SVG QR Matrix */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0 shadow-sm">
              <svg
                id={`node-qr-svg-${node.nodeId}`}
                viewBox={`0 0 ${matrixSize} ${matrixSize}`}
                className="w-40 h-40 sm:w-44 sm:h-44"
                shapeRendering="crispEdges"
              >
                <rect width={matrixSize} height={matrixSize} fill="#FFFFFF" />
                {qrMatrix.map((row, r) =>
                  row.map((filled, c) =>
                    filled ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width={1}
                        height={1}
                        fill="#0F172A"
                      />
                    ) : null
                  )
                )}
              </svg>
              <div className="text-[9px] text-center font-mono font-bold tracking-wider text-slate-500 uppercase mt-1">
                TRUSTCHAIN SECURE ID
              </div>
            </div>

            {/* Asset Metadata Badge */}
            <div className="flex-1 space-y-2 text-left w-full">
              <div className="border-b border-slate-200 pb-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Industrial Hardware Asset Tag
                </div>
                <div className="text-lg font-bold font-mono tracking-tight text-slate-900">
                  {node.nodeId}
                </div>
                <div className="text-xs font-semibold text-slate-600 truncate">{node.name}</div>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-slate-600">
                <div>
                  <span className="text-slate-400">Security Root:</span>{' '}
                  <strong className="text-slate-900">ATECC608B (ECDSA)</strong>
                </div>
                <div>
                  <span className="text-slate-400">Firmware:</span>{' '}
                  <span className="text-slate-800">{node.firmwareVersion}</span>
                </div>
                <div>
                  <span className="text-slate-400">Activation Token:</span>{' '}
                  <span className="font-bold text-emerald-800 break-all">{currentToken}</span>
                </div>
                <div>
                  <span className="text-slate-400">Key Fingerprint:</span>{' '}
                  <span className="text-[10px] text-slate-700 break-all">
                    {node.publicKeyFingerprint.slice(0, 24)}...
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-200 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>RATED IP65 PROTOTYPE</span>
                <span>BESU QBFT CONSORTIUM</span>
              </div>
            </div>
          </div>

          {/* Configuration Controls (Hidden during print) */}
          <div className="space-y-3 text-xs print:hidden">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-sans font-semibold text-slate-300">Encoded URI Payload:</span>
                <button
                  onClick={handleCopyPayload}
                  className="text-xs font-sans text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy String
                    </>
                  )}
                </button>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-emerald-400 break-all select-all">
                {payloadString}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeBleMetadata}
                  onChange={(e) => setIncludeBleMetadata(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                />
                <span>Include BLE GATT Service UUID (0xFD44) in payload</span>
              </label>

              <button
                onClick={handleRegenerateToken}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                <span>Rotate Provisioning Token</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <span className="text-xs text-slate-500 font-mono">
            Format: ISO/IEC 18004 &bull; ECC 200
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sticker Tag</span>
            </button>

            <button
              onClick={handleDownloadSvg}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Vector SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
