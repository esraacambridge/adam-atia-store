import { useEffect, useState } from 'react';
import { LayoutDashboard, Gamepad2, ShoppingBag, Users, TrendingUp, AlertTriangle, Package, DollarSign, Clock, ArrowLeft, Tag } from 'lucide-react';
import { fetchDashboardStats } from '@/lib/api';
import { formatEGP, formatDateTime } from '@/lib/format';
import type { Game, Order, OrderItem } from '@/lib/types';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<{
    totalGames: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    lowStockGames: Game[];
    recentOrders: (Order & { order_items?: OrderItem[] })[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'إجمالي الألعاب', value: stats?.totalGames ?? 0, icon: Gamepad2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'إجمالي الطلبات', value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: 'text-accent-c', bg: 'bg-[var(--accent-glow)]' },
    { label: 'العملاء', value: stats?.totalCustomers ?? 0, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'إجمالي المبيعات', value: formatEGP(stats?.totalRevenue ?? 0), icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const statusLabels: Record<string, string> = {
    pending: 'قيد الانتظار',
    processing: 'قيد التجهيز',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-c flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-accent-c" />
            لوحة التحكم
          </h1>
          <p className="text-secondary-c text-sm mt-1">نظرة عامة على أداء المتجر</p>
        </div>
        <button onClick={() => onNavigate('home')} className="btn-ghost border border-c">
          <ArrowLeft className="w-4 h-4" />
          العودة للمتجر
        </button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-12 w-12 bg-secondary-c rounded-xl mb-3" />
              <div className="h-4 bg-secondary-c rounded w-2/3 mb-2" />
              <div className="h-8 bg-secondary-c rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="card p-6 hover:border-[var(--accent)] transition-colors">
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <p className="text-sm text-secondary-c mb-1">{card.label}</p>
              <p className="text-2xl font-extrabold text-primary-c">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'إدارة الألعاب', page: 'admin-games', icon: Gamepad2 },
          { label: 'إدارة الطلبات', page: 'admin-orders', icon: ShoppingBag },
          { label: 'العملاء', page: 'admin-customers', icon: Users },
          { label: 'العروض', page: 'admin-offers', icon: Tag },
          { label: 'الإحصائيات', page: 'admin-stats', icon: TrendingUp },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.page)}
            className="card p-4 flex items-center gap-3 hover:border-[var(--accent)] hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center">
              <action.icon className="w-5 h-5 text-accent-c" />
            </div>
            <span className="text-sm font-semibold text-primary-c">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary-c text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-c" />
              أحدث الطلبات
            </h2>
            <button onClick={() => onNavigate('admin-orders')} className="text-sm text-accent-c hover:underline">
              عرض الكل
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-secondary-c rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats?.recentOrders.length === 0 ? (
            <p className="text-secondary-c text-sm text-center py-8">لا توجد طلبات بعد</p>
          ) : (
            <div className="space-y-2">
              {stats?.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary-c hover:bg-[var(--bg-card)] transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary-c truncate">{order.customer_name}</p>
                    <p className="text-xs text-secondary-c">{formatDateTime(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${statusColors[order.status] || statusColors['pending']}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="text-sm font-bold text-accent-c">{formatEGP(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary-c text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              تنبيهات المخزون
            </h2>
            <button onClick={() => onNavigate('admin-games')} className="text-sm text-accent-c hover:underline">
              إدارة المخزون
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-secondary-c rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats?.lowStockGames.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="text-secondary-c text-sm">جميع الألعاب متوفرة بكميات جيدة</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats?.lowStockGames.map((game) => (
                <div key={game.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary-c">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-primary)] shrink-0">
                    <img src={game.image_url || ''} alt={game.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-c truncate">{game.title}</p>
                    <p className="text-xs text-secondary-c">{formatEGP(game.price)}</p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-lg ${game.stock <= 0 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {game.stock} قطعة
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
