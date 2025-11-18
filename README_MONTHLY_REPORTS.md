# Fitur Laporan Bulanan Koperasi Simpan Pinjam

## Overview
Aplikasi Kosek III telah diperbarui untuk fokus pada **Koperasi Simpan Pinjam** dengan menambahkan sistem **Laporan Bulanan** yang komprehensif.

## Perubahan Utama

### 1. Fokus Simpan Pinjam
- Dashboard dan analisis sekarang fokus pada koperasi dengan tipe "Simpan Pinjam"
- Filter otomatis diterapkan pada semua view untuk menampilkan hanya Koperasi Simpan Pinjam

### 2. Role Baru
Aplikasi menambahkan 3 role baru untuk mendukung sistem laporan bulanan:

#### **Staf Kosek III** (`kosek_staff`)
- Email: `staf.kosek@demo`
- Password: `demo123`
- Fungsi:
  - Input laporan bulanan dari Asisten dan Kepala Satrad
  - Membuat analisis Kosek III
  - Mengelola dan mereview laporan bulanan
  - Akses penuh ke analytics dan dashboard

#### **Asisten Kepala Satrad** (`assistant`)
- Email: `asisten@demo`
- Password: `demo123`
- Fungsi:
  - Submit data finansial bulanan koperasi
  - Data mencakup: anggota, simpanan, pinjaman, NPL, pendapatan/biaya operasional

#### **Kepala Satrad** (`satrad_head`)
- Email: `kepala.satrad@demo`
- Password: `demo123`
- Fungsi:
  - Submit hasil monitoring dan rekomendasi
  - Data mencakup: kunjungan monitoring, masalah ditemukan/diselesaikan, skor kepatuhan

### 3. Sistem Laporan Bulanan

#### Struktur Laporan
Setiap laporan bulanan terdiri dari 3 komponen:

##### A. Laporan Asisten Kepala Satrad
- Total anggota (baru, keluar)
- Total simpanan
- Total pinjaman
- Pencairan dan pembayaran pinjaman
- NPL (Non Performing Loan)
- Pendapatan dan biaya operasional
- Catatan observasi

##### B. Laporan Kepala Satrad
- Jumlah kunjungan monitoring
- Masalah yang ditemukan
- Masalah yang diselesaikan
- Skor kepatuhan (0-100)
- Rekomendasi
- Rencana tindak lanjut

##### C. Analisis Kosek III
- Penilaian keseluruhan (Sangat Baik, Baik, Cukup, Kurang, Buruk)
- Poin kekuatan (multiple)
- Poin perhatian (multiple)
- Rekomendasi Kosek III
- Flag tindak lanjut (Ya/Tidak)

## Fitur Laporan Bulanan

### Menu "Laporan Bulanan" (📝)
Akses melalui sidebar untuk melihat dan mengelola laporan bulanan.

#### Halaman Daftar Laporan
- **URL**: `/monthly-reports`
- **Fitur**:
  - Filter berdasarkan bulan, koperasi, dan status
  - Tabel dengan informasi: bulan, koperasi, status, NPL, penilaian, tanggal submit
  - Statistik laporan: Total, Complete, Pending Review, Koperasi Aktif
  - Tombol "Tambah Laporan Baru" (untuk Staf Kosek)

#### Halaman Detail Laporan
- **URL**: `/monthly-reports/:id`
- **Fitur**:
  - Informasi lengkap laporan
  - Section terpisah untuk laporan Asisten, Kepala Satrad, dan Analisis Kosek
  - Visualisasi data dengan card dan badge warna-warni
  - Indikator NPL dengan status (Sehat/Perhatian/Kritis)
  - Highlight kekuatan dan perhatian dengan icon
  - Alert tindak lanjut

#### Halaman Form Laporan
- **URL**: `/monthly-reports/new` dan `/monthly-reports/:id/edit`
- **Fitur**:
  - Form 3 section (Assistant, Satrad Head, Kosek Analysis)
  - Pilihan koperasi Simpan Pinjam (dropdown)
  - Input bulan dengan month picker
  - Status laporan: Draft, Pending Review, Complete
  - Input dinamis untuk kekuatan dan perhatian (dapat menambah/hapus item)
  - Validasi required fields
  - Auto-calculate dan format data

## Demo Data
Aplikasi sudah dilengkapi dengan 4 contoh laporan bulanan:
- 2 laporan untuk Koperasi Maju Bersama (Januari & Februari 2024)
- 2 laporan untuk Koperasi Harmoni (Januari & Februari 2024)

## Cara Menggunakan

### Untuk Staf Kosek III:
1. Login dengan `staf.kosek@demo` / `demo123`
2. Klik menu "Laporan Bulanan" di sidebar
3. Klik "Tambah Laporan Baru"
4. Pilih koperasi dan bulan
5. Isi data dari Asisten Kepala Satrad (section 1)
6. Isi data dari Kepala Satrad (section 2)
7. Buat analisis Kosek III (section 3)
8. Pilih status (Draft/Pending Review/Complete)
9. Simpan laporan

### Untuk Melihat Laporan:
1. Login dengan role apa saja (semua bisa view)
2. Klik menu "Laporan Bulanan"
3. Gunakan filter untuk mencari laporan spesifik
4. Klik "Lihat Detail" untuk melihat laporan lengkap

## Technical Details

### Data Structure
```javascript
{
  id: number,
  cooperativeId: number,
  cooperativeName: string,
  month: 'YYYY-MM',
  monthLabel: 'Bulan YYYY',
  status: 'Draft' | 'Pending Review' | 'Complete',
  submittedBy: string,
  submittedById: number,
  submittedDate: 'YYYY-MM-DD',
  assistantReport: {...},
  satradHeadReport: {...},
  kosekAnalysis: {...}
}
```

### Permissions
- `view_all`: Semua role (kecuali manager)
- `manage_monthly_reports`: Admin, Kosek Staff
- `add_monthly_report`: Admin, Kosek Staff
- `submit_assistant_report`: Assistant
- `submit_satrad_report`: Satrad Head

## Files Modified/Added
### New Files:
- `src/pages/MonthlyReportsPage.jsx` - List laporan
- `src/pages/MonthlyReportDetail.jsx` - Detail laporan
- `src/pages/MonthlyReportForm.jsx` - Form tambah/edit

### Modified Files:
- `src/data/mockData.js` - Added DEMO_USERS updates & INITIAL_MONTHLY_REPORTS
- `src/context/DataContext.jsx` - Added monthly reports CRUD functions
- `src/context/AuthContext.jsx` - Added new permissions for new roles
- `src/App.jsx` - Added routes for monthly reports
- `src/components/layout/Sidebar.jsx` - Added "Laporan Bulanan" menu
- `src/pages/LoginPage.jsx` - Added quick login for new roles
- `src/pages/DashboardHome.jsx` - Filtered to show only Simpan Pinjam cooperatives

## Next Steps (Future Enhancement)
- Export laporan bulanan ke PDF/Excel
- Grafik tren NPL dan metrics per koperasi
- Notifikasi untuk laporan yang pending
- Approval workflow untuk laporan
- Upload dokumen pendukung
- Integration dengan sistem eksternal
