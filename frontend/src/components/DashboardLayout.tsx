import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Building2, 
  Users, 
  Calendar, 
  Award, 
  FileText, 
  ShieldCheck, 
  Upload, 
  PlusCircle, 
  Compass, 
CheckCircle2, 
  Menu, 
  X, 
ChevronRight,
  Sparkles,
  TrendingUp,
  Activity,
  LogOut
} from 'lucide-react';
import { UserProfile, ActiveView } from '../types';
import { useAuth } from '../context/AuthContext';

export interface DashboardStatItem {
  label: string;
  value: string;
  subtext?: string;
  trend?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

export interface DashboardNavItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

export interface DashboardLayoutProps {
  currentUser: UserProfile;
  activeView: ActiveView;
  onNavigateView: (view: ActiveView, anchorId?: string) => void;
  workspaceTitle: string;
  workspaceSubtitle?: string;
  roleBadgeText?: string;
  stats?: DashboardStatItem[];
  navTabs?: DashboardNavItem[];
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  activeView,
  onNavigateView,
  workspaceTitle,
  workspaceSubtitle,
  roleBadgeText,
  stats = [],
  navTabs = [],
  primaryAction,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const currentRole = currentUser.role;

  // Role display metadata
  const getRoleMetadata = () => {
    switch (currentRole) {
      case 'inisiator':
        return {
          title: 'Workspace Inisiator Kampanye',
          subtitle: 'Kelola pendanaan, unggah LPJ digital, dan koordinasikan relawan lapangan secara transparan.',
          badge: roleBadgeText || 'Dual-Role Aktif',
          badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: <Building2 className="w-5 h-5 text-blue-400" />
        };
      case 'relawan':
        return {
          title: 'Workspace Relawan Lapangan',
          subtitle: 'Pantau jadwal aksi kemanusiaan, konfirmasi kehadiran, dan unduh e-sertifikat sah Anda.',
          badge: roleBadgeText || 'Relawan Terverifikasi',
          badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: <Users className="w-5 h-5 text-blue-400" />
        };
      case 'admin':
        return {
          title: 'Panel Kontrol & Moderasi Admin',
          subtitle: 'Audit integritas kampanye, validasi kuitansi LPJ, dan pantau log sistem secara menyeluruh.',
          badge: roleBadgeText || 'Super Admin',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
          icon: <ShieldCheck className="w-5 h-5 text-blue-400" />
        };
      default:
        return {
          title: 'Portal Akun ActGiving',
          subtitle: 'Eksplorasi kampanye sosial, partisipasi dalam aksi kebaikan, dan pantau penyaluran terbuka.',
          badge: roleBadgeText || 'Donatur Terdaftar',
          badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          icon: <HeartHandshake className="w-5 h-5 text-blue-400" />
        };
    }
  };

  const meta = getRoleMetadata();

  return (
    <div className="min-h-screen bg-surface-bg flex">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-navy-darkest/70 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* ========================================================= */}
      {/* 1. FIXED LEFT SIDEBAR (Dark Navy: #0B132B)                */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-sidebar text-slate-200 border-r border-navy-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-navy-border shrink-0">
          <button
            onClick={() => onNavigateView('public')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-sky-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-blue/30 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                Act<span className="text-brand-blue">Giving</span>
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Aksi Nyata & Transparan</p>
            </div>
          </button>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-card lg:hidden"
            aria-label="Tutup Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-b border-navy-border">
          <div className="bg-navy-card rounded-xl p-3 border border-navy-border shadow-xs">
            <div className="flex items-center gap-3 mb-2.5">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-brand-blue shrink-0 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
                </div>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-navy-border/60">
              <span className="text-[10px] text-slate-400">Status Akun:</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
                {meta.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {primaryAction && (
            <button
              onClick={() => {
                primaryAction.onClick();
                setMobileSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md shadow-brand-blue/25 transition-all hover:scale-[1.02]"
            >
              {primaryAction.icon || <PlusCircle className="w-4 h-4" />}
              <span>{primaryAction.label}</span>
            </button>
          )}

          <div>
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Menu Navigasi Workspace
            </p>

            <nav className="space-y-1">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    tab.onClick();
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    tab.active
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25'
                      : 'text-slate-300 hover:bg-navy-card hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        tab.active
                          ? 'bg-white/20 text-white'
                          : 'bg-navy-card text-slate-300 border border-navy-border'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>


        </div>

        {/* Footer in Sidebar */}
        <div className="p-4 border-t border-navy-border bg-navy-darkest/40 shrink-0">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
              <span>Sistem Online</span>
            </span>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center">ActGiving Platform v2.0</p>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN RIGHT CONTENT AREA                                */}
      {/* ========================================================= */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="h-16 px-4 bg-navy-sidebar border-b border-navy-border flex items-center justify-between lg:hidden text-white shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg bg-navy-card text-slate-300 hover:text-white"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm tracking-tight font-sans">
              Act<span className="text-brand-blue">Giving</span>
            </span>
          </div>


        </header>

        {/* Top Dark Hero Workspace Banner */}
        <section className="bg-gradient-to-br from-navy-header via-navy-sidebar to-navy-darkest text-white border-b border-navy-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-navy-border/60">
              {/* Left Identity */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-blue shadow-lg shadow-brand-blue/20 shrink-0"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-brand-green rounded-full text-white shadow-xs" title="Terverifikasi">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h1 className="text-xl sm:text-2xl font-bold font-sans text-white">
                      {currentUser.name}
                    </h1>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeColor}`}>
                      {meta.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-2">
                    {workspaceSubtitle || meta.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-green" />
                      Status Identitas Terverifikasi
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{currentUser.city || 'Indonesia'}</span>
                  </div>
                </div>
              </div>

              {/* Action Button (if present) */}
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className="px-5 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/30 transition-all shrink-0 hover:scale-[1.02]"
                >
                  {primaryAction.icon || <PlusCircle className="w-4 h-4" />}
                  <span>{primaryAction.label}</span>
                </button>
              )}
            </div>

            {/* KPI Metric Chips */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6">
                {stats.map((stat, idx) => (
                  <div 
                    key={idx}
                    className="bg-navy-card/80 border border-navy-border/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-600/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-medium truncate">{stat.label}</span>
                      {stat.icon && <div className="text-brand-blue">{stat.icon}</div>}
                    </div>

                    <div className="space-y-1">
                      <div className="text-xl sm:text-2xl font-black text-white font-sans truncate">
                        {stat.value}
                      </div>
                      {(stat.subtext || stat.trend) && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          {stat.trend && (
                            <span className={stat.isPositive !== false ? 'text-brand-green font-semibold' : 'text-rose-400 font-semibold'}>
                              {stat.trend}
                            </span>
                          )}
                          {stat.subtext && <span className="truncate">{stat.subtext}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Navigation Anchor Bar */}
            {navTabs.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
                {navTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={tab.onClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      tab.active
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                        : 'bg-navy-card text-slate-300 hover:text-white hover:bg-navy-border'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          tab.active
                            ? 'bg-white/20 text-white'
                            : 'bg-navy-sidebar text-slate-300'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Main Content Children Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
