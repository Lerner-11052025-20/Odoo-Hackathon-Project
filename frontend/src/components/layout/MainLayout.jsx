import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-inter transition-colors duration-300">
      
      {/* Sidebar Component */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} isDesktopOpen={isDesktopOpen} />

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${isDesktopOpen ? 'md:ml-[260px]' : 'md:ml-[80px]'}`}>
        <Navbar onMenuClick={() => setIsMobileOpen(true)} isDesktopOpen={isDesktopOpen} setIsDesktopOpen={setIsDesktopOpen} />
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden relative">
          {children}
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
