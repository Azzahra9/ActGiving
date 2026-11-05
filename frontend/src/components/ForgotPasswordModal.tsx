import React, { useState } from 'react';
import { X, Mail, KeyRound, Loader2, AlertCircle, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';
import { authService } from '../services/authService';

export interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
  onOpenResetPassword?: (email: string, token: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenResetPassword,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await authService.forgotPassword(email.trim());
      setIsSuccess(true);
      if (result.data?.reset_token) {
        setGeneratedToken(result.data.reset_token);
      }
      if (result.data?.reset_url) {
        setResetUrl(result.data.reset_url);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Gagal mengirimkan tautan reset kata sandi. Pastikan email terdaftar.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setGeneratedToken(null);
    setResetUrl(null);
    setEmail('');
    onClose();
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
              <h2 className="text-base font-bold text-slate-900 font-sans">Lupa Kata Sandi</h2>
              <p className="text-xs text-slate-500">Modul Pemulihan Akun (AUTH-03 / FR-05)</p>
            </div>
          </div>
          <button
            onClick={handleResetForm}
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
              Masukkan alamat email akun ActGiving Anda. Kami akan mengirimkan tautan verifikasi dan token untuk mengatur ulang kata sandi (berlaku 60 menit).
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirimkan Tautan Reset...</span>
                </>
              ) : (
                <span>Kirim Tautan Reset Kata Sandi</span>
              )}
            </button>

            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  handleResetForm();
                  onOpenLogin?.();
                }}
                className="inline-flex items-center gap-1.5 font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Masuk</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4 text-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Email Pemulihan Terkirim!</h3>
              <p className="text-slate-600 leading-relaxed">
                Tautan dan token reset kata sandi telah dikirim ke <strong className="text-slate-800">{email}</strong>.
              </p>
              <p className="text-[11px] text-slate-400">
                (Pada mode lokal/UAT, periksa log di <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">storage/logs/laravel.log</code>)
              </p>
            </div>

            {/* UAT Helper Box: Quick Token Viewer for Testing */}
            {generatedToken && (
              <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider">UAT Test Token</span>
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">Aktif 60 Mnt</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-blue-100 font-mono text-[10px] text-slate-700 break-all select-all">
                  {generatedToken}
                </div>
                {onOpenResetPassword && (
                  <button
                    onClick={() => {
                      const tok = generatedToken;
                      const em = email;
                      handleResetForm();
                      onOpenResetPassword(em, tok);
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lanjutkan Reset Kata Sandi Sekarang</span>
                  </button>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleResetForm}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordModal;
