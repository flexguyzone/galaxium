import React from 'react';
import { Download, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadTextFile } from '@/lib/windowsDownloads';

export default function DownloadCard({ file }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
          <FileDown size={18} />
        </span>
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">{file.title}</h3>
          <p className="text-xs text-muted-foreground">{file.filename}</p>
        </div>
      </div>
      <p className="flex-1 text-sm text-muted-foreground">{file.description}</p>
      <Button onClick={() => downloadTextFile(file.filename, file.content)}>
        <Download /> Download for Windows
      </Button>
    </div>
  );
}