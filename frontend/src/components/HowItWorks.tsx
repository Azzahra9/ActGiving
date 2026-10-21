import React, { useState } from 'react';
import { 
  Zap, 
  Users, 
  Megaphone, 
  MousePointerClick, 
  Coins, 
  QrCode, 
  FileCheck, 
  MapPin, 
  LogIn, 
  Send, 
  CheckCircle, 
  UserPlus, 
  Layers, 
  ShieldCheck, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface HowItWorksProps {
  onOpenCreateCampaign: () => void;
  onOpenAuth: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onOpenCreateCampaign,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'donatur' | 'relawan' | 'inisiator'>('donatur');

  return (
    <section id="tutorial-interaktif" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <span>Panduan Interaktif Penggunaan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
            Cara Kerja ActGiving
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Pilih peranmu dan lihat alur mudah berkontribusi tanpa hambatan birokrasi berbelit.
          </p>
        </div>

        {/* Dynamic 3-Way Tabs Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-inner max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab('donatur')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'donatur'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className={`w-4 h-4 ${activeTab === 'donatur' ? 'text-white' : 'text-slate-400'}`} />
              Jalur Donatur Cepat (Guest)
            </button>

            <button
              onClick={() => setActiveTab('relawan')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'relawan'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'relawan' ? 'text-white' : 'text-slate-400'}`} />
              Jalur Relawan Bergerak
            </button>

            <button
              onClick={() => setActiveTab('inisiator')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'inisiator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Megaphone className={`w-4 h-4 ${activeTab === 'inisiator' ? 'text-white' : 'text-slate-400'}`} />
              Jalur Penggalang Aksi
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          
          {/* TAB 1: Jalur Donatur Cepat */}
          {activeTab === 'donatur' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Alur Donasi Cepat Tanpa Login
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Terinspirasi model UNICEF: donasi langsung diproses tanpa kewajiban registrasi di awal.
                  </p>
                </div>
                <a
                  href="#katalog-aksi"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-100/70 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto border border-blue-200"
                >
                  Coba Donasi Sekarang
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {/* Step 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    1
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <MousePointerClick className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">1. Pilih Kampanye</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih aksi berlabel <span className="font-semibold text-slate-800">"Butuh Dana"</span> atau <span className="font-semibold text-slate-800">"Dana & Relawan"</span> di katalog dekat lokasimu.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    2
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Coins className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">2. Tentukan Nominal</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih nominal instan (10rb, 25rb, 50rb, 100rb, atau kustom) dan opsi anonim ("Hamba Allah").
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    3
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">3. Scan QRIS / Salin VA</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sistem menggenerasi QRIS dinamis atau nomor VA tiruan dengan timer aktif 15 menit.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    4
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">4. Bukti Terbit (No Login)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Invoice digital terbit seketika dengan kode referensi unik dan dikirimkan otomatis ke email Anda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Jalur Relawan Bergerak */}
          {activeTab === 'relawan' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Alur Pendaftaran Relawan Lapangan
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Bantu langsung di lapangan dengan transparansi rincian tugas dan jadwal yang pasti.
                  </p>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-100/70 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto border border-blue-200"
                >
                  Daftar Akun Relawan
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    1
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">1. Temukan Aksi di Kotamu</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cari kegiatan yang berlabel "Butuh Relawan" atau "Dana & Relawan" sesuai radius terdekat.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    2
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">2. Masuk Akun</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gunakan akun dual-role resmi untuk memverifikasi data kontak WhatsApp & domisili aslimu.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    3
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Send className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">3. Klik Lamar Relawan</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Setujui komitmen jadwal pelaksanaan dan isi ringkasan keahlian yang relevan.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    4
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">4. Konfirmasi Panitia</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Terima notifikasi seleksi panitia, kontak grup WhatsApp, serta hak e-sertifikat pasca-kegiatan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Jalur Penggalang Aksi */}
          {activeTab === 'inisiator' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Alur Penggalang Aksi Sosial
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Buka penggalangan dana materi, relawan fisik, atau keduanya secara simultan dalam 1 pintu.
                  </p>
                </div>
                <button
                  onClick={onOpenCreateCampaign}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-100/70 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto border border-blue-200"
                >
                  Buka Galang Aksi Baru
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    1
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">1. Registrasi Akun</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Daftar akun inisiator dan lengkapi berkas legalitas/KTP organisasi untuk verifikasi kepatuhan.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    2
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">2. Pilih Mode Kampanye</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tentukan format: Hanya Butuh Dana, Hanya Butuh Relawan, atau Butuh Keduanya (Dana & Relawan).
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    3
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">3. Verifikasi Admin</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tim moderator memvalidasi urgensi narasi, sasaran penerima, target anggaran, dan berkas inisiator.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-blue-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mb-4">
                    4
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">4. Publikasi & Unggah LPJ</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kampanye aktif di publik. Kurasi pendaftar relawan dan unggah kuitansi belanja riil pada linimasa LPJ.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
