import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { LayoutGrid, FileText, HelpCircle, Home, Globe, LogOut, User as UserIcon, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import GlobalSearch from '../components/GlobalSearch';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/graph', label: t('nav.graph'), icon: LayoutGrid },
    { path: '/articles', label: t('nav.articles'), icon: FileText },
    { path: '/problems', label: t('nav.problems'), icon: HelpCircle },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans relative">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-semibold tracking-tight mr-8">
                Knowledge<span className="text-[#007AFF]">Vis</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="hidden sm:flex space-x-8 items-center">
                {/* Search Icon */}
                <div className="relative group">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className={cn(
                        "inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200",
                        isSearchOpen
                            ? "text-[#007AFF] bg-blue-50"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        )}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {t('graph.searchPlaceholder') || "Search"}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                    </div>
                </div>

                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || 
                                 (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <div key={item.path} className="relative group">
                      <Link
                        to={item.path}
                        className={cn(
                          "inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200",
                          isActive
                            ? "text-[#007AFF] bg-blue-50"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                      </Link>
                      
                      {/* Tooltip */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              >
                <Globe className="w-4 h-4 mr-1.5" />
                {i18n.language === 'en' ? 'EN / 中' : '中 / EN'}
              </button>

              {/* User Profile / Login */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {user.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#007AFF] hover:text-[#0077ED]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Global Search Overlay */}
      {isSearchOpen && <GlobalSearch onClose={() => setIsSearchOpen(false)} />}

      {/* Main Content */}
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
