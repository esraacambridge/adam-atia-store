import { useEffect, useState } from 'react';
import { Tag, Plus, Edit, Trash2, X, Save, ArrowLeft, Loader2, Percent } from 'lucide-react';
import { fetchAllOffers, createOffer, updateOffer, deleteOffer, type OfferInput } from '@/lib/api';
import type { Offer } from '@/lib/types';
import { useToast } from '@/contexts/ToastContext';

interface AdminOffersProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminOffers({ onNavigate }: AdminOffersProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const { show } = useToast();

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOffers();
      setOffers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: OfferInput) => {
    try {
      if (editing) {
        await updateOffer(editing.id, data);
        show('تم تحديث العرض', 'success');
      } else {
        await createOffer(data);
        show('تم إضافة العرض', 'success');
      }
      setShowForm(false);
      setEditing(null);
      loadOffers();
    } catch {
      show('حدث خطأ', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;
    try {
      await deleteOffer(id);
      show('تم حذف العرض', 'success');
      loadOffers();
    } catch {
      show('حدث خطأ', 'error');
    }
  };

  const handleToggle = async (offer: Offer) => {
    try {
      await updateOffer(offer.id, { is_active: !offer.is_active });
      loadOffers();
    } catch {
      show('حدث خطأ', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-c flex items-center gap-2">
            <Tag className="w-7 h-7 text-accent-c" />
            إدارة العروض
          </h1>
          <p className="text-secondary-c text-sm mt-1">{offers.length} عرض</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('admin')} className="btn-ghost border border-c">
            <ArrowLeft className="w-4 h-4" />
            لوحة التحكم
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
            <Plus className="w-4 h-4" />
            إضافة عرض
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="card p-12 text-center">
          <Tag className="w-12 h-12 text-secondary-c mx-auto mb-3" />
          <p className="text-secondary-c">لا توجد عروض</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="card p-5 group">
              <div className="flex items-start gap-4">
                {offer.image_url && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary-c shrink-0">
                    <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-primary-c text-sm truncate">{offer.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${offer.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {offer.is_active ? 'نشط' : 'متوقف'}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-c line-clamp-2 mb-2">{offer.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm font-bold text-red-400">
                      <Percent className="w-3.5 h-3.5" />
                      {offer.discount_percent}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-c">
                <button
                  onClick={() => handleToggle(offer)}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-secondary-c text-secondary-c hover:text-accent-c transition-colors"
                >
                  {offer.is_active ? 'إيقاف' : 'تفعيل'}
                </button>
                <button
                  onClick={() => { setEditing(offer); setShowForm(true); }}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-secondary-c text-accent-c flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" /> تعديل
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-secondary-c text-red-400 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <OfferForm offer={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function OfferForm({ offer, onSave, onClose }: {
  offer: Offer | null;
  onSave: (data: OfferInput) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: offer?.title || '',
    description: offer?.description || '',
    image_url: offer?.image_url || '',
    discount_percent: offer?.discount_percent?.toString() || '10',
    is_active: offer?.is_active ?? true,
    ends_at: offer?.ends_at?.slice(0, 10) || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...form,
      discount_percent: Number(form.discount_percent),
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : undefined,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-c">{offer ? 'تعديل عرض' : 'إضافة عرض جديد'}</h2>
          <button onClick={onClose} className="text-secondary-c hover:text-primary-c">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-secondary-c mb-1.5 block">العنوان *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="text-sm text-secondary-c mb-1.5 block">الوصف</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" />
          </div>
          <div>
            <label className="text-sm text-secondary-c mb-1.5 block">رابط الصورة</label>
            <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" dir="ltr" placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">نسبة الخصم (%) *</label>
              <input type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} className="input-field" min="1" max="100" required />
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">تاريخ الانتهاء</label>
              <input type="date" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} className="input-field" dir="ltr" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-[var(--accent)]" />
            <span className="text-sm text-primary-c">العرض نشط</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {offer ? 'حفظ' : 'إضافة'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}
