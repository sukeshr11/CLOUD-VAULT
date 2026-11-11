import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  LayoutDashboard, 
  Folder, 
  UploadCloud, 
  Activity, 
  Cloud, 
  Terminal, 
  Users,
  
  LogOut, 
  LogIn 
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/contacts', icon: Users, label: 'Contacts Demo' },
    { to: '/files', icon: Folder, label: 'My Files' },
    { to: '/upload', icon: UploadCloud, label: 'Upload Files' },
    { to: '/activity', icon: Activity, label: 'Recent Activity' },
    { to: '/services', icon: Cloud, label: 'Cloud Services' },
    { to: '/api-explorer', icon: Terminal, label: 'API Explorer' },
  ];

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 text-white">
          <Cloud className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold tracking-tight">CloudVault</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search files..." 
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
              <svg className="w-4 h-4 text-slate-400 absolute right-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-6 ml-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <NavLink to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="text-sm text-right hidden sm:block">
                    <p className="font-medium text-slate-700">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate w-32">{user?.email}</p>
                  </div>
                  <img src={user?.picture} alt="Avatar" className="w-9 h-9 rounded-full ring-2 ring-slate-100" />
                </NavLink>
                <button 
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => loginWithRedirect().catch(err => alert("Auth0 Error: " + err.message))}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors font-medium shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
