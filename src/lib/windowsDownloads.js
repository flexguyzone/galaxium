export const APP_URL = 'https://galaxium-quantum-core.base44.app';

export const WINDOWS_FILES = [
  {
    id: 'launcher',
    title: 'Galaxium Launcher',
    filename: 'Galaxium.cmd',
    description: 'Double-click to open Galaxium in its own app window (uses Microsoft Edge, built into Windows 10/11).',
    content: `@echo off\r\ntitle Galaxium\r\nstart "" msedge --app=${APP_URL}\r\n`,
  },
  {
    id: 'shortcut',
    title: 'Desktop Shortcut',
    filename: 'Galaxium.url',
    description: 'Drop this on your desktop for one-click access to Galaxium in your default browser.',
    content: `[InternetShortcut]\r\nURL=${APP_URL}\r\nIconIndex=0\r\n`,
  },
];

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}