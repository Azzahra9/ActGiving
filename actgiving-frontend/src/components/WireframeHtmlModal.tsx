import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, FileCode, Download, Eye, Users, ShieldCheck, HeartHandshake, Compass, Layers, PenTool, CheckCircle2 } from 'lucide-react';

interface WireframeHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WfRoleTab = 'donatur' | 'relawan' | 'inisiator' | 'admin' | 'master';

interface WfRoleConfig {
  id: WfRoleTab;
  title: string;
  badge: string;
  filename: string;
  url: string;
  description: string;
  highlights: string[];
  icon: React.ReactNode;
}

const WF_ROLE_CONFIGS: Record<WfRoleTab, WfRoleConfig> = {
  donatur: {
    id: 'donatur',
    title: 'Donatur & Guest (Sketsa Kasar Landing Page)',
    badge: 'Wireframe Lo-Fi • Tanpa Sidebar',
    filename: 'actgiving_wireframe_donatur.html',
    url: '/actgiving_wireframe_donatur.html',
    description: 'Sketsa kasar / Low-Fidelity Wireframe landing page publik ActGiving. Tampilan monokrom tanpa warna dengan placeholder silang (X) untuk foto, penanda komponen ([NAV], [BUTTON], [INPUT]), katalog 3 program, galeri foto LPJ web, dan counter transparansi tanpa sidebar.',
    highlights: [
      'Monokrom hitam-putih / abu-abu (Zero Color Distraction)',
      'Placeholder gambar dengan garis silang diagonal khas sketsa (X)',
      'Bersih tanpa sidebar untuk halaman depan publik',
      'Struktur blok konten semantik: Hero, Filter, Katalog 3 Card, LPJ Web, Counter',
      'Siap di-import langsung ke Figma menjadi Wireframe Artboard'
    ],
    icon: <Compass className="w-4 h-4 text-slate-700" />
  },
  relawan: {
    id: 'relawan',
    title: 'Relawan (Sketsa Kasar Sidebar + 4 Menu Memanjang)',
    badge: 'Wireframe Lo-Fi • 4 Menu Extended',
    filename: 'actgiving_wireframe_relawan.html',
    url: '/actgiving_wireframe_relawan.html',
    description: 'Sketsa kasar Dashboard Relawan dengan Left Sidebar navigasi lengkap dan 4 menu berurutan memanjang ke bawah (Jadwal Lapangan + Barcode QR Presensi GPS, Riwayat 3 E-Sertifikat, Cari Misi Baru, dan Keahlian/Profil Relawan).',
    highlights: [
      'Left Sidebar navigasi wireframe dengan profile box & switch role',
      'Semua 4 menu disusun memanjang ke bawah tanpa tab tersembunyi',
      'Komponen Barcode QR presensi GPS lapangan',
      '3 kartu preview E-Sertifikat pengabdian berstempel digital',
      'Form keahlian relawan dan kontak darurat'
    ],
    icon: <Users className="w-4 h-4 text-slate-700" />
  },
  inisiator: {
    id: 'inisiator',
    title: 'Inisiator (Sketsa Kasar Form LPJ Web Memanjang)',
    badge: 'Wireframe Lo-Fi • Form LPJ Web Dinamis',
    filename: 'actgiving_wireframe_inisiator.html',
    url: '/actgiving_wireframe_inisiator.html',
    description: 'Sketsa kasar Workspace Inisiator dengan Left Sidebar dan 4 menu memanjang: Kampanye Aktif, Formulir LPJ Digital Langsung di Web (Tabel Pos Belanja Anggaran Dinamis tanpa berkas fisik), Seleksi 8 Relawan, dan Arsip LPJ Terbit.',
    highlights: [
      'Left Sidebar navigasi inisiator dengan verifikasi Kemenkumham',
      'Formulir LPJ Digital Web dengan tabel pos anggaran dinamis',
      'Sinkronisasi foto dokumentasi lapangan ke Landing Page',
      'Review dan seleksi pendaftar relawan (Setujui / Tolak)',
      'Seluruh 4 menu memanjang vertikal siap import Figma'
    ],
    icon: <HeartHandshake className="w-4 h-4 text-slate-700" />
  },
  admin: {
    id: 'admin',
    title: 'Admin & Auditor (Sketsa Kasar Konsol Pengawasan)',
    badge: 'Wireframe Lo-Fi • Konsol Pengawasan',
    filename: 'actgiving_wireframe_admin.html',
    url: '/actgiving_wireframe_admin.html',
    description: 'Sketsa kasar Konsol Pengawasan Admin & Auditor dengan Left Sidebar dan 4 menu memanjang: Moderasi & Approval Kampanye Baru, Audit Formulir LPJ Web & Foto, Rekonsiliasi Real-Time Transaksi QRIS/VA, dan Konfigurasi Sistem.',
    highlights: [
      'Left Sidebar navigasi pengawasan admin & status gateway',
      'Moderasi 2 proposal kampanye baru siap verifikasi',
      'Audit form LPJ digital web dan verifikasi foto lapangan',
      'Tabel mutasi rekonsiliasi transaksi donasi QRIS & VA live',
      'Konfigurasi fee 0% dan masa aktif QRIS'
    ],
    icon: <ShieldCheck className="w-4 h-4 text-slate-700" />
  },
  master: {
    id: 'master',
    title: 'Master Showcase (Semua Role Sketsa Kasar)',
    badge: 'Semua Role Terpadu Wireframe',
    filename: 'actgiving_wireframe_master.html',
    url: '/actgiving_wireframe_master.html',
    description: 'Satu suite terpadu sketsa kasar untuk berpindah instan antar 4 role (Donatur tanpa sidebar, Relawan, Inisiator, dan Admin dengan sidebar) dalam format monokrom blueprint lo-fi.',
    highlights: [
      'Peralihan instan antar role sketsa kasar di satu halaman',
      'Sidebar muncul otomatis saat beralih ke Relawan/Inisiator/Admin',
      'Donatur tetap bersih tanpa sidebar',
      'Format monokrom konsisten dengan border dashed dan font mono',
      'Ideal untuk presentasi arsitektur informasi dan wireframing Figma'
    ],
    icon: <Layers className="w-4 h-4 text-slate-700" />
  }
};

export const WireframeHtmlModal: React.FC<WireframeHtmlModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<WfRoleTab>('donatur');
  const [copiedRole, setCopiedRole] = useState<WfRoleTab | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [loadingCode, setLoadingCode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'info' | 'code' | 'preview'>('info');

  const currentConfig = WF_ROLE_CONFIGS[activeTab];

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
          setHtmlCode(`<!-- Gagal memuat sketsa kasar ${currentConfig.filename}: ${err.message} -->`);
          setLoadingCode(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, currentConfig.url, currentConfig.filename]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!htmlCode) return;
    navigator.clipboard.writeText(htmlCode);
    setCopiedRole(activeTab);
    setTimeout(() => {
      setCopiedRole(null);
    }, 2500);
  };

  const handleDownload = () => {
    if (!htmlCode) return;
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentConfig.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header Bar - Wireframe Styled */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-dashed border-amber-400/80 bg-slate-800 flex items-center justify-center text-amber-400 shadow-inner">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg font-mono tracking-tight">
                  Salin HTML Sketsa Kasar (Wireframe Lo-Fi)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-bold text-[10px] tracking-wider uppercase">
                  Monokrom Blueprint
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Desain sketsa kasar (tanpa warna, border dashed, placeholder foto X) siap di-import ke Figma.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs (Wireframe Styled) */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto shrink-0 font-mono text-xs">
          <span className="text-slate-500 font-bold uppercase text-[10px] mr-2 shrink-0">
            [PILIH ROLE]:
          </span>
          {(Object.keys(WF_ROLE_CONFIGS) as WfRoleTab[]).map((tabKey) => {
            const cfg = WF_ROLE_CONFIGS[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.id.toUpperCase()}</span>
                {tabKey !== 'master' && tabKey !== 'donatur' && (
                  <span className={`text-[9px] px-1 py-0.2 rounded border ${
                    isActive ? 'bg-slate-800 text-amber-300 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}>
                    SIDEBAR+4
                  </span>
                )}
                {tabKey === 'donatur' && (
                  <span className={`text-[9px] px-1 py-0.2 rounded border ${
                    isActive ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}>
                    NO-SIDEBAR
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher (Ringkasan vs Lihat Kode vs Preview Live) */}
        <div className="bg-white px-4 sm:px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{currentConfig.title}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{currentConfig.filename}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-300">
            <button
              onClick={() => setViewMode('info')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                viewMode === 'info' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ringkasan Blueprint
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                viewMode === 'code' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lihat HTML ({loadingCode ? '...' : `${Math.round(htmlCode.length / 1024)} KB`})
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                viewMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preview Sketsa
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* VIEW MODE 1: INFO & HIGHLIGHTS */}
          {viewMode === 'info' && (
            <div className="space-y-6">
              
              {/* Wireframe Specification Banner */}
              <div className="bg-white border-2 border-slate-800 p-5 rounded-2xl shadow-xs space-y-3 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-400 font-bold text-slate-800 text-[11px]">
                      {currentConfig.badge}
                    </span>
                    <span className="text-slate-400 text-xs">|</span>
                    <span className="text-xs text-slate-600">Monokrom / Blueprint Lo-Fi</span>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded">
                    ★ Khusus Wireframing Figma
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {currentConfig.description}
                </p>

                {/* Highlights List */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Spesifikasi Sketsa Kasar Ini:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                    {currentConfig.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                        <span className="text-slate-700">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructions on how to import into Figma */}
              <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border-2 border-slate-800 font-mono text-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span>⚡ CARA IMPORT WIREFRAME SKETSA KASAR KE FIGMA:</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 font-sans leading-relaxed">
                  <li>
                    Klik tombol <strong>"Salin HTML Sketsa Kasar"</strong> di bawah (atau unduh file <code>{currentConfig.filename}</code>).
                  </li>
                  <li>
                    Di Figma, pasang & buka plugin <strong>html.to.design</strong> (tersedia gratis di Figma Community).
                  </li>
                  <li>
                    Pilih opsi <strong>"Import via HTML Code"</strong> dan tempel (paste) kode HTML yang baru disalin, ATAU masukkan URL langsung:
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-700 mt-1 font-mono text-[11px] text-amber-300 select-all">
                      {window.location.origin}{currentConfig.url}
                    </div>
                  </li>
                  <li>
                    Klik <strong>Import</strong>. Figma akan langsung menghasilkan <strong>Frame Wireframe Monokrom Lengkap</strong> dengan seluruh menu yang tersusun memanjang ke bawah!
                  </li>
                </ol>
              </div>

            </div>
          )}

          {/* VIEW MODE 2: CODE PREVIEW */}
          {viewMode === 'code' && (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Berkas: <strong>{currentConfig.filename}</strong></span>
                <span>Baris: {htmlCode.split('\n').length} baris</span>
              </div>
              <div className="relative">
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl overflow-x-auto text-xs max-h-[50vh] border border-slate-800 select-all font-mono leading-relaxed">
                  {loadingCode ? '// Mengambil kode sketsa kasar...' : htmlCode}
                </pre>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: LIVE PREVIEW IFRAME */}
          {viewMode === 'preview' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                <span>Live Render Frame ({currentConfig.filename})</span>
                <a
                  href={currentConfig.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-800 font-bold hover:underline flex items-center gap-1"
                >
                  Buka di Tab Baru <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="bg-white rounded-2xl border-2 border-slate-800 overflow-hidden shadow-inner h-[55vh]">
                <iframe
                  src={currentConfig.url}
                  title="Wireframe Live Preview"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Footer Bar */}
        <div className="bg-white border-t-2 border-slate-800 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 font-mono text-xs">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={currentConfig.url}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl border border-slate-400 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Tab Baru</span>
            </a>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl border border-slate-400 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Unduh .html</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
            >
              Tutup
            </button>

            <button
              onClick={handleCopy}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all border-2 border-slate-800 w-full sm:w-auto"
            >
              {copiedRole === activeTab ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">HTML Sketsa Kasar Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Salin HTML Sketsa Kasar ({activeTab.toUpperCase()})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
