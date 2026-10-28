import api from '../lib/axios';
import { Campaign, CampaignMode, Category, LpjItem } from '../types';

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
  return {
    id: String(lpj.id),
    title: lpj.title || 'Laporan Penggunaan Dana',
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
    createdAt: lpj.created_at || undefined,
    realizedAmount: Number(lpj.amount_spent || lpj.realized_amount || 0),
    description: lpj.description || '',
    photoUrl:
      lpj.receipt_image_url ||
      lpj.proof_image_url ||
      lpj.photo_url ||
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    activityPhotos: lpj.activity_photos || [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    ],
    budgetItems: lpj.budget_items || [],
    beneficiariesCount: lpj.beneficiaries_count || undefined,
    volunteersInvolved: lpj.volunteers_involved || undefined,
    fieldLocation: lpj.field_location || undefined,
    digitalRegNumber: lpj.digital_reg_number || undefined,
    receiptUrl: lpj.receipt_image_url || lpj.proof_image_url || undefined,
    status: (lpj.status as 'pending' | 'verified' | 'sah' | 'rejected') || 'pending',
    isFinal: Boolean(lpj.is_final || lpj.report_type === 'final'),
    reportType: (lpj.report_type as 'progress' | 'final') || (lpj.is_final ? 'final' : 'progress'),
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
    lpjReports: Array.isArray(item.lpj_reports) ? item.lpj_reports.map(mapBackendLpjToFrontend) : [],
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
};

export default campaignService;
