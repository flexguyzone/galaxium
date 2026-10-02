import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Cpu, ShieldCheck, Network, Play, Square } from 'lucide-react';
import InstallButton from '@/components/InstallButton';
import { useGalaxium } from '@/hooks/useGalaxium';
import { NAV } from './ModeRail';
import { fmt } from '@/lib/galaxium';
import { cn } from '@/lib/utils';

export default function StatusBar() {
  const { isMining, toggleMining, hashrate, gpuThreads, cpuThreads } = useGalaxium();
  const [sync, setSync] = useState(97.42);
  const { pathname } = useLocation();

  useEffect(() => {
    const iv = setInterval(() => setSync((s) => (s >= 100 ? 99.98 : Math.min(100, s + 0.6))), 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 text-xs font-mono text-muted-foreground backdrop-blur lg:px-6">
      <Link to="/" className="flex items-center gap-2 font-display text-sm font-bold tracking-tight text-foreground lg:hidden">
        <span className="flex h-6 w-6 items-center justify-center rounded border border-primary/40 bg-primary/10 text-primary">G</span>
        GALAXIUM
      </Link>

      <div className="hidden items-center gap-2 lg:flex">
        <Activity size={13} className="text-primary" />
        <span className="text-foreground">{isMining ? fmt(hashrate, 1) : '0.0'}</span> MH/s
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <Cpu size={13} className="text-primary" />
        <span>{isMining ? `${gpuThreads} GPU · ${cpuThreads} CPU` : 'idle'}</span>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        ML-DSA / SLH-DSA Active
      </div>

      <div className="ml-auto flex items-center gap-3">
        <InstallButton className="hidden lg:flex" />
        <button
          onClick={toggleMining}
          className={cn(
            'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 transition-colors lg:hidden',
            isMining ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border bg-accent text-foreground'
          )}
        >
          {isMining ? <Square size={12} /> : <Play size={12} />}
          {isMining ? 'Stop' : 'Mine'}
        </button>
        <div className="flex items-center gap-2">
          <Network size={13} className="text-primary" />
          <span>Sync <span className="text-foreground">{sync.toFixed(2)}%</span></span>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomBar() {
  const { isMining, toggleMining } = useGalaxium();
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/95 backdrop-blur lg:hidden">
      {NAV.map(({ to, icon: Icon, label }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={cn('flex flex-col items-center gap-1 text-[10px] font-mono', active ? 'text-primary' : 'text-muted-foreground')}
          >
            <Icon size={18} />
            {label.split(' ')[0]}
          </Link>
        );
      })}
      <button
        onClick={toggleMining}
        aria-label={isMining ? 'Stop mining' : 'Start mining'}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
          isMining
            ? 'border-primary/50 bg-primary/15 text-primary shadow-[0_0_16px_rgba(0,240,255,0.3)]'
            : 'border-primary/40 bg-primary/10 text-primary'
        )}
      >
        {isMining ? <Square size={18} /> : <Play size={18} />}
      </button>
    </nav>
  );
}