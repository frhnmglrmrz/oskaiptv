'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Wifi, Link2 } from 'lucide-react';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  room_number: string | null;
  registered_at: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [roomNum, setRoomNum] = useState('');

  const fetch = async () => {
    const r = await api.get('/admin/devices');
    setDevices(r.data);
  };

  useEffect(() => { fetch(); }, []);

  const handleBind = async (id: string) => {
    await api.put(`/admin/devices/${id}`, { room_number: roomNum });
    toast.success(`TV berhasil diikat ke Kamar ${roomNum}`);
    setEditId(null);
    setRoomNum('');
    fetch();
  };

  return (
    <div>
      <h1 className="text-4xl font-black uppercase mb-6">📺 PERANGKAT TV</h1>
      <p className="text-gray-600 font-semibold mb-6">
        TV yang terdaftar di sini adalah semua Android TV yang sudah pernah menyala dan terkoneksi ke server OSKA.
      </p>

      <div className="nb-card overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: '#0a0a0a', color: 'white' }}>
            <tr>
              <th className="text-left p-4 font-black uppercase">Device ID (MAC)</th>
              <th className="text-left p-4 font-black uppercase">Nama Perangkat</th>
              <th className="text-left p-4 font-black uppercase">Kamar</th>
              <th className="text-left p-4 font-black uppercase">Terdaftar</th>
              <th className="p-4 font-black uppercase">Ikat Kamar</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, i) => (
              <tr key={device.id} style={{ background: i % 2 === 0 ? 'white' : '#f5f0e8', borderBottom: '2px solid #0a0a0a' }}>
                <td className="p-4 font-mono font-bold text-xs">{device.device_id}</td>
                <td className="p-4 font-bold">{device.device_name || '—'}</td>
                <td className="p-4">
                  {device.room_number ? (
                    <span className="nb-badge" style={{ background: '#06d6a0' }}>Kamar {device.room_number}</span>
                  ) : (
                    <span className="nb-badge" style={{ background: '#e0e0e0' }}>Belum Diikat</span>
                  )}
                </td>
                <td className="p-4 text-gray-600 font-semibold text-xs">
                  {new Date(device.registered_at).toLocaleString('id-ID')}
                </td>
                <td className="p-4 text-center">
                  {editId === device.id ? (
                    <div className="flex gap-2 justify-center">
                      <input
                        className="nb-input px-2 py-1 w-20 text-sm"
                        placeholder="101"
                        value={roomNum}
                        onChange={e => setRoomNum(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleBind(device.id)} className="nb-btn px-3 py-1 text-xs" style={{ background: '#06d6a0' }}>✓</button>
                      <button onClick={() => setEditId(null)} className="nb-btn px-3 py-1 text-xs" style={{ background: '#e0e0e0' }}>✗</button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditId(device.id); setRoomNum(device.room_number || ''); }}
                      className="nb-btn px-3 py-1 text-xs flex items-center gap-1 mx-auto"
                      style={{ background: '#3a86ff', color: 'white' }}>
                      <Link2 size={13} /> IKAT
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center font-bold text-gray-500">
                  <Wifi size={40} className="mx-auto mb-2 opacity-30" />
                  Belum ada TV terdaftar. TV akan otomatis muncul di sini saat pertama dinyalakan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
