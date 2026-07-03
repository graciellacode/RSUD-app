// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-indigo-600 text-white px-4">

      {/* Header Logo & Nama RS */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 p-3 mb-3 shadow-inner">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold tracking-wide">RSUD Sehat Bersama</h1>
        <p className="text-xs text-indigo-200">Kota Bandung</p>
      </div>

      {/* Judul Utama */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Sistem Antrian
        </h2>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-indigo-100 mt-1">
          Digital Rumah Sakit
        </h2>
        <p className="mt-2 text-sm text-indigo-200">Selasa, 30 Juni 2026</p>
      </div>

      {/* Card Pilihan Peran */}
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl text-slate-800 space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Pilih Peran Anda</p>

        {/* Tombol Pasien */}
        <button
          onClick={() => router.push('/daftar-antrean')}
          className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100 border border-slate-100 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Pasien</h3>
              <p className="text-xs text-slate-500">Ambil nomor antrian poli</p>
            </div>
          </div>
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Tombol Petugas */}
        <button
          onClick={() => router.push('/login?role=PETUGAS')}
          className="flex w-full items-center justify-between rounded-2xl bg-amber-50/50 p-5 transition hover:bg-amber-50 border border-amber-100/70 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Petugas</h3>
              <p className="text-xs text-slate-500">Kelola dan panggil antrian</p>
            </div>
          </div>
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Tombol Admin */}
        <button
          onClick={() => router.push('/login?role=ADMIN')}
          className="flex w-full items-center justify-between rounded-2xl bg-purple-50/50 p-5 transition hover:bg-purple-50 border border-purple-100/70 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Admin</h3>
              <p className="text-xs text-slate-500">Kelola data master sistem</p>
            </div>
          </div>
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Footer Jam Pelayanan */}
        <div className="pt-4 border-t border-slate-100 flex items-start space-x-2 text-slate-400 text-xs">
          <svg className="h-4 w-4 mt-0.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-slate-600">Jam Pelayanan</p>
            <p>Senin - Jumat: 07.30 - 14.00 WIB</p>
            <p>Sabtu: 07.30 - 12.00 WIB</p>
          </div>
        </div>

      </div>
    </div>
  );
}