'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Request {
  id: string;
  room_number: string;
  guest_name: string;
  status: string;
  requested_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ffd60a', PROCESSING: '#3a86ff', COMPLETED: '#06d6a0', CANCELED: '#ff006e',
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);

  const fetch = async () => { const r = await api.get('/admin/requests'); setRequests(r.data); };
  useEffect(() => { fetch(); const i = setInterval(fetch, 10000); return () => clearInterval(i); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/admin/requests/${id}/status`, { status });
    toast.success('Status diperbarui!');
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-black uppercase">🧹 HOUSEKEEPING</h1>
        <span className="nb-badge animate-pulse" style={{ background: '#06d6a0' }}>● LIVE</span>
      </div>
      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req.id} className="nb-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-lg">Kamar {req.room_number} — {req.guest_name || 'Tamu'}</div>
                <div className="text-sm text-gray-600 font-semibold mt-1">{new Date(req.requested_at).toLocaleString('id-ID')}</div>
              </div>
              <span className="nb-badge" style={{ background: STATUS_COLORS[req.status] || '#e0e0e0' }}>{req.status}</span>
            </div>
            <div className="flex gap-2 mt-4">
              {req.status === 'PENDING' && (
                <button onClick={() => updateStatus(req.id, 'PROCESSING')} className="nb-btn px-4 py-1 text-sm" style={{ background: '#3a86ff', color: 'white' }}>PROSES</button>
              )}
              {req.status === 'PROCESSING' && (
                <button onClick={() => updateStatus(req.id, 'COMPLETED')} className="nb-btn px-4 py-1 text-sm" style={{ background: '#06d6a0' }}>SELESAI ✓</button>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="nb-card p-10 text-center"><div className="text-4xl mb-3">🛎️</div><div className="font-black text-xl">Belum ada permintaan</div></div>
        )}
      </div>
    </div>
  );
}
