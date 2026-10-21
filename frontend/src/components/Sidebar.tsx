import React from 'react';
import { 
  HeartHandshake, 
  Heart,
  Compass, 
  BookOpen, 
  PlusCircle, 
  FileCode, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Activity, 
  Users, 
  Home,
  Calendar,
  Upload,
  FileText,
  Database,
  Lock,
  Clock,
  DollarSign,
  AlertCircle,
  QrCode,
  UserCheck
} from 'lucide-react';
import { Campaign, UserProfile, ActiveView } from '../types';

interface SidebarProps {
  currentUser: UserProfile;
  activeView: ActiveView;
  onNavigateView: (view: ActiveView, anchorId?: string) => void;
  relawanTab: 'jadwal' | 'riwayat' | 'cari' | 'profil';
  onSelectRelawanTab: (tab: 'jadwal' | 'riwayat' | 'cari' | 'profil') => void;
  inisiatorTab: 'kampanye' | 'lpj' | 'relawan' | 'panduan';
  onSelectInisiatorTab: (tab: 'kampanye' | 'lpj' | 'relawan' | 'panduan') => void;
  adminTab: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem';
  onSelectAdminTab: (tab: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem') => void;
  campaigns?: Campaign[];
  onOpenCreateCampaign: () => void;
  onOpenAuth: () => void;
  onOpenSourceModal: () => void;
  onSelectUser: (user: UserProfile) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeView,
  onNavigateView,
  relawanTab,
  onSelectRelawanTab,
  inisiatorTab,
  onSelectInisiatorTab,
  adminTab,
  onSelectAdminTab,
  campaigns = [],
  onOpenCreateCampaign,
  onOpenAuth,
  onOpenSourceModal,
  onSelectUser,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop
}) => {
  // Calculate dynamic badge counts from campaigns list
  const pendingCampaignsCount = campaigns.filter(c => c.status === 'pending_approval').length;
  const myCampaignsCount = campaigns.filter(
    c => currentUser.managedCampaignIds?.includes(c.id) ||
         c.initiatorName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
         c.id === 'camp-01'
  ).length;
  const joinedCampaignsCount = campaigns.filter(
    c => currentUser.joinedCampaignIds?.includes(c.id) || c.id === 'camp-01' || c.id === 'camp-02'
  ).length;
  const availableVolunteerCount = campaigns.filter(
    c => (c.mode === 'relawan' || c.mode === 'keduanya') && 
         !currentUser.joinedCampaignIds?.includes(c.id) &&
         c.status !== 'pending_approval' && 
         c.status !== 'rejected'
  ).length;

  const handlePublicNavClick = (anchorId?: string) => {
    onNavigateView('public', anchorId);
    onCloseMobile();
  };

  const handleRelawanItemClick = (tab: 'jadwal' | 'riwayat' | 'cari' | 'profil') => {
    onSelectRelawanTab(tab);
    onCloseMobile();
  };

  const handleInisiatorItemClick = (tab: 'kampanye' | 'lpj' | 'relawan' | 'panduan') => {
    onSelectInisiatorTab(tab);
    onCloseMobile();
  };

  const handleAdminItemClick = (tab: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem') => {
    onSelectAdminTab(tab);
    onCloseMobile();
  };

  // Determine current active mode
  const currentRole = currentUser.role;

  // Visual theming based on role
  const getThemeColors = () => {
    switch (currentRole) {
      case 'admin':
        return {
          badge: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
          activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
          hoverBg: 'hover:bg-blue-900/40 hover:text-blue-200',
          accentBorder: 'border-blue-800/40',
          kpiBg: 'bg-blue-950/60 border-blue-800/50 text-blue-200',
          roleName: 'Super Admin',
          workspaceTitle: 'Panel Moderasi Admin'
        };
      case 'inisiator':
        return {
          badge: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
          activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
          hoverBg: 'hover:bg-blue-900/40 hover:text-sky-200',
          accentBorder: 'border-blue-800/40',
          kpiBg: 'bg-blue-950/60 border-blue-800/50 text-sky-200',
          roleName: 'Dual-Role Inisiator',
          workspaceTitle: 'Workspace Inisiator'
        };
      case 'relawan':
        return {
          badge: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
          activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
          hoverBg: 'hover:bg-blue-900/40 hover:text-blue-200',
          accentBorder: 'border-blue-800/40',
          kpiBg: 'bg-blue-950/60 border-blue-800/50 text-blue-200',
          roleName: 'Relawan Terdaftar',
          workspaceTitle: 'Workspace Relawan'
        };
      default:
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
          hoverBg: 'hover:bg-blue-950/40 hover:text-blue-200',
          accentBorder: 'border-slate-800',
          kpiBg: 'bg-slate-800/80 border-slate-700/60 text-slate-300',
          roleName: 'Donatur Guest',
          workspaceTitle: 'Portal Publik ActGiving'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
          ${isOpenMobile ? 'translate-x-0 w-72 sm:w-80' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsedDesktop ? 'lg:w-20' : 'lg:w-68'}
        `}
      >
        {/* 1. Header / Brand & Workspace Indicator */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <button
            onClick={() => handlePublicNavClick()}
            className="flex items-center gap-3 text-left overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>

            {(!isCollapsedDesktop || isOpenMobile) && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-white font-['Space_Grotesk']">
                    Act<span className="text-blue-400">Giving</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{theme.workspaceTitle}</p>
              </div>
            )}
          </button>

          {/* Close button on mobile / Collapse button on desktop */}
          <div className="flex items-center gap-1">
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleCollapseDesktop}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isCollapsedDesktop ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            >
              {isCollapsedDesktop ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body: ROLE-SPECIFIC SIDEBAR CONTENT */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
          
          {/* User Profile Card / Role Header */}
          {(!isCollapsedDesktop || isOpenMobile) ? (
            <div className={`rounded-xl p-3 border shadow-xs ${theme.kpiBg}`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Role Saat Ini
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                  {theme.roleName}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.city || 'Indonesia'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 pb-3 border-b border-slate-800">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-600 shadow-sm"
                title={`${currentUser.name} (${theme.roleName})`}
              />
              <span className={`text-[9px] font-bold px-1 py-0.2 rounded-full uppercase border ${theme.badge}`}>
                {currentRole.slice(0, 3)}
              </span>
            </div>
          )}

          {/* ======================================================== */}
          {/* A. KHUSUS ROLE: RELAWAN SIDEBAR                          */}
          {/* ======================================================== */}
          {currentRole === 'relawan' && (
            <div className="space-y-4">
              <div>
                {(!isCollapsedDesktop || isOpenMobile) && (
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center justify-between">
                    <span>Menu Navigasi Relawan</span>
                  </p>
                )}

                <nav className="space-y-1">
                  {/* 1. Jadwal & Tugas Lapangan */}
                  <button
                    onClick={() => handleRelawanItemClick('jadwal')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'relawan_dashboard' && relawanTab === 'jadwal'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Jadwal & Tugas Lapangan"
                  >
                    <Calendar className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <div className="truncate flex-1 text-left flex items-center justify-between">
                        <span className="truncate">Jadwal Lapangan</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                          {joinedCampaignsCount}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* 2. Riwayat & E-Sertifikat */}
                  <button
                    onClick={() => handleRelawanItemClick('riwayat')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'relawan_dashboard' && relawanTab === 'riwayat'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Riwayat & E-Sertifikat Digital"
                  >
                    <Award className="w-4 h-4 shrink-0 text-sky-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Riwayat & Sertifikat</span>
                    )}
                  </button>

                  {/* 3. Cari Misi Relawan Baru */}
                  <button
                    onClick={() => handleRelawanItemClick('cari')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'relawan_dashboard' && relawanTab === 'cari'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Cari Misi Relawan Baru"
                  >
                    <Compass className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <div className="truncate flex-1 text-left flex items-center justify-between">
                        <span className="truncate">Cari Misi Baru</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                          {availableVolunteerCount}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* 4. Keahlian & Kontak Darurat */}
                  <button
                    onClick={() => handleRelawanItemClick('profil')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'relawan_dashboard' && relawanTab === 'profil'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Keahlian & Kontak Darurat"
                  >
                    <Users className="w-4 h-4 shrink-0 text-sky-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Keahlian & Profil</span>
                    )}
                  </button>
                </nav>
              </div>

              {/* KPI Mini Widget Relawan */}
              {(!isCollapsedDesktop || isOpenMobile) && (
                <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50 text-[11px] space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Jam Kontribusi:</span>
                    <span className="font-bold text-sky-400">18 Jam</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>E-Sertifikat:</span>
                    <span className="font-bold text-blue-300">{joinedCampaignsCount} File</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Reputasi Relawan:</span>
                    <span className="font-bold text-blue-200">850 Poin</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* B. KHUSUS ROLE: INISIATOR SIDEBAR                        */}
          {/* ======================================================== */}
          {currentRole === 'inisiator' && (
            <div className="space-y-4">
              {/* Primary CTA: Buka Galang Aksi Baru */}
              <button
                onClick={() => {
                  onOpenCreateCampaign();
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] ${
                  isCollapsedDesktop && !isOpenMobile ? 'px-0' : ''
                }`}
                title="+ Buka Galang Aksi Baru"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                {(!isCollapsedDesktop || isOpenMobile) && (
                  <span className="truncate">+ Buka Galang Aksi</span>
                )}
              </button>

              <div>
                {(!isCollapsedDesktop || isOpenMobile) && (
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center justify-between">
                    <span>Manajemen Kampanye & LPJ</span>
                  </p>
                )}

                <nav className="space-y-1">
                  {/* 1. Kampanye Kelolaan Saya */}
                  <button
                    onClick={() => handleInisiatorItemClick('kampanye')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'inisiator_dashboard' && inisiatorTab === 'kampanye'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Kampanye Kelolaan Saya"
                  >
                    <Building2 className="w-4 h-4 shrink-0 text-sky-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <div className="truncate flex-1 text-left flex items-center justify-between">
                        <span className="truncate">Kampanye Saya</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 font-bold">
                          {myCampaignsCount}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* 2. Unggah & Kelola LPJ */}
                  <button
                    onClick={() => handleInisiatorItemClick('lpj')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'inisiator_dashboard' && inisiatorTab === 'lpj'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Unggah & Kelola LPJ Transparansi"
                  >
                    <Upload className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Unggah LPJ</span>
                    )}
                  </button>

                  {/* 3. Pendaftar Relawan Lapangan */}
                  <button
                    onClick={() => handleInisiatorItemClick('relawan')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'inisiator_dashboard' && inisiatorTab === 'relawan'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Pendaftar Relawan Lapangan"
                  >
                    <Users className="w-4 h-4 shrink-0 text-sky-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Pendaftar Relawan</span>
                    )}
                  </button>

                  {/* 4. Standar Akuntabilitas */}
                  <button
                    onClick={() => handleInisiatorItemClick('panduan')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'inisiator_dashboard' && inisiatorTab === 'panduan'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Standar Akuntabilitas & Verifikasi LPJ"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Standar Akuntabilitas</span>
                    )}
                  </button>
                </nav>
              </div>

              {/* KPI Mini Widget Inisiator */}
              {(!isCollapsedDesktop || isOpenMobile) && (
                <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50 text-[11px] space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Donasi Masuk:</span>
                    <span className="font-bold text-sky-400">Rp 87,5 Juta</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Relawan Terhimpun:</span>
                    <span className="font-bold text-blue-300">48 Orang</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status Verifikasi:</span>
                    <span className="font-bold text-blue-200">Dual-Role Aktif</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* C. KHUSUS ROLE: ADMIN SIDEBAR                            */}
          {/* ======================================================== */}
          {currentRole === 'admin' && (
            <div className="space-y-4">
              <div>
                {(!isCollapsedDesktop || isOpenMobile) && (
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center justify-between">
                    <span>Audit & Kontrol Moderasi</span>
                  </p>
                )}

                <nav className="space-y-1">
                  {/* 1. Antrean Moderasi Kampanye */}
                  <button
                    onClick={() => handleAdminItemClick('moderasi')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'admin_dashboard' && adminTab === 'moderasi'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Antrean Moderasi Kampanye"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <div className="truncate flex-1 text-left flex items-center justify-between">
                        <span className="truncate">Antrean Moderasi</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                          {pendingCampaignsCount} Butuh Review
                        </span>
                      </div>
                    )}
                  </button>

                  {/* 2. Audit LPJ & Kuitansi */}
                  <button
                    onClick={() => handleAdminItemClick('audit_lpj')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'admin_dashboard' && adminTab === 'audit_lpj'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Audit LPJ & Kuitansi Publik"
                  >
                    <FileText className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Audit LPJ & Kuitansi</span>
                    )}
                  </button>

                  {/* 3. Audit Transaksi Sandbox */}
                  <button
                    onClick={() => handleAdminItemClick('transaksi')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'admin_dashboard' && adminTab === 'transaksi'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Audit Transaksi Sandbox"
                  >
                    <Activity className="w-4 h-4 shrink-0 text-sky-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Audit Transaksi Sandbox</span>
                    )}
                  </button>

                  {/* 4. Integritas ACID & Log Sistem */}
                  <button
                    onClick={() => handleAdminItemClick('sistem')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'admin_dashboard' && adminTab === 'sistem'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Integritas ACID & Log Sistem"
                  >
                    <Database className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Integritas Data & Log</span>
                    )}
                  </button>
                </nav>
              </div>

              {/* KPI Mini Widget Admin */}
              {(!isCollapsedDesktop || isOpenMobile) && (
                <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50 text-[11px] space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Audit Status:</span>
                    <span className="font-bold text-sky-400">1 Menunggu Review</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ACID Engine:</span>
                    <span className="font-bold text-blue-300">100% Konsisten</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Payment Gateway:</span>
                    <span className="font-bold text-blue-200">Simulator Aktif</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* D. KHUSUS ROLE: GUEST / DONATUR (PUBLIC PORTAL)          */}
          {/* ======================================================== */}
          {currentRole === 'guest' && (
            <div className="space-y-4">
              <div>
                {(!isCollapsedDesktop || isOpenMobile) && (
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center justify-between">
                    <span>Navigasi Publik ActGiving</span>
                  </p>
                )}

                <nav className="space-y-1">
                  {/* 1. Beranda & Sorotan Utama */}
                  <button
                    onClick={() => handlePublicNavClick()}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeView === 'public'
                        ? theme.activeBg
                        : 'text-slate-300 ' + theme.hoverBg
                    } ${isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''}`}
                    title="Beranda & Katalog Publik"
                  >
                    <Home className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Beranda Utama</span>
                    )}
                  </button>

                  {/* 2. Jelajah Katalog Aksi 3 Mode */}
                  <button
                    onClick={() => handlePublicNavClick('katalog-aksi')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-300 ${theme.hoverBg} ${
                      isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''
                    }`}
                    title="Eksplorasi Katalog 3 Mode Kampanye"
                  >
                    <Compass className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Katalog 3 Mode Aksi</span>
                    )}
                  </button>

                  {/* 3. Panduan Tutorial Interaktif */}
                  <button
                    onClick={() => handlePublicNavClick('tutorial-interaktif')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-300 ${theme.hoverBg} ${
                      isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''
                    }`}
                    title="Panduan Cara Kerja ActGiving"
                  >
                    <BookOpen className="w-4 h-4 shrink-0 text-sky-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Panduan Cara Kerja</span>
                    )}
                  </button>

                  {/* 4. Transparansi Live Counter */}
                  <button
                    onClick={() => handlePublicNavClick('transparansi-counter')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-300 ${theme.hoverBg} ${
                      isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''
                    }`}
                    title="Transparansi Live Counter & LPJ Publik"
                  >
                    <Activity className="w-4 h-4 shrink-0 text-blue-400" />
                    {(!isCollapsedDesktop || isOpenMobile) && (
                      <span className="truncate">Transparansi Live</span>
                    )}
                  </button>
                </nav>
              </div>

              {/* Quick Action Button for Guest: Donasi & Eksplorasi Aksi */}
              <button
                onClick={() => {
                  handlePublicNavClick('katalog-aksi');
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] ${
                  isCollapsedDesktop && !isOpenMobile ? 'px-0' : ''
                }`}
                title="Eksplorasi Aksi Sosial"
              >
                <Heart className="w-4 h-4 shrink-0 text-white" />
                {(!isCollapsedDesktop || isOpenMobile) && (
                  <span className="truncate">Eksplorasi Aksi Donasi</span>
                )}
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* UNIVERSAL SECTION: BERANDA PUBLIK (JIKA LAGI DI DASHBOARD) */}
          {/* ======================================================== */}
          {currentRole !== 'guest' && (
            <div className="pt-2 border-t border-slate-800">
              {(!isCollapsedDesktop || isOpenMobile) && (
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Portal Publik
                </p>
              )}
              <button
                onClick={() => handlePublicNavClick()}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all ${
                  isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''
                }`}
                title="Lihat Beranda & Katalog Publik"
              >
                <Home className="w-4 h-4 shrink-0 text-slate-400" />
                {(!isCollapsedDesktop || isOpenMobile) && (
                  <span className="truncate">Lihat Beranda Publik</span>
                )}
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* UNIVERSAL: MODAL KODE HTML                               */}
          {/* ======================================================== */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onOpenSourceModal();
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all ${
                isCollapsedDesktop && !isOpenMobile ? 'justify-center px-0' : ''
              }`}
              title="Lihat Kode HTML Lengkap"
            >
              <FileCode className="w-4 h-4 shrink-0 text-blue-400" />
              {(!isCollapsedDesktop || isOpenMobile) && (
                <span className="truncate">Kode HTML Mandiri</span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Footer / Status Sistem */}
        {(!isCollapsedDesktop || isOpenMobile) && (
          <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span>ActGiving Platform Online</span>
              </span>
              <span className="font-mono text-slate-500">v1.2.0</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
