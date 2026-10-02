import React from 'react';
import { Activity, Zap, Boxes, Coins } from 'lucide-react';
import { useGalaxium } from '@/hooks/useGalaxium';
import ModuleCard from './ModuleCard';
import { fmt } from '@/lib/galaxium';

export default function MiningPanel() {
  const { isMining, toggleMining, hashrate, hashHistory, blockCount, minedGXM, miningSince, gpuThreads, cpuThreads } = useGalaxium();

  const data = hashHistory.map((h, i) => ({ i, h: Number(h.toFixed(1)) }));
  const uptimeSec = isMining && miningSince ? Math.floor((Date.now() - miningSince) / 1000) : 0;
  const uptime = `${Math.floor(uptimeSec / 60)}m ${uptimeSec % 60}s`;

  return (
    <ModuleCard
      title="Live Mining Control"
      icon={Activity}
      right={
        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${
            isMining ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-accent text-muted-foreground'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isMining ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'bg-muted-foreground'}`} />
          {isMining ? 'Mining' : 'Standby'}
        </span>
      }
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold tracking-tight text-foreground">{isMining ? fmt(hashrate, 1) : '0.0'}</span>
            <span className="text-sm font-mono text-muted-foreground">MH/s</span>
          </div>
          <p className="mt-1 text-xs font-mono text-muted-foreground">
            {gpuThreads} GPU threads · {cpuThreads} CPU threads · GHOSTDAG width 8
          </p>
        </div>
        <button
          onClick={toggleMining}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-mono font-medium transition-all ${
            isMining
              ? 'border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20'
              : 'bg-primary text-primary-foreground shadow-[0_0_24px_rgba(0,240,255,0.35)] hover:shadow-[0_0_32px_rgba(0,240,255,0.5)]'
          }`}
        >
          <Zap size={15} />
          {isMining ? 'STOP MINING' : 'START MINING'}
        </button>
      </div>

      <div className="h-40 rounded-lg border border-border bg-background/60 p-2">
        <ResponsiveChart data={data} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat icon={Boxes} label="Blocks Found" value={fmt(blockCount)} />
        <Stat icon={Coins} label="GXM Mined" value={`${fmt(minedGXM, 2)}`} accent />
        <Stat icon={Activity} label="Uptime" value={uptime} />
      </div>
    </ModuleCard>
  );
}

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <Icon size={11} /> {label}
      </div>
      <div className={`font-display text-lg font-semibold ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</div>
    </div>
  );
}

import { AreaChart, Area, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function ResponsiveChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
        <YAxis hide domain={[0, 640]} />
        <Tooltip
          contentStyle={{ background: '#0F131D', border: '1px solid #1E2638', borderRadius: 8, fontSize: 12, fontFamily: 'JetBrains Mono' }}
          labelFormatter={() => ''}
          formatter={(v) => [`${v} MH/s`, 'Hashrate']}
        />
        <Area type="monotone" dataKey="h" stroke="#00F0FF" strokeWidth={2} fill="rgba(0,240,255,0.12)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}