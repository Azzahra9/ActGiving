import React from 'react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Coins, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Camera
} from 'lucide-react';
import { Campaign } from '../types';
import { formatRupiah } from '../utils/format';

interface CampaignCardProps {
  campaign: Campaign;
  onDonateClick: (campaign: Campaign) => void;
  onVolunteerClick: (campaign: Campaign) => void;
  onViewLpjClick: (campaign: Campaign) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onDonateClick,
  onVolunteerClick,
  onViewLpjClick
}) => {
  if (!campaign) return null;

  // Mode-specific calculations
  const isDanaMode = campaign.mode === 'dana';
  const isRelawanMode = campaign.mode === 'relawan';
  const isKeduanyaMode = campaign.mode === 'keduanya';

  const fundPercent = campaign.targetFunds && campaign.collectedFunds 
    ? Math.min(100, Math.round((campaign.collectedFunds / campaign.targetFunds) * 100))
    : 0;

  const volunteerPercent = campaign.targetVolunteers && campaign.filledVolunteers
    ? Math.min(100, Math.round((campaign.filledVolunteers / campaign.targetVolunteers) * 100))
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col group">
      
      {/* 1. Thumbnail Image & Floating Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-darkest/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Left Category Badge (Dark Translucent Pill per Figma) */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-950/70 backdrop-blur-xs text-white border border-white/10 shadow-xs">
            {campaign.category}
          </span>
        </div>

        {/* Top-Right Location Pin */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-950/70 backdrop-blur-xs text-white border border-white/10 flex items-center gap-1 shadow-xs">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>{campaign.locationCity}</span>
          </span>
        </div>

        {/* Bottom Badges on Photo */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
          {/* Bottom-Left Mode Badge (Solid Brand Blue) */}
          <div>
            {isDanaMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-brand-blue text-white shadow-md">
                <Coins className="w-3 h-3" />
                Mode: Butuh Dana
              </span>
            )}
            {isRelawanMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-brand-blue text-white shadow-md">
                <Users className="w-3 h-3" />
                Mode: Butuh Relawan
              </span>
            )}
            {isKeduanyaMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-brand-blue text-white shadow-md">
                <Heart className="w-3 h-3" />
                Mode: Dana & Relawan
              </span>
            )}
          </div>

          {/* Bottom-Right Foto LPJ Pill */}
          <button
            onClick={() => onViewLpjClick(campaign)}
            title="Lihat Foto Dokumentasi Kegiatan & Form LPJ"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-950/75 hover:bg-brand-blue text-white backdrop-blur-xs border border-white/15 transition-colors shadow-md cursor-pointer"
          >
            <Camera className="w-3 h-3 text-sky-400" />
            <span>Foto LPJ</span>
          </button>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Pin Line */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-500">{campaign.locationCity}, Indonesia</span>
            <span>•</span>
            <span className="text-[11px] text-slate-400">{campaign.distanceKm || 3} km</span>
          </div>

          {/* Campaign Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-blue transition-colors mb-2">
            {campaign.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {campaign.description}
          </p>
        </div>

        {/* 3. Progress Metric Indicator */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          
          {/* Progress Dana */}
          {(isDanaMode || isKeduanyaMode) && (
            <div>
              <div className="flex justify-between items-baseline text-xs mb-1.5">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {formatRupiah(campaign.collectedFunds || 0)}
                </span>
                <span className="text-slate-400 text-xs">
                  Target {formatRupiah(campaign.targetFunds || 0)}
                </span>
              </div>
              {/* Slim Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-brand-blue"
                  style={{ width: `${fundPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Progress Relawan (if relawan-only mode) */}
          {isRelawanMode && (
            <div>
              <div className="flex justify-between items-baseline text-xs mb-1.5">
                <span className="text-slate-500 text-xs font-medium">Relawan Bergabung</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {campaign.filledVolunteers || 0} / {campaign.targetVolunteers || 0} Kuota
                </span>
              </div>
              {/* Slim Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${volunteerPercent}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* 4. Action Buttons (Clean Figma Styling) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
          
          {/* Mode 1: Hanya Butuh Dana */}
          {isDanaMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDonateClick(campaign)}
                className="flex-1 py-2 px-4 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5" />
                Donasi Sekarang
              </button>
              <button
                onClick={() => onViewLpjClick(campaign)}
                title="Lihat Formulir LPJ Digital & Foto Dokumentasi"
                className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-brand-blue" />
                <span>Foto LPJ</span>
              </button>
            </div>
          )}

          {/* Mode 2: Hanya Butuh Relawan */}
          {isRelawanMode && (
            <button
              onClick={() => onVolunteerClick(campaign)}
              className="w-full py-2.5 px-4 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              Daftar Jadi Relawan
            </button>
          )}

          {/* Mode 3: Dana & Relawan */}
          {isKeduanyaMode && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onDonateClick(campaign)}
                className="py-2 px-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5" />
                Donasi Sekarang
              </button>
              <button
                onClick={() => onVolunteerClick(campaign)}
                className="py-2 px-3 bg-white hover:bg-blue-50/60 text-brand-blue border border-brand-blue rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                Daftar Relawan
              </button>
            </div>
          )}

          {/* 5. Bottom Link for LPJ / Dokumentasi Lapangan */}
          <button
            onClick={() => onViewLpjClick(campaign)}
            className="w-full pt-1.5 text-[11px] text-slate-400 hover:text-brand-blue flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              {isRelawanMode 
                ? 'Lihat Rekapitulasi Rencana Kegiatan & Lokasi' 
                : `Lihat Foto & ${campaign.lpjReports?.length || 1} File Dokumentasi Laporan (LPJ)`}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
