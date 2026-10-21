import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Coins, 
  Users, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  ShieldAlert, 
  Lock, 
  UserCheck,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Campaign, CampaignMode, Category, UserProfile } from '../types';
import api from '../lib/axios';
import { mapBackendCampaignToFrontend } from '../services/campaignService';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCampaign: (newCampaign: Campaign) => void;
  currentUser?: UserProfile;
  onSwitchToInisiator?: () => void;
}

const CATEGORY_MAP: Record<string, number> = {
  'Bencana Alam': 1,
  'Pendidikan': 2,
  'Kesehatan': 3,
  'Lingkungan Hidup': 4,
  'Panti Asuhan': 5,
  'Sosial & Kemanusiaan': 5,
};

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onAddCampaign,
  currentUser,
  onSwitchToInisiator
}) => {
  const isAuthorized = currentUser?.role === 'inisiator' || currentUser?.role === 'admin';
  const [mode, setMode] = useState<CampaignMode>('keduanya');
  const [title, setTitle] = useState('');
  const [initiatorName, setInitiatorName] = useState(currentUser?.name || '');
  const [category, setCategory] = useState<Category>('Bencana Alam');
  const [locationCity, setLocationCity] = useState(currentUser?.city || 'Bandung');
  const [description, setDescription] = useState('');

  // Mode Dana fields
  const [targetFundsStr, setTargetFundsStr] = useState('25000000');
  const [deadlineDays, setDeadlineDays] = useState(30);

  // Mode Relawan fields
  const [targetVolunteersStr, setTargetVolunteersStr] = useState('20');
  const [activityDate, setActivityDate] = useState(() => {
    // Default: 1 minggu ke depan (YYYY-MM-DD)
    const future = new Date();
    future.setDate(future.getDate() + 7);
    return future.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState('08:00 - 16:00 WIB');
  const [tasksStr, setTasksStr] = useState('Distribusi bantuan, Membantu di posko evakuasi');

  // API Interaction States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser && currentUser.role !== 'guest') {
      setInitiatorName(currentUser.name);
      if (currentUser.city) setLocationCity(currentUser.city);
      setErrorMessage(null);
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Strict Anti Double-Submit

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const categoryId = CATEGORY_MAP[category] || 1;
      const backendMode = mode === 'dana' ? 'fund_only' : mode === 'relawan' ? 'volunteer_only' : 'both';
      const targetAmount = mode === 'relawan' ? 0 : parseInt(targetFundsStr.replace(/\D/g, '') || '0', 10);
      const targetVolunteers = mode === 'dana' ? 0 : parseInt(targetVolunteersStr.replace(/\D/g, '') || '0', 10);

      // Hit POST /api/campaigns (Sanctum protected)
      const response = await api.post('/campaigns', {
        category_id: categoryId,
        title: title.trim(),
        description: description.trim(),
        campaign_mode: backendMode,
        target_amount: targetAmount,
        target_volunteers: targetVolunteers,
        location: locationCity,
        activity_date: activityDate || null,
      });

      const responseData = response.data;
      if (responseData?.data) {
        const createdCampaign = mapBackendCampaignToFrontend(responseData.data);
        onAddCampaign(createdCampaign);
      } else {
        // Fallback jika response custom
        const fallbackCamp: Campaign = {
          id: `camp-${Date.now()}`,
          title: title.trim(),
          initiatorName: initiatorName.trim() || 'Inisiator Kemanusiaan',
          initiatorRole: 'Inisiator Terverifikasi',
          category,
          mode,
          locationCity,
          distanceKm: 1.5,
          imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
          description: description.trim(),
          targetFunds: targetAmount,
          collectedFunds: 0,
          targetVolunteers: targetVolunteers,
          filledVolunteers: 0,
          eventDate: activityDate,
          eventTime: eventTime,
          status: 'pending_approval',
        };
        onAddCampaign(fallbackCamp);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Create campaign error:', err);
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        setErrorMessage(errors[firstKey][0]);
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Gagal menyimpan kampanye ke backend. Pastikan server Laravel aktif di http://127.0.0.1:8000.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
              <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Inisiasi Kampanye Aksi (REST API)</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Buka Galang Aksi Sosial Baru
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authorization Guard: Only Inisiator can open campaigns */}
        {!isAuthorized ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-8 h-8 text-blue-600" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Otorisasi Khusus Peran Inisiator
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                Hanya Inisiator Terverifikasi yang Berwenang Membuka Aksi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Sesuai dengan spesifikasi sistem ActGiving, hak inisiasi dan penggalangan aksi sosial memerlukan autentikasi dengan peran <strong className="text-blue-900">Inisiator</strong> untuk menjamin akuntabilitas penyaluran dan mencegah penipuan.
              </p>
            </div>

            {/* Current Active Role Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status Pengguna Anda Saat Ini
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'G'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentUser?.name || 'Tamu / Belum Login'}</div>
                    <div className="text-[11px] text-slate-500 capitalize">Peran aktif: {currentUser?.role || 'Guest'}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Akses Terkunci
                </span>
              </div>
            </div>

            {/* Action to switch or login */}
            {onSwitchToInisiator && (
              <button
                type="button"
                onClick={() => {
                  onSwitchToInisiator();
                  onClose();
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <UserCheck className="w-4 h-4" />
                <span>Beralih ke Akun Inisiator (Simulasi Cepat)</span>
              </button>
            )}
          </div>
        ) : !isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Mode Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Pilih Mode Kampanye</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('dana')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    mode === 'dana'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Coins className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <div>Hanya Butuh Dana</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('relawan')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    mode === 'relawan'
                      ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1 text-sky-600" />
                  <div>Hanya Butuh Relawan</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('keduanya')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    mode === 'keduanya'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <div>Dana & Relawan</div>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Kampanye Aksi</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Bantuan Sembako Warga Terdampak Banjir"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Inisiator / Komunitas</label>
                  <input
                    type="text"
                    required
                    value={initiatorName}
                    onChange={(e) => setInitiatorName(e.target.value)}
                    placeholder="Contoh: Relawan Peduli"
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Isu</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors cursor-pointer"
                  >
                    <option value="Bencana Alam">Bencana Alam</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Lingkungan Hidup">Lingkungan Hidup</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Panti Asuhan">Panti Asuhan</option>
                    <option value="Sosial & Kemanusiaan">Sosial & Kemanusiaan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kota Kegiatan</label>
                  <select
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors cursor-pointer"
                  >
                    <option value="Bandung">Bandung</option>
                    <option value="Jakarta Utara">Jakarta Utara</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Yogyakarta">Yogyakarta</option>
                    <option value="Medan">Medan</option>
                    <option value="Lumajang, Jawa Timur">Lumajang, Jawa Timur</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Tanggal Kegiatan</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={activityDate}
                      onChange={(e) => setActivityDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi & Urgensi Lapangan</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan kondisi dan kebutuhan nyata di lapangan..."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Mode Conditional Inputs */}
            {(mode === 'dana' || mode === 'keduanya') && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <span className="font-bold text-amber-900 block">Atribut Penggalangan Dana:</span>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Nominal Dana (Rp)</label>
                  <input
                    type="number"
                    step={1000000}
                    value={targetFundsStr}
                    onChange={(e) => setTargetFundsStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-hidden font-bold text-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            {(mode === 'relawan' || mode === 'keduanya') && (
              <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
                <span className="font-bold text-sky-900 block">Atribut Kebutuhan Relawan Lapangan:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Kuota Relawan (Orang)</label>
                    <input
                      type="number"
                      min={1}
                      value={targetVolunteersStr}
                      onChange={(e) => setTargetVolunteersStr(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-hidden font-bold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jam Pelaksanaan</label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      placeholder="08:00 - 16:00 WIB"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kriteria Keahlian & Tugas Kerja</label>
                  <input
                    type="text"
                    value={tasksStr}
                    onChange={(e) => setTasksStr(e.target.value)}
                    placeholder="Membantu posko, memilah obat, dsb."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Form Submit Button with Anti Double-Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Laravel Backend...</span>
                </>
              ) : (
                <span>Simpan & Terbitkan Kampanye Aksi Baru</span>
              )}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Kampanye Berhasil Dibuat!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Pengajuan aksi barumu telah tersimpan di REST API Laravel dan berstatus <strong className="text-slate-900">Menunggu Verifikasi Admin</strong> sesuai prosedur SRS ActGiving.
            </p>
            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Lihat di Katalog / Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
