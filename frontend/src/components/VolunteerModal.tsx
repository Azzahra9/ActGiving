import React, { useState } from 'react';
import { X, Users, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, Send, AlertCircle } from 'lucide-react';
import { Campaign, UserProfile } from '../types';

interface VolunteerModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onVolunteerSuccess: (campaignId: string) => void;
  currentUser?: UserProfile;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onVolunteerSuccess,
  currentUser
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [skills, setSkills] = useState('');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (isOpen && currentUser && currentUser.role !== 'guest') {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setWhatsapp(currentUser.phone || '');
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !campaign) return null;

  const remainingQuota = (campaign.targetVolunteers || 0) - (campaign.filledVolunteers || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreed) {
      setErrorMessage('Anda wajib mencentang persetujuan komitmen kehadiran di lokasi.');
      return;
    }
    if (!whatsapp.trim()) {
      setErrorMessage('Nomor WhatsApp aktif wajib diisi untuk koordinasi grup panitia.');
      return;
    }

    setErrorMessage('');
    setIsSuccess(true);
    onVolunteerSuccess(campaign.id);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setSkills('');
    setHasAgreed(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/60">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Pendaftaran Relawan Lapangan</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
              {campaign.title}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
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
                    Email Aktif
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
                    WhatsApp (Wajib)
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
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Lamaran Relawan Lapangan</span>
            </button>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Pendaftaran Relawan Berhasil Dikirim!
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Terima kasih <strong className="text-slate-800">{fullName || 'Kawan'}</strong>! Data lamaranmu telah diteruskan ke inisiator <strong className="text-slate-800">{campaign.initiatorName}</strong>. Kuota relawan telah diperbarui secara atomik.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 text-left space-y-1">
              <div className="font-semibold text-slate-800">Langkah Selanjutnya:</div>
              <div>1. Undangan grup WhatsApp panitia akan dikirimkan ke {whatsapp}.</div>
              <div>2. E-Sertifikat keikutsertaan resmi akan terbit pasca-kegiatan selesai.</div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Tutup & Kembali
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
