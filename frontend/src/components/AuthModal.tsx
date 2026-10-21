import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  onSelectUser?: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser: propUser,
  onSelectUser
}) => {
  const { user: authUser, login, register, switchDemoPersona } = useAuth();
  const currentUser = propUser || authUser;

  const [activeMode, setActiveMode] = useState<'personas' | 'custom'>('custom');
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('Bandung');
  const [selectedRoleType, setSelectedRoleType] = useState<'relawan' | 'inisiator'>('inisiator');
  const [showPassword, setShowPassword] = useState(false);

  // Status & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectPersona = (roleKey: UserRole) => {
    switchDemoPersona(roleKey);
    const targetUser = DEMO_USERS[roleKey];
    if (onSelectUser && targetUser) {
      onSelectUser(targetUser);
    }
    setNotificationMsg(`Berhasil beralih sebagai: ${targetUser?.name || roleKey} (${roleKey.toUpperCase()})`);
    setIsSuccess(true);
  };

  const handleSubmitCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (tab === 'login') {
        const loggedInUser = await login({
          email: email.trim(),
          password: password,
          rolePreference: selectedRoleType,
        });

        if (onSelectUser) {
          onSelectUser(loggedInUser);
        }

        setNotificationMsg(`Selamat datang kembali, ${loggedInUser.name}!`);
        setIsSuccess(true);
      } else {
        // Register Validation
        if (password.length < 8) {
          throw new Error('Kata sandi minimal harus 8 karakter.');
        }

        if (passwordConfirmation && password !== passwordConfirmation) {
          throw new Error('Konfirmasi kata sandi tidak cocok.');
        }

        const registeredUser = await register({
          name: fullName.trim(),
          email: email.trim(),
          password: password,
          password_confirmation: passwordConfirmation || password,
          phone_whatsapp: whatsapp.trim() || undefined,
          city_domicile: city.trim() || undefined,
          rolePreference: selectedRoleType,
        });

        if (onSelectUser) {
          onSelectUser(registeredUser);
        }

        setNotificationMsg(`Pendaftaran berhasil! Selamat datang di ActGiving, ${registeredUser.name}.`);
        setIsSuccess(true);
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      // Parsing response error dari Laravel ValidationException atau API error
      if (err.response?.data?.errors) {
        const errorsObj = err.response.data.errors;
        const firstErrorKey = Object.keys(errorsObj)[0];
        setErrorMessage(errorsObj[firstErrorKey][0]);
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memproses autentikasi. Silakan periksa koneksi backend Anda.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Autentikasi REST API & Dual-Role Laravel</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {tab === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Akun Baru (Dual-Role)'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="p-6 space-y-4">
            
            {/* Mode Switcher: Custom Form vs Quick Demo Personas */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('custom');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Formulir Akun (REST API)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('personas');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'personas' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Pilih Aktor Demo</span>
              </button>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {activeMode === 'custom' ? (
              /* Custom Login & Register Form (Connected to Laravel REST API) */
              <div className="space-y-4">
                <div className="flex justify-center gap-2 text-xs font-bold text-slate-600 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setErrorMessage(null);
                    }}
                    className={`pb-1 px-4 cursor-pointer transition-colors ${
                      tab === 'login'
                        ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Masuk Akun
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('register');
                      setErrorMessage(null);
                    }}
                    className={`pb-1 px-4 cursor-pointer transition-colors ${
                      tab === 'register'
                        ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Daftar Baru (Dual-Role)
                  </button>
                </div>

                <form onSubmit={handleSubmitCustom} className="space-y-3 text-xs">
                  {tab === 'register' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Masukkan nama lengkap Anda..."
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Alamat Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kata Sandi</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter..."
                        className="w-full pl-9 pr-10 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {tab === 'register' && (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="Ulangi kata sandi..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="tel"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              placeholder="0812xxxxxxx"
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Kota Domisili</label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="Bandung, Jakarta..."
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Aktivitas Utama Saat Ini</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRoleType('relawan')}
                        className={`p-2 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                          selectedRoleType === 'relawan'
                            ? 'border-sky-600 bg-sky-50 text-sky-800 ring-1 ring-sky-600'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        Fokus Jadi Relawan
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRoleType('inisiator')}
                        className={`p-2 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                          selectedRoleType === 'inisiator'
                            ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        Fokus Buka Kampanye
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      *Akun ActGiving bersifat Dual-Role: bisa menggalang donasi/relawan dan mendaftar kegiatan aksi.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-md mt-3 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses ke Laravel Sanctum...</span>
                      </>
                    ) : (
                      <span>{tab === 'register' ? 'Daftar Akun Dual-Role' : 'Masuk Akun'}</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Mode Personas (Simulasi Aktor Cepat) */
              <div className="space-y-3">
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900">
                  <strong className="font-semibold">Simulasi Peran:</strong> Uji cepat alur sistem dengan berganti ke salah satu profil peran di bawah ini:
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Persona 1: Donatur Cepat (Guest) */}
                  <div
                    onClick={() => handleSelectPersona('guest')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      currentUser.role === 'guest'
                        ? 'border-blue-800 bg-blue-50/60 ring-1 ring-blue-800'
                        : 'border-slate-200 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">1. Donatur Cepat (Guest)</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                            Tanpa Akun
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Checkout donasi instan via QRIS / VA tanpa perlu login.
                        </p>
                      </div>
                    </div>
                    {currentUser.role === 'guest' ? (
                      <span className="text-[10px] font-bold text-slate-900 bg-slate-200 px-2 py-1 rounded-md">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-blue-600 hover:underline">
                        Pilih
                      </span>
                    )}
                  </div>

                  {/* Persona 2: Relawan Lapangan */}
                  <div
                    onClick={() => handleSelectPersona('relawan')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      currentUser.role === 'relawan'
                        ? 'border-sky-600 bg-sky-50/50 ring-1 ring-sky-600'
                        : 'border-slate-200 hover:border-sky-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={DEMO_USERS.relawan.avatarUrl}
                        alt="Rian Pratama"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">2. Rian Pratama (Relawan)</span>
                          <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded font-semibold">
                            Dual-Role
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Mendaftar kegiatan fisik, cek jadwal, grup WA panitia & e-sertifikat.
                        </p>
                      </div>
                    </div>
                    {currentUser.role === 'relawan' ? (
                      <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-1 rounded-md">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-sky-600 hover:underline">
                        Pilih
                      </span>
                    )}
                  </div>

                  {/* Persona 3: Inisiator Aksi */}
                  <div
                    onClick={() => handleSelectPersona('inisiator')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      currentUser.role === 'inisiator'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={DEMO_USERS.inisiator.avatarUrl}
                        alt="Sarah Anindita"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">3. Sarah Anindita (Inisiator)</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                            Dual-Role
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Membuka galang aksi dan mengunggah LPJ kuitansi pembelanjaan transparan.
                        </p>
                      </div>
                    </div>
                    {currentUser.role === 'inisiator' ? (
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-1 rounded-md">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-blue-700 hover:underline">
                        Pilih
                      </span>
                    )}
                  </div>

                  {/* Persona 4: Administrator */}
                  <div
                    onClick={() => handleSelectPersona('admin')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      currentUser.role === 'admin'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={DEMO_USERS.admin.avatarUrl}
                        alt="Azzahra, S.Kom"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">4. Azzahra, S.Kom (Admin Platform)</span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                            Admin Utama
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Panel verifikasi kampanye baru, tolak/setujui, dan audit bukti kuitansi LPJ.
                        </p>
                      </div>
                    </div>
                    {currentUser.role === 'admin' ? (
                      <span className="text-[10px] font-bold text-indigo-900 bg-indigo-100 px-2 py-1 rounded-md">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-indigo-600 hover:underline">
                        Pilih
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {notificationMsg || 'Autentikasi Berhasil!'}
            </h3>
            <p className="text-xs text-slate-600">
              Sesi Anda telah aktif dan terhubung langsung ke REST API Laravel Backend.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Lanjutkan Eksplorasi
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
