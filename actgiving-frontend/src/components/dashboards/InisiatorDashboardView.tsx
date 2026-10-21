import React, { useState, useEffect } from 'react';
import { 
  Building2, PlusCircle, Upload, CheckCircle2, DollarSign, Users, 
  FileText, AlertCircle, ArrowLeft, Eye, MessageSquare, ShieldCheck, 
  ExternalLink, TrendingUp, Calendar, MapPin, Search, Check, Sparkles,
  Camera, Trash2, Pencil, Plus, ReceiptText, Layers, FileCheck2, ZoomIn, ArrowRight
} from 'lucide-react';
import { Campaign, UserProfile, LpjItem, LpjBudgetItem } from '../../types';
import api from '../../lib/axios';
import { mapBackendCampaignToFrontend } from '../../services/campaignService';
import { formatRupiah } from '../../utils/format';

interface InisiatorDashboardViewProps {
  currentUser: UserProfile;
  campaigns: Campaign[];
  onExplorePublic: () => void;
  onOpenCreateCampaign: () => void;
  onEditCampaign?: (campaign: Campaign) => void;
  onDeleteCampaign?: (campaignId: string) => void;
  onAddLpj: (campaignId: string, lpj: LpjItem) => void;
  onOpenLpjModal: (campaign: Campaign) => void;
  activeTab?: 'kampanye' | 'lpj' | 'relawan' | 'panduan';
  onTabChange?: (tab: 'kampanye' | 'lpj' | 'relawan' | 'panduan') => void;
}

export const InisiatorDashboardView: React.FC<InisiatorDashboardViewProps> = ({
  currentUser,
  campaigns,
  onExplorePublic,
  onOpenCreateCampaign,
  onEditCampaign,
  onDeleteCampaign,
  onAddLpj,
  onOpenLpjModal,
  activeTab: propActiveTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'kampanye' | 'lpj' | 'relawan' | 'panduan'>('kampanye');
  const activeTab = propActiveTab || internalTab;
  const setActiveTab = (tab: 'kampanye' | 'lpj' | 'relawan' | 'panduan') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [lpjTitle, setLpjTitle] = useState('');
  const [lpjAmount, setLpjAmount] = useState('');
  const [lpjDesc, setLpjDesc] = useState('');
  const [fieldLocation, setFieldLocation] = useState('');
  const [beneficiariesCount, setBeneficiariesCount] = useState('');
  const [volunteersInvolved, setVolunteersInvolved] = useState('');
  const [budgetItems, setBudgetItems] = useState<LpjBudgetItem[]>([
    { name: 'Pengadaan Paket Sembako & Logistik', amount: 3500000 },
    { name: 'Sewa Armada & Distribusi Lapangan', amount: 1500000 }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [activityPhotos, setActivityPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
  ]);
  const [newPhotoInput, setNewPhotoInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate total from budget items if amount not manually specified
  const calculatedBudgetTotal = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  const [initiatorCampaigns, setInitiatorCampaigns] = useState<Campaign[]>([]);
  const [volunteersList, setVolunteersList] = useState<any[]>([]);

  // Fetch real initiator campaigns and volunteer applicants from Laravel REST API
  useEffect(() => {
    const fetchInitiatorData = async () => {
      try {
        const response = await api.get('/my-campaigns');
        const items = response.data?.data?.data || response.data?.data || [];
        if (Array.isArray(items)) {
          const mapped = items.map(mapBackendCampaignToFrontend);
          setInitiatorCampaigns(mapped);

          // Fetch volunteer registrations for my campaigns
          if (mapped.length > 0) {
            const regPromises = mapped.map((c: Campaign) =>
              api.get(`/campaigns/${c.id}/registrations`).catch(() => null)
            );
            const regResults = await Promise.all(regPromises);
            const allRegs: any[] = [];
            regResults.forEach((res, idx) => {
              if (res?.data?.data) {
                const regItems = res.data.data.data || res.data.data;
                if (Array.isArray(regItems)) {
                  regItems.forEach((r: any) => {
                    allRegs.push({
                      ...r,
                      campaignTitle: mapped[idx].title
                    });
                  });
                }
              }
            });
            setVolunteersList(allRegs);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat kampanye inisiator dari API:', err);
      }
    };

    fetchInitiatorData();
  }, []);

  // Filter campaigns belonging to this initiator
  const myCampaigns = initiatorCampaigns.length > 0
    ? initiatorCampaigns
    : campaigns.filter(
        (c) =>
          currentUser.managedCampaignIds?.includes(c.id) ||
          c.initiatorName.toLowerCase().includes(currentUser.name.toLowerCase())
      );

  const totalDanaTerkumpul = myCampaigns.reduce((acc, c) => acc + (c.collectedFunds || 0), 0);
  const totalTargetDana = myCampaigns.reduce((acc, c) => acc + (c.targetFunds || 0), 0);
  const totalRelawanTerdaftar = myCampaigns.reduce((acc, c) => acc + (c.filledVolunteers || 0), 0);
  const totalTargetRelawan = myCampaigns.reduce((acc, c) => acc + (c.targetVolunteers || 0), 0);
  const totalLpjCount = myCampaigns.reduce((acc, c) => acc + (c.lpjReports?.length || 0), 0);

    const handleDeleteCampaign = async (camp: Campaign) => {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus kampanye "${camp.title}"? Seluruh data yang terkait akan dihapus secara permanen.`
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/campaigns/${camp.id}`);
      showToast(`Kampanye "${camp.title}" berhasil dihapus.`);
      setInitiatorCampaigns((prev) => prev.filter((c) => c.id !== camp.id));
      onDeleteCampaign?.(camp.id);
    } catch (err: any) {
      console.error('Delete campaign error:', err);
      showToast(err.response?.data?.message || 'Gagal menghapus kampanye dari backend.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddBudgetItem = () => {
    if (!newItemName.trim() || !newItemAmount || parseInt(newItemAmount) <= 0) {
      showToast('Masukkan nama pos belanja dan nominal yang valid.');
      return;
    }
    setBudgetItems(prev => [...prev, { name: newItemName.trim(), amount: parseInt(newItemAmount) }]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleRemoveBudgetItem = (indexToRemove: number) => {
    setBudgetItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddActivityPhoto = (urlToAdd?: string) => {
    const url = urlToAdd || newPhotoInput.trim();
    if (!url) {
      showToast('Masukkan link URL foto kegiatan yang valid.');
      return;
    }
    if (activityPhotos.includes(url)) {
      showToast('Foto ini sudah ada dalam daftar dokumentasi.');
      return;
    }
    setActivityPhotos(prev => [...prev, url]);
    if (!urlToAdd) setNewPhotoInput('');
    showToast('Foto kegiatan berhasil ditambahkan ke form LPJ.');
  };

  const handleRemoveActivityPhoto = (indexToRemove: number) => {
    setActivityPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCampId = selectedCampaignId || (myCampaigns.length > 0 ? myCampaigns[0].id : '');
    if (!targetCampId) {
      showToast('Pilih kampanye terlebih dahulu.');
      return;
    }

    const currentCampaign = myCampaigns.find(c => c.id === targetCampId);

    const finalAmount = lpjAmount ? parseInt(lpjAmount) : (calculatedBudgetTotal || 5000000);
    const primaryPhoto = activityPhotos[0] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';

    const newLpj: LpjItem = {
      id: `lpj-custom-${Date.now()}`,
      digitalRegNumber: `LPJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: lpjTitle || 'Penyaluran Bantuan Lapangan',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      realizedAmount: finalAmount,
      description: lpjDesc || 'Distribusi kebutuhan logistik sesuai rencana anggaran belanja kampanye.',
      budgetItems: budgetItems.length > 0 ? budgetItems : [{ name: 'Distribusi Logistik Lapangan', amount: finalAmount }],
      activityPhotos: activityPhotos.length > 0 ? activityPhotos : [primaryPhoto],
      photoUrl: primaryPhoto,
      beneficiariesCount: parseInt(beneficiariesCount) || 120,
      volunteersInvolved: parseInt(volunteersInvolved) || 8,
      fieldLocation: fieldLocation.trim() || currentCampaign?.locationCity || 'Posko Aksi Lapangan'
    };

    onAddLpj(targetCampId, newLpj);
    showToast(`Formulir LPJ "${newLpj.title}" berhasil diterbitkan & foto kegiatan tersinkron ke landing page!`);
    setLpjTitle('');
    setLpjAmount('');
    setLpjDesc('');
    setFieldLocation('');
    setBeneficiariesCount('');
    setVolunteersInvolved('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Return to Public Portal */}
      <div className="bg-blue-950 text-blue-200 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span className="font-semibold text-white">Portal Khusus Inisiator Kampanye</span>
            <span className="text-blue-400">|</span>
            <span>Manajemen Galang Aksi & Akuntabilitas LPJ</span>
          </div>

          <button
            onClick={onExplorePublic}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-white font-medium transition-colors border border-blue-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lihat Beranda & Katalog Publik</span>
          </button>
        </div>
      </div>

      {/* Hero Inisiator Profile Banner */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 border-2 border-blue-400 flex items-center justify-center text-white shadow-lg shrink-0">
              <Building2 className="w-9 h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold font-sans text-white">
                  {currentUser.name}
                </h1>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Inisiator Lembaga Terverifikasi Kemenkumham
                </span>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm mb-2">
                Domisili: <span className="text-white font-medium">{currentUser.city || 'Bandung'}</span> • Kontak Email: <span className="text-white font-medium">{currentUser.email}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  SK Organisasi & Rekening Bank Sah
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Indeks Kepatuhan LPJ: <strong className="text-white">100% Sempurna</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <button
            onClick={onOpenCreateCampaign}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0 hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Buka Galang Aksi Baru</span>
          </button>
        </div>

        {/* Initiator Metrics Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="flex-1 min-w-[160px] w-auto bg-blue-950/70 border border-blue-800/60 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-300 truncate">Total Donasi Dikelola</span>
              <DollarSign className="w-4 h-4 text-sky-400 shrink-0 ml-1" />
            </div>
            <div className="text-xl lg:text-2xl font-bold text-white font-sans truncate" title={formatRupiah(totalDanaTerkumpul)}>
              {formatRupiah(totalDanaTerkumpul)}
            </div>
            <div className="text-[11px] text-blue-300/80 mt-1 truncate">
              Target Total: {formatRupiah(totalTargetDana)}
            </div>
          </div>

          <div className="flex-1 min-w-[160px] w-auto bg-blue-950/70 border border-blue-800/60 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-300 truncate">Relawan Terhimpun</span>
              <Users className="w-4 h-4 text-blue-400 shrink-0 ml-1" />
            </div>
            <div className="text-xl lg:text-2xl font-bold text-white font-sans truncate">
              {totalRelawanTerdaftar} Orang
            </div>
            <div className="text-[11px] text-blue-300/80 mt-1 truncate">
              Dari Target: {totalTargetRelawan} Personel
            </div>
          </div>

          <div className="flex-1 min-w-[160px] w-auto bg-blue-950/70 border border-blue-800/60 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-300 truncate">Kampanye Dikelola</span>
              <Building2 className="w-4 h-4 text-sky-400 shrink-0 ml-1" />
            </div>
            <div className="text-xl lg:text-2xl font-bold text-white font-sans truncate">
              {myCampaigns.length} Program
            </div>
            <div className="text-[11px] text-blue-300/80 mt-1 truncate">
              Status: Semua Disetujui & Aktif
            </div>
          </div>

          <div className="flex-1 min-w-[160px] w-auto bg-blue-950/70 border border-blue-800/60 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-300 truncate">Akuntabilitas LPJ</span>
              <FileText className="w-4 h-4 text-sky-400 shrink-0 ml-1" />
            </div>
            <div className="text-xl lg:text-2xl font-bold text-sky-400 font-sans truncate">
              {totalLpjCount} Dokumen Sah
            </div>
            <div className="text-[11px] text-blue-300/80 mt-1 truncate">
              {totalLpjCount > 0 ? 'Telah Terverifikasi Publik' : 'Belum Ada Laporan Terbit'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Active Section Header Bar (Controlled via Sidebar) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              {activeTab === 'kampanye' && (
                <>
                  <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Kampanye Kelolaan Saya</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {myCampaigns.length} Program
                  </span>
                </>
              )}
              {activeTab === 'lpj' && (
                <>
                  <Upload className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Unggah & Kelola LPJ Transparansi</span>
                </>
              )}
              {activeTab === 'relawan' && (
                <>
                  <Users className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Pendaftar Relawan Lapangan</span>
                </>
              )}
              {activeTab === 'panduan' && (
                <>
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Standar Akuntabilitas & Verifikasi LPJ</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Menu navigasi inisiator kini dikelola langsung dan responsif melalui <strong>Sidebar Inisiator</strong> di sebelah kiri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 capitalize">
              Mode Inisiator
            </span>
          </div>
        </div>

        {/* TAB 1: KAMPANYE KELOLAAN SAYA */}
        {activeTab === 'kampanye' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Daftar Inisiatif Sosial Aktif</h2>
                <p className="text-xs text-slate-500">
                  Pantau perolehan donasi publik, kuota relawan lapangan, dan publikasi LPJ secara berkala.
                </p>
              </div>
              <button
                onClick={onOpenCreateCampaign}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Kampanye</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myCampaigns.map((camp) => {
                const percentDana = camp.targetFunds
                  ? Math.min(100, Math.round(((camp.collectedFunds || 0) / camp.targetFunds) * 100))
                  : 0;
                const percentRelawan = camp.targetVolunteers
                  ? Math.min(100, Math.round(((camp.filledVolunteers || 0) / camp.targetVolunteers) * 100))
                  : 0;

                return (
                  <div
                    key={camp.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden hover:border-blue-300 transition-all flex flex-col"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-40 sm:h-auto relative shrink-0">
                        <img
                          src={camp.imageUrl}
                          alt={camp.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {camp.category}
                        </span>
                      </div>

                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              Mode: {camp.mode.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              Aktif Disetujui
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                            {camp.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {camp.description}
                          </p>
                        </div>

                        {/* Progress bars */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          {(camp.mode === 'dana' || camp.mode === 'keduanya') && (
                            <div>
                              <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="text-slate-500">Donasi:</span>
                                <span className="font-bold text-slate-900">
                                  {formatRupiah(camp.collectedFunds || 0)} ({percentDana}%)
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-full rounded-full transition-all"
                                  style={{ width: `${percentDana}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {(camp.mode === 'relawan' || camp.mode === 'keduanya') && (
                            <div>
                              <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="text-slate-500">Relawan:</span>
                                <span className="font-bold text-slate-900">
                                  {camp.filledVolunteers || 0} / {camp.targetVolunteers || 0} ({percentRelawan}%)
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-sky-600 h-full rounded-full transition-all"
                                  style={{ width: `${percentRelawan}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom action buttons */}
                    <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-[11px] text-slate-500 font-medium">
                        {camp.lpjReports?.length || 0} Bukti LPJ Terbit
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Tombol Edit Kampanye */}
                        <button
                          type="button"
                          onClick={() => onEditCampaign?.(camp)}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Edit Data Kampanye"
                        >
                          <Pencil className="w-3.5 h-3.5 text-amber-600" />
                          <span>Edit</span>
                        </button>

                        {/* Tombol Hapus Kampanye */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaign(camp)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Hapus Kampanye"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Hapus</span>
                        </button>

                        {/* Tombol Lihat LPJ */}
                        <button
                          type="button"
                          onClick={() => onOpenLpjModal(camp)}
                          className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Lihat LPJ</span>
                        </button>

                        {/* Tombol Unggah LPJ Baru */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCampaignId(camp.id);
                            setActiveTab('lpj');
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>+ LPJ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: UNGGAH & KELOLA LPJ DIGITAL */}
        {activeTab === 'lpj' && (
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Form LPJ Digital Tanpa Upload Dokumen */}
            <div className="xl:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Formulir LPJ Digital Langsung di Web</h3>
                  <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                    Tanpa Upload Dokumen • Terhubung ke Landing Page
                  </span>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 text-xs text-blue-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>Koneksi Otomatis ke Galeri Landing Page:</span>
                </div>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  Laporan pertanggungjawaban diisi langsung di form web ini tanpa memerlukan berkas kertas. 
                  Foto-foto kegiatan yang Anda masukkan di bawah akan langsung muncul di halaman depan (landing page) agar publik dan donatur melihat realisasi aksi nyata.
                </p>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pilih Target Kampanye</label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {myCampaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Judul Kegiatan / Realisasi Lapangan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Distribusi Paket Logistik & Obat Tahap 1"
                    value={lpjTitle}
                    onChange={(e) => setLpjTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lokasi Titik Aksi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Posko Balai Desa RT 03"
                      value={fieldLocation}
                      onChange={(e) => setFieldLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Penerima Manfaat</label>
                    <input
                      type="number"
                      placeholder="Contoh: 150"
                      value={beneficiariesCount}
                      onChange={(e) => setBeneficiariesCount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Relawan Terlibat</label>
                    <input
                      type="number"
                      placeholder="Contoh: 12"
                      value={volunteersInvolved}
                      onChange={(e) => setVolunteersInvolved(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Pos Belanja Anggaran Terstruktur */}
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ReceiptText className="w-4 h-4 text-blue-600" />
                      Rincian Pos Belanja (Form Web)
                    </span>
                    <span className="text-[11px] font-bold text-blue-700">
                      Total: {formatRupiah(calculatedBudgetTotal)}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {budgetItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                        <span className="text-slate-800 font-medium truncate max-w-[65%]">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{formatRupiah(item.amount)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBudgetItem(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Nama pos barang/jasa"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="sm:col-span-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="Nominal (Rp)"
                        value={newItemAmount}
                        onChange={(e) => setNewItemAmount(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddBudgetItem}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shrink-0 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Foto-Foto Kegiatan Lapangan yang Berlangsung */}
                <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-sky-600" />
                      Foto Kegiatan yang Berlangsung ({activityPhotos.length})
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-semibold">
                      Tampil di Landing Page
                    </span>
                  </div>

                  {/* Preset quick photo additions */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    <span className="text-slate-400">Pilih cepat foto aksi:</span>
                    <button
                      type="button"
                      onClick={() => handleAddActivityPhoto('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-medium"
                    >
                      + Penanaman Pohon
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddActivityPhoto('https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-medium"
                    >
                      + Distribusi Medis
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddActivityPhoto('https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-medium"
                    >
                      + Belajar Mengajar
                    </button>
                  </div>

                  {/* Photos Preview Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {activityPhotos.map((photo, pIdx) => (
                      <div key={pIdx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                        <img
                          src={photo}
                          alt={`Aksi ${pIdx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveActivityPhoto(pIdx)}
                          className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-md transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Photo Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="Masukkan URL foto dokumentasi lapangan baru..."
                      value={newPhotoInput}
                      onChange={(e) => setNewPhotoInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddActivityPhoto()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Foto</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Catatan & Narasi Pelaksanaan Kegiatan</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Uraikan jalannya aksi di lapangan, respon warga penerima manfaat, dan ringkasan pelaksanaan..."
                    value={lpjDesc}
                    onChange={(e) => setLpjDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Terbitkan LPJ Digital & Sinkronkan ke Landing Page</span>
                </button>
              </form>
            </div>

            {/* Riwayat LPJ Digital yang Sudah Terbit & Tersinkron */}
            <div className="xl:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Arsip LPJ Digital & Galeri Terbit</h3>
                  <p className="text-xs text-slate-500">
                    Semua LPJ di bawah aktif dan dapat diakses langsung oleh donatur & relawan di landing page.
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                {myCampaigns.flatMap((c) =>
                  (c.lpjReports || []).map((lpj) => {
                    const photos = Array.from(
                      new Set([lpj.photoUrl, ...(lpj.activityPhotos || [])].filter(Boolean))
                    );

                    return (
                      <div
                        key={lpj.id}
                        className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 hover:bg-white transition-all shadow-2xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                                {lpj.digitalRegNumber || 'LPJ-DIGITAL'}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Sah di Web
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">{lpj.title}</h4>
                          </div>

                          <span className="text-[11px] text-slate-500">{lpj.date}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-100 text-[11px]">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Realisasi:</span>
                            <strong className="text-blue-700 font-bold">{formatRupiah(lpj.realizedAmount)}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Penerima:</span>
                            <strong className="text-slate-800">{lpj.beneficiariesCount || 100}+ Jiwa</strong>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-slate-400 block text-[10px]">Lokasi Aksi:</span>
                            <strong className="text-slate-800 truncate block">{lpj.fieldLocation || c.locationCity}</strong>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {lpj.description}
                        </p>

                        {/* Pos Belanja Ringkas */}
                        {lpj.budgetItems && lpj.budgetItems.length > 0 && (
                          <div className="bg-white p-2 rounded-xl border border-slate-100 text-[11px] space-y-1">
                            <span className="font-semibold text-slate-700 block text-[10px]">Rincian Pos Belanja Terstruktur:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {lpj.budgetItems.map((b, bIdx) => (
                                <span key={bIdx} className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                                  {b.name} ({formatRupiah(b.amount)})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Activity Photos Strip */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                            <Camera className="w-3 h-3 text-sky-500" />
                            Foto Kegiatan Terhubung ke Landing Page ({photos.length}):
                          </span>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {photos.map((ph, idx) => (
                              <img
                                key={idx}
                                src={ph}
                                alt="Dokumentasi"
                                referrerPolicy="no-referrer"
                                className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Kampanye: {c.title}</span>
                          <button
                            onClick={() => onOpenLpjModal(c)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Buka Tampilan Publik</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PENDAFTAR RELAWAN */}
        {activeTab === 'relawan' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Data Personel Relawan yang Siap Bertugas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar relawan yang mendaftar ke aksi sosial Anda. Anda dapat menghubungi mereka langsung via WhatsApp untuk koordinasi briefing teknis.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="p-3 rounded-l-xl">Nama Relawan</th>
                    <th className="p-3">Kampanye Tujuan</th>
                    <th className="p-3">Domisili & Kontak</th>
                    <th className="p-3">Status Verifikasi</th>
                    <th className="p-3 rounded-r-xl text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {volunteersList.length > 0 ? (
                    volunteersList.map((vol: any, idx: number) => (
                      <tr key={vol.id || idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">
                          {vol.user?.name || vol.name || 'Relawan Terdaftar'}
                        </td>
                        <td className="p-3 text-slate-600">{vol.campaignTitle || 'Kampanye Sosial'}</td>
                        <td className="p-3 text-slate-600">
                          {vol.user?.phone_whatsapp || vol.phone || '-'}
                        </td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {vol.status === 'accepted' ? 'Siap Bertugas' : 'Menunggu Seleksi'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {vol.user?.phone_whatsapp ? (
                            <a
                              href={`https://wa.me/${vol.user.phone_whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                            >
                              <MessageSquare className="w-3 h-3" />
                              Chat WA
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                        <Users className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-60" />
                        <div className="font-bold text-slate-800 text-sm">Belum Ada Pendaftar Relawan</div>
                        <div className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          Data relawan yang mendaftar ke kampanye aksi sosial Anda akan tercatat di tabel ini beserta kontak dan verifikasi keahliannya.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STANDAR AKUNTABILITAS */}
        {activeTab === 'panduan' && (
          <div className="mt-6 max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">
              Standar Transparansi Inisiator ActGiving
            </h2>
            <p>
              Sebagai inisiator yang disahkan oleh platform ActGiving, setiap penarikan dan penyaluran dana wajib tunduk pada standar akuntabilitas publik berikut:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong>Faktur & Kuitansi Asli:</strong> Setiap pengeluaran di atas Rp 100.000 wajib menyertakan bukti struk / nota belanja resmi toko bersangkutan.
              </li>
              <li>
                <strong>Dokumentasi Lapangan:</strong> Foto serah terima wajib menampilkan penerima manfaat dengan tetap menjaga martabat kemanusiaan.
              </li>
              <li>
                <strong>Pemberitahuan Otomatis ke Donatur:</strong> Begitu Anda menerbitkan LPJ, notifikasi email otomatis dikirimkan ke seluruh donatur kampanye tersebut secara transparan.
              </li>
              <li>
                <strong>Audit Berkala Admin:</strong> Tim auditor platform berhak meminta klarifikasi rekening koran jika ditemukan anomali pembelanjaan.
              </li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};
