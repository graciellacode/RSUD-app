'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../lib/api';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const expectedRole = searchParams.get('role')?.toUpperCase() as 'ADMIN' | 'PETUGAS' | null;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roleLabel = expectedRole === 'ADMIN' ? 'Admin' : 'Petugas';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email dan password wajib diisi');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/auth/login', { email, password });
            const { accessToken, user } = res.data;

            // Jika ada ekspektasi role, tolak jika tidak sesuai
            if (expectedRole && user.role !== expectedRole) {
                const wrongLabel = user.role === 'ADMIN' ? 'Admin' : 'Petugas';
                setError(`Akun ini adalah akun ${wrongLabel}. Silakan login melalui menu yang sesuai.`);
                return;
            }

            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            if (user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/petugas');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Login gagal. Periksa email/password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-800 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                        {expectedRole === 'ADMIN' ? '🛡️' : '🏥'}
                    </div>
                    <h1 className="text-2xl font-bold text-white">Login {roleLabel}</h1>
                    <p className="text-sm text-indigo-200">RSUD Sehat Bersama</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl bg-white p-6 shadow-xl space-y-4"
                >
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@rsud.go.id"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-700 py-3 font-bold text-white shadow-lg hover:bg-indigo-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
                    >
                        ← Kembali ke Beranda
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}