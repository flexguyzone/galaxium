import React from 'react';
import { Monitor } from 'lucide-react';
import DownloadCard from '@/components/galaxium/DownloadCard';
import InstallButton from '@/components/InstallButton';
import { WINDOWS_FILES } from '@/lib/windowsDownloads';

export default function Downloads() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Monitor className="text-primary" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Galaxium for Windows</h1>
          <p className="text-sm text-muted-foreground">Download the files below to run Galaxium on your PC.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {WINDOWS_FILES.map((file) => <DownloadCard key={file.id} file={file} />)}
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
        <h2 className="font-heading text-base font-semibold text-foreground">Prefer a full install?</h2>
        <p>Open Galaxium in Edge or Chrome and click Install — it gets a Start menu entry and its own window.</p>
        <InstallButton />
        <p>
          For a native <span className="text-foreground">.exe</span> installer, download the project from your GitHub
          repo, then in the <span className="text-foreground">electron</span> folder run{' '}
          <span className="text-primary">npm install</span> and <span className="text-primary">npm run dist</span>.
        </p>
      </div>
    </div>
  );
}