import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Building2, CreditCard, User, FileText, 
  X, AlertCircle, CheckCircle2, RefreshCw, Wallet, ArrowRight, ShieldCheck, Info
} from 'lucide-react';
import { Campaign, DisbursementRecord } from '../types';
import api from '../lib/axios';
import { formatRupiah } from '../utils/format';

interface DisbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onSuccess: (disbursement: DisbursementRecord, message: string) => void;
}

const COMMON_BANKS = [
  { code: 'BCA', name: 'BCA (Bank Central Asia)' },
  { code: 'MANDIRI', name: 'Bank Mandiri' },
  { code: 'BNI', name: 'BNI (Bank Negara Indonesia)' },
  { code: 'BRI', name: 'BRI (Bank Rakyat Indonesia)' },
  { code: 'BSI', name: 'BSI (Bank Syariah Indonesia)' },
  { code: 'CIMB', name: 'CIMB Niaga' },
  { code: 'PERMATA', name: 'Bank Permata' },
  { code: 'JAGO', name: 'Bank Jago' },
  { code: 'OTHER', name: 'Bank Lainnya...' },
];

export const DisbursementModal: React.FC<DisbursementModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [customBankName, setCustomBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hitung saldo yang dapat dicairkan
  const collectedFunds = campaign?.collectedFunds || 0;
  
  // Hitung total pending dan approved disbursements jika ada data riwayat
  const pendingOrApprovedTotal = (campaign?.disbursements || [])
    .filter(d => d.status === 'pending' || d.status === 'approved')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const availableBalance = Math.max(0, collectedFunds - pendingOrApprovedTotal);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setSelectedBank('BCA');
      setCustomBankName('');
      setAccountNumber('');
      setAccountName('');
      setReason('');
      setErrorMessage(null);
    }
  }, [isOpen, campaign]);

  if (!isOpen || !campaign) return null;

  const numericAmount = Number(amount.replace(/\D/g, '')) || 0;

  const handleQuickAmount = (val: number) => {
    setAmount(String(val));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numericAmount < 10000) {
      setErrorMessage('Nominal pencairan minimal adalah Rp 10.000.');
      return;
    }

    if (availableBalance > 0 && numericAmount > availableBalance) {
      setErrorMessage(
        `Nominal pencairan (${formatRupiah(numericAmount)}) melebihi sisa dana yang dapat ditarik (${formatRupiah(availableBalance)}).`
      );
      return;
    }

    const finalBankName = selectedBank === 'OTHER' ? customBankName.trim() : selectedBank;
    if (!finalBankName) {
      setErrorMessage('Nama bank tujuan pencairan wajib dipilih atau diisi.');
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMessage('Nomor rekening tujuan pencairan wajib diisi.');
      return;
    }

    if (!accountName.trim()) {
      setErrorMessage('Nama pemilik rekening sesuai buku tabungan wajib diisi.');
      return;
    }

    if (!reason.trim()) {
      setErrorMessage('Alasan atau rencana penggunaan dana wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post(`/campaigns/${campaign.id}/disbursements`, {
        amount: numericAmount,
        bank_name: finalBankName,
        account_number: accountNumber.trim(),
        bank_account: accountNumber.trim(),
        account_name: accountName.trim(),
        reason: reason.trim(),
      });

      const data = response.data?.data;
      const successMsg = response.data?.message || 'Pengajuan pencairan berhasil dicatat dan menunggu persetujuan admin';
      onSuccess(data, successMsg);
      onClose();
    } catch (err: any) {
      console.error('Gagal mengajukan pencairan dana:', err);
      const msg = err.response?.data?.message || 'Terjadi kesalahan saat memproses pengajuan pencairan dana.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white shrink-0 shadow-xs">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-sans">
                Ajukan Pencairan Dana (DIS-01)
              </h3>
              <p className="text-xs text-emerald-100 line-clamp-1">
                {campaign.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Card Saldo & Info Kampanye */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                Saldo Tersedia yang Dapat Ditarik:
              </span>
              <strong className="text-sm font-bold text-emerald-700 font-sans">
                {formatRupiah(availableBalance > 0 ? availableBalance : collectedFunds)}
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-emerald-200/60 text-emerald-800">
              <div>
                <span className="text-emerald-700/80 block">Total Donasi Terkumpul:</span>
                <span className="font-bold text-slate-800">{formatRupiah(collectedFunds)}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-700/80 block">Target Donasi:</span>
                <span className="font-bold text-slate-800">{formatRupiah(campaign.targetFunds || 0)}</span>
              </div>
            </div>

            {pendingOrApprovedTotal > 0 && (
              <div className="text-[10px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5 mt-1">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Sedang ada proses pencairan lain sebesar {formatRupiah(pendingOrApprovedTotal)}.</span>
              </div>
            )}
          </div>

          {/* Alert Error jika ada */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* 1. Input Nominal Pencairan */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Nominal Pencairan Dana (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                Rp
              </span>
              <input
                type="text"
                required
                value={numericAmount > 0 ? numericAmount.toLocaleString('id-ID') : amount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setAmount(raw);
                  setErrorMessage(null);
                }}
                placeholder="Contoh: 5.000.000"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-medium mr-1">Pilih cepat:</span>
              <button
                type="button"
                onClick={() => handleQuickAmount(availableBalance > 0 ? availableBalance : collectedFunds)}
                className="px-2 py-0.8 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-300 transition-colors"
              >
                100% Saldo
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(Math.floor((availableBalance > 0 ? availableBalance : collectedFunds) * 0.5))}
                className="px-2 py-0.8 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                50% Saldo
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(1000000)}
                className="px-2 py-0.8 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                Rp 1 Juta
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(5000000)}
                className="px-2 py-0.8 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                Rp 5 Juta
              </button>
            </div>
          </div>

          {/* 2. Bank & Rekening Tujuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Bank Tujuan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedBank}
                  onChange={(e) => {
                    setSelectedBank(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {COMMON_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBank === 'OTHER' && (
                <input
                  type="text"
                  required
                  value={customBankName}
                  onChange={(e) => setCustomBankName(e.target.value)}
                  placeholder="Ketik nama bank (cth: Bank Sumut)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 mt-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Nomor Rekening <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Nomor rekening bank"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Nama Pemilik Rekening */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Nama Pemilik Rekening <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => {
                  setAccountName(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Nama lengkap sesuai buku tabungan / rekening yayasan"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              * Pastikan nama sesuai dengan identitas legalitas pemohon untuk verifikasi transfer bank.
            </p>
          </div>

          {/* 4. Alasan / Rencana Penggunaan Dana */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Rencana Penggunaan / Alasan Pencairan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Contoh: Pengadaan 150 paket sembako tanggap darurat, sewa transportasi logistik ke posko bencana tahap ke-1..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Jaminan Integritas & Transparansi */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Standar Akuntabilitas & Verifikasi ACID</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Pengajuan pencairan akan diverifikasi oleh Administrator sebelum dana disalurkan. Setelah dana digunakan, inisiator wajib mengunggah Laporan Pertanggungjawaban (LPJ) beserta bukti kuitansi fisik.
            </p>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses Pengajuan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ajukan Pencairan Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
