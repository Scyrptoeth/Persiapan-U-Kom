import { readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const repoRoot = process.cwd();
const cacheRoot = join(repoRoot, ".local-content-cache");
const outputPath = join(repoRoot, "src/data/localQuestions.json");

const sources = {
  bm2025: {
    title: "3. Materi Tayang Webinar Bea Meterai 2025.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Bea Meterai (BM)/3. Materi Tayang Webinar Bea Meterai 2025.pdf"
  },
  ikLengkap: {
    title: "10. Materi Tayang Webinar IK dan Penegakan Disiplin - Versi Lengkap.PDF",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Internalisasi Kepatuhan/10. Materi Tayang Webinar IK dan Penegakan Disiplin - Versi Lengkap.PDF"
  },
  kepegawaianLengkap: {
    title: "9. Materi Tayang Webinar Kepegawaian - Versi Lengkap.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Kepegawaian/9. Materi Tayang Webinar Kepegawaian - Versi Lengkap.pdf"
  },
  kepegawaianDay5: {
    title: "DAY 5 - KEPEGAWAIAN.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Kepegawaian/DAY 5 - KEPEGAWAIAN.pdf"
  },
  kup2025: {
    title: "1. Materi Tayang Webinar KUP 2025.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Ketentuan Umum Perpajakan (KUP)/1. Materi Tayang Webinar KUP 2025.pdf"
  },
  organisasi2025: {
    title: "7. Materi Tayang Webinar Organisasi 2025.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Organisasi/7. Materi Tayang Webinar Organisasi 2025.pdf"
  },
  pbb2025: {
    title: "5. Materi Tayang Webinar PBB 2025.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Pajak Bumi dan Bangunan (PBB)/5. Materi Tayang Webinar PBB 2025.pdf"
  },
  pphFull: {
    title: "4. Paparan Webinar Ukom 2025_PPh_FULL.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Pajak Penghasilan (PPh)/4. Paparan Webinar Ukom 2025_PPh_FULL.pdf"
  },
  ppn2025: {
    title: "2. Materi Tayang Webinar PPN 2025.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Pajak Pertambahan Nilai (PPN)/2. Materi Tayang Webinar PPN 2025.pdf"
  },
  tik2025: {
    title: "8. Materi Tayang Webinar TIK.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Teknologi Informasi dan Komunikasi (TIK)/8. Materi Tayang Webinar TIK.pdf"
  },
  tndDay4: {
    title: "DAY IV - TND.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Tata Naskah Dinas (TND)/DAY IV - TND.pdf"
  },
  pbbPmk186Ddtc: {
    title: "PMK 186/PMK.03/2019 - DDTC",
    url: "https://perpajakan.ddtc.co.id/sumber-hukum/peraturan-pusat/peraturan-menteri-keuangan-186pmk-032019"
  },
  excelConcatenateMicrosoft: {
    title: "CONCATENATE function - Microsoft Support",
    url: "https://support.microsoft.com/en-us/office/concatenate-function-8f8ae884-2ca8-4f7a-b093-75d702bea31d"
  }
};

const curatedItems = [
  ["bm101.pdf", 1, 0, "Objek Bea Meterai", "bm2025", 7, "Surat pernyataan dan surat keterangan termasuk dokumen surat lainnya yang sejenis yang dikenai Bea Meterai."],
  ["bm101.pdf", 11, 1, "Objek Pemungutan Bea Meterai", "bm2025", 24, "Objek pemungutan Bea Meterai mencakup surat keterangan/pernyataan, transaksi surat berharga, serta cek dan bilyet giro; surat perjanjian tidak tercantum sebagai objek pemungutan."],
  ["bm101.pdf", 12, 1, "Pemungut Bea Meterai", "bm2025", 24, "Kriteria pemungut mencakup penerbitan atau fasilitasi dokumen tertentu, bukan penerbitan dokumen tanda terima pembayaran gaji."],
  ["bm101.pdf", 14, 0, "Pemungut Bea Meterai", "bm2025", 27, "Kewajiban penyetoran Bea Meterai oleh pemungut."],
  ["bm101.pdf", 17, 1, "Pidana Bea Meterai", "bm2025", 33, "Pemalsuan atau peniruan meterai dipidana penjara paling lama tujuh tahun."],
  ["bm101.pdf", 18, 2, "Pidana Bea Meterai", "bm2025", 33, "Pemalsuan atau peniruan meterai dipidana denda paling banyak Rp500.000.000,00."],

  ["internalisasi101.pdf", 6, 2, "Disiplin PNS", "ikLengkap", 57, "PP Nomor 94 Tahun 2021 menjadi dasar hukum terbaru disiplin PNS yang menggantikan PP Nomor 53 Tahun 2010."],
  ["internalisasi101.pdf", 12, 2, "Gratifikasi", "ikLengkap", 32, "Kewajiban penyelenggara negara dalam pengendalian gratifikasi mencakup menolak, melaporkan penolakan, dan melaporkan penerimaan gratifikasi yang tidak dapat ditolak; menyalurkan makanan mudah rusak sebagai bantuan sosial bukan kewajiban pada daftar tersebut."],
  ["internalisasi101.pdf", 16, 0, "Benturan Kepentingan", "ikLengkap", 20, "Definisi benturan kepentingan adalah situasi pegawai memiliki atau patut diduga memiliki kepentingan pribadi atau kelompok yang dapat memengaruhi objektivitas dan kualitas keputusan atau tindakan."],
  ["internalisasi101.pdf", 21, 1, "Pengaduan Pelanggaran", "ikLengkap", 71, "Kewajiban merahasiakan identitas pelapor."],
  ["internalisasi101.pdf", 22, 2, "Pengaduan Pelanggaran", "ikLengkap", 68, "Petugas pengaduan yang dapat merekam pada SIPP mencakup Direktorat KITSDA, Direktorat P2Humas, Direktorat Intelijen Perpajakan, Kanwil, dan KPP; Tim Pengkaji Pengaduan tidak tercantum sebagai perekam."],
  ["internalisasi101.pdf", 23, 3, "Tindak Pidana Korupsi", "ikLengkap", 75, "Contoh pelanggaran suap-menyuap."],
  ["internalisasi101.pdf", 24, 1, "Tindak Pidana Korupsi", "ikLengkap", 77, "Contoh pelanggaran penggelapan dalam jabatan."],

  ["kepegawaian101.pdf", 3, 1, "Fungsi ASN", "kepegawaianLengkap", 9, "Fungsi ASN meliputi pelaksana kebijakan publik, pelayanan publik, serta perekat dan pemersatu bangsa."],
  ["kepegawaian101.pdf", 10, 3, "Kenaikan Pangkat", "kepegawaianLengkap", 74, "Periode kenaikan pangkat menurut Peraturan BKN Nomor 4 Tahun 2023 adalah 1 Februari, 1 April, 1 Juni, 1 Agustus, 1 Oktober, dan 1 Desember; 1 Januari tidak termasuk."],
  ["kepegawaian101.pdf", 24, 2, "Pengembangan Kompetensi", "kepegawaianLengkap", 23, "E-Learning dicantumkan sebagai contoh pembelajaran nonklasikal, bukan pembelajaran klasikal."],
  ["kepegawaian101.pdf", 25, 0, "Pengembangan Kompetensi", "kepegawaianLengkap", 23, "Workshop/Lokakarya dicantumkan sebagai contoh pembelajaran klasikal, bukan pembelajaran nonklasikal."],
  ["kepegawaian101.pdf", 26, 1, "Tugas Belajar", "kepegawaianLengkap", 52, "Pengelolaan Tugas Belajar mengacu pada PMK Nomor 34 Tahun 2024."],
  ["kepegawaian101.pdf", 32, 1, "Tugas Belajar", "kepegawaianLengkap", 43, "Pegawai Tugas Belajar Dibiayai Diberhentikan menerima 75% dari total tunjangan kinerja dan/atau tunjangan lain yang melekat pada jabatan."],
  ["kepegawaian101.pdf", 34, 2, "Tugas Belajar Mandiri", "kepegawaianLengkap", 53, "Kewajiban pegawai Tugas Belajar Mandiri mencakup menyelesaikan tugas belajar tepat waktu, menjaga kehormatan dan nama baik Kementerian Keuangan, serta menyampaikan laporan perkembangan studi; menyerahkan asli ijazah dan transkrip untuk PNS Tugas Belajar Mandiri Tidak Diberhentikan tidak tercantum dalam daftar kewajiban tersebut."],
  ["kepegawaian101.pdf", 35, 2, "Tugas Belajar", "kepegawaianLengkap", 43, "Pada Tugas Belajar Dibiayai Diberhentikan, tunjangan kinerja menjadi 0% jika pegawai menjalani perpanjangan."],
  ["kepegawaian101.pdf", 39, 3, "Tugas Belajar", "kepegawaianLengkap", 39, "Pemantauan dan evaluasi dilakukan terhadap proses perencanaan, pelaksanaan, dan pasca tugas belajar; penugasan tidak dicantumkan sebagai tahapan pemantauan tersendiri."],
  ["kepegawaian101.pdf", 41, 3, "Manajemen Kinerja", "kepegawaianDay5", 4, "Dasar hukum manajemen kinerja di lingkungan Kementerian Keuangan."],
  ["kepegawaian101.pdf", 42, 2, "Manajemen Kinerja", "kepegawaianDay5", 4, "Materi mengklasifikasikan manajemen kinerja menjadi Manajemen Kinerja Organisasi dan Manajemen Kinerja Individu/Pegawai; Manajemen Kinerja Unit tidak dicantumkan sebagai klasifikasi."],
  ["kepegawaian101.pdf", 49, 1, "Sasaran Kinerja Pegawai", "kepegawaianLengkap", 26, "Komponen SKP mencakup hasil kerja, perilaku kerja, dan lampiran SKP."],
  ["kepegawaian101.pdf", 55, 0, "Nilai Kinerja Pegawai", "kepegawaianLengkap", 31, "Formula NKP terdiri dari NHK 70% dan NPK 30%."],
  ["kepegawaian101.pdf", 60, 2, "Budaya Kinerja", "kepegawaianDay5", 16, "Program Internalisasi Corporate Value yang ditampilkan memuat nilai Integritas, Profesionalisme, dan Kesempurnaan; Sinergi tidak tercantum pada daftar program budaya kinerja tersebut."],
  ["kepegawaian101.pdf", 61, 2, "Jabatan Pelaksana", "kepegawaianLengkap", 55, "Kedudukan Jabatan Pelaksana ditunjukkan di bawah jabatan pimpinan tinggi, administrator, dan pengawas; Jabatan Fungsional Ahli Madya tidak tercantum."],
  ["kepegawaian101.pdf", 64, 2, "Sidang Penilaian", "kepegawaianLengkap", 59, "Sidang Penilaian diselenggarakan paling lambat 31 Maret setelah pelaksanaan evaluasi."],
  ["kepegawaian101.pdf", 66, 1, "Sidang Penilaian", "kepegawaianLengkap", 59, "Ketentuan penetapan jabatan dan peringkat Pelaksana Umum mencakup pangkat/golongan ruang dan pendidikan; masa kerja PNS tidak dicantumkan sebagai dasar pada materi."],
  ["kepegawaian101.pdf", 69, 1, "Jabatan Pelaksana", "kepegawaianLengkap", 55, "Jenis Jabatan Pelaksana mencakup Pelaksana Umum, Pelaksana Khusus, Pelaksana Tugas Belajar, dan Pelaksana Tertentu; Pelaksana CPNS tidak tercantum."],
  ["kepegawaian101.pdf", 70, 0, "Jabatan Pelaksana", "kepegawaianLengkap", 56, "Pengolah Data dan Informasi adalah Jabatan Pelaksana yang melaksanakan pengelolaan, verifikasi, dan penyusunan data serta laporan berdasarkan urusan pemerintahan."],
  ["kepegawaian101.pdf", 95, 1, "Presensi", "kepegawaianLengkap", 72, "Untuk keterlambatan diperlukan izin/pemberitahuan terlambat masuk bekerja, sedangkan tidak mengisi daftar hadir dibuktikan dengan berita acara lupa absen atau tangkapan layar CCTV."],
  ["kepegawaian101.pdf", 97, 1, "Izin Luar Negeri", "kepegawaianLengkap", 73, "Penandatangan surat izin ke luar negeri dan surat izin cuti yang dijalankan di luar negeri untuk Golongan Ia sampai IIId adalah Kabag P4."],
  ["kepegawaian101.pdf", 109, 1, "Laporan Perkawinan", "kepegawaianDay5", 50, "Laporan perkawinan pertama harus dikirim paling lambat satu tahun terhitung mulai tanggal perkawinan dilangsungkan."],
  ["kepegawaian101.pdf", 110, 0, "Laporan Perkawinan", "kepegawaianDay5", 50, "Kelengkapan Laporan Perkawinan Pertama mencakup laporan perkawinan, salinan akta nikah, pas foto pegawai, dan pas foto istri/suami; surat izin atau keterangan perceraian merupakan kelengkapan untuk perkawinan duda/janda."],
  ["kepegawaian101.pdf", 111, 3, "Kartu ASN Virtual", "kepegawaianLengkap", 14, "Kartu ASN Virtual diterbitkan oleh Kepala Badan Kepegawaian Negara melalui Sistem Informasi Aparatur Sipil Negara."],
  ["kepegawaian101.pdf", 112, 3, "Kartu ASN Virtual", "kepegawaianLengkap", 14, "Foto diri untuk Kartu ASN Virtual diunggah pada aplikasi MySAPK BKN."],

  ["kup101.pdf", 1, 2, "NITKU", "kup2025", 9, "Kewajiban melaporkan tempat kegiatan usaha untuk memperoleh NITKU."],
  ["kup101.pdf", 6, 2, "Pembukuan", "kup2025", 17, "Definisi pembukuan mencakup data harta, kewajiban, modal, penghasilan, dan biaya."],
  ["kup101.pdf", 7, 3, "Pembukuan", "kup2025", 19, "Ketentuan pembukuan tidak menggunakan frasa benar, jelas, lengkap sebagai pilihan yang diuji."],
  ["kup101.pdf", 8, 3, "Pembukuan", "kup2025", 18, "Wajib Pajak badan wajib menyelenggarakan pembukuan."],
  ["kup101.pdf", 23, 0, "Pemeriksaan", "kup2025", 53, "Buku, catatan, dokumen, data, informasi, dan keterangan lain wajib dipenuhi paling lama satu bulan sejak permintaan disampaikan."],
  ["kup101.pdf", 27, 0, "SKPKBT", "kup2025", 66, "SKPKBT karena data baru yang mengakibatkan penambahan jumlah pajak terutang dikenai sanksi kenaikan 100%."],
  ["kup101.pdf", 33, 3, "Daluwarsa Penagihan", "kup2025", 80, "Untuk tahun pajak 2008 dan setelahnya, daluwarsa penagihan tertangguh jika diterbitkan Surat Paksa, ada pengakuan Wajib Pajak, atau dilakukan penyidikan tindak pidana perpajakan."],
  ["kup101.pdf", 39, 2, "Pembetulan", "kup2025", 84, "Kesalahan penjumlahan, pengurangan, perkalian, atau pembagian merupakan kesalahan hitung, bukan kekeliruan penerapan ketentuan tertentu."],
  ["kup101.pdf", 45, 1, "Peninjauan Kembali", "kup2025", 92, "Peninjauan Kembali merupakan upaya hukum luar biasa."],
  ["kup101.pdf", 50, 2, "Imbalan Bunga", "kup2025", 95, "Menteri Keuangan menetapkan KMK tentang tarif bunga sebagai dasar penghitungan sanksi administratif bunga dan imbalan bunga."],
  ["kup101.pdf", 51, 3, "Wakil Wajib Pajak", "kup2025", 97, "Daftar wakil Wajib Pajak mencakup badan oleh pengurus, badan pailit oleh kurator, badan dalam pembubaran/likuidasi, warisan belum terbagi, serta anak belum dewasa atau orang dalam pengampuan; badan dalam PKPU oleh kurator tidak tercantum."],

  ["organisasi101.pdf", 1, 3, "Visi dan Misi", "organisasi2025", 5, "Visi dan Misi Kementerian Keuangan mendukung Visi dan Misi Presiden dan Wakil Presiden."],
  ["organisasi101.pdf", 4, 2, "Fungsi Kementerian Keuangan", "organisasi2025", 7, "Fungsi Kementerian Keuangan mencakup pendidikan/pelatihan, TIK dan data, serta bimbingan teknis dan supervisi; mengelola neraca keuangan pusat yang inovatif dengan risiko minimum tidak tercantum sebagai fungsi."],
  ["organisasi101.pdf", 19, 3, "Instansi Vertikal DJP", "organisasi2025", 50, "KPP Pratama Ambon memiliki jumlah KP2KP terbanyak pada materi."],
  ["organisasi101.pdf", 20, 2, "Instansi Vertikal DJP", "organisasi2025", 49, "KPP Pratama Jakarta Pademangan merupakan satu-satunya KPP Pratama di Jakarta yang memiliki KP2KP Kepulauan Seribu."],
  ["organisasi101.pdf", 21, 2, "Unit Pelaksana Teknis", "organisasi2025", 53, "Definisi Unit Pelaksana Teknis."],
  ["organisasi101.pdf", 24, 3, "Unit Pelaksana Teknis", "organisasi2025", 51, "KLIP adalah Kantor Layanan Informasi dan Pengaduan."],

  ["pbb101.pdf", 1, 1, "Objek PBB Perkebunan", "pbbPmk186Ddtc", "PMK 186/PMK.03/2019 Pasal 14 ayat (1) huruf e via DDTC; fallback karena materi lokal hanya memuat daftar kategori tanpa definisi areal", "Areal Emplasemen Perkebunan merupakan areal yang di atasnya dimanfaatkan untuk bangunan serta fasilitas penunjangnya."],
  ["pbb101.pdf", 2, 0, "Objek PBB Perhutanan", "pbbPmk186Ddtc", "PMK 186/PMK.03/2019 Pasal 15 ayat (1) huruf c via DDTC; fallback karena materi lokal hanya memuat daftar kategori tanpa definisi kondisi IUPHHK-RE", "Areal pada Hutan Alam dengan IUPHHK-RE yang belum tercapai keseimbangan ekosistem dan belum ada pemanfaatan hasil hutan bukan kayu merupakan Areal Tidak Produktif Perhutanan."],
  ["pbb101.pdf", 3, 3, "Objek PBB Minerba", "pbb2025", 10, "Objek PBB sektor pertambangan mineral atau batubara tercantum dalam IUP, IUPK, Izin Pertambangan Rakyat, Kontrak Karya, atau PKP2B; kontrak kerja sama tidak tercantum."],
  ["pbb101.pdf", 13, 0, "Penetapan NJOP PBB", "pbbPmk186Ddtc", "PMK 186/PMK.03/2019 Pasal 14 ayat (2) huruf e dan Pasal 15 ayat (2) huruf d/g via DDTC; fallback untuk membedakan metode penetapan NJOP tiap areal", "NJOP Areal Emplasemen Perkebunan ditentukan berdasarkan Perbandingan Harga dengan Objek Lain yang Sejenis, bukan ditetapkan dengan Keputusan Direktur Jenderal Pajak."],
  ["pbb101.pdf", 24, 2, "Pengurangan PBB", "pbb2025", 38, "Pengurangan PBB dapat diberikan karena objek pajak terdampak bencana alam."],

  ["pph101.pdf", 1, 1, "Karakteristik PPh", "pphFull", 3, "PPh merupakan pajak subjektif."],
  ["pph101.pdf", 3, 3, "Ketentuan Formal PPh", "pphFull", 3, "Ketentuan formal PPh berkaitan dengan UU KUP."],
  ["pph101.pdf", 6, 0, "Subjek PPh", "pphFull", 6, "Kantor perwakilan negara asing tidak termasuk subjek PPh dengan syarat tertentu."],
  ["pph101.pdf", 10, 2, "Bentuk Usaha Tetap", "pphFull", 4, "Kantor cabang badan luar negeri dapat menjadi BUT di Indonesia."],
  ["pph101.pdf", 12, 2, "Natura dan Kenikmatan", "pphFull", 54, "Natura adalah imbalan berupa barang, sedangkan kenikmatan adalah imbalan berupa fasilitas atau pelayanan."],
  ["pph101.pdf", 14, 3, "Objek PPh", "pphFull", 11, "Warisan termasuk penghasilan yang bukan objek Pajak Penghasilan."],
  ["pph101.pdf", 16, 0, "Biaya Fiskal", "pphFull", 13, "Biaya komersial tidak selalu sama dengan biaya fiskal."],
  ["pph101.pdf", 17, 2, "Biaya Fiskal", "pphFull", 13, "Pajak Penghasilan termasuk biaya nonfiskal yang tidak dapat dikurangkan."],
  ["pph101.pdf", 22, 1, "Penilaian Harta", "pphFull", 15, "Pengalihan harta untuk setoran modal dinilai berdasarkan nilai pasar."],
  ["pph101.pdf", 25, 2, "Persediaan", "pphFull", 15, "Metode persediaan pada materi mencakup rata-rata atau FIFO."],
  ["pph101.pdf", 30, 2, "Amortisasi", "pphFull", 16, "Metode satuan produksi digunakan untuk menghitung amortisasi sesuai proporsi produksi."],
  ["pph101.pdf", 32, 3, "Kompensasi Kerugian", "pphFull", 14, "Kerugian fiskal dapat dikompensasikan selama lima tahun berturut-turut."],
  ["pph101.pdf", 33, 1, "PTKP", "pphFull", 47, "Anggota keluarga semenda dalam garis keturunan lurus mencakup mertua dan anak tiri; anak kandung merupakan keluarga sedarah."],
  ["pph101.pdf", 34, 3, "PTKP", "pphFull", 46, "PTKP ditentukan berdasarkan kondisi pada awal tahun pajak."],

  ["ppn101.pdf", 1, 2, "Dasar Hukum PPN", "ppn2025", 4, "Dasar hukum pemungutan PPN dan PPnBM."],
  ["ppn101.pdf", 2, 1, "Karakteristik PPN", "ppn2025", 5, "PPN memiliki karakteristik sebagai pajak tidak langsung."],
  ["ppn101.pdf", 3, 2, "PPnBM", "ppn2025", 8, "PPnBM diterapkan atas barang yang tergolong mewah."],
  ["ppn101.pdf", 4, 1, "Sejarah PPN", "ppn2025", 5, "PPN menggantikan Pajak Penjualan 1951."],
  ["ppn101.pdf", 5, 1, "Nilai Tambah", "ppn2025", 12, "Pertambahan nilai timbul dari pemakaian faktor produksi pada jalur usaha."],
  ["ppn101.pdf", 6, 3, "Usaha Perdagangan", "ppn2025", 14, "Definisi usaha perdagangan dalam UU PPN."],
  ["ppn101.pdf", 7, 2, "Pengusaha", "ppn2025", 14, "Definisi pengusaha dalam UU PPN."],
  ["ppn101.pdf", 9, 2, "Pengusaha Kena Pajak", "ppn2025", 15, "Definisi Pengusaha Kena Pajak."],
  ["ppn101.pdf", 11, 2, "Jasa", "ppn2025", 18, "Definisi jasa dalam UU PPN."],
  ["ppn101.pdf", 12, 1, "Barang Kena Pajak", "ppn2025", 21, "Emas perhiasan termasuk BKP, berbeda dari uang/surat berharga dan emas batangan untuk cadangan devisa negara."],
  ["ppn101.pdf", 15, 2, "Objek PPN", "ppn2025", 18, "Impor BKP merupakan objek PPN."],
  ["ppn101.pdf", 17, 1, "Tarif PPN", "ppn2025", 36, "Tarif normal PPN sejak 1 Januari 2025 adalah 12%."],
  ["ppn101.pdf", 18, 0, "Nilai Impor", "ppn2025", 38, "Nilai impor dihitung dari nilai pabean ditambah bea masuk."],
  ["ppn101.pdf", 19, 1, "Pengkreditan Pajak Masukan", "ppn2025", 78, "PM dengan DPP nilai lain dapat dikreditkan, sedangkan besaran tertentu tidak."],
  ["ppn101.pdf", 20, 0, "Tarif Ekspor", "ppn2025", 36, "Ekspor BKP dan/atau JKP dikenai PPN 0%."],
  ["ppn101.pdf", 21, 3, "Saat Terutang PPN", "ppn2025", 49, "Secara umum PPN terutang pada saat penyerahan."],
  ["ppn101.pdf", 22, 1, "Saat Terutang PPN", "ppn2025", 52, "Jika pembayaran mendahului penyerahan, PPN terutang saat pembayaran."],
  ["ppn101.pdf", 25, 3, "Saat Terutang PPN", "ppn2025", 49, "Jika penyerahan lebih dulu daripada pembayaran, PPN terutang pada saat penyerahan."],
  ["ppn101.pdf", 28, 2, "Faktur Pajak", "ppn2025", 68, "Kode transaksi 08 pada Faktur Pajak menunjukkan penyerahan BKP/JKP yang mendapatkan fasilitas dibebaskan dari pengenaan PPN/PPnBM."],
  ["ppn101.pdf", 33, 3, "Restitusi Turis Asing", "ppn2025", 97, "Permintaan kembali PPN dan PPnBM oleh turis asing dilakukan dengan menunjukkan paspor, boarding pass, dan Faktur Pajak."],
  ["ppn101.pdf", 38, 0, "PPnBM", "ppn2025", 102, "PPnBM merupakan pungutan tambahan di samping PPN dan tidak dapat dikreditkan dengan PPN maupun PPnBM lainnya."],
  ["ppn101.pdf", 45, 1, "Pemungut PPN", "ppn2025", 112, "Pihak Lain Pasal 32A UU KUP mencakup pelaku usaha PMSE, Marketplace Pengadaan atau Ritel Daring Pengadaan, dan penyelenggara PMSE aset kripto; kontraktor PKP2B tidak tercantum."],
  ["ppn101.pdf", 50, 1, "Penyetoran PPN", "ppn2025", 117, "Batas penyetoran PPN adalah paling lama akhir bulan berikutnya setelah berakhirnya masa pajak dan sebelum SPT Masa PPN disampaikan."],

  ["tdn101.pdf", 3, 2, "Asas Tata Naskah Dinas", "tndDay4", 8, "Asas pembakuan berarti diproses berdasarkan tata cara dan bentuk yang dibakukan."],
  ["tdn101.pdf", 4, 0, "Dasar Tata Naskah Dinas", "tndDay4", 3, "Arsip Nasional Republik Indonesia berwenang menyusun pedoman umum TND."],
  ["tdn101.pdf", 9, 2, "Pernyataan Penutup", "tndDay4", 14, "Pernyataan penutup memberikan penekanan akhir secara sopan agar penerima surat merasa dihargai dan bersedia menanggapi isi surat dengan lebih baik."],
  ["tdn101.pdf", 10, 0, "Bahasa Naskah Dinas", "tndDay4", 15, "Bahasa naskah dinas mengacu pada Ejaan Bahasa Indonesia yang Disempurnakan."],
  ["tdn101.pdf", 11, 2, "Naskah Dinas Arahan", "tndDay4", 17, "Naskah Dinas Arahan terdiri atas pengaturan, penetapan, dan penugasan."],
  ["tdn101.pdf", 12, 2, "Surat Edaran", "tndDay4", 19, "Surat Edaran adalah Naskah Dinas yang memuat pemberitahuan mengenai ketentuan dalam peraturan perundang-undangan yang penting dan mendesak untuk segera dilaksanakan."],
  ["tdn101.pdf", 14, 0, "Notula", "tndDay4", 28, "Notula adalah Naskah Dinas berupa catatan singkat mengenai jalannya rapat serta hal yang dibicarakan dan diputuskan."],
  ["tdn101.pdf", 16, 2, "Nadine", "tndDay4", 2, "Nadine digunakan dalam penanganan naskah dinas masuk dan keluar."],
  ["tdn101.pdf", 17, 1, "Pengelolaan Naskah Dinas", "tndDay4", 36, "Koordinasi dilakukan dengan metode yang paling cepat dan tepat, seperti diskusi, kunjungan pribadi, jaringan telepon, dan lain-lain."],
  ["tdn101.pdf", 21, 3, "Tanda Tangan Elektronik", "tndDay4", 42, "BSSN melakukan sertifikasi tanda tangan elektronik."],
  ["tdn101.pdf", 23, 1, "Format Naskah Dinas", "tndDay4", 39, "Kata sambung menandai teks yang berlanjut ke halaman berikutnya."],

  ["tik101.pdf", 1, 2, "Keamanan Informasi", "tik2025", 2, "Aspek keamanan informasi mencakup confidentiality, integrity, dan availability; security bukan salah satu aspek dalam daftar tersebut."],
  ["tik101.pdf", 6, 2, "Microsoft Word", "tik2025", 10, "Manfaat Microsoft Word yang dicantumkan adalah produktivitas tinggi, fleksibilitas pemformatan, serta konsistensi dan profesionalisme; akurasi data tidak tercantum."],
  ["tik101.pdf", 7, 0, "Microsoft Excel", "excelConcatenateMicrosoft", "Microsoft Support; fallback karena materi lokal hanya menampilkan MAX sebagai fungsi statistik, bukan daftar fungsi teks", "CONCATENATE adalah fungsi Excel untuk menggabungkan beberapa item teks menjadi satu item teks."]
];

const extractedQuestions = JSON.parse(readFileSync(join(cacheRoot, "extracted-questions.json"), "utf8"));
const questionByKey = new Map(extractedQuestions.map((question) => [`${question.sourceTitle}#${question.ordinal}`, question]));

const localQuestions = curatedItems.map(([sourceTitle, ordinal, correctOptionIndex, topic, sourceKey, page, referenceNote]) => {
  const question = questionByKey.get(`${sourceTitle}#${ordinal}`);
  if (!question) {
    throw new Error(`Missing extracted question ${sourceTitle}#${ordinal}`);
  }
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    throw new Error(`Question ${sourceTitle}#${ordinal} does not have exactly four options.`);
  }

  const source = sources[sourceKey];
  if (!source) {
    throw new Error(`Missing source metadata for key ${sourceKey} used by ${sourceTitle}#${ordinal}`);
  }
  const answer = question.options[correctOptionIndex];
  const reference = typeof page === "number" ? `halaman ${page}` : page;
  const note = `${basename(question.sourcePath)} nomor ${ordinal}; diverifikasi dari ${reference}. ${referenceNote}`;

  return {
    categoryId: question.categoryId,
    topic,
    question: question.question,
    answer,
    options: question.options,
    correctOptionIndex,
    explanation: `Jawaban yang benar adalah ${answer}. ${referenceNote}`,
    source: {
      ...source,
      note
    }
  };
});

writeFileSync(outputPath, `${JSON.stringify(localQuestions, null, 2)}\n`);

console.log(JSON.stringify({
  written: outputPath,
  count: localQuestions.length,
  byCategory: localQuestions.reduce((counts, question) => {
    counts[question.categoryId] = (counts[question.categoryId] ?? 0) + 1;
    return counts;
  }, {})
}, null, 2));
