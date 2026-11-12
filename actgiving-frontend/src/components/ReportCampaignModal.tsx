import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Flag,
  AlertTriangle,
  AlertCircle,
  User,
  Mail,
  FileText,
  Upload,
  Image as ImageIcon,
  Trash2,
  ShieldAlert,
  Loader2,
  Send
} from 'lucide-react';
import { Campaign, UserProfile } from '../types';
import api from '../lib/axios';

interface ReportCampaignModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  onReportSuccess: (message: string) => void;
}

export const REPORT_CATEGORIES = [
  { value: 'penipuan', label: 'Dugaan Penipuan / Penggelapan Dana' },
  { value: 'fiktif', label: 'Kampanye Fiktif / Tidak Ada Kegiatan Nyata' },
  { value: 'spam', label: 'Spam / Duplikasi Kampanye' },
  { value: 'konten_tidak_pantas', label: 'Konten Tidak Pantas / Menyesatkan' },
  { value: 'lainnya', label: 'Pelanggaran Lainnya' },
];

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

export const ReportCampaignModal: React.FC<ReportCampaignModalProps> = ({
  campaign,
  isOpen,
  onClose,
  currentUser,
  onReportSuccess,
}) => {
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterEmail, setReporterEmail] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isLoggedIn = Boolean(
    currentUser && currentUser.role !== 'guest' && currentUser.id !== 'guest'
  );

  // Reset & auto-fill saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setReporterName(isLoggedIn ? currentUser?.name || '' : '');
      setReporterEmail(isLoggedIn ? currentUser?.email || '' : '');
      setCategory('');
      setDescription('');
      setEvidenceFile(null);
      setEvidencePreview(null);
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen, campaign?.id, isLoggedIn, currentUser?.name, currentUser?.email]);

  // Bersihkan object URL preview untuk menghindari memory leak
  useEffect(() => {
    return () => {
      if (evidencePreview && evidencePreview.startsWith('blob:')) {
        URL.revokeObjectURL(evidencePreview);
      }
    };
  }, [evidencePreview]);

  if (!isOpen || !campaign) return null;

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage('Format file bukti harus berupa gambar (JPG, PNG, WEBP, GIF) atau PDF.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('Ukuran file bukti maksimal 2MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (evidencePreview && evidencePreview.startsWith('blob:')) {
      URL.revokeObjectURL(evidencePreview);
    }

    setEvidenceFile(file);
    if (file.type.startsWith('image/')) {
      setEvidencePreview(URL.createObjectURL(file));
    } else {
      setEvidencePreview(null);
    }
  };

  const handleRemoveFile = () => {
    if (evidencePreview && evidencePreview.startsWith('blob:')) {
      URL.revokeObjectURL(evidencePreview);
    }
    setEvidenceFile(null);
    setEvidencePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    if (!reporterName.trim()) {
      setErrorMessage('Nama lengkap pelapor wajib diisi.');
      return;
    }

    if (!reporterEmail.trim() || !validateEmail(reporterEmail)) {
      setErrorMessage('Alamat email yang valid wajib diisi.');
      return;
    }

    if (!category) {
      setErrorMessage('Silakan pilih kategori aduan terlebih dahulu.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Deskripsi atau kronologi kejanggalan wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('reporter_name', reporterName.trim());
      formData.append('reporter_email', reporterEmail.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      if (evidenceFile) {
        formData.append('evidence', evidenceFile);
      }

      const response = await api.post(`/campaigns/${campaign.id}/reports`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const successMessage =
        response.data?.message ||
        'Terima kasih. Laporan aduan Anda berhasil dikirim dan akan segera diinvestigasi oleh Tim Audit ActGiving.';

      onReportSuccess(successMessage);
      onClose();
    } catch (err: any) {
      console.error('Gagal mengirim laporan aduan kampanye:', err);
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        setErrorMessage(errors[firstKey][0]);
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Gagal mengirim laporan aduan. Pastikan koneksi ke server aktif dan coba kembali.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-600 to-amber-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shrink-0">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-100">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Pengaduan Publik (REP-01)</span>
              </div>
              <h3 className="text-base font-bold text-white truncate">
                Laporkan Kampanye Ini
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal Laporan"
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Info Kampanye Target */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed min-w-0">
              <div className="font-bold text-slate-900 line-clamp-1">
                {campaign.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Identitas pelapor dijaga kerahasiaannya. Laporan akan ditindaklanjuti oleh Tim Audit ActGiving.
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* 1. Nama Lengkap */}
          <div>
            <label htmlFor="report-name" className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama Lengkap <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="report-name"
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all text-slate-900"
              />
            </div>
          </div>

          {/* 2. Email */}
          <div>
            <label htmlFor="report-email" className="block text-xs font-bold text-slate-700 mb-1.5">
              Alamat Email <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="report-email"
                type="email"
                required
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="contoh: pelapor@email.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all text-slate-900"
              />
            </div>
          </div>

          {/* 3. Dropdown Kategori Aduan */}
          <div>
            <label htmlFor="report-category" className="block text-xs font-bold text-slate-700 mb-1.5">
              Kategori Aduan <span className="text-rose-600">*</span>
            </label>
            <select
              id="report-category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all text-slate-900 font-medium"
            >
              <option value="">-- Pilih Kategori Aduan --</option>
              {REPORT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Textarea Deskripsi / Kronologi Kejanggalan */}
          <div>
            <label htmlFor="report-description" className="block text-xs font-bold text-slate-700 mb-1.5">
              Deskripsi / Kronologi Kejanggalan <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <textarea
                id="report-description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan secara detail kejanggalan yang Anda temukan (lokasi tidak valid, foto palsu, indikasi penipuan, dll)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-hidden transition-all text-slate-900 leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* 5. Input File Upload Bukti Foto/Screenshot */}
          <div>
            <label htmlFor="report-evidence" className="block text-xs font-bold text-slate-700 mb-1.5">
              Bukti Pendukung (Foto / Screenshot / PDF — Opsional, Maks. 2MB)
            </label>

            {!evidenceFile ? (
              <label
                htmlFor="report-evidence"
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-2xl bg-slate-50 hover:bg-rose-50/40 transition-colors cursor-pointer text-center"
              >
                <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                <span className="text-xs font-semibold text-slate-700">
                  Klik untuk unggah bukti foto atau PDF
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Format: JPG, JPEG, PNG, WEBP, PDF (Maks. 2MB)
                </span>
                <input
                  ref={fileInputRef}
                  id="report-evidence"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {evidencePreview ? (
                    <img
                      src={evidencePreview}
                      alt="Pratinjau Bukti"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {evidenceFile.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {(evidenceFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Hapus file bukti"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirim Laporan...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Laporan Aduan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
