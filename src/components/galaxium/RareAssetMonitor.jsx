import React from 'react';
import { Sparkles } from 'lucide-react';
import { useGalaxium } from '@/hooks/useGalaxium';
import ModuleCard from './ModuleCard';
import { RARE_ASSETS } from '@/lib/galaxium';

export default function RareAssetMonitor() {
  const { drops, lastDrop, isMining } = useGalaxium();

  return (
    <ModuleCard
      title="Rare Asset Mining Monitor"
      icon={Sparkles}
      right={
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span className={`h-1.5 w-1.5 rounded-full ${isMining ? 'bg-gold animate-pulse' : 'bg-muted-foreground'}`} />
          {isMining ? 'Rolling live' : 'Idle'}
        </span>
      }
    >
      <div className="space-y-3">
        {RARE_ASSETS.map((asset) => (
          <div key={asset.id} className="rounded-lg border border-border bg-background/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: asset.color, boxShadow: `0 0 10px ${asset.color}66` }} />
                <span className="font-display text-sm font-semibold text-foreground">{asset.name}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{asset.tier}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-muted-foreground">drop odds</span>
                <span className="text-foreground">{asset.oddsText}</span>
                <span className="rounded border border-border bg-accent px-2 py-0.5 text-[10px] uppercase tracking-wider">
                  mined: <span style={{ color: asset.color }}>{drops[asset.id]}</span>
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(asset.odds * 100, 1.5)}%`, background: asset.color, boxShadow: `0 0 8px ${asset.color}` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs font-mono">
        {lastDrop ? (
          <span>
            <span style={{ color: RARE_ASSETS.find((a) => a.id === lastDrop.asset).color }}>● {RARE_ASSETS.find((a) => a.id === lastDrop.asset).name} dropped</span>
            <span className="text-muted-foreground"> — {new Date(lastDrop.ts).toLocaleTimeString()} · credited to owner wallet</span>
          </span>
        ) : (
          <span className="text-muted-foreground">No rare drops this session — every DAG block rolls the odds.</span>
        )}
      </div>
    </ModuleCard>
  );
}