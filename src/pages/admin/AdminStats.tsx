import { useEffect, useState } from 'react';
import { TrendingUp, ArrowLeft, DollarSign, ShoppingBag, Users, Gamepad2, Star, Package } from 'lucide-react';
import { fetchDashboardStats, fetchAllGames, fetchOrders } from '@/lib/api';
import { formatEGP, formatDateTime } from '@/lib/format';
import type { Game, Order } from '@/lib/types';

interface AdminStatsProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminStats({ onNavigate }: AdminStatsProps) {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchDashboardStats>> | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchAllGames(), fetchOrders()])
      .then(([s, g, o]) => {
        setStats(s);
        setGames(g);
        setOrders(o);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalStock = games.reduce((sum, g) => sum + g.stock, 0);
  const avgRating = games.length > 0 ? (games.reduce((sum, g) => sum + g.rating, 0) / games.length).toFixed(1) : '0';
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const avgOrderValue = completedOrders.length > 0 ? (totalRevenue / completedOrders.length).toFixed(0) : '0';

  const topRated = [...games].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-c flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-accent-c" />
            الإحصائيات
          </h1>
          <p className="text-secondary-c text-sm mt-1">تحليل أداء المتجر</p>
        </div>
        <button onClick={() => onNavigate('admin')} className="btn-ghost border border-c">
          <ArrowLeft className="w-4 h-4" />
          لوحة التحكم
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'إجمالي المبيعات', value: formatEGP(Number(totalRevenue)), icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'طلبات مكتملة', value: completedOrders.length, icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'طلبات قيد الانتظار', value: pendingOrders.length, icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'طلبات ملغاة', value: cancelledOrders.length, icon: Package, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'إجمالي الألعاب', value: games.length, icon: Gamepad2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'إجمالي المخزون', value: totalStock, icon: Package, color: 'text-accent-c', bg: 'bg-[var(--accent-glow)]' },
              { label: 'متوسط التقييم', value: `${avgRating} / 5`, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'متوسط قيمة الطلب', value: formatEGP(Number(avgOrderValue)), icon: DollarSign, color: 'text-accent-c', bg: 'bg-[var(--accent-glow)]' },
            ].map((card, i) => (
              <div key={i} className="card p-5">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-xs text-secondary-c mb-1">{card.label}</p>
                <p className="text-xl font-extrabold text-primary-c">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Rated Games */}
            <div className="card p-6">
              <h2 className="font-bold text-primary-c text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                الأعلى تقييماً
              </h2>
              <div className="space-y-2">
                {topRated.map((game, i) => (
                  <div key={game.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary-c">
                    <span className="text-lg font-extrabold text-secondary-c w-6 text-center">{i + 1}</span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--bg-primary)] shrink-0">
                      <img src={game.image_url || ''} alt={game.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary-c truncate">{game.title}</p>
                      <p className="text-xs text-secondary-c">{formatEGP(game.price)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-primary-c">{game.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card p-6">
              <h2 className="font-bold text-primary-c text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent-c" />
                أحدث الطلبات
              </h2>
              <div className="space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary-c">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary-c truncate">{order.customer_name}</p>
                      <p className="text-xs text-secondary-c">{formatDateTime(order.created_at)}</p>
                    </div>
                    <span className="text-sm font-bold text-accent-c shrink-0">{formatEGP(order.total)}</span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-secondary-c text-sm text-center py-8">لا توجد طلبات</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
