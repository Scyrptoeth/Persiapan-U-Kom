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
  tndDay4: {
    title: "DAY IV - TND.pdf",
    url: "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi/Tata Naskah Dinas (TND)/DAY IV - TND.pdf"
  }
};

const curatedItems = [
  ["bm101.pdf", 14, 0, "Pemungut Bea Meterai", "bm2025", 27, "Kewajiban penyetoran Bea Meterai oleh pemungut."],

  ["internalisasi101.pdf", 21, 1, "Pengaduan Pelanggaran", "ikLengkap", 71, "Kewajiban merahasiakan identitas pelapor."],
  ["internalisasi101.pdf", 23, 3, "Tindak Pidana Korupsi", "ikLengkap", 75, "Contoh pelanggaran suap-menyuap."],
  ["internalisasi101.pdf", 24, 1, "Tindak Pidana Korupsi", "ikLengkap", 77, "Contoh pelanggaran penggelapan dalam jabatan."],

  ["kepegawaian101.pdf", 3, 1, "Fungsi ASN", "kepegawaianLengkap", 9, "Fungsi ASN meliputi pelaksana kebijakan publik, pelayanan publik, serta perekat dan pemersatu bangsa."],
  ["kepegawaian101.pdf", 26, 1, "Tugas Belajar", "kepegawaianLengkap", 52, "Pengelolaan Tugas Belajar mengacu pada PMK Nomor 34 Tahun 2024."],
  ["kepegawaian101.pdf", 41, 3, "Manajemen Kinerja", "kepegawaianDay5", 4, "Dasar hukum manajemen kinerja di lingkungan Kementerian Keuangan."],
  ["kepegawaian101.pdf", 49, 1, "Sasaran Kinerja Pegawai", "kepegawaianLengkap", 26, "Komponen SKP mencakup hasil kerja, perilaku kerja, dan lampiran SKP."],
  ["kepegawaian101.pdf", 55, 0, "Nilai Kinerja Pegawai", "kepegawaianLengkap", 31, "Formula NKP terdiri dari NHK 70% dan NPK 30%."],

  ["kup101.pdf", 1, 2, "NITKU", "kup2025", 9, "Kewajiban melaporkan tempat kegiatan usaha untuk memperoleh NITKU."],
  ["kup101.pdf", 6, 2, "Pembukuan", "kup2025", 17, "Definisi pembukuan mencakup data harta, kewajiban, modal, penghasilan, dan biaya."],
  ["kup101.pdf", 7, 3, "Pembukuan", "kup2025", 19, "Ketentuan pembukuan tidak menggunakan frasa benar, jelas, lengkap sebagai pilihan yang diuji."],
  ["kup101.pdf", 45, 1, "Peninjauan Kembali", "kup2025", 92, "Peninjauan Kembali merupakan upaya hukum luar biasa."],

  ["organisasi101.pdf", 19, 3, "Instansi Vertikal DJP", "organisasi2025", 50, "KPP Pratama Ambon memiliki jumlah KP2KP terbanyak pada materi."],
  ["organisasi101.pdf", 21, 2, "Unit Pelaksana Teknis", "organisasi2025", 53, "Definisi Unit Pelaksana Teknis."],
  ["organisasi101.pdf", 24, 3, "Unit Pelaksana Teknis", "organisasi2025", 51, "KLIP adalah Kantor Layanan Informasi dan Pengaduan."],

  ["pbb101.pdf", 24, 2, "Pengurangan PBB", "pbb2025", 38, "Pengurangan PBB dapat diberikan karena objek pajak terdampak bencana alam."],

  ["pph101.pdf", 1, 1, "Karakteristik PPh", "pphFull", 3, "PPh merupakan pajak subjektif."],
  ["pph101.pdf", 3, 3, "Ketentuan Formal PPh", "pphFull", 3, "Ketentuan formal PPh berkaitan dengan UU KUP."],
  ["pph101.pdf", 6, 0, "Subjek PPh", "pphFull", 6, "Kantor perwakilan negara asing tidak termasuk subjek PPh dengan syarat tertentu."],
  ["pph101.pdf", 10, 2, "Bentuk Usaha Tetap", "pphFull", 4, "Kantor cabang badan luar negeri dapat menjadi BUT di Indonesia."],
  ["pph101.pdf", 16, 0, "Biaya Fiskal", "pphFull", 13, "Biaya komersial tidak selalu sama dengan biaya fiskal."],
  ["pph101.pdf", 17, 2, "Biaya Fiskal", "pphFull", 13, "Pajak Penghasilan termasuk biaya nonfiskal yang tidak dapat dikurangkan."],
  ["pph101.pdf", 22, 1, "Penilaian Harta", "pphFull", 15, "Pengalihan harta untuk setoran modal dinilai berdasarkan nilai pasar."],
  ["pph101.pdf", 25, 2, "Persediaan", "pphFull", 15, "Metode persediaan pada materi mencakup rata-rata atau FIFO."],
  ["pph101.pdf", 30, 2, "Amortisasi", "pphFull", 16, "Metode satuan produksi digunakan untuk menghitung amortisasi sesuai proporsi produksi."],
  ["pph101.pdf", 32, 3, "Kompensasi Kerugian", "pphFull", 14, "Kerugian fiskal dapat dikompensasikan selama lima tahun berturut-turut."],
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

  ["tdn101.pdf", 3, 2, "Asas Tata Naskah Dinas", "tndDay4", 8, "Asas pembakuan berarti diproses berdasarkan tata cara dan bentuk yang dibakukan."],
  ["tdn101.pdf", 4, 0, "Dasar Tata Naskah Dinas", "tndDay4", 3, "Arsip Nasional Republik Indonesia berwenang menyusun pedoman umum TND."],
  ["tdn101.pdf", 10, 0, "Bahasa Naskah Dinas", "tndDay4", 15, "Bahasa naskah dinas mengacu pada Ejaan Bahasa Indonesia yang Disempurnakan."],
  ["tdn101.pdf", 11, 2, "Naskah Dinas Arahan", "tndDay4", 17, "Naskah Dinas Arahan terdiri atas pengaturan, penetapan, dan penugasan."],
  ["tdn101.pdf", 16, 2, "Nadine", "tndDay4", 2, "Nadine digunakan dalam penanganan naskah dinas masuk dan keluar."],
  ["tdn101.pdf", 21, 3, "Tanda Tangan Elektronik", "tndDay4", 42, "BSSN melakukan sertifikasi tanda tangan elektronik."],
  ["tdn101.pdf", 23, 1, "Format Naskah Dinas", "tndDay4", 39, "Kata sambung menandai teks yang berlanjut ke halaman berikutnya."]
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
  const answer = question.options[correctOptionIndex];
  const note = `${basename(question.sourcePath)} nomor ${ordinal}; diverifikasi dari halaman ${page}. ${referenceNote}`;

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
