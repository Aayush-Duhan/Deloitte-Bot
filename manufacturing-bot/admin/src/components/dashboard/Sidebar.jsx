import { useState } from 'react';
import {
  RiDashboardLine,
  RiSettings4Line,
  RiMailSettingsLine,
  RiFileTextLine,
  RiTeamLine,
  RiHistoryLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiRobot2Line
} from 'react-icons/ri';

const Sidebar = ({ currentSection, setCurrentSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: RiDashboardLine },
    { id: 'bot-settings', label: 'Bot Settings', icon: RiSettings4Line },
    { id: 'email-rules', label: 'Email Rules', icon: RiMailSettingsLine },
    { id: 'templates', label: 'Templates', icon: RiFileTextLine },
    { id: 'users', label: 'Users', icon: RiTeamLine },
    { id: 'logs', label: 'Logs', icon: RiHistoryLine },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-black/40 border-r border-white/10 backdrop-blur-sm transition-all duration-300 flex flex-col h-screen sticky top-0`}>
      {/* Header */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} flex-shrink-0`}>
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-bold text-white">Manufacturing Bot</h2>
            <p className="text-sm text-zinc-400">Admin Panel</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <RiMenuUnfoldLine size={20} /> : <RiMenuFoldLine size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <nav className="py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full px-6 py-3.5 flex items-center space-x-3 text-sm font-medium transition-all duration-200 group relative
                  ${currentSection === item.id
                    ? 'text-white bg-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="text-xl group-hover:scale-110 transition-transform duration-200" size={20} />
                {!isCollapsed && <span>{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 flex-shrink-0">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
            <RiRobot2Line size={20} />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Bot Status</p>
              <p className="text-xs text-green-400">Active</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 