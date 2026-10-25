import React, { useState, useEffect } from 'react';
import { 
  X, Users, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, 
  Send, AlertCircle, Lock, Eye, EyeOff, UserPlus, ArrowRight, Loader2 
} from 'lucide-react';
import { Campaign, UserProfile } from '../types';
import api, { setAuthToken } from '../lib/axios';
import { useAuth, mapBackendUserToProfile } from '../context/AuthContext';

interface VolunteerModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onVolunteerSuccess: (campaignId: string) => void;
  currentUser?: UserProfile;
  onNavigateToDashboard?: () => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onVolunteerSuccess,
  currentUser,
  onNavigateToDashboard
}) => {
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [skills, setSkills] = useState('');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isGuest = !currentUser || currentUser.role === 'guest';

  useEffect(() => {
    if (isOpen && currentUser && currentUser.role !== 'guest') {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setWhatsapp(currentUser.phone || '');
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !campaign) return null;

  const remainingQuota = (campaign.targetVolunteers || 0) - (campaign.filledVolunteers || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreed) {
      setErrorMessage('Anda wajib mencentang persetujuan komitmen kehadiran di lokasi.');
      return;
    }
    if (!whatsapp.trim()) {
      setErrorMessage('Nomor WhatsApp aktif wajib diisi untuk koordinasi grup panitia.');
      return;
    }

    if (isGuest) {
      if (!password || password.length < 6) {
        setErrorMessage('Kata sandi minimal terdiri dari 6 karakter.');
        return;
      }
      if (password !== passwordConfirmation) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
        return;
      }
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload: any = {
        skills: skills.trim() || 'Komitmen hadir di lokasi kegiatan sesuai SOP panitia',
      };

      if (isGuest) {
        payload.name = fullName.trim();
        payload.email = email.trim().toLowerCase();
        payload.phone_whatsapp = whatsapp.trim();
        payload.whatsapp = whatsapp.trim();
        payload.password = password;
        payload.password_confirmation = passwordConfirmation;
      }

      const res = await api.post(`/campaigns/${campaign.id}/volunteer-register`, payload);
      const data = res.data?.data;

      // Auto-Login: simpan Sanctum token & set global profile ke role 'relawan'
      if (data?.token && data?.user) {
        setAuthToken(data.token);
        localStorage.setItem('actgiving_preferred_role', 'relawan');
        const newProfile = mapBackendUserToProfile(data.user, 'relawan');
        setUser(newProfile);
      }

      setIsSuccess(true);
      onVolunteerSuccess(campaign.id);
    } catch (err: any) {
      console.error('Pendaftaran relawan gagal:', err);
      const msg = err.response?.data?.message || err.message || 'Gagal mendaftar relawan. Silakan periksa kembali input Anda.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setPassword('');
    setPasswordConfirmation('');
    setShowPassword(false);
    setSkills('');
    setHasAgreed(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>Pendaftaran Akun Relawan & Misi</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-sm mt-0.5">
              {campaign.title}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pendaftaran resmi untuk bergabung dalam misi sekaligus membuat akun ActGiving Anda.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Field Task Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Sisa Kuota Tersedia:</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {remainingQuota} Relawan Dibutuhkan
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-medium">Jadwal: {campaign.eventDate} ({campaign.eventTime})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-medium">Titik Lokasi: {campaign.locationCity}</span>
                </div>

                {campaign.taskCriteria && campaign.taskCriteria.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-1">Tugas & Kriteria Lapangan:</span>
                    <ul className="space-y-1 pl-4 list-disc text-slate-600">
                      {campaign.taskCriteria.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Informative Banner */}
              {isGuest ? (
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 leading-relaxed">
                    <span className="font-semibold block text-blue-950">Pembuatan Akun Relawan Otomatis</span>
                    Formulir ini sekaligus mendaftarkan akun relawan resmi Anda di ActGiving. Anda akan langsung otomatis masuk (auto-login) ke Dashboard Relawan setelah formulir terkirim.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs text-emerald-800">
                    Masuk sebagai <strong>{currentUser.name}</strong> ({currentUser.email}). Misi ini akan langsung ditautkan ke akun Anda.
                  </span>
                </div>
              )}

              {/* Input Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Sesuai KTP
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Aktif (Untuk Login & Sertifikat)
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp (Wajib Koordinasi)
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="0812xxxxxxx"
                      className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Password Fields for New Volunteer Registration */}
                {isGuest && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kata Sandi Akun Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 6 karakter..."
                          className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Konfirmasi Kata Sandi
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={passwordConfirmation}
                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                          placeholder="Ulangi kata sandi..."
                          className="w-full pl-3 pr-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deskripsi Keahlian / Pengalaman Pendukung
                  </label>
                  <textarea
                    rows={2}
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Misal: Mahasiswa kedokteran, relawan dapur umum, bisa mengemudi mobil..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-all resize-none"
                  />
                </div>

                {/* Checkbox Komitmen Kehadiran */}
                <label className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/50 border border-blue-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 rounded-sm focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-700">
                    Saya berkomitmen penuh untuk hadir tepat waktu sesuai jadwal dan mematuhi SOP keselamatan panitia pelaksana.
                  </span>
                </label>

                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Akun & Lamaran...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{isGuest ? 'Daftarkan Akun & Ajukan Relawan Misi' : 'Kirim Lamaran Relawan Lapangan'}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Confirmation Success Screen */
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Akun Relawan Resmi Terdaftar & Terautentikasi
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Selamat Datang di Keluarga Relawan ActGiving!
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Halo <strong className="text-slate-800">{fullName || currentUser?.name || 'Kawan Relawan'}</strong>! Akun Anda telah aktif dengan email <strong className="text-slate-800">{email || currentUser?.email}</strong> dan telah otomatis masuk (auto-login). Lamaran Anda telah terhubung ke misi <strong className="text-slate-800">{campaign.title}</strong>.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Status & Langkah Selanjutnya:</span>
                </div>
                <div className="pl-5 space-y-1 text-slate-600 list-disc">
                  <div>• Akun Anda telah tersimpan di PostgreSQL dan token sesi aktif.</div>
                  <div>• Undangan grup koordinasi panitia akan dikirimkan ke WhatsApp ({whatsapp || currentUser?.phone}).</div>
                  <div>• Anda dapat melihat riwayat misi dan kartu relawan di Dashboard Relawan.</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToDashboard) {
                      onNavigateToDashboard();
                    } else {
                      handleResetAndClose();
                    }
                  }}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Buka Dashboard Relawan Saya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Tutup & Kembali
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
