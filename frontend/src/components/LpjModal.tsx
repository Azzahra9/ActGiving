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
  Layers
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Formulir LPJ Digital & Transparansi Publik Terverifikasi</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 truncate max-w-lg mt-0.5">
              {campaign.title || 'Laporan Akuntabilitas Kampanye'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Linimasa LPJ"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[78vh] overflow-y-auto space-y-6">
          
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
                  ...(Array.isArray(report.activityPhotos) ? report.activityPhotos : [])
                ];
                const photos = Array.from(new Set(rawPhotos.filter(Boolean))) as string[];
                const budgetItems = Array.isArray(report.budgetItems) ? report.budgetItems : [];
                const totalCalculatedBudget = budgetItems.reduce((sum, item) => sum + (item?.amount || 0), 0);

                return (
                  <div 
                    key={report.id} 
                    className="border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs space-y-4"
                  >
                    {/* Header Report */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                            {report.digitalRegNumber || 'LPJ-DIGITAL'}
                          </span>

                          {/* Badge Pembeda Jenis LPJ */}
                          {report.isFinal || report.reportType === 'final' ? (
                            <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300 flex items-center gap-1 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-purple-600" />
                              LPJ Akhir (Final)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-300 flex items-center gap-1">
                              <Layers className="w-3 h-3 text-sky-600" />
                              LPJ Progress (Tahap {verifiedLpjReports.length - verifiedLpjReports.indexOf(report)})
                            </span>
                          )}

                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Form Sah & Terverifikasi
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {report.title || 'Penyaluran Aksi Lapangan'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{report.date || '-'}</span>
                      </div>
                    </div>

                    {/* Quick Metrics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Total Realisasi:</span>
                        <span className="font-bold text-blue-700 text-sm">
                          {formatRupiah(report.realizedAmount || 0)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 block">Penerima Manfaat:</span>
                        <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {report.beneficiariesCount || 100}+ Jiwa
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 block">Relawan Lapangan:</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {report.volunteersInvolved || campaign.filledVolunteers || 10} Orang
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 block">Lokasi Kegiatan:</span>
                        <span className="font-semibold text-slate-800 text-xs truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          {report.fieldLocation || campaign.locationCity || 'Posko Aksi'}
                        </span>
                      </div>
                    </div>

                    {/* Deskripsi & Narasi */}
                    {report.description && (
                      <div>
                        <span className="text-xs font-semibold text-slate-700 block mb-1">
                          Catatan & Narasi Pelaksanaan:
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                          {report.description}
                        </p>
                      </div>
                    )}

                    {/* Rincian Pos Belanja Terstruktur (Form Digital) */}
                    {budgetItems.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <ReceiptText className="w-4 h-4 text-blue-600" />
                          Rincian Alokasi Pos Belanja (Form Digital Langsung):
                        </span>
                        
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold">
                              <tr>
                                <th className="py-2 px-3">Nama Kebutuhan / Pos Pengeluaran</th>
                                <th className="py-2 px-3 text-right">Nominal Realisasi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {budgetItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3 text-slate-800 font-medium">
                                    {item?.name || 'Pos Pembelanjaan'}
                                  </td>
                                  <td className="py-2 px-3 text-right font-bold text-slate-900">
                                    {formatRupiah(item?.amount || 0)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-blue-50/60 font-bold text-blue-900">
                                <td className="py-2 px-3">Total Akumulasi Pos Belanja</td>
                                <td className="py-2 px-3 text-right text-blue-700">
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
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-sky-600" />
                            Dokumentasi Foto Kegiatan Lapangan ({photos.length} Foto):
                          </span>
                          <span className="text-[11px] text-slate-400">Klik foto untuk perbesar</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {photos.map((photo, pIdx) => (
                            <div 
                              key={pIdx}
                              onClick={() => setSelectedPhotoPreview(photo)}
                              className="group relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs"
                            >
                              <img
                                src={photo}
                                alt={`Dokumentasi Lapangan ${pIdx + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                                <ZoomIn className="w-4 h-4" />
                                <span>Perbesar</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Akuntabilitas Form */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                      <span>Inisiator: <strong>{campaign.initiatorName || 'Inisiator Kampanye'}</strong></span>
                      <span className="text-blue-600 font-medium">Tersinkronisasi ke Landing Page & Katalog Publik</span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
