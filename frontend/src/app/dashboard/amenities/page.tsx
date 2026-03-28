'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

interface Amenity { id: string; name: string; description: string; }

export default function AmenitiesPage() {
  const [items, setItems] = useState<Amenity[]>([]);
  const [search, setSearch] = useState('');
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const fetch = async () => { const r = await api.get('/admin/amenities'); setItems(r.data); };
  useEffect(() => { fetch(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/admin/amenities', { name, description });
    toast.success('Item ditambahkan!');
    setName(''); setDescription('');
    fetch();
  };

  const saveEdit = async (id: string) => {
    try {
      await api.put(`/admin/amenities/${id}`, { name: editName, description: editDesc });
      toast.success('Diperbarui!');
      setEditId(null);
      fetch();
    } catch { toast.error('Gagal update'); }
  };

  const del = async (id: string) => {
    if (!confirm('Hapus item ini?')) return;
    await api.delete(`/admin/amenities/${id}`);
    toast.success('Dihapus!');
    fetch();
  };

  const filtered = items.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end mb-6 gap-3">
        <h1 className="text-4xl font-black uppercase">🛎️ AMENITIES</h1>
        <input 
          type="text" 
          placeholder="🔍 Cari amenity..." 
          className="nb-input px-4 py-2 w-full max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={add} className="nb-card p-6 mb-6" style={{ background: '#06d6a0' }}>
        <h2 className="font-black uppercase text-xl mb-4">+ Tambah Item Housekeeping</h2>
        <div className="flex gap-3 flex-wrap">
          <input className="nb-input px-4 py-2 flex-1 min-w-[200px]" placeholder="Nama Item (cth: Handuk)" value={name} onChange={e => setName(e.target.value)} required />
          <input className="nb-input px-4 py-2 flex-1 min-w-[200px]" placeholder="Deskripsi pendek" value={description} onChange={e => setDescription(e.target.value)} />
          <button type="submit" className="nb-btn px-5 py-2" style={{ background: '#0a0a0a', color: 'white' }}>
            <Plus size={18} />
          </button>
        </div>
      </form>

      <div className="nb-card overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: '#0a0a0a', color: 'white' }}>
            <tr>
              <th className="text-left p-4 font-black uppercase">Nama Item</th>
              <th className="text-left p-4 font-black uppercase">Deskripsi</th>
              <th className="p-4 font-black uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              const editing = editId === item.id;
              return (
                <tr key={item.id} style={{ background: i % 2 === 0 ? 'white' : '#f5f0e8', borderBottom: '2px solid #0a0a0a' }}>
                  <td className="p-4 min-w-[200px]">
                    {editing ? <input className="nb-input px-2 py-1 w-full text-sm" value={editName} onChange={e => setEditName(e.target.value)} /> : <span className="font-bold">{item.name}</span>}
                  </td>
                  <td className="p-4">
                    {editing ? <input className="nb-input px-2 py-1 w-full text-sm" value={editDesc} onChange={e => setEditDesc(e.target.value)} /> : <span className="text-gray-600">{item.description || '—'}</span>}
                  </td>
                  <td className="p-4 text-center">
                    {editing ? (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => saveEdit(item.id)} className="nb-btn p-1.5" style={{ background: '#06d6a0' }}><Check size={14} /></button>
                        <button onClick={() => setEditId(null)} className="nb-btn p-1.5" style={{ background: '#e0e0e0' }}><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setEditId(item.id); setEditName(item.name); setEditDesc(item.description || ''); }} className="nb-btn p-1.5" style={{ background: '#3a86ff', color: 'white' }}><Edit2 size={14} /></button>
                        <button onClick={() => del(item.id)} className="nb-btn p-1.5" style={{ background: '#ff006e', color: 'white' }}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan={3} className="p-6 text-center font-bold text-gray-500">Tidak ada data.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
