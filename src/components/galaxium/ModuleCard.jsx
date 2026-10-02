import React from 'react';
import { cn } from '@/lib/utils';

export default function ModuleCard({ title, icon: Icon, right, className, children }) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-card shadow-[0_0_24px_rgba(0,240,255,0.04)] p-4 lg:p-5',
        className
      )}
    >
      {(title || right) && (
        <header className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {Icon && <Icon size={14} className="text-primary" />}
            <span>{title}</span>
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}