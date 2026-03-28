'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Upload, History } from 'lucide-react';

interface SystemUpdate {
  id: string;
  version_name: string;
  apk_url: string;
  uploaded_at: string;
}

export default function SystemUpdatePage() {
  const [updates, setUpdates] = useState<SystemUpdate[]>([]);
  const [versionName, setVersionName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUpdates = async () => {
    const r = await api.get('/admin/system-update');
    setUpdates(r.data);
  };

  useEffect(() => { fetchUpdates(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !versionName) return toast.error('Lengkapi versi dan pilih file .apk');
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('version_name', versionName);
      formData.append('file', file);
      
      await api.post('/admin/upload/apk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Versi ${versionName} berhasil dirilis ke semua TV!`);
      setVersionName('');
      setFile(null);
      fetchUpdates();
    } catch {
      toast.error('Gagal upload APK');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-4xl font-black uppercase mb-2">📦 OTA UPDATE</h1>
      <p className="text-gray-600 font-semibold mb-6">
        Upload file <code className="font-mono bg-black text-yellow-400 px-1">.apk</code> terbaru. 
        Semua TV OSKA akan mengunduhnya secara otomatis saat berikutnya booting.
      </p>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="nb-card p-6 mb-8" style={{ background: '#0a0a0a', color: 'white' }}>
        <h2 className="font-black uppercase text-xl mb-4 text-yellow-400">🚀 Rilis Versi Baru</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-black text-sm uppercase mb-2 text-gray-300">Nama Versi</label>
            <input
              className="nb-input w-full px-4 py-3"
              style={{ color: '#0a0a0a' }}
              placeholder="Contoh: v1.2.0"
              value={versionName}
              onChange={e => setVersionName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-black text-sm uppercase mb-2 text-gray-300">File APK</label>
            <input
              type="file"
              accept=".apk"
              className="w-full py-2 text-sm font-semibold text-gray-200"
              onChange={e => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="nb-btn px-8 py-3 font-black uppercase"
          style={{ background: '#ffd60a', color: '#0a0a0a', borderColor: '#ffd60a' }}
        >
          <Upload size={16} className="inline mr-2" />
          {loading ? 'MENGUPLOAD...' : 'RILIS UPDATE KE SEMUA TV'}
        </button>
      </form>

      {/* History */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History size={20} />
          <h2 className="font-black uppercase text-xl">Riwayat Rilis</h2>
        </div>
        <div className="nb-card overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ background: '#0a0a0a', color: 'white' }}>
              <tr>
                <th className="text-left p-4 font-black uppercase">Versi</th>
                <th className="text-left p-4 font-black uppercase">URL APK</th>
                <th className="text-left p-4 font-black uppercase">Waktu Rilis</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((u, i) => (
                <tr key={u.id} style={{ background: i === 0 ? '#ffd60a' : (i % 2 === 0 ? 'white' : '#f5f0e8'), borderBottom: '2px solid #0a0a0a' }}>
                  <td className="p-4 font-black">
                    {i === 0 && <span className="nb-badge mr-2" style={{ background: '#06d6a0' }}>LATEST</span>}
                    {u.version_name}
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-600 truncate max-w-xs">{u.apk_url}</td>
                  <td className="p-4 font-semibold text-gray-700">{new Date(u.uploaded_at).toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {updates.length === 0 && (
                <tr><td colSpan={3} className="p-6 text-center font-bold text-gray-500">Belum ada rilis. Upload APK pertama Anda!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
