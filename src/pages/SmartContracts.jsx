import React, { useState } from 'react';
import { FileCode2, Rocket, Boxes, Lock, RefreshCw } from 'lucide-react';
import ModuleCard from '@/components/galaxium/ModuleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { COIN, fmt } from '@/lib/galaxium';

const INITIAL_CONTRACTS = [
  { name: 'GXM-20 Token Standard', addr: 'gxmc1q7f2k9x4v8z3e5w6t1y0u9a2s4d8g6h0j', lang: 'GVM-Script', status: 'Active', calls: 24318, tag: 'core' },
  { name: 'zk-Vesting Vault', addr: 'gxmc1q2m8w4t6y9u3i1o5p7a0s2d4f6g8h1j3k', lang: 'GVM-ZK', status: 'Active', calls: 8412, tag: 'private' },
  { name: 'DAGSwap AMM', addr: 'gxmc1q9p3r5t7y2u4i6o8p1a3s5d7f9g2h4j6k', lang: 'GVM-Script', status: 'Active', calls: 15742, tag: 'core' },
  { name: 'Quantum Escrow', addr: 'gxmc1q4t6y8u2i4o6p8a0s2d4f6g8h0j2k4l6m', lang: 'GVM-Script', status: 'Active', calls: 5210, tag: 'core' },
];

const TEMPLATES = ['GXM-20 Token', 'zk-Vesting', 'Escrow', 'AMM Pool'];

export default function SmartContractsPage() {
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const { toast } = useToast();

  const deploy = () => {
    const cname = name.trim() || `${template} #${contracts.length + 1}`;
    const id = `gxmc1q${Math.random().toString(36).slice(2, 12)}`;
    setContracts((c) => [{ name: cname, addr: id, lang: template.startsWith('zk') ? 'GVM-ZK' : 'GVM-Script', status: 'Deploying', calls: 0, tag: template.startsWith('zk') ? 'private' : 'core' }, ...c]);
    setName('');
    setTimeout(() => {
      setContracts((c) => c.map((ct) => (ct.addr === id ? { ...ct, status: 'Active' } : ct)));
    }, 1200);
    toast({ title: 'Contract deployed', description: `${cname} · compiled to GVM bytecode · included in DAG` });
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight lg:text-[2.25rem]">Smart Contracts</h1>
        <p className="mt-1 text-xs font-mono text-muted-foreground lg:text-sm">
          Native GVM · contracts integrated directly into the protocol — not an overlay layer
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3 text-xs font-mono">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">VM Version</div>
          <div className="font-display text-base font-semibold text-foreground">GVM v1.3</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Contracts Deployed</div>
          <div className="font-display text-base font-semibold text-foreground">{fmt(contracts.length)}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Gas Price</div>
          <div className="font-display text-base font-semibold text-foreground">0.0021 GXM/kGPU</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <ModuleCard title="Deploy Contract" icon={Rocket} className="h-full">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Contract name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Contract" className="border-border bg-background/60 font-mono text-xs" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Template</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                >
                  {TEMPLATES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Button onClick={deploy} className="w-full bg-primary font-mono text-primary-foreground shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:bg-primary/90">
                <Rocket size={14} /> Deploy to BlockDAG
              </Button>
              <p className="text-[10px] font-mono text-muted-foreground">
                Deploys via {COIN.vm.split('—')[0].trim()} — executed natively by every DAG block validator.
              </p>
            </div>
          </ModuleCard>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <ModuleCard title="Deployed Contracts" icon={Boxes} className="h-full">
            <div className="space-y-2">
              {contracts.map((c) => (
                <div key={c.addr} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-xs font-mono">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {c.tag === 'private' ? <Lock size={12} className="text-secondary" /> : <FileCode2 size={12} className="text-primary" />}
                      <span className="truncate text-foreground">{c.name}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{c.addr}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[10px] text-muted-foreground">{c.lang}</span>
                    <span className="text-[10px] text-muted-foreground">{fmt(c.calls)} calls</span>
                    <span className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                      c.status === 'Active' ? 'bg-primary/10 text-primary' : c.status === 'Deploying' ? 'bg-gold/10 text-gold' : 'bg-secondary/15 text-secondary'
                    }`}>
                      {c.status === 'Deploying' && <RefreshCw size={9} className="animate-spin" />}
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ModuleCard>
        </div>
      </div>
    </div>
  );
}