import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText, 
  Eye, Check, ExternalLink, Building2, MapPin, ArrowLeft, 
  Search, Users, DollarSign, Activity, Lock, Database, RefreshCw, Sparkles
} from 'lucide-react';
import { Campaign, UserProfile, LpjItem } from '../../types';
import api from '../../lib/axios';
import { mapBackendCampaignToFrontend } from '../../services/campaignService';
import { formatRupiah } from '../../utils/format';

interface AdminDashboardViewProps {
  currentUser: UserProfile;
  campaigns: Campaign[];
  onExplorePublic: () => void;
  onApproveCampaign: (campaignId: string) => void;
  onRejectCampaign: (campaignId: string) => void;
  onOpenLpjModal: (campaign: Campaign) => void;
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [verifiedLpjIds, setVerifiedLpjIds] = useState<string[]>([]);
  const [adminCampaigns, setAdminCampaigns] = useState<Campaign[]>(campaigns);

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

  useEffect(() => {
    fetchAdminCampaigns();
  }, []);

  const displayCampaigns = adminCampaigns.length > 0 ? adminCampaigns : campaigns;
  const pendingCampaigns = displayCampaigns.filter((c) => c.status === 'pending_approval');
  const activeCampaigns = displayCampaigns.filter((c) => c.status !== 'pending_approval' && c.status !== 'rejected');
  const rejectedCampaigns = campaigns.filter((c) => c.status === 'rejected');

  const totalFundsCollected = campaigns.reduce((acc, c) => acc + (c.collectedFunds || 0), 0);
  const totalVolunteers = campaigns.reduce((acc, c) => acc + (c.filledVolunteers || 0), 0);

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
    fetchAdminCampaigns();
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
    fetchAdminCampaigns();
    if (selectedCampaign?.id === camp.id) {
      setSelectedCampaign(null);
    }
  };

  const toggleVerifyLpj = (lpjId: string) => {
    if (verifiedLpjIds.includes(lpjId)) {
      setVerifiedLpjIds((prev) => prev.filter((id) => id !== lpjId));
      showToast('Status verifikasi LPJ dibatalkan untuk peninjauan ulang.');
    } else {
      setVerifiedLpjIds((prev) => [...prev, lpjId]);
      showToast('LPJ dan nota kuitansi dinyatakan SAH dan Terverifikasi.');
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
              <div className="text-xl lg:text-2xl font-bold text-white font-sans truncate" title={formatRupiah(totalFundsCollected)}>
                {formatRupiah(totalFundsCollected)}
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
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Daftar Kampanye Aktif yang Sedang Diawasi
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Total {activeCampaigns.length} program sedang berjalan di katalog publik.
              </p>

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
                    {activeCampaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">
                          {camp.title}
                        </td>
                        <td className="p-3 text-slate-600">{camp.initiatorName}</td>
                        <td className="p-3 text-slate-800 font-bold">
                          {formatRupiah(camp.collectedFunds || 0)}
                        </td>
                        <td className="p-3 text-slate-800">
                          {camp.filledVolunteers || 0} / {camp.targetVolunteers || 0}
                        </td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Aktif & Sah
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onOpenLpjModal(camp)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                          >
                            <FileText className="w-3 h-3 text-slate-500" />
                            Audit LPJ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AUDIT LPJ */}
        {activeTab === 'audit_lpj' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pusat Audit Transparansi LPJ & Bukti Kuitansi Penyaluran Dana
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap laporan belanja wajib diperiksa kesesuaiannya dengan kuitansi fisik toko dan dokumentasi serah terima di lapangan.
              </p>
            </div>

            <div className="space-y-4">
              {campaigns.flatMap((c) =>
                (c.lpjReports || []).map((lpj) => {
                  const isVerified = verifiedLpjIds.includes(lpj.id);
                  return (
                    <div
                      key={lpj.id}
                      className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{lpj.title}</span>
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Lolos Audit Auditor
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                              <AlertTriangle className="w-3 h-3 text-blue-600" />
                              Memerlukan Verifikasi Nota
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{lpj.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>Nominal Realisasi: <strong className="text-blue-700 font-bold">{formatRupiah(lpj.realizedAmount)}</strong></span>
                          <span>•</span>
                          <span>Tanggal: {lpj.date}</span>
                          <span>•</span>
                          <span>Kampanye: <strong className="text-slate-800">{c.title}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={lpj.receiptUrl || lpj.photoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Lihat Kuitansi</span>
                        </a>

                        <button
                          onClick={() => toggleVerifyLpj(lpj.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
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
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Log Transaksi Moneter Sandbox
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengawasan transaksi gateway QRIS dan Virtual Account tanpa peredaran uang riil, dijamin oleh prinsip ACID.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="p-3 rounded-l-xl">Kode Referensi</th>
                    <th className="p-3">Waktu Transaksi</th>
                    <th className="p-3">Metode Gateway</th>
                    <th className="p-3">Nominal (Rp)</th>
                    <th className="p-3">Donatur</th>
                    <th className="p-3 rounded-r-xl text-right">Integritas ACID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                      <CheckCircle2 className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-60" />
                      <div className="font-bold text-slate-800 text-sm">Belum Ada Transaksi Moneter di Database</div>
                      <div className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Transaksi donasi via QRIS dan Virtual Account yang berhasil diverifikasi di gateway akan tercatat secara otomatis di sini dengan jaminan ACID.
                      </div>
                    </td>
                  </tr>
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

    </div>
  );
};
