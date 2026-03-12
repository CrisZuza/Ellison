import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Scissors, 
  GraduationCap, 
  ShoppingBag, 
  Image as ImageIcon, 
  Languages, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '../components/Logo';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('/api/admin/me')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Unauthorized');
      })
      .then(data => setUser(data))
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Masters', icon: Users, path: '/admin/masters' },
    { name: 'Services', icon: Scissors, path: '/admin/services' },
    { name: 'Courses', icon: GraduationCap, path: '/admin/courses' },
    { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
    { name: 'Gallery', icon: ImageIcon, path: '/admin/gallery' },
    { name: 'Translations', icon: Languages, path: '/admin/translations' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-luxury-black text-white flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="mb-12 flex justify-between items-center">
            <Logo showMarkOnly className="scale-75" />
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-gold text-black font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon size={18} />
                <span className="text-xs uppercase tracking-widest">{item.name}</span>
              </Link>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="mt-auto flex items-center gap-4 px-4 py-3 text-white/40 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-xs uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="font-serif text-xl tracking-widest uppercase">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-white/40">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
              <span className="text-gold text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
