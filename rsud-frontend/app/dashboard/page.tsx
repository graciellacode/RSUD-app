// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

interface Stats {
    totalPasien: number;
    totalDokter: number;
    totalPendaftaran: number;
    totalRekamMedis: number;
    pendaftaranStatus: {
        MENUNGGU: number;
        SELESAI: number;
        BATAL: number;
    };
    recentPendaftaran: Array<{
        id: number;
        tanggalPeriksa: string;
        noAntrean: number;
        status: string;
        keluhan: string;
        pasien: {
            nama: string;
            nik: string;
        };
        jadwalPraktek: {
            dokter: {
                nama: string;
            };
        };
    }>;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (err: any) {
                console.error(err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError('Akses ditolak. Silakan login kembali.');
                    localStorage.removeItem('token');
                    setTimeout(() => router.push('/login'), 2000);
                } else {
                    setError('Gagal memuat data dashboard.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Memuat data dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <p className="text-slate-800 font-semibold">{error}</p>
                    <button 
                        onClick={() => router.push('/login')}
                        className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
                    >
                        Ke Halaman Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-indigo-600 p-2 text-white">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="font-bold text-xl text-slate-800 tracking-tight">RSUD Sehat Bersama</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">Pantau dan kelola data layanan kesehatan RSUD secara langsung.</p>
                </div>

                {/* Grid Overview Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card Pasien */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                        <div className="rounded-xl bg-blue-50 p-4 text-blue-600">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Pasien</p>
                            <p className="text-2xl font-bold text-slate-800">{stats?.totalPasien}</p>
                        </div>
                    </div>

                    {/* Card Dokter */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                        <div className="rounded-xl bg-emerald-50 p-4 text-emerald-600">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Dokter</p>
                            <p className="text-2xl font-bold text-slate-800">{stats?.totalDokter}</p>
                        </div>
                    </div>

                    {/* Card Pendaftaran */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                        <div className="rounded-xl bg-amber-50 p-4 text-amber-600">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Antrean</p>
                            <p className="text-2xl font-bold text-slate-800">{stats?.totalPendaftaran}</p>
                        </div>
                    </div>

                    {/* Card Rekam Medis */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                        <div className="rounded-xl bg-purple-50 p-4 text-purple-600">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Rekam Medis</p>
                            <p className="text-2xl font-bold text-slate-800">{stats?.totalRekamMedis}</p>
                        </div>
                    </div>
                </div>

                {/* Queue Status Breakdown & Recent Registrations */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Status Antrean */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Status Pendaftaran</h2>
                            <p className="text-xs text-slate-400 mb-6">Pembagian status antrean pendaftaran saat ini</p>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-slate-700">MENUNGGU</span>
                                        <span className="font-bold text-amber-600">{stats?.pendaftaranStatus.MENUNGGU}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-amber-500" 
                                            style={{ width: `${stats?.totalPendaftaran ? (stats.pendaftaranStatus.MENUNGGU / stats.totalPendaftaran) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-slate-700">SELESAI</span>
                                        <span className="font-bold text-emerald-600">{stats?.pendaftaranStatus.SELESAI}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500" 
                                            style={{ width: `${stats?.totalPendaftaran ? (stats.pendaftaranStatus.SELESAI / stats.totalPendaftaran) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-slate-700">BATAL</span>
                                        <span className="font-bold text-red-600">{stats?.pendaftaranStatus.BATAL}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-red-500" 
                                            style={{ width: `${stats?.totalPendaftaran ? (stats.pendaftaranStatus.BATAL / stats.totalPendaftaran) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
                            Diperbarui secara real-time
                        </div>
                    </div>

                    {/* Pendaftaran Terbaru */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 lg:col-span-2">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Pendaftaran Terbaru</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">No. Antrean</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pasien</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dokter</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Keluhan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats?.recentPendaftaran && stats.recentPendaftaran.length > 0 ? (
                                        stats.recentPendaftaran.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 text-sm font-bold text-slate-700">#{p.noAntrean}</td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-slate-800">{p.pasien.nama}</p>
                                                    <p className="text-xs text-slate-400">NIK: {p.pasien.nik}</p>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{p.jadwalPraktek?.dokter?.nama}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                        p.status === 'SELESAI' ? 'bg-emerald-50 text-emerald-700' :
                                                        p.status === 'BATAL' ? 'bg-red-50 text-red-700' :
                                                        'bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">{p.keluhan}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">Belum ada data pendaftaran.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
