import type { LearningQuestion, StudyCategory, StudyPackage } from "@/types/learning";

const PPN_2025_SOURCE = {
  title: "2. Materi Tayang Webinar PPN 2025.pdf",
  url: "https://drive.google.com/file/d/1TlUvTu9zsoMN_lbcypvZzzguepmCCOnV/view?usp=drivesdk"
};

export const studyCategories: StudyCategory[] = [
  {
    id: "ppn",
    name: "Pajak Pertambahan Nilai",
    shortName: "PPN",
    description: "Pilot materi PPN dan PPnBM untuk Persiapan U-Kom."
  }
];

export const questionBank: LearningQuestion[] = [
  {
    id: "ppn-001",
    categoryId: "ppn",
    topic: "Dasar Hukum PPN",
    question: "Apa dasar hukum pemungutan PPN yang dikenal sebagai Undang-Undang PPN 1984?",
    answer: "Undang-Undang Pajak Pertambahan Nilai 1984.",
    options: [
      "Undang-Undang Pajak Penjualan 1951",
      "Undang-Undang Pajak Pertambahan Nilai 1984",
      "Undang-Undang Harmonisasi Peraturan Perpajakan",
      "Undang-Undang Ketentuan Umum Perpajakan"
    ],
    correctOptionIndex: 1,
    explanation: "Dasar hukum pemungutan PPN dikenal sebagai Undang-Undang Pajak Pertambahan Nilai 1984.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Sebutan untuk Dasar Hukum PPN"
    }
  },
  {
    id: "ppn-002",
    categoryId: "ppn",
    topic: "Karakteristik PPN",
    question: "Manakah pernyataan yang menggambarkan karakteristik PPN?",
    answer: "Pajak atas konsumsi dalam negeri, pajak tidak langsung, multi stage non-cumulative, dan pajak objektif.",
    options: [
      "Pajak subjektif, single stage, dan final",
      "Pajak langsung, kumulatif, dan berbasis status subjek",
      "Pajak atas konsumsi dalam negeri, pajak tidak langsung, multi stage non-cumulative, dan pajak objektif",
      "Pajak atas penghasilan luar negeri, pajak langsung, dan single stage"
    ],
    correctOptionIndex: 2,
    explanation: "Karakteristik PPN meliputi pajak atas konsumsi di dalam negeri, pajak tidak langsung, multi stage non-cumulative, dan pajak objektif.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Karakteristik PPN"
    }
  },
  {
    id: "ppn-003",
    categoryId: "ppn",
    topic: "Nilai Tambah",
    question: "Dalam konteks PPN, nilai tambah timbul karena apa?",
    answer: "Dipakainya faktor-faktor produksi di setiap jalur perusahaan dalam menghasilkan, menyalurkan, memperdagangkan barang, atau memberikan jasa.",
    options: [
      "Adanya pembayaran pajak daerah oleh konsumen akhir",
      "Dipakainya faktor-faktor produksi di setiap jalur perusahaan",
      "Adanya impor barang yang selalu dikenai PPnBM",
      "Seluruh transaksi yang dilakukan oleh non-PKP"
    ],
    correctOptionIndex: 1,
    explanation: "Nilai tambah timbul dari penggunaan faktor produksi pada setiap jalur usaha sampai barang atau jasa diterima konsumen.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Apa itu Nilai Tambah?"
    }
  },
  {
    id: "ppn-004",
    categoryId: "ppn",
    topic: "Subjek PPN",
    question: "Apa definisi Pengusaha Kena Pajak berdasarkan UU PPN?",
    answer: "Pengusaha yang melakukan penyerahan BKP dan/atau JKP yang dikenai pajak berdasarkan UU PPN.",
    options: [
      "Setiap orang pribadi yang memiliki NPWP",
      "Pengusaha yang hanya melakukan ekspor barang tidak berwujud",
      "Pengusaha yang melakukan penyerahan BKP dan/atau JKP yang dikenai pajak berdasarkan UU PPN",
      "Badan pemerintah yang memungut seluruh jenis pajak"
    ],
    correctOptionIndex: 2,
    explanation: "Pasal 1 angka 15 UU PPN mendefinisikan Pengusaha Kena Pajak sebagai pengusaha yang melakukan penyerahan BKP dan/atau JKP yang dikenai pajak.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Subjek Pajak - Pengusaha Kena Pajak"
    }
  },
  {
    id: "ppn-005",
    categoryId: "ppn",
    topic: "Subjek PPN",
    question: "Berapa batas peredaran bruto dan/atau penerimaan bruto bagi Pengusaha Kecil?",
    answer: "Tidak lebih dari Rp4.800.000.000 dalam satu tahun buku.",
    options: [
      "Tidak lebih dari Rp500.000.000 dalam satu tahun buku",
      "Tidak lebih dari Rp1.800.000.000 dalam satu tahun buku",
      "Tidak lebih dari Rp4.800.000.000 dalam satu tahun buku",
      "Tidak lebih dari Rp10.000.000.000 dalam satu tahun buku"
    ],
    correctOptionIndex: 2,
    explanation: "Pengusaha Kecil memiliki jumlah peredaran bruto dan/atau penerimaan bruto tidak lebih dari Rp4,8 miliar.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Subjek Pajak - Pengusaha Kecil"
    }
  },
  {
    id: "ppn-006",
    categoryId: "ppn",
    topic: "Objek PPN",
    question: "Manakah yang merupakan objek PPN menurut Pasal 4 ayat (1) UU PPN?",
    answer: "Pemanfaatan JKP dari luar Daerah Pabean di dalam Daerah Pabean.",
    options: [
      "Pembayaran gaji karyawan oleh pemberi kerja",
      "Pemanfaatan JKP dari luar Daerah Pabean di dalam Daerah Pabean",
      "Penyerahan uang sebagai alat pembayaran",
      "Penerimaan dividen oleh pemegang saham"
    ],
    correctOptionIndex: 1,
    explanation: "Objek PPN mencakup pemanfaatan JKP dari luar Daerah Pabean di dalam Daerah Pabean.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Objek PPN"
    }
  },
  {
    id: "ppn-007",
    categoryId: "ppn",
    topic: "Tarif PPN",
    question: "Berapa tarif normal PPN sejak 1 Januari 2025?",
    answer: "12%.",
    options: ["0%", "10%", "11%", "12%"],
    correctOptionIndex: 3,
    explanation: "Tarif normal PPN sejak 1 Januari 2025 sebesar 12%.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Tarif PPN"
    }
  },
  {
    id: "ppn-008",
    categoryId: "ppn",
    topic: "Tarif PPN",
    question: "Berapa tarif PPN untuk ekspor BKP, ekspor BKP Tidak Berwujud, dan ekspor JKP?",
    answer: "0%.",
    options: ["0%", "5%", "11%", "12%"],
    correctOptionIndex: 0,
    explanation: "Pada tabel tarif, ekspor BKP, ekspor BKPTB, dan ekspor JKP tetap ditampilkan dengan tarif 0%.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Tarif PPN"
    }
  },
  {
    id: "ppn-009",
    categoryId: "ppn",
    topic: "Kegiatan Membangun Sendiri",
    question: "Salah satu kriteria bangunan dalam Kegiatan Membangun Sendiri adalah luas keseluruhan paling sedikit berapa?",
    answer: "200 m2.",
    options: ["50 m2", "100 m2", "150 m2", "200 m2"],
    correctOptionIndex: 3,
    explanation: "Kriteria KMS mencakup bangunan dengan luas keseluruhan paling sedikit 200 m2.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Penyerahan Khusus - Kegiatan Membangun Sendiri"
    }
  },
  {
    id: "ppn-010",
    categoryId: "ppn",
    topic: "Kegiatan Membangun Sendiri",
    question: "Bagaimana formula PPN terutang atas Kegiatan Membangun Sendiri?",
    answer: "20% x tarif PPN x total biaya, tidak termasuk biaya perolehan tanah.",
    options: [
      "12% x seluruh biaya termasuk tanah",
      "20% x tarif PPN x total biaya, tidak termasuk biaya perolehan tanah",
      "10% x nilai tanah dan bangunan",
      "Tarif PPh final x biaya pembangunan"
    ],
    correctOptionIndex: 1,
    explanation: "Formula PPN KMS adalah 20% x tarif PPN x total biaya, dengan pengecualian biaya perolehan tanah.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Penyerahan Khusus - Kegiatan Membangun Sendiri"
    }
  },
  {
    id: "ppn-011",
    categoryId: "ppn",
    topic: "Kegiatan Membangun Sendiri",
    question: "Dalam contoh KMS Bapak Budi, biaya bangunan Rp180.000.000 dan upah Rp70.000.000. Dengan tarif PPN 12%, berapa PPN terutang?",
    answer: "Rp6.000.000.",
    options: ["Rp3.000.000", "Rp5.500.000", "Rp6.000.000", "Rp30.000.000"],
    correctOptionIndex: 2,
    explanation: "DPP KMS tidak termasuk tanah, sehingga 20% x 12% x (Rp180.000.000 + Rp70.000.000) = Rp6.000.000.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Penyerahan Khusus - Contoh KMS"
    }
  },
  {
    id: "ppn-012",
    categoryId: "ppn",
    topic: "Penyerahan BKP",
    question: "Manakah yang termasuk penyerahan BKP menurut Pasal 1A ayat (1) UU PPN?",
    answer: "Pengalihan BKP karena perjanjian sewa beli dan/atau sewa guna usaha (leasing).",
    options: [
      "Penyerahan BKP untuk jaminan utang-piutang",
      "Penyerahan BKP kepada makelar sebagaimana dimaksud dalam KUHD",
      "Pengalihan BKP karena perjanjian sewa beli dan/atau sewa guna usaha (leasing)",
      "Pengalihan BKP dalam pemusatan tempat pajak terutang"
    ],
    correctOptionIndex: 2,
    explanation: "Pengalihan BKP karena sewa beli atau leasing termasuk penyerahan BKP.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Pasal 1A ayat (1) UU PPN - Yang termasuk penyerahan BKP"
    }
  },
  {
    id: "ppn-013",
    categoryId: "ppn",
    topic: "Penyerahan BKP",
    question: "Apa yang dimaksud dengan pemakaian sendiri dalam konteks PPN?",
    answer: "Pemakaian untuk kepentingan pengusaha sendiri, pengurus, atau karyawan, baik barang produksi sendiri maupun bukan produksi sendiri.",
    options: [
      "Pemakaian untuk kepentingan pengusaha sendiri, pengurus, atau karyawan",
      "Pemakaian oleh konsumen akhir yang selalu bukan objek PPN",
      "Pemakaian oleh pemerintah daerah untuk pajak daerah",
      "Pemakaian barang impor yang belum dikeluarkan dari pabean"
    ],
    correctOptionIndex: 0,
    explanation: "Pemakaian sendiri adalah pemakaian untuk kepentingan pengusaha sendiri, pengurus, atau karyawan.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Pasal 1A ayat (1) huruf d - Pemakaian Sendiri"
    }
  },
  {
    id: "ppn-014",
    categoryId: "ppn",
    topic: "Penyerahan BKP",
    question: "Apa yang dimaksud dengan pemberian cuma-cuma dalam konteks PPN?",
    answer: "Pemberian tanpa pembayaran, baik barang produksi sendiri maupun bukan produksi sendiri.",
    options: [
      "Pemberian dengan diskon tetapi tetap ada pembayaran",
      "Pemberian tanpa pembayaran, baik barang produksi sendiri maupun bukan produksi sendiri",
      "Penyerahan barang karena jaminan utang-piutang",
      "Penyerahan barang dari pusat ke cabang dalam pemusatan PPN"
    ],
    correctOptionIndex: 1,
    explanation: "Pemberian cuma-cuma mencakup pemberian tanpa pembayaran, misalnya pemberian contoh barang untuk promosi kepada relasi atau pembeli.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Pasal 1A ayat (1) huruf d - Pemberian Cuma-Cuma"
    }
  },
  {
    id: "ppn-015",
    categoryId: "ppn",
    topic: "Bukan BKP",
    question: "Berdasarkan ketentuan Non-BKP setelah UU HPP, makanan dan minuman yang disajikan di hotel atau restoran termasuk apa?",
    answer: "Objek pajak daerah dan retribusi daerah sesuai ketentuan peraturan di bidang pajak daerah dan retribusi daerah.",
    options: [
      "Selalu objek PPN dengan tarif normal",
      "Objek pajak daerah dan retribusi daerah sesuai ketentuan terkait",
      "Objek PPnBM dengan tarif paling rendah 10%",
      "Objek PPN ekspor dengan tarif 0%"
    ],
    correctOptionIndex: 1,
    explanation: "Makanan dan minuman di hotel, restoran, rumah makan, warung, dan sejenisnya merupakan objek pajak daerah dan retribusi daerah sesuai ketentuan terkait.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Bukan Barang Kena Pajak (Non BKP)"
    }
  },
  {
    id: "ppn-016",
    categoryId: "ppn",
    topic: "Fasilitas PPN",
    question: "Apa perbedaan utama PPN tidak dipungut dan PPN dibebaskan terkait Pajak Masukan?",
    answer: "Pada PPN tidak dipungut, Pajak Masukan dapat dikreditkan; pada PPN dibebaskan, Pajak Masukan tidak dapat dikreditkan.",
    options: [
      "Keduanya selalu membuat Pajak Masukan dapat dikreditkan",
      "Keduanya selalu membuat Pajak Masukan tidak dapat dikreditkan",
      "PPN tidak dipungut dapat mengkreditkan Pajak Masukan, PPN dibebaskan tidak dapat",
      "PPN dibebaskan dapat mengkreditkan Pajak Masukan, PPN tidak dipungut tidak dapat"
    ],
    correctOptionIndex: 2,
    explanation: "PPN tidak dipungut tetap memungkinkan pengkreditan Pajak Masukan, sedangkan PPN dibebaskan tidak.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Perbedaan PPN dibebaskan atau tidak dipungut"
    }
  },
  {
    id: "ppn-017",
    categoryId: "ppn",
    topic: "Dasar Pengenaan Pajak",
    question: "Dalam definisi Harga Jual sebagai DPP, unsur apa yang tidak termasuk di dalamnya?",
    answer: "PPN yang dipungut dan potongan harga yang dicantumkan dalam Faktur Pajak.",
    options: [
      "Biaya yang diminta penjual karena penyerahan BKP",
      "PPN yang dipungut dan potongan harga yang dicantumkan dalam Faktur Pajak",
      "Nilai berupa uang yang diminta penjual",
      "Semua biaya yang diminta penjual sebelum PPN"
    ],
    correctOptionIndex: 1,
    explanation: "Harga Jual adalah nilai berupa uang termasuk biaya yang diminta penjual, tetapi tidak termasuk PPN yang dipungut dan potongan harga dalam Faktur Pajak.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Cara Menghitung Pajak - DPP"
    }
  },
  {
    id: "ppn-018",
    categoryId: "ppn",
    topic: "Faktur Pajak",
    question: "Kode dan Nomor Seri Faktur Pajak terdiri atas berapa digit?",
    answer: "16 digit.",
    options: ["10 digit", "13 digit", "15 digit", "16 digit"],
    correctOptionIndex: 3,
    explanation: "Kode dan NSFP terdiri dari 2 digit kode transaksi, 1 digit kode status, dan 13 digit NSFP, sehingga totalnya 16 digit.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Kode dan Nomor Seri Faktur Pajak"
    }
  },
  {
    id: "ppn-019",
    categoryId: "ppn",
    topic: "Faktur Pajak",
    question: "Apa contoh penyerahan yang menggunakan kode transaksi 09?",
    answer: "Penyerahan BKP berupa aktiva yang menurut tujuan semula tidak untuk diperjualbelikan sesuai Pasal 16D UU PPN.",
    options: [
      "Penyerahan BKP/JKP kepada instansi pemerintah",
      "Penyerahan BKP/JKP yang mendapatkan fasilitas dibebaskan",
      "Penyerahan BKP berupa aktiva yang menurut tujuan semula tidak untuk diperjualbelikan",
      "Penyerahan ekspor BKP berwujud"
    ],
    correctOptionIndex: 2,
    explanation: "Kode transaksi 09 digunakan untuk penyerahan BKP berupa aktiva yang semula tidak untuk diperjualbelikan sesuai Pasal 16D UU PPN.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Urutan Prioritas Penggunaan Kode Transaksi"
    }
  },
  {
    id: "ppn-020",
    categoryId: "ppn",
    topic: "Pajak Masukan",
    question: "Kapan Pajak Masukan dalam suatu Masa Pajak pada prinsipnya dikreditkan?",
    answer: "Dikreditkan dengan Pajak Keluaran dalam Masa Pajak yang sama.",
    options: [
      "Selalu dikreditkan pada akhir tahun buku saja",
      "Dikreditkan dengan Pajak Keluaran dalam Masa Pajak yang sama",
      "Tidak pernah dapat dikreditkan oleh PKP",
      "Hanya dapat dikreditkan jika menjadi biaya dalam laporan keuangan"
    ],
    correctOptionIndex: 1,
    explanation: "Prinsip pengkreditan Pajak Masukan adalah dikreditkan dengan Pajak Keluaran dalam Masa Pajak yang sama.",
    source: {
      ...PPN_2025_SOURCE,
      note: "Slide: Prinsip Pengkreditan Pajak Masukan"
    }
  }
];

export function buildPackages(maxQuestionsPerPackage = 20): StudyPackage[] {
  return studyCategories.flatMap((category) => {
    const questions = questionBank.filter((question) => question.categoryId === category.id);
    const packageCount = Math.ceil(questions.length / maxQuestionsPerPackage);

    return Array.from({ length: packageCount }, (_, index) => {
      const packageNumber = index + 1;
      return {
        id: `${category.id}-paket-${packageNumber}`,
        categoryId: category.id,
        name: `${category.shortName} Paket ${packageNumber}`,
        questions: questions.slice(index * maxQuestionsPerPackage, (index + 1) * maxQuestionsPerPackage)
      };
    });
  });
}

export const studyPackages = buildPackages();
