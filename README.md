# Kosek III - Dashboard Monitoring Koperasi

Dashboard web modern untuk monitoring dan analisis koperasi di bawah komando regional Kosek III.

## 🎯 Deskripsi

Aplikasi ini adalah **DEMO** yang dirancang untuk memberikan gambaran lengkap tentang sistem monitoring koperasi. Semua data bersifat mock/in-memory dan tidak terhubung dengan backend atau database nyata.

### Fitur Utama

1. **Dashboard Overview**
   - Ringkasan metrik koperasi
   - Visualisasi distribusi risiko
   - Chart skor kesehatan
   - Daftar top cooperatives

2. **Master Data Koperasi**
   - CRUD koperasi (in-memory)
   - Filter & search
   - Detail lengkap per koperasi
   - Tabs: Profile, Keanggotaan, Keuangan, Kesehatan, Kepatuhan, Audit

3. **Analisis & Perbandingan**
   - Peringkat skor kesehatan
   - Tabel perbandingan lengkap
   - Filter dan sorting

4. **Audit & Follow-Up**
   - Daftar audit
   - Task management
   - Status tracking

5. **Laporan & Analitik**
   - Visualisasi data
   - Export CSV
   - Metrik kepatuhan

6. **Role-Based Access**
   - Admin Kosek III (full access)
   - Auditor/Pengawas
   - Analis Keuangan
   - Pengelola Koperasi

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Demo Login

#### Login dengan Credentials:
- **Admin Kosek III**: `admin.kosek3@demo` / `demo123`
- **Auditor**: `auditor@demo` / `demo123`
- **Analis Keuangan**: `analis@demo` / `demo123`
- **Pengelola Koperasi 1**: `koperasi1@demo` / `demo123`
- **Pengelola Koperasi 2**: `koperasi2@demo` / `demo123`

#### Quick Login:
Gunakan tombol "Quick Demo Login" di halaman login untuk langsung masuk tanpa memasukkan credentials.

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── common/          # Reusable components (Button, Card, Badge, Table)
│   └── layout/          # Layout components (Sidebar, Topbar, Layout)
├── context/
│   ├── AuthContext.jsx  # Authentication state management
│   └── DataContext.jsx  # Data state management (cooperatives, audits, tasks)
├── data/
│   └── mockData.js      # Mock data untuk demo
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardHome.jsx
│   ├── CooperativesList.jsx
│   ├── CooperativeDetail.jsx
│   ├── CooperativeForm.jsx
│   ├── AnalysisPage.jsx
│   ├── AuditsPage.jsx
│   ├── ReportsPage.jsx
│   └── SettingsPage.jsx
├── utils/
│   └── helpers.js       # Helper functions
├── App.jsx
├── main.jsx
└── index.css
```

## 🔐 Roles & Permissions

### Admin Kosek III
- ✅ View all cooperatives
- ✅ Create, edit, delete cooperatives
- ✅ Manage users
- ✅ Add audits and notes
- ✅ Full access to analytics

### Auditor / Pengawas
- ✅ View all cooperatives
- ✅ Add audit records and risk flags
- ✅ Update follow-up status
- ✅ Access to analytics

### Analis Keuangan
- ✅ View all cooperatives
- ✅ Full access to analytics and charts
- ✅ Generate and export reports
- ❌ Cannot edit data

### Pengelola Koperasi
- ✅ View and edit own cooperative only
- ✅ Limited dashboard
- ❌ Cannot view other cooperatives

## 📊 Data Model

### Cooperative
Setiap koperasi memiliki data:
- Basic info (nama, kode, region, tipe, status)
- Membership (total anggota, pertumbuhan)
- Financial (aset, liabilitas, ekuitas, simpanan, pinjaman, NPL)
- Health score & risk level
- Compliance items
- Audit history

### Audit
- Tanggal audit
- Auditor
- Summary
- Risk level
- Follow-up status
- Notes

### Task
- Deskripsi
- Deadline
- Responsible person
- Status (Open, In Progress, Closed)

## ⚠️ Keterbatasan Demo

- ❌ No real backend/API
- ❌ No database persistence
- ❌ No localStorage/sessionStorage
- ❌ Data reset on page refresh
- ❌ No real file upload
- ❌ No email notifications

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router 6** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Context API** - State management

## 📝 Notes

1. **Persistence**: Semua data disimpan di state React. Refresh halaman akan reset semua perubahan.

2. **Role Switching**: Gunakan halaman Settings untuk berpindah role dan melihat dashboard dari perspektif berbeda.

3. **CSV Export**: Fungsi export CSV bekerja client-side menggunakan JavaScript blob.

4. **Charts**: Semua chart menggunakan data mock yang sudah didefinisikan.

## 🎨 Design Decisions

- **Clean & Professional**: UI dirancang untuk lingkungan finansial/monitoring
- **Responsive**: Layout responsif untuk desktop dan tablet
- **Color Coding**: Menggunakan warna untuk membedakan risk level dan status
- **Intuitive Navigation**: Sidebar dengan clear menu structure

## 📈 Future Enhancements (Production)

Jika dikembangkan ke production, pertimbangkan:
- Backend API dengan Node.js/Express atau Go
- Database (PostgreSQL/MySQL)
- Real-time updates dengan WebSocket
- Advanced filtering & pagination
- File upload untuk dokumen
- Email notifications
- Advanced analytics dengan AI/ML
- Mobile app version

## 📄 License

Demo project - No license specified

## 👥 Contributors

Built for Kosek III demonstration purposes.
