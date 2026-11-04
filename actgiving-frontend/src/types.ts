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
