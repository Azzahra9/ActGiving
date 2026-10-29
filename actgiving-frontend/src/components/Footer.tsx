import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Send,
  Sparkles,
  Heart,
  FileText,
  Lock,
  HelpCircle,
  FileCheck,
  X,
  Instagram,
  Linkedin,
  Github,
  Twitter,
  Youtube,
  AlertCircle
} from 'lucide-react';
import { ActiveView } from '../types';

interface FooterProps {
  totalDonationRp?: number;
  totalVolunteers?: number;
  formatRupiah: (val: number) => string;
  onOpenCreateCampaign: () => void;
  onOpenAuth: () => void;
  onNavigateView?: (view: ActiveView) => void;
}

type LegalModalType = 'privacy' | 'terms' | 'faq' | null;

export const Footer: React.FC<FooterProps> = ({
  totalDonationRp,
  totalVolunteers = 0,
  formatRupiah,
  onOpenCreateCampaign,
  onOpenAuth,
  onNavigateView,
}) => {
  // Utility States
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  // Smooth scroll handler
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
    if (onNavigateView) {
      onNavigateView('public');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Newsletter Submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');

    if (!newsletterEmail || !newsletterEmail.includes('@') || !newsletterEmail.includes('.')) {
      setNewsletterError('Silakan masukkan format alamat email yang valid.');
      return;
    }

    setNewsletterSubmitted(true);
    setNewsletterEmail('');
    setTimeout(() => {
      setNewsletterSubmitted(false);
    }, 6000);
  };

  return (
    <footer id="transparansi-counter" className="bg-navy-darkest text-slate-400 mt-auto relative font-sans">

      {/* ========================================================= */}
      {/* 1. TOP PANEL: STATISTIK PENYALURAN & KETERLIBATAN PUBLIK */}
      {/* ========================================================= */}
      <div className="bg-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-brand-blue text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Akuntabilitas Terpadu</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
            Statistik Penyaluran & Keterlibatan Publik
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Setiap donasi dan partisipasi relawan tercatat secara otomatis dan diaudit terbuka.
          </p>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {/* Card 1: Total Donasi Terkumpul */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 text-center shadow-sm hover:border-brand-blue/50 transition-all group">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-sans tracking-tight group-hover:text-blue-600 transition-colors">
                {formatRupiah(totalDonationRp || 1485250000)}
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                Total Donasi Terkumpul
              </p>
            </div>

            {/* Card 2: Penerima Manfaat */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 text-center shadow-sm hover:border-brand-blue/50 transition-all group">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-sans tracking-tight group-hover:text-blue-600 transition-colors">
                2.840 Jiwa
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                Penerima Manfaat Lapangan
              </p>
            </div>

            {/* Card 3: Relawan */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 text-center shadow-sm hover:border-brand-blue/50 transition-all group">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-sans tracking-tight group-hover:text-blue-600 transition-colors">
                {totalVolunteers > 0 ? `${totalVolunteers} Relawan` : '3.842 Relawan'}
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                Aksi Aktif Sepanjang 2026
              </p>
            </div>

            {/* Card 4: LPJ Terbit & Terverifikasi */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 text-center shadow-sm hover:border-emerald-500/50 transition-all group">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-400 font-sans tracking-tight group-hover:scale-105 transition-transform">
                100%
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                <span>LPJ Terbit & Terverifikasi</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. NEWSLETTER SUBSCRIPTION BANNER (FITUR UTILITAS)        */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">

            <div className="max-w-xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-brand-blue text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Transparansi Tanpa Jeda</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Langganan Buletin & Laporan LPJ Mingguan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Dapatkan rekap bukti penyaluran donasi, foto kegiatan relawan di lapangan, dan audit terbuka langsung di email Anda.
              </p>
            </div>

            <div className="w-full lg:w-auto shrink-0">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-md">
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Masukkan alamat email Anda..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Langganan</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {newsletterError && (
                <p className="text-[11px] text-rose-400 mt-2 flex items-center gap-1 justify-center lg:justify-start">
                  <AlertCircle className="w-3 h-3" />
                  <span>{newsletterError}</span>
                </p>
              )}

              {newsletterSubmitted && (
                <div className="p-2.5 mt-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Terima kasih! Email Anda telah terdaftar untuk menerima laporan transparansi ActGiving.
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN FOOTER CONTENT (4 KOLOM LENGKAP & KONSISTEN)      */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* KOLOM 1: BRAND, ABOUT & KONTAK RESMI (Span 4) */}
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
                  Portal Donasi & LPJ Digital Terbuka
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed pr-2">
              Platform sistem informasi terpadu yang memadukan penggalangan donasi transparan, mobilisasi relawan lapangan, dan standar akuntabilitas 100% LPJ digital terbuka untuk seluruh masyarakat Indonesia.
            </p>

            {/* Informasi Alamat, Email, Telepon, & Jam Operasional */}
            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Gedung Menara Kemanusiaan Lt. 5, Jl. Jenderal Sudirman Kav. 49, Jakarta Selatan 12190, Indonesia
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:bantuan@actgiving.org" className="hover:text-white transition-colors">
                  bantuan@actgiving.org
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +62 812-3456-7890 (WhatsApp Customer Care)
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-400">
                  Senin â€“ Jumat: 08.00 â€“ 17.00 WIB (Layanan Darurat & Donasi Digital 24 Jam)
                </span>
              </div>
            </div>

            {/* Badges Keamanan & Transparansi */}
            <div className="pt-2 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-card border border-navy-border text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audit Terbuka 100%</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-card border border-navy-border text-[11px] text-slate-300">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Enkripsi SSL 256-Bit</span>
              </div>
            </div>
          </div>

          {/* KOLOM 2: QUICK LINKS & PROGRAM DONASI (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-sans">
              Eksplorasi & Program
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Beranda Utama</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Katalog Kampanye Terbuka</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('galeri-kegiatan')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Dokumentasi & LPJ Terhubung</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('tutorial-interaktif')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Panduan Donatur & Relawan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Tanggap Bencana & Kemanusiaan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Pendidikan & Beasiswa Anak</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Kesehatan & Bantuan Medis</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Konservasi Lingkungan Hidup</span>
                </button>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: PARTISIPASI & PERAN (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-sans">
              Partisipasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <button
                  onClick={onOpenCreateCampaign}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Buat Kampanye Baru</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog-aksi')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Daftar Relawan Aksi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Masuk / Buat Akun</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView && onNavigateView('relawan_dashboard')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Dashboard Relawan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView && onNavigateView('inisiator_dashboard')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Dashboard Inisiator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView && onNavigateView('admin_dashboard')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Portal Audit & Admin</span>
                </button>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: BANTUAN, LEGAL & KEBIJAKAN (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-sans">
              Bantuan & Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Kebijakan Privasi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Syarat & Ketentuan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('faq')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Pusat Bantuan & FAQ</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('transparansi-counter')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-400 hover:translate-x-1 duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span>Standar Audit LPJ Digital</span>
                </button>
              </li>
            </ul>

            {/* Standar Transparansi Card Mini */}
            <div className="bg-navy-card/90 p-3 rounded-xl border border-navy-border/80 text-xs space-y-1.5 mt-3">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Akuntabilitas Terverifikasi</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Setiap rupiah donasi dilengkapi invoice PDF otomatis dan bukti kuitansi pembelanjaan di lapangan.
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 4. UTILITY BAR: SOSIAL MEDIA, BAHASA, & MATA UANG         */}
        {/* ========================================================= */}
        <div className="mt-12 pt-8 border-t border-navy-border/70 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">
              Ikuti Kami:
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram ActGiving"
                className="w-8 h-8 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn ActGiving"
                className="w-8 h-8 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub ActGiving"
                className="w-8 h-8 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 hover:bg-white/10 transition-all cursor-pointer"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter X ActGiving"
                className="w-8 h-8 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube ActGiving"
                className="w-8 h-8 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Dukungan Kanal Pembayaran Resmi */}
        <div className="mt-8 pt-6 border-t border-navy-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-semibold text-slate-300">Dukungan Pembayaran Resmi:</span>
              <span className="text-slate-400">QRIS Instan â€¢ Bank Mandiri â€¢ BCA â€¢ BNI â€¢ BRI â€¢ GoPay â€¢ OVO â€¢ DANA</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Bebas Potongan Tersembunyi
              </span>
              <span>â€¢</span>
              <span className="inline-flex items-center gap-1 text-rose-400">
                <Heart className="w-3.5 h-3.5" />
                Amanah Untuk Kebaikan
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 6. MODAL TERPADU: PRIVACY POLICY, TERMS & FAQ             */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-navy-card border border-navy-border w-full max-w-2xl rounded-2xl p-6 sm:p-8 text-slate-200 max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-sidebar transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal: Kebijakan Privasi */}
            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-brand-blue">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Kebijakan Privasi ActGiving</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Terakhir diperbarui: 2026. Kepercayaan dan keamanan data donatur dan relawan adalah prioritas utama kami.
                </p>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-navy-border pt-3">
                  <div>
                    <h4 className="font-semibold text-white">1. Pengumpulan Informasi</h4>
                    <p className="text-slate-400 mt-0.5">
                      Kami mengumpulkan informasi yang Anda berikan saat berdonasi, mendaftar sebagai relawan, atau mengajukan kampanye (nama, email, nomor telepon/WhatsApp, dan kota domisili).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">2. Opsi Donasi Anonim (Hamba Allah)</h4>
                    <p className="text-slate-400 mt-0.5">
                      Donatur berhak memilih opsi "Donasi Anonim", di mana identitas donatur akan disembunyikan sepenuhnya dari publik dan hanya dicatat oleh sistem audit internal.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">3. Keamanan Data</h4>
                    <p className="text-slate-400 mt-0.5">
                      Seluruh transaksi keuangan dan komunikasi data dilindungi dengan standar enkripsi SSL 256-bit dan autentikasi token aman.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Syarat & Ketentuan */}
            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Syarat & Ketentuan Layanan</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Aturan penggunaan platform ActGiving bagi Donatur, Relawan, dan Inisiator Kampanye.
                </p>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-navy-border pt-3">
                  <div>
                    <h4 className="font-semibold text-white">1. Akuntabilitas Penggalangan Dana</h4>
                    <p className="text-slate-400 mt-0.5">
                      Inisiator wajib mengunggah Laporan Pertanggungjawaban (LPJ) beserta bukti struk/kuitansi digital paling lambat 14 hari kerja setelah pencairan dana donasi.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">2. Komitmen Relawan</h4>
                    <p className="text-slate-400 mt-0.5">
                      Relawan yang terdaftar berkomitmen hadir dan mengikuti kode etik kemanusiaan di lokasi kegiatan lapangan yang ditentukan.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">3. Penyaluran Dana Bertahap</h4>
                    <p className="text-slate-400 mt-0.5">
                      Pencairan dana dilakukan secara bertahap berbasis verifikasi milestone kegiatan lapangan oleh tim audit ActGiving.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Pusat Bantuan & FAQ */}
            {activeModal === 'faq' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Pusat Bantuan & FAQ</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Pertanyaan yang sering diajukan mengenai donasi, relawan, dan LPJ digital.
                </p>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-navy-border pt-3">
                  <div>
                    <h4 className="font-semibold text-white">Bagaimana cara mendapatkan bukti invoice donasi?</h4>
                    <p className="text-slate-400 mt-0.5">
                      Invoice digital dengan kode referensi unik diterbitkan langsung di layar setelah transaksi berhasil dan dikirimkan otomatis ke email Anda.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Apakah saya bisa berdonasi tanpa mendaftar akun?</h4>
                    <p className="text-slate-400 mt-0.5">
                      Bisa! ActGiving mendukung Guest Checkout instan sehingga donatur dapat berdonasi secara cepat tanpa proses pendaftaran yang rumit.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Bagaimana cara memeriksa laporan LPJ kegiatan?</h4>
                    <p className="text-slate-400 mt-0.5">
                      Klik pada kartu kampanye atau kunjungi seksi "Dokumentasi Foto & LPJ Terhubung" untuk melihat rincian belanja dan foto kegiatan lapangan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-navy-border flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-navy-sidebar hover:bg-slate-800 text-white text-xs font-semibold rounded-xl border border-navy-border transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
