import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { toast, Toaster } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        companyName: userData.companyName || '',
        email: userData.email || ''
      }));
      setLoading(false);
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating profile...');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/users/profile`,
        {
          companyName: formData.companyName,
          email: formData.email
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(response.data.user);
      toast.success('Profile updated successfully', { id: toastId });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile', { id: toastId });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const toastId = toast.loading('Updating password...');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/users/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      toast.success('Password updated successfully', { id: toastId });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password', { id: toastId });
    }
  };

  const orderStats = {
    total: 20,
    accepted: 12,
    rejected: 5,
    pending: 3
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-black/40 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Profile Information */}
        <section className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-400/80 transition-colors text-sm"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-white mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                  !isEditing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled={true}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 opacity-70 cursor-not-allowed"
              />
            </div>
            {isEditing && (
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-400/80 transition-colors"
              >
                Save Changes
              </button>
            )}
          </form>
        </section>

        {/* Order Statistics */}
        <section className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Order Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{orderStats.total}</div>
              <div className="text-sm text-zinc-400">Total Orders</div>
            </div>
            <div className="bg-black/30 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{orderStats.accepted}</div>
              <div className="text-sm text-zinc-400">Accepted</div>
            </div>
            <div className="bg-black/30 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">{orderStats.rejected}</div>
              <div className="text-sm text-zinc-400">Rejected</div>
            </div>
            <div className="bg-black/30 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">{orderStats.pending}</div>
              <div className="text-sm text-zinc-400">Pending</div>
            </div>
          </div>
        </section>

        {/* Change Password */}
        <section className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-white mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-400/80 transition-colors"
            >
              Update Password
            </button>
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default Profile; 