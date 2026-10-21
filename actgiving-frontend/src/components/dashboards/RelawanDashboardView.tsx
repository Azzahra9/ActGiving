import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, Calendar, Clock, MapPin, MessageSquare, Award, 
  CheckCircle2, ExternalLink, Compass, QrCode, ShieldCheck, 
  Users, AlertCircle, ArrowLeft, Download, Eye, Sparkles, Check, Phone
} from 'lucide-react';
import { Campaign, UserProfile } from '../../types';
import api from '../../lib/axios';
import { mapBackendCampaignToFrontend } from '../../services/campaignService';

interface RelawanDashboardViewProps {
  currentUser: UserProfile;
  campaigns: Campaign[];
  onExplorePublic: () => void;
  onOpenVolunteerModal: (campaign: Campaign) => void;
  onOpenLpjModal: (campaign: Campaign) => void;
  activeTab?: 'jadwal' | 'riwayat' | 'cari' | 'profil';
  onTabChange?: (tab: 'jadwal' | 'riwayat' | 'cari' | 'profil') => void;
}

export const RelawanDashboardView: React.FC<RelawanDashboardViewProps> = ({
  currentUser,
  campaigns,
  onExplorePublic,
  onOpenVolunteerModal,
  onOpenLpjModal,
  activeTab: propActiveTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'jadwal' | 'riwayat' | 'cari' | 'profil'>('jadwal');
  const activeTab = propActiveTab || internalTab;
  const setActiveTab = (tab: 'jadwal' | 'riwayat' | 'cari' | 'profil') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [selectedCertCamp, setSelectedCertCamp] = useState<Campaign | null>(null);
  const [showQrModal, setShowQrModal] = useState<Campaign | null>(null);
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [registeredCampaigns, setRegisteredCampaigns] = useState<Campaign[]>([]);

  // Fetch real volunteer registrations from Laravel REST API
  useEffect(() => {
    const fetchMyRegistrations = async () => {
      try {
        const response = await api.get('/my-volunteer-registrations');
        const items = response.data?.data?.data || response.data?.data || [];
        if (Array.isArray(items)) {
          const regCamps: Campaign[] = items
            .filter((reg: any) => reg.campaign)
            .map((reg: any) => mapBackendCampaignToFrontend(reg.campaign));
          setRegisteredCampaigns(regCamps);
        }
      } catch (err) {
        console.warn('Gagal memuat riwayat relawan dari API:', err);
      }
    };

    fetchMyRegistrations();
  }, []);

  // Filter campaigns this volunteer has joined
  const joinedCampaigns = registeredCampaigns.length > 0
    ? registeredCampaigns
    : campaigns.filter((c) => currentUser.joinedCampaignIds?.includes(c.id));

  const totalActions = joinedCampaigns.length;
  const contributionHours = totalActions > 0 ? totalActions * 6 : 0;
  const reputationPoints = totalActions > 0 ? totalActions * 100 : 0;

  // Campaigns open for volunteers that user has NOT joined yet
  const availableVolunteerCampaigns = campaigns.filter(
    (c) => (c.mode === 'relawan' || c.mode === 'keduanya') && 
           !currentUser.joinedCampaignIds?.includes(c.id) &&
           c.status !== 'pending_approval' && 
           c.status !== 'rejected'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateCheckIn = (campId: string) => {
    if (!checkedInIds.includes(campId)) {
      setCheckedInIds((prev) => [...prev, campId]);
      showToast('Presensi kehadiran berhasil diverifikasi via GPS & QR Code!');
      setShowQrModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Return to Public Portal */}
      <div className="bg-blue-950 text-blue-200 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span className="font-semibold text-white">Portal Khusus Relawan Terdaftar</span>
            <span className="text-blue-400">|</span>
            <span>Penugasan & Kehadiran Lapangan</span>
          </div>

          <button
            onClick={onExplorePublic}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-white font-medium transition-colors border border-blue-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lihat Beranda & Katalog Publik</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-blue-400 object-cover shadow-lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold font-sans text-white">
                  {currentUser.name}
                </h1>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Relawan Madya Terverifikasi
                </span>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm mb-2">
                Domisili: <span className="text-white font-medium">{currentUser.city || 'Jakarta Selatan'}</span> • Telp: <span className="text-white font-medium">{currentUser.phone || '+62 812-8899-2233'}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  Identitas KTP & Kontak Sah
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Status Kesiapan: <strong className="text-white">Siaga Lapangan</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto">
            <div className="flex-1 min-w-[160px] w-auto bg-blue-900/60 backdrop-blur-xs border border-blue-700/50 p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-xl lg:text-2xl font-bold text-white font-sans truncate">
                {joinedCampaigns.length}
              </div>
              <div className="text-[11px] text-blue-200 mt-0.5 truncate">Aksi Diikuti</div>
            </div>

            <div className="flex-1 min-w-[160px] w-auto bg-blue-900/60 backdrop-blur-xs border border-blue-700/50 p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-xl lg:text-2xl font-bold text-sky-400 font-sans truncate">
                {contributionHours} Jam
              </div>
              <div className="text-[11px] text-blue-200 mt-0.5 truncate">Jam Kontribusi</div>
            </div>

            <div className="flex-1 min-w-[160px] w-auto bg-blue-900/60 backdrop-blur-xs border border-blue-700/50 p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-xl lg:text-2xl font-bold text-blue-300 font-sans truncate">
                {joinedCampaigns.length}
              </div>
              <div className="text-[11px] text-blue-200 mt-0.5 truncate">E-Sertifikat</div>
            </div>

            <div className="flex-1 min-w-[160px] w-auto bg-blue-900/60 backdrop-blur-xs border border-blue-700/50 p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-xl lg:text-2xl font-bold text-blue-200 font-sans truncate">
                {reputationPoints}
              </div>
              <div className="text-[11px] text-blue-200 mt-0.5 truncate">Poin Reputasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Active Section Header Bar (Controlled via Sidebar) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              {activeTab === 'jadwal' && (
                <>
                  <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Jadwal & Tugas Lapangan</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {joinedCampaigns.length} Program
                  </span>
                </>
              )}
              {activeTab === 'riwayat' && (
                <>
                  <Award className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Riwayat & E-Sertifikat Digital</span>
                </>
              )}
              {activeTab === 'cari' && (
                <>
                  <Compass className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Cari Misi Relawan Baru</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {availableVolunteerCampaigns.length} Terbuka
                  </span>
                </>
              )}
              {activeTab === 'profil' && (
                <>
                  <Users className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Keahlian & Kontak Darurat</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Menu navigasi relawan kini dikelola langsung dan responsif melalui <strong>Sidebar Relawan</strong> di sebelah kiri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 capitalize">
              Mode Relawan
            </span>
          </div>
        </div>

        {/* TAB 1: JADWAL & TUGAS LAPANGAN */}
        {activeTab === 'jadwal' && (
          <div className="mt-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Panduan Operasional Kehadiran Lapangan</p>
                <p className="text-blue-700 mt-0.5 leading-relaxed">
                  Pastikan hadir tepat waktu di posko sesuai alamat. Sebelum penugasan dimulai, lakukan 
                  konfirmasi presensi dengan menunjukkan <strong>QR Code Check-in</strong> kepada koordinator lapangan atau klik tombol konfirmasi mandiri.
                </p>
              </div>
            </div>

            {joinedCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {joinedCampaigns.map((camp) => {
                const isCheckedIn = checkedInIds.includes(camp.id);
                return (
                  <div
                    key={camp.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden hover:border-blue-300 transition-all flex flex-col"
                  >
                    <div className="relative h-44 w-full">
                      <img
                        src={camp.imageUrl}
                        alt={camp.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {camp.category}
                        </span>
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-400" />
                          {camp.locationCity} ({camp.distanceKm} km)
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-base font-bold text-white line-clamp-1">
                          {camp.title}
                        </h3>
                        <p className="text-xs text-slate-300">
                          Inisiator: <span className="text-white font-medium">{camp.initiatorName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      {/* Schedule info box */}
                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <span className="text-slate-500 text-[10px] block">Tanggal Kegiatan:</span>
                            <span className="font-bold text-slate-800">{camp.eventDate || 'Sabtu, 14 Sept 2025'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <span className="text-slate-500 text-[10px] block">Waktu Penugasan:</span>
                            <span className="font-bold text-slate-800">{camp.eventTime || '07:30 - 16:00 WIB'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Criteria & Task Details */}
                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-1.5">
                          Tugas & Kriteria Khusus:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(camp.taskCriteria || [
                            'Fisik prima & siap kerja outdoor',
                            'Membawa pakaian ganti & sepatu boots',
                            'Pernah mengikuti briefing safety dasar'
                          ]).map((task, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-lg border border-slate-200"
                            >
                              • {task}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Presence Status */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {isCheckedIn ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Presensi Terkonfirmasi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
                              <Clock className="w-3.5 h-3.5" />
                              Menunggu Hari-H
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowQrModal(camp)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5 text-blue-600" />
                            <span>QR Presensi</span>
                          </button>

                          <a
                            href={`https://wa.me/6281234567890?text=Halo%20Admin%20${encodeURIComponent(camp.title)},%20saya%20relawan%20${encodeURIComponent(currentUser.name)}%20siap%20hadir.`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Grup WA</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Calendar className="w-10 h-10 text-blue-500 mx-auto mb-2 opacity-60" />
                <h4 className="font-bold text-slate-800 text-sm">Belum Ada Jadwal Aksi yang Diikuti</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Anda belum terdaftar dalam kegiatan relawan aktif. Buka menu &quot;Cari Kegiatan Baru&quot; untuk bergabung dengan program kemanusiaan.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RIWAYAT & E-SERTIFIKAT */}
        {activeTab === 'riwayat' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                E-Sertifikat Penghargaan Relawan Digital
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Diterbitkan secara resmi oleh ActGiving bersama Inisiator kegiatan setelah misi lapangan selesai diverifikasi.
              </p>

              {joinedCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {joinedCampaigns.map((camp, idx) => (
                  <div
                    key={camp.id}
                    className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">
                          {camp.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Nomor Registrasi: <strong className="font-mono text-slate-700">ACT-CERT-2025-{1000 + idx * 47}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Inisiator: {camp.initiatorName} • 8 Jam Operasional
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedCertCamp(camp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Pratinjau
                      </button>

                      <button
                        onClick={() => showToast(`Mengunduh E-Sertifikat ${camp.title}...`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        Unduh PDF
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Award className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-60" />
                  <div className="font-bold text-slate-800 text-sm">Belum Ada E-Sertifikat Tersedia</div>
                  <div className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Selesaikan partisipasi Anda dalam aksi relawan untuk mendapatkan sertifikat penghargaan resmi digital.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CARI MISI RELAWAN BARU */}
        {activeTab === 'cari' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Misi Lapangan yang Sedang Membutuhkan Personel
                </h2>
                <p className="text-xs text-slate-500">
                  Pilih kegiatan sosial dan klik gabung untuk otomatis terdaftar tanpa mengisi ulang data diri Anda.
                </p>
              </div>
            </div>

            {availableVolunteerCampaigns.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">
                  Anda Telah Bergabung di Semua Misi Terbuka!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  Terima kasih atas dedikasi Anda. Misi baru akan segera diumumkan oleh para inisiator.
                </p>
                <button
                  onClick={onExplorePublic}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Jelajahi Katalog Lengkap
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableVolunteerCampaigns.map((camp) => {
                  const remainingQuota = (camp.targetVolunteers || 0) - (camp.filledVolunteers || 0);
                  return (
                    <div
                      key={camp.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-40">
                          <img
                            src={camp.imageUrl}
                            alt={camp.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {camp.category}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                            {camp.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {camp.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                            <span>Sisa Kuota:</span>
                            <strong className="text-blue-600">{remainingQuota} Relawan Lagi</strong>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          onClick={() => onOpenVolunteerModal(camp)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <HeartHandshake className="w-4 h-4" />
                          <span>Daftar Misi Ini</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFIL & KESIAPAN */}
        {activeTab === 'profil' && (
          <div className="mt-6 max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Data Kesiapan Operasional Relawan Lapangan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Data ini digunakan oleh inisiator kegiatan untuk memetakan penugasan dan keselamatan kerja Anda di lapangan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.name}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Akun</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.email}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nomor Kontak WhatsApp</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.phone || '+62 812-8899-2233'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Domisili Kota</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.city || 'Jakarta Selatan'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">Keahlian Khusus & Sertifikasi yang Dimiliki:</h3>
              <div className="flex flex-wrap gap-2">
                {['Pertolongan Pertama (P3K)', 'Logistik Bencana', 'Manajemen Dapur Umum', 'Psikososial Anak', 'SIM B1 (Truk Operasional)'].map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 bg-blue-50/50 rounded-2xl p-4 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950">Asuransi Kecelakaan Relawan Aktif</h4>
                  <p className="text-[11px] text-blue-700">Dilindungi program santunan penugasan sosial ActGiving</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full uppercase">
                Aktif
              </span>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: QR Code Presensi */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">QR Presensi Kehadiran</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{showQrModal.title}</p>
            </div>

            {/* Visual QR Code Placeholder */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner">
              <div className="w-44 h-44 bg-white border-2 border-slate-800 p-2 flex flex-col items-center justify-center rounded-xl relative">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 opacity-80">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 2 === 0 || i % 5 === 0) ? 'bg-slate-900' : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p className="font-mono text-[10px] text-slate-500 mt-2 font-bold">
                PRESENSI-{showQrModal.id}-{currentUser.id}
              </p>
            </div>

            <p className="text-[11px] text-slate-500">
              Tunjukkan QR ini ke koordinator lapangan saat tiba di lokasi, atau klik konfirmasi mandiri jika Anda sudah di posko:
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSimulateCheckIn(showQrModal.id)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Konfirmasi Kehadiran Saya
              </button>
              <button
                onClick={() => setShowQrModal(null)}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Preview E-Sertifikat */}
      {selectedCertCamp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="border-4 border-double border-blue-400/60 p-6 sm:p-8 rounded-2xl bg-blue-50/20 text-center relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-400">
                ACT-CERT-2025-0981
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <HeartHandshake className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-slate-900 font-sans text-lg">
                  ActGiving Indonesia
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-wide uppercase mb-1">
                Sertifikat Penghargaan Relawan
              </h2>
              <p className="text-xs text-slate-500 italic mb-4">
                Diberikan dengan hormat dan apresiasi setinggi-tingginya kepada:
              </p>

              <div className="text-2xl sm:text-3xl font-bold font-sans text-blue-900 border-b-2 border-blue-200 pb-2 inline-block px-8 mb-4">
                {currentUser.name}
              </div>

              <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
                Atas dedikasi, integritas, dan pengabdian tenaga secara sukarela dalam menyukseskan kegiatan tanggap darurat dan aksi sosial kemanusiaan:
              </p>
              
              <div className="my-3 font-bold text-sm text-slate-900 bg-white/80 py-2 px-4 rounded-xl border border-blue-200 inline-block">
                {selectedCertCamp.title}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-blue-200/60 text-xs text-slate-600">
                <div>
                  <div className="font-serif font-bold text-slate-800 underline mb-1">
                    {selectedCertCamp.initiatorName}
                  </div>
                  <span className="text-[10px] text-slate-500">Inisiator & Koordinator Lapangan</span>
                </div>
                <div>
                  <div className="font-serif font-bold text-slate-800 underline mb-1">
                    Azzahra, S.Kom
                  </div>
                  <span className="text-[10px] text-slate-500">Auditor Platform ActGiving</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  showToast('E-Sertifikat berhasil diunduh dalam format PDF resmi.');
                  setSelectedCertCamp(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File PDF</span>
              </button>
              <button
                onClick={() => setSelectedCertCamp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
