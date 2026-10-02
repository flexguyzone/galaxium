import React from 'react';
import { ShieldCheck } from 'lucide-react';
import MiningPanel from '@/components/galaxium/MiningPanel';
import RareAssetMonitor from '@/components/galaxium/RareAssetMonitor';
import BlockDAGVisualizer from '@/components/galaxium/BlockDAGVisualizer';
import WalletPreview from '@/components/galaxium/WalletPreview';
import ProtocolWidget from '@/components/galaxium/ProtocolWidget';

export default function Home() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground lg:text-[2.25rem]">Galaxium Mining</h1>
          <p className="mt-1 text-xs font-mono text-muted-foreground lg:text-sm">
            PoW BlockDAG · Kaspa-style GHOSTDAG · Post-quantum secured
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-mono text-muted-foreground lg:flex">
          <ShieldCheck size={14} className="text-primary" />
          Quantum Signature Layer: <span className="text-primary">ML-DSA + SLH-DSA</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 space-y-4 lg:col-span-8">
          <MiningPanel />
          <RareAssetMonitor />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <BlockDAGVisualizer />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <WalletPreview />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <ProtocolWidget />
        </div>
      </div>
    </div>
  );
}