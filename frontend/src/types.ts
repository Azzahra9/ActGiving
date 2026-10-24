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
  date: string;
  realizedAmount: number;
  description: string;
  photoUrl: string;
  activityPhotos?: string[];
  budgetItems?: LpjBudgetItem[];
  beneficiariesCount?: number;
  volunteersInvolved?: number;
  fieldLocation?: string;
  digitalRegNumber?: string;
  receiptUrl?: string;
  status?: 'pending' | 'verified' | 'sah' | 'rejected';
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

export interface Campaign {
  id: string;
  title: string;
  initiatorName: string;
  initiatorRole: string;
  category: Category;
  mode: CampaignMode;
  locationCity: string;
  distanceKm: number;
  imageUrl: string;
  description: string;
  status?: 'active' | 'pending_approval' | 'rejected' | 'completed' | 'closed';
  // Mode Dana
  targetFunds?: number;
  collectedFunds?: number;
  deadlineDays?: number;
  // Mode Relawan
  targetVolunteers?: number;
  filledVolunteers?: number;
  eventDate?: string;
  eventTime?: string;
  taskCriteria?: string[];
  // LPJ
  lpjReports?: LpjItem[];
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
