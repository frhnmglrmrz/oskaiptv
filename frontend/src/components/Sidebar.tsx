'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, UtensilsCrossed, HandHelping,
  Hotel, Tv, Settings, LogOut, ClipboardList, Wifi
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Pesanan Dapur', icon: UtensilsCrossed },
  { href: '/dashboard/requests', label: 'Housekeeping', icon: HandHelping },
  { href: '/dashboard/rooms', label: 'Kamar & Check-in', icon: Hotel },
  { href: '/dashboard/dining', label: 'Menu Makanan', icon: ClipboardList },
  { href: '/dashboard/amenities', label: 'Amenities', icon: HandHelping },
  { href: '/dashboard/facilities', label: 'Fasilitas Hotel', icon: Hotel },
  { href: '/dashboard/informations', label: 'Info & Peraturan', icon: ClipboardList },
  { href: '/dashboard/apps', label: 'Launcher TV', icon: Tv },
  { href: '/dashboard/devices', label: 'Perangkat TV', icon: Wifi },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings },
  { href: '/dashboard/system-update', label: 'OTA Update', icon: Tv },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    toast.success('Sesi berakhir. Sampai jumpa!');
    router.push('/login');
  };

  return (
    <aside className="nb-sidebar w-64 min-h-screen flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-5 border-b-2 border-gray-800">
        <div className="text-2xl font-black text-yellow-400 tracking-tight">⚡ OSKA IPTV</div>
        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Hotel Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}>
              <div className={`nb-nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={18} />
                <span className="text-sm">{label}</span>
                {isActive && <span className="ml-auto text-xs font-black">◀</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="nb-nav-item m-2 rounded-none hover:bg-red-500 text-red-400 hover:text-white border-t-2 border-gray-800"
      >
        <LogOut size={18} />
        <span className="text-sm">Keluar</span>
      </button>
    </aside>
  );
}
