import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, User } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Journals', path: '/journals', icon: <BookOpen size={20} /> },
    { name: 'Add Entry', path: '/journals/add', icon: <PlusCircle size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border hidden md:flex flex-col h-full shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">LearnLog</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-text-secondary hover:bg-surface hover:text-primary'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
