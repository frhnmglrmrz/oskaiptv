'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Room {
  room_number: string;
  guest_name: string | null;
  check_in_time: string | null;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomNo, setRoomNo] = useState('');
  const [guestName, setGuestName] = useState('');

  const fetchRooms = async () => {
    const res = await api.get('/admin/rooms');
    setRooms(res.data);
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/admin/rooms/${roomNo}/checkin`, { guest_name: guestName });
    toast.success(`Check-in berhasil! ${guestName} → Kamar ${roomNo}`);
    setRoomNo(''); setGuestName('');
    fetchRooms();
  };

  const handleCheckout = async (roomNumber: string) => {
    if (!confirm(`Checkout tamu dari kamar ${roomNumber}?`)) return;
    await api.post(`/admin/rooms/${roomNumber}/checkout`);
    toast.success(`Kamar ${roomNumber} berhasil di-checkout`);
    fetchRooms();
  };

  return (
    <div>
      <h1 className="text-4xl font-black uppercase mb-6">🏨 KAMAR & CHECK-IN</h1>

      {/* Form Check-in */}
      <form onSubmit={handleCheckin} className="nb-card p-6 mb-6" style={{ background: '#3a86ff', color: 'white' }}>
        <h2 className="text-xl font-black uppercase mb-4">🛎️ Check-In Tamu Baru</h2>
        <div className="flex gap-3">
          <input className="nb-input px-4 py-2 flex-1" placeholder="Nomor Kamar (cth: 101)" style={{ color: '#0a0a0a' }} value={roomNo} onChange={e => setRoomNo(e.target.value)} required />
          <input className="nb-input px-4 py-2 flex-2 w-full" placeholder="Nama Lengkap Tamu" style={{ color: '#0a0a0a' }} value={guestName} onChange={e => setGuestName(e.target.value)} required />
          <button type="submit" className="nb-btn px-6 py-2 font-black" style={{ background: '#ffd60a', color: '#0a0a0a', borderColor: '#0a0a0a' }}>
            CHECK-IN ✓
          </button>
        </div>
      </form>

      {/* Table Kamar */}
      <div className="nb-card overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: '#0a0a0a', color: 'white' }}>
            <tr>
              <th className="text-left p-4 font-black uppercase">No. Kamar</th>
              <th className="text-left p-4 font-black uppercase">Nama Tamu</th>
              <th className="text-left p-4 font-black uppercase">Waktu Check-in</th>
              <th className="text-left p-4 font-black uppercase">Status</th>
              <th className="p-4 font-black uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, i) => (
              <tr key={room.room_number} style={{ background: i % 2 === 0 ? 'white' : '#f5f0e8', borderBottom: '2px solid #0a0a0a' }}>
                <td className="p-4 font-black text-lg">#{room.room_number}</td>
                <td className="p-4 font-bold">{room.guest_name || '—'}</td>
                <td className="p-4 font-semibold text-gray-600">
                  {room.check_in_time ? new Date(room.check_in_time).toLocaleString('id-ID') : '—'}
                </td>
                <td className="p-4">
                  <span className="nb-badge" style={{ background: room.guest_name ? '#06d6a0' : '#e0e0e0' }}>
                    {room.guest_name ? '● TERISI' : '○ KOSONG'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {room.guest_name && (
                    <button onClick={() => handleCheckout(room.room_number)} className="nb-btn px-3 py-1 text-xs" style={{ background: '#ff006e', color: 'white' }}>
                      CHECKOUT
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center font-bold text-gray-500">Belum ada data kamar terdaftar</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
