'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, User, Briefcase, Moon, Sun, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useStore();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = localStorage.getItem('vobb-theme') as 'light' | 'dark' | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    const attr = typeof document !== 'undefined' ? (document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null) : null;
    return attr === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('vobb-theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vobb-theme') as 'light' | 'dark' | null;
      if (saved) setTheme(saved);
    } catch {}
  }, []);

  const navItems = [
    { href: '/', label: 'Deals', icon: Briefcase },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Vobb OS Atlas</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <span className="mr-2">{user?.name}</span>
              </div>
            )}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`${theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700'} ml-2 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2`}
              aria-label={`Current theme: ${theme}. Toggle theme`}
              title={`Current theme: ${theme}. Toggle theme`}
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => { logout(); router.replace('/login'); }}
                className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
