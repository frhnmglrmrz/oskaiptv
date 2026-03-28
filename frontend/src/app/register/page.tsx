'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/auth/register', {
        username: username,
        password: password,
      });

      toast.success('Pendaftaran berhasil! Silakan login.');
      router.push('/login');
    } catch {
      toast.error('Gagal mandaftar. Username mungkin sudah dipakai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#ff006e' }}
    >
      <div className="w-full max-w-md p-2">
        {/* Header brand */}
        <div
          className="nb-card p-6 mb-0 text-center"
          style={{ background: '#0a0a0a', color: 'white' }}
        >
          <div className="text-4xl font-black tracking-tight">⚡ OSKA IPTV</div>
          <div className="text-pink-400 font-bold mt-1 text-sm tracking-widest uppercase">
            Buat Akun Administrator
          </div>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleRegister}
          className="nb-card p-8 mt-0"
          style={{ borderTop: '0', background: '#f5f0e8' }}
        >
          <h1 className="text-2xl font-black mb-6 uppercase">DAFTAR ADMIN</h1>

          <div className="mb-4">
            <label className="block font-black text-sm uppercase mb-2">
              Username Baru
            </label>
            <input
              type="text"
              className="nb-input w-full px-4 py-3 text-base"
              placeholder="contoh: superadmin"
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
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="nb-btn w-full py-3 font-black text-base uppercase"
            style={{ background: '#ff006e', color: 'white' }}
          >
            {loading ? 'MEMPROSES...' : 'DAFTAR SEKARANG →'}
          </button>

          <div className="mt-6 text-center text-sm font-bold">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-pink-600 underline">
              Login di sini
            </Link>
          </div>
        </form>

        <p className="text-center text-sm font-bold mt-4 text-white">
          OSKA IPTV Hospitality System
        </p>
      </div>
    </div>
  );
}
