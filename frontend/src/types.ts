export type CampaignMode = 'dana' | 'relawan' | 'keduanya';

export type Category = 
  | 'Bencana Alam' 
  | 'Pendidikan' 
  | 'Lingkungan Hidup' 
  | 'Kesehatan' 
  | 'Panti Asuhan' 
  | 'Sosial & Kemanusiaan';

export interface LpjBudgetItem {
  name: string;
  amount: number;
}

export interface LpjItem {
  id: string;
  title: string;
  judul_kegiatan?: string;
  date: string;
  realizedAmount: number;
  total_realisasi?: number;
  description: string;
  photoUrl: string;
  activityPhotos?: string[];
  activity_photos?: string[];
  budgetItems?: LpjBudgetItem[];
  beneficiariesCount?: number;
  penerima_manfaat?: number;
  volunteersInvolved?: number;
  relawan_terlibat?: number;
  fieldLocation?: string;
  lokasi_aksi?: string;
  digitalRegNumber?: string;
  receiptUrl?: string;
  status?: 'pending' | 'pending_audit' | 'needs_review' | 'verified' | 'sah' | 'rejected';
  isFinal?: boolean;
  reportType?: 'progress' | 'final';
  createdAt?: string;
}

export type UserRole = 'guest' | 'relawan' | 'inisiator' | 'admin';

export type ActiveView = 'public' | 'relawan_dashboard' | 'inisiator_dashboard' | 'admin_dashboard';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  avatarUrl?: string;
  joinedCampaignIds?: string[]; // IDs of campaigns applied to as volunteer
  managedCampaignIds?: string[]; // IDs of campaigns created/managed as initiator
}

export const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Tamu / Donatur',
  email: '',
  role: 'guest',
  city: 'Indonesia',
  joinedCampaignIds: [],
  managedCampaignIds: [],
};

export interface DisbursementRecord {
  id: number | string;
  campaign_id: number | string;
  user_id?: number | string;
  amount: number | string;
  bank_name: string;
  account_number: string;
  bank_account?: string;
  account_name: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
  campaign?: {
    id: number | string;
    title: string;
    target_amount?: number;
    current_amount?: number;
    user?: {
      id?: number | string;
      name: string;
      email: string;
    };
  };
  user?: {
    id: number | string;
    name: string;
    email: string;
    phone_whatsapp?: string;
    city_domicile?: string;
  };
}

export interface CampaignSchedule {
  id: number | string;
  campaign_id: number | string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  title: string;
  description_tasks?: string;
  created_at?: string;
  updated_at?: string;
  campaign?: any;
}

export interface Campaign {
  id: string;
  title: string;
  initiatorName: string;
  initiatorRole?: string;
  category: Category;
  mode?: CampaignMode;
  campaignMode?: string;
  locationCity: string;
  distanceKm?: number;
  imageUrl: string;
  description: string;
  initiatorAvatar?: string;
  status?: 'active' | 'pending' | 'pending_approval' | 'rejected' | 'completed' | 'closed' | 'suspended';
  // Mode Dana
  targetFunds?: number;
  collectedFunds?: number;
  deadlineDays?: number;
  daysLeft?: number;
  startDate?: string;
  // Mode Relawan
  targetVolunteers?: number;
  filledVolunteers?: number;
  eventDate?: string;
  eventTime?: string;
  taskCriteria?: string[];
  // LPJ
  lpjReports?: LpjItem[];
  // Jadwal & Misi Harian
  schedules?: CampaignSchedule[];
  // Pencairan Dana (Disbursements)
  disbursements?: DisbursementRecord[];
}

export interface DonationFormState {
  campaignId: string;
  amount: number;
  customAmount: string;
  isAnonymous: boolean;
  donorName: string;
  donorEmail: string;
  paymentChannel: 'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'VA_BRI' | 'VA_BNI';
}

export interface DigitalInvoice {
  referenceCode: string;
  campaignTitle: string;
  amount: number;
  paymentChannel: string;
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  status: 'PAID' | 'EXPIRED';
  paidAt: string;
  vaNumber?: string;
}

export interface CampaignReportRecord {
  id: number | string;
  campaign_id: number | string;
  user_id?: number | string | null;
  reporter_name: string;
  reporter_email: string;
  category: string;
  reason_category?: string;
  description: string;
  evidence_path?: string | null;
  evidence_url?: string | null;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  created_at?: string;
  updated_at?: string;
  campaign?: {
    id: number | string;
    title: string;
    user_id?: number | string;
    status?: string;
    location?: string;
    image_url?: string;
    user?: {
      id?: number | string;
      name: string;
      email: string;
    };
  };
  user?: {
    id: number | string;
    name: string;
    email: string;
  } | null;
}
