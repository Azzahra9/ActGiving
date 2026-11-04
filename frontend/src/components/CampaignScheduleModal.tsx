import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, Calendar, Clock, Plus, Pencil, Trash2, CheckCircle2, 
  AlertCircle, FileText, Sparkles, Layers, RefreshCw
} from 'lucide-react';
import { Campaign, CampaignSchedule } from '../types';
import campaignService from '../services/campaignService';

interface CampaignScheduleModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedulesUpdated?: () => void;
}

export const CampaignScheduleModal: React.FC<CampaignScheduleModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onSchedulesUpdated,
}) => {
  const [schedules, setSchedules] = useState<CampaignSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | number | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [descriptionTasks, setDescriptionTasks] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);
  };

  const fetchSchedules = useCallback(async () => {
    if (!campaign) return;
    setIsLoading(true);
    try {
      const data = await campaignService.getCampaignSchedules(campaign.id);
      setSchedules(data);
    } catch (err) {
      console.error('Gagal mengambil jadwal kampanye:', err);
    } finally {
      setIsLoading(false);
    }
  }, [campaign]);

  useEffect(() => {
    if (isOpen && campaign) {
      fetchSchedules();
      resetForm();
    }
  }, [isOpen, campaign, fetchSchedules]);

  const resetForm = () => {
    setEditingScheduleId(null);
    setTitle('');
    setEventDate(campaign?.eventDate && !campaign.eventDate.includes('Segera') ? '' : '');
    setStartTime('08:00');
    setEndTime('16:00');
    setDescriptionTasks('');
  };

  const handleEditClick = (sched: CampaignSchedule) => {
    setEditingScheduleId(sched.id);
    setTitle(sched.title);
    setEventDate(sched.event_date ? String(sched.event_date).substring(0, 10) : '');
    setStartTime(sched.start_time ? sched.start_time.substring(0, 5) : '08:00');
    setEndTime(sched.end_time ? sched.end_time.substring(0, 5) : '16:00');
    setDescriptionTasks(sched.description_tasks || '');
    // Scroll smoothly to top of form
    const formElem = document.getElementById('schedule-form-container');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    if (!title.trim() || !eventDate) {
      showFeedback('Judul misi dan tanggal kegiatan wajib diisi.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        event_date: eventDate,
        start_time: startTime || null,
        end_time: endTime || null,
        description_tasks: descriptionTasks.trim() || null,
      };

      if (editingScheduleId) {
        await campaignService.updateCampaignSchedule(campaign.id, editingScheduleId, payload);
        showFeedback('Jadwal kegiatan berhasil diperbarui!', 'success');
      } else {
        await campaignService.createCampaignSchedule(campaign.id, payload);
        showFeedback('Jadwal kegiatan harian baru berhasil ditambahkan!', 'success');
      }

      resetForm();
      await fetchSchedules();
      onSchedulesUpdated?.();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Gagal menyimpan jadwal. Silakan periksa kembali formulir Anda.';
      showFeedback(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (scheduleId: string | number, schedTitle: string) => {
    if (!campaign) return;
    if (!window.confirm(`Hapus jadwal kegiatan "${schedTitle}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      await campaignService.deleteCampaignSchedule(campaign.id, scheduleId);
      showFeedback('Jadwal kegiatan berhasil dihapus.', 'success');
      if (editingScheduleId === scheduleId) {
        resetForm();
      }
      await fetchSchedules();
      onSchedulesUpdated?.();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Gagal menghapus jadwal kegiatan.';
      showFeedback(errMsg, 'error');
    }
  };

  // Helper date formatter
  const formatIndoDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Manajemen Jadwal & Misi Lapangan
            </span>
            <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {schedules.length} Sesi Terjadwal
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold line-clamp-1">{campaign.title}</h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            Atur agenda harian, penugasan per tanggal, dan instruksi tugas langsung untuk para relawan yang telah disetujui.
          </p>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className={`p-3 text-xs sm:text-sm font-medium flex items-center gap-2 shrink-0 ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-b border-rose-200'
          }`}>
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Content Body: Form & Schedule List */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Section 1: Form Tambah / Edit */}
          <div id="schedule-form-container" className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                {editingScheduleId ? (
                  <>
                    <Pencil className="w-4 h-4 text-amber-600" />
                    <span>Edit Jadwal / Misi Harian</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>Tambah Jadwal / Misi Harian Baru</span>
                  </>
                )}
              </h3>
              {editingScheduleId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Judul Kegiatan / Misi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Agenda / Misi Harian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Penyaluran Bantuan Sembako Kloter 1 & Asesmen Lapangan"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Mulai (WIB)
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Selesai (WIB)
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Rincian Tugas & SOP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rincian Tugas & Instruksi Relawan
                </label>
                <textarea
                  rows={3}
                  value={descriptionTasks}
                  onChange={(e) => setDescriptionTasks(e.target.value)}
                  placeholder="Contoh: 
• 08:00 - Briefing safety dan pembagian rompi relawan di tenda logistik
• 09:30 - Distribusi paket ke warga RT 01-04
• 13:00 - Rekapitulasi serah terima dan dokumentasi foto"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-y"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Tips: Rincian ini akan langsung tampil di kartu &quot;Jadwal Lapangan&quot; para relawan yang disetujui.
                </span>
              </div>

              {/* Tombol Simpan */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {editingScheduleId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : editingScheduleId ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Perbarui Jadwal</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Simpan Jadwal Misi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Daftar Jadwal Saat Ini */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Daftar Misi / Jadwal Harian Terbit</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {schedules.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={fetchSchedules}
                disabled={isLoading}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium cursor-pointer"
                title="Muat Ulang Jadwal"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {isLoading && schedules.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span>Memuat data jadwal kampanye...</span>
              </div>
            ) : schedules.length > 0 ? (
              <div className="space-y-3">
                {schedules.map((sched, idx) => (
                  <div
                    key={sched.id}
                    className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-4 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {formatIndoDate(sched.event_date)}
                        </span>
                        {(sched.start_time || sched.end_time) && (
                          <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {sched.start_time ? sched.start_time.substring(0, 5) : '08:00'} - {sched.end_time ? sched.end_time.substring(0, 5) : 'Selesai'} WIB
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          #Misi-{idx + 1}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {sched.title}
                      </h4>

                      {sched.description_tasks ? (
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                          {sched.description_tasks}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Belum ada catatan tugas tambahan untuk misi ini.
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                      <button
                        type="button"
                        onClick={() => handleEditClick(sched)}
                        className="p-2 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        title="Edit Jadwal"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sched.id, sched.title)}
                        className="p-2 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Belum Ada Jadwal / Misi Harian</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Kampanye ini belum memiliki agenda harian spesifik. Gunakan formulir di atas untuk membuat jadwal kegiatan tanggal tertentu agar terhubung langsung ke dashboard relawan Anda.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Perubahan jadwal langsung disinkronkan ke seluruh relawan.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Selesai & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

export default CampaignScheduleModal;
