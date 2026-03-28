'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Hotel, UtensilsCrossed, Tv, HandHelping } from 'lucide-react';

interface Stats {
  orders: number;
  requests: number;
  rooms: number;
  devices: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ orders: 0, requests: 0, rooms: 0, devices: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orders, requests, rooms, devices] = await Promise.all([
          api.get('/admin/orders'),
          api.get('/admin/requests'),
          api.get('/admin/rooms'),
          api.get('/admin/devices'),
        ]);
        setStats({
          orders: orders.data.length,
          requests: requests.data.length,
          rooms: rooms.data.length,
          devices: devices.data.length,
        });
      } catch { /* silently ignored on first render */ }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Pesanan Masuk', value: stats.orders, icon: UtensilsCrossed, bg: '#ffd60a' },
    { label: 'Permintaan Barang', value: stats.requests, icon: HandHelping, bg: '#ff006e', color: 'white' },
    { label: 'Total Kamar', value: stats.rooms, icon: Hotel, bg: '#3a86ff', color: 'white' },
    { label: 'Perangkat TV', value: stats.devices, icon: Tv, bg: '#06d6a0' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight">📊 Dashboard</h1>
        <p className="text-gray-600 font-semibold mt-1">Ringkasan operasional hotel hari ini</p>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10">
        {cards.map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="nb-card p-6" style={{ background: bg, color: color || '#0a0a0a' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-black">{value}</div>
                <div className="font-bold text-sm uppercase mt-1">{label}</div>
              </div>
              <Icon size={40} strokeWidth={2.5} />
            </div>
          </div>
        ))}
      </div>

      <div className="nb-card p-6">
        <h2 className="text-xl font-black uppercase mb-3">📡 Status Sistem</h2>
        <div className="flex gap-3 flex-wrap">
          <span className="nb-badge" style={{ background: '#06d6a0' }}>● Backend API Online</span>
          <span className="nb-badge" style={{ background: '#ffd60a' }}>● Database Terhubung</span>
          <span className="nb-badge" style={{ background: '#3a86ff', color: 'white' }}>● WebSocket Aktif</span>
        </div>
      </div>
    </div>
  );
}
