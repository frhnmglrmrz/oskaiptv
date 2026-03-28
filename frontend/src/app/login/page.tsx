'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { saveToken } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const res = await api.post('/admin/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      saveToken(res.data.access_token);
      toast.success('Login berhasil! Selamat datang, Staf.');
      router.push('/dashboard');
    } catch {
      toast.error('Username atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#ffd60a' }}
    >
      <div className="w-full max-w-md p-2">
        {/* Header brand */}
        <div
          className="nb-card p-6 mb-0 text-center"
          style={{ background: '#0a0a0a', color: 'white' }}
        >
          <div className="text-4xl font-black tracking-tight">OSKA IPTV</div>
          <div className="text-yellow-400 font-bold mt-1 text-sm tracking-widest uppercase">
            Hotel Admin Panel
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="nb-card p-8 mt-0"
          style={{ borderTop: '0', background: '#f5f0e8' }}
        >
          <h1 className="text-2xl font-black mb-6 uppercase">MASUK SISTEM</h1>

          <div className="mb-4">
            <label className="block font-black text-sm uppercase mb-2">
              Username
            </label>
            <input
              type="text"
              className="nb-input w-full px-4 py-3 text-base"
              placeholder="contoh: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-black text-sm uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              className="nb-input w-full px-4 py-3 text-base"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="nb-btn w-full py-3 font-black text-base uppercase"
            style={{ background: '#ffd60a' }}
          >
            {loading ? 'MEMVERIFIKASI...' : 'MASUK →'}
          </button>
          <div className="mt-6 text-center text-sm font-bold">
            Belum punya akun admin?{' '}
            <Link href="/register" className="text-blue-600 underline">
              Daftar baru
            </Link>
          </div>
        </form>

        {/* Credits */}
        <p className="text-center text-sm font-bold mt-4 text-gray-700">
          OSKA IPTV Hospitality System v1.0
        </p>
      </div>
    </div>
  );
}
