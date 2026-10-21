import { Campaign } from '../types';

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-01',
    title: 'Tanggap Darurat Banjir Bandang Dayeuhkolot: Dapur Umum & Evakuasi',
    initiatorName: 'Relawan Siaga Bencana Jabar',
    initiatorRole: 'Komunitas Terverifikasi',
    category: 'Bencana Alam',
    mode: 'keduanya',
    locationCity: 'Bandung',
    distanceKm: 2.4,
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    description: 'Banjir merendam ratusan rumah warga dengan ketinggian hingga 1.5 meter. Kami membutuhkan donasi logistik bahan pangan dan 35 relawan fisik untuk distribusi bantuan serta pendirian posko dapur umum.',
    // Mode Butuh Keduanya (Dana & Relawan)
    targetFunds: 75000000,
    collectedFunds: 48500000,
    deadlineDays: 12,
    targetVolunteers: 35,
    filledVolunteers: 22,
    eventDate: '12 - 15 September 2026',
    eventTime: '08:00 - 17:00 WIB',
    taskCriteria: [
      'Bersedia terjun di lapangan area Dayeuhkolot',
      'Membantu penyiapan makanan di dapur umum',
      'Distribusi paket sembako dengan perahu karet',
      'Fisik prima & memiliki komitmen waktu minimal 2 hari'
    ],
    lpjReports: [
      {
        id: 'lpj-01',
        title: 'Penyaluran Batch 1: Pembelian 150 Karung Beras & Obat-obatan',
        date: '04 September 2026',
        realizedAmount: 18500000,
        description: 'Distribusi logistik langsung ke posko pengungsian Dayeuhkolot. Relawan mengevakuasi dan menyalurkan paket pangan bergizi serta obat demam dan gatal.',
        photoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
        activityPhotos: [
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
        ],
        budgetItems: [
          { name: '150 Sak Beras Rojolele 5kg', amount: 9750000 },
          { name: '30 Dus Mie Instan & Telur Ayam', amount: 3600000 },
          { name: 'Paket Obat Gatal, Salep & Paracetamol', amount: 2650000 },
          { name: 'Bahan Bakar & Logistik Dapur Umum', amount: 2500000 }
        ],
        beneficiariesCount: 420,
        volunteersInvolved: 22,
        fieldLocation: 'Posko Dayeuhkolot RW 04 & RW 07, Bandung',
        digitalRegNumber: 'LPJ-ACT-2026-0901',
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'camp-02',
    title: 'Aksi Bersih Sampah Plastik & Tanam 1.000 Bibit Mangrove Pesisir',
    initiatorName: 'Sahabat Bahari Nusantara',
    initiatorRole: 'Organisasi Lingkungan',
    category: 'Lingkungan Hidup',
    mode: 'relawan',
    locationCity: 'Jakarta Utara',
    distanceKm: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    description: 'Pesisir Muara Gembong terancam abrasi hebat dan tumpukan sampah plastik kiriman. Dibutuhkan 50 relawan lapangan untuk aksi bersih pantai dan penanaman 1.000 bibit mangrove pelindung pantai.',
    // Mode Hanya Butuh Relawan
    targetVolunteers: 50,
    filledVolunteers: 34,
    eventDate: '20 September 2026',
    eventTime: '06:30 - 13:00 WIB',
    taskCriteria: [
      'Pembersihan dan pemilahan sampah anorganik di bibir pantai',
      'Penanaman bibit mangrove bersama tim konservasi',
      'Membawa pakaian ganti & botol minum pribadi (tumbler)',
      'Disediakan konsumsi, kaos relawan, dan e-sertifikat resmi'
    ],
    lpjReports: [
      {
        id: 'lpj-02-mangrove',
        title: 'Dokumentasi Aksi Bersih Pantai & Penanaman 350 Bibit Tahap 1',
        date: '16 September 2026',
        realizedAmount: 3200000,
        description: 'Sebanyak 34 relawan berhasil mengangkut 480 kg sampah plastik laut dan menanam 350 bibit mangrove jenis Rhizophora di zona pesisir terluar.',
        photoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
        activityPhotos: [
          'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=800&q=80'
        ],
        budgetItems: [
          { name: 'Pengadaan Ajir Bambu & Tali Sabut Kelapa', amount: 1200000 },
          { name: 'Karung Sampah Daur Ulang & Sarung Tangan', amount: 800000 },
          { name: 'Konsumsi Sehat & Air Mineral Galon Relawan', amount: 1200000 }
        ],
        beneficiariesCount: 250,
        volunteersInvolved: 34,
        fieldLocation: 'Pesisir Muara Gembong, Bekasi - Jakarta Utara',
        digitalRegNumber: 'LPJ-ACT-2026-0902'
      }
    ]
  },
  {
    id: 'camp-03',
    title: 'Renovasi Ruang Belajar Madrasah Roboh & Pengadaan Meja Kursi Belajar',
    initiatorName: 'Yayasan Lentera Pendidikan Desa',
    initiatorRole: 'Yayasan Terdaftar',
    category: 'Pendidikan',
    mode: 'dana',
    locationCity: 'Yogyakarta',
    distanceKm: 8.5,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    description: 'Atap 2 ruang kelas di MI Al-Ikhlas roboh diterjang angin kencang. Saat ini 64 anak terpaksa menumpang belajar di teras warga tanpa meja dan kursi yang layak. Butuh dukungan dana cepat untuk seng, genteng, dan semen.',
    // Mode Hanya Butuh Dana
    targetFunds: 45000000,
    collectedFunds: 31200000,
    deadlineDays: 18,
    lpjReports: [
      {
        id: 'lpj-02',
        title: 'Pemasangan Material Rangka Baja Ringan & Semen Tahap 1',
        date: '28 Agustus 2026',
        realizedAmount: 14750000,
        description: 'Pengerjaan pemasangan rangka atap baja ringan dan perbaikan plesteran dinding ruang kelas 3 & 4 bersama warga desa.',
        photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        activityPhotos: [
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
        ],
        budgetItems: [
          { name: '45 Batang Kanal C Baja Ringan & Reng', amount: 6850000 },
          { name: '50 Sak Semen Tiga Roda & Pasir Ayak', amount: 4100000 },
          { name: 'Genteng Metal Pasir 65 Lembar', amount: 2600000 },
          { name: 'Upah Tukang & Perlengkapan K3', amount: 1200000 }
        ],
        beneficiariesCount: 64,
        volunteersInvolved: 15,
        fieldLocation: 'MI Al-Ikhlas Dusun Kalitirto, Sleman, Yogyakarta',
        digitalRegNumber: 'LPJ-ACT-2026-0828',
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'camp-04',
    title: 'Layanan Pengobatan Gratis & Pembagian 200 Kacamata Lansia Prasejahtera',
    initiatorName: 'Dokter Peduli Negeri',
    initiatorRole: 'Asosiasi Tenaga Medis',
    category: 'Kesehatan',
    mode: 'keduanya',
    locationCity: 'Surabaya',
    distanceKm: 3.1,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    description: 'Bakti sosial pemeriksaan kesehatan umum, gula darah, asam urat, tensi, serta pembagian kacamata baca bagi para lansia prasejahtera di kawasan perkampungan padat nelayan.',
    // Mode Butuh Keduanya (Dana & Relawan)
    targetFunds: 30000000,
    collectedFunds: 24600000,
    deadlineDays: 7,
    targetVolunteers: 20,
    filledVolunteers: 16,
    eventDate: '18 September 2026',
    eventTime: '07:30 - 14:00 WIB',
    taskCriteria: [
      '10 Relawan umum (registrasi, antrean, pembagian bingkisan)',
      '10 Relawan medis/paramedis (screening tensi & tes lab sederhana)',
      'Memiliki keramahan tinggi dalam melayani kakek & nenek'
    ],
    lpjReports: [
      {
        id: 'lpj-03',
        title: 'Pengadaan Strip Tes Laboratorium & 100 Gagang Kacamata',
        date: '02 September 2026',
        realizedAmount: 8900000,
        description: 'Pemeriksaan kesehatan gratis bagi 180 kakek dan nenek nelayan di Balai RW 02 Kalimas Baru serta penyerahan kacamata baca.',
        photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        activityPhotos: [
          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
        ],
        budgetItems: [
          { name: '10 Box Strip Glukosa & Kolesterol Darah', amount: 3700000 },
          { name: '100 Unit Frame & Lensa Kacamata Baca Presbiopi', amount: 3900000 },
          { name: 'Suplemen Multivitamin & Lansia Care Pack', amount: 1300000 }
        ],
        beneficiariesCount: 180,
        volunteersInvolved: 16,
        fieldLocation: 'Balai Warga RW 02 Kalimas Baru, Surabaya Utara',
        digitalRegNumber: 'LPJ-ACT-2026-0903',
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'camp-05',
    title: 'Kakak Asuh Akhir Pekan: Mengajar Keterampilan Digital Anak Panti',
    initiatorName: 'Komunitas Sahabat Literasi',
    initiatorRole: 'Komunitas Pemuda',
    category: 'Panti Asuhan',
    mode: 'relawan',
    locationCity: 'Bandung',
    distanceKm: 1.5,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    description: 'Membimbing 40 adik panti asuhan mengenal dasar pemrograman visual, desain poster canva, dan literasi internet aman sebagai bekal masa depan mereka.',
    // Mode Hanya Butuh Relawan
    targetVolunteers: 15,
    filledVolunteers: 11,
    eventDate: 'Setiap Sabtu (Bulan September 2026)',
    eventTime: '13:30 - 16:30 WIB',
    taskCriteria: [
      'Mampu mengoperasikan komputer/laptop dasar',
      'Sabar dan ramah berinteraksi dengan anak usia 9-15 tahun',
      'Membawa laptop pribadi untuk sesi praktik pendampingan'
    ],
    lpjReports: [
      {
        id: 'lpj-05-panti',
        title: 'Dokumentasi Sesi Belajar Komputer & Modul Literasi Digital Pekan Ke-2',
        date: '14 September 2026',
        realizedAmount: 1450000,
        description: 'Pendampingan 40 anak asuh dalam membuat desain kartu ucapan dan mengetik dokumen dasar menggunakan laptop relawan.',
        photoUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        activityPhotos: [
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
        ],
        budgetItems: [
          { name: 'Pencetakan Modul Panduan Belajar 40 Eks', amount: 650000 },
          { name: 'Snack Bergizi & Susu Kotak Anak Panti', amount: 800000 }
        ],
        beneficiariesCount: 40,
        volunteersInvolved: 11,
        fieldLocation: 'Panti Asuhan Al-Hidayah, Sukajadi, Bandung',
        digitalRegNumber: 'LPJ-ACT-2026-0905'
      }
    ]
  },
  {
    id: 'camp-06',
    title: 'Ambulans Gratis Desa Terisolir & Pasokan Tabung Oksigen Pasien Dhuafa',
    initiatorName: 'Lembaga Medis Pedesaan',
    initiatorRole: 'Yayasan Sosial',
    category: 'Kesehatan',
    mode: 'dana',
    locationCity: 'Medan',
    distanceKm: 12.0,
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
    description: 'Warga desa sering terlambat mendapat penanganan gawat darurat akibat ketiadaan armada ambulans. Kami menggalang dana untuk operasional bahan bakar ambulans desa dan isi ulang tabung oksigen gratis bagi warga dhuafa.',
    // Mode Hanya Butuh Dana
    targetFunds: 60000000,
    collectedFunds: 41800000,
    deadlineDays: 25,
    lpjReports: [
      {
        id: 'lpj-04',
        title: 'Perawatan Servis Mesin Armada & Isi Ulang 12 Tabung Oksigen',
        date: '25 Agustus 2026',
        realizedAmount: 6450000,
        description: 'Servis rutin rem dan ganti oli ambulans APV serta pengisian 12 tabung oksigen ukuran 1m3 untuk evakuasi darurat gratis.',
        photoUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
        activityPhotos: [
          'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80'
        ],
        budgetItems: [
          { name: 'Servis Berkala Mesin, Rem & Ban Cadangan', amount: 3250000 },
          { name: 'Pengisian Ulang 12 Tabung Medis Oksigen', amount: 1800000 },
          { name: 'BBM Operasional Rujukan Pasien Dhuafa', amount: 1400000 }
        ],
        beneficiariesCount: 85,
        volunteersInvolved: 6,
        fieldLocation: 'Kecamatan Kutalimbaru & Rumah Sakit Rujukan Medan',
        digitalRegNumber: 'LPJ-ACT-2026-0825',
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'camp-pending-01',
    title: 'Pembangunan Jembatan Gantung Penghubung 2 Dusun Terisolir Pasca Longsor',
    initiatorName: 'Sarah Anindita (Komunitas Peduli)',
    initiatorRole: 'Inisiator Terverifikasi',
    category: 'Bencana Alam',
    mode: 'keduanya',
    locationCity: 'Bandung',
    distanceKm: 9.2,
    status: 'pending_approval',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80',
    description: 'Jembatan lama hanyut terbawa banjir bandang dan longsor. Anak sekolah harus menyeberangi arus deras. Membutuhkan dana semen/kabel baja serta 25 relawan gotong royong.',
    targetFunds: 35000000,
    collectedFunds: 0,
    deadlineDays: 45,
    targetVolunteers: 25,
    filledVolunteers: 0,
    eventDate: '28 September 2026',
    eventTime: '07:30 - 15:00 WIB',
    taskCriteria: ['Gotong royong pengecoran tiang pancang', 'Membawa perkakas tukang jika memiliki'],
    lpjReports: []
  }
];

export const DEMO_USERS: Record<string, import('../types').UserProfile> = {
  guest: {
    id: 'user-guest',
    name: 'Donatur Cepat (Guest)',
    email: 'guest@actgiving.id',
    role: 'guest',
    city: 'Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    joinedCampaignIds: [],
    managedCampaignIds: []
  },
  relawan: {
    id: 'user-relawan',
    name: 'Rian Pratama',
    email: 'rian.pratama@relawan.id',
    role: 'relawan',
    phone: '0812-3456-7890',
    city: 'Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinedCampaignIds: ['camp-01', 'camp-02'],
    managedCampaignIds: []
  },
  inisiator: {
    id: 'user-inisiator',
    name: 'Sarah Anindita',
    email: 'sarah.anindita@pedulisesama.org',
    role: 'inisiator',
    phone: '0857-8899-1122',
    city: 'Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    joinedCampaignIds: [],
    managedCampaignIds: ['camp-01', 'camp-pending-01']
  },
  admin: {
    id: 'user-admin',
    name: 'Azzahra, S.Kom',
    email: 'azzahra.audit@actgiving.id',
    role: 'admin',
    phone: '0811-2233-4455',
    city: 'Jakarta Pusat',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    joinedCampaignIds: [],
    managedCampaignIds: []
  }
};

export const INITIAL_STATS = {
  totalDonationRp: 1485250000,
  totalVolunteers: 3842,
  completedPrograms: 142
};
