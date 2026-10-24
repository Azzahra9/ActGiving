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
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { Campaign, Category } from '../types';
import { formatRupiah } from '../utils/format';

interface ActivityPhotoGalleryProps {
  campaigns: Campaign[];
  onViewLpj: (campaign: Campaign) => void;
}

export const ActivityPhotoGallery: React.FC<ActivityPhotoGalleryProps> = ({
  campaigns,
  onViewLpj
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePhotoModal, setActivePhotoModal] = useState<{
    photoUrl: string;
    title: string;
    campaignTitle: string;
    location?: string;
    date: string;
    realizedAmount: number;
    beneficiariesCount?: number;
    volunteersInvolved?: number;
    description: string;
    campaign: Campaign;
  } | null>(null);

  // Flatten all LPJ items across campaigns to create the connected live gallery
  const activityItems = campaigns.flatMap((campaign) => {
    return (campaign.lpjReports || [])
      .filter((lpj) => lpj.status === 'verified' || lpj.status === 'sah')
      .flatMap((lpj) => {
      // Gather all photos for this LPJ item (photoUrl + any additional activityPhotos)
      const photos = Array.from(
        new Set([lpj.photoUrl, ...(lpj.activityPhotos || [])].filter(Boolean))
      );

      return photos.map((photo, photoIdx) => ({
        id: `${lpj.id}-photo-${photoIdx}`,
        photoUrl: photo,
        lpjId: lpj.id,
        title: lpj.title,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        category: campaign.category,
        date: lpj.date,
        realizedAmount: lpj.realizedAmount,
        beneficiariesCount: lpj.beneficiariesCount,
        volunteersInvolved: lpj.volunteersInvolved,
        fieldLocation: lpj.fieldLocation || `${campaign.locationCity}`,
        description: lpj.description,
        digitalRegNumber: lpj.digitalRegNumber,
        campaign
      }));
    });
  });

  const categories = [
    'Semua',
    'Bencana Alam',
    'Lingkungan Hidup',
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
              Semua foto terhubung langsung dengan rincian anggaran dan dampak penerima manfaat.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 self-start lg:self-auto text-xs text-slate-600">
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Total <strong>{activityItems.length}</strong> Foto Kegiatan Terverifikasi
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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
                {/* Image Container with Badges */}
                <div 
                  className="relative aspect-16/10 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setActivePhotoModal(item)}
                >
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide">
                      {item.category}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      LPJ Digital
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
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
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="text-blue-700 font-medium truncate">{item.campaignTitle}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
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
                          <Coins className="w-3 h-3 text-blue-600" />
                          {formatRupiah(item.realizedAmount)}
                        </span>
                      )}
                      {item.beneficiariesCount && item.beneficiariesCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                          <Users className="w-3 h-3 text-slate-500" />
                          {item.beneficiariesCount} Penerima
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onViewLpj(item.campaign)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline transition-colors"
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

      {/* Lightbox / Full-size Photo Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="pr-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>Dokumentasi Kegiatan Lapangan LPJ</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {activePhotoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Photo View */}
            <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={activePhotoModal.photoUrl}
                alt={activePhotoModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Modal Details & Connection */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{activePhotoModal.location || 'Lokasi Titik Aksi'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{activePhotoModal.date}</span>
                </div>
                {activePhotoModal.realizedAmount > 0 && (
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    <Coins className="w-3.5 h-3.5 text-blue-600" />
                    <span>Realisasi Form: {formatRupiah(activePhotoModal.realizedAmount)}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-900 block">Uraian Pelaksanaan Kegiatan:</span>
                <p className="text-slate-600 leading-relaxed">{activePhotoModal.description}</p>
                <p className="text-[11px] text-slate-500 pt-1 font-medium">
                  Kampanye Induk: <strong className="text-slate-800">{activePhotoModal.campaignTitle}</strong>
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    const camp = activePhotoModal.campaign;
                    setActivePhotoModal(null);
                    onViewLpj(camp);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Buka Rincian Formulir Lengkap LPJ Digital</span>
                </button>

                <button
                  onClick={() => setActivePhotoModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
