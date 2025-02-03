import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiFileListLine, RiUserLine, RiLogoutBoxLine, RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';

const Layout = ({ children, user }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'overview';
    if (path === '/orders') return 'orders';
    if (path === '/profile') return 'profile';
    return '';
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-black/40 border-r border-white/10 backdrop-blur-sm flex flex-col h-screen fixed transition-all duration-300`}>
        {/* Top section */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold text-white">User Control Panel</h1>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`text-zinc-400 hover:text-white transition-colors ${isSidebarCollapsed ? 'w-full flex justify-center' : ''}`}
          >
            {isSidebarCollapsed ? <RiMenuUnfoldLine size={20} /> : <RiMenuFoldLine size={20} />}
          </button>
        </div>

        {/* Navigation section */}
        <div className="flex-1 py-4">
          <nav className="space-y-1">
            <button
              onClick={() => navigate('/dashboard')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-6'} py-2 ${
                getCurrentSection() === 'overview'
                  ? 'bg-purple-500/50 text-white'
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <RiDashboardLine size={20} />
              {!isSidebarCollapsed && <span className="ml-3">Overview</span>}
            </button>
            <button
              onClick={() => navigate('/orders')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-6'} py-2 ${
                getCurrentSection() === 'orders'
                  ? 'bg-purple-500/50 text-white'
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <RiFileListLine size={20} />
              {!isSidebarCollapsed && <span className="ml-3">Orders</span>}
            </button>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="py-4 border-t border-white/10">
          <button
            onClick={() => navigate('/profile')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-6'} py-2 ${
              getCurrentSection() === 'profile'
                ? 'bg-purple-500/50 text-white'
                : 'text-zinc-400 hover:bg-white/5'
            }`}
          >
            <RiUserLine size={20} />
            {!isSidebarCollapsed && <span className="ml-3">Profile</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-6'} py-2 text-red-400 hover:bg-white/5`}
          >
            <RiLogoutBoxLine size={20} />
            {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
};

export default Layout; 