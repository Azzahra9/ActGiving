import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  ArrowRight, 
  FileText,
  ShieldCheck,
  Sparkles,
  Heart,
  Coins
} from 'lucide-react';
import { Campaign, LpjItem } from '../types';
import { formatRupiah } from '../utils/format';
import { campaignService } from '../services/campaignService';
import { LpjModal } from './LpjModal';

export interface HeroSectionProps {
  campaigns?: Campaign[];
  onViewLpj?: (campaign: Campaign) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
  selectedMode?: string;
  setSelectedMode?: (mode: string) => void;
  onResetFilters?: () => void;
  activeFilterCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  campaigns: propCampaigns,
  onViewLpj,
}) => {
  const [internalCampaigns, setInternalCampaigns] = useState<Campaign[]>([]);
  const [localModalCampaign, setLocalModalCampaign] = useState<Campaign | null>(null);

  // Jika props.campaigns tidak disediakan dari parent, panggil langsung dari REST API
  useEffect(() => {
    if (propCampaigns === undefined) {
      campaignService
        .getCampaigns()
        .then((data) => {
          if (Array.isArray(data)) {
            setInternalCampaigns(data);
          }
        })
        .catch((err) => {
          console.warn('Gagal memuat kampanye di HeroSection:', err);
        });
    }
  }, [propCampaigns]);

  const activeCampaigns = propCampaigns ?? internalCampaigns;

  // 1. Ekstrak data LPJ yang berstatus 'sah' atau 'verified', lalu urutkan berdasarkan tanggal terbaru
  const verifiedLpjs = useMemo(() => {
    const list: {
      lpj: LpjItem;
      campaign: Campaign;
      timestamp: number;
    }[] = [];

    (activeCampaigns || [])
      .filter((camp) => camp && (camp.status === 'active' || camp.status === 'closed' || camp.status === 'completed' || !camp.status))
      .forEach((campaign) => {
        const rawReports = Array.isArray(campaign.lpjReports)
          ? campaign.lpjReports
          : (Array.isArray((campaign as any).lpj_reports) ? (campaign as any).lpj_reports : []);

        rawReports.forEach((lpj: any) => {
          if (!lpj) return;
          const status = lpj.status;
          if (status === 'verified' || status === 'sah') {
            const rawDate =
              lpj.verified_at ||
              (lpj as any).verifiedAt ||
              lpj.report_date ||
              (lpj as any).reportDate ||
              lpj.createdAt ||
              (lpj as any).created_at ||
              lpj.date ||
              (lpj as any).tanggal_kegiatan;

            let timestamp = 0;
            if (rawDate) {
              const parsed = new Date(rawDate).getTime();
              if (!isNaN(parsed)) {
                timestamp = parsed;
              }
            }
            if (!timestamp) {
              const numId = Number(lpj.id);
              if (!isNaN(numId)) timestamp = numId;
            }

            list.push({
              lpj,
              campaign,
              timestamp,
            });
          }
        });
      });

    // Urutkan dari tanggal rilis/verifikasi terbaru
    list.sort((a, b) => b.timestamp - a.timestamp);
    return list;
  }, [activeCampaigns]);

  // Ekstrak 1 data LPJ terverifikasi paling terbaru (index 0)
  const latestEntry = verifiedLpjs[0] || null;
  const latestLpj = latestEntry?.lpj;
  const latestCampaign = latestEntry?.campaign;

  // 2. Data Binding:
  // a. Foto: foto pertama dari activity_photos, fallback ke photoUrl atau imageUrl kampanye
  const rawPhotos = latestLpj
    ? [
        ...(Array.isArray((latestLpj as any).activity_photos) ? (latestLpj as any).activity_photos : []),
        ...(Array.isArray(latestLpj.activityPhotos) ? latestLpj.activityPhotos : []),
        ...(Array.isArray((latestLpj as any).photos) ? (latestLpj as any).photos : []),
        latestLpj.photoUrl,
        (latestLpj as any).photo_url,
        latestLpj.receiptUrl,
        (latestLpj as any).proof_image_url,
      ].filter(Boolean)
    : [];

  const displayPhoto =
    rawPhotos[0] ||
    latestCampaign?.imageUrl ||
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';

  // b. Judul kegiatan atau judul kampanye terkait
  const displayTitle =
    (latestLpj as any)?.judul_kegiatan ||
    latestLpj?.title ||
    latestCampaign?.title ||
    'Penyaluran Bantuan Lapangan';

  // c. Lokasi aksi atau lokasi kampanye
  const displayLocation =
    (latestLpj as any)?.lokasi_aksi ||
    latestLpj?.fieldLocation ||
    (latestLpj as any)?.field_location ||
    (latestLpj as any)?.location ||
    latestCampaign?.locationCity ||
    'Posko Aksi Lapangan';

  // d. Tanggal rilis LPJ
  const rawDate =
    latestLpj?.date ||
    latestLpj?.createdAt ||
    (latestLpj as any)?.created_at ||
    (latestLpj as any)?.report_date ||
    (latestLpj as any)?.tanggal_kegiatan ||
    (latestLpj as any)?.verified_at;

  let displayDate = 'Terbaru';
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        displayDate = d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } else {
        displayDate = String(rawDate);
      }
    } catch {
      displayDate = String(rawDate);
    }
  }

  // e. Angka Realisasi Dinamis: total_realisasi, relawan_terlibat, penerima_manfaat
  const totalRealisasi = Number(
    (latestLpj as any)?.total_realisasi ??
    latestLpj?.realizedAmount ??
    (latestLpj as any)?.amount_spent ??
    (latestLpj as any)?.realized_amount ??
    0
  );

  const relawanTerlibat = Number(
    (latestLpj as any)?.relawan_terlibat ??
    latestLpj?.volunteersInvolved ??
    (latestLpj as any)?.volunteers_involved ??
    latestCampaign?.filledVolunteers ??
    0
  );

  const penerimaManfaat = Number(
    (latestLpj as any)?.penerima_manfaat ??
    latestLpj?.beneficiariesCount ??
    (latestLpj as any)?.beneficiaries_count ??
    0
  );

  // 3. Interaktivitas Tombol: buka LpjModal
  const handleOpenLpjModal = () => {
    if (!latestCampaign) return;
    if (onViewLpj) {
      onViewLpj(latestCampaign);
    } else {
      setLocalModalCampaign(latestCampaign);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-14 lg:pt-16 lg:pb-18 bg-gradient-to-b from-blue-50/50 via-white to-surface-bg border-b border-slate-200/80">
      {/* Background Subtle Shapes & Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-radial from-blue-200/30 via-sky-100/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* ========================================================= */}
        {/* HERO TWO-COLUMN: LEFT HEADLINE & RIGHT OVERLAPPING CARDS   */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: HEADLINE, DESCRIPTION & TRUST STATS */}
          <div className="lg:col-span-7 text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-brand-blue text-xs font-semibold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
              <span>Guest Checkout Tanpa Login • Transparansi Form LPJ Real-Time</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] font-sans">
              Kebaikan Nyata, <span className="text-brand-blue">Tercatat Terbuka</span> Hingga Titik Lapangan.
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Salurkan bantuan donasi secara instan menggunakan QRIS & Virtual Account tanpa hambatan login. Pantau foto kegiatan dan laporan pertanggungjawaban digital langsung yang diisi oleh inisiator terverifikasi.
            </p>

            {/* Dual Action CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#katalog-aksi"
                className="px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-blue/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Pilih Aksi Kebaikan</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#galeri-kegiatan"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-300 shadow-xs transition-all flex items-center gap-2"
              >
                <span>Lihat Foto Kegiatan Lapangan</span>
              </a>
            </div>

            {/* 3 Trust Metric Indicators */}
            <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                  100%
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Bebas Biaya Admin
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                  QRIS & VA
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Verifikasi Otomatis
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                  Live Foto
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Dokumentasi Riil
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: OVERLAPPING CARDS */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            
            {/* Background Decorative Offset Card (layered depth) */}
            <div 
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-full max-w-md h-full rounded-3xl bg-gradient-to-br from-brand-blue/20 via-sky-400/10 to-transparent border border-blue-200/50 transform rotate-2 pointer-events-none hidden sm:block"
              aria-hidden="true"
            />

            {latestEntry && latestCampaign ? (
              /* Main Foreground Card: Penyaluran Terverifikasi Terkini Dinamis */
              <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 transition-transform duration-300 hover:-translate-y-1">
                
                {/* Card Header Pill & Timestamp */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-brand-blue border border-blue-200/60 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                    Penyaluran Terverifikasi Terkini
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[45%] text-right" title={displayDate}>
                    {displayDate}
                  </span>
                </div>

                {/* Photo Container with Location Pin */}
                <div 
                  onClick={handleOpenLpjModal}
                  className="relative h-48 sm:h-52 rounded-xl overflow-hidden bg-slate-100 group cursor-pointer"
                  title="Klik untuk melihat bukti foto & kuitansi LPJ digital"
                >
                  <img
                    src={displayPhoto}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-darkest/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Location Overlay Pin on Photo */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-darkest/80 backdrop-blur-xs text-white text-[11px] font-medium border border-white/10 shadow-xs max-w-[90%]">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{displayLocation}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="mt-3.5">
                  <h3 
                    onClick={handleOpenLpjModal}
                    className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-brand-blue cursor-pointer transition-colors"
                    title={displayTitle}
                  >
                    {displayTitle}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Realisasi LPJ senilai <strong className="text-slate-900">{formatRupiah(totalRealisasi)}</strong>
                    {relawanTerlibat > 0 && penerimaManfaat > 0 ? (
                      <>
                        {' '}didistribusikan langsung oleh <strong className="text-slate-800">{relawanTerlibat} relawan</strong> untuk{' '}
                        <strong className="text-slate-800">{penerimaManfaat} warga</strong> terdampak.
                      </>
                    ) : relawanTerlibat > 0 ? (
                      <>
                        {' '}didistribusikan langsung oleh <strong className="text-slate-800">{relawanTerlibat} relawan</strong> di lapangan.
                      </>
                    ) : penerimaManfaat > 0 ? (
                      <>
                        {' '}disalurkan untuk <strong className="text-slate-800">{penerimaManfaat} warga</strong> penerima manfaat.
                      </>
                    ) : (
                      <> disalurkan secara transparan dan akuntabel di lokasi posko.</>
                    )}
                  </p>

                  {/* Proof Link Action */}
                  <button
                    type="button"
                    onClick={handleOpenLpjModal}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 text-brand-blue text-xs font-semibold border border-slate-200/80 hover:border-blue-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat Bukti Foto & Kuitansi LPJ Digital</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Empty State Placeholder: Mengundang Donatur untuk Berdonasi */
              <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 transition-transform duration-300 hover:-translate-y-1">
                {/* Card Header Pill & Timestamp */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Kawal Penyaluran Pertama
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    100% Transparan
                  </span>
                </div>

                {/* Photo / Graphic Container */}
                <div className="relative h-48 sm:h-52 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-700 p-6 flex flex-col items-center justify-center text-center shadow-inner group">
                  <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3 shadow-inner">
                      <Heart className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <h4 className="font-bold text-base sm:text-lg text-white leading-tight">
                      Mulai Aksi Kebaikan
                    </h4>
                    <p className="text-xs text-blue-100 mt-1 max-w-xs leading-relaxed">
                      Salurkan donasi Anda sekarang untuk menggerakkan penyaluran bantuan langsung ke posko kemanusiaan.
                    </p>
                  </div>

                  {/* Location Overlay Pin on Photo */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-darkest/80 backdrop-blur-xs text-white text-[11px] font-medium border border-white/10 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Seluruh Posko Lapangan Indonesia</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="mt-3.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    Jadilah Bagian dari Jejak Kebaikan Ini
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Setiap bantuan yang disalurkan akan dilaporkan secara akuntabel dan transparan melalui linimasa LPJ digital terbuka.
                  </p>

                  {/* Action Link to Catalog */}
                  <a
                    href="#katalog-aksi"
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md shadow-brand-blue/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Donasi Sekarang & Mulai Penyaluran</span>
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Modal Fallback jika HeroSection digunakan secara independen tanpa onViewLpj prop */}
      {localModalCampaign && (
        <LpjModal
          campaign={localModalCampaign}
          isOpen={!!localModalCampaign}
          onClose={() => setLocalModalCampaign(null)}
        />
      )}
    </section>
  );
};