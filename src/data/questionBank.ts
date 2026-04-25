import waygroundQuestionData from "./waygroundQuestions.json";
import localQuestionData from "./localQuestions.json";

import type { CategoryId, CorrectOptionIndex, LearningQuestion, SourceRef, StudyCategory, StudyPackage } from "@/types/learning";

type SourceKey =
  | "level1"
  | "level2"
  | "level3"
  | "kup2025"
  | "pph2025"
  | "ppn2025"
  | "pbb2025"
  | "bea2025"
  | "tikDay4"
  | "keuangan2025"
  | "organisasiDay4"
  | "ikDay4"
  | "kepegawaianDay5"
  | "tndDay4"
  | "arDay5"
  | "pkDay5";

type QuestionSeed = readonly [
  CategoryId,
  string,
  string,
  string,
  [string, string, string, string],
  CorrectOptionIndex,
  SourceKey,
  string
];

type ImportedQuestionSeed = {
  categoryId: CategoryId;
  topic: string;
  question: string;
  answer: string;
  options: [string, string, string, string];
  correctOptionIndex: CorrectOptionIndex;
  explanation: string;
  source: SourceRef;
};

const waygroundQuestionSeeds = waygroundQuestionData as ImportedQuestionSeed[];
const localQuestionSeeds = localQuestionData as ImportedQuestionSeed[];

const sourceRefs: Record<SourceKey, Omit<SourceRef, "note">> = {
  level1: {
    title: "Semua Topik Level 1.pdf",
    url: "https://drive.google.com/file/d/1MPwDbjEfLpVEQVXxru5LtsPtyJd1rQxC/view?usp=drive_link"
  },
  level2: {
    title: "Semua Topik Level 2.pdf",
    url: "https://drive.google.com/file/d/1Gm--3Jyp0cw4xxcX3yUv1ZARYbx1R-Gd/view?usp=drive_link"
  },
  level3: {
    title: "Semua Topik Level 3.pdf",
    url: "https://drive.google.com/file/d/198JBq9gowkjlDcTiDQdrQU4wWDJ7Iadk/view?usp=drive_link"
  },
  kup2025: {
    title: "1. Materi Tayang Webinar KUP 2025.pdf",
    url: "https://drive.google.com/file/d/19JrXqoMei4m-aZfeMc7UorhMvq05k-wb/view?usp=drive_link"
  },
  pph2025: {
    title: "4. Paparan Webinar Ukom 2025_PPh_FULL.pdf",
    url: "https://drive.google.com/file/d/1ewFIDcVBZYrkxDVNFhsaKL6XZy7dIa6x/view?usp=drive_link"
  },
  ppn2025: {
    title: "2. Materi Tayang Webinar PPN 2025.pdf",
    url: "https://drive.google.com/file/d/1TlUvTu9zsoMN_lbcypvZzzguepmCCOnV/view?usp=drivesdk"
  },
  pbb2025: {
    title: "5. Materi Tayang Webinar PBB 2025.pdf",
    url: "https://drive.google.com/file/d/1He3Ib158h8SufXvFYnSl8zcE-FU1x7fv/view?usp=drive_link"
  },
  bea2025: {
    title: "3. Materi Tayang Webinar Bea Meterai 2025.pdf",
    url: "https://drive.google.com/file/d/1zOWysRP_ewe2jJtsmFJJsigfqvQTgaAF/view?usp=drive_link"
  },
  tikDay4: {
    title: "DAY IV - TIK.pdf",
    url: "https://drive.google.com/file/d/1VVUnaw5e1ESbLgN5zBPQtvQjsb8ZTw4u/view?usp=drive_link"
  },
  keuangan2025: {
    title: "6. Materi Tayang Webinar Keuangan 2025.pdf",
    url: "https://drive.google.com/file/d/1O8PZMfdtXOhfGZj67t9c5VA-Sv0Y8UK5/view?usp=drive_link"
  },
  organisasiDay4: {
    title: "DAY IV - ORGANISASI.pptx",
    url: "https://drive.google.com/file/d/1flT0HcgvofGiQWK8jQFdUiOKgSDSxBn_/view?usp=drive_link"
  },
  ikDay4: {
    title: "DAY IV - INTERNALISASI KEPATUHAN PART I.pdf",
    url: "https://drive.google.com/file/d/1hAtCqc6Lmarh4jN6byNxWjtMVNUiq5Fe/view?usp=drive_link"
  },
  kepegawaianDay5: {
    title: "DAY 5 - KEPEGAWAIAN.pdf",
    url: "https://drive.google.com/file/d/1BZfaRqGi0RXgl4x_Qhnq3eVT_ovVzFle/view?usp=drive_link"
  },
  tndDay4: {
    title: "DAY IV - TND.pdf",
    url: "https://drive.google.com/file/d/1MLekTG8k-0V80UpMdKIxWcwoVcEQvNiV/view?usp=drive_link"
  },
  arDay5: {
    title: "DAY 5 - MATERI AR.pdf",
    url: "https://drive.google.com/file/d/12lHssNQiEfy4M8Q2xuefyA25JYOSbuMS/view?usp=drive_link"
  },
  pkDay5: {
    title: "DAY 5 - MATERI PK.pdf",
    url: "https://drive.google.com/file/d/1INjBKUfPpBN0SaMbZ8RZtiF2erStzVVL/view?usp=drive_link"
  }
};

export const studyCategories: StudyCategory[] = [
  { id: "ppn", name: "Pajak Pertambahan Nilai", shortName: "PPN", description: "PPN, PPnBM, faktur pajak, DPP, fasilitas, dan pengkreditan Pajak Masukan." },
  { id: "kepegawaian", name: "Kepegawaian dan Keuangan", shortName: "Peg", description: "Manajemen kinerja, kepangkatan, kompetensi, cuti, gaji, tukin, dan perjalanan dinas." },
  { id: "pbb", name: "Pajak Bumi dan Bangunan", shortName: "PBB", description: "PBB P5L, pendaftaran objek, penetapan, pembayaran, dan upaya hukum PBB." },
  { id: "kup", name: "Ketentuan Umum dan Tata Cara Perpajakan", shortName: "KUP", description: "Ketentuan formal perpajakan, administrasi, penagihan, dan upaya hukum." },
  { id: "nilai-kemenkeu", name: "Nilai-Nilai Kementerian Keuangan", shortName: "Nilai", description: "Nilai Kementerian Keuangan dan perilaku utama pegawai." },
  { id: "bea-meterai", name: "Bea Meterai", shortName: "BM", description: "Objek, tarif, saat terutang, pemeteraian, pemungut, dan sanksi Bea Meterai." },
  { id: "tata-naskah-dinas", name: "Tata Naskah Dinas", shortName: "TND", description: "Asas, jenis, keamanan, rujukan, Nadine, dan tanda tangan elektronik." },
  { id: "tik", name: "Teknologi Informasi dan Komunikasi", shortName: "TIK", description: "Keamanan informasi, Microsoft 365, aplikasi perpajakan, dan layanan digital DJP." },
  { id: "internalisasi-kepatuhan", name: "Internalisasi Kepatuhan dan Disiplin", shortName: "IK", description: "Kode etik, kode perilaku, gratifikasi, benturan kepentingan, dan disiplin PNS." },
  { id: "organisasi", name: "Organisasi Kementerian Keuangan dan DJP", shortName: "Org", description: "Struktur, fungsi unit, staf ahli, KPP, KP2KP, dan UPT DJP." },
  { id: "pph", name: "Pajak Penghasilan", shortName: "PPh", description: "Subjek, objek, biaya fiskal, tarif, dan pemotongan atau pemungutan PPh." },
  { id: "account-representative", name: "Materi Level 1", shortName: "Materi Level 1", description: "Pengawasan Wajib Pajak, KPDL, SP2DK, LHP2DK, dan daftar prioritas." },
  { id: "penelaah-keberatan", name: "Materi Level 2", shortName: "Materi Level 2", description: "Keberatan, Pasal 16, Pasal 36, banding, gugatan, dan peninjauan kembali." }
];

const questionSeeds: QuestionSeed[] = [
  ["kup", "NPWP", "Berapa jangka waktu penerbitan keputusan atas permohonan penghapusan NPWP Wajib Pajak orang pribadi?", "Enam bulan sejak permohonan diterima secara lengkap.", ["Satu bulan sejak permohonan diterima", "Tiga bulan sejak permohonan diterima", "Enam bulan sejak permohonan diterima", "Dua belas bulan sejak permohonan diterima"], 2, "level1", "Try out Level 1 nomor 4; jangka waktu penghapusan NPWP orang pribadi."],
  ["kup", "Sanksi Administratif", "Jenis produk hukum apa yang menetapkan tarif bunga sebagai dasar penghitungan sanksi administrasi berupa bunga dan pemberian imbalan bunga?", "Keputusan Menteri Keuangan.", ["Peraturan Pemerintah", "Peraturan Menteri Keuangan", "Keputusan Menteri Keuangan", "Peraturan Direktur Jenderal Pajak"], 2, "level1", "Try out Level 1 nomor 3; produk hukum penetapan tarif bunga."],
  ["kup", "Putusan Banding", "Kapan tambahan pajak berdasarkan Putusan Banding harus dilunasi oleh Wajib Pajak?", "Satu bulan sejak tanggal diterbitkan Putusan Banding.", ["Sampai akhir bulan berikutnya", "Tiga bulan sejak tanggal diterbitkan", "Dua bulan sejak tanggal diterbitkan", "Satu bulan sejak tanggal diterbitkan"], 3, "level1", "Try out Level 1 nomor 5; pelunasan pajak yang bertambah karena Putusan Banding."],
  ["kup", "Pemeriksaan", "Kewajiban Wajib Pajak yang diperiksa untuk memberikan kesempatan mengakses data elektronik diatur dalam pasal mana pada UU KUP?", "Pasal 29 ayat (3a).", ["Pasal 29 ayat (3)", "Pasal 29 ayat (3a)", "Pasal 29 ayat (3b)", "Pasal 31 ayat (3)"], 1, "level1", "Try out Level 1 nomor 8; kewajiban Wajib Pajak dalam pemeriksaan."],
  ["kup", "Banding", "Apa sanksi administrasi apabila permohonan banding ditolak atau dikabulkan sebagian?", "Denda sebesar 60% dari jumlah pajak berdasarkan Putusan Banding dikurangi pajak yang telah dibayar sebelum mengajukan keberatan.", ["Denda sebesar 30% dari jumlah pajak yang disengketakan", "Denda sebesar 60% dari jumlah pajak berdasarkan Putusan Banding dikurangi pembayaran sebelum keberatan", "Kenaikan sebesar 100% dari jumlah pajak yang disengketakan", "Bunga per bulan atas seluruh pajak dalam SKPKB"], 1, "level1", "Try out Level 1 nomor 9; sanksi banding ditolak atau dikabulkan sebagian."],
  ["kup", "Penagihan", "Sejak tahun 2018, daluwarsa penagihan tertangguh karena tindakan apa?", "Diterbitkan Surat Paksa, adanya pengakuan utang pajak, diterbitkan SKPKB atau SKPKBT, atau dilakukan penyidikan tindak pidana perpajakan.", ["Diterbitkan surat teguran saja", "Diterbitkan Surat Paksa, ada pengakuan utang pajak, diterbitkan SKPKB/SKPKBT, atau dilakukan penyidikan", "Dilakukan imbauan pembayaran tanpa produk hukum", "Wajib Pajak menyampaikan SPT Tahunan lebih awal"], 1, "level1", "Try out Level 1 nomor 6; penangguhan daluwarsa penagihan."],
  ["kup", "SPT", "Apa fungsi utama Surat Pemberitahuan bagi Wajib Pajak?", "Melaporkan penghitungan atau pembayaran pajak, objek pajak, bukan objek pajak, harta, dan kewajiban sesuai ketentuan.", ["Mengganti seluruh kewajiban pembayaran pajak", "Melaporkan penghitungan atau pembayaran pajak dan informasi perpajakan lain sesuai ketentuan", "Menghapus sanksi administrasi secara otomatis", "Menjadi satu-satunya dasar keberatan pajak"], 1, "kup2025", "Pokok bahasan SPT dan pemenuhan kewajiban perpajakan."],
  ["kup", "Surat Ketetapan Pajak", "Surat ketetapan pajak apa yang menyatakan jumlah kredit pajak lebih besar daripada pajak terutang?", "Surat Ketetapan Pajak Lebih Bayar.", ["Surat Ketetapan Pajak Kurang Bayar", "Surat Ketetapan Pajak Kurang Bayar Tambahan", "Surat Ketetapan Pajak Lebih Bayar", "Surat Tagihan Pajak"], 2, "kup2025", "Pokok bahasan jenis surat ketetapan pajak."],
  ["kup", "Surat Tagihan Pajak", "Apa fungsi Surat Tagihan Pajak?", "Menagih pajak dan/atau sanksi administrasi berupa bunga dan/atau denda.", ["Mengabulkan keberatan Wajib Pajak", "Menagih pajak dan/atau sanksi administrasi", "Menghapus NPWP secara jabatan", "Menetapkan tarif PPN"], 1, "kup2025", "Pokok bahasan STP dan sanksi administrasi."],
  ["kup", "Keberatan", "Apa objek yang dapat diajukan keberatan oleh Wajib Pajak?", "Jumlah rugi, jumlah pajak, atau pemotongan/pemungutan pajak yang tercantum dalam surat ketetapan atau pemotongan/pemungutan tertentu.", ["Prosedur internal pemeriksa tanpa produk hukum", "Materi jumlah rugi, jumlah pajak, atau pemotongan/pemungutan pajak", "Keputusan pembetulan atas salah tulis tanpa nilai pajak", "Pengumuman layanan perpajakan"], 1, "kup2025", "Pokok bahasan keberatan dalam UU KUP."],
  ["kup", "Imbalan Bunga", "Apa dasar umum pemberian imbalan bunga kepada Wajib Pajak?", "Kelebihan pembayaran atau keterlambatan pengembalian yang memenuhi ketentuan imbalan bunga.", ["Pembayaran pajak tepat waktu dalam setiap masa", "Kelebihan pembayaran atau keterlambatan pengembalian yang memenuhi ketentuan", "Kekurangan pembayaran karena pembetulan SPT", "Penerbitan NPWP secara jabatan"], 1, "kup2025", "Pokok bahasan imbalan bunga."],
  ["kup", "Wakil dan Kuasa", "Siapa yang dapat menjalankan hak dan memenuhi kewajiban perpajakan Wajib Pajak badan?", "Pengurus atau kuasa yang memenuhi ketentuan.", ["Seluruh pegawai tanpa surat kuasa", "Pengurus atau kuasa yang memenuhi ketentuan", "Konsumen akhir", "Pejabat daerah setempat"], 1, "kup2025", "Pokok bahasan wakil dan kuasa Wajib Pajak."],

  ["pph", "Subjek Pajak", "Kapan kewajiban pajak subjektif warisan yang belum terbagi dimulai?", "Saat pewaris meninggal dunia dan warisan belum terbagi.", ["Saat pewaris sakit", "Saat pewaris meninggal dunia dan warisan belum terbagi", "Saat surat wasiat dibuat", "Saat warisan sudah dibagikan"], 1, "level1", "Try out Level 1 nomor 15; kewajiban pajak subjektif warisan belum terbagi."],
  ["pph", "Objek Pajak", "Manakah yang bukan objek Pajak Penghasilan?", "Warisan.", ["Penghasilan dari pekerjaan", "Warisan", "Penghasilan dari usaha", "Keuntungan penjualan harta"], 1, "level1", "Try out Level 1 nomor 16; nonobjek PPh."],
  ["pph", "Biaya Fiskal", "Pasal berapa yang mengatur biaya atau pengeluaran yang tidak boleh dikurangkan dalam menentukan Penghasilan Kena Pajak?", "Pasal 9 ayat (1) UU PPh.", ["Pasal 4 ayat (1)", "Pasal 4 ayat (3)", "Pasal 6 ayat (1)", "Pasal 9 ayat (1)"], 3, "level1", "Try out Level 1 nomor 17; biaya yang tidak boleh dikurangkan."],
  ["pph", "Angsuran PPh Pasal 25", "PT Srimulya memiliki PPh terutang Rp150.000.000, PPh Pasal 22 Rp10.000.000, dan PPh Pasal 23 Rp20.000.000. Berapa angsuran PPh Pasal 25 tahun berikutnya per bulan?", "Rp10.000.000.", ["Rp12.500.000", "Rp10.000.000", "Rp1.666.667", "Rp833.333"], 1, "level1", "Try out Level 1 nomor 12; (150 juta - 10 juta - 20 juta) / 12."],
  ["pph", "Pelunasan Tahun Berjalan", "Pelunasan PPh dalam tahun berjalan melalui pemotongan atau pemungutan oleh pihak lain tidak mencakup jenis PPh apa?", "PPh Pasal 25.", ["PPh Pasal 21", "PPh Pasal 22", "PPh Pasal 23", "PPh Pasal 25"], 3, "level1", "Try out Level 1 nomor 20; PPh Pasal 25 merupakan angsuran sendiri."],
  ["pph", "Bentuk Usaha Tetap", "Contoh bentuk usaha tetap di Indonesia adalah apa?", "Kantor cabang Bank of Tokyo di Indonesia.", ["Kantor cabang Bank Mandiri di Indonesia", "Kantor cabang Bank of Tokyo di Indonesia", "Kantor cabang Perserikatan Bangsa-Bangsa", "Sekretariat ASEAN di Jakarta"], 1, "level1", "Try out Level 1 nomor 11; contoh BUT."],
  ["pph", "Penyusutan", "PT UMP menyelesaikan gudang senilai Rp9.000.000.000 pada Juli 2023 dengan masa manfaat 30 tahun. Berapa penyusutan tahun 2023?", "Rp150.000.000.", ["Rp300.000.000", "Rp150.000.000", "Rp333.333.333", "Rp90.000.000"], 1, "level1", "Try out Level 1 nomor 19; penyusutan setengah tahun atas masa manfaat 30 tahun."],
  ["pph", "Subjek Pajak", "Apa perbedaan utama subjek pajak dalam negeri dan subjek pajak luar negeri?", "Subjek pajak dalam negeri dikenai pajak atas penghasilan dari Indonesia dan luar Indonesia, sedangkan subjek pajak luar negeri dikenai pajak atas penghasilan dari Indonesia.", ["Keduanya hanya dikenai pajak atas penghasilan dari luar Indonesia", "Subjek pajak dalam negeri dikenai pajak atas penghasilan global, sedangkan subjek pajak luar negeri atas penghasilan dari Indonesia", "Subjek pajak luar negeri selalu tidak dikenai PPh", "Subjek pajak dalam negeri hanya berupa badan"], 1, "pph2025", "Pokok bahasan SPDN, SPLN, dan BUT."],
  ["pph", "Objek PPh Final", "PPh final memiliki karakteristik apa?", "Pajak yang telah dipotong atau dibayar bersifat final dan tidak diperhitungkan lagi dalam SPT Tahunan untuk objek tersebut.", ["Selalu dapat dikreditkan dalam SPT Tahunan", "Bersifat final untuk objek tertentu dan tidak diperhitungkan lagi sebagai kredit pajak atas objek tersebut", "Hanya berlaku untuk penghasilan luar negeri", "Menghapus kewajiban pencatatan"], 1, "pph2025", "Pokok bahasan PPh final."],
  ["pph", "PPh Pasal 21", "PPh Pasal 21 terutama berkaitan dengan pemotongan atas penghasilan apa?", "Penghasilan sehubungan dengan pekerjaan, jasa, atau kegiatan orang pribadi.", ["Penghasilan dari impor barang", "Penghasilan sehubungan dengan pekerjaan, jasa, atau kegiatan orang pribadi", "Dividen yang diterima Wajib Pajak luar negeri saja", "Pengalihan hak atas tanah dan bangunan saja"], 1, "pph2025", "Pokok bahasan PPh Pasal 21."],
  ["pph", "PPh Pasal 22", "PPh Pasal 22 berkaitan dengan mekanisme apa?", "Pemungutan PPh oleh pihak tertentu sehubungan dengan kegiatan perdagangan atau transaksi tertentu.", ["Pemotongan gaji pegawai tetap", "Pemungutan PPh oleh pihak tertentu atas transaksi tertentu", "Angsuran bulanan Wajib Pajak sendiri", "Pajak final atas UMKM saja"], 1, "pph2025", "Pokok bahasan PPh Pasal 22."],
  ["pph", "PPh Pasal 24", "Apa fungsi PPh Pasal 24?", "Memberikan kredit pajak luar negeri atas pajak yang dibayar atau terutang di luar negeri sesuai ketentuan.", ["Menetapkan tarif PPh badan", "Memberikan kredit pajak luar negeri", "Mengatur pemotongan penghasilan pegawai", "Mengatur pajak final sewa tanah"], 1, "pph2025", "Pokok bahasan PPh Pasal 24."],

  ["ppn", "Dasar Hukum PPN", "Apa sebutan dasar hukum pemungutan PPN?", "Undang-Undang Pajak Pertambahan Nilai 1984.", ["Undang-Undang Pajak Penjualan 1951", "Undang-Undang Pajak Pertambahan Nilai 1984", "Undang-Undang Ketentuan Umum dan Tata Cara Perpajakan", "Undang-Undang Pajak Bumi dan Bangunan"], 1, "ppn2025", "Slide: Sebutan untuk Dasar Hukum PPN."],
  ["ppn", "Karakteristik PPN", "Manakah karakteristik PPN?", "Pajak atas konsumsi dalam negeri, tidak langsung, multi stage non-cumulative, dan objektif.", ["Pajak subjektif, single stage, dan final", "Pajak langsung, kumulatif, dan berbasis status subjek", "Pajak atas konsumsi dalam negeri, tidak langsung, multi stage non-cumulative, dan objektif", "Pajak atas penghasilan luar negeri dan single stage"], 2, "ppn2025", "Slide: Karakteristik PPN."],
  ["ppn", "Nilai Tambah", "Nilai tambah dalam PPN timbul karena apa?", "Pemakaian faktor produksi di setiap jalur usaha untuk menghasilkan, menyalurkan, memperdagangkan barang, atau memberikan jasa.", ["Pembayaran pajak daerah oleh konsumen akhir", "Pemakaian faktor produksi di setiap jalur usaha", "Impor barang yang selalu dikenai PPnBM", "Transaksi non-PKP yang selalu tidak terutang"], 1, "ppn2025", "Slide: Apa itu Nilai Tambah?"],
  ["ppn", "Pengusaha Kena Pajak", "Apa definisi Pengusaha Kena Pajak?", "Pengusaha yang melakukan penyerahan BKP dan/atau JKP yang dikenai pajak berdasarkan UU PPN.", ["Setiap orang pribadi yang memiliki NPWP", "Pengusaha yang hanya melakukan ekspor BKP tidak berwujud", "Pengusaha yang melakukan penyerahan BKP dan/atau JKP yang dikenai pajak berdasarkan UU PPN", "Badan pemerintah yang memungut seluruh jenis pajak"], 2, "ppn2025", "Slide: Subjek Pajak - Pengusaha Kena Pajak."],
  ["ppn", "Pengusaha Kecil", "Berapa batas peredaran bruto dan/atau penerimaan bruto bagi Pengusaha Kecil?", "Tidak lebih dari Rp4.800.000.000 dalam satu tahun buku.", ["Tidak lebih dari Rp500.000.000", "Tidak lebih dari Rp1.800.000.000", "Tidak lebih dari Rp4.800.000.000", "Lebih dari Rp4.800.000.000"], 2, "level1", "Try out Level 1 nomor 29; batas Pengusaha Kecil."],
  ["ppn", "Objek PPN", "Manakah yang merupakan objek PPN?", "Pemanfaatan JKP dari luar Daerah Pabean di dalam Daerah Pabean.", ["Pembayaran gaji karyawan", "Pemanfaatan JKP dari luar Daerah Pabean di dalam Daerah Pabean", "Penyerahan uang sebagai alat pembayaran", "Penerimaan dividen oleh pemegang saham"], 1, "ppn2025", "Slide: Objek PPN."],
  ["ppn", "Tarif PPN", "Berapa tarif normal PPN sejak 1 Januari 2025?", "12%.", ["0%", "10%", "11%", "12%"], 3, "ppn2025", "Slide: Tarif PPN; sumber 2025 diprioritaskan bila berbeda dengan materi lama."],
  ["ppn", "Tarif Ekspor", "Berapa tarif PPN untuk ekspor BKP, ekspor BKP tidak berwujud, dan ekspor JKP?", "0%.", ["0%", "5%", "11%", "12%"], 0, "ppn2025", "Slide: Tarif PPN untuk ekspor."],
  ["ppn", "Tarif 0%", "Tarif PPN 0% tidak dikenakan atas transaksi apa?", "Impor BKP.", ["Impor BKP", "Ekspor BKP berwujud", "Ekspor BKP tidak berwujud", "Ekspor JKP"], 0, "level1", "Try out Level 1 nomor 28; transaksi yang tidak menggunakan tarif 0%."],
  ["ppn", "Kegiatan Membangun Sendiri", "Luas bangunan paling sedikit berapa yang menjadi kriteria Kegiatan Membangun Sendiri?", "200 m2.", ["50 m2", "100 m2", "150 m2", "200 m2"], 3, "ppn2025", "Slide: Kegiatan Membangun Sendiri."],
  ["ppn", "Kegiatan Membangun Sendiri", "Bagaimana formula PPN terutang atas Kegiatan Membangun Sendiri?", "20% x tarif PPN x total biaya, tidak termasuk biaya perolehan tanah.", ["12% x seluruh biaya termasuk tanah", "20% x tarif PPN x total biaya, tidak termasuk biaya perolehan tanah", "10% x nilai tanah dan bangunan", "Tarif PPh final x biaya pembangunan"], 1, "ppn2025", "Slide: Penyerahan Khusus - Kegiatan Membangun Sendiri."],
  ["ppn", "Kegiatan Membangun Sendiri", "Bapak Budi mengeluarkan biaya bangunan Rp180.000.000 dan upah Rp70.000.000. Dengan tarif PPN 12%, berapa PPN KMS terutang?", "Rp6.000.000.", ["Rp3.000.000", "Rp5.500.000", "Rp6.000.000", "Rp30.000.000"], 2, "ppn2025", "Slide: Contoh KMS; 20% x 12% x Rp250.000.000."],
  ["ppn", "Jasa Kena Pajak", "Kegiatan pelayanan berdasarkan perikatan atau perbuatan hukum yang membuat barang, fasilitas, kemudahan, atau hak tersedia untuk dipakai merupakan definisi apa?", "Jasa.", ["Barang", "Jasa", "Barang Kena Pajak", "Jasa tidak kena pajak"], 1, "level1", "Try out Level 1 nomor 23; definisi jasa dalam UU PPN."],
  ["ppn", "Saat Terutang PPN", "Ajja menerima lemari dari toko PKP pada 21 Januari 2022 dan membayar pada 22 Januari 2022. Kapan PPN terutang?", "21 Januari 2022.", ["1 Januari 2022", "21 Januari 2022", "22 Januari 2022", "31 Januari 2022"], 1, "level1", "Try out Level 1 nomor 25; saat penyerahan BKP."],
  ["ppn", "Besaran Tertentu", "PKP penjual kendaraan bermotor bekas yang memungut PPN dengan besaran tertentu menggunakan kode transaksi berapa?", "05.", ["01", "02", "03", "05"], 3, "level1", "Try out Level 1 nomor 26; kode transaksi kendaraan bermotor bekas."],
  ["ppn", "Faktur Pajak", "Kode dan Nomor Seri Faktur Pajak terdiri atas berapa digit?", "16 digit.", ["10 digit", "13 digit", "15 digit", "16 digit"], 3, "ppn2025", "Slide: Kode dan Nomor Seri Faktur Pajak."],
  ["ppn", "Kode Transaksi", "Kode transaksi 09 digunakan untuk penyerahan apa?", "Penyerahan BKP berupa aktiva yang menurut tujuan semula tidak untuk diperjualbelikan.", ["Penyerahan BKP/JKP kepada instansi pemerintah", "Penyerahan BKP/JKP yang dibebaskan", "Penyerahan BKP berupa aktiva yang semula tidak untuk diperjualbelikan", "Ekspor BKP berwujud"], 2, "ppn2025", "Slide: Urutan Prioritas Penggunaan Kode Transaksi."],
  ["ppn", "Pajak Masukan", "Kapan Pajak Masukan pada prinsipnya dikreditkan?", "Dalam Masa Pajak yang sama dengan Pajak Keluaran.", ["Pada akhir tahun buku saja", "Dalam Masa Pajak yang sama dengan Pajak Keluaran", "Tidak pernah dapat dikreditkan", "Hanya jika menjadi biaya akuntansi"], 1, "ppn2025", "Slide: Prinsip Pengkreditan Pajak Masukan."],
  ["ppn", "Fasilitas PPN", "Apa perbedaan utama PPN tidak dipungut dan PPN dibebaskan terkait Pajak Masukan?", "PPN tidak dipungut memungkinkan Pajak Masukan dikreditkan, sedangkan PPN dibebaskan tidak memungkinkan Pajak Masukan dikreditkan.", ["Keduanya selalu dapat mengkreditkan Pajak Masukan", "Keduanya selalu tidak dapat mengkreditkan Pajak Masukan", "PPN tidak dipungut dapat mengkreditkan Pajak Masukan, PPN dibebaskan tidak dapat", "PPN dibebaskan dapat mengkreditkan Pajak Masukan, PPN tidak dipungut tidak dapat"], 2, "ppn2025", "Slide: Perbedaan PPN dibebaskan atau tidak dipungut."],
  ["ppn", "DPP", "Dalam definisi Harga Jual sebagai DPP, unsur apa yang tidak termasuk?", "PPN yang dipungut dan potongan harga yang dicantumkan dalam Faktur Pajak.", ["Biaya yang diminta penjual karena penyerahan BKP", "PPN yang dipungut dan potongan harga dalam Faktur Pajak", "Nilai berupa uang yang diminta penjual", "Biaya pengiriman yang diminta penjual sebelum PPN"], 1, "ppn2025", "Slide: Cara Menghitung Pajak - DPP."],

  ["pbb", "Objek PBB", "Areal pada hutan alam dengan IUPHHK Restorasi Ekosistem yang belum tercapai keseimbangan ekosistem dan belum ada pemanfaatan hasil hutan bukan kayu termasuk areal apa?", "Areal tidak produktif.", ["Areal tidak produktif", "Areal belum produktif", "Areal pengaman perhutanan", "Areal perlindungan dan konservasi"], 0, "level1", "Try out Level 1 nomor 31; klasifikasi areal PBB."],
  ["pbb", "Pendaftaran Objek", "Berapa lama Kepala KPP menerbitkan SKT PBB atau surat penolakan setelah permohonan pendaftaran objek pajak diterima lengkap?", "10 hari kerja.", ["10 hari kerja", "10 hari kalender", "30 hari kerja", "3 hari kerja"], 0, "level1", "Try out Level 1 nomor 32; jangka waktu penelitian administrasi pendaftaran objek PBB."],
  ["pbb", "Penghitungan PBB", "PT Ananas memiliki bumi 7.500 m2 dengan NJOP Rp14.000/m2 dan bangunan 2.000 m2 dengan NJOP Rp25.000/m2. Berapa PBB terutang pada contoh tersebut?", "Rp286.000.", ["Rp296.000", "Rp286.000", "Rp143.000", "Rp134.000"], 1, "level1", "Try out Level 1 nomor 33; contoh perhitungan PBB."],
  ["pbb", "STP PBB", "Dalam contoh SPPT Rp10.000.000 yang belum dilunasi sampai penagihan seketika dan sekaligus, berapa kekurangan denda administratif yang ditagih pada STP PBB berikutnya?", "Rp2.000.000.", ["Rp200.000", "Rp1.800.000", "Rp3.500.000", "Rp2.000.000"], 3, "level1", "Try out Level 1 nomor 34; contoh denda administratif PBB."],
  ["pbb", "Pengurangan", "Jika terdapat ketidakbenaran materi dalam penetapan besarnya PBB pada SPPT atau SKP PBB, Wajib Pajak dapat mengajukan apa?", "Pengurangan SPPT atau SKP PBB yang tidak benar.", ["Pengurangan denda administrasi PBB", "Pengurangan PBB karena kondisi tertentu", "Pengurangan SPPT atau SKP PBB yang tidak benar", "Pembatalan seluruh objek pajak"], 2, "level1", "Try out Level 1 nomor 35; pengurangan karena ketidakbenaran materi."],
  ["pbb", "Tanggal Penilaian", "Tanggal penilaian PBB P5L pada umumnya ditetapkan kapan?", "1 Januari tahun pajak.", ["1 Januari tahun pajak", "31 Maret tahun pajak", "30 Juni tahun pajak", "31 Desember tahun pajak"], 0, "pbb2025", "Pokok bahasan tanggal penilaian PBB P5L."],
  ["pbb", "Subjek PBB", "Siapa subjek PBB?", "Orang pribadi atau badan yang secara nyata mempunyai hak, memperoleh manfaat, memiliki, menguasai, atau memperoleh manfaat atas bumi dan/atau bangunan.", ["Hanya pemilik sertifikat tanah", "Orang pribadi atau badan yang memiliki, menguasai, atau memperoleh manfaat atas bumi dan/atau bangunan", "Hanya penyewa bangunan pemerintah", "Hanya pengelola kawasan hutan"], 1, "pbb2025", "Pokok bahasan subjek PBB."],
  ["pbb", "e-SPOP", "Apa fungsi e-SPOP?", "Sarana penyampaian data objek pajak PBB secara elektronik.", ["Sarana pembayaran PPh final", "Sarana penyampaian data objek pajak PBB secara elektronik", "Aplikasi pembuatan Faktur Pajak", "Sarana keberatan PPN saja"], 1, "pbb2025", "Pokok bahasan e-SPOP."],
  ["pbb", "SPPT", "Apa fungsi SPPT PBB?", "Memberitahukan besarnya PBB yang terutang kepada Wajib Pajak.", ["Menghapus objek pajak", "Memberitahukan besarnya PBB terutang", "Menetapkan PPh final", "Mengubah tarif PPN"], 1, "pbb2025", "Pokok bahasan SPPT PBB."],
  ["pbb", "SKP PBB", "Kapan SKP PBB dapat diterbitkan?", "Antara lain ketika SPOP tidak disampaikan atau berdasarkan hasil pemeriksaan terdapat PBB yang kurang dibayar.", ["Saat Wajib Pajak selalu membayar tepat waktu", "Saat SPOP tidak disampaikan atau terdapat PBB kurang dibayar", "Saat objek pajak bukan bumi atau bangunan", "Saat tarif PPN berubah"], 1, "pbb2025", "Pokok bahasan SKP PBB."],
  ["pbb", "Keberatan PBB", "Keberatan PBB dapat diajukan terhadap produk hukum apa?", "SPPT atau SKP PBB.", ["Faktur Pajak", "SPPT atau SKP PBB", "Bukti potong PPh Pasal 21", "Surat teguran internal"], 1, "pbb2025", "Pokok bahasan keberatan PBB."],
  ["pbb", "Pembetulan PBB", "Pembetulan PBB digunakan untuk memperbaiki kekeliruan apa?", "Salah tulis, salah hitung, atau kekeliruan penerapan ketentuan tertentu dalam produk hukum PBB.", ["Perubahan tarif PPh badan", "Salah tulis, salah hitung, atau kekeliruan penerapan ketentuan", "Permohonan izin cuti pegawai", "Penerbitan meterai elektronik"], 1, "pbb2025", "Pokok bahasan pembetulan PBB."],

  ["bea-meterai", "Objek Bea Meterai", "Dokumen apa yang dikenai Bea Meterai?", "Surat perjanjian, surat keterangan, surat pernyataan, atau surat lain yang sejenis beserta rangkapnya.", ["Tanda bukti penerimaan uang negara", "Kuitansi untuk semua jenis pajak", "Surat perjanjian dan surat sejenis beserta rangkapnya", "Tanda pembagian keuntungan koperasi"], 2, "level1", "Try out Level 1 nomor 36; dokumen yang dikenai Bea Meterai."],
  ["bea-meterai", "Meterai Bentuk Lain", "Jenis meterai dalam bentuk lain tidak mencakup apa?", "Meterai manual.", ["Meterai teraan", "Meterai komputerisasi", "Meterai manual", "Meterai teraan digital"], 2, "level1", "Try out Level 1 nomor 37; jenis meterai dalam bentuk lain."],
  ["bea-meterai", "Dokumen Luar Negeri", "Surat perjanjian utang-piutang dibuat di Jepang pada 15 Januari 2025 dan digunakan di Indonesia untuk menagih pada 22 Januari 2025. Kapan dikenai Bea Meterai?", "22 Januari 2025.", ["20 Januari 2025", "15 Januari 2025", "22 Januari 2025", "17 Januari 2025"], 2, "level1", "Try out Level 1 nomor 38; saat dokumen luar negeri digunakan di Indonesia."],
  ["bea-meterai", "Meterai Elektronik", "Pihak yang ditugaskan membuat dan mendistribusikan meterai elektronik adalah siapa?", "Perusahaan Umum Percetakan Uang Republik Indonesia.", ["Direktorat Jenderal Pajak", "Perusahaan Umum Percetakan Uang Republik Indonesia", "Perusahaan Umum Pos Indonesia", "PT Pos Indonesia (Persero)"], 1, "level1", "Try out Level 1 nomor 39; pihak pembuat dan distributor meterai elektronik."],
  ["bea-meterai", "Pidana Bea Meterai", "Pemalsuan meterai dengan maksud memakai atau meminta orang lain memakai sebagai meterai asli dipidana penjara paling lama berapa?", "7 tahun.", ["3 tahun", "5 tahun", "7 tahun", "9 tahun"], 2, "level1", "Try out Level 1 nomor 40; pidana pemalsuan meterai."],
  ["bea-meterai", "Tarif", "Berapa tarif Bea Meterai yang berlaku pada tahun 2025?", "Rp10.000.", ["Rp3.000", "Rp6.000", "Rp10.000", "Rp12.000"], 2, "bea2025", "Pokok bahasan tarif Bea Meterai."],
  ["bea-meterai", "Batas Nilai Dokumen", "Dokumen bernilai uang dikenai Bea Meterai apabila nilai nominalnya lebih dari berapa?", "Rp5.000.000.", ["Rp1.000.000", "Rp2.500.000", "Rp5.000.000", "Rp10.000.000"], 2, "bea2025", "Pokok bahasan threshold dokumen bernilai uang."],
  ["bea-meterai", "Saat Terutang", "Untuk dokumen yang dibuat sepihak, kapan Bea Meterai terutang?", "Saat dokumen diserahkan kepada pihak untuk siapa dokumen itu dibuat.", ["Saat dokumen masih berupa konsep", "Saat dokumen diserahkan kepada pihak untuk siapa dokumen dibuat", "Saat tahun pajak berakhir", "Saat dokumen dimusnahkan"], 1, "bea2025", "Pokok bahasan saat terutang Bea Meterai."],
  ["bea-meterai", "Pihak Terutang", "Siapa pihak yang terutang Bea Meterai atas dokumen yang dibuat oleh satu pihak?", "Pihak yang menerima dokumen.", ["Pihak yang menerima dokumen", "Pejabat pajak setempat", "Semua saksi dokumen", "Pihak yang mencetak kertas"], 0, "bea2025", "Pokok bahasan pihak terutang Bea Meterai."],
  ["bea-meterai", "Pemeteraian Kemudian", "Kapan pemeteraian kemudian diperlukan?", "Ketika dokumen yang seharusnya dikenai Bea Meterai belum dibubuhi meterai atau dibubuhi meterai kurang.", ["Ketika dokumen sudah dibubuhi meterai cukup", "Ketika dokumen yang seharusnya dikenai Bea Meterai belum dibubuhi atau kurang meterai", "Ketika dokumen tidak pernah digunakan", "Ketika dokumen hanya berupa catatan pribadi"], 1, "bea2025", "Pokok bahasan pemeteraian kemudian."],
  ["bea-meterai", "Pemungut Bea Meterai", "Apa kewajiban utama pemungut Bea Meterai?", "Memungut, menyetor, dan melaporkan Bea Meterai sesuai ketentuan.", ["Menghapus seluruh Bea Meterai terutang", "Memungut, menyetor, dan melaporkan Bea Meterai", "Menerbitkan NPWP", "Menentukan tarif PPN"], 1, "bea2025", "Pokok bahasan pemungut dan SPT Masa Bea Meterai."],
  ["bea-meterai", "SSP", "Sarana apa yang dapat digunakan dalam pembayaran Bea Meterai selain meterai?", "Surat Setoran Pajak.", ["Surat Setoran Pajak", "Surat Ketetapan Pajak Lebih Bayar", "Surat Pemberitahuan Objek Pajak", "Surat Perintah Membayar"], 0, "bea2025", "Pokok bahasan pembayaran Bea Meterai."],

  ["tik", "Keamanan Informasi", "Tiga aspek utama keamanan informasi adalah apa?", "Kerahasiaan, integritas, dan ketersediaan.", ["Kerahasiaan, integritas, ketersediaan", "Kecepatan, keandalan, keamanan", "Kualitas, keakuratan, konsistensi", "Kemudahan, kecepatan, efisiensi"], 0, "level1", "Try out Level 1 nomor 41; CIA triad."],
  ["tik", "Autentikasi", "OTP atau tautan yang dikirim ke perangkat smartphone merupakan contoh faktor autentikasi apa?", "Sesuatu yang Anda miliki.", ["Sesuatu yang Anda ketahui", "Sesuatu yang Anda miliki", "Sesuatu yang Anda adalah", "Sesuatu yang Anda lakukan"], 1, "level1", "Try out Level 1 nomor 42; faktor autentikasi possession."],
  ["tik", "Ancaman Informasi", "Contoh insiden intersepsi adalah apa?", "Kebocoran data kepegawaian atau penyadapan komunikasi.", ["Serangan DDoS yang membuat layanan tidak tersedia", "Kebocoran data kepegawaian atau penyadapan komunikasi", "Perusakan data dan perubahan isi dokumen", "Pemadaman listrik pusat data"], 1, "level1", "Try out Level 1 nomor 43; contoh intersepsi."],
  ["tik", "Microsoft Word", "Komponen utama Mail Merge adalah apa?", "Data Source dan Merge Field.", ["Data Source dan Merge Field", "Template dan grafik", "Spreadsheet dan slide presentasi", "Database dan diagram"], 0, "level1", "Try out Level 1 nomor 44; komponen Mail Merge."],
  ["tik", "Microsoft Excel", "Microsoft Excel membantu meningkatkan akurasi data terutama melalui apa?", "Penggunaan formula matematis dan fungsi perhitungan.", ["Enkripsi semua file secara otomatis", "Formula matematis dan fungsi perhitungan", "Perubahan format teks menjadi gambar", "Pembuatan laporan keuangan tanpa input"], 1, "level1", "Try out Level 1 nomor 45; fungsi formula Excel."],
  ["tik", "Microsoft Excel", "Fungsi Excel yang digunakan untuk menggabungkan beberapa item teks menjadi satu adalah apa?", "CONCATENATE.", ["CONCATENATE", "TRIM", "PROPER", "VLOOKUP"], 0, "level1", "Try out Level 1 nomor 46; fungsi penggabungan teks."],
  ["tik", "Microsoft PowerPoint", "Manakah yang bukan chart standar PowerPoint pada sumber try out?", "Gantt Chart.", ["Column Chart", "Pie Chart", "Gantt Chart", "Line Chart"], 2, "level1", "Try out Level 1 nomor 47; chart PowerPoint."],
  ["tik", "Microsoft 365", "Media penyimpanan cloud Office 365 untuk menyimpan file pribadi adalah apa?", "OneDrive.", ["Google Drive", "OneDrive", "Dropbox", "SharePoint"], 1, "level1", "Try out Level 1 nomor 48; cloud storage pribadi Office 365."],
  ["tik", "Aplikasi Perpajakan", "Aplikasi pendukung mana yang bukan berada di luar DJP Online pada sumber try out?", "Web e-SPT.", ["E-SPT PPh Pasal 21/26", "E-Faktur", "Web e-SPT", "E-Registration"], 2, "level1", "Try out Level 1 nomor 49; aplikasi pendukung DJP Online."],
  ["tik", "Aplikasi DJP", "Aplikasi apa yang digunakan untuk penggalian potensi pada proses bisnis TIK dan Account Representative?", "Kompatriot.", ["Approweb", "Tax Knowledge Base", "Kompatriot", "Appportal"], 2, "level2", "Try out Level 2 nomor 65; aplikasi modul penggalian potensi."],
  ["tik", "KPDL", "Aplikasi penunjang kegiatan pengumpulan data lapangan yang menjadi support needed app dalam CTAS adalah apa?", "Matoa.", ["SIDJPNINE Modul Alket", "M-Pajak", "Mandor", "Matoa"], 3, "level2", "Try out Level 2 nomor 67; aplikasi KPDL."],
  ["tik", "CTAS", "Proses bisnis e-TPA menjembatani kepentingan siapa?", "Wajib Pajak dan Petugas Pajak.", ["Wajib Pajak dan Petugas Pajak", "Bank dan notaris saja", "Pemerintah daerah dan bendahara saja", "Vendor aplikasi dan penyedia internet"], 0, "tikDay4", "Pokok bahasan CTAS dan e-TPA."],

  ["nilai-kemenkeu", "Nilai Kemenkeu", "Nilai Kementerian Keuangan yang menekankan pelayanan sepenuh hati, transparan, cepat, akurat, dan aman adalah nilai apa?", "Pelayanan.", ["Integritas", "Profesionalisme", "Sinergi", "Pelayanan"], 3, "level1", "Try out Level 1 nomor 51; definisi nilai Pelayanan."],
  ["nilai-kemenkeu", "Integritas", "Perilaku utama nilai Integritas menuntut pegawai untuk apa?", "Berpikir, berkata, berperilaku, dan bertindak dengan baik dan benar serta memegang teguh kode etik.", ["Mengutamakan kepentingan pribadi", "Berpikir, berkata, dan bertindak sesuai kode etik", "Menghindari kerja sama lintas unit", "Menunda layanan sampai diminta atasan"], 1, "keuangan2025", "Pokok bahasan nilai Integritas."],
  ["nilai-kemenkeu", "Profesionalisme", "Nilai Profesionalisme menuntut pegawai untuk bekerja dengan sikap apa?", "Kompeten, bertanggung jawab, dan berkomitmen tinggi.", ["Kompeten dan bertanggung jawab", "Mengutamakan hubungan pribadi", "Bekerja tanpa standar", "Menghindari pengembangan diri"], 0, "keuangan2025", "Pokok bahasan nilai Profesionalisme."],
  ["nilai-kemenkeu", "Sinergi", "Makna nilai Sinergi adalah apa?", "Membangun dan memastikan hubungan kerja sama internal yang produktif serta kemitraan harmonis dengan pemangku kepentingan.", ["Bekerja sendiri tanpa koordinasi", "Membangun kerja sama produktif dan kemitraan harmonis", "Mengutamakan capaian individu saja", "Membatasi pertukaran informasi"], 1, "keuangan2025", "Pokok bahasan nilai Sinergi."],
  ["nilai-kemenkeu", "Kesempurnaan", "Nilai Kesempurnaan mendorong pegawai untuk apa?", "Melakukan perbaikan terus-menerus dan mengembangkan inovasi.", ["Mempertahankan cara lama tanpa evaluasi", "Melakukan perbaikan terus-menerus dan inovasi", "Menghindari umpan balik", "Bekerja hanya saat diawasi"], 1, "keuangan2025", "Pokok bahasan nilai Kesempurnaan."],
  ["nilai-kemenkeu", "Pelayanan", "Perilaku Pelayanan yang baik tercermin dalam tindakan apa?", "Memberikan layanan yang memenuhi kepuasan pemangku kepentingan secara transparan, cepat, akurat, dan aman.", ["Memberikan layanan hanya kepada pihak tertentu", "Memberikan layanan transparan, cepat, akurat, dan aman", "Menolak standar layanan", "Mengabaikan kebutuhan pemangku kepentingan"], 1, "keuangan2025", "Pokok bahasan nilai Pelayanan."],
  ["nilai-kemenkeu", "Budaya Kerja", "Mengapa nilai Kementerian Keuangan penting bagi pegawai?", "Menjadi pedoman perilaku dalam menjalankan tugas dan pelayanan publik.", ["Menjadi pedoman perilaku tugas dan layanan", "Mengganti seluruh aturan disiplin", "Menghapus kebutuhan kompetensi teknis", "Membatasi koordinasi organisasi"], 0, "keuangan2025", "Pokok bahasan internalisasi nilai."],
  ["nilai-kemenkeu", "Perilaku Utama", "Nilai mana yang paling erat dengan menjaga kepercayaan dan bertindak jujur?", "Integritas.", ["Integritas", "Sinergi", "Pelayanan", "Kesempurnaan"], 0, "keuangan2025", "Pokok bahasan perilaku utama Integritas."],

  ["organisasi", "Staf Ahli", "Dalam mengoordinasikan tugas dan fungsi DJP, Dirjen Pajak dibantu oleh tiga Staf Ahli Menteri Keuangan yang mencakup bidang apa saja?", "Peraturan dan Penegakan Hukum Pajak, Kepatuhan Pajak, dan Pengawasan Pajak.", ["Peraturan dan Penegakan Hukum Pajak, Kepatuhan Pajak, dan Ekstensifikasi", "Peraturan dan Penegakan Hukum Pajak, Kepatuhan Pajak, dan Pengawasan Pajak", "Kepatuhan Pajak, Ekstensifikasi, dan Teknologi Informasi", "Pengawasan Pajak, Keuangan Negara, dan Perbendaharaan"], 1, "level1", "Try out Level 1 nomor 52; tiga staf ahli yang membantu Dirjen Pajak."],
  ["organisasi", "KPP dan KP2KP", "KPP Pratama mana yang memiliki jumlah KP2KP terbanyak pada sumber try out?", "KPP Pratama Ambon.", ["KPP Pratama Bangka", "KPP Pratama Muara Teweh", "KPP Pratama Ambon", "KPP Pratama Bukittinggi"], 2, "level1", "Try out Level 1 nomor 53; contoh wilayah kerja KP2KP."],
  ["organisasi", "UPT DJP", "Tugas dan fungsi Kantor Pengolahan Data Eksternal dialihkan ke unit apa?", "Direktorat Data dan Informasi Perpajakan.", ["Unit Pengolahan Data dan Dokumen Perpajakan", "Direktorat Data dan Informasi Perpajakan", "Kantor Layanan Informasi dan Pengaduan", "Direktorat Penyuluhan, Pelayanan, dan Hubungan Masyarakat"], 1, "level1", "Try out Level 1 nomor 54; pengalihan fungsi KPDE."],
  ["organisasi", "Kantor Pusat DJP", "Unit Kantor Pusat DJP yang merumuskan kebijakan teknis terkait KUP, penagihan, PPN, PPnBM, Pajak Tidak Langsung Lainnya, dan PBB adalah apa?", "Direktorat Peraturan Perpajakan I.", ["Direktorat Peraturan Perpajakan I", "Direktorat Peraturan Perpajakan II", "Direktorat Ekstensifikasi dan Penilaian", "Direktorat Keberatan dan Banding"], 0, "level1", "Try out Level 1 nomor 55; tugas Direktorat Peraturan Perpajakan I."],
  ["organisasi", "DJP", "DJP berada di bawah kementerian apa?", "Kementerian Keuangan.", ["Kementerian Keuangan", "Kementerian Dalam Negeri", "Kementerian Perdagangan", "Kementerian PANRB"], 0, "organisasiDay4", "Pokok bahasan posisi DJP dalam organisasi Kementerian Keuangan."],
  ["organisasi", "Kanwil DJP", "Apa fungsi umum Kantor Wilayah DJP?", "Mengoordinasikan, membina, mengendalikan, menganalisis, dan mengevaluasi pelaksanaan tugas KPP di wilayahnya.", ["Menerbitkan semua undang-undang pajak", "Mengoordinasikan dan mengendalikan pelaksanaan tugas KPP di wilayahnya", "Mengadili sengketa pajak", "Mencetak meterai elektronik"], 1, "organisasiDay4", "Pokok bahasan Kanwil DJP."],
  ["organisasi", "KPP", "Apa fungsi utama KPP?", "Melaksanakan pelayanan, pengawasan, pemeriksaan, penagihan, dan administrasi perpajakan kepada Wajib Pajak.", ["Melaksanakan administrasi perpajakan kepada Wajib Pajak", "Menyusun APBN secara nasional", "Mengadili banding pajak", "Menerbitkan peraturan pemerintah"], 0, "organisasiDay4", "Pokok bahasan KPP."],
  ["organisasi", "KP2KP", "Apa peran KP2KP?", "Memberikan pelayanan, penyuluhan, dan konsultasi perpajakan tertentu di wilayah kerja KPP.", ["Menggantikan seluruh fungsi KPP", "Memberikan pelayanan dan penyuluhan perpajakan tertentu", "Mengadili keberatan pajak", "Mencetak faktur pajak"], 1, "organisasiDay4", "Pokok bahasan KP2KP."],
  ["organisasi", "KLIP", "Apa fungsi Kantor Layanan Informasi dan Pengaduan?", "Memberikan layanan informasi dan menangani pengaduan perpajakan.", ["Menerbitkan SKPKB", "Memberikan layanan informasi dan menangani pengaduan", "Mengelola banding di Pengadilan Pajak", "Menetapkan NJOP"], 1, "organisasiDay4", "Pokok bahasan KLIP."],
  ["organisasi", "PPDDP", "Apa fungsi utama unit pengolahan data dan dokumen perpajakan?", "Mengolah data dan dokumen perpajakan untuk mendukung administrasi DJP.", ["Mengadili sengketa pajak", "Mengolah data dan dokumen perpajakan", "Mengawasi disiplin PNS nasional", "Membuat meterai elektronik"], 1, "organisasiDay4", "Pokok bahasan PPDDP/KPDDP."],

  ["internalisasi-kepatuhan", "Kode Etik", "Temuan pelanggaran Kode Etik dan Kode Perilaku Pegawai dapat berasal dari pihak mana?", "UKI, atasan terlapor, dan APIP.", ["UKI saja", "Atasan terlapor saja", "APIP saja", "UKI, atasan terlapor, dan APIP"], 3, "level1", "Try out Level 1 nomor 56; sumber temuan pelanggaran KEKP."],
  ["internalisasi-kepatuhan", "Hukuman Disiplin", "Jika pegawai yang dijatuhi hukuman disiplin tidak hadir saat penyampaian keputusan, keputusan berlaku pada hari kerja ke berapa?", "Hari kerja ke-15.", ["Hari kerja ke-13", "Hari kerja ke-14", "Hari kerja ke-15", "Hari kerja ke-30"], 2, "level1", "Try out Level 1 nomor 57; berlakunya keputusan hukuman disiplin saat pegawai tidak hadir."],
  ["internalisasi-kepatuhan", "Gratifikasi", "Unit yang menjalankan fungsi pelayanan informasi dan pengendalian gratifikasi pada unit kerja adalah apa?", "Unit Kepatuhan Internal.", ["Inspektorat Jenderal", "UPG Koordinator", "Komisi Pemberantasan Korupsi", "Unit Kepatuhan Internal"], 3, "level1", "Try out Level 1 nomor 58; fungsi UPG pada unit kerja."],
  ["internalisasi-kepatuhan", "Benturan Kepentingan", "Apa yang dimaksud benturan kepentingan?", "Situasi ketika pegawai memiliki atau patut diduga memiliki kepentingan pribadi yang memengaruhi pelaksanaan tugas.", ["Pertimbangan objektif untuk kepentingan organisasi", "Situasi pegawai memiliki kepentingan pribadi yang memengaruhi tugas", "Kondisi tanpa hubungan dengan tugas jabatan", "Seluruh jawaban salah"], 1, "level1", "Try out Level 1 nomor 59; definisi benturan kepentingan."],
  ["internalisasi-kepatuhan", "Tindak Pidana Korupsi", "Pegawai yang menjanjikan uang agar dimutasi ke kota tertentu melakukan pelanggaran apa?", "Suap menyuap.", ["Suap menyuap", "Gratifikasi yang wajib dilaporkan", "Kerugian keuangan negara", "Penggelapan dalam jabatan"], 0, "level1", "Try out Level 1 nomor 60; contoh suap menyuap."],
  ["internalisasi-kepatuhan", "Disiplin PNS", "Peraturan disiplin PNS mengelompokkan hukuman disiplin menjadi tingkat apa?", "Ringan, sedang, dan berat.", ["Administratif dan pidana", "Ringan, sedang, dan berat", "Lokal dan nasional", "Sementara dan tetap"], 1, "ikDay4", "Pokok bahasan PP 94/2021 tentang disiplin PNS."],
  ["internalisasi-kepatuhan", "Jam Kerja", "Pelanggaran jam kerja dapat berdampak pada apa?", "Penjatuhan hukuman disiplin sesuai akumulasi ketidakhadiran atau keterlambatan.", ["Penghapusan seluruh kewajiban presensi", "Hukuman disiplin sesuai akumulasi pelanggaran", "Kenaikan pangkat otomatis", "Pencabutan NPWP pegawai"], 1, "ikDay4", "Pokok bahasan pelanggaran jam kerja."],
  ["internalisasi-kepatuhan", "Gratifikasi", "Apa prinsip pelaporan gratifikasi?", "Gratifikasi yang berhubungan dengan jabatan dan berlawanan dengan kewajiban atau tugas harus dilaporkan sesuai ketentuan.", ["Seluruh gratifikasi boleh diterima tanpa pelaporan", "Gratifikasi terkait jabatan yang berlawanan dengan tugas harus dilaporkan", "Pelaporan hanya dilakukan jika nilainya di atas Rp1 miliar", "Gratifikasi tidak berhubungan dengan integritas"], 1, "ikDay4", "Pokok bahasan gratifikasi."],
  ["internalisasi-kepatuhan", "Whistleblowing", "Apa tujuan kanal pengaduan atau whistleblowing?", "Memberikan sarana pelaporan dugaan pelanggaran secara bertanggung jawab.", ["Mengganti seluruh proses pemeriksaan pajak", "Sarana pelaporan dugaan pelanggaran", "Menyebarkan informasi rahasia ke publik", "Menghapus sanksi disiplin"], 1, "ikDay4", "Pokok bahasan whistleblowing."],
  ["internalisasi-kepatuhan", "Kode Perilaku", "Kode Etik dan Kode Perilaku berfungsi sebagai apa?", "Pedoman sikap, perilaku, ucapan, tulisan, dan perbuatan pegawai.", ["Pedoman perilaku pegawai", "Daftar tarif pajak", "Aplikasi presensi", "Bukti pembayaran pajak"], 0, "ikDay4", "Pokok bahasan KEKP DJP."],
  ["internalisasi-kepatuhan", "Sanksi Moral", "Sanksi moral dikenakan terkait pelanggaran apa?", "Pelanggaran Kode Etik dan Kode Perilaku Pegawai.", ["Pelanggaran kode billing", "Pelanggaran Kode Etik dan Kode Perilaku", "Kesalahan hitung PBB", "Keterlambatan pembayaran PPN"], 1, "ikDay4", "Pokok bahasan sanksi moral."],
  ["internalisasi-kepatuhan", "Integritas", "Mengapa pengendalian benturan kepentingan penting?", "Menjaga objektivitas, integritas, dan kepercayaan dalam pelaksanaan tugas.", ["Menjaga objektivitas dan integritas pelaksanaan tugas", "Mempercepat kepentingan pribadi", "Membatasi layanan kepada publik", "Menghapus pengawasan internal"], 0, "ikDay4", "Pokok bahasan benturan kepentingan."],

  ["kepegawaian", "Kenaikan Pangkat", "Periodisasi kenaikan pangkat sesuai Peraturan BKN Nomor 4 Tahun 2023 dilakukan berapa kali setiap tahun, selain kenaikan pangkat anumerta dan pengabdian?", "Enam kali.", ["Dua kali", "Empat kali", "Enam kali", "Satu kali"], 2, "level1", "Try out Level 1 nomor 61; periodisasi kenaikan pangkat."],
  ["kepegawaian", "Kompetensi", "Pengetahuan, keterampilan, dan sikap/perilaku untuk memimpin atau mengelola unit organisasi disebut kompetensi apa?", "Kompetensi manajerial.", ["Kompetensi sosial kultural", "Kompetensi teknis", "Kompetensi manajerial", "Kompetensi fungsional"], 2, "level1", "Try out Level 1 nomor 62; definisi kompetensi manajerial."],
  ["kepegawaian", "Manajemen Kinerja", "Pelaksana dan fungsional setara pelaksana termasuk dalam level manajemen kinerja apa?", "Kemenkeu-Five.", ["Kemenkeu-Three", "Kemenkeu-Two", "Kemenkeu-Five", "Kemenkeu-Four"], 2, "level1", "Try out Level 1 nomor 63; level manajemen kinerja."],
  ["kepegawaian", "Izin Luar Negeri", "Permohonan izin luar negeri pegawai DJP harus disertai dokumen pendukung apa?", "Surat permohonan izin luar negeri beserta dokumen pendukung yang dipersyaratkan.", ["Surat izin cuti saja", "Surat izin tidak masuk bekerja saja", "Surat permohonan izin luar negeri tanpa dokumen lain", "Surat permohonan izin luar negeri beserta dokumen pendukung"], 3, "level1", "Try out Level 1 nomor 64; dokumen izin luar negeri."],
  ["kepegawaian", "Laporan Perkawinan", "Laporan perkawinan pertama dibuat paling lambat kapan sejak tanggal perkawinan?", "Satu tahun.", ["Satu hari", "Satu minggu", "Satu bulan", "Satu tahun"], 3, "level1", "Try out Level 1 nomor 65; jangka waktu laporan perkawinan."],
  ["kepegawaian", "Gaji CPNS", "CPNS diberikan gaji pokok sebesar berapa persen dari gaji pokok sebulan?", "80%.", ["70%", "80%", "90%", "100%"], 1, "level1", "Try out Level 1 nomor 66; gaji pokok CPNS."],
  ["kepegawaian", "Tunjangan Kinerja", "Dasar hukum besaran tunjangan kinerja pegawai DJP adalah apa?", "Peraturan Presiden Nomor 37 Tahun 2015.", ["PP Nomor 37 Tahun 2015", "Perpres Nomor 37 Tahun 2015", "Perpu Nomor 37 Tahun 2015", "PMK Nomor 37 Tahun 2015"], 1, "level1", "Try out Level 1 nomor 67; dasar hukum tukin DJP."],
  ["kepegawaian", "Presensi", "Berapa potongan tunjangan kinerja jika pegawai DJP baru mengisi presensi pukul 09.29 pada hari Kamis?", "2,5%.", ["1%", "1,25%", "2,5%", "5%"], 2, "level1", "Try out Level 1 nomor 68; potongan tukin karena keterlambatan."],
  ["kepegawaian", "Perjalanan Dinas", "Kelas pesawat udara yang diperbolehkan bagi pegawai golongan II adalah apa?", "Ekonomi.", ["Bisnis", "Ekonomi", "Eksekutif", "Spesial"], 1, "level1", "Try out Level 1 nomor 69; kelas pesawat perjalanan dinas."],
  ["kepegawaian", "Perjalanan Dinas Pindah", "Jumlah hari uang harian dalam perjalanan dinas pindah adalah berapa?", "Tiga hari.", ["Empat hari", "Tiga hari", "Dua hari", "Satu hari"], 1, "level1", "Try out Level 1 nomor 70; uang harian perjalanan dinas pindah."],
  ["kepegawaian", "SKP", "Apa fungsi Sasaran Kinerja Pegawai?", "Menjabarkan rencana kinerja dan target pegawai dalam periode penilaian.", ["Menjabarkan rencana dan target kinerja pegawai", "Menggantikan seluruh absensi pegawai", "Menetapkan tarif pajak", "Membuat bukti potong"], 0, "kepegawaianDay5", "Pokok bahasan SKP dan manajemen kinerja."],
  ["kepegawaian", "Coaching", "Apa tujuan coaching dalam manajemen kinerja?", "Membantu pegawai meningkatkan kinerja melalui dialog, umpan balik, dan pengembangan.", ["Membantu peningkatan kinerja melalui umpan balik", "Menjatuhkan hukuman disiplin langsung", "Menghapus target kinerja", "Mengganti penilaian atasan"], 0, "kepegawaianDay5", "Pokok bahasan coaching dan mentoring."],

  ["tata-naskah-dinas", "Asas TND", "Asas Pembakuan dalam Tata Naskah Dinas berarti naskah dinas harus bagaimana?", "Diproses berdasarkan tata cara dan bentuk yang telah dibakukan.", ["Diproses dalam satu kesatuan tanpa standar", "Diproses dengan aman dalam semua keadaan", "Diproses berdasarkan tata cara dan bentuk yang dibakukan", "Diproses secara cepat tanpa memperhatikan format"], 2, "level1", "Try out Level 1 nomor 71; asas Pembakuan."],
  ["tata-naskah-dinas", "Tingkat Keamanan", "Naskah dinas yang jika diketahui pihak tidak berhak dapat membahayakan kedaulatan negara, keutuhan wilayah, atau keselamatan bangsa memiliki tingkat keamanan apa?", "Sangat rahasia.", ["Rahasia", "Sangat rahasia", "Terbatas", "Biasa"], 1, "level1", "Try out Level 1 nomor 72; tingkat keamanan sangat rahasia."],
  ["tata-naskah-dinas", "Jenis Naskah", "Naskah dinas yang memuat pemberitahuan mengenai ketentuan yang penting dan mendesak untuk dilaksanakan adalah apa?", "Surat Edaran.", ["Surat Kuasa", "Surat Edaran", "Surat Perintah", "Surat Tugas"], 1, "level1", "Try out Level 1 nomor 73; definisi Surat Edaran."],
  ["tata-naskah-dinas", "Rujukan", "Naskah atau dokumen lain yang digunakan sebagai dasar acuan penyusunan naskah dinas disebut apa?", "Rujukan.", ["Telaahan Staf", "Rujukan", "Memori Alih Tugas", "Disposisi"], 1, "level1", "Try out Level 1 nomor 74; definisi rujukan."],
  ["tata-naskah-dinas", "TTE", "Badan yang melakukan sertifikasi Tanda Tangan Elektronik pada pengelolaan naskah dinas Kementerian Keuangan adalah apa?", "Badan Siber dan Sandi Negara.", ["Badan Siber dan Sandi Negara", "Badan Standardisasi Sandi Negara", "Badan Pusat Statistik", "Badan Sandi dan Siber Negara"], 0, "level1", "Try out Level 1 nomor 75; sertifikasi TTE."],
  ["tata-naskah-dinas", "Nadine", "Apa fungsi Nadine dalam Tata Naskah Dinas?", "Mendukung pengelolaan naskah dinas secara elektronik.", ["Mengelola naskah dinas secara elektronik", "Menerbitkan SKPKB", "Menghitung PBB", "Mencetak meterai"], 0, "tndDay4", "Pokok bahasan Nadine."],
  ["tata-naskah-dinas", "Jenis Naskah", "Surat tugas digunakan untuk apa?", "Memberi penugasan kepada pejabat atau pegawai untuk melaksanakan kegiatan kedinasan.", ["Memberi penugasan kedinasan", "Menetapkan tarif pajak", "Mengumumkan putusan pengadilan", "Menyimpan data pribadi"], 0, "tndDay4", "Pokok bahasan jenis naskah dinas."],
  ["tata-naskah-dinas", "Kecepatan Penyampaian", "Tingkat kecepatan naskah dinas menunjukkan apa?", "Prioritas waktu penyampaian atau penyelesaian naskah dinas.", ["Prioritas waktu penyampaian atau penyelesaian", "Nilai nominal dokumen", "Tarif Bea Meterai", "Jumlah lampiran wajib"], 0, "tndDay4", "Pokok bahasan tingkat kecepatan naskah dinas."],
  ["tata-naskah-dinas", "Kewenangan", "Penandatanganan naskah dinas harus memperhatikan apa?", "Kewenangan pejabat penanda tangan sesuai jenis dan substansi naskah.", ["Kewenangan pejabat sesuai jenis dan substansi naskah", "Keinginan penerima surat saja", "Jumlah halaman naskah", "Jenis font dokumen saja"], 0, "tndDay4", "Pokok bahasan kewenangan tanda tangan."],
  ["tata-naskah-dinas", "Format", "Mengapa format naskah dinas dibakukan?", "Agar naskah dinas seragam, tertib, mudah dikenali, dan sah secara administrasi.", ["Agar seragam, tertib, mudah dikenali, dan sah", "Agar setiap unit bebas tanpa standar", "Agar naskah tidak perlu disimpan", "Agar tidak perlu rujukan"], 0, "tndDay4", "Pokok bahasan format TND."],

  ["account-representative", "Objek Pengawasan", "Yang bukan objek pengawasan Account Representative adalah apa?", "Badan yang didirikan di luar Indonesia dan tidak memenuhi kriteria objek pengawasan.", ["Wajib Pajak yang belum memiliki NPWP", "Objek pajak yang telah atau belum terdaftar", "Badan yang didirikan di luar Indonesia dan tidak memenuhi kriteria objek pengawasan", "Wajib Pajak cabang tanpa pusat"], 2, "level2", "Try out Level 2 nomor 61; objek pengawasan AR."],
  ["account-representative", "Dasar Hukum AR", "Dasar hukum tugas dan fungsi Account Representative adalah apa?", "PMK-45/PMK.01/2021.", ["PMK-69/PMK.01/2017", "PMK-45/PMK.01/2021", "SE-07/PJ/2023", "UU Nomor 10 Tahun 2022"], 1, "level2", "Try out Level 2 nomor 62; dasar hukum AR."],
  ["account-representative", "Jabatan AR", "Tingkatan Account Representative dengan peringkat jabatan 8 adalah apa?", "Account Representative Tingkat II.", ["Account Representative Tingkat I", "Account Representative Tingkat II", "Account Representative Tingkat III", "Account Representative Tingkat IV"], 1, "level2", "Try out Level 2 nomor 63; tingkatan AR peringkat jabatan 8."],
  ["account-representative", "Data Konkret", "Tindak lanjut pengawasan data konkret tanpa SP2DK dilakukan atas data pemicu konkret yang akan daluwarsa kapan?", "Sampai dengan 90 hari.", ["Sampai dengan 90 hari", "Lebih dari 90 hari sampai 12 bulan", "Lebih dari 12 bulan", "Semua data konkret tanpa batas waktu"], 0, "level2", "Try out Level 2 nomor 69; tindak lanjut data konkret."],
  ["account-representative", "Bedah Wajib Pajak", "Rekapitulasi Laporan Bedah Wajib Pajak dari KPP dikompilasi Kanwil dan dikirim ke Direktorat Ekstensifikasi dan Penilaian paling lambat tanggal berapa?", "Tanggal 15 setelah periode pelaporan.", ["Tanggal 10", "Tanggal 15", "Tanggal 20", "Akhir bulan berikutnya"], 1, "level2", "Try out Level 2 nomor 70; batas pengiriman rekap Laporan Bedah WP."],
  ["account-representative", "PKM WRA", "Kriteria kegiatan PKM Wider Revenue Activities tidak mencakup apa?", "Aktivitas inti.", ["Tidak berdasarkan tindak lanjut DPP", "Dilakukan berdasarkan aktivitas tertentu", "Dituliskan dalam berita acara", "Aktivitas inti"], 3, "level2", "Try out Level 2 nomor 72; kriteria PKM WRA."],
  ["account-representative", "Daftar Prioritas", "Daftar Wajib Pajak prioritas untuk ditindaklanjuti AR adalah apa?", "DPP dan DSPE.", ["DSPC dan DSPT", "DSPPn dan DSPP", "DSPE dan DSPPH", "DPP dan DSPE"], 3, "level2", "Try out Level 2 nomor 73; daftar prioritas tindak lanjut AR."],
  ["account-representative", "LHP2DK", "Jika kesimpulan LHP2DK adalah Wajib Pajak tidak ditemukan, rekomendasi yang tepat adalah apa?", "Pengusulan kegiatan pengamatan.", ["Pengusulan kegiatan pengamatan", "Pengusulan pemeriksaan bukti permulaan", "Penerbitan SKPKB langsung", "Penghapusan NPWP otomatis"], 0, "level2", "Try out Level 2 nomor 74; rekomendasi LHP2DK WP tidak ditemukan."],
  ["account-representative", "Komite Kepatuhan", "Apa fungsi umum Komite Kepatuhan?", "Merencanakan, mengoordinasikan, memantau, dan mengevaluasi peningkatan kepatuhan Wajib Pajak.", ["Mengadili sengketa pajak", "Merencanakan dan mengevaluasi peningkatan kepatuhan Wajib Pajak", "Menerbitkan meterai elektronik", "Menentukan golongan pegawai"], 1, "arDay5", "Pokok bahasan Komite Kepatuhan."],
  ["account-representative", "KPDL", "Apa tujuan Kegiatan Pengumpulan Data Lapangan?", "Mengumpulkan data lapangan untuk memperluas basis data dan mendukung pengawasan perpajakan.", ["Mengumpulkan data lapangan untuk pengawasan perpajakan", "Mengganti seluruh pemeriksaan pajak", "Menghapus kewajiban SPT", "Menerbitkan surat perjalanan dinas"], 0, "arDay5", "Pokok bahasan KPDL."],
  ["account-representative", "SP2DK", "Apa fungsi SP2DK dalam pengawasan?", "Meminta penjelasan atas data dan/atau keterangan kepada Wajib Pajak.", ["Meminta penjelasan atas data atau keterangan", "Menerbitkan putusan banding", "Membuat kode billing otomatis", "Menetapkan jabatan pegawai"], 0, "arDay5", "Pokok bahasan SP2DK."],
  ["account-representative", "LHP2DK", "Apa fungsi LHP2DK?", "Mendokumentasikan hasil permintaan penjelasan atas data dan/atau keterangan.", ["Mendokumentasikan hasil P2DK", "Mengganti SPT Tahunan", "Menghapus sanksi administrasi otomatis", "Menerbitkan keputusan keberatan"], 0, "arDay5", "Pokok bahasan LHP2DK."],

  ["penelaah-keberatan", "Keberatan", "Wajib Pajak dapat mengajukan keberatan atas apa?", "Materi atau isi surat ketetapan pajak terkait jumlah rugi, jumlah pajak, atau pemotongan/pemungutan pajak.", ["Pelaksanaan pemeriksaan tanpa produk hukum", "Materi atau isi surat ketetapan pajak", "Jadwal kerja pegawai", "Pengumuman layanan kantor"], 1, "level3", "Try out Level 3 nomor 61; objek keberatan."],
  ["penelaah-keberatan", "Jangka Waktu Keberatan", "Wajib Pajak dapat mengajukan keberatan dalam jangka waktu berapa?", "Tiga bulan sejak tanggal surat ketetapan pajak atau pemotongan/pemungutan.", ["Tiga bulan", "Enam bulan", "Sembilan puluh hari kerja", "Dua belas bulan"], 0, "level3", "Try out Level 3 nomor 62; jangka waktu keberatan."],
  ["penelaah-keberatan", "Pembetulan", "STP bunga Pasal 9 ayat (2a) terbit untuk keterlambatan lima bulan, tetapi seharusnya empat bulan. Tindakan yang tepat adalah apa?", "Dilakukan pembetulan secara jabatan.", ["Diajukan pengurangan", "Diajukan pembatalan", "Dilakukan pembetulan secara jabatan", "Dilakukan pengurangan secara jabatan"], 2, "level3", "Try out Level 3 nomor 64; pembetulan STP karena kekeliruan data."],
  ["penelaah-keberatan", "Pembetulan", "Jika sanksi administrasi pada STP tertulis Rp350.000 tetapi karena salah hitung seharusnya Rp300.000, permohonan yang tepat adalah apa?", "Pembetulan.", ["Keberatan", "Pengurangan", "Pembatalan", "Pembetulan"], 3, "level3", "Try out Level 3 nomor 65; salah hitung pada STP."],
  ["penelaah-keberatan", "Pengurangan Sanksi", "Sanksi administrasi pasal berapa yang dapat diajukan pengurangan atau penghapusan pada sumber try out?", "Pasal 9 ayat (2a).", ["Pasal 9 ayat (1)", "Pasal 9 ayat (2a)", "Pasal 13 ayat (1)", "Pasal 13A"], 1, "level3", "Try out Level 3 nomor 66; objek pengurangan atau penghapusan sanksi."],
  ["penelaah-keberatan", "Permohonan Kedua", "Keputusan pengurangan sanksi pertama diterima pada 10 Januari 2022. Kapan batas akhir permohonan kedua?", "2 April 2022.", ["3 April 2022", "2 April 2022", "10 April 2022", "9 April 2022"], 1, "level3", "Try out Level 3 nomor 67; batas permohonan kedua."],
  ["penelaah-keberatan", "Pihak Pemohon", "Siapa pihak yang dapat mengajukan permohonan pengurangan atau penghapusan sanksi untuk PT?", "Direktur.", ["Direktur", "Tax manager tanpa kuasa", "Kuasa hukum tanpa surat kuasa", "Pemegang saham tanpa kewenangan"], 0, "level3", "Try out Level 3 nomor 68; pihak yang berwenang mengajukan permohonan."],
  ["penelaah-keberatan", "Pasal 36", "Jangka waktu penyelesaian permohonan Pasal 36 ayat (1) huruf c adalah berapa?", "Paling lama enam bulan sejak permohonan diterima.", ["Paling lama enam bulan sejak permohonan diterima", "Paling lama dua belas bulan", "Paling lama 180 hari kerja", "Paling lama tiga bulan"], 0, "level3", "Try out Level 3 nomor 73; penyelesaian Pasal 36 ayat (1) huruf c."],
  ["penelaah-keberatan", "Pasal 36 ayat (1) huruf d", "Jika Wajib Pajak tidak bersedia menandatangani berita acara pembahasan akhir pemeriksaan, permohonan Pasal 36 ayat (1) huruf d yang diajukan Wajib Pajak bagaimana?", "Ditolak.", ["Dikabulkan dan pemeriksaan dilanjutkan", "Dikabulkan dan SKP dibatalkan", "Ditolak", "Dikembalikan tanpa penelitian"], 2, "level3", "Try out Level 3 nomor 74; permohonan Pasal 36 ayat (1) huruf d."],
  ["penelaah-keberatan", "Pencabutan Permohonan", "Syarat pencabutan permohonan Pasal 36 ayat (1) huruf d tidak mencakup apa?", "Diajukan paling lama tiga bulan sejak surat ketetapan pajak diterbitkan.", ["Pencabutan diajukan secara tertulis", "Pencabutan disampaikan sebelum keputusan diterbitkan", "Surat pencabutan ditandatangani pihak berwenang", "Diajukan paling lama tiga bulan sejak surat ketetapan pajak diterbitkan"], 3, "level3", "Try out Level 3 nomor 75; syarat pencabutan permohonan."],
  ["penelaah-keberatan", "Banding", "Setelah keputusan keberatan menolak keberatan Wajib Pajak, upaya hukum berikutnya yang dapat ditempuh adalah apa?", "Banding ke Pengadilan Pajak sesuai ketentuan.", ["Banding ke Pengadilan Pajak", "Permohonan meterai elektronik", "Penghapusan NPWP otomatis", "Penerbitan SKPLB tanpa proses"], 0, "pkDay5", "Pokok bahasan alur keberatan dan banding."],
  ["penelaah-keberatan", "Gugatan", "Gugatan dalam sengketa pajak digunakan untuk menguji apa?", "Keputusan atau pelaksanaan penagihan dan keputusan tertentu yang dapat digugat sesuai ketentuan.", ["Keputusan atau pelaksanaan tertentu yang dapat digugat", "Nilai tukar mata uang", "Kode etik pegawai", "Format naskah dinas"], 0, "pkDay5", "Pokok bahasan gugatan."],
  ["penelaah-keberatan", "Peninjauan Kembali", "Peninjauan kembali diajukan ke lembaga apa?", "Mahkamah Agung.", ["Pengadilan Negeri", "Mahkamah Agung", "Kantor Wilayah DJP", "Kantor Pelayanan Pajak"], 1, "pkDay5", "Pokok bahasan peninjauan kembali."],
  ["penelaah-keberatan", "Non-Keberatan", "Permohonan Pasal 16 UU KUP terutama ditujukan untuk apa?", "Membetulkan kesalahan tulis, kesalahan hitung, atau kekeliruan penerapan ketentuan dalam produk hukum pajak.", ["Membetulkan salah tulis, salah hitung, atau kekeliruan penerapan ketentuan", "Mengajukan banding atas semua sengketa", "Membuat naskah dinas elektronik", "Menghapus kewajiban SPT"], 0, "pkDay5", "Pokok bahasan pembetulan Pasal 16 UU KUP."],
  ["penelaah-keberatan", "Sanksi Banding", "Berapa sanksi apabila banding ditolak atau dikabulkan sebagian dalam skenario try out?", "Denda 60% sesuai ketentuan yang diuji pada soal.", ["Denda 30%", "Denda 60%", "Kenaikan 100%", "Bunga tetap Rp1.000.000"], 1, "level3", "Try out Level 3 nomor 9; sanksi banding ditolak atau dikabulkan sebagian."]
];

export const contentSourceNotes = {
  wayground: {
    status: "extracted",
    extractedMcqWithAnswer: 396,
    importedUniqueQuestions: waygroundQuestionSeeds.length,
    skippedItems: [
      {
        title: "Latihan Soal Kepatuhan DJP Kuis",
        ordinal: 13,
        reason: "Question item was not a complete four-option MCQ with a reliable correct-answer index."
      },
      {
        title: "Wayground duplicate items",
        count: 55,
        reason: "Normalized duplicate questions in the same category were skipped to prevent repeated identical test items."
      }
    ],
    note:
      "All provided Wayground links were accessible after trusted access verification. Existing Wayground connector only creates new quizzes, so existing quizzes were extracted from the page JSON hydration payload."
  },
  inaccessibleDriveItems: [
    {
      title: "13. Materi Tayang Webinar Tata Naskah Dinas 2024.url",
      fileId: "1IYs5JdLpRlwigdoNVQkJZHB9x9m8I45N",
      reason: "text/x-url is not supported by the Google Drive fetch connector"
    }
  ]
};

function buildExplanation(answer: string): string {
  const trimmedAnswer = answer.trim();
  const punctuatedAnswer = /[.!?]$/.test(trimmedAnswer) ? trimmedAnswer : `${trimmedAnswer}.`;
  return `Jawaban yang benar adalah ${punctuatedAnswer} Pilihan ini sesuai dengan kunci dan rujukan sumber yang dicatat pada soal.`;
}

function buildQuestionBank(seeds: QuestionSeed[], importedSeeds: ImportedQuestionSeed[], localSeeds: ImportedQuestionSeed[]): LearningQuestion[] {
  const categoryCounts = new Map<CategoryId, number>();

  const nextId = (categoryId: CategoryId) => {
    const nextCount = (categoryCounts.get(categoryId) ?? 0) + 1;
    categoryCounts.set(categoryId, nextCount);
    return `${categoryId}-${String(nextCount).padStart(3, "0")}`;
  };

  const sourceBackedQuestions = seeds.map(([categoryId, topic, question, answer, options, correctOptionIndex, sourceKey, sourceNote]) => {
    return {
      id: nextId(categoryId),
      categoryId,
      topic,
      question,
      answer: options[correctOptionIndex],
      options,
      correctOptionIndex,
      explanation: buildExplanation(answer),
      source: {
        ...sourceRefs[sourceKey],
        note: sourceNote
      }
    };
  });

  const importedQuestions = importedSeeds.map((seed) => {
    return {
      id: nextId(seed.categoryId),
      categoryId: seed.categoryId,
      topic: seed.topic,
      question: seed.question,
      answer: seed.answer,
      options: seed.options,
      correctOptionIndex: seed.correctOptionIndex,
      explanation: seed.explanation || buildExplanation(seed.answer),
      source: seed.source
    };
  });

  const localQuestions = localSeeds.map((seed) => {
    return {
      id: nextId(seed.categoryId),
      categoryId: seed.categoryId,
      topic: seed.topic,
      question: seed.question,
      answer: seed.answer,
      options: seed.options,
      correctOptionIndex: seed.correctOptionIndex,
      explanation: seed.explanation || buildExplanation(seed.answer),
      source: seed.source
    };
  });

  return [...sourceBackedQuestions, ...importedQuestions, ...localQuestions];
}

export const questionBank: LearningQuestion[] = buildQuestionBank(questionSeeds, waygroundQuestionSeeds, localQuestionSeeds);

export function buildPackages(maxQuestionsPerPackage = 20): StudyPackage[] {
  const packageSize = Math.max(1, Math.min(20, maxQuestionsPerPackage));

  return studyCategories.flatMap((category) => {
    const questions = questionBank.filter((question) => question.categoryId === category.id);
    const packageCount = Math.ceil(questions.length / packageSize);

    return Array.from({ length: packageCount }, (_, index) => {
      const packageNumber = index + 1;
      return {
        id: `${category.id}-paket-${packageNumber}`,
        categoryId: category.id,
        name: `${category.shortName} Paket ${packageNumber}`,
        questions: questions.slice(index * packageSize, (index + 1) * packageSize)
      };
    });
  });
}

export const studyPackages = buildPackages();
