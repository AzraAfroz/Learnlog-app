import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { User, Key, Camera, Save } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

const Profile = () => {
  const { user, login } = useAuth(); // login is actually saving user to context in AuthProvider, but wait, AuthProvider might only have `login` to update user. Wait, I should probably just update localStorage and state directly or assume we can mutate it or provide a generic update method in AuthContext. Let's assume we can fetch `/auth/me` to refresh or just modify localStorage.
  
  const [profileData, setProfileData] = useState({ name: user?.name || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [photoLoading, setPhotoLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const updateLocalUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.location.reload(); // Quick way to refresh context
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await axiosInstance.put('/profile/update', profileData);
      updateLocalUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await axiosInstance.put('/profile/change-password', passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setPhotoLoading(true);
    try {
      const res = await axiosInstance.put('/profile/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateLocalUser({ profilePhoto: res.data.data.profilePhoto });
      toast.success('Profile photo updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Account Settings</h1>
        <p className="text-text-secondary mt-1">Manage your profile information and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Photo & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass rounded-2xl p-6 text-center shadow-sm">
            <div className="relative inline-block mb-4 group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface bg-primary/10 mx-auto flex items-center justify-center text-4xl text-primary font-bold shadow-md">
                {user?.profilePhoto ? (
                  <img src={`${BACKEND_URL}${user.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" loading="lazy" crossOrigin="anonymous" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={photoLoading}
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {photoLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Camera size={18} />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <h3 className="text-xl font-bold text-text">{user?.name}</h3>
            <p className="text-text-secondary text-sm">{user?.email}</p>
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
              Verified Account
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Information */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <User size={24} className="text-primary mr-3" />
              <h3 className="text-xl font-bold">General Information</h3>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Username (Read-only)</label>
                <input
                  type="text"
                  className="input-field bg-surface/50 text-text-secondary cursor-not-allowed"
                  value={user?.username || ''}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email (Read-only)</label>
                <input
                  type="email"
                  className="input-field bg-surface/50 text-text-secondary cursor-not-allowed"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={profileLoading} className="btn-primary w-auto flex items-center">
                  {profileLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : <Save size={18} className="mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <Key size={24} className="text-primary mr-3" />
              <h3 className="text-xl font-bold">Security</h3>
            </div>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="input-field"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="input-field"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={passwordLoading} className="px-6 py-2 bg-surface text-text font-medium rounded-lg border border-border hover:bg-surface/80 transition-colors flex items-center">
                  {passwordLoading ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div> : null}
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
