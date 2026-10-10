import { useState } from 'react';
import { CheckCircle, ArrowLeft, CreditCard, Banknote, User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { formatEGP } from '@/lib/format';
import { createOrder } from '@/lib/api';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { show } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cod',
  });

  const shipping = totalPrice >= 500 || totalPrice === 0 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      show('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
        },
        items: items.map((item) => ({
          game_id: item.game.id,
          game_title: item.game.title,
          price: item.game.price,
          quantity: item.quantity,
          image_url: item.game.image_url,
        })),
        total: finalTotal,
        payment_method: form.paymentMethod,
        notes: form.notes,
      });
      setOrderId(order.id);
      setSuccess(true);
      clearCart();
      show('تم إرسال طلبك بنجاح!', 'success');
    } catch {
      show('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-primary-c mb-3">تم إرسال طلبك بنجاح!</h2>
        <p className="text-secondary-c mb-2">شكراً لك. سيتم التواصل معك قريباً لتأكيد الطلب.</p>
        <p className="text-sm text-secondary-c mb-6">رقم الطلب: <span className="font-mono text-accent-c">{orderId.slice(0, 8).toUpperCase()}</span></p>
        <button onClick={() => onNavigate('home')} className="btn-primary">
          العودة للرئيسية
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-primary-c mb-4">سلتك فارغة</h2>
        <button onClick={() => onNavigate('shop')} className="btn-primary">تصفح المتجر</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button
        onClick={() => onNavigate('cart')}
        className="flex items-center gap-1.5 text-sm text-secondary-c hover:text-accent-c transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        العودة للسلة
      </button>

      <h1 className="text-3xl font-extrabold text-primary-c mb-8">إتمام الطلب</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="card p-6">
            <h2 className="font-bold text-primary-c text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-accent-c" />
              بيانات العميل
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-secondary-c mb-1.5 block">الاسم الكامل *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="أدخل اسمك"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-secondary-c mb-1.5 block">رقم الهاتف *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0100 123 4567"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-secondary-c mb-1.5 block">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-secondary-c mb-1.5 block">المدينة *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="القاهرة"
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-secondary-c mb-1.5 block">العنوان التفصيلي *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="الشارع، المبنى، الشقة"
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-secondary-c mb-1.5 block">ملاحظات (اختياري)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="أي ملاحظات إضافية حول طلبك"
                  className="input-field min-h-[80px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="font-bold text-primary-c text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-c" />
              طريقة الدفع
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'cod', label: 'الدفع عند الاستلام', icon: Banknote, desc: 'ادفع نقداً عند استلام طلبك' },
                { id: 'card', label: 'بطاقة ائتمان', icon: CreditCard, desc: 'Visa / Mastercard' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: method.id })}
                  className={`p-4 rounded-xl border-2 text-right transition-all ${
                    form.paymentMethod === method.id
                      ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                      : 'border-c hover:border-[var(--accent)]'
                  }`}
                >
                  <method.icon className={`w-6 h-6 mb-2 ${form.paymentMethod === method.id ? 'text-accent-c' : 'text-secondary-c'}`} />
                  <p className="font-semibold text-primary-c text-sm">{method.label}</p>
                  <p className="text-xs text-secondary-c mt-0.5">{method.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-primary-c text-lg mb-4">ملخص الطلب</h2>

            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.game.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary-c shrink-0">
                    <img src={item.game.image_url || ''} alt={item.game.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-c line-clamp-1">{item.game.title}</p>
                    <p className="text-xs text-secondary-c">الكمية: {item.quantity}</p>
                    <p className="text-sm font-bold text-accent-c">{formatEGP(item.game.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-c pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-c">المجموع الفرعي</span>
                <span className="text-primary-c font-semibold">{formatEGP(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-c">الشحن</span>
                <span className="text-primary-c font-semibold">
                  {shipping === 0 ? <span className="text-emerald-500">مجاني</span> : formatEGP(shipping)}
                </span>
              </div>
            </div>

            <div className="border-t border-c pt-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary-c">الإجمالي</span>
                <span className="text-2xl font-extrabold text-accent-c">{formatEGP(finalTotal)}</span>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  تأكيد الطلب
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
