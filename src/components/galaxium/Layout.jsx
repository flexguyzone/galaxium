import React from 'react';
import { Outlet } from 'react-router-dom';
import { GalaxiumProvider } from '@/hooks/useGalaxium';
import ModeRail from './ModeRail';
import StatusBar, { MobileBottomBar } from './StatusBar';

export default function GalaxiumLayout() {
  return (
    <GalaxiumProvider>
      <div className="min-h-screen bg-background text-foreground font-body">
        <ModeRail />
        <div className="lg:pl-16">
          <StatusBar />
          <main className="p-4 pb-28 lg:p-6 lg:pb-8">
            <Outlet />
          </main>
        </div>
        <MobileBottomBar />
      </div>
    </GalaxiumProvider>
  );
}