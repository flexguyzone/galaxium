import React, { useState } from 'react';
import { GitBranch, RefreshCw, Vote, Layers } from 'lucide-react';
import ModuleCard from '@/components/galaxium/ModuleCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { COIN, EMISSION, PREMINE, fmt } from '@/lib/galaxium';

const INITIAL_QIPS = [
  { id: 'QIP-001', title: 'Post-Quantum Signature Enforcement (ML-DSA + SLH-DSA)', status: 'Active', yes: 94 },
  { id: 'QIP-002', title: 'GVM Gas Schedule Repricing', status: 'Voting', yes: 61 },
  { id: 'QIP-033', title: 'DAG Block Width Expansion (8 → 12 parallel)', status: 'Voting', yes: 48 },
  { id: 'QIP-007', title: 'zkGalaxy Proof Circuits v2 (faster private txs)', status: 'Queued', yes: 0 },
];

const INITIAL_MODULES = [
  { name: 'Consensus Core', version: 'v1.4.2', status: 'Active' },
  { name: 'PQ-Signature Module (ML-DSA / SLH-DSA)', version: 'v1.1.0', status: 'Active' },
  { name: 'GHOSTDAG Ordering Module', version: 'v2.0.1', status: 'Active' },
  { name: 'GVM Execution Module', version: 'v1.3.0', status: 'Active' },
  { name: 'ZK Proof Module (zkGalaxy)', version: 'v0.9.4', status: 'Optional' },
];

const STATUS_STYLE = {
  Active: 'bg-primary/10 text-primary border-primary/30',
  Voting: 'bg-gold/10 text-gold border-gold/30',
  Queued: 'bg-secondary/15 text-secondary border-secondary/30',
};

export default function QIPsPage() {
  const [qips, setQips] = useState(INITIAL_QIPS);
  const [modules, setModules] = useState(INITIAL_MODULES);
  const { toast } = useToast();

  const emitted = PREMINE.amount + EMISSION.annualGXM;
  const pctSupply = (emitted / COIN.maxSupply) * 100;

  const vote = (id) => {
    setQips((qs) => qs.map((q) => (q.id === id ? { ...q, yes: Math.min(100, q.yes + 2) } : q)));
    toast({ title: `Vote cast on ${id}`, description: 'Weight signed with ML-DSA · tallied on-chain' });
  };

  const upgrade = (name) => {
    setModules((ms) =>
      ms.map((m) =>
        m.name === name
          ? { ...m, version: m.version.replace(/(\d+)\.(\d+)\.(\d+)/, (_, a, b, c) => `v${a}.${Number(b) + 1}.0`), status: 'Active' }
          : m
      )
    );
    toast({ title: 'Module upgraded on-chain', description: `${name} hot-swapped via QIP — no hard fork required` });
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight lg:text-[2.25rem]">Network QIPs</h1>
        <p className="mt-1 text-xs font-mono text-muted-foreground lg:text-sm">
          Self-upgrading protocol · on-chain QIPs + versioned consensus modules — no contentious hard forks
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          <ModuleCard title="Emission Tracker" icon={Layers} className="h-full">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <div className="font-display text-3xl font-bold text-foreground">
                  Year 1 <span className="text-base font-medium text-muted-foreground">of {fmt(EMISSION.years)}</span>
                </div>
                <div className="mt-1 text-xs font-mono text-primary">{fmt(EMISSION.annualGXM)} GXM / year — fixed, no halvings</div>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.6)]" style={{ width: `${Math.max(pctSupply, 1.5)}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="rounded-lg border border-border bg-background/60 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Emitted</div>
                <div className="text-foreground">{fmt(emitted)} GXM</div>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Max Supply</div>
                <div className="text-foreground">{fmt(COIN.maxSupply)} GXM</div>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">End Year</div>
                <div className="text-foreground">{EMISSION.genesisYear + EMISSION.years}</div>
              </div>
            </div>
            <p className="mt-3 text-[10px] font-mono text-muted-foreground">
              Instead of halvings, Galaxium emits a constant {fmt(EMISSION.annualGXM)} GXM annually — predictable supply for the next 100,000 years.
            </p>
          </ModuleCard>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <ModuleCard title="Versioned Consensus Modules" icon={RefreshCw} className="h-full">
            <div className="space-y-2">
              {modules.map((m) => (
                <div key={m.name} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-xs font-mono">
                  <div className="min-w-0">
                    <div className="truncate text-foreground">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.version}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_STYLE[m.status]}`}>{m.status}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => upgrade(m.name)}
                      className="h-7 border-primary/40 px-2 font-mono text-[10px] text-primary hover:bg-primary/10"
                    >
                      <RefreshCw size={10} /> Upgrade
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ModuleCard>
        </div>

        <div className="col-span-12">
          <ModuleCard title="Active QIPs — On-Chain Governance" icon={GitBranch}>
            <div className="space-y-2">
              {qips.map((q) => (
                <div key={q.id} className="rounded-lg border border-border bg-background/60 p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-primary">{q.id}</span>
                      <span className="text-foreground">{q.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${STATUS_STYLE[q.status]}`}>{q.status}</span>
                      {q.status === 'Voting' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => vote(q.id)}
                          className="h-7 border-primary/40 px-2 font-mono text-[10px] text-primary hover:bg-primary/10"
                        >
                          <Vote size={10} /> Vote Yes
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${q.yes >= 66 ? 'bg-primary' : 'bg-gold'}`}
                        style={{ width: `${q.yes}%`, boxShadow: q.yes >= 66 ? '0 0 8px rgba(0,240,255,0.6)' : '0 0 8px rgba(255,215,0,0.4)' }}
                      />
                    </div>
                    <span className="w-24 text-right text-[10px] font-mono text-muted-foreground">
                      {q.yes}% yes · quorum 66%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] font-mono text-muted-foreground">
              QIPs passing 66% activate as new versioned consensus modules — nodes hot-swap on schedule, chain continuity preserved.
            </p>
          </ModuleCard>
        </div>
      </div>
    </div>
  );
}