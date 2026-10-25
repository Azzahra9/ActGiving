import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import campaignService from './services/campaignService';
import { Campaign, DigitalInvoice, UserProfile, LpjItem, ActiveView, DEFAULT_GUEST_USER } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { CampaignCatalog } from './components/CampaignCatalog';
import { ActivityPhotoGallery } from './components/ActivityPhotoGallery';
import { LiveCounter } from './components/LiveCounter';
import { Sidebar } from './components/Sidebar';
import { RelawanDashboardView } from './components/dashboards/RelawanDashboardView';
import { InisiatorDashboardView } from './components/dashboards/InisiatorDashboardView';
import { AdminDashboardView } from './components/dashboards/AdminDashboardView';
import { GuestCheckoutModal } from './components/GuestCheckoutModal';
import { RegisterModal } from './components/RegisterModal';
import { LpjModal } from './components/LpjModal';
import { CreateCampaignModal } from './components/CreateCampaignModal';
import { AuthModal } from './components/AuthModal';
import { StandaloneHtmlModal } from './components/StandaloneHtmlModal';
import { WireframeHtmlModal } from './components/WireframeHtmlModal';
import { AdminModerationModal } from './components/AdminModerationModal';
import { RelawanActivityModal } from './components/RelawanActivityModal';
import { InisiatorDashboardModal } from './components/InisiatorDashboardModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { formatRupiah } from './utils/format';
import { HeartHandshake, ShieldCheck, CheckCircle2, ArrowUpRight, LayoutDashboard } from 'lucide-react';

export default function App() {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  
  // Current Active Actor Session (SRS Dual-Role & Multi-Actor Architecture)
  const [currentUser, setCurrentUser] = useState<UserProfile>(authUser || DEFAULT_GUEST_USER);

  // Sync state if authUser changes
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);
  
  // Dedicated Role-Based Dashboard View Mode
  const [activeView, setActiveView] = useState<ActiveView>('public');

  // Responsive Sidebar States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);

  // Active sub-tab states for each role (controlled via Role-Specific Sidebar)
  const [relawanTab, setRelawanTab] = useState<'jadwal' | 'riwayat' | 'cari' | 'profil'>('jadwal');
  const [inisiatorTab, setInisiatorTab] = useState<'kampanye' | 'lpj' | 'relawan' | 'panduan'>('kampanye');
  const [adminTab, setAdminTab] = useState<'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem'>('moderasi');

  // Global Application State (REST API & Real Data)
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState<boolean>(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [totalDonationRp, setTotalDonationRp] = useState<number>(0);
  const [totalVolunteers, setTotalVolunteers] = useState<number>(0);
  const [completedPrograms, setCompletedPrograms] = useState<number>(0);

  // Fetch real campaigns from Laravel REST API (GET /api/campaigns)
  const fetchCampaigns = useCallback(async () => {
    setIsLoadingCampaigns(true);
    setCampaignError(null);
    try {
      const data = await campaignService.getCampaigns();
      const validCampaigns = Array.isArray(data) ? data : [];
      setCampaigns((prev) => {
        // Pertahankan kampanye baru yang masih berstatus pending dari sesi lokal jika belum masuk di response active
        const pendingLocal = prev.filter(
          (c) => c.status === 'pending_approval' || c.status === 'pending'
        );
        const validIds = new Set(validCampaigns.map((c) => c.id));
        const retained = pendingLocal.filter((c) => !validIds.has(c.id));
        const merged = [...retained, ...validCampaigns];
        // Filter unik agar tidak ada duplikasi ID kampanye
        return merged.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
      });
      const dynamicDonations = validCampaigns.reduce((acc, c) => acc + (c.collectedFunds || 0), 0);
      const dynamicVolunteers = validCampaigns.reduce((acc, c) => acc + (c.filledVolunteers || 0), 0);
      const dynamicCompleted = validCampaigns.filter(c => c.status === 'completed' || c.status === 'closed').length;
      setTotalDonationRp(dynamicDonations);
      setTotalVolunteers(dynamicVolunteers);
      setCompletedPrograms(dynamicCompleted);
    } catch (err: any) {
      console.warn('Gagal memuat kampanye dari backend API:', err);
      setCampaignError('Tidak dapat terhubung ke REST API Laravel (http://127.0.0.1:8000/api). Pastikan server backend Anda sedang aktif.');
      setCampaigns([]);
      setTotalDonationRp(0);
      setTotalVolunteers(0);
      setCompletedPrograms(0);
    } finally {
      setIsLoadingCampaigns(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Multi-Filter Search States (SRS Subbab 2.3 Point 2)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua Kota');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedMode, setSelectedMode] = useState('all');

  // Modal Context States
  const [checkoutCampaign, setCheckoutCampaign] = useState<Campaign | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [lpjCampaign, setLpjCampaign] = useState<Campaign | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);

  const handleOpenCreateCampaign = () => {
    setCampaignToEdit(null);
    setIsCreateOpen(true);
  };

  const handleOpenEditCampaign = (camp: Campaign) => {
    setCampaignToEdit(camp);
    setIsCreateOpen(true);
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
  };
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [sourceModalMode, setSourceModalMode] = useState<'hifi' | 'wireframe'>('hifi');

  const handleOpenSourceModal = (mode: 'hifi' | 'wireframe' = 'hifi') => {
    setSourceModalMode(mode);
    setIsSourceOpen(true);
  };
  const [isWireframeOpen, setIsWireframeOpen] = useState(false);

  // Dedicated Actor Dashboard Modals (as fallback or popup inspection)
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRelawanOpen, setIsRelawanOpen] = useState(false);
  const [isInisiatorOpen, setIsInisiatorOpen] = useState(false);

  // Actor Switching with Automatic Dashboard Transition
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    setAuthUser(user);
    if (user.role === 'relawan') {
      setActiveView('relawan_dashboard');
    } else if (user.role === 'inisiator') {
      setActiveView('inisiator_dashboard');
    } else if (user.role === 'admin') {
      setActiveView('admin_dashboard');
    } else {
      setActiveView('public');
    }
  };

  // Filter calculation (Catalog strictly displays approved 'active' campaigns only)
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      // Lapis pengaman: Hanya kampanye berstatus 'active' yang boleh tampil di katalog publik
      if (c.status !== 'active') {
        return false;
      }

      // Keyword
      const matchKeyword = !searchQuery.trim() || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.initiatorName.toLowerCase().includes(searchQuery.toLowerCase());

      // City
      const matchCity = selectedCity === 'Semua Kota' || c.locationCity.toLowerCase() === selectedCity.toLowerCase();

      // Category
      const matchCategory = selectedCategory === 'Semua Kategori' || c.category === selectedCategory;

      // Mode
      const matchMode = selectedMode === 'all' || c.mode === selectedMode;

      return matchKeyword && matchCity && matchCategory && matchMode;
    }).filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
  }, [campaigns, searchQuery, selectedCity, selectedCategory, selectedMode]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim() !== '') count++;
    if (selectedCity !== 'Semua Kota') count++;
    if (selectedCategory !== 'Semua Kategori') count++;
    if (selectedMode !== 'all') count++;
    return count;
  }, [searchQuery, selectedCity, selectedCategory, selectedMode]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('Semua Kota');
    setSelectedCategory('Semua Kategori');
    setSelectedMode('all');
  };

  // Atomic State Mutation for Donations (UC-01 Happy Path Langkah 9 & NFR-04)
  const handleDonationSuccess = (campaignId: string, amount: number, invoice: DigitalInvoice) => {
    // 1. Mutate Campaign target & collected funds
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            collectedFunds: (c.collectedFunds || 0) + amount,
          };
        }
        return c;
      })
    );

    // 2. Mutate Global Live Counter
    setTotalDonationRp((prev) => prev + amount);
  };

  // Atomic State Mutation for Volunteer Registration (UC-02)
  const handleVolunteerSuccess = (campaignId: string) => {
    // 1. Mutate Campaign volunteer quota
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            filledVolunteers: (c.filledVolunteers || 0) + 1,
          };
        }
        return c;
      })
    );

    // 2. Mutate Global Live Counter
    setTotalVolunteers((prev) => prev + 1);

    // 3. Record in current volunteer's joined campaigns
    setCurrentUser((prev) => ({
      ...prev,
      joinedCampaignIds: Array.from(new Set([...(prev.joinedCampaignIds || []), campaignId]))
    }));
  };

  // Inisiasi Kampanye Baru (FR-06)
  const handleAddCampaign = (newCamp: Campaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      managedCampaignIds: Array.from(new Set([...(prev.managedCampaignIds || []), newCamp.id]))
    }));
    // Re-fetch backend list to keep in sync
    fetchCampaigns();
  };

  // Admin Moderasi (UC-03 / FR-07)
  const handleApproveCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: 'active' } : c))
    );
  };

  const handleRejectCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: 'rejected' } : c))
    );
  };

  // Inisiator Upload LPJ Baru (FR-12)
  const handleAddLpj = (campaignId: string, newLpj: LpjItem) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const filtered = (c.lpjReports || []).filter((r) => r.id !== newLpj.id);
          return {
            ...c,
            lpjReports: [newLpj, ...filtered]
          };
        }
        return c;
      })
    );
  };

  // Inisiator Update LPJ
  const handleUpdateLpj = (campaignId: string, updatedLpj: LpjItem) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            lpjReports: (c.lpjReports || []).map((r) => (r.id === updatedLpj.id ? updatedLpj : r))
          };
        }
        return c;
      })
    );
  };

  // Inisiator Delete LPJ
  const handleDeleteLpj = (campaignId: string, lpjId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            lpjReports: (c.lpjReports || []).filter((r) => r.id !== lpjId)
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col lg:flex-row">
      
      {/* 0. Responsive Role-Specific Sidebar Navigation (Only on Role Dashboards, Not on Public Landing Page) */}
      {activeView !== 'public' && (
        <Sidebar
          currentUser={currentUser}
          activeView={activeView}
          onNavigateView={(view, anchorId) => {
            setActiveView(view);
            if (anchorId && view === 'public') {
              setTimeout(() => {
                const el = document.getElementById(anchorId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }}
          relawanTab={relawanTab}
          onSelectRelawanTab={(tab) => {
            setRelawanTab(tab);
            setActiveView('relawan_dashboard');
          }}
          inisiatorTab={inisiatorTab}
          onSelectInisiatorTab={(tab) => {
            setInisiatorTab(tab);
            setActiveView('inisiator_dashboard');
          }}
          adminTab={adminTab}
          onSelectAdminTab={(tab) => {
            setAdminTab(tab);
            setActiveView('admin_dashboard');
          }}
          campaigns={campaigns}
          onOpenCreateCampaign={handleOpenCreateCampaign}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenSourceModal={() => setIsSourceOpen(true)}
          onSelectUser={handleSelectUser}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsedDesktop={isCollapsedDesktop}
          onToggleCollapseDesktop={() => setIsCollapsedDesktop((prev) => !prev)}
        />
      )}

      {/* Main App Workspace (Full Width on Landing Page, Padded on Dashboard Views) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          activeView === 'public'
            ? 'w-full'
            : (isCollapsedDesktop ? 'lg:pl-20' : 'lg:pl-68')
        }`}
      >
        {/* 1. Header Navigasi Terpadu Multi-Aktor with Sidebar Trigger */}
        <Header
          currentUser={currentUser}
          activeView={activeView}
          onNavigateView={setActiveView}
          onOpenCreateCampaign={handleOpenCreateCampaign}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenSourceModal={() => handleOpenSourceModal('hifi')}
          onOpenWireframeModal={() => handleOpenSourceModal('wireframe')}
          onOpenAdminPanel={() => setActiveView('admin_dashboard')}
          onOpenRelawanActivity={() => setActiveView('relawan_dashboard')}
          onOpenInisiatorDashboard={() => setActiveView('inisiator_dashboard')}
          onSelectUser={handleSelectUser}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          isCollapsedDesktop={isCollapsedDesktop}
          onToggleCollapseDesktop={() => setIsCollapsedDesktop((prev) => !prev)}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 min-w-0">
          {/* VIEW CONDITIONAL: DEDICATED ROLE DASHBOARD OR PUBLIC PORTAL */}
          {activeView === 'relawan_dashboard' && (
            <RelawanDashboardView
              currentUser={currentUser}
              campaigns={campaigns}
              onExplorePublic={() => setActiveView('public')}
              onOpenVolunteerModal={() => setIsRegisterOpen(true)}
              onOpenLpjModal={(camp) => setLpjCampaign(camp)}
              activeTab={relawanTab}
              onTabChange={setRelawanTab}
            />
          )}

          {activeView === 'inisiator_dashboard' && (
            <ErrorBoundary fallbackTitle="Kendala pada Dashboard Inisiator">
              <InisiatorDashboardView
                currentUser={currentUser}
                campaigns={campaigns}
                onExplorePublic={() => setActiveView('public')}
                onOpenCreateCampaign={handleOpenCreateCampaign}
                onEditCampaign={handleOpenEditCampaign}
                onDeleteCampaign={handleDeleteCampaign}
                onAddLpj={handleAddLpj}
                onUpdateLpj={handleUpdateLpj}
                onDeleteLpj={handleDeleteLpj}
                onOpenLpjModal={(camp) => setLpjCampaign(camp)}
                activeTab={inisiatorTab}
                onTabChange={setInisiatorTab}
              />
            </ErrorBoundary>
          )}

          {activeView === 'admin_dashboard' && (
            <AdminDashboardView
              currentUser={currentUser}
              campaigns={campaigns}
              onExplorePublic={() => setActiveView('public')}
              onApproveCampaign={handleApproveCampaign}
              onRejectCampaign={handleRejectCampaign}
              onOpenLpjModal={(camp) => setLpjCampaign(camp)}
              activeTab={adminTab}
              onTabChange={setAdminTab}
            />
          )}

          {activeView === 'public' && (
            <>
              {/* Notification Banner when browsing public catalog with a logged-in actor */}
              {currentUser.role !== 'guest' && (
                <div className="bg-slate-900 text-white border-b border-slate-800 py-2.5 px-4">
                  <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>
                        Masuk sebagai: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">Anda sedang melihat Beranda & Katalog Publik</span>
                    </div>

                    <button
                      onClick={() => {
                        if (currentUser.role === 'relawan') setActiveView('relawan_dashboard');
                        else if (currentUser.role === 'inisiator') setActiveView('inisiator_dashboard');
                        else if (currentUser.role === 'admin') setActiveView('admin_dashboard');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Buka Dashboard Khusus {currentUser.role.toUpperCase()} ➔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Hero Section */}
              <HeroSection />

              {/* 3. Katalog Aksi Terdekat 3 Mode Kampanye */}
              <CampaignCatalog
                campaigns={filteredCampaigns}
                isLoading={isLoadingCampaigns}
                error={campaignError}
                onRetry={fetchCampaigns}
                onDonateClick={(camp) => setCheckoutCampaign(camp)}
                onVolunteerClick={() => setIsRegisterOpen(true)}
                onViewLpjClick={(camp) => setLpjCampaign(camp)}
                onResetFilters={handleResetFilters}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* 4. Dokumentasi Foto Kegiatan Lapangan & LPJ Digital Terhubung */}
              <ActivityPhotoGallery
                campaigns={filteredCampaigns}
                onViewLpj={(camp) => setLpjCampaign(camp)}
              />

              {/* 5. Seksi Tutorial Interaktif "Cara Kerja ActGiving" */}
              <HowItWorks
                onOpenCreateCampaign={() => setIsCreateOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            </>
          )}
        </main>

        {/* ========================================================= */}
        {/* FOOTER: HANYA TAMPIL DI HOMEPAGE PUBLIC VIEW              */}
        {/* ========================================================= */}
        {activeView === 'public' && (
          <Footer
            totalDonationRp={totalDonationRp}
            totalVolunteers={totalVolunteers}
            formatRupiah={formatRupiah}
            onOpenCreateCampaign={() => setIsCreateOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateView={setActiveView}
          />
        )}
      </div>

      {/* MODAL 1: Guest Checkout (SRS Subbab 4.1 UC-01 & FR-01, FR-02, FR-03, E1, E2) */}
      <GuestCheckoutModal
        campaign={checkoutCampaign}
        isOpen={!!checkoutCampaign}
        onClose={() => setCheckoutCampaign(null)}
        onDonationSuccess={handleDonationSuccess}
        currentUser={currentUser}
      />

      {/* MODAL 2: Modal Registrasi Akun Umum / Dual-Role (RegisterModal) */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        currentUser={currentUser}
        initialTab="register"
        initialRole="relawan"
        onSelectUser={(user) => {
          setCurrentUser(user);
          setIsRegisterOpen(false);
        }}
      />

      {/* MODAL 3: LPJ Transparency Timeline (SRS Subbab 4.3 & FR-12) */}
      <ErrorBoundary fallbackTitle="Kendala pada Linimasa LPJ">
        <LpjModal
          campaign={lpjCampaign}
          isOpen={!!lpjCampaign}
          onClose={() => setLpjCampaign(null)}
        />
      </ErrorBoundary>

      {/* MODAL 4: Create Campaign Multi-Option (SRS Subbab 2.2 & FR-06) */}
      <CreateCampaignModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setCampaignToEdit(null);
        }}
        onAddCampaign={handleAddCampaign}
        onUpdateCampaign={handleUpdateCampaign}
        campaignToEdit={campaignToEdit}
        currentUser={currentUser}
        onSwitchToInisiator={() => setIsAuthOpen(true)}
      />

      {/* MODAL 5: Dual-Role Authentication (SRS Subbab 2.1 & FR-04) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />

      {/* MODAL 6: Standalone HTML Code Modal (Desain Berwarna Hi-Fi) */}
      <StandaloneHtmlModal
        isOpen={isSourceOpen}
        onClose={() => setIsSourceOpen(false)}
      />

      {/* MODAL 6B: Wireframe HTML Code Modal (Sketsa Kasar Lo-Fi Tanpa Warna) */}
      <WireframeHtmlModal
        isOpen={isWireframeOpen}
        onClose={() => setIsWireframeOpen(false)}
      />

      {/* MODAL 7: Panel Moderasi Admin (SRS Subbab 4.3 UC-03 & FR-07) */}
      <AdminModerationModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        campaigns={campaigns}
        onApproveCampaign={handleApproveCampaign}
        onRejectCampaign={handleRejectCampaign}
      />

      {/* MODAL 8: Aktivitas Relawan Saya (SRS UC-02 / FR-09) */}
      <RelawanActivityModal
        isOpen={isRelawanOpen}
        onClose={() => setIsRelawanOpen(false)}
        currentUser={currentUser}
        campaigns={campaigns}
        onExploreCampaigns={() => {
          setActiveView('public');
          setTimeout(() => {
            const el = document.getElementById('katalog-aksi');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* MODAL 9: Dashboard Inisiator & Upload LPJ (SRS FR-06 / FR-12) */}
      <ErrorBoundary fallbackTitle="Kendala pada Dashboard Inisiator & Form Upload LPJ">
        <InisiatorDashboardModal
          isOpen={isInisiatorOpen}
          onClose={() => setIsInisiatorOpen(false)}
          currentUser={currentUser}
          campaigns={campaigns}
          onCreateNewCampaign={() => setIsCreateOpen(true)}
          onAddLpj={handleAddLpj}
        />
      </ErrorBoundary>

    </div>
  );
}
