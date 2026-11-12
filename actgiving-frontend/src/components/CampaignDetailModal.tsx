import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  Coins,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Share2,
  Flag,
  Check
} from 'lucide-react';
import { Campaign } from '../types';
import { formatRupiah } from '../utils/format';
import campaignService from '../services/campaignService';

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onDonateClick: (campaign: Campaign) => void;
  onVolunteerClick: (campaign: Campaign) => void;
  onViewLpjClick: (campaign: Campaign) => void;
  onReportClick: (campaign: Campaign) => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onDonateClick,
  onVolunteerClick,
  onViewLpjClick,
  onReportClick,
}) => {
  const [detailedCampaign, setDetailedCampaign] = useState<Campaign | null>(null);
  const [isCopiedShare, setIsCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !campaign) {
      setDetailedCampaign(null);
      return;
    }

    setDetailedCampaign(campaign);
    setIsCopiedShare(false);

    // Muat detail lengkap (termasuk schedules/LPJ) dari backend secara non-blocking
    campaignService
      .getCampaignDetail(campaign.id)
      .then((fresh) => {
        if (fresh) setDetailedCampaign(fresh);
      })
      .catch(() => {
        // Tetap tampilkan data awal dari props jika offline/mock
      });
  }, [isOpen, campaign]);

  if (!isOpen || !campaign) return null;

  const active = detailedCampaign || campaign;
  const isDanaMode = active.mode === 'dana';
  const isRelawanMode = active.mode === 'relawan';
  const isKeduanyaMode = active.mode === 'keduanya';
  const isClosed = active.status === 'closed' || active.status === 'completed';

  const fundPercent =
    active.targetFunds && active.collectedFunds
      ? Math.min(100, Math.round((active.collectedFunds / active.targetFunds) * 100))
      : 0;

  const volunteerPercent =
    active.targetVolunteers && active.filledVolunteers
      ? Math.min(100, Math.round((active.filledVolunteers / active.targetVolunteers) * 100))
      : 0;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?campaign=${active.id}`;
    const shareText = `Dukung kampanye kebaikan "${active.title}" di ActGiving!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: active.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Abaikan jika user cancel dialog share bawaan browser
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setIsCopiedShare(true);
      setTimeout(() => setIsCopiedShare(false), 2500);
    } catch {
      // Fallback jika clipboard tidak tersedia
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-100 shrink-0">
          <img
            src={active.imageUrl}
            alt={active.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/30 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-950/75 backdrop-blur-xs text-white border border-white/10">
              {active.category}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-brand-blue text-white shadow-sm">
              {isDanaMode
                ? 'Mode: Butuh Dana'
                : isRelawanMode
                ? 'Mode: Butuh Relawan'
                : 'Mode: Dana & Relawan'}
            </span>
            {isClosed && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Selesai & Sah
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Detail Kampanye"
            className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Bottom Title on Hero Image */}
          <div className="absolute bottom-4 inset-x-5 text-white">
            <div className="flex items-center gap-1.5 text-xs text-sky-300 font-medium mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{active.locationCity}, Indonesia</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-snug">
              {active.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Inisiator & Jadwal Singkat */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-brand-blue font-bold text-sm shrink-0">
                {active.initiatorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{active.initiatorName}</span>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-[11px] text-slate-500">
                  {active.initiatorRole || 'Inisiator Kampanye'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {active.eventDate && (
                <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                  <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                  <span>{active.eventDate}</span>
                </span>
              )}
              {active.eventTime && (
                <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                  <Clock className="w-3.5 h-3.5 text-brand-blue" />
                  <span>{active.eventTime}</span>
                </span>
              )}
            </div>
          </div>

          {/* Progress Metrik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(isDanaMode || isKeduanyaMode) && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-brand-blue" />
                    Dana Terkumpul
                  </span>
                  <span className="font-bold text-brand-blue">{fundPercent}%</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {formatRupiah(active.collectedFunds || 0)}
                  <span className="text-xs font-normal text-slate-500 ml-1.5">
                    dari {formatRupiah(active.targetFunds || 0)}
                  </span>
                </div>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-blue-100">
                  <div
                    className="h-full bg-brand-blue rounded-full transition-all duration-500"
                    style={{ width: `${fundPercent}%` }}
                  />
                </div>
              </div>
            )}

            {(isRelawanMode || isKeduanyaMode) && (
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-600" />
                    Kuota Relawan
                  </span>
                  <span className="font-bold text-sky-700">{volunteerPercent}%</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {active.filledVolunteers || 0} / {active.targetVolunteers || 0}
                  <span className="text-xs font-normal text-slate-500 ml-1.5">Relawan Bergabung</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-sky-100">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${volunteerPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Deskripsi Lengkap */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detail & Latar Belakang Kampanye
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {active.description || 'Tidak ada deskripsi tambahan.'}
            </p>
          </div>

          {/* Action CTA & Tombol Bagikan */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {!isClosed && (isDanaMode || isKeduanyaMode) && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDonateClick(active);
                  }}
                  className="flex-1 min-w-[160px] py-2.5 px-4 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Coins className="w-4 h-4" />
                  <span>Donasi Sekarang</span>
                </button>
              )}

              {!isClosed && (isRelawanMode || isKeduanyaMode) && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onVolunteerClick(active);
                  }}
                  className="flex-1 min-w-[160px] py-2.5 px-4 bg-white hover:bg-blue-50 text-brand-blue border border-brand-blue rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Daftar Jadi Relawan</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewLpjClick(active);
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-brand-blue" />
                <span>Lihat LPJ ({active.lpjReports?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isCopiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Tautan Disalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-600" />
                    <span>Bagikan</span>
                  </>
                )}
              </button>
            </div>

            {/* Tombol Lapor Kampanye di bagian bawah di bawah tombol Bagikan */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                Menemukan indikasi penipuan atau kampanye fiktif?
              </span>
              <button
                type="button"
                onClick={() => onReportClick(active)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Laporkan Kampanye Ini</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
