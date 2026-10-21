import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, FileCode, Download, Users, ShieldCheck, HeartHandshake, Compass, CheckCircle2, LayoutTemplate, Palette, Layers } from 'lucide-react';

export type DesignMode = 'hifi' | 'wireframe';
export type RoleTab = 'donatur' | 'relawan' | 'inisiator' | 'admin' | 'master';

interface StandaloneHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: DesignMode;
}

interface RoleHtmlConfig {
  id: RoleTab;
  title: string;
  badge: string;
  filename: string;
  url: string;
  description: string;
  highlights: string[];
  icon: React.ReactNode;
}

const HIFI_CONFIGS: Record<RoleTab, RoleHtmlConfig> = {
  donatur: {
    id: 'donatur',
    title: 'Donatur & Guest (Landing Page)',
    badge: 'Desain Baru Modern Blue (Hi-Fi)',
    filename: 'actgiving_donatur_guest.html',
    url: '/actgiving_donatur_guest.html',
    description: 'Halaman depan publik ActGiving bersih tanpa sidebar. Dilengkapi katalog donasi, mode aksi (Dana & Relawan), simulasi Guest Checkout QRIS/Virtual Account, dan Galeri Foto Kegiatan yang terhubung langsung ke LPJ Digital.',
    highlights: [
      'Bersih tanpa sidebar di landing page publik',
      'Guest Checkout donasi instan tanpa login',
      'Galeri Foto Kegiatan Lapangan terhubung LPJ',
      'Modal transparansi laporan pertanggungjawaban',
      'Live counter akuntabilitas terverifikasi'
    ],
    icon: <Compass className="w-4 h-4 text-blue-600" />
  },
  relawan: {
    id: 'relawan',
    title: 'Relawan (Volunteer Workspace)',
    badge: 'Sidebar + 4 Menu Memanjang (Hi-Fi)',
    filename: 'actgiving_relawan.html',
    url: '/actgiving_relawan.html',
    description: 'Portal mandiri khusus Relawan dengan Sidebar Navigasi Penuh (kiri) dan seluruh 4 menu (Jadwal Lapangan + Barcode QR Presensi, Riwayat & E-Sertifikat, Cari Misi Baru, dan Keahlian/Profil) disusun memanjang ke bawah siap convert ke Figma.',
    highlights: [
      'Dilengkapi Left Sidebar navigasi lengkap persis AI Studio',
      'Seluruh 4 menu tampil memanjang (tidak ada tab tersembunyi)',
      'Jadwal penugasan lapangan & barcode presensi GPS',
      'Koleksi E-Sertifikat pengabdian dengan jam kontribusi sah',
      'Desain modern blue & profil relawan terverifikasi'
    ],
    icon: <Users className="w-4 h-4 text-sky-600" />
  },
  inisiator: {
    id: 'inisiator',
    title: 'Inisiator (LPJ Digital Web & Galang Aksi)',
    badge: 'Sidebar + Form LPJ Web Memanjang (Hi-Fi)',
    filename: 'actgiving_inisiator.html',
    url: '/actgiving_inisiator.html',
    description: 'Portal inisiator terverifikasi dengan Sidebar Navigasi Penuh (kiri) dan seluruh 4 menu memanjang ke bawah. Memuat fitur utama Formulir LPJ Digital Langsung di Web (tanpa berkas kertas), pos belanja dinamis, dan sinkronisasi foto dokumentasi kegiatan.',
    highlights: [
      'Dilengkapi Left Sidebar navigasi lengkap persis AI Studio',
      'Seluruh 4 menu tampil memanjang siap import Figma',
      'Formulir LPJ Digital Langsung di Web (Tanpa Upload Dokumen)',
      'Tabel pos belanja anggaran dinamis (tambah & hapus)',
      'Seleksi pendaftar relawan & arsip LPJ sah'
    ],
    icon: <HeartHandshake className="w-4 h-4 text-blue-600" />
  },
  admin: {
    id: 'admin',
    title: 'Admin & Auditor (Konsol Pengawasan)',
    badge: 'Sidebar + 4 Menu Memanjang (Hi-Fi)',
    filename: 'actgiving_admin.html',
    url: '/actgiving_admin.html',
    description: 'Konsol administrasi ActGiving dengan Sidebar Navigasi Penuh (kiri) dan seluruh 4 menu memanjang ke bawah (Moderasi Kampanye Baru, Audit Formulir LPJ Web, Rekonsiliasi Real-Time QRIS & VA, dan Konfigurasi Parameter Sistem).',
    highlights: [
      'Dilengkapi Left Sidebar navigasi lengkap persis AI Studio',
      'Seluruh 4 menu pengawasan disusun memanjang ke bawah',
      'Moderasi & persetujuan permohonan kampanye baru',
      'Audit formulir LPJ digital web & foto lapangan',
      'Log mutasi real-time gateway QRIS & Virtual Account'
    ],
    icon: <ShieldCheck className="w-4 h-4 text-slate-800" />
  },
  master: {
    id: 'master',
    title: 'Semua Role (Master Standalone Suite)',
    badge: '4 Role Terintegrasi (Hi-Fi)',
    filename: 'actgiving_standalone.html',
    url: '/actgiving_standalone.html',
    description: 'Satu berkas HTML tunggal yang menyatukan seluruh tampilan: Landing Page Donatur/Guest (tanpa sidebar), Dashboard Relawan (dengan Sidebar), Workspace Inisiator (dengan Sidebar & LPJ Form), dan Konsol Admin (dengan Sidebar) dengan navigasi switcher instan di bagian atas.',
    highlights: [
      'Menggabungkan seluruh 4 role dalam 1 berkas HTML mandiri',
      'Sidebar muncul otomatis saat berpindah ke Relawan/Inisiator/Admin',
      'Landing page tetap bersih tanpa sidebar sesuai preferensi',
      'Form LPJ Digital Web & Galeri Foto tersinkronisasi',
      'Siap dibuka di browser apapun atau di-import ke Figma'
    ],
    icon: <FileCode className="w-4 h-4 text-indigo-600" />
  }
};

const WIREFRAME_CONFIGS: Record<RoleTab, RoleHtmlConfig> = {
  donatur: {
    id: 'donatur',
    title: 'Wireframe Donatur & Guest (Landing Page)',
    badge: 'Sketsa Kasar Lo-Fi (Tanpa Sidebar)',
    filename: 'actgiving_wireframe_donatur.html',
    url: '/actgiving_wireframe_donatur.html',
    description: 'Sketsa kasar / Low-Fidelity Wireframe (Blueprint UI) untuk Donatur & Guest Landing Page ActGiving. Bersih tanpa sidebar, layout monokrom dengan placeholder gambar diagonal silang (X), penanda komponen [INPUT], [BUTTON], [BADGE], dan struktur hierarkis siap import ke Figma.',
    highlights: [
      'Monokrom Grayscale & Blueprint UI',
      'Placeholder Gambar Diagonal Silang (X)',
      'Layout Bersih Tanpa Sidebar di Landing Page',
      'Penanda Komponen Wireframe [INPUT], [BUTTON], [BADGE]',
      'Siap di-import ke Figma via html.to.design'
    ],
    icon: <Compass className="w-4 h-4 text-slate-700" />
  },
  relawan: {
    id: 'relawan',
    title: 'Wireframe Relawan (Sidebar + 4 Menu Memanjang)',
    badge: 'Sketsa Kasar Lo-Fi (Full Extended View)',
    filename: 'actgiving_wireframe_relawan.html',
    url: '/actgiving_wireframe_relawan.html',
    description: 'Sketsa kasar / Low-Fidelity Wireframe Dashboard Relawan dengan Left Sidebar 280px dan seluruh 4 Menu (Jadwal Lapangan + Barcode QR Presensi, Riwayat & E-Sertifikat, Cari Misi Baru, dan Keahlian/Profil) ditampilkan memanjang ke bawah tanpa tab tersembunyi.',
    highlights: [
      'Left Sidebar Wireframe lengkap (280px)',
      'Seluruh 4 menu tampil memanjang (Figma Ready)',
      'Placeholder Barcode QR Presensi Lapangan',
      'Placeholder E-Sertifikat dengan stempel sah',
      'Sketsa form biodata & tag spesialisasi'
    ],
    icon: <Users className="w-4 h-4 text-slate-700" />
  },
  inisiator: {
    id: 'inisiator',
    title: 'Wireframe Inisiator (Sidebar + LPJ Web Memanjang)',
    badge: 'Sketsa Kasar Lo-Fi (Fitur Form LPJ Web)',
    filename: 'actgiving_wireframe_inisiator.html',
    url: '/actgiving_wireframe_inisiator.html',
    description: 'Sketsa kasar / Low-Fidelity Wireframe Workspace Inisiator dengan Left Sidebar dan 4 Menu memanjang ke bawah. Menampilkan mockup wireframe Formulir LPJ Digital Langsung di Web (tabel dinamis pos anggaran, kalkulasi total otomatis, dan sinkronisasi foto dokumentasi tanpa kertas).',
    highlights: [
      'Left Sidebar Wireframe lengkap (280px)',
      'Formulir LPJ Digital Langsung di Web (No Kertas)',
      'Tabel Wireframe Pos Belanja Anggaran Dinamis',
      'Placeholder Foto Dokumentasi Tersinkron',
      'Wireframe Seleksi Calon Relawan Masuk'
    ],
    icon: <HeartHandshake className="w-4 h-4 text-slate-700" />
  },
  admin: {
    id: 'admin',
    title: 'Wireframe Admin & Auditor (Sidebar + 4 Menu Memanjang)',
    badge: 'Sketsa Kasar Lo-Fi (Audit & Moderasi)',
    filename: 'actgiving_wireframe_admin.html',
    url: '/actgiving_wireframe_admin.html',
    description: 'Sketsa kasar / Low-Fidelity Wireframe Konsol Pengawasan Admin & Auditor dengan Left Sidebar dan 4 Menu memanjang (Moderasi Kampanye Baru, Audit Formulir LPJ Web, Rekonsiliasi Real-Time QRIS/VA, dan Konfigurasi Parameter Sistem).',
    highlights: [
      'Left Sidebar Wireframe pengawasan otoritas',
      'Seluruh 4 menu audit memanjang ke bawah',
      'Wireframe kartu review persetujuan kampanye',
      'Tabel mutasi real-time settlement QRIS & VA',
      'Parameter formulir konfigurasi gateway'
    ],
    icon: <ShieldCheck className="w-4 h-4 text-slate-700" />
  },
  master: {
    id: 'master',
    title: 'Master Wireframe Suite (Semua Role Memanjang)',
    badge: 'Sketsa Kasar Terpadu (4 Role)',
    filename: 'actgiving_wireframe_master.html',
    url: '/actgiving_wireframe_master.html',
    description: 'Koleksi lengkap sketsa kasar / Lo-Fi Wireframe yang menggabungkan seluruh aktor sistem (Donatur, Relawan, Inisiator, Admin) dalam satu switcher terpadu. Sangat ideal untuk presentasi proposal, bab SRS, dan master library wireframe di Figma.',
    highlights: [
      'Menyatukan 4 role wireframe dalam 1 file',
      'Switcher instan di header atas',
      'Format Lo-Fi blueprint grayscale standar industri',
      'Cocok untuk lampiran SRS, proposal, & skripsi',
      '100% responsif & siap dibuka offline'
    ],
    icon: <FileCode className="w-4 h-4 text-slate-700" />
  }
};

export const StandaloneHtmlModal: React.FC<StandaloneHtmlModalProps> = ({ 
  isOpen, 
  onClose,
  initialMode = 'hifi'
}) => {
  const [designMode, setDesignMode] = useState<DesignMode>(initialMode);
  const [activeTab, setActiveTab] = useState<RoleTab>('donatur');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [loadingCode, setLoadingCode] = useState<boolean>(false);

  // Sync initialMode when modal opens
  useEffect(() => {
    if (isOpen && initialMode) {
      setDesignMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const currentConfigs = designMode === 'hifi' ? HIFI_CONFIGS : WIREFRAME_CONFIGS;
  const currentConfig = currentConfigs[activeTab];

  // Fetch the active role's HTML content whenever tab, mode, or modal state changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoadingCode(true);

    fetch(currentConfig.url)
      .then((res) => res.text())
      .then((text) => {
        if (isMounted) {
          setHtmlCode(text);
          setLoadingCode(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setHtmlCode(`<!-- Gagal memuat berkas ${currentConfig.filename}: ${err.message} -->`);
          setLoadingCode(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, designMode, activeTab, currentConfig.url, currentConfig.filename]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (htmlCode) {
        await navigator.clipboard.writeText(htmlCode);
      } else {
        const response = await fetch(currentConfig.url);
        const text = await response.text();
        await navigator.clipboard.writeText(text);
      }
      const copyKey = `${designMode}-${activeTab}`;
      setCopiedKey(copyKey);
      setTimeout(() => setCopiedKey(null), 3000);
    } catch {
      alert('Gagal menyalin otomatis. Anda dapat menekan tombol Unduh atau membuka tab baru.');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentConfig.url;
    link.download = currentConfig.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCurrentCopied = copiedKey === `${designMode}-${activeTab}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
              designMode === 'wireframe' ? 'bg-slate-800 text-amber-400' : 'bg-blue-100 text-blue-700'
            }`}>
              {designMode === 'wireframe' ? <LayoutTemplate className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">
                  Salin Kode HTML Mandiri (Siap Figma & Browser)
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  designMode === 'wireframe' 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {designMode === 'wireframe' ? '📐 Sketsa Kasar / Wireframe (Lo-Fi)' : '🎨 Desain Hi-Fi (Modern Blue)'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pilih antara <strong>Desain Penuh (Hi-Fi)</strong> atau <strong>Sketsa Kasar (Wireframe Lo-Fi)</strong> untuk setiap role.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRIMARY TOGGLE: DESAIN HI-FI VS SKETSA KASAR / WIREFRAME */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600 hidden sm:inline">Pilih Format Desain:</span>
            <div className="inline-flex p-1 bg-white rounded-xl border border-slate-300 shadow-2xs">
              <button
                onClick={() => setDesignMode('hifi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  designMode === 'hifi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>🎨 1. Desain Hi-Fi (Modern Blue)</span>
              </button>

              <button
                onClick={() => setDesignMode('wireframe')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  designMode === 'wireframe'
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>📐 2. Sketsa Kasar / Wireframe (Lo-Fi)</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Format Tailwind CDN • Standalone HTML</span>
          </div>
        </div>

        {/* Role Tabs Navigation */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200/70 bg-slate-50/50 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('donatur')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'donatur'
                ? (designMode === 'wireframe' ? 'bg-slate-900 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs')
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>1. Donatur / Guest</span>
          </button>

          <button
            onClick={() => setActiveTab('relawan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'relawan'
                ? (designMode === 'wireframe' ? 'bg-slate-900 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs')
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Relawan</span>
          </button>

          <button
            onClick={() => setActiveTab('inisiator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'inisiator'
                ? (designMode === 'wireframe' ? 'bg-slate-900 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs')
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>3. Inisiator (Form LPJ Web)</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'admin'
                ? (designMode === 'wireframe' ? 'bg-slate-900 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs')
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Admin & Auditor</span>
          </button>

          <button
            onClick={() => setActiveTab('master')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'master'
                ? 'bg-slate-950 text-white shadow-xs border border-slate-700'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCode className={`w-3.5 h-3.5 ${designMode === 'wireframe' ? 'text-amber-400' : 'text-blue-500'}`} />
            <span>5. Master Suite (Semua Role)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Active Tab Info Box */}
          <div className={`border rounded-2xl p-4 space-y-3 ${
            designMode === 'wireframe'
              ? 'bg-gradient-to-r from-slate-100 via-slate-50 to-amber-50/40 border-slate-300'
              : 'bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border-blue-200/80'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-xl border border-slate-300 shadow-2xs">
                  {currentConfig.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentConfig.title}</h4>
                  <span className={`text-[10px] font-bold tracking-wider ${
                    designMode === 'wireframe' ? 'text-slate-700' : 'text-blue-700'
                  }`}>
                    {currentConfig.filename} • {currentConfig.badge}
                  </span>
                </div>
              </div>

              {/* Action Buttons for this Role */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    designMode === 'wireframe'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isCurrentCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCurrentCopied ? 'Kode Tersalin!' : `Salin ${designMode === 'wireframe' ? 'Wireframe' : 'HTML'} ${currentConfig.id.toUpperCase()}`}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Unduh .html</span>
                </button>

                <a
                  href={currentConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 transition-colors flex items-center justify-center cursor-pointer"
                  title="Buka Pratinjau di Tab Baru"
                >
                  <ExternalLink className={`w-4 h-4 ${designMode === 'wireframe' ? 'text-slate-800' : 'text-blue-600'}`} />
                </a>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-[11px]">
              {currentConfig.description}
            </p>

            {/* Highlights Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-semibold">
                {designMode === 'wireframe' ? 'Karakteristik Wireframe:' : 'Fitur Utama:'}
              </span>
              {currentConfig.highlights.map((h, hIdx) => (
                <span
                  key={hIdx}
                  className="bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-slate-700 text-[10px] font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className={`w-3 h-3 shrink-0 ${designMode === 'wireframe' ? 'text-slate-700' : 'text-emerald-600'}`} />
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <FileCode className={`w-3.5 h-3.5 ${designMode === 'wireframe' ? 'text-amber-500' : 'text-blue-600'}`} />
                Tempat Kode: <code className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold">{currentConfig.filename}</code>
              </span>
              <span className="text-[10px]">
                {loadingCode ? 'Memuat kode...' : `${htmlCode.split('\n').length} baris kode siap disalin`}
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 font-mono text-[11px]">
              {/* Quick Copy Overlay in corner */}
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs transition-colors cursor-pointer border border-slate-700 shadow-md"
              >
                {isCurrentCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isCurrentCopied ? 'Tersalin!' : 'Salin Semua'}</span>
              </button>

              <div className="max-h-72 overflow-y-auto p-4 space-y-1 select-all">
                {loadingCode ? (
                  <div className="text-slate-400 py-8 text-center">Memuat berkas kode HTML...</div>
                ) : (
                  <pre className="whitespace-pre text-slate-300 leading-relaxed font-mono">
                    {htmlCode}
                  </pre>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Tersedia <strong>5 Berkas Desain Hi-Fi</strong> &amp; <strong>5 Berkas Sketsa Kasar / Wireframe</strong> siap pakai tanpa server.
          </div>
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
