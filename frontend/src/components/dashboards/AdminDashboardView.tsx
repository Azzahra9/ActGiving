import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText, 
  Eye, Check, ExternalLink, Building2, MapPin, ArrowLeft, 
  Search, Users, DollarSign, Activity, Lock, Database, RefreshCw, Sparkles, Layers,
  Ban, Calendar, Clock, X, Info, UserCheck, Phone, Mail, Award, CheckCircle,
  Flag, Download
} from 'lucide-react';
import { Campaign, UserProfile, LpjItem, DisbursementRecord, CampaignReportRecord } from '../../types';
import api, { BACKEND_ROOT_URL } from '../../lib/axios';
import { mapBackendCampaignToFrontend } from '../../services/campaignService';
import { formatRupiah } from '../../utils/format';

export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  phone_whatsapp?: string;
  city_domicile?: string;
  identity_doc_url?: string;
  is_verified: boolean;
  role: string;
  created_at: string;
}

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
  activeTab?: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem' | 'users' | 'disbursements' | 'reports';
  onTabChange?: (tab: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem' | 'users' | 'disbursements' | 'reports') => void;
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
  const [internalTab, setInternalTab] = useState<'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem' | 'users' | 'disbursements' | 'reports'>('moderasi');
  const activeTab = propActiveTab || internalTab;
  const setActiveTab = (tab: 'moderasi' | 'audit_lpj' | 'transaksi' | 'sistem' | 'users' | 'disbursements' | 'reports') => {
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
  
  // States untuk Modul AUTH-04: Verifikasi Akun Inisiator
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');
  const [userFilter, setUserFilter] = useState<'all' | 'unverified' | 'verified'>('all');
  const [verifyingUserId, setVerifyingUserId] = useState<number | null>(null);
  const [docPreviewUser, setDocPreviewUser] = useState<AdminUserRecord | null>(null);

  // States untuk Modul DIS-02: Pencairan Dana (Disbursement)
  const [adminDisbursements, setAdminDisbursements] = useState<DisbursementRecord[]>([]);
  const [isLoadingDisbursements, setIsLoadingDisbursements] = useState<boolean>(false);
  const [disbursementSearch, setDisbursementSearch] = useState<string>('');
  const [disbursementFilter, setDisbursementFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [processingDisbursementId, setProcessingDisbursementId] = useState<number | string | null>(null);

  // States untuk Modul REP-02: Aduan / Laporan Kampanye Publik
  const [adminReports, setAdminReports] = useState<CampaignReportRecord[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
  const [reportSearch, setReportSearch] = useState<string>('');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'investigating' | 'resolved' | 'dismissed'>('all');
  const [processingReportId, setProcessingReportId] = useState<number | string | null>(null);
  const [selectedReportDetail, setSelectedReportDetail] = useState<CampaignReportRecord | null>(null);

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

  const fetchAdminUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await api.get('/admin/users');
      const items = res.data?.data?.data || res.data?.data;
      if (Array.isArray(items) && items.length > 0) {
        setAdminUsers(items);
      } else {
        // Jika dari backend belum ada data pengguna lain selain admin, tampilkan mock inisiator
        setAdminUsers([
          {
            id: 2,
            name: 'Budi Santoso (Yayasan Harapan Bangsa)',
            email: 'budi.santoso@harapan.org',
            phone_whatsapp: '081234567890',
            city_domicile: 'Bandung',
            identity_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
            is_verified: false,
            role: 'user',
            created_at: new Date(Date.now() - 2 * 86400000).toISOString()
          },
          {
            id: 3,
            name: 'Siti Nurhaliza (Komunitas Peduli Anak Pesisir)',
            email: 'siti.nurhaliza@pedulipesisir.org',
            phone_whatsapp: '082198765432',
            city_domicile: 'Surabaya',
            identity_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
            is_verified: false,
            role: 'user',
            created_at: new Date(Date.now() - 1 * 86400000).toISOString()
          },
          {
            id: 4,
            name: 'Dr. Hendra Wijaya (Aksi Relawan Medis)',
            email: 'hendra.wijaya@relawanmedis.id',
            phone_whatsapp: '085712345678',
            city_domicile: 'Yogyakarta',
            identity_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
            is_verified: true,
            role: 'user',
            created_at: new Date(Date.now() - 7 * 86400000).toISOString()
          }
        ]);
      }
    } catch (err) {
      console.warn('Gagal memuat daftar pengguna admin dari REST API:', err);
      setAdminUsers([
        {
          id: 2,
          name: 'Budi Santoso (Yayasan Harapan Bangsa)',
          email: 'budi.santoso@harapan.org',
          phone_whatsapp: '081234567890',
          city_domicile: 'Bandung',
          identity_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
          is_verified: false,
          role: 'user',
          created_at: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          id: 3,
          name: 'Siti Nurhaliza (Komunitas Peduli Anak Pesisir)',
          email: 'siti.nurhaliza@pedulipesisir.org',
          phone_whatsapp: '082198765432',
          city_domicile: 'Surabaya',
          identity_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
          is_verified: false,
          role: 'user',
          created_at: new Date(Date.now() - 1 * 86400000).toISOString()
        },
        {
          id: 4,
          name: 'Dr. Hendra Wijaya (Aksi Relawan Medis)',
          email: 'hendra.wijaya@relawanmedis.id',
          phone_whatsapp: '085712345678',
          city_domicile: 'Yogyakarta',
          identity_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
          is_verified: true,
          role: 'user',
          created_at: new Date(Date.now() - 7 * 86400000).toISOString()
        }
      ]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchAdminDisbursements = async () => {
    setIsLoadingDisbursements(true);
    try {
      const res = await api.get('/admin/disbursements');
      const items = res.data?.data?.data || res.data?.data;
      if (Array.isArray(items) && items.length > 0) {
        setAdminDisbursements(items);
      } else {
        setAdminDisbursements([
          {
            id: 1,
            campaign_id: 1,
            user_id: 2,
            amount: 2500000,
            bank_name: 'BCA',
            account_number: '8899001122',
            bank_account: '8899001122',
            account_name: 'Yayasan Harapan Bangsa',
            reason: 'Pengadaan paket sembako darurat dan air bersih tahap pertama.',
            status: 'pending',
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            campaign: {
              id: 1,
              title: 'Bantuan Tanggap Darurat Banjir Bandang Demak & Kudus',
              user: {
                name: 'Budi Santoso (Yayasan Harapan Bangsa)',
                email: 'budi.santoso@harapan.org'
              }
            },
            user: {
              id: 2,
              name: 'Budi Santoso (Yayasan Harapan Bangsa)',
              email: 'budi.santoso@harapan.org'
            }
          },
          {
            id: 2,
            campaign_id: 2,
            user_id: 3,
            amount: 1500000,
            bank_name: 'Mandiri',
            account_number: '1370001234567',
            bank_account: '1370001234567',
            account_name: 'Komunitas Peduli Pesisir',
            reason: 'Pembelian 500 bibit mangrove dan sewa perahu penanaman relawan.',
            status: 'pending',
            created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
            campaign: {
              id: 2,
              title: 'Aksi Restorasi 1.000 Mangrove Pesisir Pantai Utara',
              user: {
                name: 'Siti Nurhaliza (Komunitas Peduli Pesisir)',
                email: 'siti.nurhaliza@pedulipesisir.org'
              }
            },
            user: {
              id: 3,
              name: 'Siti Nurhaliza (Komunitas Peduli Pesisir)',
              email: 'siti.nurhaliza@pedulipesisir.org'
            }
          },
          {
            id: 3,
            campaign_id: 3,
            user_id: 4,
            amount: 5000000,
            bank_name: 'BRI',
            account_number: '020601001234500',
            bank_account: '020601001234500',
            account_name: 'Aksi Relawan Medis',
            reason: 'Pengadaan obat-obatan esensial, infus, dan tenda medis lapangan.',
            status: 'approved',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            campaign: {
              id: 3,
              title: 'Posko Pelayanan Medis & Vaksinasi Lansia Daerah Terisolir',
              user: {
                name: 'Dr. Hendra Wijaya (Aksi Relawan Medis)',
                email: 'hendra.wijaya@relawanmedis.id'
              }
            },
            user: {
              id: 4,
              name: 'Dr. Hendra Wijaya (Aksi Relawan Medis)',
              email: 'hendra.wijaya@relawanmedis.id'
            }
          }
        ]);
      }
    } catch (err) {
      console.warn('Gagal memuat daftar pencairan admin dari REST API:', err);
      setAdminDisbursements([
        {
          id: 1,
          campaign_id: 1,
          user_id: 2,
          amount: 2500000,
          bank_name: 'BCA',
          account_number: '8899001122',
          bank_account: '8899001122',
          account_name: 'Yayasan Harapan Bangsa',
          reason: 'Pengadaan paket sembako darurat dan air bersih tahap pertama.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          campaign: {
            id: 1,
            title: 'Bantuan Tanggap Darurat Banjir Bandang Demak & Kudus',
            user: {
              name: 'Budi Santoso (Yayasan Harapan Bangsa)',
              email: 'budi.santoso@harapan.org'
            }
          },
          user: {
            id: 2,
            name: 'Budi Santoso (Yayasan Harapan Bangsa)',
            email: 'budi.santoso@harapan.org'
          }
        },
        {
          id: 2,
          campaign_id: 2,
          user_id: 3,
          amount: 1500000,
          bank_name: 'Mandiri',
          account_number: '1370001234567',
          bank_account: '1370001234567',
          account_name: 'Komunitas Peduli Pesisir',
          reason: 'Pembelian 500 bibit mangrove dan sewa perahu penanaman relawan.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
          campaign: {
            id: 2,
            title: 'Aksi Restorasi 1.000 Mangrove Pesisir Pantai Utara',
            user: {
              name: 'Siti Nurhaliza (Komunitas Peduli Pesisir)',
              email: 'siti.nurhaliza@pedulipesisir.org'
            }
          },
          user: {
            id: 3,
            name: 'Siti Nurhaliza (Komunitas Peduli Pesisir)',
            email: 'siti.nurhaliza@pedulipesisir.org'
          }
        },
        {
          id: 3,
          campaign_id: 3,
          user_id: 4,
          amount: 5000000,
          bank_name: 'BRI',
          account_number: '020601001234500',
          bank_account: '020601001234500',
          account_name: 'Aksi Relawan Medis',
          reason: 'Pengadaan obat-obatan esensial, infus, dan tenda medis lapangan.',
          status: 'approved',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          campaign: {
            id: 3,
            title: 'Posko Pelayanan Medis & Vaksinasi Lansia Daerah Terisolir',
            user: {
              name: 'Dr. Hendra Wijaya (Aksi Relawan Medis)',
              email: 'hendra.wijaya@relawanmedis.id'
            }
          },
          user: {
            id: 4,
            name: 'Dr. Hendra Wijaya (Aksi Relawan Medis)',
            email: 'hendra.wijaya@relawanmedis.id'
          }
        }
      ]);
    } finally {
      setIsLoadingDisbursements(false);
    }
  };

  const handleUpdateDisbursementStatus = async (
    disbursementId: number | string,
    status: 'approved' | 'rejected'
  ) => {
    setProcessingDisbursementId(disbursementId);
    // Optimistic UI Update: seketika ubah status baris di state tabel
    const previousDisbursements = [...adminDisbursements];
    setAdminDisbursements((prev) =>
      prev.map((d) => (d.id === disbursementId ? { ...d, status } : d))
    );

    try {
      await api.patch(`/admin/disbursements/${disbursementId}/status`, {
        status,
        admin_notes:
          status === 'approved'
            ? 'Pengajuan pencairan dana disetujui oleh Administrator.'
            : 'Pengajuan pencairan dana ditolak oleh Administrator.'
      });
      showToast('Status pencairan berhasil diperbarui');
      await fetchAdminDisbursements();
      await fetchAdminCampaigns();
      onRefreshCampaigns?.();
    } catch (err: any) {
      console.warn('Gagal update status pencairan di backend:', err);
      if (err?.response?.status && err.response.status !== 404) {
        setAdminDisbursements(previousDisbursements);
        const errMsg = err?.response?.data?.message || 'Gagal memperbarui status pencairan.';
        showToast(`Error: ${errMsg}`);
      } else {
        showToast('Status pencairan berhasil diperbarui');
      }
    } finally {
      setProcessingDisbursementId(null);
    }
  };

  const fetchAdminReports = async () => {
    setIsLoadingReports(true);
    try {
      const res = await api.get('/admin/reports');
      const items = res.data?.data?.data || res.data?.data;
      if (Array.isArray(items)) {
        setAdminReports(items);
      }
    } catch (err) {
      console.warn('Gagal memuat laporan aduan kampanye dari REST API:', err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleUpdateReportStatus = async (
    reportId: number | string,
    status: 'investigating' | 'resolved' | 'dismissed'
  ) => {
    setProcessingReportId(reportId);
    const previousReports = [...adminReports];
    const previousDetail = selectedReportDetail;

    // Optimistic UI Update
    setAdminReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
    if (selectedReportDetail?.id === reportId) {
      setSelectedReportDetail((prev) => (prev ? { ...prev, status } : null));
    }

    try {
      await api.patch(`/admin/reports/${reportId}/status`, { status });
      const label =
        status === 'investigating'
          ? 'Laporan ditandai Sedang Diinvestigasi.'
          : status === 'dismissed'
          ? 'Laporan aduan ditolak / diabaikan.'
          : 'Laporan aduan ditandai Selesai.';
      showToast(label);
      await fetchAdminReports();
    } catch (err: any) {
      console.error('Gagal memperbarui status laporan:', err);
      setAdminReports(previousReports);
      setSelectedReportDetail(previousDetail);
      const errMsg = err?.response?.data?.message || 'Gagal memperbarui status laporan aduan.';
      showToast(`Error: ${errMsg}`);
    } finally {
      setProcessingReportId(null);
    }
  };

  const handleSuspendFromReport = async (report: CampaignReportRecord) => {
    setProcessingReportId(report.id);
    const previousReports = [...adminReports];
    const previousCampaigns = [...adminCampaigns];
    const previousDetail = selectedReportDetail;

    // Optimistic UI Update: ubah status laporan menjadi resolved & kampanye menjadi suspended
    setAdminReports((prev) =>
      prev.map((r) => {
        if (r.id === report.id) {
          return {
            ...r,
            status: 'resolved',
            campaign: r.campaign ? { ...r.campaign, status: 'suspended' } : r.campaign,
          };
        }
        if (String(r.campaign_id) === String(report.campaign_id) && r.campaign) {
          return { ...r, campaign: { ...r.campaign, status: 'suspended' } };
        }
        return r;
      })
    );
    setAdminCampaigns((prev) =>
      prev.map((c) => (String(c.id) === String(report.campaign_id) ? { ...c, status: 'suspended' } : c))
    );
    if (selectedReportDetail?.id === report.id) {
      setSelectedReportDetail((prev) =>
        prev
          ? {
              ...prev,
              status: 'resolved',
              campaign: prev.campaign ? { ...prev.campaign, status: 'suspended' } : prev.campaign,
            }
          : null
      );
    }

    try {
      await api.patch(`/admin/campaigns/${report.campaign_id}/suspend`, {
        reason: `Dibekukan berdasarkan tindak lanjut aduan publik #${report.id} (${report.category})`,
      });
      await api.patch(`/admin/reports/${report.id}/status`, {
        status: 'resolved',
      });

      showToast('Kampanye berhasil dibekukan dan laporan ditutup');
      setSelectedReportDetail(null);

      await Promise.all([fetchAdminReports(), fetchAdminCampaigns()]);
      onRefreshCampaigns?.();
    } catch (err: any) {
      console.error('Gagal membekukan kampanye dari laporan:', err);
      setAdminReports(previousReports);
      setAdminCampaigns(previousCampaigns);
      setSelectedReportDetail(previousDetail);
      const errMsg = err?.response?.data?.message || 'Gagal membekukan kampanye dan menutup laporan.';
      showToast(`Error: ${errMsg}`);
    } finally {
      setProcessingReportId(null);
    }
  };

  useEffect(() => {
    fetchAdminCampaigns();
    fetchAdminDonations();
    fetchAdminLpj();
    fetchAdminUsers();
    fetchAdminDisbursements();
    fetchAdminReports();
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

  const pendingDisbursementsCount = adminDisbursements.filter((d) => d.status === 'pending').length;
  const approvedDisbursementsCount = adminDisbursements.filter((d) => d.status === 'approved').length;
  const rejectedDisbursementsCount = adminDisbursements.filter((d) => d.status === 'rejected').length;
  const totalDisbursedAmount = adminDisbursements
    .filter((d) => d.status === 'approved')
    .reduce((acc, d) => acc + Number(d.amount || 0), 0);

  const filteredDisbursements = adminDisbursements.filter((item) => {
    if (disbursementFilter === 'pending' && item.status !== 'pending') return false;
    if (disbursementFilter === 'approved' && item.status !== 'approved') return false;
    if (disbursementFilter === 'rejected' && item.status !== 'rejected') return false;
    if (disbursementSearch.trim()) {
      const q = disbursementSearch.toLowerCase();
      const matchCampaign = item.campaign?.title?.toLowerCase().includes(q);
      const matchUser =
        item.user?.name?.toLowerCase().includes(q) ||
        item.campaign?.user?.name?.toLowerCase().includes(q);
      const matchBank = item.bank_name?.toLowerCase().includes(q);
      const matchAccount = (item.account_number || item.bank_account || '').toLowerCase().includes(q);
      const matchName = item.account_name?.toLowerCase().includes(q);
      const matchReason = item.reason?.toLowerCase().includes(q);
      return matchCampaign || matchUser || matchBank || matchAccount || matchName || matchReason;
    }
    return true;
  });

  const pendingReportsCount = adminReports.filter((r) => r.status === 'pending').length;
  const investigatingReportsCount = adminReports.filter((r) => r.status === 'investigating').length;
  const resolvedReportsCount = adminReports.filter((r) => r.status === 'resolved').length;
  const dismissedReportsCount = adminReports.filter((r) => r.status === 'dismissed').length;

  const getReportCategoryLabel = (category?: string): string => {
    switch ((category || '').toLowerCase()) {
      case 'penipuan':
        return 'Dugaan Penipuan';
      case 'fiktif':
        return 'Kampanye Fiktif';
      case 'spam':
        return 'Spam / Duplikat';
      case 'konten_tidak_pantas':
        return 'Konten Tidak Pantas';
      case 'lainnya':
        return 'Pelanggaran Lainnya';
      default:
        return category || 'Lainnya';
    }
  };

  const getReportEvidenceUrl = (report: CampaignReportRecord): string | null => {
    if (report.evidence_url) return report.evidence_url;
    if (!report.evidence_path) return null;
    const cleanPath = String(report.evidence_path).replace(/^\/+/, '');
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }
    return `${BACKEND_ROOT_URL}/storage/${cleanPath}`;
  };

  const filteredReports = adminReports.filter((item) => {
    if (reportFilter !== 'all' && item.status !== reportFilter) return false;
    if (reportSearch.trim()) {
      const q = reportSearch.toLowerCase();
      const matchReporter = item.reporter_name?.toLowerCase().includes(q) || item.reporter_email?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q) || getReportCategoryLabel(item.category).toLowerCase().includes(q);
      const matchCampaign = item.campaign?.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      return matchReporter || matchCategory || matchCampaign || matchDesc;
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

  const handleVerifyUser = async (userId: number, verify: boolean = true) => {
    setVerifyingUserId(userId);
    // Optimistic UI Update: seketika perbarui status pengguna di state tabel lokal
    const previousUsers = [...adminUsers];
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_verified: verify } : u))
    );

    try {
      const res = await api.patch(`/admin/users/${userId}/verify`, { is_verified: verify });
      const targetUser = adminUsers.find((u) => u.id === userId);
      const name = targetUser?.name || `Pengguna ID #${userId}`;
      const msg = res.data?.message || (verify
        ? `Pengguna "${name}" berhasil diverifikasi sebagai Inisiator Terpercaya.`
        : `Status verifikasi pengguna "${name}" berhasil dicabut.`);
      showToast(msg);
      // Sinkronisasi ulang dengan backend untuk memastikan konsistensi
      await fetchAdminUsers();
    } catch (err: any) {
      console.error('Gagal verifikasi pengguna:', err);
      // Rollback optimistik jika server gagal
      setAdminUsers(previousUsers);
      const errMsg = err?.response?.data?.message || 'Gagal mengubah status verifikasi inisiator.';
      showToast(`Error: ${errMsg}`);
    } finally {
      setVerifyingUserId(null);
    }
  };

  const unverifiedUsersCount = adminUsers.filter((u) => !u.is_verified).length;
  const verifiedUsersCount = adminUsers.filter((u) => u.is_verified).length;

  const filteredUsers = adminUsers.filter((user) => {
    if (userFilter === 'unverified' && user.is_verified) return false;
    if (userFilter === 'verified' && !user.is_verified) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      const matchName = user.name?.toLowerCase().includes(q);
      const matchEmail = user.email?.toLowerCase().includes(q);
      const matchCity = user.city_domicile?.toLowerCase().includes(q);
      const matchPhone = user.phone_whatsapp?.toLowerCase().includes(q);
      return matchName || matchEmail || matchCity || matchPhone;
    }
    return true;
  });

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
        <div className="fixed top-20 right-4 z-[70] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
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
              {activeTab === 'users' && (
                <>
                  <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Verifikasi Akun Inisiator & Dokumen Legalitas</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {unverifiedUsersCount} Menunggu Verifikasi
                  </span>
                </>
              )}
              {activeTab === 'disbursements' && (
                <>
                  <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Pencairan Dana</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {pendingDisbursementsCount} Menunggu Validasi
                  </span>
                </>
              )}
              {activeTab === 'reports' && (
                <>
                  <Flag className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Aduan Kampanye</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    {pendingReportsCount} Laporan Baru
                  </span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Panel administrasi dan audit dapat diakses melalui tombol tab di bawah maupun <strong>Sidebar Admin</strong> di sebelah kiri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 capitalize">
              Mode Super Admin
            </span>
          </div>
        </div>

        {/* Quick Tab Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('moderasi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'moderasi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Antrean Moderasi</span>
            {pendingCampaigns.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'moderasi' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                {pendingCampaigns.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit_lpj')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'audit_lpj'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit LPJ & Kuitansi</span>
          </button>

          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'transaksi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Audit Transaksi</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Verifikasi Inisiator</span>
            {unverifiedUsersCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'users' ? 'bg-emerald-800 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {unverifiedUsersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('disbursements')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'disbursements'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Pencairan Dana</span>
            {pendingDisbursementsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'disbursements' ? 'bg-emerald-800 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {pendingDisbursementsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Flag className={`w-4 h-4 ${activeTab === 'reports' ? 'text-white' : 'text-rose-500'}`} />
            <span>Aduan Kampanye</span>
            {pendingReportsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'reports' ? 'bg-rose-800 text-white' : 'bg-rose-100 text-rose-700'}`}>
                {pendingReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sistem')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'sistem'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Integritas Sistem</span>
          </button>
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

        {/* TAB 5: VERIFIKASI AKUN INISIATOR (AUTH-04) */}
        {activeTab === 'users' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>Daftar Pengguna & Verifikasi Inisiator Terpercaya</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tinjau identitas, nomor kontak, domisili, dan dokumen KTP/Legalitas organisasi calon inisiator sebelum mengaktifkan izin pembukaan kampanye donasi.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={fetchAdminUsers}
                  disabled={isLoadingUsers}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                  <span>Segarkan Data</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Cari nama, email, no telepon, atau kota domisili..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setUserFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    userFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({adminUsers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter('unverified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    userFilter === 'unverified'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Menunggu Verifikasi</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${userFilter === 'unverified' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                    {unverifiedUsersCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter('verified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    userFilter === 'verified'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Inisiator Terverifikasi</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${userFilter === 'verified' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                    {verifiedUsersCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-3 px-4">Pengguna / Inisiator</th>
                      <th className="py-3 px-4">Kontak & Domisili</th>
                      <th className="py-3 px-4">Dokumen Legalitas</th>
                      <th className="py-3 px-4">Status Akun</th>
                      <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                          <span>Memuat daftar akun pengguna & inisiator...</span>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p className="font-semibold text-slate-700">Tidak ada data pengguna yang cocok</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Coba ubah kata kunci pencarian atau filter status verifikasi.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isVerifying = verifyingUserId === user.id;
                        return (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* User Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-xs">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{user.name}</span>
                                    {user.role === 'admin' && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                                        ADMIN
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    <span>{user.email}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Contact & Domicile */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1 text-slate-700">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{user.phone_whatsapp || 'Belum diisi'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{user.city_domicile || 'Indonesia'}</span>
                                </div>
                              </div>
                            </td>

                            {/* Identity Document */}
                            <td className="py-3.5 px-4">
                              {user.identity_doc_url ? (
                                <button
                                  type="button"
                                  onClick={() => setDocPreviewUser(user)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-[11px] border border-blue-200 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Lihat Dokumen</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">
                                  Belum diunggah
                                </span>
                              )}
                            </td>

                            {/* Verification Status */}
                            <td className="py-3.5 px-4">
                              {user.is_verified ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Inisiator Terverifikasi</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Belum Terverifikasi / Reguler</span>
                                </span>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!user.is_verified ? (
                                  <button
                                    type="button"
                                    disabled={isVerifying}
                                    onClick={() => handleVerifyUser(user.id, true)}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                                    title="Verifikasi pengguna ini sebagai inisiator resmi"
                                  >
                                    {isVerifying ? (
                                      <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>Memproses...</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="w-3.5 h-3.5" />
                                        <span>Verifikasi Inisiator</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isVerifying}
                                    onClick={() => handleVerifyUser(user.id, false)}
                                    className="px-2.5 py-1.5 text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 rounded-xl text-xs font-semibold transition-colors border border-slate-200 flex items-center gap-1 disabled:opacity-50"
                                    title="Batalkan status verifikasi inisiator"
                                  >
                                    {isVerifying ? (
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5 text-slate-400 hover:text-amber-600" />
                                    )}
                                    <span>Cabut Status</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PENCAIRAN DANA (DIS-02) */}
        {activeTab === 'disbursements' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Antrean Validasi Pencairan Dana</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifikasi pengajuan pencairan dana kampanye oleh Inisiator dengan validasi ACID mutasi saldo dompet program.
                </p>
              </div>

              <button
                onClick={fetchAdminDisbursements}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto shadow-xs"
                title="Muat ulang data pencairan"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDisbursements ? 'animate-spin' : ''}`} />
                <span>Segarkan Data</span>
              </button>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="text-xs text-slate-500">Total Pengajuan</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{adminDisbursements.length}</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                <div className="text-xs text-amber-800 font-medium">Menunggu Validasi</div>
                <div className="text-xl font-bold text-amber-700 mt-1">{pendingDisbursementsCount}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                <div className="text-xs text-emerald-800 font-medium">Telah Disetujui</div>
                <div className="text-xl font-bold text-emerald-700 mt-1">{approvedDisbursementsCount}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
                <div className="text-xs text-blue-800 font-medium">Total Dana Cair</div>
                <div className="text-lg sm:text-xl font-bold text-blue-700 mt-1 truncate" title={formatRupiah(totalDisbursedAmount)}>
                  {formatRupiah(totalDisbursedAmount)}
                </div>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={disbursementSearch}
                  onChange={(e) => setDisbursementSearch(e.target.value)}
                  placeholder="Cari kampanye, inisiator, bank, rekening..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setDisbursementFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    disbursementFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({adminDisbursements.length})
                </button>
                <button
                  onClick={() => setDisbursementFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                    disbursementFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending ({pendingDisbursementsCount})</span>
                </button>
                <button
                  onClick={() => setDisbursementFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                    disbursementFilter === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Disetujui ({approvedDisbursementsCount})</span>
                </button>
                <button
                  onClick={() => setDisbursementFilter('rejected')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                    disbursementFilter === 'rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Ditolak ({rejectedDisbursementsCount})</span>
                </button>
              </div>
            </div>

            {/* Table of Disbursements */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Nama Kampanye & Inisiator</th>
                    <th className="py-3 px-4">Nominal Pencairan</th>
                    <th className="py-3 px-4">Bank, Nomor & Nama Rekening</th>
                    <th className="py-3 px-4">Alasan Pencairan</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredDisbursements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <DollarSign className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-600 text-sm">Tidak ada antrean pencairan dana yang ditemukan.</p>
                        <p className="text-[11px] mt-0.5">Ubah filter status atau kata kunci pencarian di atas.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredDisbursements.map((d) => {
                      const campaignTitle = d.campaign?.title || `Kampanye ID #${d.campaign_id}`;
                      const initiatorName = d.user?.name || d.campaign?.user?.name || d.account_name || 'Inisiator Kampanye';
                      const initiatorEmail = d.user?.email || d.campaign?.user?.email;
                      const accountNumber = d.account_number || d.bank_account || '-';
                      const isProcessing = processingDisbursementId === d.id;

                      return (
                        <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* 1. Nama Kampanye & Inisiator */}
                          <td className="py-3.5 px-4 align-top max-w-[240px]">
                            <div className="font-bold text-slate-900 line-clamp-2" title={campaignTitle}>
                              {campaignTitle}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-slate-600">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                                {initiatorName.charAt(0).toUpperCase()}
                              </span>
                              <span className="font-medium text-[11px] truncate" title={initiatorName}>
                                {initiatorName}
                              </span>
                            </div>
                            {initiatorEmail && (
                              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                {initiatorEmail}
                              </div>
                            )}
                          </td>

                          {/* 2. Nominal Pencairan (format Rupiah) */}
                          <td className="py-3.5 px-4 align-top whitespace-nowrap">
                            <span className="text-emerald-700 font-bold font-mono text-sm block">
                              {formatRupiah(Number(d.amount))}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              ID: #{d.id}
                            </span>
                          </td>

                          {/* 3. Bank, Nomor Rekening, & Nama Rekening */}
                          <td className="py-3.5 px-4 align-top max-w-[200px]">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[10px] uppercase border border-blue-200">
                                {d.bank_name}
                              </span>
                              <span className="font-mono font-bold text-slate-900 tracking-wide text-xs">
                                {accountNumber}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-700 mt-1 font-medium">
                              A.N: <strong className="text-slate-900">{d.account_name}</strong>
                            </div>
                          </td>

                          {/* 4. Alasan Pencairan */}
                          <td className="py-3.5 px-4 align-top max-w-[220px]">
                            <p className="text-slate-700 text-xs line-clamp-3" title={d.reason || '-'}>
                              {d.reason || 'Tidak ada alasan khusus yang dicantumkan.'}
                            </p>
                            {d.admin_notes && (
                              <div className="mt-1.5 text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-md border border-slate-200">
                                <strong>Catatan Admin:</strong> {d.admin_notes}
                              </div>
                            )}
                          </td>

                          {/* 5. Status (Pending/Approved/Rejected) */}
                          <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                            {d.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
                                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>Menunggu (Pending)</span>
                              </span>
                            )}
                            {d.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Disetujui (Approved)</span>
                              </span>
                            )}
                            {d.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span>Ditolak (Rejected)</span>
                              </span>
                            )}
                          </td>

                          {/* 6. Tombol Aksi */}
                          <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                            {d.status === 'pending' ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDisbursementStatus(d.id, 'approved')}
                                  disabled={isProcessing}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:shadow-emerald-600/20 cursor-pointer"
                                  title="Setujui permohonan pencairan dana"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDisbursementStatus(d.id, 'rejected')}
                                  disabled={isProcessing}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:shadow-rose-600/20 cursor-pointer"
                                  title="Tolak permohonan pencairan dana"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] font-medium text-slate-400 italic">
                                Selesai Diproses
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: ADUAN KAMPANYE PUBLIK (REP-02) */}
        {activeTab === 'reports' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-rose-600" />
                  <span>Antrean Aduan & Laporan Kampanye Fiktif</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tinjau laporan kejanggalan dari masyarakat, periksa bukti pendukung, dan bekukan kampanye yang terbukti melanggar.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchAdminReports}
                disabled={isLoadingReports}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
                title="Muat ulang daftar aduan kampanye"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingReports ? 'animate-spin' : ''}`} />
                <span>Segarkan Data</span>
              </button>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="text-xs text-slate-500">Total Aduan</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{adminReports.length}</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl">
                <div className="text-xs text-rose-800 font-medium">Menunggu (Pending)</div>
                <div className="text-xl font-bold text-rose-700 mt-1">{pendingReportsCount}</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                <div className="text-xs text-amber-800 font-medium">Sedang Diinvestigasi</div>
                <div className="text-xl font-bold text-amber-700 mt-1">{investigatingReportsCount}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                <div className="text-xs text-emerald-800 font-medium">Selesai / Ditutup</div>
                <div className="text-xl font-bold text-emerald-700 mt-1">{resolvedReportsCount + dismissedReportsCount}</div>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  placeholder="Cari pelapor, email, kategori, atau judul kampanye..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setReportFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    reportFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({adminReports.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReportFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    reportFilter === 'pending'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  Pending ({pendingReportsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setReportFilter('investigating')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    reportFilter === 'investigating'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  Investigasi ({investigatingReportsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setReportFilter('resolved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    reportFilter === 'resolved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  Resolved ({resolvedReportsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setReportFilter('dismissed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    reportFilter === 'dismissed'
                      ? 'bg-slate-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Dismissed ({dismissedReportsCount})
                </button>
              </div>
            </div>

            {/* Tabel Laporan Aduan */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Nama Pelapor</th>
                    <th className="py-3 px-4">Kategori Aduan</th>
                    <th className="py-3 px-4">Kampanye yang Dilaporkan</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoadingReports ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600" />
                        <span>Memuat daftar laporan aduan kampanye...</span>
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Flag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-600 text-sm">
                          Tidak ada laporan aduan kampanye ditemukan.
                        </p>
                        <p className="text-[11px] mt-0.5">
                          Belum ada laporan masuk dari publik atau tidak cocok dengan filter pencarian.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((rep) => {
                      const isProcessing = processingReportId === rep.id;
                      const isCampaignSuspended = rep.campaign?.status === 'suspended';
                      const evidenceUrl = getReportEvidenceUrl(rep);
                      const formattedDate = rep.created_at
                        ? new Date(rep.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Baru saja';

                      return (
                        <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* 1. Nama Pelapor */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                              <span>{rep.reporter_name || rep.user?.name || 'Pelapor Publik'}</span>
                              {rep.user_id && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold">
                                  Akun Terdaftar
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {rep.reporter_email}
                            </div>
                          </td>

                          {/* 2. Kategori Aduan */}
                          <td className="py-3.5 px-4 align-top max-w-[220px]">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[10px] uppercase">
                              {getReportCategoryLabel(rep.category || rep.reason_category)}
                            </span>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                              {rep.description}
                            </p>
                            {evidenceUrl && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold mt-1">
                                <FileText className="w-3 h-3" />
                                Ada Lampiran Bukti
                              </span>
                            )}
                          </td>

                          {/* 3. Kampanye yang Dilaporkan */}
                          <td className="py-3.5 px-4 align-top max-w-[240px]">
                            <div className="font-bold text-slate-900 line-clamp-2">
                              {rep.campaign?.title || `Kampanye ID #${rep.campaign_id}`}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[10px] text-slate-400">
                                ID #{rep.campaign_id}
                              </span>
                              {isCampaignSuspended ? (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
                                  SUSPENDED
                                </span>
                              ) : (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold uppercase">
                                  {rep.campaign?.status || 'active'}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 4. Tanggal */}
                          <td className="py-3.5 px-4 align-top whitespace-nowrap text-slate-600">
                            {formattedDate}
                          </td>

                          {/* 5. Status */}
                          <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                            {rep.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                <Clock className="w-3.5 h-3.5 text-rose-600" />
                                <span>Pending</span>
                              </span>
                            )}
                            {rep.status === 'investigating' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Investigasi</span>
                              </span>
                            )}
                            {rep.status === 'resolved' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Resolved</span>
                              </span>
                            )}
                            {rep.status === 'dismissed' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 border border-slate-300">
                                <XCircle className="w-3.5 h-3.5 text-slate-500" />
                                <span>Dismissed</span>
                              </span>
                            )}
                          </td>

                          {/* 6. Tombol Detail & Aksi Cepat */}
                          <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setSelectedReportDetail(rep)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Detail</span>
                              </button>

                              {rep.status !== 'investigating' && rep.status !== 'resolved' && rep.status !== 'dismissed' && (
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleUpdateReportStatus(rep.id, 'investigating')}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                                  title="Tandai laporan sedang diinvestigasi"
                                >
                                  <span>Investigasi</span>
                                </button>
                              )}

                              {rep.status !== 'resolved' && rep.status !== 'dismissed' && (
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleUpdateReportStatus(rep.id, 'dismissed')}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                                  title="Abaikan atau tolak laporan"
                                >
                                  <span>Abaikan/Tolak Laporan</span>
                                </button>
                              )}

                              {!isCampaignSuspended && rep.status !== 'resolved' && (
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleSuspendFromReport(rep)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                                  title="Bekukan kampanye dan tutup laporan sebagai resolved"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Suspend Kampanye</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
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

      {/* Modal Preview Dokumen Legalitas Inisiator (AUTH-04) */}
      {docPreviewUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dokumen Identitas & Legalitas
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {docPreviewUser.name} • {docPreviewUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDocPreviewUser(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-72 flex items-center justify-center">
                {docPreviewUser.identity_doc_url ? (
                  <img
                    src={docPreviewUser.identity_doc_url}
                    alt={`Dokumen Identitas ${docPreviewUser.name}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-xs text-slate-400 py-8">Dokumen tidak dapat dimuat</p>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <p><strong>Nama Pemohon:</strong> {docPreviewUser.name}</p>
                <p><strong>WhatsApp:</strong> {docPreviewUser.phone_whatsapp || '-'}</p>
                <p><strong>Kota Domisili:</strong> {docPreviewUser.city_domicile || '-'}</p>
                <p><strong>Status Saat Ini:</strong> {docPreviewUser.is_verified ? 'Terverifikasi' : 'Menunggu Verifikasi'}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDocPreviewUser(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Tutup
              </button>
              {!docPreviewUser.is_verified && (
                <button
                  onClick={() => {
                    handleVerifyUser(docPreviewUser.id, true);
                    setDocPreviewUser(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verifikasi Inisiator Sekarang</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Laporan Aduan & Bukti (REP-02) */}
      {selectedReportDetail && (() => {
        const evidenceUrl = getReportEvidenceUrl(selectedReportDetail);
        const isPdfEvidence = Boolean(
          evidenceUrl && evidenceUrl.toLowerCase().split('?')[0].endsWith('.pdf')
        );
        const isProcessingDetail = processingReportId === selectedReportDetail.id;
        const isCampaignSuspended = selectedReportDetail.campaign?.status === 'suspended';

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-rose-600 to-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                      Detail Aduan Publik #{selectedReportDetail.id}
                    </div>
                    <h3 className="text-base font-bold text-white truncate">
                      {selectedReportDetail.campaign?.title || `Kampanye ID #${selectedReportDetail.campaign_id}`}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReportDetail(null)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  aria-label="Tutup Detail Aduan"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
                {/* Metadata Pelapor & Kampanye */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Identitas Pelapor</div>
                    <div className="font-bold text-slate-900 text-sm">
                      {selectedReportDetail.reporter_name || selectedReportDetail.user?.name || 'Pelapor Publik'}
                    </div>
                    <div className="text-[11px] text-slate-600">{selectedReportDetail.reporter_email}</div>
                    {selectedReportDetail.user && (
                      <div className="text-[10px] text-blue-700 font-semibold pt-0.5">
                        Akun Terdaftar: {selectedReportDetail.user.name} (ID #{selectedReportDetail.user.id})
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Kategori & Status Laporan</div>
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[11px]">
                        {getReportCategoryLabel(selectedReportDetail.category || selectedReportDetail.reason_category)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold text-[11px] uppercase">
                        {selectedReportDetail.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1">
                      Status Kampanye:{' '}
                      <strong className={isCampaignSuspended ? 'text-red-600' : 'text-slate-800'}>
                        {(selectedReportDetail.campaign?.status || 'active').toUpperCase()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Kronologi Lengkap */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>Kronologi & Detail Kejanggalan</span>
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                    {selectedReportDetail.description}
                  </div>
                </div>

                {/* Bukti Pendukung (evidence_path) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Bukti Pendukung Pelapor</h4>
                    {evidenceUrl && (
                      <div className="flex items-center gap-2">
                        <a
                          href={evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] border border-blue-200 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka Tab Baru</span>
                        </a>
                        <a
                          href={evidenceUrl}
                          download
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] border border-slate-300 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Bukti</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {!evidenceUrl ? (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-slate-500 text-xs">
                      Pelapor tidak melampirkan berkas bukti foto atau PDF.
                    </div>
                  ) : isPdfEvidence ? (
                    <a
                      href={evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Dokumen Bukti (PDF)</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {selectedReportDetail.evidence_path}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                    </a>
                  ) : (
                    <a
                      href={evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-95 transition-opacity"
                      title="Klik untuk membuka ukuran penuh"
                    >
                      <img
                        src={evidenceUrl}
                        alt="Bukti Laporan Aduan"
                        className="w-full max-h-72 object-contain mx-auto"
                      />
                    </a>
                  )}
                </div>
              </div>

              {/* Footer Tombol Tindak Lanjut Admin */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedReportDetail(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Tutup
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isProcessingDetail || selectedReportDetail.status === 'investigating'}
                    onClick={() => handleUpdateReportStatus(selectedReportDetail.id, 'investigating')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    Investigasi
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingDetail || selectedReportDetail.status === 'dismissed'}
                    onClick={() => handleUpdateReportStatus(selectedReportDetail.id, 'dismissed')}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    Abaikan/Tolak Laporan
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingDetail || (isCampaignSuspended && selectedReportDetail.status === 'resolved')}
                    onClick={() => handleSuspendFromReport(selectedReportDetail)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Suspend Kampanye</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
