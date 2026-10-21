import React, { useState } from 'react';
import { HeartHandshake, Calendar, Clock, MapPin, MessageSquare, Award, CheckCircle2, X, ExternalLink, Compass } from 'lucide-react';
import { Campaign, UserProfile } from '../types';

interface RelawanActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  campaigns: Campaign[];
  onExploreCampaigns: () => void;
}

export const RelawanActivityModal: React.FC<RelawanActivityModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  campaigns,
  onExploreCampaigns
}) => {
  const [showCertificate, setShowCertificate] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter campaigns that this volunteer joined
  const joinedCampaigns = campaigns.filter(
    (c) => currentUser.joinedCampaignIds?.includes(c.id) || c.id === 'camp-01' || c.id === 'camp-02'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Aktivitas Relawan Saya</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded border border-indigo-600">
                  Relawan Terdaftar
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Aktor: <span className="text-white font-semibold">{currentUser.name}</span> (Relawan Lapangan)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-indigo-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-indigo-200 object-cover"
            />
            <div>
              <p className="font-bold">{currentUser.name}</p>
              <p className="text-[11px] text-indigo-700">{currentUser.email} • {currentUser.city}</p>
            </div>
          </div>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200 font-semibold text-[11px]">
            {joinedCampaigns.length} Kegiatan Terdaftar
          </span>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jadwal Penugasan & Aksi Sosial
            </h4>
            <span className="text-[11px] text-slate-500">Status: Terverifikasi Panitia</span>
          </div>

          {joinedCampaigns.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Belum Ada Kegiatan yang Diikuti</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Pilih aksi relawan lapangan di katalog yang sesuai dengan minat dan kriteria kamu.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreCampaigns();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                Cari Aksi Kerelawanan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {joinedCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="border border-slate-200 bg-white rounded-2xl p-4 shadow-2xs hover:border-indigo-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={camp.imageUrl}
                        alt={camp.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Terkonfirmasi Hadir
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {camp.category}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 leading-snug">
                          {camp.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Inisiator: {camp.initiatorName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date & Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{camp.eventDate || 'Jadwal Ditentukan Panitia'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{camp.eventTime || '08:00 - 15:00 WIB'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{camp.locationCity} (Radius ~{camp.distanceKm} km)</span>
                    </div>
                  </div>

                  {/* Actions for this volunteer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <a
                      href="https://chat.whatsapp.com/demo-actgiving-relawan"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Grup Koordinasi WA
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => setShowCertificate(camp.id)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      E-Sertifikat Digital
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certificate Preview Popup Modal */}
          {showCertificate && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Sertifikat Partisipasi Aksi Sosial</span>
                </div>
                <button
                  onClick={() => setShowCertificate(null)}
                  className="text-amber-700 hover:text-amber-950 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-amber-800">
                Diterbitkan secara digital oleh <strong>ActGiving Foundation</strong> atas nama relawan <strong>{currentUser.name}</strong> atas dedikasi dan jam terbang sosial di lapangan.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Hak Akses: Memantau jadwal penugasan & grup koordinasi relawan lapangan.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
