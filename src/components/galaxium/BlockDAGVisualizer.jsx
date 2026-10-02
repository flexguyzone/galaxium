import React from 'react';
import { Network } from 'lucide-react';
import { useGalaxium } from '@/hooks/useGalaxium';
import ModuleCard from './ModuleCard';
import { fmt } from '@/lib/galaxium';

const LANE_Y = [45, 105, 165];

export default function BlockDAGVisualizer() {
  const { blocks, isMining, lastTickBlocks } = useGalaxium();
  const len = blocks.length;
  const newestId = blocks[len - 1]?.id;

  const xOf = (idx) => (len <= 1 ? 320 : 30 + (idx / (len - 1)) * 580);

  const edges = [];
  blocks.forEach((b, i) => {
    b.parents.forEach((pid) => {
      const pi = blocks.findIndex((p) => p.id === pid);
      if (pi >= 0) edges.push({ from: pi, to: i, highlight: b.id === newestId });
    });
  });

  return (
    <ModuleCard
      title="PoW BlockDAG Stream"
      icon={Network}
      right={
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span className={`h-1.5 w-1.5 rounded-full ${isMining ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          GHOSTDAG
        </span>
      }
      className="h-full"
    >
      <div className="rounded-lg border border-border bg-background/60">
        <svg viewBox="0 0 640 210" className="h-52 w-full">
          {edges.map((e, i) => (
            <line
              key={i}
              x1={xOf(e.from)}
              y1={LANE_Y[blocks[e.from].lane]}
              x2={xOf(e.to)}
              y2={LANE_Y[blocks[e.to].lane]}
              stroke={e.highlight ? 'rgba(0,240,255,0.55)' : '#1E2638'}
              strokeWidth={e.highlight ? 1.5 : 1}
            />
          ))}
          {blocks.map((b, i) => {
            const isNewest = b.id === newestId;
            return (
              <circle
                key={b.id}
                cx={xOf(i)}
                cy={LANE_Y[b.lane]}
                r={isNewest ? 8 : 6}
                fill={isNewest ? '#00F0FF' : b.private ? '#7B2CBF' : '#0F131D'}
                stroke={b.private ? 'rgba(123,44,191,0.8)' : 'rgba(0,240,255,0.5)'}
                strokeWidth={1.5}
                className={isNewest ? 'animate-pulse' : ''}
                style={isNewest ? { filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.8))' } : {}}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        <Metric label="DAG Throughput" value={`${isMining ? lastTickBlocks : 0}/tick`} />
        <Metric label="Parallel Blocks" value={isMining ? '1 – 3' : 'idle'} />
        <Metric label="Live Nodes" value={fmt(len)} />
      </div>

      <div className="mt-3 flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-[rgba(0,240,255,0.5)] bg-card" /> transparent</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary" /> zk-private</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> newest</span>
      </div>
    </ModuleCard>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-background/60 p-2">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}