import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { OfflineBanner } from '../common/OfflineBanner';
import { NotificationDrawer } from '../common/NotificationDrawer';

export function Layout({ withSidebar = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-defence-dark cyber-grid text-defence-text">
      <Navbar />
      <OfflineBanner />
      <NotificationDrawer />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {withSidebar && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
