import { useEffect, useState } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Eye, X, Package } from 'lucide-react';
import { fetchOrders, updateOrderStatus, deleteOrder } from '@/lib/api';
import type { Order } from '@/lib/types';
import { formatEGP, formatDateTime } from '@/lib/format';
import { useToast } from '@/contexts/ToastContext';

interface AdminOrdersProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminOrders({ onNavigate }: AdminOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const { show } = useToast();

  useEffect(() => {
    fetchOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

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
  const statuses = ['all', 'pending', 'processing', 'completed', 'cancelled'];

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      show('تم تحديث حالة الطلب', 'success');
    } catch {
      show('حدث خطأ أثناء التحديث', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      show('تم حذف الطلب', 'success');
    } catch {
      show('حدث خطأ أثناء الحذف', 'error');
    }
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-c flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-accent-c" />
            إدارة الطلبات
          </h1>
          <p className="text-secondary-c text-sm mt-1">{orders.length} طلب إجمالاً</p>
        </div>
        <button onClick={() => onNavigate('admin')} className="btn-ghost border border-c">
          <ArrowLeft className="w-4 h-4" />
          لوحة التحكم
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === s
                ? 'bg-[var(--accent-glow)] text-accent-c border border-[var(--accent)]'
                : 'bg-secondary-c text-secondary-c border border-c hover:text-primary-c'
            }`}
          >
            {s === 'all' ? 'الكل' : statusLabels[s]}
            <span className="mr-1.5 text-xs">
              ({s === 'all' ? orders.length : orders.filter((o) => o.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="card p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary-c rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-secondary-c mx-auto mb-3" />
          <p className="text-secondary-c">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="card p-4 hover:border-[var(--accent)] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-accent-c" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-primary-c text-sm">{order.customer_name}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${statusColors[order.status]}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-c mt-0.5">
                      {formatDateTime(order.created_at)} • {order.order_items?.length || 0} منتج
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-lg font-extrabold text-accent-c">{formatEGP(order.total)}</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="input-field py-2 px-3 text-xs cursor-pointer w-auto"
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="processing">قيد التجهيز</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                  <button
                    onClick={() => setViewOrder(order)}
                    className="w-9 h-9 rounded-lg bg-secondary-c text-accent-c hover:bg-[var(--accent-glow)] transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="w-9 h-9 rounded-lg bg-secondary-c text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewOrder(null)}>
          <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-c">تفاصيل الطلب</h2>
              <button onClick={() => setViewOrder(null)} className="text-secondary-c hover:text-primary-c">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-secondary-c text-xs mb-0.5">رقم الطلب</p>
                  <p className="font-mono text-primary-c">{viewOrder.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-secondary-c text-xs mb-0.5">التاريخ</p>
                  <p className="text-primary-c">{formatDateTime(viewOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-secondary-c text-xs mb-0.5">العميل</p>
                  <p className="text-primary-c font-semibold">{viewOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-secondary-c text-xs mb-0.5">الهاتف</p>
                  <p className="text-primary-c" dir="ltr">{viewOrder.customer_phone}</p>
                </div>
                <div>
                  <p className="text-secondary-c text-xs mb-0.5">المدينة</p>
                  <p className="text-primary-c">{viewOrder.customer_city}</p>
                </div>
                <div>
                  <p className="text-secondary-c text-xs mb-0.5">طريقة الدفع</p>
                  <p className="text-primary-c">{viewOrder.payment_method === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}</p>
                </div>
              </div>

              {viewOrder.customer_email && (
                <div>
                  <p className="text-secondary-c text-xs mb-0.5">البريد الإلكتروني</p>
                  <p className="text-primary-c" dir="ltr">{viewOrder.customer_email}</p>
                </div>
              )}

              <div>
                <p className="text-secondary-c text-xs mb-0.5">العنوان</p>
                <p className="text-primary-c">{viewOrder.customer_address}</p>
              </div>

              {viewOrder.notes && (
                <div>
                  <p className="text-secondary-c text-xs mb-0.5">ملاحظات</p>
                  <p className="text-primary-c">{viewOrder.notes}</p>
                </div>
              )}

              {/* Items */}
              <div className="border-t border-c pt-4">
                <h3 className="font-bold text-primary-c text-sm mb-3">المنتجات</h3>
                <div className="space-y-2">
                  {viewOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary-c">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-primary)] shrink-0">
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
              </div>

              <div className="border-t border-c pt-4 flex justify-between items-center">
                <span className="font-bold text-primary-c">الإجمالي</span>
                <span className="text-2xl font-extrabold text-accent-c">{formatEGP(viewOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
