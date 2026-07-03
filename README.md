# 🏥 RSUD Sehat Bersama — Sistem Antrian Digital

Aplikasi manajemen antrian digital untuk Rumah Sakit Umum Daerah (RSUD) Sehat Bersama, Kota Bandung.
Dibangun dengan **Next.js** (frontend) dan **NestJS** (backend), menggunakan **MySQL** sebagai database melalui **Prisma ORM**.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Cara Menjalankan](#-cara-menjalankan)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Alur Penggunaan Aplikasi](#-alur-penggunaan-aplikasi)
- [API Endpoints](#-api-endpoints)
- [Role & Hak Akses](#-role--hak-akses)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| 📌 Pendaftaran Antrian | Pasien dapat daftar antrian secara mandiri tanpa perlu login |
| 🩺 Manajemen Poli | Admin dapat mengelola jadwal praktek dokter per poli |
| 👨‍⚕️ Manajemen Dokter | Admin dapat menambah, mengubah, dan menghapus data dokter |
| 👷 Manajemen Petugas | Admin dapat menambah, mengubah, dan menonaktifkan akun petugas |
| 📋 Manajemen Pasien | Admin dapat melihat data seluruh pasien yang terdaftar |
| 🔔 Dashboard Petugas | Petugas dapat melihat dan memanggil antrian yang masuk |
| 🔐 Autentikasi Role | Login dibedakan antara Admin dan Petugas; salah role langsung ditolak |

---

## 🛠 Teknologi yang Digunakan

### Frontend
- **Next.js 16** (App Router, TypeScript)
- **Axios** — HTTP client untuk komunikasi dengan backend
- **Vanilla CSS** — styling tanpa framework tambahan

### Backend
- **NestJS** — framework Node.js berbasis TypeScript
- **Prisma ORM** — akses database dengan type-safety
- **MySQL** — database relasional
- **JWT (JSON Web Token)** — autentikasi stateless
- **bcrypt** — hashing password

---

## 📁 Struktur Proyek

```
RSUD-app/
├── rsud-frontend/              # Aplikasi Next.js
│   └── app/
│       ├── page.tsx            # Halaman utama (pilih peran)
│       ├── login/              # Halaman login (Admin / Petugas)
│       ├── daftar-antrean/     # Pendaftaran antrian pasien
│       ├── admin/              # Dashboard Admin
│       ├── petugas/            # Dashboard Petugas
│       └── lib/api.ts          # Konfigurasi Axios (base URL backend)
│
└── rsud-backend/               # Aplikasi NestJS
    └── src/
        ├── auth/               # Login, register, manajemen user
        ├── dokter/             # CRUD data dokter
        ├── jadwal/             # CRUD jadwal praktek poli
        ├── pasien/             # CRUD data pasien
        ├── pendaftaran/        # Pendaftaran antrian
        ├── rekam-medis/        # Rekam medis pasien
        ├── dashboard/          # Data ringkasan dashboard
        └── prisma/             # Koneksi Prisma ke database
```

---

## 🚀 Cara Menjalankan

### Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v18 ke atas
- [MySQL](https://www.mysql.com/) (aktif dan bisa diakses)
- npm

---

### 1. Clone Repository

```bash
git clone <url-repository>
cd RSUD-app
```

---

### 2. Setup Backend

```bash
cd rsud-backend
npm install
```

**Buat file `.env`** di folder `rsud-backend/`:

```env
DATABASE_URL="mysql://root:PASSWORD@localhost:3306/db_rsud"
JWT_SECRET="isi_dengan_string_rahasia_yang_panjang"
```

> ⚠️ Sesuaikan `root`, `PASSWORD`, dan port `3306` dengan konfigurasi MySQL kamu.

**Jalankan migrasi database:**

```bash
npx prisma migrate dev
```

**Jalankan backend:**

```bash
npm run start:dev
```

Backend berjalan di: `http://localhost:5000`

---

### 3. Setup Frontend

Buka terminal baru:

```bash
cd rsud-frontend
npm install
npm run dev
```

Frontend berjalan di: `http://localhost:3000`

---

### 4. Buat Akun Admin Pertama

Karena belum ada UI register untuk admin, buat akun pertama via API menggunakan **Postman** atau **Thunder Client**:

```
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "Administrator",
  "email": "admin@rsud.go.id",
  "password": "password123",
  "role": "ADMIN"
}
```

---

## ⚙️ Konfigurasi Environment

### `rsud-backend/.env`

| Variabel | Contoh Nilai | Keterangan |
|----------|-------------|------------|
| `DATABASE_URL` | `mysql://root:root@localhost:3306/db_rsud` | Koneksi ke database MySQL |
| `JWT_SECRET` | `rahasia_super_aman` | Kunci enkripsi token JWT — jangan diekspos! |

---

## 🖥 Alur Penggunaan Aplikasi

```
Halaman Utama (/)
│
├── [Pasien]       → /daftar-antrean  (tanpa login)
│
├── [Petugas]      → /login?role=PETUGAS
│                         ↓ (hanya akun PETUGAS yang bisa masuk)
│                    /petugas  (dashboard petugas)
│
└── [Admin]        → /login?role=ADMIN
                          ↓ (hanya akun ADMIN yang bisa masuk)
                     /admin  (panel admin)
```

### Aturan Login

- Tombol **Admin** di beranda → hanya akun `ADMIN` yang diterima
- Tombol **Petugas** di beranda → hanya akun `PETUGAS` yang diterima
- Jika salah role, login **ditolak** meski email dan password benar

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| POST | `/auth/register` | Public | Daftarkan user baru |
| POST | `/auth/login` | Public | Login, mendapat JWT token |
| GET | `/auth/users` | Admin | Ambil semua data user |
| PATCH | `/auth/users/:id` | Admin | Update data user/petugas |
| DELETE | `/auth/users/:id` | Admin | Hapus akun user/petugas |

### Dokter

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| GET | `/dokter` | Auth | Daftar semua dokter |
| POST | `/dokter` | Admin | Tambah dokter baru |
| PATCH | `/dokter/:id` | Admin | Update data dokter |
| DELETE | `/dokter/:id` | Admin | Hapus dokter |

### Jadwal Praktek (Poli)

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| GET | `/jadwal` | Auth | Daftar semua jadwal |
| POST | `/jadwal` | Admin | Tambah jadwal baru |
| PATCH | `/jadwal/:id` | Admin | Update jadwal |
| DELETE | `/jadwal/:id` | Admin | Hapus jadwal |

### Pasien & Pendaftaran

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| GET | `/pasien` | Admin | Daftar semua pasien |
| POST | `/pendaftaran` | Public | Daftar antrian pasien |

---

## 🔐 Role & Hak Akses

| Fitur | Pasien | Petugas | Admin |
|-------|:------:|:-------:|:-----:|
| Daftar antrian | ✅ | — | — |
| Lihat & panggil antrian | — | ✅ | — |
| Kelola Dokter | — | — | ✅ |
| Kelola Jadwal Poli | — | — | ✅ |
| Kelola Akun Petugas | — | — | ✅ |
| Lihat Data Pasien | — | — | ✅ |

---

## 📝 Catatan Pengembangan

- **Password petugas**: jika dikosongkan saat edit, password lama tidak berubah
- **JWT**: token disimpan di `localStorage` browser
- Semua endpoint selain `register`, `login`, dan `pendaftaran` membutuhkan header `Authorization: Bearer <token>`
- Menghapus dokter akan **otomatis menghapus jadwal praktek** yang terkait

---

> Dibuat sebagai proyek portofolio · 2026 oleh Graciella Zahra Angelia
