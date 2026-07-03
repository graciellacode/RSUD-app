'use client';

import { useEffect, useState } from 'react';
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

interface TiketAntrian {
  noAntrean: number | string;
  nama: string;
  nik: string;
  poliNama: string;
  waktuDaftar: string;
  estimasiTunggu: string;
}

interface FormState {
  nik: string;
  nama: string;
  tanggalLahir: string;
  jenisKelamin: string;
  noHp: string;
  alamat: string;
  keluhan: string;
}

interface FormErrors {
  nik?: string;
  nama?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  noHp?: string;
  alamat?: string;
  keluhan?: string;
  jadwal?: string;
}

export default function DaftarAntreanPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    nik: '',
    nama: '',
    tanggalLahir: '',
    jenisKelamin: '',
    noHp: '',
    alamat: '',
    keluhan: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [jadwalList, setJadwalList] = useState<JadwalPraktek[]>([]);
  const [loadingJadwal, setLoadingJadwal] = useState(true);
  const [jadwalError, setJadwalError] = useState('');
  const [selectedJadwalId, setSelectedJadwalId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [tiket, setTiket] = useState<TiketAntrian | null>(null);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        setLoadingJadwal(true);
        const res = await api.get('/jadwal');
        setJadwalList(res.data);
      } catch (err) {
        console.error(err);
        setJadwalError('Gagal memuat daftar poli/jadwal. Silakan refresh halaman.');
      } finally {
        setLoadingJadwal(false);
      }
    };
    fetchJadwal();
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === 'nik') {
      if (value.length > 0 && value.length !== 16) {
        setErrors((prev) => ({ ...prev, nik: 'NIK harus 16 digit' }));
      } else {
        setErrors((prev) => ({ ...prev, nik: undefined }));
      }
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!/^\d{16}$/.test(form.nik)) {
      newErrors.nik = 'NIK harus 16 digit';
    }
    if (!form.nama.trim()) {
      newErrors.nama = 'Nama lengkap wajib diisi';
    }
    if (!form.tanggalLahir) {
      newErrors.tanggalLahir = 'Tanggal lahir wajib diisi';
    }
    if (!form.jenisKelamin) {
      newErrors.jenisKelamin = 'Pilih jenis kelamin';
    }
    if (!/^\d{9,15}$/.test(form.noHp)) {
      newErrors.noHp = 'No. HP tidak valid';
    }
    if (!form.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }
    if (!form.keluhan.trim()) {
      newErrors.keluhan = 'Keluhan wajib diisi';
    }
    if (!selectedJadwalId) {
      newErrors.jadwal = 'Pilih salah satu poli tujuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError('');
    if (!validate()) return;

    const jadwalTerpilih = jadwalList.find((j) => j.id === selectedJadwalId);
    if (!jadwalTerpilih) return;

    try {
      setSubmitting(true);

      // 1. Cari atau buat data pasien berdasarkan NIK
      const resPasien = await api.post('/pasien/cari-atau-buat', {
        nik: form.nik,
        nama: form.nama,
        tanggalLahir: form.tanggalLahir,
        jenisKelamin: form.jenisKelamin,
        alamat: form.alamat,
        noHp: form.noHp,
      });
      const pasienId = resPasien.data.id;

      // 2. Buat pendaftaran antrian
      const resDaftar = await api.post('/pendaftaran', {
        pasienId,
        jadwalPraktekId: selectedJadwalId,
        tanggalPeriksa: new Date().toISOString(),
        keluhan: form.keluhan,
      });

      const data = resDaftar.data;

      setTiket({
        noAntrean: data.noAntrean ?? '-',
        nama: form.nama,
        nik: form.nik,
        poliNama: `${jadwalTerpilih.dokter.spesialisasi} - ${jadwalTerpilih.dokter.nama}`,
        waktuDaftar: new Date()
          .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          .replace(':', '.'),
        estimasiTunggu: '±10 menit',
      });
    } catch (err: any) {
      console.error(err);
      setSubmitError(
        err.response?.data?.message || 'Gagal mendaftar antrian. Silakan coba lagi.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (tiket) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="rounded-3xl bg-white p-8 shadow-xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {tiket.poliNama}
            </p>
            <h1 className="text-7xl font-extrabold text-indigo-700 tracking-tight">
              {String(tiket.noAntrean).padStart(3, '0')}
            </h1>
            <p className="mt-2 text-sm text-slate-500">Nomor Antrian Anda</p>

            <div className="mt-6 border-t border-dashed border-slate-200 pt-6 space-y-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Nama</span>
                <span className="font-semibold text-slate-800">{tiket.nama}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">NIK</span>
                <span className="font-semibold text-slate-800">{tiket.nik}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Poli Tujuan</span>
                <span className="font-semibold text-slate-800">{tiket.poliNama}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Waktu Daftar</span>
                <span className="font-semibold text-slate-800">{tiket.waktuDaftar}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estimasi Tunggu</span>
                <span className="font-semibold text-slate-800">{tiket.estimasiTunggu}</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-700">
              Harap berada di area tunggu dan perhatikan layar pemanggilan antrian.
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <button
              onClick={() => window.print()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 py-3 font-semibold text-white shadow-lg hover:bg-indigo-800 transition"
            >
              🖨️ Cetak Bukti Antrian
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-indigo-800 px-4 py-6 text-white">
        <div className="mx-auto max-w-xl flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-white/90 hover:text-white">
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold">Pendaftaran Antrian</h1>
            <p className="text-xs text-indigo-200">Isi data dengan lengkap dan benar</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-6 space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
            <span className="text-indigo-600">👤</span> Data Pribadi
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={16}
                value={form.nik}
                onChange={(e) => handleChange('nik', e.target.value.replace(/\D/g, ''))}
                placeholder="Nomor Induk Kependudukan"
                className={`w-full rounded-xl border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.nik ? 'border-red-400' : 'border-slate-200'
                  }`}
              />
              {errors.nik && <p className="mt-1 text-xs text-red-500">{errors.nik}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                placeholder="Nama sesuai KTP"
                className={`w-full rounded-xl border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.nama ? 'border-red-400' : 'border-slate-200'
                  }`}
              />
              {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.tanggalLahir}
                  onChange={(e) => handleChange('tanggalLahir', e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.tanggalLahir ? 'border-red-400' : 'border-slate-200'
                    }`}
                />
                {errors.tanggalLahir && (
                  <p className="mt-1 text-xs text-red-500">{errors.tanggalLahir}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.jenisKelamin}
                  onChange={(e) => handleChange('jenisKelamin', e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.jenisKelamin ? 'border-red-400' : 'border-slate-200'
                    }`}
                >
                  <option value="">Pilih</option>
                  <option value="LAKI_LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
                {errors.jenisKelamin && (
                  <p className="mt-1 text-xs text-red-500">{errors.jenisKelamin}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                No. HP / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.noHp}
                onChange={(e) => handleChange('noHp', e.target.value.replace(/\D/g, ''))}
                placeholder="08xxxxxxxxxx"
                className={`w-full rounded-xl border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.noHp ? 'border-red-400' : 'border-slate-200'
                  }`}
              />
              {errors.noHp && <p className="mt-1 text-xs text-red-500">{errors.noHp}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                placeholder="Alamat lengkap sesuai KTP"
                className={`w-full rounded-xl border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none ${errors.alamat ? 'border-red-400' : 'border-slate-200'
                  }`}
              />
              {errors.alamat && <p className="mt-1 text-xs text-red-500">{errors.alamat}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Keluhan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={form.keluhan}
                onChange={(e) => handleChange('keluhan', e.target.value)}
                placeholder="Contoh: Demam sudah 3 hari"
                className={`w-full rounded-xl border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none ${errors.keluhan ? 'border-red-400' : 'border-slate-200'
                  }`}
              />
              {errors.keluhan && <p className="mt-1 text-xs text-red-500">{errors.keluhan}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
            <span className="text-indigo-600">🩺</span> Pilih Poli Tujuan
          </h2>

          {loadingJadwal && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {!loadingJadwal && jadwalError && <p className="text-sm text-red-500">{jadwalError}</p>}

          {!loadingJadwal && !jadwalError && (
            <div className="space-y-3">
              {jadwalList.map((jadwal) => (
                <button
                  key={jadwal.id}
                  onClick={() => {
                    setSelectedJadwalId(jadwal.id);
                    setErrors((prev) => ({ ...prev, jadwal: undefined }));
                  }}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition ${selectedJadwalId === jadwal.id
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-400'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                >
                  <div>
                    <p className="font-bold text-slate-800">{jadwal.dokter.spesialisasi}</p>
                    <p className="text-xs text-slate-500">
                      {jadwal.dokter.nama} · {jadwal.hari}, {jadwal.jamMulai}-{jadwal.jamSelesai}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Kuota: {jadwal.kuota}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {errors.jadwal && <p className="mt-2 text-xs text-red-500">{errors.jadwal}</p>}
        </div>

        {submitError && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-xl bg-indigo-700 py-4 font-bold text-white shadow-lg hover:bg-indigo-800 transition disabled:opacity-50"
        >
          {submitting ? 'Memproses...' : 'Ambil Nomor Antrian →'}
        </button>
      </div>
    </div>
  );
}