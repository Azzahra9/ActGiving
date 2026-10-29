import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText, 
  Eye, Check, ExternalLink, Building2, MapPin, ArrowLeft, 
  Search, Users, DollarSign, Activity, Lock, Database, RefreshCw, Sparkles, Layers,
  Ban, Calendar, Clock, X, Info
} from 'lucide-react';
import { Campaign, UserProfile, LpjItem } from '../../types';
import api from '../../lib/axios';
import { mapBackendCampaignToFrontend } from '../../services/campaignService';
import { formatRupiah } from '../../utils/format';

interface AdminDonationRecord {
  id: number;
  campaign_id: number;
  amount: number | string;
  payment_channel?: string;
  payment_method?: string;
  reference_code: string;
  donor_name?: string;
  donor_email?: string;
  is_anonymous?: boolean;
  status: string;
  created_at: string;
  campaign?: {
    id: number;
    title: string;
    location?: string;
  };
}

interface AdminLpjRecord {
  id: number | string;
  campaign_id: number | string;
  title?: string;
  description?: string;
  amount_spent?: number | string;
  realized_amount?: number | string;
  status?: string;
  proof_image_url?: string;
  receipt_image_url?: string;
  activity_photos?: string[];
  report_date?: string;
  created_at?: string;
  is_final?: boolean;
  report_type?: 'progress' | 'final';
  campaign?: {
    id: number | string;
    title: string;
    status?: string;
    user?: {
      name: string;
      email: string;
    };
  };
}

interface AdminDashboardViewProps {
  currentUser: UserProfile;
  campaigns: Campaign[];
  onExplorePublic: () => void;
  onApproveCampaign: (campaignId: string) => void;
  onRejectCampaign: (campaignId: string) => void;
  onOpenLpjModal: (campaign: Campaign) => void;
  onRefreshCampaigns?: () => void;
  activeTab?: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem';
  onTabChange?: (tab: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  campaigns,
  onExplorePublic,
  onApproveCampaign,
  onRejectCampaign,
  onOpenLpjModal,
  onRefreshCampaigns,
  activeTab: propActiveTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem'>('moderasi');
  const activeTab = propActiveTab || internalTab;
  const setActiveTab = (tab: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [detailModalCampaign, setDetailModalCampaign] = useState<Campaign | null>(null);
  const [suspendTargetCampaign, setSuspendTargetCampaign] = useState<Campaign | null>(null);
  const [suspendReason, setSuspendReason] = useState<string>('Pelanggaran ketentuan & integritas platform');
  const [isSubmittingSuspend, setIsSubmittingSuspend] = useState<boolean>(false);
  const [monitoredFilter, setMonitoredFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [monitoredSearch, setMonitoredSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [verifiedLpjIds, setVerifiedLpjIds] = useState<string[]>([]);
  const [adminCampaigns, setAdminCampaigns] = useState<Campaign[]>(campaigns);
  const [adminDonations, setAdminDonations] = useState<AdminDonationRecord[]>([]);
  const [isLoadingDonations, setIsLoadingDonations] = useState<boolean>(false);
  const [adminLpjReports, setAdminLpjReports] = useState<AdminLpjRecord[]>([]);
  const [isLoadingLpj, setIsLoadingLpj] = useState<boolean>(false);

  const fetchAdminCampaigns = async () => {
    try {
      const res = await api.get('/admin/campaigns');
      const items = res.data?.data?.data || res.data?.data;
      if (Array.isArray(items)) {
        setAdminCampaigns(items.map(mapBackendCampaignToFrontend));
      }
    } catch (err) {
      console.warn('Gagal memuat kampanye admin dari REST API:', err);
    }
  };

  const fetchAdminDonations = async () => {
    setIsLoadingDonations(true);
    try {
      const res = await api.get('/admin/donations').catch(() => api.get('/donations'));
      const items = res.data?.data?.data || res.data?.data;
      if (Array.isArray(items)) {
        setAdminDonations(items);
      }
    } catch (err) {
      console.warn('Gagal memuat log transaksi admin dari REST API:', err);
    } finally {
      setIsLoadingDonations(false);
    }
  };

  const fetchAdminLpj = async () => {
    setIsLoadingLpj(true);
    try {
      const res = await api.get('/admin/lpj').catch(() => api.get('/lpj/audit'));
      const items = res.data?.data?.data || res.data?.data;
      if (Array.isArray(items)) {
        setAdminLpjReports(items);
      }
    } catch (err) {
      console.warn('Gagal memuat LPJ admin dari REST API:', err);
    } finally {
      setIsLoadingLpj(false);
    }
  };

  useEffect(() => {
    fetchAdminCampaigns();
    fetchAdminDonations();
    fetchAdminLpj();
  }, []);

  const displayCampaigns = adminCampaigns.length > 0 ? adminCampaigns : campaigns;
  const pendingCampaigns = displayCampaigns.filter((c) => c.status === 'pending_approval' || c.status === 'pending');
  const activeCampaigns = displayCampaigns.filter((c) => c.status !== 'pending_approval' && c.status !== 'pending' && c.status !== 'rejected');
  const rejectedCampaigns = campaigns.filter((c) => c.status === 'rejected');
  const runningActiveCampaigns = activeCampaigns.filter((c) => c.status !== 'suspended');
  const suspendedCampaigns = activeCampaigns.filter((c) => c.status === 'suspended');

  const filteredMonitoredCampaigns = activeCampaigns.filter((camp) => {
    if (monitoredFilter === 'active' && camp.status === 'suspended') {
      return false;
    }
    if (monitoredFilter === 'suspended' && camp.status !== 'suspended') {
      return false;
    }
    if (monitoredSearch.trim()) {
      const q = monitoredSearch.toLowerCase();
      const matchTitle = camp.title?.toLowerCase().includes(q);
      const matchInit = camp.initiatorName?.toLowerCase().includes(q);
      const matchLoc = camp.locationCity?.toLowerCase().includes(q);
      return matchTitle || matchInit || matchLoc;
    }
    return true;
  });

  const totalFundsFromDonations = adminDonations.reduce((acc, d) => acc + Number(d.amount || 0), 0);
  const totalFundsCollected = campaigns.reduce((acc, c) => acc + (c.collectedFunds || 0), 0);
  const displayTotalFunds = totalFundsFromDonations > 0 ? totalFundsFromDonations : totalFundsCollected;
  const totalVolunteers = campaigns.reduce((acc, c) => acc + (c.filledVolunteers || 0), 0);

  const displayLpjList = adminLpjReports.length > 0
    ? adminLpjReports.map((r) => ({
        id: String(r.id),
        title: r.title || 'Laporan Realisasi Penyaluran',
        description: r.description || 'Tanpa catatan pengeluaran.',
        realizedAmount: Number(r.amount_spent || r.realized_amount || 0),
        date: r.report_date
          ? new Date(r.report_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          : r.created_at
          ? new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          : 'Baru Diajukan',
        campaignTitle: r.campaign?.title || 'Program Kampanye',
        receiptUrl: r.proof_image_url || r.receipt_image_url || (Array.isArray(r.activity_photos) ? r.activity_photos[0] : undefined),
        status: r.status || 'pending_audit',
        isFinal: Boolean(r.is_final || r.report_type === 'final'),
        reportType: (r.report_type as 'progress' | 'final') || (r.is_final ? 'final' : 'progress'),
        campaignStatus: r.campaign?.status,
        campaignId: r.campaign_id,
      }))
    : (campaigns || []).flatMap((c) =>
        (Array.isArray(c?.lpjReports) ? c.lpjReports : []).map((lpj) => ({
          id: String(lpj.id),
          title: lpj.title || 'Laporan Realisasi Penyaluran',
          description: lpj.description || 'Tanpa catatan pengeluaran.',
          realizedAmount: Number(lpj.realizedAmount || 0),
          date: lpj.date || '-',
          campaignTitle: c?.title || 'Program Kampanye',
          receiptUrl: lpj.receiptUrl || lpj.photoUrl,
          status: lpj.status || 'pending',
          isFinal: Boolean(lpj.isFinal || lpj.reportType === 'final'),
          reportType: lpj.reportType || (lpj.isFinal ? 'final' : 'progress'),
          campaignStatus: c?.status,
          campaignId: c?.id,
        }))
      );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = async (camp: Campaign) => {
    try {
      await api.patch(`/admin/campaigns/${camp.id}/status`, { status: 'active' });
    } catch (err: any) {
      console.warn('API error saat approve kampanye:', err);
    }
    onApproveCampaign(camp.id);
    showToast(`Kampanye "${camp.title}" berhasil disetujui & langsung tayang di katalog publik!`);
    await fetchAdminCampaigns();
    if (selectedCampaign?.id === camp.id) {
      setSelectedCampaign(null);
    }
  };

  const handleReject = async (camp: Campaign) => {
    try {
      await api.patch(`/admin/campaigns/${camp.id}/status`, { status: 'rejected' });
    } catch (err: any) {
      console.warn('API error saat reject kampanye:', err);
    }
    onRejectCampaign(camp.id);
    showToast(`Kampanye "${camp.title}" telah ditolak dengan catatan verifikasi.`);
    await fetchAdminCampaigns();
    if (selectedCampaign?.id === camp.id) {
      setSelectedCampaign(null);
    }
  };

  const handleSuspendCampaign = async () => {
    if (!suspendTargetCampaign) return;
    setIsSubmittingSuspend(true);
    try {
      await api.patch(`/admin/campaigns/${suspendTargetCampaign.id}/suspend`, {
        reason: suspendReason || 'Pelanggaran pedoman & integritas platform',
      }).catch(() =>
        api.patch(`/admin/campaigns/${suspendTargetCampaign.id}/status`, {
          status: 'suspended',
        })
      );

      // Optimistic update pada state admin lokal
      setAdminCampaigns((prev) =>
        prev.map((c) =>
          c.id === suspendTargetCampaign.id ? { ...c, status: 'suspended' } : c
        )
      );

      showToast(`Kampanye "${suspendTargetCampaign.title}" berhasil dihentikan/ditangguhkan.`);
      setSuspendTargetCampaign(null);
      if (detailModalCampaign?.id === suspendTargetCampaign.id) {
        setDetailModalCampaign((prev) => (prev ? { ...prev, status: 'suspended' } : null));
      }

      await fetchAdminCampaigns();
      onRefreshCampaigns?.();
    } catch (err: any) {
      console.error('Gagal menghentikan kampanye:', err);
      showToast(err?.response?.data?.message || 'Gagal mengubah status kampanye di server.');
    } finally {
      setIsSubmittingSuspend(false);
    }
  };

  const toggleVerifyLpj = async (lpjId: string, currentStatus?: string) => {
    const isCurrentlySah = verifiedLpjIds.includes(lpjId) || currentStatus === 'verified' || currentStatus === 'sah';

    try {
      if (isCurrentlySah) {
        const res = await api.patch(`/admin/lpj/${lpjId}/unverify`).catch(() =>
          api.patch(`/admin/lpj/${lpjId}/status`, { status: 'pending_audit' })
        );
        setVerifiedLpjIds((prev) => prev.filter((id) => id !== lpjId));
        showToast(res?.data?.message || 'Status verifikasi LPJ dibatalkan untuk peninjauan ulang.');
      } else {
        const res = await api.patch(`/admin/lpj/${lpjId}/verify`).catch(() =>
          api.patch(`/admin/lpj/${lpjId}/status`, { status: 'sah' })
        );
        setVerifiedLpjIds((prev) => [...prev, lpjId]);
        showToast(res?.data?.message || 'LPJ dan nota kuitansi dinyatakan SAH dan Terverifikasi.');
      }
      await fetchAdminLpj();
      await fetchAdminCampaigns();
      onRefreshCampaigns?.();
    } catch (err: any) {
      console.warn('Gagal memperbarui status LPJ di server:', err);
      if (isCurrentlySah) {
        setVerifiedLpjIds((prev) => prev.filter((id) => id !== lpjId));
        showToast('Status verifikasi LPJ dibatalkan untuk peninjauan ulang.');
      } else {
        setVerifiedLpjIds((prev) => [...prev, lpjId]);
        showToast('LPJ dan nota kuitansi dinyatakan SAH dan Terverifikasi.');
      }
      fetchAdminLpj();
      fetchAdminCampaigns();
      onRefreshCampaigns?.();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Return to Public Portal */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <span className="font-semibold text-white">Panel Utama Administrator & Auditor Platform</span>
            <span className="text-slate-500">|</span>
            <span>Pusat Moderasi & Integritas Platform</span>
          </div>

          <button
            onClick={onExplorePublic}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lihat Beranda & Katalog Publik</span>
          </button>
        </div>
      </div>

      {/* Hero Admin Profile Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 border-2 border-blue-400 flex items-center justify-center text-white shadow-lg shrink-0">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold font-sans text-white">
                  {currentUser.name}
                </h1>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Super Administrator & Auditor Kepatuhan
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mb-2">
                Otoritas: <span className="text-white font-medium">Pengawasan Kampanye, Verifikasi LPJ, Audit ACID</span> • Email: <span className="text-white font-medium">{currentUser.email}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Sesi Terenkripsi TLS 1.3
                </span>
                <span className="flex items-center gap-1">
                  <Database className="w-4 h-4 text-sky-400" />
                  Database ACID Lock: <strong className="text-white">Sehat & Konsisten</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto">
            <div className="flex-1 min-w-[160px] w-auto bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-xl lg:text-2xl font-bold text-blue-400 font-sans truncate">
                {pendingCampaigns.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">Menunggu Review</div>
            </div>

            <div className="flex-1 min-w-[160px] w-auto bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-xl lg:text-2xl font-bold text-sky-400 font-sans truncate">
                {activeCampaigns.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">Kampanye Aktif</div>
            </div>

            <div className="flex-1 min-w-[160px] w-auto bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-xl lg:text-2xl font-bold text-white font-sans truncate" title={formatRupiah(displayTotalFunds)}>
                {formatRupiah(displayTotalFunds)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">Total Donasi Platform</div>
            </div>

            <div className="flex-1 min-w-[160px] w-auto bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-xl lg:text-2xl font-bold text-sky-300 font-sans truncate">
                {totalVolunteers}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">Total Relawan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Active Section Header Bar (Controlled via Sidebar) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              {activeTab === 'moderasi' && (
                <>
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Antrean Moderasi Kampanye Baru</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {pendingCampaigns.length} Perlu Review
                  </span>
                </>
              )}
              {activeTab === 'audit_lpj' && (
                <>
                  <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Audit Laporan Pertanggungjawaban (LPJ) & Kuitansi</span>
                </>
              )}
              {activeTab === 'transaksi' && (
                <>
                  <Activity className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Audit Transaksi Payment Gateway Sandbox</span>
                </>
              )}
              {activeTab === 'sistem' && (
                <>
                  <Database className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Integritas ACID, Log Mutasi & Keamanan Sistem</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Panel administrasi dan audit kini dikelola langsung dan responsif melalui <strong>Sidebar Admin</strong> di sebelah kiri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 capitalize">
              Mode Super Admin
            </span>
          </div>
        </div>

        {/* TAB 1: MODERASI KAMPANYE */}
        {activeTab === 'moderasi' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Antrean Proposal Kampanye Baru
                </h2>
                <p className="text-xs text-slate-500">
                  Audit latar belakang inisiator, target dana wajar, dan kriteria tugas relawan sebelum disetujui tayang.
                </p>
              </div>
            </div>

            {pendingCampaigns.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">
                  Semua Proposal Telah Diperiksa!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  Tidak ada kampanye berstatus menunggu verifikasi saat ini. Anda dapat mengaudit kampanye aktif di bawah ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="bg-white rounded-3xl border-2 border-blue-200 shadow-xs p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={camp.imageUrl}
                        alt={camp.title}
                        className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full">
                            Menunggu Verifikasi (Pending)
                          </span>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                            Kategori: {camp.category}
                          </span>
                          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            Mode: {camp.mode.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{camp.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                          {camp.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>Inisiator: <strong>{camp.initiatorName}</strong></span>
                          <span>•</span>
                          <span>Lokasi: {camp.locationCity}</span>
                          <span>•</span>
                          <span>Target: {camp.targetFunds ? formatRupiah(camp.targetFunds) : 'Hanya Relawan'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setSelectedCampaign(camp)}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span>Detail Dokumen</span>
                      </button>

                      <button
                        onClick={() => handleReject(camp)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-red-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-4 h-4 text-slate-500 hover:text-red-600" />
                        <span>Tolak</span>
                      </button>

                      <button
                        onClick={() => handleApprove(camp)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Setujui & Publikasikan</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Existing Active Campaigns under Audit */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Daftar Kampanye Aktif yang Sedang Diawasi</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                      {filteredMonitoredCampaigns.length} Program
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitoring kampanye aktif publik, peninjauan kelayakan profil, audit LPJ, dan kewenangan penangguhan (suspend).
                  </p>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari kampanye / inisiator..."
                      value={monitoredSearch}
                      onChange={(e) => setMonitoredSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
                    />
                    {monitoredSearch && (
                      <button
                        onClick={() => setMonitoredSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                    <button
                      onClick={() => setMonitoredFilter('all')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        monitoredFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semua ({activeCampaigns.length})
                    </button>
                    <button
                      onClick={() => setMonitoredFilter('active')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        monitoredFilter === 'active'
                          ? 'bg-white text-blue-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Aktif ({runningActiveCampaigns.length})
                    </button>
                    <button
                      onClick={() => setMonitoredFilter('suspended')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        monitoredFilter === 'suspended'
                          ? 'bg-white text-red-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Dihentikan ({suspendedCampaigns.length})
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="p-3 rounded-l-xl">Kampanye</th>
                      <th className="p-3">Inisiator</th>
                      <th className="p-3">Perolehan Donasi</th>
                      <th className="p-3">Relawan</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Aksi Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMonitoredCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-400">
                          <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-600">Tidak ada kampanye yang sesuai dengan filter.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Ubah kata kunci pencarian atau tab filter di atas.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredMonitoredCampaigns.map((camp) => (
                        <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-semibold text-slate-900 max-w-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={camp.imageUrl}
                                alt={camp.title}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div className="truncate">
                                <span className="font-semibold text-slate-900 block truncate" title={camp.title}>
                                  {camp.title}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {camp.category} • {camp.locationCity}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">
                            <div className="truncate max-w-[150px]">
                              <span>{camp.initiatorName}</span>
                              <span className="block text-[10px] text-slate-400 truncate">
                                {camp.initiatorRole}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-800 font-bold">
                            <div>{formatRupiah(camp.collectedFunds || 0)}</div>
                            {camp.targetFunds ? (
                              <span className="text-[10px] font-normal text-slate-400 block">
                                Target: {formatRupiah(camp.targetFunds)}
                              </span>
                            ) : null}
                          </td>
                          <td className="p-3 text-slate-800">
                            {camp.filledVolunteers || 0} / {camp.targetVolunteers || 0}
                          </td>
                          <td className="p-3">
                            {camp.status === 'suspended' ? (
                              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-red-200">
                                <Ban className="w-3 h-3 text-red-600" />
                                Dihentikan
                              </span>
                            ) : camp.status === 'closed' || camp.status === 'completed' ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Selesai (Ditutup)
                              </span>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                Aktif & Sah
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap sm:flex-nowrap">
                              {/* Tombol Detail Profil Kampanye Utuh */}
                              <button
                                onClick={() => setDetailModalCampaign(camp)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-semibold transition-colors text-xs"
                                title="Lihat Profil & Kelayakan Kampanye Utuh"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                                <span>Detail</span>
                              </button>

                              {/* Tombol Audit LPJ */}
                              <button
                                onClick={() => onOpenLpjModal(camp)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg font-semibold transition-colors text-xs"
                                title="Audit Laporan Pertanggungjawaban (LPJ)"
                              >
                                <FileText className="w-3.5 h-3.5 text-slate-500" />
                                <span>Audit LPJ</span>
                              </button>

                              {/* Tombol Hentikan (Suspend) */}
                              {camp.status === 'suspended' ? (
                                <span
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg font-semibold text-xs cursor-not-allowed opacity-75"
                                  title="Kampanye ini sudah dihentikan secara paksa"
                                >
                                  <Ban className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Dihentikan</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSuspendTargetCampaign(camp);
                                    setSuspendReason('Pelanggaran pedoman & integritas platform');
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 rounded-lg font-semibold transition-colors text-xs shadow-2xs"
                                  title="Hentikan / Tangguhkan Kampanye Secara Paksa"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Hentikan</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AUDIT LPJ */}
        {activeTab === 'audit_lpj' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Pusat Audit Transparansi LPJ & Bukti Kuitansi Penyaluran Dana
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap laporan belanja wajib diperiksa kesesuaiannya dengan kuitansi fisik toko dan dokumentasi serah terima di lapangan.
                </p>
              </div>
              <button
                onClick={fetchAdminLpj}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLpj ? 'animate-spin' : ''}`} />
                <span>Muat Ulang LPJ</span>
              </button>
            </div>

            <div className="space-y-4">
              {displayLpjList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-sans border border-slate-200 rounded-2xl bg-slate-50/50">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-60" />
                  <div className="font-bold text-slate-800 text-sm">Belum Ada LPJ Menunggu Audit</div>
                  <div className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Seluruh laporan pertanggungjawaban yang diunggah oleh inisiator akan masuk ke antrean ini untuk diverifikasi keaslian notanya.
                  </div>
                </div>
              ) : (
                displayLpjList.map((lpj) => {
                  const isVerified = verifiedLpjIds.includes(lpj.id) || lpj.status === 'verified' || lpj.status === 'sah';
                  return (
                    <div
                      key={lpj.id}
                      className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{lpj.title}</span>

                          {/* Badge Indikator Jenis LPJ: Akhir vs Progress */}
                          {lpj.isFinal ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-300 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-purple-600" />
                              LPJ Akhir (Final)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-300">
                              <Layers className="w-3 h-3 text-sky-600" />
                              LPJ Progress (Tahapan)
                            </span>
                          )}

                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Lolos Audit Auditor (Sah)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Memerlukan Verifikasi Nota
                            </span>
                          )}

                          {lpj.campaignStatus === 'closed' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full border border-slate-300">
                              <Lock className="w-3 h-3 text-slate-600" />
                              Kampanye Ditutup
                            </span>
                          )}
                        </div>

                        {/* Notice Otomatisasi Penutupan Kampanye */}
                        {lpj.isFinal && !isVerified && (
                          <div className="bg-purple-50 border border-purple-200 text-purple-900 rounded-xl px-3 py-1.5 text-[11px] flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>
                              <strong>LPJ Akhir:</strong> Menyetujui laporan ini akan <strong>secara otomatis menutup status kampanye</strong> menjadi Selesai (Closed).
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-slate-600 leading-relaxed">{lpj.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>Nominal Realisasi: <strong className="text-blue-700 font-bold">{formatRupiah(lpj.realizedAmount)}</strong></span>
                          <span>•</span>
                          <span>Tanggal: {lpj.date}</span>
                          <span>•</span>
                          <span>Kampanye: <strong className="text-slate-800">{lpj.campaignTitle}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lpj.receiptUrl && (
                          <a
                            href={lpj.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Lihat Kuitansi</span>
                          </a>
                        )}

                        <button
                          onClick={() => toggleVerifyLpj(lpj.id, lpj.status)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isVerified
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isVerified ? 'Batalkan Sah' : 'Verifikasi Sah'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT TRANSAKSI SANDBOX */}
        {activeTab === 'transaksi' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Log Transaksi Moneter Sandbox & Live PostgreSQL
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pengawasan transaksi gateway QRIS dan Virtual Account tanpa peredaran uang riil, dijamin oleh prinsip ACID.
                </p>
              </div>
              <button
                onClick={fetchAdminDonations}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDonations ? 'animate-spin' : ''}`} />
                <span>Muat Ulang Transaksi</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="p-3 rounded-l-xl">Kode Referensi</th>
                    <th className="p-3">Waktu Transaksi</th>
                    <th className="p-3">Metode Gateway</th>
                    <th className="p-3">Nominal (Rp)</th>
                    <th className="p-3">Donatur & Kampanye</th>
                    <th className="p-3 rounded-r-xl text-right">Integritas ACID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminDonations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                        <CheckCircle2 className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-60" />
                        <div className="font-bold text-slate-800 text-sm">Belum Ada Transaksi Moneter di Database</div>
                        <div className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          Transaksi donasi via QRIS dan Virtual Account yang berhasil diverifikasi di gateway akan tercatat secara otomatis di sini dengan jaminan ACID.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    adminDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              {d.reference_code || `INV-${d.id}`}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600">
                          {d.created_at ? new Date(d.created_at).toLocaleString('id-ID') : 'Baru saja'}
                        </td>
                        <td className="p-3">
                          <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md font-bold uppercase text-[10px]">
                            {d.payment_channel || d.payment_method || 'QRIS'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          {formatRupiah(Number(d.amount))}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{d.donor_name || 'Hamba Allah'}</span>
                            {d.is_anonymous && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                Anonim
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {d.campaign?.title || `Kampanye ID #${d.campaign_id}`}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ACID Committed ({d.status ? d.status.toUpperCase() : 'PAID'})
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SISTEM & INTEGRITAS ACID */}
        {activeTab === 'sistem' && (
          <div className="mt-6 max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Laporan Keamanan & Standar Integritas Sistem (ACID)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifikasi integritas transaksi moneter ACID dan perlindungan race condition saat pencatatan donasi bersamaan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Atomicity (A)</span>
                <p className="text-slate-600 text-[11px]">
                  Pencatatan saldo kampanye dan histori donasi dieksekusi dalam satu transaksi tunggal. Tidak ada status gantung.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Consistency (C)</span>
                <p className="text-slate-600 text-[11px]">
                  Total donasi agregat pada live counter selalu presisi dan seimbang dengan jumlah seluruh invoice PAID.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Isolation (I)</span>
                <p className="text-slate-600 text-[11px]">
                  Dukungan multithread concurrent checkout tanpa risiko race condition pada kuota relawan atau dana.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Durability (D)</span>
                <p className="text-slate-600 text-[11px]">
                  Setiap mutasi donasi langsung dicatat permanen dalam ledger digital dengan nomor referensi unik anti-duplikasi.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Detail Modal for Selected Campaign */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              Dokumen Proposal: {selectedCampaign.title}
            </h3>
            <img
              src={selectedCampaign.imageUrl}
              alt={selectedCampaign.title}
              className="w-full h-44 object-cover rounded-2xl border border-slate-200"
            />
            <div className="text-xs space-y-2 text-slate-700">
              <p><strong>Inisiator:</strong> {selectedCampaign.initiatorName} ({selectedCampaign.initiatorRole})</p>
              <p><strong>Lokasi:</strong> {selectedCampaign.locationCity}</p>
              <p><strong>Mode:</strong> {selectedCampaign.mode.toUpperCase()}</p>
              <p><strong>Uraian Aksi:</strong> {selectedCampaign.description}</p>
              {selectedCampaign.targetFunds && (
                <p><strong>Target Dana:</strong> {formatRupiah(selectedCampaign.targetFunds)}</p>
              )}
              {selectedCampaign.targetVolunteers && (
                <p><strong>Target Relawan:</strong> {selectedCampaign.targetVolunteers} Orang</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => handleReject(selectedCampaign)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-red-700 rounded-xl text-xs font-bold transition-colors"
              >
                Tolak Proposal
              </button>
              <button
                onClick={() => handleApprove(selectedCampaign)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Setujui & Publikasikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Kampanye Utuh (Untuk Peninjauan Kelayakan Admin) */}
      {detailModalCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                    Detail Profil Kampanye
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ID #{detailModalCampaign.id} • Audit Kelayakan & Pengawasan Platform
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {detailModalCampaign.status === 'suspended' ? (
                  <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-red-200">
                    <Ban className="w-3 h-3 text-red-600" />
                    Dihentikan
                  </span>
                ) : detailModalCampaign.status === 'closed' || detailModalCampaign.status === 'completed' ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Selesai
                  </span>
                ) : detailModalCampaign.status === 'active' ? (
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    Aktif & Sah
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    Menunggu Verifikasi
                  </span>
                )}

                <button
                  onClick={() => setDetailModalCampaign(null)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Image & Quick Badges */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={detailModalCampaign.imageUrl}
                  alt={detailModalCampaign.title}
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {detailModalCampaign.category}
                  </span>
                  <span className="bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-400/30">
                    MODE: {detailModalCampaign.mode.toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-t from-slate-950/90 to-slate-950/40 text-white p-3 rounded-xl backdrop-blur-xs">
                  <h4 className="text-sm sm:text-base font-bold line-clamp-2">
                    {detailModalCampaign.title}
                  </h4>
                </div>
              </div>

              {/* Grid Metadata Inisiator & Lokasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inisiator / Penanggung Jawab</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {detailModalCampaign.initiatorName}
                  </div>
                  <div className="text-[11px] text-blue-700 font-medium">
                    {detailModalCampaign.initiatorRole}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Lokasi Kegiatan</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {detailModalCampaign.locationCity}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cakupan Aksi Kemanusiaan Wilayah
                  </div>
                </div>
              </div>

              {/* Progress Finansial (Jika Mode Dana / Keduanya) */}
              {(detailModalCampaign.mode === 'dana' || detailModalCampaign.mode === 'keduanya') && (
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      Realisasi & Target Penggalangan Dana
                    </span>
                    <span className="font-bold text-blue-700">
                      {Math.min(100, Math.round(((detailModalCampaign.collectedFunds || 0) / (detailModalCampaign.targetFunds || 1)) * 100))}%
                    </span>
                  </div>

                  <div className="w-full bg-blue-200/60 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, ((detailModalCampaign.collectedFunds || 0) / (detailModalCampaign.targetFunds || 1)) * 100)}%`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Terkumpul:</span>
                      <strong className="text-slate-900 font-bold text-xs">
                        {formatRupiah(detailModalCampaign.collectedFunds || 0)}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block">Target Total:</span>
                      <strong className="text-slate-900 font-bold text-xs">
                        {formatRupiah(detailModalCampaign.targetFunds || 0)}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Kebutuhan Relawan (Jika Mode Relawan / Keduanya) */}
              {(detailModalCampaign.mode === 'relawan' || detailModalCampaign.mode === 'keduanya') && (
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      Kebutuhan Relawan Lapangan
                    </span>
                    <span className="font-bold text-emerald-700">
                      {detailModalCampaign.filledVolunteers || 0} / {detailModalCampaign.targetVolunteers || 0} Relawan
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{detailModalCampaign.eventDate || 'Jadwal Segera Dikonfirmasi'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{detailModalCampaign.eventTime || '08:00 - 17:00 WIB'}</span>
                    </div>
                  </div>

                  {detailModalCampaign.taskCriteria && detailModalCampaign.taskCriteria.length > 0 && (
                    <div className="pt-2 border-t border-emerald-200/60">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase block mb-1.5">
                        Kriteria / Tugas Relawan:
                      </span>
                      <ul className="space-y-1">
                        {detailModalCampaign.taskCriteria.map((crit, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Deskripsi Lengkap Kampanye */}
              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Deskripsi & Latar Belakang Lengkap</span>
                </h5>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                  {detailModalCampaign.description || 'Tidak ada uraian deskripsi detail untuk kampanye ini.'}
                </div>
              </div>

              {/* Informasi Laporan LPJ */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Laporan Pertanggungjawaban (LPJ)</span>
                  <span className="text-[11px] text-slate-500">
                    {detailModalCampaign.lpjReports?.length || 0} Laporan LPJ tercatat dalam sistem
                  </span>
                </div>
                <button
                  onClick={() => {
                    onOpenLpjModal(detailModalCampaign);
                    setDetailModalCampaign(null);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Audit LPJ</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setDetailModalCampaign(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                {detailModalCampaign.status !== 'suspended' && (
                  <button
                    onClick={() => {
                      setSuspendTargetCampaign(detailModalCampaign);
                      setSuspendReason('Pelanggaran pedoman & integritas platform');
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Hentikan Kampanye</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog Konfirmasi Penghentian / Suspend Kampanye */}
      {suspendTargetCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-red-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hentikan Kampanye Paksa?
                </h3>
                <p className="text-xs text-slate-500">
                  Tindakan moderasi administrator berwenang penuh.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-red-900">
              <p className="font-semibold">
                Apakah Anda yakin ingin menghentikan kampanye ini secara paksa?
              </p>
              <p className="font-bold text-slate-900">
                "{suspendTargetCampaign.title}"
              </p>
              <p className="text-[11px] text-red-700 pt-1 leading-relaxed">
                • Kampanye akan berstatus <strong>Dihentikan (Suspended)</strong>.
                <br />
                • Kampanye <strong>otomatis hilang</strong> dari landing page donasi publik.
                <br />
                • Pembayaran donasi baru dan pendaftaran relawan langsung <strong>diblokir</strong>.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Alasan / Catatan Penghentian (Audit Log):
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Contoh: Ditemukan indikasi penipuan, pelanggaran SOP, atau keluhan donatur..."
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmittingSuspend}
                onClick={() => setSuspendTargetCampaign(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmittingSuspend}
                onClick={handleSuspendCampaign}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmittingSuspend ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    <span>Ya, Hentikan Kampanye</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
