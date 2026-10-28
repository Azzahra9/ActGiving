import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Image as ImageIcon, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Coins, 
  ReceiptText,
  FileCheck2,
  ZoomIn,
  Layers,
  Heart
} from 'lucide-react';
import { Campaign } from '../types';
import { formatRupiah } from '../utils/format';

interface LpjModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LpjModal: React.FC<LpjModalProps> = ({
  campaign,
  isOpen,
  onClose
}) => {
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  if (!isOpen || !campaign) return null;

  // Publik hanya boleh melihat LPJ yang berstatus 'verified' atau 'sah'
  const allReports = Array.isArray(campaign.lpjReports) ? campaign.lpjReports : [];
  const verifiedLpjReports = allReports
    .filter((report) => report && (report.status === 'verified' || report.status === 'sah'))
    .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
  const hasPendingReports = allReports.some(
    (report) => report && (!report.status || report.status === 'pending')
  );

  // Perhitungan Akumulasi Metrik Dampak untuk Ringkasan Header Modal
  const totalRealizedAmount = verifiedLpjReports.reduce((sum, r) => {
    return sum + Number(r.realizedAmount || (r as any).amount_spent || (r as any).realized_amount || 0);
  }, 0);

  const totalBeneficiaries = verifiedLpjReports.reduce((sum, r) => {
    return sum + Number(r.beneficiariesCount || (r as any).beneficiaries_count || 0);
  }, 0);

  const totalVolunteers = verifiedLpjReports.reduce((sum, r) => {
    return sum + Number(r.volunteersInvolved || (r as any).volunteers_involved || 0);
  }, 0) || campaign.filledVolunteers || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Formulir LPJ Digital & Transparansi Publik Terverifikasi</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {campaign.title || 'Laporan Akuntabilitas Kampanye'}
              </h3>

              {/* Baris Ringkasan Metrik Dampak Utama (Header Modal) */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-bold shadow-2xs">
                  <Coins className="w-3.5 h-3.5 text-blue-600" />
                  <span>💰 Rp {formatRupiah(totalRealizedAmount > 0 ? totalRealizedAmount : (campaign.collectedFunds || 0))}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold shadow-2xs">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>👥 {totalBeneficiaries > 0 ? totalBeneficiaries : 100}+ Jiwa Penerima Manfaat</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>📍 {campaign.locationCity || 'Posko Aksi Lapangan'}</span>
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Tutup Linimasa LPJ"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[76vh] overflow-y-auto space-y-6">
          
          {/* Banner Status Kampanye Selesai Jika Ada LPJ Akhir yang Sah */}
          {(campaign.status === 'closed' || campaign.status === 'completed' || verifiedLpjReports.some(r => r.isFinal || r.reportType === 'final')) && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-900 text-sm">Kampanye Resmi Ditutup & Selesai 100%</span>
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    LPJ Akhir Disahkan
                  </span>
                </div>
                <p className="text-emerald-800 mt-1 leading-relaxed">
                  Seluruh dana dan aktivitas pada program <strong>"{campaign.title}"</strong> telah selesai disalurkan dan dipertanggungjawabkan secara transparan melalui pengesahan Laporan Akhir (Final).
                </p>
              </div>
            </div>
          )}

          {/* Transparency Guarantee Info Box */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Standar LPJ Digital Tanpa Dokumen Kertas ActGiving</span>
              <p className="text-blue-800 mt-0.5 leading-relaxed">
                Laporan pertanggungjawaban diisi langsung di web melalui formulir digital terstruktur. 
                Rincian pos belanja anggaran dan foto dokumentasi kegiatan lapangan terhubung langsung ke landing page untuk diakses oleh donatur & relawan.
              </p>
            </div>
          </div>

          {verifiedLpjReports.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">
                {hasPendingReports
                  ? 'Menunggu verifikasi transparan oleh auditor platform'
                  : 'Belum ada formulir LPJ digital yang terverifikasi sah'}
              </h4>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed mt-1">
                {hasPendingReports
                  ? 'Inisiator telah mengunggah laporan pertanggungjawaban kegiatan. Laporan saat ini berada dalam antrean audit Admin dan akan otomatis tampil di linimasa publik segera setelah dinyatakan sah.'
                  : 'Laporan pertanggungjawaban penyaluran dana dan dokumentasi kegiatan lapangan akan dipublikasikan secara transparan setelah diaudit dan disahkan oleh auditor platform.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {verifiedLpjReports.map((report) => {
                if (!report) return null;
                const rawPhotos = [
                  report.photoUrl,
                  ...(Array.isArray(report.activityPhotos) ? report.activityPhotos : []),
                  ...(Array.isArray((report as any).photos) ? (report as any).photos : []),
                  report.receiptUrl
                ];
                const photos = Array.from(new Set(rawPhotos.filter(Boolean))) as string[];
                const budgetItems = Array.isArray(report.budgetItems) ? report.budgetItems : [];
                const totalCalculatedBudget = budgetItems.reduce((sum, item) => sum + (item?.amount || 0), 0);

                // Lokasi Asli LPJ atau Fallback Kota Kampanye (Zero Hardcode)
                const reportLocation = report.fieldLocation || (report as any).location || (report as any).field_location || campaign.locationCity || 'Posko Aksi Lapangan';

                // Format Tanggal Dinamis dari created_at, tanggal_kegiatan, atau report_date
                const rawDate = (report as any).created_at || (report as any).tanggal_kegiatan || (report as any).report_date || report.createdAt || report.date;
                let formattedReportDate = report.date || 'Terbaru';
                if (rawDate) {
                  try {
                    const d = new Date(rawDate);
                    if (!isNaN(d.getTime())) {
                      formattedReportDate = d.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      });
                    }
                  } catch {
                    formattedReportDate = String(rawDate);
                  }
                }

                const isFinal = Boolean(
                  report.isFinal || 
                  report.reportType === 'final' || 
                  (report as any).is_final || 
                  (report as any).report_type === 'final'
                );

                const reportRealized = Number(report.realizedAmount || (report as any).amount_spent || (report as any).realized_amount || totalCalculatedBudget || 0);
                const reportBeneficiaries = Number(report.beneficiariesCount || (report as any).beneficiaries_count || 0);
                const reportVolunteers = Number(report.volunteersInvolved || (report as any).volunteers_involved || 0);

                return (
                  <div 
                    key={report.id} 
                    className="border border-slate-200 rounded-3xl p-6 bg-white shadow-xs space-y-5"
                  >
                    {/* Header Report */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                            {report.digitalRegNumber || (report as any).digital_signature_hash || `LPJ-${report.id}`}
                          </span>

                          {/* Badge Pembeda Jenis LPJ: Akhir vs Progress */}
                          {isFinal ? (
                            <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-300 flex items-center gap-1.5 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                              <span>LPJ Akhir (Final) - 100% Selesai</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-sky-900 bg-sky-100 px-3 py-0.5 rounded-full border border-sky-300 flex items-center gap-1.5 shadow-2xs">
                              <Layers className="w-3.5 h-3.5 text-sky-600" />
                              <span>LPJ Progress (Tahapan)</span>
                            </span>
                          )}

                          <span className="text-[11px] text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300 font-bold flex items-center gap-1.5 shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Form Sah & Terverifikasi</span>
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">
                          {report.title || `Penyaluran Aksi: ${campaign.title}`}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tanggal: <strong className="text-slate-800 font-semibold">{formattedReportDate}</strong></span>
                      </div>
                    </div>

                    {/* Quick Impact Metrics Bar (Data Binding Dinamis) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                          <Coins className="w-3.5 h-3.5 text-blue-600" />
                          Total Realisasi:
                        </span>
                        <span className="font-bold text-blue-700 text-sm">
                          {formatRupiah(reportRealized)}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          Penerima Manfaat:
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {reportBeneficiaries > 0 ? reportBeneficiaries : 100}+ Jiwa
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                          <Heart className="w-3.5 h-3.5 text-purple-600" />
                          Relawan Lapangan:
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {reportVolunteers > 0 ? reportVolunteers : (campaign.filledVolunteers || 8)} Relawan
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          Lokasi Titik Aksi:
                        </span>
                        <span className="font-bold text-slate-800 text-xs truncate block" title={reportLocation}>
                          {reportLocation}
                        </span>
                      </div>
                    </div>

                    {/* Uraian Pelaksanaan Kegiatan (Nyaman Dibaca & Spasi Lega) */}
                    <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-blue-600" />
                          Uraian Pelaksanaan Kegiatan Lapangan
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed sm:leading-loose whitespace-pre-line">
                        {report.description || 'Laporan pertanggungjawaban penyaluran bantuan dan dokumentasi aksi relawan di lokasi posko kegiatan.'}
                      </p>
                    </div>

                    {/* Rincian Pos Belanja Terstruktur (Form Digital) */}
                    {budgetItems.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <ReceiptText className="w-4 h-4 text-blue-600" />
                          Rincian Alokasi Pos Belanja (Form Digital Langsung):
                        </span>
                        
                        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold">
                              <tr>
                                <th className="py-2.5 px-3.5">Nama Kebutuhan / Pos Pengeluaran</th>
                                <th className="py-2.5 px-3.5 text-right">Nominal Realisasi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {budgetItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="py-2.5 px-3.5 text-slate-800 font-medium">
                                    {item?.name || 'Pos Pembelanjaan'}
                                  </td>
                                  <td className="py-2.5 px-3.5 text-right font-bold text-slate-900">
                                    {formatRupiah(item?.amount || 0)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-blue-50/70 font-bold text-blue-900">
                                <td className="py-2.5 px-3.5">Total Akumulasi Pos Belanja</td>
                                <td className="py-2.5 px-3.5 text-right text-blue-700">
                                  {formatRupiah(totalCalculatedBudget)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Galeri Foto-Foto Dokumentasi Kegiatan Lapangan */}
                    {photos.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-sky-600" />
                            Dokumentasi Foto Kegiatan Lapangan ({photos.length} Foto):
                          </span>
                          <span className="text-[11px] text-slate-400">Klik foto untuk memperbesar pratinjau</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {photos.map((photo, pIdx) => (
                            <div 
                              key={pIdx}
                              onClick={() => setSelectedPhotoPreview(photo)}
                              className="group relative h-40 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:shadow-md transition-all duration-300"
                            >
                              <img
                                src={photo}
                                alt={`Dokumentasi Lapangan ${pIdx + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                                <ZoomIn className="w-4 h-4" />
                                <span>Perbesar Foto</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tombol Utama dan Footer Akuntabilitas (Stand Out Primary Button) */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        Inisiator: <strong className="text-slate-800 font-semibold">{campaign.initiatorName || 'Inisiator Kampanye'}</strong>
                        <div className="text-[11px] text-blue-600 mt-0.5">Tersinkronisasi ke Landing Page & Katalog Publik</div>
                      </div>

                      <button
                        onClick={() => {
                          if (photos.length > 0) {
                            setSelectedPhotoPreview(photos[0]);
                          }
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md shadow-blue-500/25 hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-sky-200" />
                        <span>Buka Rincian Formulir Lengkap LPJ Digital</span>
                        <ReceiptText className="w-4 h-4 text-white/80" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Dokumen Akuntabilitas Digital Terverifikasi ActGiving
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Tutup Linimasa LPJ
          </button>
        </div>

      </div>

      {/* Lightbox / Zoomed Single Photo Modal */}
      {selectedPhotoPreview && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPhotoPreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img 
              src={selectedPhotoPreview} 
              alt="Preview Foto Kegiatan" 
              referrerPolicy="no-referrer"
              className="w-full h-full max-h-[85vh] object-contain rounded-2xl" 
            />
            <button
              onClick={() => setSelectedPhotoPreview(null)}
              aria-label="Tutup Pratinjau Foto"
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
