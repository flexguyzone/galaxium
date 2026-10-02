import React from 'react';
import { GitBranch, RefreshCw } from 'lucide-react';
import ModuleCard from './ModuleCard';
import { EMISSION, PREMINE, COIN, fmt } from '@/lib/galaxium';

const QIPS = [
  { id: 'QIP-001', title: 'Post-Quantum Signature Enforcement (ML-DSA + SLH-DSA)', status: 'Active', version: 'v1.4.2' },
  { id: 'QIP-002', title: 'GVM Gas Schedule Repricing', status: 'Voting', version: '—' },
  { id: 'QIP-003', title: 'DAG Block Width Expansion (8 → 12 parallel)', status: 'Voting', version: '—' },
];

const STATUS_COLOR = { Active: 'bg-primary', Voting: 'bg-gold', Queued: 'bg-secondary' };

export default function ProtocolWidget() {
  const emitted = PREMINE.amount + EMISSION.annualGXM;
  const pctSupply = (emitted / COIN.maxSupply) * 100;

  return (
    <ModuleCard
      title="Protocol & Governance"
      icon={GitBranch}
      right={
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <RefreshCw size={11} className="text-primary" /> Self-upgrading
        </span>
      }
    >
      <div className="mb-4 rounded-lg border border-border bg-background/60 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground">Emission Schedule</span>
          <span className="text-foreground">Year 1 of {fmt(EMISSION.years)}</span>
        </div>
        <div className="mb-2 flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-foreground">{fmt(EMISSION.annualGXM)}</span>
          <span className="text-xs font-mono text-primary">GXM / year — fixed, no halvings</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.6)]" style={{ width: `${Math.max(pctSupply, 1.5)}%` }} />
        </div>
        <p className="mt-2 text-[10px] font-mono text-muted-foreground">
          {fmt(emitted)} / {fmt(COIN.maxSupply)} GXM emitted ({pctSupply.toFixed(2)}%) — stable rate until year {EMISSION.genesisYear + EMISSION.years}
        </p>
      </div>

      <div className="space-y-2">
        {QIPS.map((q) => (
          <div key={q.id} className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[q.status]}`} />
              <span className="text-foreground">{q.id}</span>
              <span className="hidden truncate text-muted-foreground md:inline">{q.title}</span>
            </div>
            <span className="flex items-center gap-2 text-muted-foreground">
              {q.version !== '—' && <span className="text-primary">{q.version}</span>}
              {q.status}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] font-mono text-muted-foreground">
        Consensus Core v1.4.2 · versioned modules upgrade on-chain via QIPs — no hard fork required
      </p>
    </ModuleCard>
  );
}