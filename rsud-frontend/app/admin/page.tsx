'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

interface Dokter {
    id: number;
    nama: string;
    spesialisasi: string;
    noIzinPraktek: string;
    noHp: string;
}

interface JadwalPraktek {
    id: number;
    dokterId: number;
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    kuota: number;
    dokter?: Dokter;
}

interface UserAkun {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Pasien {
    id: number;
    nik: string;
    nama: string;
    noHp: string;
    alamat: string;
}

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

type DokterForm = { nama: string; spesialisasi: string; noIzinPraktek: string; noHp: string };
type JadwalForm = { dokterId: string; hari: string; jamMulai: string; jamSelesai: string; kuota: string };

const emptyDokterForm: DokterForm = { nama: '', spesialisasi: '', noIzinPraktek: '', noHp: '' };
const emptyJadwalForm: JadwalForm = { dokterId: '', hari: 'Senin', jamMulai: '', jamSelesai: '', kuota: '' };

function kodeFromSpesialisasi(spesialisasi: string) {
    return spesialisasi.slice(0, 3).toUpperCase();
}

export default function AdminPage() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [tab, setTab] = useState<'poli' | 'dokter' | 'petugas' | 'pasien'>('poli');
    const [search, setSearch] = useState('');

    const [dokterList, setDokterList] = useState<Dokter[]>([]);
    const [jadwalList, setJadwalList] = useState<JadwalPraktek[]>([]);
    const [userList, setUserList] = useState<UserAkun[]>([]);
    const [pasienList, setPasienList] = useState<Pasien[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [dokterModal, setDokterModal] = useState<{ open: boolean; editId: number | null }>({ open: false, editId: null });
    const [dokterForm, setDokterForm] = useState<DokterForm>(emptyDokterForm);

    const [jadwalModal, setJadwalModal] = useState<{ open: boolean; editId: number | null }>({ open: false, editId: null });
    const [jadwalForm, setJadwalForm] = useState<JadwalForm>(emptyJadwalForm);

    const [petugasModal, setPetugasModal] = useState<{ open: boolean; editId: number | null }>({ open: false, editId: null });
    const [petugasForm, setPetugasForm] = useState({ name: '', email: '', password: '' });

    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRaw = localStorage.getItem('user');
        if (!token) {
            router.push('/login');
            return;
        }
        if (userRaw) {
            const user = JSON.parse(userRaw);
            if (user.role !== 'ADMIN') {
                router.push('/petugas');
                return;
            }
        }
        setCheckingAuth(false);
    }, [router]);

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const [resDokter, resJadwal, resUsers, resPasien] = await Promise.all([
                api.get('/dokter'),
                api.get('/jadwal'),
                api.get('/auth/users'),
                api.get('/pasien'),
            ]);
            setDokterList(resDokter.data);
            setJadwalList(resJadwal.data);
            setUserList(resUsers.data);
            setPasienList(resPasien.data);
            setError('');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                router.push('/login');
            } else {
                setError('Gagal memuat data. Silakan refresh halaman.');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!checkingAuth) fetchAll();
    }, [checkingAuth, fetchAll]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        router.push('/');
    };

    const petugasList = useMemo(() => userList.filter((u) => u.role === 'PETUGAS'), [userList]);

    const filteredJadwal = useMemo(() => {
        const q = search.toLowerCase();
        return jadwalList.filter(
            (j) =>
                !q ||
                j.dokter?.spesialisasi.toLowerCase().includes(q) ||
                j.dokter?.nama.toLowerCase().includes(q) ||
                kodeFromSpesialisasi(j.dokter?.spesialisasi ?? '').toLowerCase().includes(q)
        );
    }, [jadwalList, search]);

    const filteredDokter = useMemo(() => {
        const q = search.toLowerCase();
        return dokterList.filter((d) => !q || d.nama.toLowerCase().includes(q) || d.spesialisasi.toLowerCase().includes(q));
    }, [dokterList, search]);

    const filteredPetugas = useMemo(() => {
        const q = search.toLowerCase();
        return petugasList.filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }, [petugasList, search]);

    const filteredPasien = useMemo(() => {
        const q = search.toLowerCase();
        return pasienList.filter((p) => !q || p.nama.toLowerCase().includes(q) || p.nik.includes(q));
    }, [pasienList, search]);

    // ---------- Dokter CRUD ----------
    const openAddDokter = () => {
        setDokterForm(emptyDokterForm);
        setFormError('');
        setDokterModal({ open: true, editId: null });
    };
    const openEditDokter = (d: Dokter) => {
        setDokterForm({ nama: d.nama, spesialisasi: d.spesialisasi, noIzinPraktek: d.noIzinPraktek, noHp: d.noHp });
        setFormError('');
        setDokterModal({ open: true, editId: d.id });
    };
    const saveDokter = async () => {
        if (!dokterForm.nama || !dokterForm.spesialisasi || !dokterForm.noIzinPraktek || !dokterForm.noHp) {
            setFormError('Semua field wajib diisi');
            return;
        }
        try {
            setSaving(true);
            setFormError('');
            if (dokterModal.editId) {
                await api.patch(`/dokter/${dokterModal.editId}`, dokterForm);
            } else {
                await api.post('/dokter', dokterForm);
            }
            setDokterModal({ open: false, editId: null });
            await fetchAll();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Gagal menyimpan data dokter.');
        } finally {
            setSaving(false);
        }
    };
    const deleteDokter = async (id: number) => {
        if (!confirm('Hapus data dokter ini? Jadwal praktek terkait juga akan terhapus.')) return;
        try {
            await api.delete(`/dokter/${id}`);
            await fetchAll();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal menghapus dokter.');
        }
    };

    // ---------- Poli (Jadwal Praktek) CRUD ----------
    const openAddPoli = () => {
        setJadwalForm({ ...emptyJadwalForm, dokterId: dokterList[0] ? String(dokterList[0].id) : '' });
        setFormError('');
        setJadwalModal({ open: true, editId: null });
    };
    const openEditPoli = (j: JadwalPraktek) => {
        setJadwalForm({
            dokterId: String(j.dokterId),
            hari: j.hari,
            jamMulai: j.jamMulai,
            jamSelesai: j.jamSelesai,
            kuota: String(j.kuota),
        });
        setFormError('');
        setJadwalModal({ open: true, editId: j.id });
    };
    const savePoli = async () => {
        if (!jadwalForm.dokterId || !jadwalForm.hari || !jadwalForm.jamMulai || !jadwalForm.jamSelesai || !jadwalForm.kuota) {
            setFormError('Semua field wajib diisi');
            return;
        }
        try {
            setSaving(true);
            setFormError('');
            const payload = {
                dokterId: Number(jadwalForm.dokterId),
                hari: jadwalForm.hari,
                jamMulai: jadwalForm.jamMulai,
                jamSelesai: jadwalForm.jamSelesai,
                kuota: Number(jadwalForm.kuota),
            };
            if (jadwalModal.editId) {
                await api.patch(`/jadwal/${jadwalModal.editId}`, payload);
            } else {
                await api.post('/jadwal', payload);
            }
            setJadwalModal({ open: false, editId: null });
            await fetchAll();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Gagal menyimpan data poli.');
        } finally {
            setSaving(false);
        }
    };
    const deletePoli = async (id: number) => {
        if (!confirm('Hapus jadwal poli ini?')) return;
        try {
            await api.delete(`/jadwal/${id}`);
            await fetchAll();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal menghapus data.');
        }
    };

    // ---------- Petugas CRUD ----------
    const openAddPetugas = () => {
        setPetugasForm({ name: '', email: '', password: '' });
        setFormError('');
        setPetugasModal({ open: true, editId: null });
    };
    const openEditPetugas = (u: UserAkun) => {
        setPetugasForm({ name: u.name, email: u.email, password: '' });
        setFormError('');
        setPetugasModal({ open: true, editId: u.id });
    };
    const savePetugas = async () => {
        if (!petugasForm.name || !petugasForm.email) {
            setFormError('Nama dan email wajib diisi');
            return;
        }
        if (!petugasModal.editId && !petugasForm.password) {
            setFormError('Password wajib diisi untuk petugas baru');
            return;
        }
        if (petugasForm.password && petugasForm.password.length < 6) {
            setFormError('Password minimal 6 karakter');
            return;
        }
        try {
            setSaving(true);
            setFormError('');
            if (petugasModal.editId) {
                const payload: any = { name: petugasForm.name, email: petugasForm.email };
                if (petugasForm.password) payload.password = petugasForm.password;
                await api.patch(`/auth/users/${petugasModal.editId}`, payload);
            } else {
                await api.post('/auth/register', { ...petugasForm, role: 'PETUGAS' });
            }
            setPetugasModal({ open: false, editId: null });
            await fetchAll();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Gagal menyimpan data petugas.');
        } finally {
            setSaving(false);
        }
    };
    const deletePetugas = async (id: number) => {
        if (!confirm('Hapus akun petugas ini? Akun tidak akan bisa login lagi.')) return;
        try {
            await api.delete(`/auth/users/${id}`);
            await fetchAll();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal menghapus petugas.');
        }
    };

    if (checkingAuth) return null;

    const TABS = [
        { key: 'poli' as const, label: 'Poli', count: jadwalList.length },
        { key: 'dokter' as const, label: 'Dokter', count: dokterList.length },
        { key: 'petugas' as const, label: 'Petugas', count: petugasList.length },
        { key: 'pasien' as const, label: 'Pasien', count: pasienList.length },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-indigo-800 px-4 py-6 text-white">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/')} className="text-white/90 hover:text-white">
                            ←
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">Panel Administrator</h1>
                            <p className="text-xs text-indigo-200">RSUD Sehat Bersama</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">🛡️ Administrator</span>
                        <button onClick={handleLogout} className="text-xs text-indigo-200 hover:text-white underline">
                            Keluar
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-6">
                {error && (
                    <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">{error}</div>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                        <p className="text-xs font-semibold text-blue-500">Total Poli</p>
                        <p className="text-3xl font-bold text-blue-600">{jadwalList.length}</p>
                    </div>
                    <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                        <p className="text-xs font-semibold text-purple-500">Total Dokter</p>
                        <p className="text-3xl font-bold text-purple-600">{dokterList.length}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                        <p className="text-xs font-semibold text-amber-500">Total Petugas</p>
                        <p className="text-3xl font-bold text-amber-600">{petugasList.length}</p>
                    </div>
                    <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
                        <p className="text-xs font-semibold text-green-500">Total Pasien</p>
                        <p className="text-3xl font-bold text-green-600">{pasienList.length}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-slate-200 mb-4 overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => {
                                setTab(t.key);
                                setSearch('');
                            }}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${tab === t.key ? 'border-indigo-700 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {t.label}
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{t.count}</span>
                        </button>
                    ))}
                </div>

                {/* Search + action */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari..."
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {tab === 'poli' && (
                        <button
                            onClick={openAddPoli}
                            disabled={!dokterList.length}
                            className="rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 transition disabled:opacity-40 whitespace-nowrap"
                        >
                            + Tambah
                        </button>
                    )}
                    {tab === 'dokter' && (
                        <button
                            onClick={openAddDokter}
                            className="rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 transition whitespace-nowrap"
                        >
                            + Tambah
                        </button>
                    )}
                    {tab === 'petugas' && (
                        <button
                            onClick={openAddPetugas}
                            className="rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 transition whitespace-nowrap"
                        >
                            + Tambah
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
                        {tab === 'poli' && (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-slate-400 border-b border-slate-100">
                                        <th className="px-6 py-3">Kode</th>
                                        <th className="px-6 py-3">Nama Poli</th>
                                        <th className="px-6 py-3">Dokter</th>
                                        <th className="px-6 py-3">Kuota</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredJadwal.length ? (
                                        filteredJadwal.map((j) => (
                                            <tr key={j.id}>
                                                <td className="px-6 py-4">
                                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                        {kodeFromSpesialisasi(j.dokter?.spesialisasi ?? '')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-800">Poli {j.dokter?.spesialisasi}</td>
                                                <td className="px-6 py-4 text-slate-500">{j.dokter?.nama}</td>
                                                <td className="px-6 py-4 text-slate-500">{j.kuota} pasien</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button onClick={() => openEditPoli(j)} className="text-slate-400 hover:text-indigo-600 mr-3">
                                                        ✏️
                                                    </button>
                                                    <button onClick={() => deletePoli(j.id)} className="text-slate-400 hover:text-red-500">
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                                Tidak ada data poli
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {tab === 'dokter' && (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-slate-400 border-b border-slate-100">
                                        <th className="px-6 py-3">Nama</th>
                                        <th className="px-6 py-3">Spesialisasi</th>
                                        <th className="px-6 py-3">No. Izin Praktek</th>
                                        <th className="px-6 py-3">No. HP</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredDokter.length ? (
                                        filteredDokter.map((d) => (
                                            <tr key={d.id}>
                                                <td className="px-6 py-4 font-semibold text-slate-800">{d.nama}</td>
                                                <td className="px-6 py-4">
                                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                        {d.spesialisasi}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{d.noIzinPraktek}</td>
                                                <td className="px-6 py-4 text-slate-500">{d.noHp}</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button onClick={() => openEditDokter(d)} className="text-slate-400 hover:text-indigo-600 mr-3">
                                                        ✏️
                                                    </button>
                                                    <button onClick={() => deleteDokter(d.id)} className="text-slate-400 hover:text-red-500">
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                                Tidak ada data dokter
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {tab === 'petugas' && (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-slate-400 border-b border-slate-100">
                                        <th className="px-6 py-3">Nama</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPetugas.length ? (
                                        filteredPetugas.map((u) => (
                                            <tr key={u.id}>
                                                <td className="px-6 py-4 font-semibold text-slate-800">{u.name}</td>
                                                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button onClick={() => openEditPetugas(u)} className="text-slate-400 hover:text-indigo-600 mr-3">✏️</button>
                                                    <button onClick={() => deletePetugas(u.id)} className="text-slate-400 hover:text-red-500">🗑️</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                                                Belum ada petugas terdaftar
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {tab === 'pasien' && (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-slate-400 border-b border-slate-100">
                                        <th className="px-6 py-3">Nama</th>
                                        <th className="px-6 py-3">NIK</th>
                                        <th className="px-6 py-3">No. HP</th>
                                        <th className="px-6 py-3">Alamat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPasien.length ? (
                                        filteredPasien.map((p) => (
                                            <tr key={p.id}>
                                                <td className="px-6 py-4 font-semibold text-slate-800">{p.nama}</td>
                                                <td className="px-6 py-4 text-slate-500">{p.nik}</td>
                                                <td className="px-6 py-4 text-slate-500">{p.noHp}</td>
                                                <td className="px-6 py-4 text-slate-500">{p.alamat}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                                                Belum ada pasien terdaftar
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Dokter */}
            {dokterModal.open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            {dokterModal.editId ? 'Edit Dokter' : 'Tambah Dokter'}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Dokter</label>
                                <input
                                    value={dokterForm.nama}
                                    onChange={(e) => setDokterForm((p) => ({ ...p, nama: e.target.value }))}
                                    placeholder="dr. Contoh Nama, Sp.X"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Spesialisasi</label>
                                <input
                                    value={dokterForm.spesialisasi}
                                    onChange={(e) => setDokterForm((p) => ({ ...p, spesialisasi: e.target.value }))}
                                    placeholder="Umum / Anak / Gigi / Kandungan / Jantung"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">No. Izin Praktek</label>
                                <input
                                    value={dokterForm.noIzinPraktek}
                                    onChange={(e) => setDokterForm((p) => ({ ...p, noIzinPraktek: e.target.value }))}
                                    placeholder="STR-XXXX-00"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">No. HP</label>
                                <input
                                    value={dokterForm.noHp}
                                    onChange={(e) => setDokterForm((p) => ({ ...p, noHp: e.target.value }))}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </div>
                        {formError && (
                            <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-2 text-xs text-red-600">{formError}</div>
                        )}
                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={() => setDokterModal({ open: false, editId: null })}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={saveDokter}
                                disabled={saving}
                                className="flex-1 rounded-xl bg-indigo-700 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Poli (Jadwal Praktek) */}
            {jadwalModal.open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            {jadwalModal.editId ? 'Edit Poli' : 'Tambah Poli'}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Dokter</label>
                                <select
                                    value={jadwalForm.dokterId}
                                    onChange={(e) => setJadwalForm((p) => ({ ...p, dokterId: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                >
                                    <option value="">Pilih dokter</option>
                                    {dokterList.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.nama} — {d.spesialisasi}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Hari</label>
                                <select
                                    value={jadwalForm.hari}
                                    onChange={(e) => setJadwalForm((p) => ({ ...p, hari: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                >
                                    {HARI_OPTIONS.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jam Mulai</label>
                                    <input
                                        type="time"
                                        value={jadwalForm.jamMulai}
                                        onChange={(e) => setJadwalForm((p) => ({ ...p, jamMulai: e.target.value }))}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jam Selesai</label>
                                    <input
                                        type="time"
                                        value={jadwalForm.jamSelesai}
                                        onChange={(e) => setJadwalForm((p) => ({ ...p, jamSelesai: e.target.value }))}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Kuota Harian</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={jadwalForm.kuota}
                                    onChange={(e) => setJadwalForm((p) => ({ ...p, kuota: e.target.value }))}
                                    placeholder="30"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </div>
                        {formError && (
                            <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-2 text-xs text-red-600">{formError}</div>
                        )}
                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={() => setJadwalModal({ open: false, editId: null })}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={savePoli}
                                disabled={saving}
                                className="flex-1 rounded-xl bg-indigo-700 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Petugas */}
            {petugasModal.open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{petugasModal.editId ? 'Edit Petugas' : 'Tambah Petugas'}</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama</label>
                                <input
                                    value={petugasForm.name}
                                    onChange={(e) => setPetugasForm((p) => ({ ...p, name: e.target.value }))}
                                    placeholder="Nama lengkap petugas"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={petugasForm.email}
                                    onChange={(e) => setPetugasForm((p) => ({ ...p, email: e.target.value }))}
                                    placeholder="petugas@rsud.id"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={petugasForm.password}
                                    onChange={(e) => setPetugasForm((p) => ({ ...p, password: e.target.value }))}
                                    placeholder="Minimal 6 karakter"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </div>
                        {formError && (
                            <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-2 text-xs text-red-600">{formError}</div>
                        )}
                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={() => setPetugasModal({ open: false, editId: null })}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={savePetugas}
                                disabled={saving}
                                className="flex-1 rounded-xl bg-indigo-700 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}