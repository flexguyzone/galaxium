import React, { useState } from 'react';
import { Wallet, Send, Eye, EyeOff, ShieldCheck, Copy, Check, History, Lock } from 'lucide-react';
import { useGalaxium } from '@/hooks/useGalaxium';
import ModuleCard from '@/components/galaxium/ModuleCard';
import { OWNER_WALLET, PREMINE, fmt, shortAddr } from '@/lib/galaxium';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function WalletPage() {
  const { balance, txs, sendTx } = useGalaxium();
  const [zkMode, setZkMode] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [keyRevealed, setKeyRevealed] = useState(false);
  const [copied, setCopied] = useState('');
  const { toast } = useToast();

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch (e) { /* clipboard unavailable */ }
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const res = sendTx(recipient.trim(), amount, zkMode);
    if (!res.ok) { setError(res.error); return; }
    setRecipient('');
    setAmount('');
    toast({
      title: zkMode ? 'zk-shielded transfer confirmed' : 'Transfer confirmed',
      description: 'Signed with ML-DSA · included in next DAG block',
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight lg:text-[2.25rem]">Galaxium Wallet</h1>
        <p className="mt-1 text-xs font-mono text-muted-foreground lg:text-sm">
          Transparent by default · ZK-private on demand · post-quantum ML-DSA signatures
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Balances */}
        <div className="col-span-12 lg:col-span-5">
          <ModuleCard title="Balances" icon={Wallet} className="h-full">
            <div className="mb-4 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold tracking-tight">{fmt(balance.transparent + balance.private, 2)}</span>
              <span className="text-sm font-mono text-primary">GXM</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <span className="flex items-center gap-2 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> Transparent</span>
                <span className="text-foreground">{fmt(balance.transparent, 2)} GXM</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <span className="flex items-center gap-2 text-secondary"><Lock size={11} /> Shielded (ZK)</span>
                <span className="text-foreground">{fmt(balance.private, 2)} GXM</span>
              </div>
            </div>
            <p className="mt-3 text-[10px] font-mono text-muted-foreground">
              Genesis pre-mine: {fmt(PREMINE.amount)} GXM ({fmt(PREMINE.transparent)} transparent · {fmt(PREMINE.shielded)} shielded)
            </p>
          </ModuleCard>
        </div>

        {/* Keys */}
        <div className="col-span-12 lg:col-span-7">
          <ModuleCard title="Owner Wallet Keys" icon={ShieldCheck} className="h-full">
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Address (ML-DSA derived)</div>
                  <div className="truncate text-foreground">{OWNER_WALLET.address}</div>
                </div>
                <button onClick={() => copy('addr', OWNER_WALLET.address)} className="shrink-0 text-muted-foreground hover:text-primary">
                  {copied === 'addr' ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Private Key (SLH-DSA seed)</span>
                  <button
                    onClick={() => setKeyRevealed((v) => !v)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    {keyRevealed ? <EyeOff size={12} /> : <Eye size={12} />} {keyRevealed ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className={`min-w-0 flex-1 break-all text-foreground ${keyRevealed ? '' : 'select-none blur-sm'}`}>
                    {keyRevealed ? OWNER_WALLET.privateKey : '•••• •••• •••• •••• •••• •••• •••• ••••'}
                  </div>
                  {keyRevealed && (
                    <button onClick={() => copy('key', OWNER_WALLET.privateKey)} className="shrink-0 text-muted-foreground hover:text-primary">
                      {copied === 'key' ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
                {keyRevealed && (
                  <p className="mt-2 text-destructive">⚠ Never share your private key — it grants full control of this wallet.</p>
                )}
              </div>
            </div>
          </ModuleCard>
        </div>

        {/* Send */}
        <div className="col-span-12 lg:col-span-5">
          <ModuleCard title="Send GXM" icon={Send} className="h-full">
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Recipient address</label>
                <Input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="gxm1..."
                  className="border-border bg-background/60 font-mono text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Amount (GXM)</label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="border-border bg-background/60 font-mono text-xs"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <ShieldCheck size={13} className={zkMode ? 'text-secondary' : 'text-muted-foreground'} />
                  <span className={zkMode ? 'text-secondary' : 'text-muted-foreground'}>
                    ZK Private Transaction — {zkMode ? 'shielded' : 'off (transparent)'}
                  </span>
                </div>
                <Switch checked={zkMode} onCheckedChange={setZkMode} />
              </div>
              {error && <p className="text-xs font-mono text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-primary font-mono text-primary-foreground shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:bg-primary/90">
                <Send size={14} /> {zkMode ? 'Send Private (ZK)' : 'Send Transparent'}
              </Button>
            </form>
          </ModuleCard>
        </div>

        {/* History */}
        <div className="col-span-12 lg:col-span-7">
          <ModuleCard title="Transaction History" icon={History} className="h-full">
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {txs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-xs font-mono">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${tx.private ? 'bg-secondary/15 text-secondary' : 'bg-primary/10 text-primary'}`}>
                        {tx.type === 'premine' ? 'PREMINE' : tx.private ? 'ZK-SEND' : 'SEND'}
                      </span>
                      <span className="truncate text-muted-foreground">{tx.type === 'premine' ? tx.note : shortAddr(tx.to)}</span>
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">{new Date(tx.ts).toLocaleString()}</div>
                  </div>
                  <div className={`shrink-0 ${tx.type === 'send' ? 'text-destructive' : 'text-primary'}`}>
                    {tx.type === 'send' ? '−' : '+'}{fmt(tx.amount, 2)} GXM
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