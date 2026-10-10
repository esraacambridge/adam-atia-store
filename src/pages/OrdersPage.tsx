import { useEffect, useState } from 'react';
import { ShoppingBag, ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrdersByEmail } from '@/lib/api';
import type { Order } from '@/lib/types';
import { formatEGP, formatDateTime } from '@/lib/format';

interface OrdersPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchOrdersByEmail(user.email)
        .then(setOrders)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    pending: { label: 'قيد الانتظار', color: 'text-amber-400 bg-amber-500/10', icon: Clock },
    processing: { label: 'قيد التجهيز', color: 'text-blue-400 bg-blue-500/10', icon: Package },
    completed: { label: 'مكتمل', color: 'text-emerald-400 bg-emerald-500/10', icon: CheckCircle },
    cancelled: { label: 'ملغي', color: 'text-red-400 bg-red-500/10', icon: XCircle },
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center animate-fade-in">
        <ShoppingBag className="w-16 h-16 text-secondary-c mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary-c mb-3">سجل دخولك لعرض طلباتك</h2>
        <p className="text-secondary-c mb-6">تحتاج لتسجيل الدخول للاطلاع على سجل طلباتك</p>
        <button onClick={() => onNavigate('auth')} className="btn-primary">
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-1.5 text-sm text-secondary-c hover:text-accent-c transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        العودة للرئيسية
      </button>

      <h1 className="text-3xl font-extrabold text-primary-c mb-2 flex items-center gap-2">
        <ShoppingBag className="w-7 h-7 text-accent-c" />
        طلباتي
      </h1>
      <p className="text-secondary-c text-sm mb-8">{orders.length} طلب إجمالاً</p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-secondary-c rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-secondary-c mx-auto mb-3" />
          <p className="text-secondary-c mb-4">لا توجد طلبات بعد</p>
          <button onClick={() => onNavigate('shop')} className="btn-primary">تصفح المتجر</button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status] ?? { label: order.status, color: 'text-amber-400 bg-amber-500/10', icon: Clock };
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${status.color} flex items-center justify-center`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-c text-sm">طلب #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-secondary-c">{formatDateTime(order.created_at)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary-c">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--bg-primary)] shrink-0">
                        {item.image_url && <img src={item.image_url} alt={item.game_title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary-c truncate">{item.game_title}</p>
                        <p className="text-xs text-secondary-c">الكمية: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-accent-c">{formatEGP(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-c">
                  <span className="text-sm text-secondary-c">
                    {order.payment_method === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}
                  </span>
                  <span className="text-lg font-extrabold text-accent-c">{formatEGP(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
