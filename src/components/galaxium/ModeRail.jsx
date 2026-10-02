import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pickaxe, Wallet, FileCode2, GitBranch, Github, ShieldCheck, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NAV = [
  { to: '/', icon: Pickaxe, label: 'Mining' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/contracts', icon: FileCode2, label: 'Smart Contracts' },
  { to: '/qips', icon: GitBranch, label: 'Network QIPs' },
  { to: '/github', icon: Github, label: 'GitHub' },
  { to: '/downloads', icon: Download, label: 'Downloads' },
];

export default function ModeRail() {
  const { pathname } = useLocation();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col items-center border-r border-border bg-card py-4 lg:flex">
      <Link to="/" className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 font-display text-lg font-bold text-primary shadow-[0_0_16px_rgba(0,240,255,0.25)]">
        G
      </Link>
      <nav className="flex flex-1 flex-col gap-2">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'group relative flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
                active
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon size={18} />
              <span className="pointer-events-none absolute left-12 z-50 hidden whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-mono text-foreground group-hover:block">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col items-center gap-1 text-[10px] font-mono text-muted-foreground">
        <ShieldCheck size={14} className="text-primary" />
        <span>v1.4.2</span>
      </div>
    </aside>
  );
}