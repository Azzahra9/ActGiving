import React from 'react';
import { CircleDollarSign, Users, Award, ShieldCheck, Activity } from 'lucide-react';
import { formatRupiah, formatNumber } from '../utils/format';

interface LiveCounterProps {
  totalDonationRp: number;
  totalVolunteers: number;
  completedPrograms: number;
  lastUpdatedText?: string;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({
  totalDonationRp,
  totalVolunteers,
  completedPrograms,
  lastUpdatedText = 'Realtime Update Sandbox'
}) => {
  return (
    <section id="transparansi-counter" className="py-12 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Grid Accent & Blue Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>Pusat Transparansi Penyaluran</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-['Space_Grotesk'] text-white">
              Dampak Nyata Komunitas ActGiving
            </h3>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-slate-700/80 self-start sm:self-auto shadow-xs">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>{lastUpdatedText}</span>
          </div>
        </div>

        {/* 3 Main Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Donasi Terhimpun */}
          <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700/80 backdrop-blur-xs relative group hover:border-sky-500/50 hover:bg-slate-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-sky-400 flex items-center justify-center mb-4 border border-blue-500/30">
              <CircleDollarSign className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Total Donasi Simulasi Terhimpun
            </p>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] text-sky-300">
              {formatRupiah(totalDonationRp)}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Diperbarui secara atomik saat checkout guest QRIS/VA diselesaikan.
            </p>
          </div>

          {/* Card 2: Total Relawan Aktif */}
          <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700/80 backdrop-blur-xs relative group hover:border-blue-500/50 hover:bg-slate-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/30">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Total Relawan Aktif Bergabung
            </p>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] text-sky-200">
              {formatNumber(totalVolunteers)} <span className="text-lg font-normal text-slate-400">Orang</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Mewakili aksi kerelawanan nyata yang terjun langsung di berbagai kota.
            </p>
          </div>

          {/* Card 3: Program Tuntas Terverifikasi */}
          <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700/80 backdrop-blur-xs relative group hover:border-sky-400/50 hover:bg-slate-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 text-blue-300 flex items-center justify-center mb-4 border border-blue-500/30">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Program Tuntas Terverifikasi
            </p>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] text-blue-200">
              {completedPrograms} <span className="text-lg font-normal text-slate-400">Aksi Selesai</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Telah melalui verifikasi LPJ nota kuitansi dan foto penyaluran oleh Admin.
            </p>
          </div>

        </div>

        {/* Security & Accountability Trust Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Jaminan Transaksi Aman & Laporan LPJ Terbuka</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Konfirmasi Donasi Instan</span>
            <span>•</span>
            <span>Penyaluran Terverifikasi 100%</span>
          </div>
        </div>

      </div>
    </section>
  );
};
