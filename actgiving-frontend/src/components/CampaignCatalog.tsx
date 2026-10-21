import React, { useState, useEffect } from 'react';
import campaignService from '../services/campaignService';
import { Compass, RefreshCw, AlertCircle, Loader2, WifiOff } from 'lucide-react';
import { Campaign } from '../types';
import { CampaignCard } from './CampaignCard';

interface CampaignCatalogProps {
  campaigns: Campaign[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onDonateClick: (campaign: Campaign) => void;
  onVolunteerClick: (campaign: Campaign) => void;
  onViewLpjClick: (campaign: Campaign) => void;
  onResetFilters: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const CATEGORY_TABS = [
  { label: 'Semua', value: 'Semua Kategori' },
  { label: 'Kemanusiaan', value: 'Bencana Alam' },
  { label: 'Pendidikan', value: 'Pendidikan' },
  { label: 'Kesehatan', value: 'Kesehatan' },
  { label: 'Lingkungan', value: 'Lingkungan Hidup' }
];

export const CampaignCatalog: React.FC<CampaignCatalogProps> = ({
  campaigns,
  isLoading = false,
  error = null,
  onRetry,
  onDonateClick,
  onVolunteerClick,
  onViewLpjClick,
  onResetFilters,
  selectedCategory: propCategory,
  onSelectCategory
}) => {
  const [internalCategory, setInternalCategory] = useState('Semua Kategori');
  const [apiCategories, setApiCategories] = useState<{ id: number; category_name: string }[]>([]);

  useEffect(() => {
    campaignService.getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setApiCategories(data);
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat kategori dari backend:', err);
      });
  }, []);
  const currentCategory = propCategory !== undefined ? propCategory : internalCategory;

  const handleCategoryClick = (categoryValue: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryValue);
    } else {
      setInternalCategory(categoryValue);
    }
  };

  // Filter campaigns if managed internally
  const displayedCampaigns = propCategory !== undefined 
    ? campaigns 
    : (currentCategory === 'Semua Kategori' 
        ? campaigns 
        : campaigns.filter(c => c.category === currentCategory));

  return (
    <section id="katalog-aksi" className="py-14 sm:py-16 bg-surface-bg border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* SECTION HEADER: TITLE & CATEGORY FILTER TABS (FIGMA)      */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-brand-blue text-[10px] font-bold uppercase tracking-wider mb-2">
              <span>Katalog Terbuka</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
              Pilih Kampanye & Mulai Berbagi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dukung pendanaan atau ikuti aksi relawan langsung ke komunitas.
            </p>
          </div>

          {/* Category Filter Pills on Top-Right */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none self-start lg:self-auto">
            <button
              onClick={() => handleCategoryClick('Semua Kategori')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentCategory === 'Semua Kategori' || !currentCategory
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              Semua
            </button>
            {(apiCategories.length > 0 ? apiCategories : [
              { id: 1, category_name: 'Bencana Alam' },
              { id: 2, category_name: 'Pendidikan' },
              { id: 3, category_name: 'Kesehatan' },
              { id: 4, category_name: 'Lingkungan Hidup' },
              { id: 5, category_name: 'Sosial Kemanusiaan' }
            ]).map((cat) => {
              const isActive = currentCategory === cat.category_name;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.category_name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {cat.category_name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. SKELETON LOADING STATE                                 */}
        {/* ========================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-4 space-y-4">
                <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-slate-200 rounded-md w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-1/4"></div>
                  </div>
                </div>
                <div className="h-9 bg-slate-200 rounded-lg w-full pt-2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* ======================================================= */
          /* 2. ERROR STATE WITH RETRY                               */
          /* ======================================================= */
          <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-10 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <WifiOff className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-sans">
              Gagal Memuat Kampanye
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {error || 'Tidak dapat terhubung ke REST API Laravel (http://127.0.0.1:8000/api). Pastikan server backend Anda sedang aktif.'}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Muat Ulang</span>
              </button>
            )}
          </div>
        ) : displayedCampaigns.length === 0 ? (
          /* ======================================================= */
          /* 3. EMPTY STATE                                          */
          /* ======================================================= */
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-sans">
              Tidak Ada Kampanye yang Cocok
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Tidak ada kampanye aktif yang sesuai dengan kriteria filter saat ini.
            </p>
            <button
              onClick={() => {
                onResetFilters();
                if (onSelectCategory) onSelectCategory('Semua Kategori');
                else setInternalCategory('Semua Kategori');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-brand-blue text-white text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Reset Filter & Tampilkan Semua
            </button>
          </div>
        ) : (
          /* ======================================================= */
          /* 4. THREE-COLUMN CAMPAIGN CARDS GRID                     */
          /* ======================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onDonateClick={onDonateClick}
                onVolunteerClick={onVolunteerClick}
                onViewLpjClick={onViewLpjClick}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
