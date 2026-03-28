'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

interface Facility { id: string; name: string; description: string; image_url: string; }

export default function FacilitiesPage() {
  const [items, setItems] = useState<Facility[]>([]);
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImg, setEditImg] = useState('');

  const fetchItems = async () => { const r = await api.get('/admin/facilities'); setItems(r.data); };
  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/admin/facilities', { name, description, image_url: imageUrl });
    toast.success('Fasilitas ditambahkan!');
    setName(''); setDescription(''); setImageUrl(''); fetchItems();
  };

  const saveEdit = async (id: string) => {
    try {
      await api.put(`/admin/facilities/${id}`, { name: editName, description: editDesc, image_url: editImg });
      toast.success('Disimpan!'); setEditId(null); fetchItems();
    } catch { toast.error('Gagal simpan'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus ini?')) return;
    await api.delete(`/admin/facilities/${id}`);
    toast.success('Dihapus!'); fetchItems();
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || (i.description && i.description.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end mb-6 gap-3">
        <h1 className="text-4xl font-black uppercase mb-2">🏊 FASILITAS HOTEL</h1>
        <input type="text" placeholder="🔍 Cari fasilitas..." className="nb-input px-4 py-2 w-full max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <form onSubmit={handleAdd} className="nb-card p-6 mb-8" style={{ background: '#ffd60a' }}>
        <h2 className="font-black uppercase text-xl mb-4">+ Tambah Fasilitas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input className="nb-input px-4 py-2 text-black" placeholder="Nama Fasilitas" value={name} onChange={e => setName(e.target.value)} required />
          <input className="nb-input px-4 py-2 text-black" placeholder="Deskripsi pendek" value={description} onChange={e => setDescription(e.target.value)} />
          <input className="nb-input px-4 py-2 text-black" placeholder="URL Foto (opsional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>
        <button type="submit" className="nb-btn px-6 py-2" style={{ background: '#0a0a0a', color: 'white' }}>
          <Plus size={16} className="inline mr-2" />TAMBAH 
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(item => {
          const edit = editId === item.id;
          return (
            <div key={item.id} className="nb-card p-4 flex flex-col justify-between">
              {edit ? (
                <div className="space-y-2 mb-4">
                  <input className="nb-input px-2 py-1 w-full text-base font-black" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nama" />
                  <textarea className="nb-input px-2 py-1 w-full text-sm resize-none h-16" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Deskripsi" />
                  <input className="nb-input px-2 py-1 w-full text-xs font-mono" value={editImg} onChange={e => setEditImg(e.target.value)} placeholder="URL Image" />
                </div>
              ) : (
                <div className="mb-4">
                  {item.image_url && (
                    <div className="w-full h-32 mb-3 overflow-hidden border-2 border-black" style={{ background: '#f0f0f0' }}>
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="font-black text-lg">{item.name}</div>
                  <div className="text-gray-600 text-sm font-semibold mt-1">{item.description}</div>
                </div>
              )}

              {/* Actions Footer */}
              {edit ? (
                 <div className="flex gap-2 border-t-2 border-black pt-3">
                   <button onClick={() => saveEdit(item.id)} className="nb-btn px-3 py-1.5 flex-1 bg-green-400 font-bold text-xs"><Check size={14} className="inline mr-1" /> SIMPAN</button>
                   <button onClick={() => setEditId(null)} className="nb-btn px-3 py-1.5 flex-1 bg-gray-200 font-bold text-xs">BATAL</button>
                 </div>
              ) : (
                <div className="flex gap-2 border-t-2 border-dashed border-gray-300 pt-3 mt-auto">
                   <button onClick={() => { setEditId(item.id); setEditName(item.name); setEditDesc(item.description || ''); setEditImg(item.image_url || ''); }} className="nb-btn px-2 py-1.5 flex-1 bg-blue-500 text-white font-bold text-xs flex justify-center items-center gap-1"><Edit2 size={13} /> EDIT</button>
                   <button onClick={() => handleDelete(item.id)} className="nb-btn px-2 py-1.5 flex-1 bg-pink-600 text-white font-bold text-xs flex justify-center items-center gap-1"><Trash2 size={13} /> HAPUS</button>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="col-span-full font-bold text-gray-500">Tidak ada fasilitas.</div>}
      </div>
    </div>
  );
}
