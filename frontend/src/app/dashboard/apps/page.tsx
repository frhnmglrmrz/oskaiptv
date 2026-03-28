'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Plus, GripVertical, Edit2, X, Check } from 'lucide-react';

interface App {
  id: string;
  app_name: string;
  package_name: string;
  icon_url: string;
  sort_order: number;
  is_active: boolean;
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [search, setSearch] = useState('');

  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPackage, setEditPackage] = useState('');
  const [editOrder, setEditOrder] = useState('0');
  const [editActive, setEditActive] = useState(true);

  const fetchApps = async () => { const r = await api.get('/admin/apps'); setApps(r.data); };
  useEffect(() => { fetchApps(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/apps', { app_name: appName, package_name: packageName, icon_url: iconUrl, sort_order: parseInt(sortOrder), is_active: true });
      toast.success('Aplikasi ditambahkan!');
      setAppName(''); setPackageName(''); setIconUrl(''); setSortOrder('0'); fetchApps();
    } catch { toast.error('Gagal menambahkan'); }
  };

  const handleSave = async (id: string, origIcon: string) => {
    try {
      await api.put(`/admin/apps/${id}`, { app_name: editName, package_name: editPackage, sort_order: parseInt(editOrder), is_active: editActive, icon_url: origIcon });
      toast.success('Disimpan!');
      setEditId(null); fetchApps();
    } catch { toast.error('Gagal update'); }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus shortcut?')) return;
    await api.delete(`/admin/apps/${id}`);
    toast.success('Dihapus!'); fetchApps();
  };

  const filtered = apps.filter(a => a.app_name.toLowerCase().includes(search.toLowerCase()) || (a.package_name && a.package_name.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end mb-6 gap-3">
        <div>
          <h1 className="text-4xl font-black uppercase mb-1">📱 LAUNCHER TV</h1>
          <p className="text-gray-600 font-semibold mb-0">Kelola shortcut aplikasi yang tampil di Home Screen TV tamu.</p>
        </div>
        <input type="text" placeholder="🔍 Cari app..." className="nb-input px-4 py-2 w-full max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <form onSubmit={handleAdd} className="nb-card p-6 mb-8" style={{ background: '#3a86ff', color: 'white' }}>
        <h2 className="font-black uppercase text-xl mb-4">+ Tambah Shortcut Aplikasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input className="nb-input px-4 py-2 text-black" placeholder="Nama Aplikasi (cth: Netflix)" value={appName} onChange={e => setAppName(e.target.value)} required />
          <input className="nb-input px-4 py-2 text-black" placeholder="Package (cth: com.netflix.ninja)" value={packageName} onChange={e => setPackageName(e.target.value)} />
          <input className="nb-input px-4 py-2 text-black" placeholder="URL Icon/Logo" value={iconUrl} onChange={e => setIconUrl(e.target.value)} />
          <input className="nb-input px-4 py-2 text-black" placeholder="Urutan (opsional)" type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
        </div>
        <button type="submit" className="nb-btn px-6 py-2 font-black" style={{ background: '#ffd60a', color: '#0a0a0a', borderColor: '#0a0a0a' }}>
          <Plus size={16} className="inline mr-2" />TAMBAH KE LAUNCHER
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((app) => {
          const edit = editId === app.id;
          return (
            <div key={app.id} className="nb-card p-4">
              {edit ? (
                <div className="space-y-2">
                  <input className="nb-input px-2 py-1 w-full text-sm font-black" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nama App" />
                  <input className="nb-input px-2 py-1 w-full text-xs font-mono" value={editPackage} onChange={e => setEditPackage(e.target.value)} placeholder="Package" />
                  <div className="flex gap-2">
                    <input className="nb-input px-2 py-1 w-16 text-sm" type="number" value={editOrder} onChange={e => setEditOrder(e.target.value)} title="Urutan" />
                    <select className="nb-input px-1 py-1 text-xs" value={editActive ? '1' : '0'} onChange={e => setEditActive(e.target.value === '1')}>
                      <option value="1">AKTIF</option><option value="0">NONAKTIF</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-3 border-t-2 border-dashed border-gray-300 pt-2">
                    <button onClick={() => handleSave(app.id, app.icon_url)} className="nb-btn px-3 py-1 flex-1 bg-green-400 font-bold text-xs"><Check size={14} className="inline mr-1" /> SIMPAN</button>
                    <button onClick={() => setEditId(null)} className="nb-btn px-3 py-1 flex-1 bg-gray-200 font-bold text-xs">BATAL</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-gray-400" />
                    <div>
                      <div className="font-black text-lg">{app.app_name}</div>
                      <div className="text-xs font-mono text-gray-500 mt-0.5">{app.package_name || 'Tanpa package'}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold">Urutan: #{app.sort_order}</span>
                        <span className="nb-badge text-xs" style={{ background: app.is_active ? '#06d6a0' : '#e0e0e0' }}>{app.is_active ? 'AKTIF' : 'NONAKTIF'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setEditId(app.id); setEditName(app.app_name); setEditPackage(app.package_name || ''); setEditOrder(app.sort_order.toString()); setEditActive(app.is_active); }} className="nb-btn p-1.5 bg-blue-500 text-white"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(app.id)} className="nb-btn p-1.5 bg-pink-600 text-white"><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="col-span-full font-bold text-gray-500">Tidak ada aplikasi.</div>}
      </div>
    </div>
  );
}
