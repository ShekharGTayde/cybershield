import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { OfflineBanner } from '../common/OfflineBanner';
import { NotificationDrawer } from '../common/NotificationDrawer';

export function Layout({ withSidebar = true }) {
  return (
    <div className={`min-h-screen flex flex-col bg-[#050505] cyber-grid scanline-surface text-[#FFF7F7] relative overflow-hidden reference-shell ${withSidebar ? 'reference-app-shell' : 'reference-home-shell'}`}>
      {/* Ambient background glows matching reference image */}
      <div className="pointer-events-none fixed -top-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#F20D25]/10 blur-[130px] z-0" />
      <div className="pointer-events-none fixed top-1/2 -left-48 w-[450px] h-[450px] rounded-full bg-[#F3A0A8]/08 blur-[120px] z-0" />
      <div className="pointer-events-none fixed -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-[#F20D25]/08 blur-[140px] z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <OfflineBanner />
        <NotificationDrawer />

        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {withSidebar && <Sidebar />}
          <main className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto ${withSidebar ? 'reference-main-app' : 'reference-main-public'}`}>
            <Outlet />
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
