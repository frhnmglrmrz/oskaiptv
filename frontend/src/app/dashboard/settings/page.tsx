'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [marquee, setMarquee] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then((res) => {
      const settings = res.data as { key: string; value: string }[];
      const marq = settings.find(s => s.key === 'marquee_text');
      const bg = settings.find(s => s.key === 'background_url');
      if (marq) setMarquee(marq.value);
      if (bg) setBgUrl(bg.value);
    });
  }, []);

  const save = async (key: string, value: string) => {
    setSaving(true);
    try {
      await api.put('/admin/settings', { key, value });
      toast.success('Pengaturan berhasil disimpan!');
    } catch {
      toast.error('Gagal menyimpan');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="text-4xl font-black uppercase mb-6">⚙️ PENGATURAN HOTEL</h1>

      <div className="grid gap-5">
        {/* Marquee Banner */}
        <div className="nb-card p-6" style={{ background: '#ffd60a' }}>
          <h2 className="font-black uppercase text-xl mb-3">📢 Teks Berjalan (Marquee)</h2>
          <p className="text-sm font-semibold mb-3">Teks ini akan ditampilkan berjalan di bagian bawah layar TV tamu.</p>
          <textarea
            className="nb-input w-full px-4 py-3 h-24 resize-none"
            value={marquee}
            onChange={e => setMarquee(e.target.value)}
            placeholder="Contoh: Selamat datang di OSKA Hotel! Nikmati fasilitas premium kami..."
          />
          <button onClick={() => save('marquee_text', marquee)} disabled={saving} className="nb-btn mt-3 px-6 py-2" style={{ background: '#0a0a0a', color: 'white' }}>
            {saving ? 'MENYIMPAN...' : '💾 SIMPAN MARQUEE'}
          </button>
        </div>

        {/* Background URL */}
        <div className="nb-card p-6">
          <h2 className="font-black uppercase text-xl mb-3">🖼️ URL Gambar Latar TV</h2>
          <p className="text-sm font-semibold text-gray-600 mb-3">URL gambar/wallpaper yang tampil di Home Screen TV tamu.</p>
          <input
            className="nb-input w-full px-4 py-3"
            value={bgUrl}
            onChange={e => setBgUrl(e.target.value)}
            placeholder="https://... atau /uploads/images/bg.jpg"
          />
          <button onClick={() => save('background_url', bgUrl)} disabled={saving} className="nb-btn mt-3 px-6 py-2" style={{ background: '#0a0a0a', color: 'white' }}>
            {saving ? 'MENYIMPAN...' : '💾 SIMPAN BACKGROUND'}
          </button>
        </div>

        {/* Upload APK */}
        <div className="nb-card p-6" style={{ background: '#ff006e', color: 'white' }}>
          <h2 className="font-black uppercase text-xl mb-3">📦 Rilis Update APK (OTA)</h2>
          <p className="text-sm font-semibold mb-3 opacity-90">Upload file .apk baru untuk dikirim ke semua perangkat TV hotel saat booting.</p>
          <div className="flex gap-3">
            <a href="/dashboard/system-update" className="nb-btn px-6 py-2 no-underline" style={{ background: 'white', color: '#0a0a0a' }}>
              📤 Upload APK Baru
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
