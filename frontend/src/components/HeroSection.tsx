import React from 'react';
import { 
  MapPin, 
  ArrowRight, 
  FileText
} from 'lucide-react';

interface HeroSectionProps {
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

export const HeroSection: React.FC<HeroSectionProps> = () => {
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

          {/* RIGHT COLUMN: OVERLAPPING CARDS (PIXEL-PERFECT FIGMA) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            
            {/* Background Decorative Offset Card (layered depth) */}
            <div 
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-full max-w-md h-full rounded-3xl bg-gradient-to-br from-brand-blue/20 via-sky-400/10 to-transparent border border-blue-200/50 transform rotate-2 pointer-events-none hidden sm:block"
              aria-hidden="true"
            />

            {/* Main Foreground Card */}
            <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 transition-transform duration-300 hover:-translate-y-1">
              
              {/* Card Header Pill & Timestamp */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-brand-blue border border-blue-200/60 uppercase tracking-wider">
                  Penyaluran Terverifikasi Terkini
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  14 April 2026
                </span>
              </div>

              {/* Photo Container with Location Pin */}
              <div className="relative h-48 sm:h-52 rounded-xl overflow-hidden bg-slate-100 group">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                  alt="Dokumentasi Penyaluran Bantuan Lapangan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-darkest/70 via-transparent to-transparent pointer-events-none" />
                
                {/* Location Overlay Pin on Photo */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-darkest/80 backdrop-blur-xs text-white text-[11px] font-medium border border-white/10 shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">Posko Darurat Gayo Lues, Aceh Tenggara</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="mt-3.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  Penyaluran 150 Karung Beras & Obat-obatan
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Realisasi LPJ senilai <strong className="text-slate-900">Rp 18.500.000</strong> didistribusikan langsung oleh 22 relawan untuk 420 warga terdampak.
                </p>

                {/* Proof Link Action */}
                <a
                  href="#galeri-kegiatan"
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 text-brand-blue text-xs font-semibold border border-slate-200/80 hover:border-blue-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lihat Bukti Foto & Kuitansi LPJ Digital</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
