'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  room_number: string;
  guest_name: string;
  total_items: number;
  total_price: number;
  status: string;
  ordered_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ffd60a',
  PREPARING: '#3a86ff',
  DELIVERED: '#06d6a0',
  CANCELED: '#ff006e',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: '⏳ MENUNGGU',
  PREPARING: '🔥 DIMASAK',
  DELIVERED: '✅ DIANTAR',
  CANCELED: '❌ BATAL',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const res = await api.get('/admin/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
    // Auto refresh setiap 10 detik
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    toast.success(`Status diubah ke ${STATUS_LABELS[status]}`);
    fetchOrders();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-black uppercase">🍽️ PESANAN DAPUR</h1>
        <span className="nb-badge animate-pulse" style={{ background: '#06d6a0' }}>● LIVE — Auto Refresh</span>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="nb-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-black text-lg">Kamar {order.room_number} — {order.guest_name || 'Tamu'}</div>
                <div className="text-sm text-gray-600 font-semibold mt-1">
                  {order.total_items} item • Rp {order.total_price.toLocaleString('id-ID')}
                  <span className="ml-3 text-gray-400">{new Date(order.ordered_at).toLocaleTimeString('id-ID')}</span>
                </div>
              </div>
              <span className="nb-badge" style={{ background: STATUS_COLORS[order.status], color: order.status === 'DELIVERED' || order.status === 'PREPARING' ? 'white' : 'black' }}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {order.status === 'PENDING' && (
                <button onClick={() => updateStatus(order.id, 'PREPARING')} className="nb-btn px-4 py-1 text-sm" style={{ background: '#3a86ff', color: 'white' }}>
                  🔥 MULAI MASAK
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="nb-btn px-4 py-1 text-sm" style={{ background: '#06d6a0' }}>
                  ✅ SUDAH DIANTAR
                </button>
              )}
              {(order.status === 'PENDING' || order.status === 'PREPARING') && (
                <button onClick={() => updateStatus(order.id, 'CANCELED')} className="nb-btn px-4 py-1 text-sm" style={{ background: '#ff006e', color: 'white' }}>
                  ❌ BATALKAN
                </button>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="nb-card p-10 text-center">
            <div className="text-4xl mb-3">🍳</div>
            <div className="font-black text-xl">Belum ada pesanan masuk</div>
            <div className="text-gray-500 font-semibold mt-1">Halaman akan auto-refresh setiap 10 detik</div>
          </div>
        )}
      </div>
    </div>
  );
}
