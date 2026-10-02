import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, Eye, ShieldCheck, Copy, Check } from 'lucide-react';
import { useGalaxium } from '@/hooks/useGalaxium';
import ModuleCard from './ModuleCard';
import { OWNER_WALLET, fmt, shortAddr } from '@/lib/galaxium';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function WalletPreview() {
  const { balance } = useGalaxium();
  const [zkView, setZkView] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const shown = zkView ? balance.private : balance.transparent;
  const total = balance.transparent + balance.private;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(OWNER_WALLET.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) { /* clipboard unavailable */ }
  };

  return (
    <ModuleCard
      title="Integrated Wallet"
      icon={Wallet}
      right={
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <ShieldCheck size={11} className="text-primary" /> Quantum-secured
        </span>
      }
    >
      <div className="mb-4 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold tracking-tight text-foreground">{fmt(total, 2)}</span>
        <span className="text-sm font-mono text-primary">GXM</span>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2.5">
        <div className="flex items-center gap-2 text-xs font-mono">
          {zkView ? (
            <><Eye size={13} className="text-secondary" /><span className="text-secondary">Private (ZK) balance</span></>
          ) : (
            <><span className="h-2 w-2 rounded-full bg-primary" /><span>Transparent balance</span></>
          )}
          <span className="text-foreground">{fmt(shown, 2)} GXM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">ZK view</span>
          <Switch checked={zkView} onCheckedChange={setZkView} />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2.5 text-xs font-mono">
        <span className="text-muted-foreground">{shortAddr(OWNER_WALLET.address)}</span>
        <button onClick={copyAddress} className="flex items-center gap-1 text-muted-foreground hover:text-primary">
          {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <Button
        onClick={() => navigate('/wallet')}
        className="w-full bg-primary font-mono text-primary-foreground shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:bg-primary/90"
      >
        <Send size={14} /> Quick Transfer — Open Wallet
      </Button>
    </ModuleCard>
  );
}