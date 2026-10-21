import React, { useState } from 'react';
import { Building2, PlusCircle, Upload, CheckCircle2, DollarSign, Users, FileText, X, AlertCircle } from 'lucide-react';
import { Campaign, UserProfile, LpjItem } from '../types';

interface InisiatorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  campaigns: Campaign[];
  onCreateNewCampaign: () => void;
  onAddLpj: (campaignId: string, lpj: LpjItem) => void;
}

export const InisiatorDashboardModal: React.FC<InisiatorDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  campaigns,
  onCreateNewCampaign,
  onAddLpj
}) => {
  const [activeUploadCampaignId, setActiveUploadCampaignId] = useState<string | null>(null);
  const [lpjTitle, setLpjTitle] = useState('');
  const [lpjAmount, setLpjAmount] = useState('');
  const [lpjDesc, setLpjDesc] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter campaigns managed by this initiator (or matches initiator name or ID)
  const myCampaigns = campaigns.filter(
    (c) =>
      currentUser.managedCampaignIds?.includes(c.id) ||
      c.initiatorName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      c.id === 'camp-01'
  );

  const totalDanaTerkumpul = myCampaigns.reduce((acc, c) => acc + (c.collectedFunds || 0), 0);
  const totalRelawanTerdaftar = myCampaigns.reduce((acc, c) => acc + (c.filledVolunteers || 0), 0);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUploadCampaignId) return;

    const newLpj: LpjItem = {
      id: `lpj-custom-${Date.now()}`,
      title: lpjTitle || 'Penyaluran Bantuan Lapangan',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      realizedAmount: parseInt(lpjAmount) || 5000000,
      description: lpjDesc || 'Distribusi kebutuhan logistik sesuai rencana anggaran belanja kampanye.',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      photoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80'
    };

    onAddLpj(activeUploadCampaignId, newLpj);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveUploadCampaignId(null);
      setLpjTitle('');
      setLpjAmount('');
      setLpjDesc('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-sans">Dashboard Manajemen Inisiator</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-700/60">
                  Inisiator Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aktor: <span className="text-blue-300 font-semibold">{currentUser.name}</span> (Inisiator Kampanye)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div>
            <span className="text-slate-500 text-[11px] block">Kampanye Dikelola</span>
            <strong className="text-sm text-slate-900">{myCampaigns.length} Aksi</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Donasi Terkumpul</span>
            <strong className="text-sm text-blue-700">Rp {totalDanaTerkumpul.toLocaleString('id-ID')}</strong>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end">
            <button
              onClick={() => {
                onClose();
                onCreateNewCampaign();
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-blue-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              Buka Aksi Baru
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Upload LPJ Form (If triggered) */}
          {activeUploadCampaignId && (
            <div className="bg-blue-50/60 border-2 border-blue-200 rounded-2xl p-4 text-xs animate-in fade-in space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-950 font-bold">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Unggah LPJ & Kuitansi Penyaluran Dana</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveUploadCampaignId(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
              </div>

              {!isSuccess ? (
                <form onSubmit={handleUploadSubmit} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Judul Penyaluran / Belanja</label>
                    <input
                      type="text"
                      required
                      value={lpjTitle}
                      onChange={(e) => setLpjTitle(e.target.value)}
                      placeholder="Contoh: Penyaluran Sembako 100 KK & Obat-obatan"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nominal Terealisasi (Rp)</label>
                      <input
                        type="number"
                        required
                        value={lpjAmount}
                        onChange={(e) => setLpjAmount(e.target.value)}
                        placeholder="Contoh: 12500000"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Upload Kuitansi & Foto</label>
                      <div className="border border-dashed border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-500 text-[11px] flex items-center justify-between">
                        <span>faktur_pembelanjaan.jpg</span>
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deskripsi & Catatan Penyaluran</label>
                    <textarea
                      rows={2}
                      required
                      value={lpjDesc}
                      onChange={(e) => setLpjDesc(e.target.value)}
                      placeholder="Jelaskan rincian barang yang dibeli dan lokasi distribusi..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm shadow-blue-600/20"
                  >
                    Simpan & Terbitkan LPJ ke Transparansi Publik
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-blue-100 text-blue-900 border border-blue-200 rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>LPJ & kuitansi berhasil diunggah! Donatur kini dapat melihat pembelanjaan ini secara transparan.</span>
                </div>
              )}
            </div>
          )}

          {/* List of Initiator Campaigns */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daftar Kampanye Anda
            </h4>

            {myCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="border border-slate-200 bg-white rounded-2xl p-4 shadow-2xs hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={camp.imageUrl}
                      alt={camp.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          camp.status === 'pending_approval'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}>
                          {camp.status === 'pending_approval' ? 'Pending Review Admin' : 'Aktif & Tayang'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Mode: {camp.mode.toUpperCase()}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {camp.title}
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Fund & Volunteer Progress */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                  {camp.targetFunds && (
                    <div>
                      <span className="text-[11px] text-slate-500 block">Dana Terkumpul:</span>
                      <strong className="text-blue-700">
                        Rp {(camp.collectedFunds || 0).toLocaleString('id-ID')}
                      </strong>{' '}
                      <span className="text-slate-400">/ Rp {camp.targetFunds.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {camp.targetVolunteers && (
                    <div>
                      <span className="text-[11px] text-slate-500 block">Relawan Terdaftar:</span>
                      <strong className="text-sky-700">
                        {camp.filledVolunteers || 0}
                      </strong>{' '}
                      <span className="text-slate-400">/ {camp.targetVolunteers} Orang</span>
                    </div>
                  )}
                </div>

                {/* LPJ Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {camp.lpjReports?.length || 0} Laporan LPJ Diterbitkan
                  </span>

                  <button
                    onClick={() => setActiveUploadCampaignId(camp.id)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Unggah Bukti LPJ Baru
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Hak Akses: Membuka penggalangan aksi & mengunggah LPJ kuitansi berkala.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
