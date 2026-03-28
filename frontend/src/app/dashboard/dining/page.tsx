'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

interface DiningMenu {
  id: string;
  name: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

export default function DiningPage() {
  const [menus, setMenus] = useState<DiningMenu[]>([]);
  const [search, setSearch] = useState('');
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editAvailable, setEditAvailable] = useState(true);

  const fetchMenus = async () => {
    const res = await api.get('/admin/dining');
    setMenus(res.data);
  };

  useEffect(() => { fetchMenus(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/dining', { name, price: parseFloat(price), image_url: imageUrl, is_available: true });
      toast.success('Menu ditambahkan!');
      setName(''); setPrice(''); setImageUrl('');
      fetchMenus();
    } catch { toast.error('Gagal menambahkan'); } finally { setLoading(false); }
  };

  const handleSaveEdit = async (id: string, originalImgUrl: string) => {
    try {
      await api.put(`/admin/dining/${id}`, {
        name: editName,
        price: parseFloat(editPrice),
        is_available: editAvailable,
        image_url: originalImgUrl
      });
      toast.success('Menu diperbarui!');
      setEditId(null);
      fetchMenus();
    } catch { toast.error('Gagal menyimpan'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus menu ini?')) return;
    await api.delete(`/admin/dining/${id}`);
    toast.success('Dihapus!');
    fetchMenus();
  };

  const filtered = menus.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end mb-6 gap-3">
        <h1 className="text-4xl font-black uppercase">🍜 MENU MAKANAN</h1>
        <input 
          type="text" 
          placeholder="🔍 Cari menu..." 
          className="nb-input px-4 py-2 w-full max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleAdd} className="nb-card p-6 mb-6" style={{ background: '#ffd60a' }}>
        <h2 className="text-xl font-black uppercase mb-4">+ Tambah Menu Baru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input className="nb-input px-4 py-2" placeholder="Nama Makanan" value={name} onChange={e => setName(e.target.value)} required />
          <input className="nb-input px-4 py-2" placeholder="Harga (Rp)" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
          <input className="nb-input px-4 py-2" placeholder="URL Gambar (opsional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="nb-btn mt-3 px-6 py-2" style={{ background: 'white' }}>
          <Plus size={16} className="inline mr-2" />{loading ? 'MENYIMPAN...' : 'TAMBAHKAN'}
        </button>
      </form>

      <div className="nb-card overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: '#0a0a0a', color: 'white' }}>
            <tr>
              <th className="text-left p-4 font-black uppercase">Nama Menu</th>
              <th className="text-left p-4 font-black uppercase">Harga</th>
              <th className="text-left p-4 font-black uppercase">Status</th>
              <th className="p-4 font-black uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => {
              const isEditing = editId === m.id;
              return (
                <tr key={m.id} style={{ background: i % 2 === 0 ? 'white' : '#f5f0e8', borderBottom: '2px solid #0a0a0a' }}>
                  <td className="p-4 min-w-[200px]">
                    {isEditing ? (
                      <input className="nb-input px-2 py-1 w-full text-sm" value={editName} onChange={e => setEditName(e.target.value)} />
                    ) : (
                      <span className="font-bold">{m.name}</span>
                    )}
                  </td>
                  <td className="p-4 min-w-[150px]">
                    {isEditing ? (
                      <input className="nb-input px-2 py-1 w-full text-sm" type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                    ) : (
                      <span className="font-bold">Rp {m.price.toLocaleString('id-ID')}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <select className="nb-input px-2 py-1 text-sm bg-white font-bold" value={editAvailable ? '1' : '0'} onChange={e => setEditAvailable(e.target.value === '1')}>
                        <option value="1">TERSEDIA</option>
                        <option value="0">HABIS</option>
                      </select>
                    ) : (
                      <span className="nb-badge" style={{ background: m.is_available ? '#06d6a0' : '#ff006e', color: m.is_available ? 'black' : 'white' }}>
                        {m.is_available ? 'TERSEDIA' : 'HABIS'}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {isEditing ? (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleSaveEdit(m.id, m.image_url || '')} className="nb-btn p-1.5" style={{ background: '#06d6a0' }}><Check size={14} /></button>
                        <button onClick={() => setEditId(null)} className="nb-btn p-1.5" style={{ background: '#e0e0e0' }}><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setEditId(m.id); setEditName(m.name); setEditPrice(m.price.toString()); setEditAvailable(m.is_available); }} className="nb-btn p-1.5" style={{ background: '#3a86ff', color: 'white' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(m.id)} className="nb-btn p-1.5" style={{ background: '#ff006e', color: 'white' }}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={4} className="p-6 text-center font-bold text-gray-500">Menu tidak ditemukan.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
