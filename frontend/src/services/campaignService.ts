import api from '../lib/axios';
import { Campaign, CampaignMode, CampaignSchedule, Category, LpjItem } from '../types';

export interface CampaignQueryParams {
  category_id?: number;
  campaign_mode?: 'fund_only' | 'volunteer_only' | 'both';
  search?: string;
  page?: number;
}

// Fallback images curated per category
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  'Bencana Alam': 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  'Pendidikan': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'Lingkungan Hidup': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  'Kesehatan': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  'Panti Asuhan': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
  'Sosial & Kemanusiaan': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
};

export const getCategoryDefaultImage = (categoryName?: string): string => {
  if (!categoryName) return CATEGORY_DEFAULT_IMAGES['Sosial & Kemanusiaan'];
  return CATEGORY_DEFAULT_IMAGES[categoryName] || CATEGORY_DEFAULT_IMAGES['Sosial & Kemanusiaan'];
};

// Konversi backend campaign_mode enum ke tipe CampaignMode frontend
export const mapBackendModeToFrontend = (mode?: string): CampaignMode => {
  switch (mode) {
    case 'fund_only':
      return 'dana';
    case 'volunteer_only':
      return 'relawan';
    case 'both':
    default:
      return 'keduanya';
  }
};

// Konversi LPJ Report dari backend
export const mapBackendLpjToFrontend = (lpj: any): LpjItem => {
  const realizedAmount = Number(
    lpj.total_realisasi || lpj.amount_spent || lpj.realized_amount || lpj.realizedAmount || 0
  );
  const title = lpj.title || lpj.judul_kegiatan || 'Laporan Penggunaan Dana';
  const fieldLocation = lpj.field_location || lpj.fieldLocation || lpj.lokasi_aksi || lpj.location || undefined;
  const beneficiariesCount = lpj.beneficiaries_count || lpj.beneficiariesCount || lpj.penerima_manfaat || undefined;
  const volunteersInvolved = lpj.volunteers_involved || lpj.volunteersInvolved || lpj.relawan_terlibat || undefined;
  const activityPhotos = Array.isArray(lpj.activity_photos)
    ? lpj.activity_photos
    : Array.isArray(lpj.activityPhotos)
    ? lpj.activityPhotos
    : Array.isArray(lpj.photos)
    ? lpj.photos
    : [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      ];

  return {
    id: String(lpj.id),
    title,
    judul_kegiatan: title,
    date: lpj.report_date
      ? new Date(lpj.report_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : lpj.created_at
      ? new Date(lpj.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
    createdAt: lpj.created_at || lpj.createdAt || undefined,
    realizedAmount,
    total_realisasi: realizedAmount,
    description: lpj.description || '',
    photoUrl:
      lpj.receipt_image_url ||
      lpj.proof_image_url ||
      lpj.photo_url ||
      lpj.photoUrl ||
      activityPhotos[0] ||
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    activityPhotos,
    activity_photos: activityPhotos,
    budgetItems: lpj.budget_items || lpj.budgetItems || [],
    beneficiariesCount,
    penerima_manfaat: beneficiariesCount,
    volunteersInvolved,
    relawan_terlibat: volunteersInvolved,
    fieldLocation,
    lokasi_aksi: fieldLocation,
    digitalRegNumber: lpj.digital_reg_number || lpj.digitalRegNumber || undefined,
    receiptUrl: lpj.receipt_image_url || lpj.proof_image_url || lpj.receiptUrl || undefined,
    status: (lpj.status as 'pending' | 'verified' | 'sah' | 'rejected') || 'pending',
    isFinal: Boolean(lpj.is_final || lpj.isFinal || lpj.report_type === 'final' || lpj.reportType === 'final'),
    reportType: (lpj.report_type as 'progress' | 'final') || (lpj.reportType as 'progress' | 'final') || (lpj.is_final ? 'final' : 'progress'),
  };
};

/**
 * Mapper: Mentransformasikan data JSON Kampanye dari Laravel API
 * menjadi struktur model frontend Campaign.
 */
export const mapBackendCampaignToFrontend = (item: any): Campaign => {
  const categoryName = item.category?.category_name || (typeof item.category === 'string' ? item.category : 'Bencana Alam');
  const targetFunds = Number(item.target_amount || 0);
  const collectedFunds = Number(item.current_amount || 0);
  const targetVolunteers = Number(item.target_volunteers || 0);
  const filledVolunteers = Number(item.current_volunteers || 0);
  const mode = mapBackendModeToFrontend(item.campaign_mode);

  return {
    id: String(item.id),
    title: item.title || 'Tanpa Judul Kampanye',
    initiatorName: item.user?.name || 'Inisiator Kemanusiaan',
    initiatorRole: item.user?.is_verified ? 'Inisiator Terverifikasi' : 'Komunitas Relawan',
    category: categoryName as Category,
    mode: mode,
    locationCity: item.location || 'Indonesia',
    distanceKm: item.distance_km || 3.5,
    imageUrl: item.image_url || getCategoryDefaultImage(categoryName),
    description: item.description || '',
    status: item.status === 'active' 
      ? 'active' 
      : item.status === 'rejected' 
      ? 'rejected' 
      : item.status === 'suspended'
      ? 'suspended'
      : (item.status === 'closed' || item.status === 'completed')
      ? 'closed'
      : 'pending_approval',
    targetFunds: targetFunds,
    collectedFunds: collectedFunds,
    deadlineDays: item.deadline_days || 14,
    targetVolunteers: targetVolunteers,
    filledVolunteers: filledVolunteers,
    eventDate: item.activity_date
      ? new Date(item.activity_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Jadwal Segera Dimulai',
    eventTime: item.event_time || '08:00 - 17:00 WIB',
    taskCriteria: item.task_criteria || [
      'Bersedia hadir langsung di lokasi kegiatan',
      'Kondisi fisik sehat dan prima',
      'Mengikuti instruksi koordinator lapangan',
    ],
    lpjReports: Array.isArray(item.lpj_reports)
      ? item.lpj_reports.map(mapBackendLpjToFrontend)
      : Array.isArray(item.lpjReports)
      ? item.lpjReports.map(mapBackendLpjToFrontend)
      : [],
    schedules: Array.isArray(item.schedules) ? item.schedules : [],
    disbursements: Array.isArray(item.disbursements) ? item.disbursements : [],
  };
};

/**
 * Service API Kampanye
 */
export const campaignService = {
  /**
   * Mengambil daftar kampanye aktif dari backend Laravel
   * Endpoint: GET /api/campaigns
   */
  async getCampaigns(params?: CampaignQueryParams): Promise<Campaign[]> {
    const response = await api.get('/campaigns', { params });
    const responseData = response.data;

    let items: any[] = [];

    if (responseData?.data) {
      if (Array.isArray(responseData.data)) {
        items = responseData.data;
      } else if (Array.isArray(responseData.data.data)) {
        // Laravel Pagination Object
        items = responseData.data.data;
      }
    }

    return items.map(mapBackendCampaignToFrontend);
  },

  /**
   * Mengambil detail kampanye publik berdasarkan ID
   * Endpoint: GET /api/campaigns/{id}
   */
  async getCampaignDetail(id: string | number): Promise<Campaign> {
    const response = await api.get(`/campaigns/${id}`);
    const campaignData = response.data?.data;
    if (!campaignData) {
      throw new Error('Data kampanye tidak ditemukan.');
    }
    return mapBackendCampaignToFrontend(campaignData);
  },

  /**
   * Mengambil daftar kategori kampanye
   * Endpoint: GET /api/categories
   */
  async getCategories(): Promise<any[]> {
    const response = await api.get('/categories');
    return response.data?.data || [];
  },

  /**
   * Mengambil daftar jadwal harian untuk kampanye tertentu
   * Endpoint: GET /api/campaigns/{campaignId}/schedules
   */
  async getCampaignSchedules(campaignId: string | number): Promise<CampaignSchedule[]> {
    const response = await api.get(`/campaigns/${campaignId}/schedules`);
    return response.data?.data || [];
  },

  /**
   * Menambahkan jadwal harian baru (Inisiator)
   * Endpoint: POST /api/campaigns/{campaignId}/schedules
   */
  async createCampaignSchedule(
    campaignId: string | number,
    data: {
      event_date: string;
      start_time?: string;
      end_time?: string;
      title: string;
      description_tasks?: string;
    }
  ): Promise<CampaignSchedule> {
    const response = await api.post(`/campaigns/${campaignId}/schedules`, data);
    return response.data?.data;
  },

  /**
   * Memperbarui jadwal harian kampanye (Inisiator)
   * Endpoint: PUT /api/campaigns/{campaignId}/schedules/{scheduleId}
   */
  async updateCampaignSchedule(
    campaignId: string | number,
    scheduleId: string | number,
    data: {
      event_date?: string;
      start_time?: string;
      end_time?: string;
      title?: string;
      description_tasks?: string;
    }
  ): Promise<CampaignSchedule> {
    const response = await api.put(`/campaigns/${campaignId}/schedules/${scheduleId}`, data);
    return response.data?.data;
  },

  /**
   * Menghapus jadwal harian kampanye (Inisiator)
   * Endpoint: DELETE /api/campaigns/{campaignId}/schedules/{scheduleId}
   */
  async deleteCampaignSchedule(
    campaignId: string | number,
    scheduleId: string | number
  ): Promise<void> {
    await api.delete(`/campaigns/${campaignId}/schedules/${scheduleId}`);
  },

  /**
   * Mengambil jadwal relawan untuk kampanye yang pendaftarannya berstatus 'accepted'
   * Endpoint: GET /api/my-volunteer-schedules
   */
  async getMyVolunteerSchedules(): Promise<CampaignSchedule[]> {
    const response = await api.get('/my-volunteer-schedules');
    return response.data?.data || [];
  },
};

export default campaignService;
