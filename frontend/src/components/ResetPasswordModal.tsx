import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, KeyRound, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToken?: string;
  initialEmail?: string;
  onSuccess?: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  initialToken = '',
  initialEmail = '',
  onSuccess,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-detect token & email from URL query params if not provided via props
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token') || params.get('reset_token');
      const urlEmail = params.get('email');

      if (urlToken && !token) {
        setToken(urlToken);
      }
      if (urlEmail && !email) {
        setEmail(urlEmail);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialToken) setToken(initialToken);
    if (initialEmail) setEmail(initialEmail);
  }, [initialToken, initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage('Kata sandi baru minimal harus 8 karakter.');
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!token.trim()) {
      setErrorMessage('Token verifikasi tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword({
        email: email.trim(),
        token: token.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      setIsSuccess(true);

      // Clean query parameters from URL for security
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.password?.[0] ||
        err.response?.data?.errors?.token?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Gagal memperbarui kata sandi. Pastikan token masih berlaku.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setIsSuccess(false);
    setPassword('');
    setPasswordConfirmation('');
    setErrorMessage(null);
    onClose();
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Reset Kata Sandi</h2>
              <p className="text-xs text-slate-500">Buat Kata Sandi Baru (AUTH-03 / FR-05)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <p className="text-slate-600 leading-relaxed">
              Masukkan token verifikasi yang Anda terima dan tetapkan kata sandi baru untuk akun Anda.
            </p>

            {/* Email Address */}
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

            {/* Token Input */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Token Verifikasi Reset</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste token 64 karakter di sini..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-mono text-[11px] outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
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
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Confirmation */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi kata sandi baru..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !token.trim() || !password || !passwordConfirmation}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memperbarui Kata Sandi...</span>
                </>
              ) : (
                <span>Simpan Kata Sandi Baru</span>
              )}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4 text-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Kata Sandi Berhasil Diperbarui!</h3>
              <p className="text-slate-600 leading-relaxed">
                Kata sandi baru Anda telah tersimpan di sistem. Silakan login kembali menggunakan kata sandi baru Anda.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleFinish}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Masuk Sekarang
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResetPasswordModal;
