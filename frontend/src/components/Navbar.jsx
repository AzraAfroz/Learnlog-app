import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass h-16 border-b border-border flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center md:hidden">
        <button className="text-text-secondary hover:text-primary transition-colors">
          <Menu size={24} />
        </button>
        <span className="ml-4 text-xl font-bold text-primary">LearnLog</span>
      </div>
      <div className="hidden md:flex flex-1"></div>
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/30">
                {user.profilePhoto ? (
                  <img src={`${BACKEND_URL}${user.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" loading="lazy" crossOrigin="anonymous" />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <span className="text-text-secondary font-medium hidden sm:block">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-medium text-error hover:bg-error/10 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
