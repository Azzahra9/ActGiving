import React from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Compass,
  Users,
  FileText,
  Lock,
  ExternalLink,
  Sparkles,
  Heart,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { ActiveView } from '../types';

interface FooterProps {
  totalDonationRp?: number;
  totalVolunteers?: number;
  formatRupiah: (val: number) => string;
  onOpenCreateCampaign: () => void;
  onOpenAuth: () => void;
  onOpenSourceModal: () => void;
  onOpenWireframeModal: () => void;
  onNavigateView?: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({
  totalDonationRp,
  totalVolunteers = 0,
  formatRupiah,
  onOpenCreateCampaign,
  onOpenAuth,
  onOpenSourceModal,
  onOpenWireframeModal,
  onNavigateView,
}) => {
  const scrollTo = (elementId: string) => {
    if (onNavigateView) {
      onNavigateView('public');
    }
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="transparansi-counter" className="bg-navy-darkest text-slate-400 border-t border-navy-border mt-auto">
      {/* ========================================================= */}
      {/* 1. TOP PANEL: STATISTIK PENYALURAN & KETERLIBATAN PUBLIK */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-b from-navy-sidebar via-navy-darkest to-navy-darkest py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-navy-border/70">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-brand-blue text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Akuntabilitas Terpadu</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            Statistik Penyaluran & Keterlibatan Publik
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Setiap donasi dan partisipasi relawan tercatat secara otomatis dan diaudit terbuka.
          </p>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {/* Card 1: Total Donasi Terkumpul */}
            <div className="bg-navy-card/90 rounded-2xl p-6 sm:p-7 border border-navy-border/80 text-center shadow-sm hover:border-brand-blue/50 transition-all group">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-sans tracking-tight group-hover:text-blue-400 transition-colors">
                {totalDonationRp ? formatRupiah(totalDonationRp) : 'Rp 1.485.250.000'}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Total Donasi Terkumpul
              </p>
            </div>

            {/* Card 2: Penerima Manfaat */}
            <div className="bg-navy-card/90 rounded-2xl p-6 sm:p-7 border border-navy-border/80 text-center shadow-sm hover:border-brand-blue/50 transition-all group">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-sans tracking-tight group-hover:text-blue-400 transition-colors">
                2.840 Jiwa
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Penerima Manfaat Lapangan
              </p>
            </div>

            {/* Card 3: Relawan */}
            <div className="bg-navy-card/90 rounded-2xl p-6 sm:p-7 border border-navy-border/80 text-center shadow-sm hover:border-brand-blue/50 transition-all group">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-sans tracking-tight group-hover:text-blue-400 transition-colors">
                {totalVolunteers > 0 ? `${totalVolunteers} Relawan` : '3.842 Relawan'}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Aksi Aktif Sepanjang 2026
              </p>
            </div>

            {/* Card 4: LPJ Terbit & Terverifikasi */}
            <div className="bg-navy-card/90 rounded-2xl p-6 sm:p-7 border border-navy-border/80 text-center shadow-sm hover:border-emerald-500/50 transition-all group">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-400 font-sans tracking-tight group-hover:scale-105 transition-transform">
                100%
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                <span>LPJ Terbit & Terverifikasi</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN FOOTER BODY: INFORMASI LENGKAP PLATFORM           */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Kolom 1: Profil Brand & Misi (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-xl tracking-tight">
                  Act<span className="text-blue-400">Giving</span>
                </span>
                <span className="block text-[10px] text-blue-400/80 font-medium tracking-wide uppercase">
                  Portal Donasi & LPJ Terbuka
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed pr-2">
              Platform digital terpadu yang memadukan penghimpunan donasi transparan, verifikasi aksi relawan lapangan, dan pelaporan pertanggungjawaban digital (LPJ) yang dapat diaudit oleh publik secara langsung.
            </p>

            {/* Kontak & Alamat Layanan */}
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Gedung Kemanusiaan Digital, Jl. Kebajikan No. 49, Jakarta Selatan, Indonesia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:halo@actgiving.org" className="hover:text-white transition-colors">
                  halo@actgiving.org
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+6281234567890" className="hover:text-white transition-colors">
                  +62 812-3456-7890 (Layanan Donatur 24/7)
                </a>
              </div>
            </div>

            {/* Badge Akreditasi & Keamanan */}
            <div className="pt-3 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy-card border border-navy-border text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audit Terbuka 100%</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy-card border border-navy-border text-[11px] text-slate-300">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Enkripsi SSL 256-Bit</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Eksplorasi Program (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-sans">
              Eksplorasi Program
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Katalog Kampanye Terbuka</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('galeri-kegiatan')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Foto Kegiatan Lapangan & LPJ</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Bantuan Kemanusiaan & Bencana</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Beasiswa & Fasilitas Pendidikan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Bantuan Layanan Kesehatan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Pelestarian Lingkungan Hidup</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Partisipasi & Alur (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-sans">
              Partisipasi
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <button
                  onClick={() => scrollTo('tutorial-interaktif')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Panduan Donatur</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Daftar Relawan Aksi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCreateCampaign}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Buat Kampanye Baru</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('tutorial-interaktif')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Cara Kerja Platform</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Masuk / Akun Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Akuntabilitas & Transparansi (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-sans">
              Standar Transparansi
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ActGiving menerapkan standar pertanggungjawaban terintegrasi untuk menjamin donasi aman dan sampai ke tangan yang berhak.
            </p>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2 text-xs bg-navy-card/80 p-2.5 rounded-lg border border-navy-border/80">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">LPJ Digital Publik</span>
                  <span className="text-[11px] text-slate-400">Bukti struk, invoice, dan foto penyerahan diverifikasi admin.</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs bg-navy-card/80 p-2.5 rounded-lg border border-navy-border/80">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Penyaluran Bertahap</span>
                  <span className="text-[11px] text-slate-400">Pencairan dana berbasis milestone kegiatan terbukti.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Metode Pembayaran & Keamanan Saluran */}
        <div className="mt-12 pt-8 border-t border-navy-border/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Dukungan Pembayaran Resmi:</span>
              <span className="text-slate-400">QRIS Instan • Bank Mandiri • BCA • BNI • BRI • E-Wallet</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Bebas Biaya Admin Tersembunyi
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                100% Untuk Kebaikan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM BAR: BRAND, DOKUMENTASI & COPYRIGHT             */}
      {/* ========================================================= */}
      <div className="bg-navy-sidebar/80 border-t border-navy-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-slate-400">
              <span className="font-bold text-white">ActGiving</span>
              <span>© 2026. Hak Cipta Dilindungi Undang-Undang.</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-slate-500">Sistem Platform Donasi & Form LPJ Digital Terbuka.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[12px]">
              <button
                onClick={onOpenSourceModal}
                className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
              >
                Kode HTML Mandiri
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={onOpenWireframeModal}
                className="text-slate-400 hover:text-amber-400 transition-colors font-mono cursor-pointer"
              >
                Sketsa Wireframe
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1 px-2.5 py-1 rounded-md bg-navy-card/80 border border-navy-border hover:border-slate-500"
                title="Kembali ke atas halaman"
              >
                <span>Atas</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};
