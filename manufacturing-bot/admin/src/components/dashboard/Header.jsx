import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RiNotificationLine, 
  RiArrowDownSLine,
  RiUserSettingsLine,
  RiSettings3Line,
  RiLogoutBoxRLine
} from 'react-icons/ri';

const Header = ({ handleLogout }) => {
  const [admin, setAdmin] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/admin/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <header className="bg-black/40 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-white">Bot Management</h1>
          <div className="h-6 w-px bg-white/10" />
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="text-xs font-medium text-green-400">System Online</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <RiNotificationLine size={20} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              {admin && (
                <>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                      {admin.name}
                    </p>
                    <p className="text-xs text-zinc-400">{admin.role}</p>
                  </div>
                  <RiArrowDownSLine className="text-zinc-400" size={20} />
                </>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-zinc-800 border border-white/10 shadow-lg py-1">
                <button className="w-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 text-left flex items-center space-x-2">
                  <RiUserSettingsLine size={18} />
                  <span>Profile Settings</span>
                </button>
                <button className="w-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 text-left flex items-center space-x-2">
                  <RiSettings3Line size={18} />
                  <span>Preferences</span>
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 text-left flex items-center space-x-2"
                >
                  <RiLogoutBoxRLine size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 