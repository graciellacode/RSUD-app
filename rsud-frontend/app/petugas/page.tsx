'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

interface Dokter {
    id: number;
    nama: string;
    spesialisasi: string;
}

interface JadwalPraktek {
    id: number;
    dokterId: number;
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    kuota: number;
    dokter: Dokter;
}

interface Pasien {
    id: number;
    nama: string;
    noHp: string;
}

interface Pendaftaran {
    id: number;
    pasienId: number;
    jadwalPraktekId: number;
    tanggalPeriksa: string;
    noAntrean: number;
    status: string;
    keluhan: string;
    pasien: Pasien;
    jadwalPraktek: JadwalPraktek;
}

const POLI_TABS = ['Umum', 'Anak', 'Gigi', 'Kandungan', 'Jantung'];

function isToday(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    );
}

export default function PetugasPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [selectedPoli, setSelectedPoli] = useState(POLI_TABS[0]);
    const [data, setData] = useState<Pendaftaran[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'antrian' | 'selesai'>('antrian');
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setCheckingAuth(false);
    }, [router]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/pendaftaran');
            setData(res.data);
            setError('');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                router.push('/login');
            } else {
                setError('Gagal memuat data antrian. Silakan refresh halaman.');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!checkingAuth) fetchData();
    }, [checkingAuth, fetchData]);

    const todayPoliData = useMemo(() => {
        return data.filter(
            (p) =>
                isToday(p.tanggalPeriksa) &&
                p.jadwalPraktek?.dokter?.spesialisasi === selectedPoli
        );
    }, [data, selectedPoli]);

    const menunggu = useMemo(
        () =>
            todayPoliData
                .filter((p) => p.status === 'MENUNGGU')
                .sort((a, b) => a.noAntrean - b.noAntrean),
        [todayPoliData]
    );
    const dipanggil = useMemo(
        () => todayPoliData.find((p) => p.status === 'DIPANGGIL'),
        [todayPoliData]
    );
    const selesai = useMemo(
        () =>
            todayPoliData
                .filter((p) => p.status === 'SELESAI')
                .sort((a, b) => a.noAntrean - b.noAntrean),
        [todayPoliData]
    );
    const antrianGabungan = useMemo(
        () =>
            todayPoliData
                .filter((p) => p.status === 'MENUNGGU' || p.status === 'DIPANGGIL')
                .sort((a, b) => a.noAntrean - b.noAntrean),
        [todayPoliData]
    );

    const updateStatus = async (id: number, status: string) => {
        try {
            setActionLoading(true);
            await api.patch(`/pendaftaran/${id}`, { status });
            await fetchData();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Gagal memperbarui status antrian.');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePanggilBerikutnya = () => {
        if (!menunggu.length) return;
        updateStatus(menunggu[0].id, 'DIPANGGIL');
    };

    const handlePanggilUlang = () => {
        if (!dipanggil) return;
        setToast(`Memanggil ulang: ${dipanggil.pasien.nama}`);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSelesai = () => {
        if (!dipanggil) return;
        updateStatus(dipanggil.id, 'SELESAI');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        router.push('/');
    };

    if (checkingAuth) return null;

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-indigo-800 px-4 py-6 text-white">
                <div className="mx-auto max-w-3xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/')} className="text-white/90 hover:text-white">
                            ←
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">Dashboard Petugas</h1>
                            <p className="text-xs text-indigo-200">{today}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                            Poli {selectedPoli}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-indigo-200 hover:text-white underline"
                        >
                            Keluar
                        </button>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl mt-4 flex gap-2 overflow-x-auto pb-1">
                    {POLI_TABS.map((poli) => (
                        <button
                            key={poli}
                            onClick={() => setSelectedPoli(poli)}
                            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${selectedPoli === poli
                                ? 'bg-white text-indigo-800'
                                : 'bg-indigo-700 text-white hover:bg-indigo-600'
                                }`}
                        >
                            {poli}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
                {toast && (
                    <div className="rounded-xl bg-slate-800 text-white text-sm px-4 py-3 shadow-lg">
                        {toast}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                                <p className="text-xs font-semibold text-amber-600">Menunggu</p>
                                <p className="text-3xl font-bold text-amber-500">{menunggu.length}</p>
                            </div>
                            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                                <p className="text-xs font-semibold text-indigo-600">Dipanggil</p>
                                <p className="text-3xl font-bold text-indigo-600">{dipanggil ? 1 : 0}</p>
                            </div>
                            <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
                                <p className="text-xs font-semibold text-green-600">Selesai</p>
                                <p className="text-3xl font-bold text-green-600">{selesai.length}</p>
                            </div>
                        </div>

                        {dipanggil ? (
                            <div className="rounded-2xl bg-indigo-800 text-white p-6 shadow-lg">
                                <div className="flex items-start justify-between flex-wrap gap-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">
                                            Sedang Dilayani
                                        </p>
                                        <h2 className="text-6xl font-extrabold">
                                            {String(dipanggil.noAntrean).padStart(3, '0')}
                                        </h2>
                                        <p className="mt-2 text-lg font-semibold">{dipanggil.pasien.nama}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={handlePanggilUlang}
                                            disabled={actionLoading}
                                            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
                                        >
                                            🔔 Panggil Ulang
                                        </button>
                                        <button
                                            onClick={handleSelesai}
                                            disabled={actionLoading}
                                            className="rounded-xl bg-green-500 hover:bg-green-400 px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
                                        >
                                            ✓ Selesai
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
                                Tidak ada pasien yang sedang dilayani
                            </div>
                        )}

                        <button
                            onClick={handlePanggilBerikutnya}
                            disabled={!menunggu.length || actionLoading}
                            className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-4 font-bold text-white shadow-lg transition disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                            🔔 Panggil Antrian Berikutnya
                            {menunggu.length > 0 && (
                                <span className="rounded-full bg-white/20 px-3 py-0.5 text-sm">
                                    #{String(menunggu[0].noAntrean).padStart(3, '0')}
                                </span>
                            )}
                        </button>

                        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
                            <div className="flex border-b border-slate-100">
                                <button
                                    onClick={() => setActiveTab('antrian')}
                                    className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'antrian'
                                        ? 'text-indigo-700 border-b-2 border-indigo-700'
                                        : 'text-slate-400'
                                        }`}
                                >
                                    Antrian ({antrianGabungan.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('selesai')}
                                    className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'selesai'
                                        ? 'text-indigo-700 border-b-2 border-indigo-700'
                                        : 'text-slate-400'
                                        }`}
                                >
                                    Selesai ({selesai.length})
                                </button>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {activeTab === 'antrian' &&
                                    (antrianGabungan.length ? (
                                        antrianGabungan.map((p) => (
                                            <div key={p.id} className="flex items-center justify-between px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                                        {String(p.noAntrean).padStart(3, '0')}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{p.pasien.nama}</p>
                                                        <p className="text-xs text-slate-400">{p.pasien.noHp}</p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${p.status === 'DIPANGGIL'
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                        }`}
                                                >
                                                    {p.status === 'DIPANGGIL' ? 'Dipanggil' : 'Menunggu'}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="px-4 py-8 text-center text-sm text-slate-400">
                                            Tidak ada data antrian
                                        </p>
                                    ))}

                                {activeTab === 'selesai' &&
                                    (selesai.length ? (
                                        selesai.map((p) => (
                                            <div key={p.id} className="flex items-center justify-between px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                                        {String(p.noAntrean).padStart(3, '0')}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{p.pasien.nama}</p>
                                                        <p className="text-xs text-slate-400">{p.pasien.noHp}</p>
                                                    </div>
                                                </div>
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                    Selesai
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="px-4 py-8 text-center text-sm text-slate-400">
                                            Belum ada antrian selesai
                                        </p>
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}