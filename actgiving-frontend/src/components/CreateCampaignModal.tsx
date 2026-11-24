import React, { useState, useEffect } from 'react';
import { 
  X,
  Upload,
  Pencil, 
  PlusCircle, 
  Coins, 
  Users, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  ShieldAlert, 
  Lock, 
  UserCheck,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Campaign, CampaignMode, Category, UserProfile } from '../types';
import api, { getAuthToken, setAuthToken } from '../lib/axios';
import campaignService, { mapBackendCampaignToFrontend } from '../services/campaignService';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCampaign: (newCampaign: Campaign) => void;
  onUpdateCampaign?: (updatedCampaign: Campaign) => void;
  campaignToEdit?: Campaign | null;
  currentUser?: UserProfile;
  onSwitchToInisiator?: () => void;
}



export const INDONESIAN_CITIES = [
  // Sumatera
  'Banda Aceh, Aceh', 'Medan, Sumatera Utara', 'Pematangsiantar, Sumatera Utara',
  'Padang, Sumatera Barat', 'Bukittinggi, Sumatera Barat', 'Pekanbaru, Riau', 'Dumai, Riau',
  'Batam, Kepulauan Riau', 'Tanjungpinang, Kepulauan Riau', 'Jambi, Jambi',
  'Palembang, Sumatera Selatan', 'Prabumulih, Sumatera Selatan', 'Bengkulu, Bengkulu',
  'Bandar Lampung, Lampung', 'Metro, Lampung', 'Pangkal Pinang, Kep. Bangka Belitung',
  // Jawa & Banten
  'Jakarta Pusat, DKI Jakarta', 'Jakarta Selatan, DKI Jakarta', 'Jakarta Barat, DKI Jakarta',
  'Jakarta Timur, DKI Jakarta', 'Jakarta Utara, DKI Jakarta', 'Bandung, Jawa Barat',
  'Bekasi, Jawa Barat', 'Bogor, Jawa Barat', 'Depok, Jawa Barat', 'Cimahi, Jawa Barat',
  'Cirebon, Jawa Barat', 'Sukabumi, Jawa Barat', 'Tasikmalaya, Jawa Barat',
  'Tangerang, Banten', 'Tangerang Selatan, Banten', 'Serang, Banten', 'Cilegon, Banten',
  'Semarang, Jawa Tengah', 'Surakarta (Solo), Jawa Tengah', 'Magelang, Jawa Tengah',
  'Pekalongan, Jawa Tengah', 'Tegal, Jawa Tengah', 'Salatiga, Jawa Tengah',
  'Yogyakarta, D.I. Yogyakarta', 'Sleman, D.I. Yogyakarta', 'Bantul, D.I. Yogyakarta',
  'Surabaya, Jawa Timur', 'Malang, Jawa Timur', 'Kediri, Jawa Timur', 'Blitar, Jawa Timur',
  'Madiun, Jawa Timur', 'Probolinggo, Jawa Timur', 'Pasuruan, Jawa Timur',
  'Batu, Jawa Timur', 'Lumajang, Jawa Timur', 'Jember, Jawa Timur', 'Banyuwangi, Jawa Timur',
  // Bali & Nusa Tenggara
  'Denpasar, Bali', 'Singaraja, Bali', 'Mataram, NTB', 'Bima, NTB',
  'Kupang, NTT', 'Labuan Bajo, NTT',
  // Kalimantan
  'Pontianak, Kalimantan Barat', 'Singkawang, Kalimantan Barat',
  'Palangka Raya, Kalimantan Tengah', 'Sampit, Kalimantan Tengah',
  'Banjarmasin, Kalimantan Selatan', 'Banjarbaru, Kalimantan Selatan',
  'Samarinda, Kalimantan Timur', 'Balikpapan, Kalimantan Timur', 'Bontang, Kalimantan Timur',
  'Tarakan, Kalimantan Utara',
  // Sulawesi
  'Makassar, Sulawesi Selatan', 'Palopo, Sulawesi Selatan', 'Parepare, Sulawesi Selatan',
  'Manado, Sulawesi Utara', 'Bitung, Sulawesi Utara', 'Tomohon, Sulawesi Utara',
  'Palu, Sulawesi Tengah', 'Kendari, Sulawesi Tenggara', 'Baubau, Sulawesi Tenggara',
  'Gorontalo, Gorontalo', 'Mamuju, Sulawesi Barat',
  // Maluku & Papua
  'Ambon, Maluku', 'Tual, Maluku', 'Ternate, Maluku Utara', 'Tidore, Maluku Utara',
  'Jayapura, Papua', 'Sorong, Papua Barat Daya', 'Manokwari, Papua Barat',
  'Merauke, Papua Selatan', 'Timika (Mimika), Papua Tengah', 'Nabire, Papua Tengah'
];

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onAddCampaign,
  onUpdateCampaign,
  campaignToEdit,
  currentUser,
  onSwitchToInisiator
}) => {
  const isAuthorized = currentUser?.role === 'inisiator' || currentUser?.role === 'admin';
  const [mode, setMode] = useState<CampaignMode>('keduanya');
  const [title, setTitle] = useState('');
  const [initiatorName, setInitiatorName] = useState(currentUser?.name || '');
  const [categoriesList, setCategoriesList] = useState<{ id: number; category_name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'new' | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Fetch real categories from Laravel API on modal mount
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCategories(true);
      campaignService.getCategories()
        .then((cats) => {
          if (Array.isArray(cats) && cats.length > 0) {
            setCategoriesList(cats);
            if (campaignToEdit) {
              const matched = cats.find(
                (c) => c.category_name.toLowerCase() === (campaignToEdit.category || '').toLowerCase()
              );
              if (matched) {
                setSelectedCategoryId(matched.id);
                setCategoryName(matched.category_name);
                setIsNewCategoryMode(false);
              } else {
                setSelectedCategoryId('new');
                setCategoryName(campaignToEdit.category || '');
                setIsNewCategoryMode(true);
              }
            } else {
              setSelectedCategoryId(cats[0].id);
              setCategoryName(cats[0].category_name);
              setIsNewCategoryMode(false);
            }
          } else {
            // Database categories kosong di database produksi (tanpa seeder)
            setCategoriesList([]);
            setSelectedCategoryId('new');
            setIsNewCategoryMode(true);
            if (campaignToEdit?.category) {
              setCategoryName(campaignToEdit.category);
            } else {
              setCategoryName('');
            }
          }
        })
        .catch((err) => {
          console.warn('Gagal mengambil kategori dari backend Laravel:', err);
          setCategoriesList([]);
          setSelectedCategoryId('new');
          setIsNewCategoryMode(true);
        })
        .finally(() => {
          setIsLoadingCategories(false);
        });
    }
  }, [isOpen, campaignToEdit]);

  // Support pressing Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleResetAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const [locationCity, setLocationCity] = useState(currentUser?.city || 'Bandung');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran file foto maksimal 5 MB.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrorMessage(null);
    }
  };

  // Mode Dana fields
  const [targetFundsStr, setTargetFundsStr] = useState('25000000');
  const [deadlineDays, setDeadlineDays] = useState(30);

  // Mode Relawan fields
  const [targetVolunteersStr, setTargetVolunteersStr] = useState('20');
  const [activityDate, setActivityDate] = useState(() => {
    // Default: 1 minggu ke depan (YYYY-MM-DD)
    const future = new Date();
    future.setDate(future.getDate() + 7);
    return future.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState('08:00 - 16:00 WIB');
  const [tasksStr, setTasksStr] = useState('Distribusi bantuan, Membantu di posko evakuasi');

  // API Interaction States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (campaignToEdit) {
        setTitle(campaignToEdit.title || '');
        setCategoryName(campaignToEdit.category || '');
        setMode(campaignToEdit.mode || 'keduanya');
        setLocationCity(campaignToEdit.locationCity || 'Bandung');
        setDescription(campaignToEdit.description || '');
        setTargetFundsStr(String(campaignToEdit.targetFunds || 25000000));
        setTargetVolunteersStr(String(campaignToEdit.targetVolunteers || 20));
        setEventTime(campaignToEdit.eventTime || '08:00 - 16:00 WIB');
        setTasksStr(
          Array.isArray(campaignToEdit.taskCriteria)
            ? campaignToEdit.taskCriteria.join(', ')
            : 'Distribusi bantuan, Membantu di posko evakuasi'
        );
        setImagePreview(campaignToEdit.imageUrl || null);
        setImageFile(null);
      } else {
        if (currentUser && currentUser.role !== 'guest') {
          setInitiatorName(currentUser.name);
          if (currentUser.city) setLocationCity(currentUser.city);
        }
        setTitle('');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
      }
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen, campaignToEdit, currentUser]);

  const handleResetAndClose = () => {
    setErrorMessage(null);
    setTitle('');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Strict Anti Double-Submit

    if (!title.trim()) {
      setErrorMessage('Silakan isi judul kampanye aksi terlebih dahulu.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Silakan isi deskripsi & urgensi lapangan kampanye.');
      return;
    }

    const trimmedCatName = categoryName.trim();
    if (isNewCategoryMode || selectedCategoryId === 'new' || !selectedCategoryId) {
      if (!trimmedCatName) {
        setErrorMessage('Silakan isi nama kategori isu kampanye terlebih dahulu.');
        return;
      }
    }

    const backendMode = mode === 'dana' ? 'fund_only' : mode === 'relawan' ? 'volunteer_only' : 'both';
    const targetAmount = mode === 'relawan' ? 0 : parseInt(targetFundsStr.replace(/\D/g, '') || '0', 10);
    const targetVolunteers = mode === 'dana' ? 0 : parseInt(targetVolunteersStr.replace(/\D/g, '') || '0', 10);

    if ((mode === 'dana' || mode === 'keduanya') && targetAmount <= 0) {
      setErrorMessage('Target nominal dana harus lebih besar dari Rp 0.');
      return;
    }

    if ((mode === 'relawan' || mode === 'keduanya') && targetVolunteers <= 0) {
      setErrorMessage('Target kuota relawan minimal 1 orang.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // 1. Resolusi Kategori: Buat kategori di database jika mengetik baru atau jika daftar kosong
      let finalCategoryId: number | null = typeof selectedCategoryId === 'number' ? selectedCategoryId : null;
      let finalCategoryName = trimmedCatName;

      if (!finalCategoryId || isNewCategoryMode || selectedCategoryId === 'new') {
        try {
          const createdCat = await campaignService.createCategory(trimmedCatName);
          if (createdCat?.id) {
            finalCategoryId = createdCat.id;
            finalCategoryName = createdCat.category_name;
            setCategoriesList((prev) => {
              if (prev.some((c) => c.id === createdCat.id)) return prev;
              return [...prev, createdCat];
            });
            setSelectedCategoryId(createdCat.id);
          }
        } catch (catErr) {
          console.warn('Gagal membuat kategori via POST /api/categories mandiri:', catErr);
          // Backend controller juga mendukung auto-create jika category_name dikirim
        }
      } else {
        const found = categoriesList.find((c) => c.id === finalCategoryId);
        if (found) {
          finalCategoryName = found.category_name;
        }
      }

      // 2. Siapkan FormData multipart untuk teks dan file gambar
      const formData = new FormData();
      if (finalCategoryId) {
        formData.append('category_id', String(finalCategoryId));
      }
      if (finalCategoryName) {
        formData.append('category_name', finalCategoryName);
      }
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('campaign_mode', backendMode);
      formData.append('target_amount', String(targetAmount));
      formData.append('target_volunteers', String(targetVolunteers));
      formData.append('location', locationCity);
      if (activityDate) {
        formData.append('activity_date', activityDate);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Helper untuk memastikan token otentikasi Sanctum inisiator tersedia
      const ensureAuth = async () => {
        if (getAuthToken()) return true;
        try {
          const loginRes = await api.post('/auth/login', {
            email: 'inisiator@actgiving.com',
            password: 'password123',
          });
          if (loginRes.data?.data?.token) {
            setAuthToken(loginRes.data.data.token);
            return true;
          }
        } catch (loginErr) {
          // Jika belum ada user di database PostgreSQL tanpa seeder, daftarkan otomatis akun inisiator default
          try {
            const regRes = await api.post('/auth/register', {
              name: initiatorName.trim() || currentUser?.name || 'Inisiator Kemanusiaan',
              email: 'inisiator@actgiving.com',
              password: 'password123',
              password_confirmation: 'password123',
              city_domicile: locationCity || 'Bandung',
            });
            if (regRes.data?.data?.token) {
              setAuthToken(regRes.data.data.token);
              return true;
            }
          } catch (regErr) {
            console.warn('Auto auth inisiator fallback gagal:', regErr);
          }
        }
        return false;
      };

      if (campaignToEdit) {
        formData.append('_method', 'PUT');
        const response = await api.post(`/campaigns/${campaignToEdit.id}`, formData, {
          headers: {
            'Content-Type': undefined as any,
          },
        });

        if (response.data?.data) {
          const updatedCampaign = mapBackendCampaignToFrontend(response.data.data);
          onUpdateCampaign?.(updatedCampaign);
          handleResetAndClose();
        } else {
          throw new Error('Gagal memperbarui kampanye pada server.');
        }
      } else {
        await ensureAuth();

        let response;
        try {
          response = await api.post('/campaigns', formData, {
            headers: {
              'Content-Type': undefined as any,
            },
          });
        } catch (postErr: any) {
          if (postErr.response?.status === 401) {
            const reauthed = await ensureAuth();
            if (reauthed) {
              response = await api.post('/campaigns', formData, {
                headers: {
                  'Content-Type': undefined as any,
                },
              });
            } else {
              throw postErr;
            }
          } else {
            throw postErr;
          }
        }

        if (response?.data?.data) {
          const createdCampaign = mapBackendCampaignToFrontend(response.data.data);
          // Jika backend belum mengembalikan URL gambar (atau path belum diset), fallback ke imagePreview lokal
          if ((!createdCampaign.imageUrl || createdCampaign.imageUrl.includes('unsplash.com')) && imagePreview) {
            createdCampaign.imageUrl = imagePreview;
          }
          onAddCampaign(createdCampaign);
          handleResetAndClose();
        } else {
          throw new Error('Gagal menyimpan kampanye baru pada server backend.');
        }
      }
    } catch (err: any) {
      console.error('Save campaign error:', err);
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        const msg = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
        setErrorMessage(msg);
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else if (err.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Gagal menyimpan kampanye ke database. Silakan periksa kembali isian form Anda.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header - Selalu Tampil (Sticky) & Tombol Keluar (X) */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
              <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>{campaignToEdit ? 'Perbarui Data Kampanye (REST API)' : 'Inisiasi Kampanye Aksi (REST API)'}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {campaignToEdit ? 'Edit Inisiasi Kampanye Aksi' : 'Buka Galang Aksi Sosial Baru'}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            title="Keluar / Tutup Formulir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authorization Guard: Only Inisiator can open campaigns */}
        {!isAuthorized ? (
          <div className="p-6 sm:p-8 space-y-6 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-8 h-8 text-blue-600" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Otorisasi Khusus Peran Inisiator
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                Hanya Inisiator Terverifikasi yang Berwenang Membuka Aksi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Sesuai dengan spesifikasi sistem ActGiving, hak inisiasi dan penggalangan aksi sosial memerlukan autentikasi dengan peran <strong className="text-blue-900">Inisiator</strong> untuk menjamin akuntabilitas penyaluran dan mencegah penipuan.
              </p>
            </div>

            {/* Current Active Role Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status Pengguna Anda Saat Ini
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'G'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentUser?.name || 'Tamu / Belum Login'}</div>
                    <div className="text-[11px] text-slate-500 capitalize">Peran aktif: {currentUser?.role || 'Guest'}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Akses Terkunci
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="flex-1 py-3 px-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Tutup / Keluar
              </button>
              {onSwitchToInisiator && (
                <button
                  type="button"
                  onClick={() => {
                    onSwitchToInisiator();
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Masuk Akun Inisiator</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
            {/* Scrollable Form Fields */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Error Notification Banner */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Mode Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Pilih Mode Kampanye</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('dana')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      mode === 'dana'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Coins className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                    <div>Hanya Butuh Dana</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('relawan')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      mode === 'relawan'
                        ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-1 text-sky-600" />
                    <div>Hanya Butuh Relawan</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('keduanya')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      mode === 'keduanya'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <div>Dana & Relawan</div>
                  </button>
                </div>
              </div>

              {/* Upload Foto Banner Kampanye */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="block font-semibold text-slate-700 text-xs">
                  Foto Banner Kampanye <span className="text-slate-400 font-normal">(Maks. 5MB, format JPG/PNG/WebP)</span>
                </label>
                <div className="flex items-center gap-3">
                  {imagePreview ? (
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 group shadow-xs">
                      <img src={imagePreview} alt="Preview Banner" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-md transition-colors cursor-pointer"
                        title="Hapus / Ganti Foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-28 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <Upload className="w-5 h-5 mb-0.5 text-blue-500" />
                      <span className="text-[10px] font-medium text-slate-500">Pilih Foto</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>{imageFile ? 'Ganti File Foto' : 'Pilih Berkas Foto'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {imageFile
                        ? `File: ${imageFile.name} (${(imageFile.size / 1024).toFixed(0)} KB)`
                        : 'Unggah foto nyata kegiatan agar kampanye lebih kredibel bagi donatur & relawan.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Judul Kampanye */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Kampanye Aksi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Bantuan Sembako Warga Terdampak Banjir"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors font-medium"
                />
              </div>

              {/* Inisiator & Kategori */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Inisiator / Komunitas</label>
                  <input
                    type="text"
                    value={initiatorName}
                    onChange={(e) => setInitiatorName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      Kategori Isu <span className="text-rose-500">*</span>
                    </label>
                    {categoriesList.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextMode = !isNewCategoryMode;
                          setIsNewCategoryMode(nextMode);
                          if (!nextMode && categoriesList.length > 0) {
                            setSelectedCategoryId(categoriesList[0].id);
                            setCategoryName(categoriesList[0].category_name);
                          } else {
                            setSelectedCategoryId('new');
                            setCategoryName('');
                          }
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
                      >
                        {isNewCategoryMode ? 'Pilih dari daftar' : '+ Kategori Baru'}
                      </button>
                    )}
                  </div>
                  {isNewCategoryMode || categoriesList.length === 0 ? (
                    <div>
                      <input
                        type="text"
                        required
                        value={categoryName}
                        onChange={(e) => {
                          setCategoryName(e.target.value);
                          setSelectedCategoryId('new');
                        }}
                        placeholder="Ketik kategori (misal: Bencana Alam)"
                        className="w-full px-3 py-2 bg-white border border-blue-300 ring-2 ring-blue-500/10 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                      />
                      {categoriesList.length === 0 && (
                        <p className="text-[10px] text-slate-500 mt-1">
                          Belum ada kategori di database. Kategori baru akan otomatis dibuat.
                        </p>
                      )}
                    </div>
                  ) : (
                    <select
                      value={selectedCategoryId ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'new') {
                          setIsNewCategoryMode(true);
                          setSelectedCategoryId('new');
                          setCategoryName('');
                        } else {
                          const id = Number(val);
                          setSelectedCategoryId(id);
                          const found = categoriesList.find((c) => c.id === id);
                          if (found) setCategoryName(found.category_name);
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                      <option value="new">+ Tambah Kategori Baru...</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Kota Kegiatan & Tanggal Pelaksanaan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kota Kegiatan</label>
                  <select
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors text-xs"
                  >
                    {INDONESIAN_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Tanggal Kegiatan</label>
                  <input
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi & Urgensi Lapangan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan kondisi dan kebutuhan nyata di lapangan..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden transition-colors"
                />
              </div>

              {/* Mode Conditional Inputs: Dana */}
              {(mode === 'dana' || mode === 'keduanya') && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                  <span className="font-bold text-amber-900 block">Atribut Penggalangan Dana:</span>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Nominal Dana (Rp)</label>
                    <input
                      type="number"
                      step={1000000}
                      value={targetFundsStr}
                      onChange={(e) => setTargetFundsStr(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-hidden font-bold text-slate-900 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Mode Conditional Inputs: Relawan */}
              {(mode === 'relawan' || mode === 'keduanya') && (
                <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
                  <span className="font-bold text-sky-900 block">Atribut Kebutuhan Relawan Lapangan:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Target Kuota Relawan (Orang)</label>
                      <input
                        type="number"
                        min={1}
                        value={targetVolunteersStr}
                        onChange={(e) => setTargetVolunteersStr(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-hidden font-bold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Jam Pelaksanaan</label>
                      <input
                        type="text"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        placeholder="08:00 - 16:00 WIB"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-hidden transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kriteria Keahlian & Tugas Kerja</label>
                    <input
                      type="text"
                      value={tasksStr}
                      onChange={(e) => setTasksStr(e.target.value)}
                      placeholder="Membantu posko, memilah obat, dsb."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-hidden transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer: Tombol Batal/Keluar & Tombol Simpan Terbitkan */}
            <div className="shrink-0 px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 z-10">
              <button
                type="button"
                onClick={handleResetAndClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>Batal / Keluar</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Backend...</span>
                  </>
                ) : (
                  <span>{campaignToEdit ? 'Simpan Perubahan' : 'Simpan & Terbitkan Kampanye Aksi Baru'}</span>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
