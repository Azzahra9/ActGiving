import React, { useState, useRef, useEffect } from 'react';
import { 
  HeartHandshake, 
  Compass, 
  BookOpen, 
  Camera, 
  Activity, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Building2, 
  Award, } from 'lucide-react';
import { UserProfile, ActiveView, DEFAULT_GUEST_USER } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentUser: UserProfile;
  activeView: ActiveView;
  onNavigateView: (view: ActiveView) => void;
  onOpenCreateCampaign: () => void;
  onOpenAuth: () => void;
  onOpenSourceModal: () => void;
  onOpenWireframeModal?: () => void;
  onOpenAdminPanel: () => void;
  onOpenRelawanActivity: () => void;
  onOpenInisiatorDashboard: () => void;
  onSelectUser: (user: UserProfile) => void;
  onToggleMobileSidebar?: () => void;
  isCollapsedDesktop?: boolean;
  onToggleCollapseDesktop?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeView,
  onNavigateView,
  onOpenCreateCampaign,
  onOpenAuth,
  onSelectUser,
  onToggleMobileSidebar,
  onToggleCollapseDesktop
}) => {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const effectiveUser = currentUser && currentUser.role !== 'guest' ? currentUser : authUser;

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    try {
      await logout();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    if (onSelectUser) {
      onSelectUser(DEFAULT_GUEST_USER);
    }
    onNavigateView('public');
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (activeView !== 'public') {
      onNavigateView('public');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ======================================================= */}
          {/* 1. LEFT BRAND & PORTAL DONASI BADGE                     */}
          {/* ======================================================= */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sidebar toggle for Dashboard views */}
            {activeView !== 'public' && (
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    onToggleMobileSidebar?.();
                  } else {
                    onToggleCollapseDesktop?.();
                  }
                }}
                className="p-2 text-slate-700 hover:text-brand-blue hover:bg-blue-50/60 rounded-xl border border-slate-200 transition-colors shrink-0"
                aria-label="Toggle Sidebar"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
            )}

            <button
              onClick={() => onNavigateView('public')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-md shadow-brand-blue/30 group-hover:scale-105 transition-transform shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                    Act<span className="text-brand-blue">Giving</span>
                  </span>
                  <span className="hidden sm:flex items-center text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-brand-blue px-2 py-0.5 rounded-full border border-blue-200">
                    Portal Donasi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Sistem Informasi Transparansi Lapangan Terbuka
                </p>
              </div>
            </button>
          </div>

          {/* ======================================================= */}
          {/* 2. CENTER NAVIGATION LINKS (EXACT FIGMA LAYOUT)         */}
          {/* ======================================================= */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-xs sm:text-sm font-semibold text-slate-600 whitespace-nowrap">
            {activeView === 'public' ? (
              <>
                <button
                  onClick={() => scrollToSection('katalog-aksi')}
                  className="flex items-center gap-1.5 hover:text-brand-blue transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Compass className="w-4 h-4 text-brand-blue" />
                  <span className="whitespace-nowrap">Eksplorasi Katalog</span>
                </button>

                <button
                  onClick={() => scrollToSection('galeri-kegiatan')}
                  className="flex items-center gap-1.5 hover:text-brand-blue transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Camera className="w-4 h-4 text-brand-blue" />
                  <span className="whitespace-nowrap">Foto Kegiatan & LPJ</span>
                </button>

                <button
                  onClick={() => scrollToSection('transparansi-counter')}
                  className="flex items-center gap-1.5 hover:text-brand-blue transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Activity className="w-4 h-4 text-brand-blue" />
                  <span className="whitespace-nowrap">Transparansi Live</span>
                </button>

                <button
                  onClick={() => scrollToSection('tutorial-interaktif')}
                  className="flex items-center gap-1.5 hover:text-brand-blue transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4 text-brand-blue" />
                  <span className="whitespace-nowrap">Panduan Donatur</span>
                </button>
              </>
            ) : null}
          </nav>

          {/* ======================================================= */}
          {/* 3. RIGHT PRIMARY CTA: "DONASI SEKARANG" (PILL BUTTON)   */}
          {/* ======================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Mobile / Tablet Hamburger Menu (sebelah kiri tombol Donasi Sekarang) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex xl:hidden items-center justify-center p-2.5 text-slate-700 hover:text-brand-blue hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Menu"
              title="Menu Navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Primary Action Button: Donasi Sekarang (Hidden on mobile < md) */}
            <button
              onClick={() => scrollToSection('katalog-aksi')}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-blue/30 transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span className="whitespace-nowrap">Donasi Sekarang</span>
            </button>

            {/* Profile Avatar / Login Icon */}
            {!isAuthenticated && (!effectiveUser || effectiveUser.role === 'guest') ? (
              <button
                onClick={onOpenAuth}
                className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="Masuk / Daftar Akun"
                aria-label="Masuk Akun"
              >
                <User className="w-4 h-4" />
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {effectiveUser.avatarUrl ? (
                    <img
                      src={effectiveUser.avatarUrl}
                      alt={effectiveUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-brand-blue"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs">
                      {effectiveUser.name.charAt(0)}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-xl mb-1.5">
                      <p className="font-bold text-xs text-slate-900 truncate">{effectiveUser.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{effectiveUser.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-brand-blue">
                        {effectiveUser.role}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {effectiveUser.role === 'inisiator' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigateView('inisiator_dashboard');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-brand-blue" />
                          <span>Workspace Inisiator</span>
                        </button>
                      )}

                      {effectiveUser.role === 'relawan' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigateView('relawan_dashboard');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-brand-blue" />
                          <span>Workspace Relawan</span>
                        </button>
                      )}

                      {effectiveUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigateView('admin_dashboard');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-brand-blue" />
                          <span>Panel Admin</span>
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2 font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-slate-100 space-y-2 animate-in fade-in">
            <button
              onClick={() => scrollToSection('katalog-aksi')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap cursor-pointer"
            >
              <Compass className="w-4 h-4 text-brand-blue" />
              <span className="whitespace-nowrap">Eksplorasi Katalog</span>
            </button>
            <button
              onClick={() => scrollToSection('galeri-kegiatan')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap cursor-pointer"
            >
              <Camera className="w-4 h-4 text-brand-blue" />
              <span className="whitespace-nowrap">Foto Kegiatan & LPJ</span>
            </button>
            <button
              onClick={() => scrollToSection('transparansi-counter')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap cursor-pointer"
            >
              <Activity className="w-4 h-4 text-brand-blue" />
              <span className="whitespace-nowrap">Transparansi Live</span>
            </button>
            <button
              onClick={() => scrollToSection('tutorial-interaktif')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-brand-blue" />
              <span className="whitespace-nowrap">Panduan Donatur</span>
            </button>
            {/* Mobile Primary CTA: Donasi Sekarang */}
            <div className="pt-2">
              <button
                onClick={() => scrollToSection('katalog-aksi')}
                className="w-full py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold shadow-md shadow-brand-blue/30 text-center cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donasi Sekarang</span>
              </button>
            </div>

            {!isAuthenticated && (!effectiveUser || effectiveUser.role === 'guest') && (
              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold text-center cursor-pointer transition-colors"
                >
                  Masuk / Daftar Akun
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
