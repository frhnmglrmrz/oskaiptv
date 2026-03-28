'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

interface Info { id: string; title: string; description: string; image_url: string; }

export default function InformationsPage() {
  const [items, setItems] = useState<Info[]>([]);
  const [search, setSearch] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImg, setEditImg] = useState('');

  const fetchItems = async () => { const r = await api.get('/admin/informations'); setItems(r.data); };
  useEffect(() => { fetchItems(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/admin/informations', { title, description, image_url: imageUrl });
    toast.success('Info ditambahkan!');
    setTitle(''); setDescription(''); setImageUrl(''); fetchItems();
  };

  const saveEdit = async (id: string) => {
    try {
      await api.put(`/admin/informations/${id}`, { title: editTitle, description: editDesc, image_url: editImg });
      toast.success('Disimpan!'); setEditId(null); fetchItems();
    } catch { toast.error('Gagal update'); }
  };

  const del = async (id: string) => {
    if (!confirm('Hapus ini?')) return;
    await api.delete(`/admin/informations/${id}`);
    toast.success('Dihapus!'); fetchItems();
  };

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || (i.description && i.description.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between mb-6 gap-3">
        <div>
          <h1 className="text-4xl font-black uppercase mb-1">📋 INFORMASI & PERATURAN</h1>
          <p className="text-gray-600 font-semibold m-0">Peraturan hotel, jadwal sarapan, nomor darurat.</p>
        </div>
        <input type="text" placeholder="🔍 Cari info..." className="nb-input px-4 py-2 w-full max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <form onSubmit={add} className="nb-card p-6 mb-8" style={{ background: '#ff006e', color: 'white' }}>
        <h2 className="font-black uppercase text-xl mb-4">+ Tambah Informasi / Pengumuman</h2>
        <div className="grid grid-cols-1 gap-3 mb-3">
          <input className="nb-input px-4 py-2 text-black" placeholder="Judul Pengumuman" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="nb-input px-4 py-2 h-20 resize-none text-black" placeholder="Isi pengumuman lengkap..." value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="nb-btn px-6 py-2 font-black" style={{ background: 'white', color: '#0a0a0a' }}>
          <Plus size={16} className="inline mr-2" />PUBLISH PENGUMUMAN
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item, i) => {
          const edit = editId === item.id;
          return (
            <div key={item.id} className="nb-card p-5" style={{ borderLeft: `6px solid ${['#ffd60a', '#3a86ff', '#06d6a0', '#ff006e'][i % 4]}` }}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {edit ? (
                  <div className="flex-1 space-y-3">
                    <input className="nb-input px-3 py-2 w-full text-lg font-black" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <textarea className="nb-input px-3 py-2 w-full text-sm h-32" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-black text-xl mb-1">{item.title}</div>
                    <div className="text-gray-600 font-semibold text-sm whitespace-pre-line leading-relaxed">{item.description}</div>
                  </div>
                )}
                
                <div className="shrink-0 flex md:flex-col gap-2 border-t-2 md:border-t-0 md:border-l-2 border-gray-200 mt-2 pt-3 md:mt-0 md:pt-0 md:pl-4">
                  {edit ? (
                    <>
                      <button onClick={() => saveEdit(item.id)} className="nb-btn p-2.5 bg-green-400 text-black flex items-center justify-center gap-1 font-bold text-xs"><Check size={14}/> SIMPAN</button>
                      <button onClick={() => setEditId(null)} className="nb-btn p-2.5 bg-gray-200 text-black flex items-center justify-center gap-1 font-bold text-xs"><X size={14}/> BATAL</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditId(item.id); setEditTitle(item.title); setEditDesc(item.description || ''); setEditImg(item.image_url || ''); }} className="nb-btn p-2 bg-blue-500 text-white flex items-center justify-center gap-2 font-bold text-xs"><Edit2 size={13}/> EDIT</button>
                      <button onClick={() => del(item.id)} className="nb-btn p-2 bg-pink-600 text-white flex items-center justify-center gap-2 font-bold text-xs"><Trash2 size={13}/> HAPUS</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div className="p-10 text-center font-bold text-gray-500">Tidak ada pengumuman.</div>}
      </div>
    </div>
  );
}
