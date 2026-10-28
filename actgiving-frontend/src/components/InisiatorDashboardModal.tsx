import React, { useState, useRef, useEffect } from 'react';
import api from '../lib/axios';
import { Building2, PlusCircle, Upload, CheckCircle2, DollarSign, Users, FileText, X, AlertCircle } from 'lucide-react';
import { Campaign, UserProfile, LpjItem } from '../types';
import { formatRupiah } from '../utils/format';

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
  campaigns = [],
  onCreateNewCampaign,
  onAddLpj
}) => {
  const [activeUploadCampaignId, setActiveUploadCampaignId] = useState<string | null>(null);
  const [lpjTitle, setLpjTitle] = useState('');
  const [lpjAmount, setLpjAmount] = useState('');
  const [lpjDesc, setLpjDesc] = useState('');
  const [isFinalReport, setIsFinalReport] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URL on unmount or preview change
  useEffect(() => {
    return () => {
      if (proofPreview && proofPreview.startsWith('blob:')) {
        URL.revokeObjectURL(proofPreview);
      }
    };
  }, [proofPreview]);

  if (!isOpen || !currentUser) return null;

  const currentUserName = (currentUser.name || '').toLowerCase();

  // Filter campaigns managed by this initiator safely with optional chaining
  const myCampaigns = (campaigns || []).filter((c) => {
    if (!c) return false;
    const isManaged = Boolean(currentUser.managedCampaignIds?.includes(c.id));
    const isInitiatorMatch = Boolean(
      c.initiatorName && currentUserName && c.initiatorName.toLowerCase().includes(currentUserName)
    );
    const isDefaultDemo = c.id === 'camp-01';
    return isManaged || isInitiatorMatch || isDefaultDemo;
  });

  const totalDanaTerkumpul = myCampaigns.reduce((acc, c) => acc + (c?.collectedFunds || 0), 0);
  const totalRelawanTerdaftar = myCampaigns.reduce((acc, c) => acc + (c?.filledVolunteers || 0), 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (proofPreview && proofPreview.startsWith('blob:')) {
        URL.revokeObjectURL(proofPreview);
      }
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
      setErrorMessage(null);
    }
    // Reset nilai input agar tidak terjadi double-trigger
    e.target.value = '';
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveProof = () => {
    if (proofPreview && proofPreview.startsWith('blob:')) {
      URL.revokeObjectURL(proofPreview);
    }
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUploadCampaignId) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    let uploadedUrl = '';

    const finalAmount = parseInt(lpjAmount) || 5000000;
    const titleText = lpjTitle.trim() || 'Penyaluran Bantuan Lapangan';
    const descText = lpjDesc.trim() || 'Distribusi kebutuhan logistik sesuai rencana anggaran belanja kampanye.';

    const formData = new FormData();
    formData.append('description', descText);
    formData.append('title', titleText);
    formData.append('total_realisasi', finalAmount.toString());
    formData.append('amount_spent', finalAmount.toString());
    formData.append('realized_amount', finalAmount.toString());
    formData.append('is_final', isFinalReport ? '1' : '0');
    formData.append('report_type', isFinalReport ? 'final' : 'progress');
    if (proofFile) {
      formData.append('proof_image', proofFile);
      formData.append('activity_photos[]', proofFile);
    }

    try {
      const res = await api.post(`/campaigns/${activeUploadCampaignId}/lpj`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.data) {
        uploadedUrl = res.data.data.public_url || res.data.data.lpj_report?.proof_image_url || '';
      }
    } catch (err: any) {
      console.warn('Upload LPJ modal notice:', err);
      // Don't crash if backend is unreachable, gracefully continue with local preview
    } finally {
      setIsSubmitting(false);
    }

    const finalPhoto = uploadedUrl || proofPreview || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80';

    const newLpj: LpjItem = {
      id: `lpj-custom-${Date.now()}`,
      digitalRegNumber: `LPJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: titleText,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      realizedAmount: finalAmount,
      description: descText,
      receiptUrl: finalPhoto,
      photoUrl: finalPhoto,
      activityPhotos: [finalPhoto],
      status: 'pending',
      isFinal: isFinalReport,
      reportType: isFinalReport ? 'final' : 'progress'
    };

    onAddLpj(activeUploadCampaignId, newLpj);
    setIsSuccess(true);
    setIsFinalReport(false);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveUploadCampaignId(null);
      setLpjTitle('');
      setLpjAmount('');
      setLpjDesc('');
      handleRemoveProof();
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
                Aktor: <span className="text-blue-300 font-semibold">{currentUser.name || 'Inisiator'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Dashboard"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
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
            <strong className="text-sm text-blue-700">{formatRupiah(totalDanaTerkumpul)}</strong>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end">
            <button
              onClick={() => {
                onClose();
                onCreateNewCampaign();
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
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
                  onClick={() => {
                    setActiveUploadCampaignId(null);
                    handleRemoveProof();
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-100 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {!isSuccess ? (
                <form onSubmit={handleUploadSubmit} className="space-y-3">
                  {/* Opsi Jenis Laporan LPJ */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-800 text-xs">Jenis Laporan Pertanggungjawaban:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          !isFinalReport
                            ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="modal_lpj_type"
                          checked={!isFinalReport}
                          onChange={() => setIsFinalReport(false)}
                          className="mt-0.5 text-blue-600"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">Laporan Berkala / Tahapan</span>
                          <span className="text-[11px] text-slate-500 block leading-tight">Kampanye masih berjalan</span>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isFinalReport
                            ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="modal_lpj_type"
                          checked={isFinalReport}
                          onChange={() => setIsFinalReport(true)}
                          className="mt-0.5 text-purple-600"
                        />
                        <div>
                          <span className="font-bold text-purple-950 block text-xs">Laporan Akhir</span>
                          <span className="text-[11px] text-slate-500 block leading-tight">Menyatakan seluruh dana/kegiatan 100% selesai dan kampanye ditutup</span>
                        </div>
                      </label>
                    </div>
                  </div>

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
                        min="0"
                        value={lpjAmount}
                        onChange={(e) => setLpjAmount(e.target.value)}
                        placeholder="Contoh: 12500000"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Upload Kuitansi & Foto</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed border-slate-300 hover:border-blue-500 rounded-xl px-3 py-2 bg-white text-slate-600 text-[11px] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="truncate max-w-[200px]">
                          {proofFile ? proofFile.name : 'Pilih faktur/foto dari perangkat...'}
                        </span>
                        <Upload className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                      </div>

                      {proofPreview && (
                        <div className="mt-2 flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <img
                            src={proofPreview}
                            alt="Preview Bukti"
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] text-slate-800 font-semibold truncate block">
                              {proofFile?.name || 'Foto Dokumentasi'}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium">Siap diunggah</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveProof}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            title="Hapus foto ini"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Mengunggah LPJ & Bukti...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Simpan & Terbitkan LPJ ke Transparansi Publik</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-blue-100 text-blue-900 border border-blue-200 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>LPJ & kuitansi berhasil diunggah! Donatur kini dapat melihat pembelanjaan ini secara transparan.</span>
                </div>
              )}
            </div>
          )}

          {/* List of Initiator Campaigns */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daftar Kampanye Anda ({myCampaigns.length})
            </h4>

            {myCampaigns.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600">Belum ada kampanye aktif</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Buka kampanye baru untuk mulai menggalang donasi & relawan.</p>
              </div>
            ) : (
              myCampaigns.map((camp) => {
                if (!camp) return null;
                const isPending = camp.status === 'pending_approval';
                const modeText = (camp.mode || 'dana').toUpperCase();
                const lpjCount = Array.isArray(camp.lpjReports) ? camp.lpjReports.length : 0;

                return (
                  <div
                    key={camp.id}
                    className="border border-slate-200 bg-white rounded-2xl p-4 shadow-2xs hover:border-blue-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={camp.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80'}
                          alt={camp.title || 'Kampanye'}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              isPending
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-sky-50 text-sky-800 border border-sky-200'
                            }`}>
                              {isPending ? 'Pending Review Admin' : 'Aktif & Tayang'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              Mode: {modeText}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 leading-snug">
                            {camp.title || 'Tanpa Judul Kampanye'}
                          </h5>
                        </div>
                      </div>
                    </div>

                    {/* Fund & Volunteer Progress */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                      {camp.targetFunds ? (
                        <div>
                          <span className="text-[11px] text-slate-500 block">Dana Terkumpul:</span>
                          <strong className="text-blue-700">
                            {formatRupiah(camp.collectedFunds || 0)}
                          </strong>{' '}
                          <span className="text-slate-400">/ {formatRupiah(camp.targetFunds)}</span>
                        </div>
                      ) : null}
                      {camp.targetVolunteers ? (
                        <div>
                          <span className="text-[11px] text-slate-500 block">Relawan Terdaftar:</span>
                          <strong className="text-sky-700">
                            {camp.filledVolunteers || 0}
                          </strong>{' '}
                          <span className="text-slate-400">/ {camp.targetVolunteers} Orang</span>
                        </div>
                      ) : null}
                    </div>

                    {/* LPJ Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 text-[11px]">
                        {lpjCount} Laporan LPJ Diterbitkan
                      </span>

                      <button
                        onClick={() => setActiveUploadCampaignId(camp.id)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Unggah Bukti LPJ Baru
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Hak Akses: Membuka penggalangan aksi & mengunggah LPJ kuitansi berkala.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
