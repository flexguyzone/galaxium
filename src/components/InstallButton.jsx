import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InstallButton({ className }) {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!promptEvent) return null;

  const install = async () => {
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') setPromptEvent(null);
  };

  return (
    <button
      onClick={install}
      className={cn(
        'flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-2.5 py-1.5 text-primary transition-colors hover:bg-primary/20',
        className
      )}
    >
      <Download size={12} />
      Install
    </button>
  );
}