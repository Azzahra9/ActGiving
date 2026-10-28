import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Building2, PlusCircle, Upload, CheckCircle2, DollarSign, Users, 
  FileText, AlertCircle, ArrowLeft, Eye, MessageSquare, ShieldCheck, 
  ExternalLink, TrendingUp, Calendar, MapPin, Search, Check, Sparkles,
  Camera, Trash2, Pencil, Plus, ReceiptText, Lock, Layers, FileCheck2, ZoomIn, ArrowRight, RefreshCw
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
  onUpdateLpj?: (campaignId: string, lpj: LpjItem) => void;
  onDeleteLpj?: (campaignId: string, lpjId: string) => void;
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
  onUpdateLpj,
  onDeleteLpj,
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
  const [isFinalReport, setIsFinalReport] = useState<boolean>(false);
  const [budgetItems, setBudgetItems] = useState<LpjBudgetItem[]>([
    { name: 'Pengadaan Paket Sembako & Logistik', amount: 3500000 },
    { name: 'Sewa Armada & Distribusi Lapangan', amount: 1500000 }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  // Foto dokumentasi: URL preview dan File asli dari galeri/perangkat pengguna
  const [activityPhotos, setActivityPhotos] = useState<string[]>([]);
  const [activityPhotoFiles, setActivityPhotoFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmittingLpj, setIsSubmittingLpj] = useState(false);
  const [editingLpjId, setEditingLpjId] = useState<string | null>(null);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate total from budget items if amount not manually specified
  const calculatedBudgetTotal = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  const [initiatorCampaigns, setInitiatorCampaigns] = useState<Campaign[]>([]);
  const [volunteersList, setVolunteersList] = useState<any[]>([]);
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState<boolean>(false);

  // Fetch volunteer applicants directly from initiator endpoint or per-campaign
  const fetchVolunteersList = useCallback(async () => {
    setIsLoadingVolunteers(true);
    try {
      // 1. Coba ambil langsung dari endpoint dedicated inisiator
      const res = await api.get('/initiator/volunteers').catch(() => null);
      const items = res?.data?.data;
      if (Array.isArray(items) && items.length > 0) {
        setVolunteersList(items);
        return;
      }

      // 2. Fallback: jika /initiator/volunteers kosong, ambil per kampanye
      const sourceCampaigns = initiatorCampaigns.length > 0 ? initiatorCampaigns : (campaigns || []);
      if (sourceCampaigns.length > 0) {
        const regPromises = sourceCampaigns.map((c: Campaign) =>
          api.get(`/campaigns/${c.id}/registrations`).catch(() => null)
        );
        const regResults = await Promise.all(regPromises);
        const allRegs: any[] = [];
        regResults.forEach((rRes, idx) => {
          if (rRes?.data?.data) {
            const regs = rRes.data.data.registrations || (Array.isArray(rRes.data.data) ? rRes.data.data : []);
            if (Array.isArray(regs)) {
              regs.forEach((r: any) => {
                allRegs.push({
                  ...r,
                  campaignTitle: r.campaignTitle || sourceCampaigns[idx]?.title || 'Kampanye Sosial'
                });
              });
            }
          }
        });
        setVolunteersList(allRegs);
      }
    } catch (err) {
      console.warn('Gagal memuat daftar pendaftar relawan:', err);
    } finally {
      setIsLoadingVolunteers(false);
    }
  }, [initiatorCampaigns, campaigns]);

  // Fetch real initiator campaigns from Laravel REST API
  useEffect(() => {
    const fetchInitiatorData = async () => {
      try {
        const response = await api.get('/my-campaigns').catch(() => null);
        const items = response?.data?.data?.data || response?.data?.data || [];
        if (Array.isArray(items) && items.length > 0) {
          const mapped = items.map(mapBackendCampaignToFrontend);
          setInitiatorCampaigns(mapped);
        }
      } catch (err) {
        console.warn('Gagal memuat kampanye inisiator dari API:', err);
      }
    };

    fetchInitiatorData();
    fetchVolunteersList();
  }, [fetchVolunteersList]);

  // Refetch saat tab relawan dibuka
  useEffect(() => {
    if (activeTab === 'relawan') {
      fetchVolunteersList();
    }
  }, [activeTab, fetchVolunteersList]);

  // Update status seleksi relawan (Accept / Reject)
  const handleUpdateVolunteerStatus = async (regId: number, newStatus: 'accepted' | 'rejected') => {
    try {
      await api.patch(`/volunteer-registrations/${regId}/status`, { status: newStatus });
      setToastMessage(`Status relawan berhasil diubah menjadi: ${newStatus === 'accepted' ? 'Siap Bertugas' : 'Ditolak'}.`);
      setVolunteersList((prev) =>
        prev.map((v) => (v.id === regId ? { ...v, status: newStatus } : v))
      );
    } catch (err: any) {
      console.error('Gagal memperbarui status relawan:', err);
      alert(err.response?.data?.message || 'Gagal memperbarui status relawan.');
    }
  };

  const currentUserName = currentUser?.name?.toLowerCase() || '';

  // Filter campaigns belonging to this initiator
  const myCampaigns = initiatorCampaigns.length > 0
    ? initiatorCampaigns
    : (campaigns || []).filter(
        (c) =>
          Boolean(c) &&
          (Boolean(currentUser?.managedCampaignIds?.includes(c.id)) ||
          Boolean(c.initiatorName && currentUserName && c.initiatorName.toLowerCase().includes(currentUserName)) ||
          c.id === 'camp-01')
      );

  const totalDanaTerkumpul = myCampaigns.reduce((acc, c) => acc + (c?.collectedFunds || 0), 0);
  const totalTargetDana = myCampaigns.reduce((acc, c) => acc + (c?.targetFunds || 0), 0);
  const totalRelawanTerdaftar = myCampaigns.reduce((acc, c) => acc + (c?.filledVolunteers || 0), 0);
  const totalTargetRelawan = myCampaigns.reduce((acc, c) => acc + (c?.targetVolunteers || 0), 0);
  const totalLpjCount = myCampaigns.reduce((acc, c) => acc + (Array.isArray(c?.lpjReports) ? c.lpjReports.length : 0), 0);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      if (e.target) e.target.value = '';
      return;
    }

    const incomingFiles = Array.from(selectedFiles);

    // 1. Filter internal di dalam incomingFiles agar tidak ada file ganda dalam 1 seleksi
    const uniqueIncomingMap = new Map<string, File>();
    incomingFiles.forEach((file) => {
      const key = `${file.name}_${file.size}_${file.lastModified}`;
      if (!uniqueIncomingMap.has(key)) {
        uniqueIncomingMap.set(key, file);
      }
    });
    const uniqueIncoming = Array.from(uniqueIncomingMap.values());

    // 2. Filter terhadap state foto yang sudah ada sebelumnya
    setActivityPhotoFiles((prevFiles) => {
      const existingKeys = new Set(prevFiles.map((f) => `${f.name}_${f.size}_${f.lastModified}`));
      const nonDuplicateFiles = uniqueIncoming.filter((f) => !existingKeys.has(`${f.name}_${f.size}_${f.lastModified}`));

      if (nonDuplicateFiles.length === 0) {
        showToast('Foto ini sudah ada dalam daftar pratinjau.');
        return prevFiles;
      }

      // Buat Object URL preview hanya untuk file baru yang unik
      const newPreviews = nonDuplicateFiles.map((file) => URL.createObjectURL(file));
      setActivityPhotos((prevPhotos) => [...prevPhotos, ...newPreviews]);
      showToast(`${nonDuplicateFiles.length} foto kegiatan berhasil ditambahkan.`);

      return [...prevFiles, ...nonDuplicateFiles];
    });

    // 3. Reset value input file agar tidak terjadi double-trigger dan mengizinkan pemilihan ulang
    e.target.value = '';
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveActivityPhoto = (indexToRemove: number) => {
    const previewUrl = activityPhotos[indexToRemove];
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setActivityPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setActivityPhotoFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Bersihkan Object URLs saat unmount
  useEffect(() => {
    return () => {
      activityPhotos.forEach((url) => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleStartEditLpj = (campaignId: string, lpj: LpjItem) => {
    if (lpj.status === 'verified' || lpj.status === 'sah') {
      showToast('LPJ sudah berstatus Sah oleh Admin dan terkunci dari perubahan.');
      return;
    }
    setEditingLpjId(lpj.id);
    setEditingCampaignId(campaignId);
    setSelectedCampaignId(campaignId);
    setLpjTitle(lpj.title);
    setLpjAmount(lpj.realizedAmount.toString());
    setLpjDesc(lpj.description);
    setFieldLocation(lpj.fieldLocation || '');
    setBeneficiariesCount((lpj.beneficiariesCount || '').toString());
    setVolunteersInvolved((lpj.volunteersInvolved || '').toString());
    setIsFinalReport(Boolean(lpj.isFinal || lpj.reportType === 'final'));
    setBudgetItems(lpj.budgetItems || []);
    setActivityPhotos(lpj.activityPhotos || (lpj.photoUrl ? [lpj.photoUrl] : []));
    setActivityPhotoFiles([]);
    showToast(`Mode edit aktif: "${lpj.title}". Silakan sesuaikan data lalu simpan.`);

    const formEl = document.getElementById('lpj-form-container');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEditLpj = () => {
    setEditingLpjId(null);
    setEditingCampaignId(null);
    setLpjTitle('');
    setLpjAmount('');
    setLpjDesc('');
    setFieldLocation('');
    setBeneficiariesCount('');
    setVolunteersInvolved('');
    setIsFinalReport(false);
    setActivityPhotos([]);
    setActivityPhotoFiles([]);
  };

  const handleDeleteLpjReport = async (campaignId: string, lpjId: string, status?: string) => {
    if (status === 'verified' || status === 'sah') {
      showToast('LPJ sudah diverifikasi Sah oleh Admin dan terkunci dari penghapusan.');
      return;
    }

    const confirmDelete = window.confirm(
      'Apakah Anda yakin ingin menghapus Laporan Pertanggungjawaban (LPJ) ini? Data yang dihapus tidak dapat dipulihkan.'
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/campaigns/${campaignId}/lpj/${lpjId}`);
      showToast('Laporan Pertanggungjawaban (LPJ) berhasil dihapus.');
    } catch (err: any) {
      console.warn('Delete LPJ error:', err);
      showToast(err.response?.data?.message || 'Gagal menghapus LPJ dari backend.');
      if (err.response?.status === 403) return;
    }

    setInitiatorCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            lpjReports: (c.lpjReports || []).filter((r) => r.id !== lpjId),
          };
        }
        return c;
      })
    );

    onDeleteLpj?.(campaignId, lpjId);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCampId = selectedCampaignId || (myCampaigns.length > 0 ? myCampaigns[0].id : '');
    if (!targetCampId) {
      showToast('Pilih kampanye terlebih dahulu.');
      return;
    }

    const currentCampaign = myCampaigns.find(c => c.id === targetCampId);
    // Prioritaskan total kalkulasi dari Rincian Pos Belanja, fallback ke manual lpjAmount jika ada
    const totalRealisasi = calculatedBudgetTotal > 0 
      ? calculatedBudgetTotal 
      : (lpjAmount ? parseInt(lpjAmount, 10) : 0);
    const finalAmount = totalRealisasi > 0 ? totalRealisasi : (lpjAmount ? parseInt(lpjAmount, 10) : 5000000);
    const descriptionText = lpjDesc.trim() || 'Laporan pertanggungjawaban kegiatan penyaluran dan aksi lapangan.';

    setIsSubmittingLpj(true);

    // Siapkan FormData untuk mengirim file asli ke backend Laravel
    const formData = new FormData();
    formData.append('description', descriptionText);
    formData.append('title', lpjTitle || 'Penyaluran Bantuan Lapangan');
    formData.append('total_realisasi', finalAmount.toString());
    formData.append('amount_spent', finalAmount.toString());
    formData.append('realized_amount', finalAmount.toString());
    formData.append('field_location', fieldLocation.trim() || currentCampaign?.locationCity || 'Posko Aksi Lapangan');
    formData.append('beneficiaries_count', (parseInt(beneficiariesCount) || 0).toString());
    formData.append('volunteers_involved', (parseInt(volunteersInvolved) || 0).toString());
    formData.append('budget_items', JSON.stringify(budgetItems));
    formData.append('is_final', isFinalReport ? '1' : '0');
    formData.append('report_type', isFinalReport ? 'final' : 'progress');

    // Masukkan berkas gambar asli ke dalam FormData
    if (activityPhotoFiles.length > 0) {
      // Masukkan seluruh file ke activity_photos[]
      activityPhotoFiles.forEach((file) => {
        formData.append('activity_photos[]', file);
      });
      // proof_image untuk endpoint standar Laravel (file utama)
      formData.append('proof_image', activityPhotoFiles[0]);
    }

    let serverProofUrl = '';
    let serverActivityUrls: string[] = [];

    try {
      const res = await api.post(`/campaigns/${targetCampId}/lpj`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.data) {
        serverProofUrl = res.data.data.public_url || res.data.data.lpj_report?.proof_image_url || '';
        if (Array.isArray(res.data.data.activity_photo_urls)) {
          serverActivityUrls = res.data.data.activity_photo_urls;
        }
      }
    } catch (err: any) {
      console.warn('Backend API LPJ upload notice:', err);
    } finally {
      setIsSubmittingLpj(false);
    }

    const primaryPhoto = serverProofUrl || activityPhotos[0] || '';
    const finalPhotos = serverActivityUrls.length > 0 ? serverActivityUrls : activityPhotos;

    if (editingLpjId && editingCampaignId) {
      const updatedLpj: LpjItem = {
        id: editingLpjId,
        digitalRegNumber: `LPJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: lpjTitle || 'Penyaluran Bantuan Lapangan',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        realizedAmount: finalAmount,
        description: descriptionText,
        budgetItems: budgetItems.length > 0 ? budgetItems : [{ name: 'Distribusi Logistik Lapangan', amount: finalAmount }],
        activityPhotos: finalPhotos.length > 0 ? finalPhotos : (primaryPhoto ? [primaryPhoto] : []),
        photoUrl: primaryPhoto,
        beneficiariesCount: parseInt(beneficiariesCount) || 120,
        volunteersInvolved: parseInt(volunteersInvolved) || 8,
        fieldLocation: fieldLocation.trim() || currentCampaign?.locationCity || 'Posko Aksi Lapangan',
        status: 'pending',
        isFinal: isFinalReport,
        reportType: isFinalReport ? 'final' : 'progress',
      };

      setInitiatorCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === targetCampId) {
            return {
              ...c,
              lpjReports: (c.lpjReports || []).map((r) => (r.id === editingLpjId ? updatedLpj : r)),
            };
          }
          return c;
        })
      );

      onUpdateLpj?.(targetCampId, updatedLpj);
      showToast(`Laporan LPJ "${updatedLpj.title}" berhasil diperbarui!`);
      handleCancelEditLpj();
      return;
    }

    const newLpj: LpjItem = {
      id: `lpj-custom-${Date.now()}`,
      digitalRegNumber: `LPJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: lpjTitle || 'Penyaluran Bantuan Lapangan',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      realizedAmount: finalAmount,
      description: descriptionText,
      budgetItems: budgetItems.length > 0 ? budgetItems : [{ name: 'Distribusi Logistik Lapangan', amount: finalAmount }],
      activityPhotos: finalPhotos.length > 0 ? finalPhotos : (primaryPhoto ? [primaryPhoto] : []),
      photoUrl: primaryPhoto,
      beneficiariesCount: parseInt(beneficiariesCount) || 120,
      volunteersInvolved: parseInt(volunteersInvolved) || 8,
      fieldLocation: fieldLocation.trim() || currentCampaign?.locationCity || 'Posko Aksi Lapangan',
      status: 'pending',
      isFinal: isFinalReport,
      reportType: isFinalReport ? 'final' : 'progress',
    };

    setInitiatorCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === targetCampId) {
          return {
            ...c,
            lpjReports: [newLpj, ...(c.lpjReports || [])],
          };
        }
        return c;
      })
    );

    onAddLpj(targetCampId, newLpj);
    showToast(`Formulir LPJ "${newLpj.title}" berhasil diunggah dan masuk antrean audit Admin!`);
    setLpjTitle('');
    setLpjAmount('');
    setLpjDesc('');
    setFieldLocation('');
    setBeneficiariesCount('');
    setVolunteersInvolved('');
    setIsFinalReport(false);
    setActivityPhotos([]);
    setActivityPhotoFiles([]);
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
                            {camp.status === 'closed' || camp.status === 'completed' ? (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Selesai (Ditutup)
                              </span>
                            ) : camp.status === 'rejected' ? (
                              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                Ditolak
                              </span>
                            ) : camp.status === 'pending' || camp.status === 'pending_approval' ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Menunggu Moderasi
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                Aktif Disetujui
                              </span>
                            )}
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

                {/* Opsi Jenis Laporan Pertanggungjawaban (LPJ) */}
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 block text-xs">
                      Pilih Jenis Laporan Pertanggungjawaban:
                    </label>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Status Capaian Kampanye
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Option 1: Laporan Berkala / Tahapan */}
                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        !isFinalReport
                          ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 text-slate-900 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="initiator_report_type"
                        checked={!isFinalReport}
                        onChange={() => setIsFinalReport(false)}
                        className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-bold text-xs text-slate-900">
                            Laporan Berkala / Tahapan
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">
                          Kampanye masih berjalan dan masih dapat menerima donasi atau pendaftaran relawan lanjutan.
                        </span>
                      </div>
                    </label>

                    {/* Option 2: Laporan Akhir (Final) */}
                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isFinalReport
                          ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/20 text-slate-900 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="initiator_report_type"
                        checked={isFinalReport}
                        onChange={() => setIsFinalReport(true)}
                        className="mt-0.5 h-4 w-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="font-bold text-xs text-purple-950">
                            Laporan Akhir
                          </span>
                          <span className="text-[9px] bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded font-bold">
                            100% Selesai
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">
                          Menyatakan seluruh dana/kegiatan telah selesai 100% dan kampanye ditutup.
                        </span>
                      </div>
                    </label>
                  </div>

                  {isFinalReport && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-center gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Otomatisasi Penutupan Kampanye:</strong> Jika Admin memverifikasi Sah LPJ Akhir ini, status kampanye yang berelasi akan otomatis berubah menjadi <strong>Selesai / Ditutup</strong>.
                      </span>
                    </div>
                  )}
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
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-sky-600" />
                      Foto Kegiatan yang Berlangsung ({activityPhotos.length})
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-semibold">
                      Tampil di Landing Page
                    </span>
                  </div>

                  {/* Input File Standar (Tersembunyi, dipicu tombol / dropzone) */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Area Upload File dari Galeri / Device */}
                  {activityPhotos.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        Pilih Foto Dokumentasi dari Perangkat / Galeri
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Format JPG, PNG, atau WEBP. Bisa pilih beberapa foto sekaligus.
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Foto</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Photos Preview Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {activityPhotos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 shadow-2xs"
                          >
                            <img
                              src={photo}
                              alt={`Dokumentasi Aksi ${pIdx + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveActivityPhoto(pIdx)}
                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
                                title="Hapus foto ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[9px] rounded font-medium">
                              Foto #{pIdx + 1}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Baris Tambah Foto Tambahan */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {activityPhotos.length} foto kegiatan dipilih dari galeri
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Foto</span>
                        </button>
                      </div>
                    </div>
                  )}
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
                  <span>{editingLpjId ? 'Simpan Perubahan LPJ' : 'Terbitkan LPJ & Ajukan ke Audit Admin'}</span>
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
                {totalLpjCount === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Belum ada riwayat LPJ yang diterbitkan</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Silakan isi formulir digital di sebelah kiri untuk melaporkan penyaluran dana.
                    </p>
                  </div>
                ) : (
                  myCampaigns.flatMap((c) =>
                    (Array.isArray(c?.lpjReports) ? c.lpjReports : []).map((lpj) => {
                      if (!lpj) return null;
                      const isVerified = lpj.status === 'verified' || lpj.status === 'sah';
                      const rawPhotos = [
                        lpj.photoUrl,
                        ...(Array.isArray(lpj.activityPhotos) ? lpj.activityPhotos : [])
                      ];
                      const photos = Array.from(new Set(rawPhotos.filter(Boolean))) as string[];

                      return (
                        <div
                          key={lpj.id}
                          className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 hover:bg-white transition-all shadow-2xs space-y-3"
                        >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                                {lpj.digitalRegNumber || 'LPJ-DIGITAL'}
                              </span>
                              {lpj.isFinal || lpj.reportType === 'final' ? (
                                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 shadow-2xs">
                                  <CheckCircle2 className="w-3 h-3 text-purple-600" />
                                  LPJ Akhir (Final)
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
                                  <Layers className="w-3 h-3 text-sky-600" />
                                  LPJ Progress (Tahapan)
                                </span>
                              )}
                              {isVerified ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                  <Lock className="w-3 h-3 text-emerald-600" />
                                  Terkunci & Sah oleh Admin
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  Pending Review Admin
                                </span>
                              )}
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
                            Foto Kegiatan ({photos.length}):
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

                        {/* Actions Bar */}
                        <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">Kampanye: {c.title}</span>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isVerified ? (
                              <>
                                <button
                                  type="button"
                                  disabled
                                  className="px-2.5 py-1 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium cursor-not-allowed flex items-center gap-1 border border-slate-200 opacity-60"
                                  title="Data terkunci & sah oleh admin (tidak dapat diedit lagi)"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  disabled
                                  className="px-2.5 py-1 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium cursor-not-allowed flex items-center gap-1 border border-slate-200 opacity-60"
                                  title="Data terkunci & sah oleh admin (tidak dapat dihapus lagi)"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>Hapus</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditLpj(c.id, lpj)}
                                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                                  title="Edit data LPJ yang masih pending"
                                >
                                  <Pencil className="w-3 h-3 text-blue-600" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLpjReport(c.id, lpj.id, lpj.status)}
                                  className="px-2.5 py-1.5 bg-white hover:bg-red-50 border border-slate-300 hover:border-red-300 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                                  title="Hapus LPJ ini"
                                >
                                  <Trash2 className="w-3 h-3 text-red-600" />
                                  <span>Hapus</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => onOpenLpjModal(c)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isVerified ? 'Buka Tampilan Publik' : 'Pratinjau Publik'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PENDAFTAR RELAWAN */}
        {activeTab === 'relawan' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Data Personel Relawan yang Siap Bertugas
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar relawan yang mendaftar ke aksi sosial Anda. Anda dapat menghubungi mereka langsung via WhatsApp untuk koordinasi briefing teknis.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchVolunteersList}
                disabled={isLoadingVolunteers}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingVolunteers ? 'animate-spin' : ''}`} />
                <span>Segarkan Data</span>
              </button>
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
                    volunteersList.map((vol: any, idx: number) => {
                      const rawPhone = (vol.user?.phone_whatsapp || vol.phone || '').replace(/\D/g, '');
                      const waPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;

                      return (
                        <tr key={vol.id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="font-semibold text-slate-900">
                              {vol.user?.name || vol.name || 'Relawan Terdaftar'}
                            </div>
                            <div className="text-[11px] text-slate-500 font-normal truncate max-w-xs mt-0.5">
                              {vol.skills ? `Keahlian: ${vol.skills}` : 'Relawan Umum'}
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">
                            {vol.campaignTitle || vol.campaign?.title || 'Kampanye Sosial'}
                          </td>
                          <td className="p-3 text-slate-600">
                            <div className="font-medium text-slate-800">
                              {vol.user?.city_domicile || vol.city || 'Indonesia'}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {vol.user?.phone_whatsapp || vol.phone || vol.user?.email || '-'}
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                vol.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : vol.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {vol.status === 'accepted'
                                ? 'Siap Bertugas'
                                : vol.status === 'rejected'
                                ? 'Ditolak'
                                : 'Menunggu Seleksi'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {waPhone ? (
                                <a
                                  href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                                    `Halo ${vol.user?.name || vol.name}, terima kasih telah mendaftar sebagai relawan pada kampanye ${vol.campaignTitle || 'ActGiving'}. Kami panitia pelaksana ingin melakukan koordinasi jadwal dan briefing teknis lapangan.`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                                  title="Hubungi Relawan via WhatsApp"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Chat WA</span>
                                </a>
                              ) : null}

                              {vol.status !== 'accepted' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateVolunteerStatus(vol.id, 'accepted')}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] transition-colors cursor-pointer shadow-xs"
                                  title="Setujui Relawan untuk Bertugas"
                                >
                                  Setujui
                                </button>
                              )}

                              {vol.status !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateVolunteerStatus(vol.id, 'rejected')}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg font-bold text-[10px] transition-colors cursor-pointer border border-slate-200"
                                  title="Tolak Lamaran Relawan"
                                >
                                  Tolak
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
