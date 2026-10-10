import { useEffect, useState } from 'react';
import { Users, ArrowLeft, Mail, Phone, MapPin, Trash2, User } from 'lucide-react';
import { fetchCustomers, deleteOrder } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { Customer } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { useToast } from '@/contexts/ToastContext';

interface AdminCustomersProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminCustomers({ onNavigate }: AdminCustomersProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { show } = useToast();

  useEffect(() => {
    fetchCustomers().then(setCustomers).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      show('تم حذف العميل', 'success');
    } catch {
      show('حدث خطأ أثناء الحذف', 'error');
    }
  };

  const filtered = customers.filter(
    (c) => c.name.includes(search) || (c.email || '').includes(search) || (c.phone || '').includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-c flex items-center gap-2">
            <Users className="w-7 h-7 text-accent-c" />
            إدارة العملاء
          </h1>
          <p className="text-secondary-c text-sm mt-1">{customers.length} عميل</p>
        </div>
        <button onClick={() => onNavigate('admin')} className="btn-ghost border border-c">
          <ArrowLeft className="w-4 h-4" />
          لوحة التحكم
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الهاتف أو البريد..."
          className="input-field"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-12 w-12 bg-secondary-c rounded-full mb-3" />
              <div className="h-4 bg-secondary-c rounded w-2/3 mb-2" />
              <div className="h-3 bg-secondary-c rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-secondary-c mx-auto mb-3" />
          <p className="text-secondary-c">لا يوجد عملاء</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => (
            <div key={customer.id} className="card p-5 hover:border-[var(--accent)] transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-[var(--accent-glow)] flex items-center justify-center">
                  <User className="w-6 h-6 text-accent-c" />
                </div>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-primary-c text-sm mb-1">{customer.name}</h3>
              <p className="text-xs text-secondary-c mb-3">{formatDateTime(customer.created_at)}</p>

              <div className="space-y-1.5">
                {customer.phone && (
                  <div className="flex items-center gap-2 text-xs text-secondary-c">
                    <Phone className="w-3.5 h-3.5 text-accent-c shrink-0" />
                    <span dir="ltr">{customer.phone}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2 text-xs text-secondary-c">
                    <Mail className="w-3.5 h-3.5 text-accent-c shrink-0" />
                    <span dir="ltr" className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.city && (
                  <div className="flex items-center gap-2 text-xs text-secondary-c">
                    <MapPin className="w-3.5 h-3.5 text-accent-c shrink-0" />
                    <span>{customer.city}</span>
                  </div>
                )}
              </div>

              {customer.address && (
                <p className="text-xs text-secondary-c mt-3 pt-3 border-t border-c line-clamp-2">
                  {customer.address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
