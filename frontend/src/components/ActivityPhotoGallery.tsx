import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Users, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers,
  FileText
} from 'lucide-react';
import { Campaign } from '../types';
import { formatRupiah } from '../utils/format';

interface ActivityPhotoGalleryProps {
  campaigns: Campaign[];
  onViewLpj: (campaign: Campaign) => void;
}

export interface ActivityItem {
  id: string;
  lpjId: string;
  photoUrl: string;
  allPhotos: string[];
  title: string;
  campaignId: string;
  campaignTitle: string;
  category: string;
  date: string;
  realizedAmount: number;
  beneficiariesCount?: number;
  volunteersInvolved?: number;
  fieldLocation: string;
  description: string;
  digitalRegNumber?: string;
  isFinal: boolean;
  reportType: 'progress' | 'final';
  campaign: Campaign;
}

export const ActivityPhotoGallery: React.FC<ActivityPhotoGalleryProps> = ({
  campaigns,
  onViewLpj
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // 1. Ekstrak seluruh laporan LPJ yang berstatus 'verified' atau 'sah'
  // 2. Mendukung kampanye 'active', 'closed', atau 'completed'
  // 3. Fallback foto, judul, dan data lapangan yang tangguh agar kartu selalu muncul
  const activityItems: ActivityItem[] = (campaigns || [])
    .filter((campaign) => campaign && (campaign.status === 'active' || campaign.status === 'closed' || campaign.status === 'completed'))
    .flatMap((campaign) => {
      const reports = Array.isArray(campaign.lpjReports) ? campaign.lpjReports : [];
      return reports
        .filter((lpj) => lpj && (lpj.status === 'verified' || lpj.status === 'sah'))
        .map((lpj) => {
          const rawPhotos = [
            lpj.photoUrl,
            ...(Array.isArray(lpj.activityPhotos) ? lpj.activityPhotos : []),
            ...(Array.isArray((lpj as any).photos) ? (lpj as any).photos : []),
            lpj.receiptUrl,
          ];
          const photos = Array.from(new Set(rawPhotos.filter(Boolean))) as string[];
          const primaryPhoto =
            photos[0] ||
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';

          const rawDate = lpj.date || lpj.createdAt || (lpj as any).created_at || (lpj as any).tanggal_kegiatan || (lpj as any).report_date;
          let formattedDate = 'Terbaru';
          if (rawDate) {
            try {
              const d = new Date(rawDate);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
              } else {
                formattedDate = String(rawDate);
              }
            } catch {
              formattedDate = String(rawDate);
            }
          }

          const isFinal = Boolean(
            lpj.isFinal || 
            lpj.reportType === 'final' || 
            (lpj as any).is_final || 
            (lpj as any).report_type === 'final'
          );

          const reportType = (lpj.reportType || (lpj as any).report_type || (isFinal ? 'final' : 'progress')) as 'progress' | 'final';
          const reportLocation = lpj.fieldLocation || (lpj as any).location || (lpj as any).field_location || campaign.locationCity || 'Posko Aksi Lapangan';

          return {
            id: `lpj-${lpj.id}`,
            lpjId: String(lpj.id),
            photoUrl: primaryPhoto,
            allPhotos: photos.length > 0 ? photos : [primaryPhoto],
            title: lpj.title || `Dokumentasi Aksi: ${campaign.title}`,
            campaignId: campaign.id,
            campaignTitle: campaign.title,
            category: campaign.category,
            date: formattedDate,
            realizedAmount: Number(lpj.realizedAmount || (lpj as any).amount_spent || (lpj as any).realized_amount || 0),
            beneficiariesCount: Number(lpj.beneficiariesCount || (lpj as any).beneficiaries_count || 0),
            volunteersInvolved: Number(lpj.volunteersInvolved || (lpj as any).volunteers_involved || 0),
            fieldLocation: reportLocation,
            description: lpj.description || 'Penyaluran bantuan kemanusiaan dan dokumentasi pelaksanaan aksi relawan di lokasi posko.',
            digitalRegNumber: lpj.digitalRegNumber || (lpj as any).digital_signature_hash || `LPJ-${lpj.id}`,
            isFinal,
            reportType,
            campaign
          };
        });
    })
    .filter((item, index, self) => index === self.findIndex((t) => t.lpjId === item.lpjId));

  const categories = [
    'Semua',
    'Bencana Alam',
    'Pendidikan',
    'Kesehatan',
    'Panti Asuhan'
  ];

  const filteredItems = selectedCategory === 'Semua'
    ? activityItems
    : activityItems.filter((item) => item.category === selectedCategory);

  return (
    <section id="galeri-kegiatan" className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Dokumentasi Kegiatan & LPJ Terhubung</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Foto Kegiatan Lapangan & Realisasi Aksi
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Dokumentasi langsung dari lapangan yang diisi oleh inisiator melalui formulir LPJ digital web tanpa dokumen kertas. 
              Klik foto atau kartu untuk langsung membuka dokumen transparansi LPJ digital secara lengkap.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 self-start lg:self-auto text-xs text-slate-600">
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Total <strong>{activityItems.length}</strong> Laporan LPJ Terverifikasi
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
            <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600">Belum ada foto kegiatan lapangan pada kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image Container with Badges - Klik langsung membuka Modal LPJ */}
                <div 
                  className="relative aspect-16/10 bg-slate-100 overflow-hidden cursor-pointer group/img"
                  onClick={() => onViewLpj(item.campaign)}
                  title="Klik untuk membuka formulir LPJ digital lengkap"
                >
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                  {/* Hover Action Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="px-3.5 py-1.5 rounded-xl bg-blue-600/90 text-white text-xs font-bold shadow-lg backdrop-blur-xs flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Buka Formulir LPJ Digital</span>
                    </span>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.allPhotos && item.allPhotos.length > 1 && (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium">
                          {item.allPhotos.length} Foto
                        </span>
                      )}
                      {item.isFinal ? (
                        <span className="px-2 py-1 rounded-lg bg-purple-600/90 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3 h-3 text-purple-200" />
                          LPJ Akhir
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          LPJ Sah
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Image Info: Location dynamically rendered */}
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-200 mb-0.5">
                      <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="truncate">{item.fieldLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="text-blue-700 font-medium truncate">{item.campaignTitle}</span>
                    </div>

                    <h4 
                      onClick={() => onViewLpj(item.campaign)}
                      className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                      title="Klik untuk membuka formulir LPJ digital"
                    >
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Impact & Transparency Stats */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      {item.realizedAmount > 0 && (
                        <span className="inline-flex items-center gap-1 text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          <Coins className="w-3.5 h-3.5 text-blue-600" />
                          {formatRupiah(item.realizedAmount)}
                        </span>
                      )}
                      {item.beneficiariesCount && item.beneficiariesCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          {item.beneficiariesCount} Penerima
                        </span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => onViewLpj(item.campaign)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline transition-colors cursor-pointer"
                    >
                      <span>Buka Form LPJ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
