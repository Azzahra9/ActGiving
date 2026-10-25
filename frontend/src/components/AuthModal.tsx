import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  onSelectUser?: (user: UserProfile) => void;
  initialTab?: 'login' | 'register';
  initialRole?: 'relawan' | 'inisiator';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser: propUser,
  onSelectUser,
  initialTab = 'login',
  initialRole = 'relawan'
}) => {
  const { user: authUser, login, register } = useAuth();
  const currentUser = propUser || authUser;

  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('Bandung');
  const [selectedRoleType, setSelectedRoleType] = useState<'relawan' | 'inisiator'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  // Status & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Sinkronisasi tab & role saat modal dibuka
  React.useEffect(() => {
    if (isOpen) {
      if (initialTab) setTab(initialTab);
      if (initialRole) setSelectedRoleType(initialRole);
      setErrorMessage(null);
      setIsSuccess(false);
    }
  }, [isOpen, initialTab, initialRole]);

  if (!isOpen) return null;

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
            
            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Custom Login & Register Form (Connected to Laravel REST API) */}
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
