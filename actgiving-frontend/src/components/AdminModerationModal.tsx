import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, FileText, Eye, Check, ExternalLink, Building2, MapPin } from 'lucide-react';
import { Campaign } from '../types';
import { formatRupiah } from '../utils/format';

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  onApproveCampaign: (campaignId: string) => void;
  onRejectCampaign: (campaignId: string) => void;
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  onApproveCampaign,
  onRejectCampaign
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'lpj'>('campaigns');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const pendingCampaigns = campaigns.filter((c) => c.status === 'pending_approval');
  const activeCampaigns = campaigns.filter((c) => c.status !== 'pending_approval' && c.status !== 'rejected');

  const handleApprove = (camp: Campaign) => {
    onApproveCampaign(camp.id);
    setNotification(`Kampanye "${camp.title}" berhasil disetujui & dipublikasikan ke katalog!`);
    setTimeout(() => setNotification(null), 4000);
    if (selectedCampaign?.id === camp.id) {
      setSelectedCampaign(null);
    }
  };

  const handleReject = (camp: Campaign) => {
    onRejectCampaign(camp.id);
    setNotification(`Kampanye "${camp.title}" ditolak karena tidak memenuhi kriteria verifikasi.`);
    setTimeout(() => setNotification(null), 4000);
    if (selectedCampaign?.id === camp.id) {
      setSelectedCampaign(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Panel Moderasi & Audit Admin</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700">
                  Panel Khusus Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Aktor: <span className="text-white font-semibold">Administrator / Moderator Platform (Azzahra, S.Kom)</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="sr-only">Tutup</span>
            ✕
          </button>
        </div>

        {/* Tab navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex gap-4 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-2 px-3 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'campaigns' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Verifikasi Kampanye Baru</span>
            {pendingCampaigns.length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingCampaigns.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('lpj')}
            className={`py-2 px-3 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'lpj' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Audit LPJ & Kuitansi Penyaluran</span>
          </button>
        </div>

        {/* Alert Notification */}
        {notification && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'campaigns' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Antrean Verifikasi Proposal Galang Aksi
                  </h4>
                  <p className="text-xs text-slate-500">
                    Admin wajib memvalidasi kelayakan, KTP/legalitas inisiator, dan keabsahan program sebelum tayang ke publik.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                  {pendingCampaigns.length} Menunggu Review
                </span>
              </div>

              {pendingCampaigns.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <CheckCircle className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">Semua Kampanye Sudah Diverifikasi</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Tidak ada antrean proposal kampanye baru saat ini. Kampanye yang disetujui telah tampil aktif di katalog publik.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCampaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="border border-amber-200 bg-amber-50/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={camp.imageUrl}
                          alt={camp.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                              Status: Pending Approval
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              Mode: {camp.mode.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {camp.category}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-900 leading-snug">
                            {camp.title}
                          </h5>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {camp.description}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                            <span className="flex items-center gap-1 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {camp.initiatorName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {camp.locationCity}
                            </span>
                            {camp.targetFunds && (
                              <>
                                <span>•</span>
                                <span>Target: Rp {camp.targetFunds.toLocaleString('id-ID')}</span>
                              </>
                            )}
                            {camp.targetVolunteers && (
                              <>
                                <span>•</span>
                                <span>Kebutuhan: {camp.targetVolunteers} Relawan</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          onClick={() => handleReject(camp)}
                          className="px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 rounded-xl border border-rose-300 transition-colors flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          Tolak
                        </button>
                        <button
                          onClick={() => handleApprove(camp)}
                          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          Setujui & Terbitkan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'lpj' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Audit Bukti Penyaluran Dana & Kuitansi
                </h4>
                <p className="text-xs text-slate-500">
                  Verifikasi faktur pembelanjaan dan foto dokumentasi kegiatan dari inisiator untuk menjaga indeks transparansi publik.
                </p>
              </div>

              <div className="space-y-3">
                {activeCampaigns
                  .filter((c) => Array.isArray(c?.lpjReports) && c.lpjReports.length > 0)
                  .map((camp) => (
                    <div key={camp.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {camp.category}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 mt-1">{camp.title}</h5>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {camp.lpjReports?.length} Laporan Penyaluran
                        </span>
                      </div>

                      <div className="space-y-2">
                        {camp.lpjReports?.map((report) => (
                          <div
                            key={report.id}
                            className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{report.title}</span>
                                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                                  Terverifikasi Auditor
                                </span>
                              </div>
                              <p className="text-slate-500 text-[11px]">{report.description}</p>
                              <div className="text-slate-600 font-medium">
                                Nominal: <strong className="text-emerald-700">{formatRupiah(report.realizedAmount || 0)}</strong> • Tanggal: {report.date}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={report.receiptUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Kuitansi
                              </a>
                              <a
                                href={report.photoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Dokumentasi
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Kewenangan: Audit kelayakan & mitigasi penyalahgunaan dana sumbangan.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Selesai Moderasi
          </button>
        </div>

      </div>
    </div>
  );
};
