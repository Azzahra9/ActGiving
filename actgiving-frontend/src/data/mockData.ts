import { Campaign, UserProfile } from '../types';

/**
 * Seluruh data dummy telah dibersihkan secara total.
 * ActGiving beroperasi 100% menggunakan data riil yang di-fetch dari Laravel REST API backend.
 */
export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const DEMO_USERS: Record<string, UserProfile> = {};

export const INITIAL_STATS = {
  totalDonationRp: 0,
  totalVolunteers: 0,
  completedPrograms: 0,
};
