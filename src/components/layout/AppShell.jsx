import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Vault, FileCode2, TrendingUp, Users, CreditCard,
  Settings, Shield, ChevronRight, LogOut, Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { useState } from 'react';

const nav = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Vault, label: 'Trust Vaults', path: '/vaults' },
  { icon: FileCode2, label: 'Smart Contracts', path: '/contracts' },
  { icon: TrendingUp, label: 'Portfolio', path: '/portfolio' },
  { icon: Shield, label: 'Stipulations', path: '/stipulations' },
  { icon: Users, label: 'Family', path: '/family' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
];

export default function AppShell() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060912] text-white flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-[#080d1a] border-r border-white/5 flex flex-col transition-transform duration-200',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-sm">V</span>
          </div>
          <div>
            <div className="font-semibold text-white tracking-tight">Vaultis</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Private Wealth</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {nav.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  active
                    ? 'bg-amber-500/10 text-amber-400 font-medium'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button
            onClick={() => base44.auth.logout('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#060912]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <button
            className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-bold text-xs">F</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}