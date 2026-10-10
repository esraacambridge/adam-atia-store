import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatEGP } from '@/lib/format';

interface CartPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-[var(--accent-glow)] flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-accent-c" />
        </div>
        <h2 className="text-2xl font-extrabold text-primary-c mb-3">سلة المشتريات فارغة</h2>
        <p className="text-secondary-c mb-6">لم تقم بإضافة أي ألعاب إلى سلتك بعد</p>
        <button onClick={() => onNavigate('shop')} className="btn-primary">
          تصفح المتجر
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const shipping = totalPrice >= 500 || totalPrice === 0 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-c">سلة المشتريات</h1>
          <p className="text-secondary-c text-sm mt-1">{totalItems} منتج في سلتك</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          تفريغ السلة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.game.id} className="card p-4 flex gap-4 animate-fade-in">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-secondary-c shrink-0 cursor-pointer"
                onClick={() => onNavigate('game', { slug: item.game.slug })}
              >
                <img src={item.game.image_url || ''} alt={item.game.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3
                    className="font-bold text-primary-c text-sm sm:text-base cursor-pointer hover:text-accent-c transition-colors line-clamp-1"
                    onClick={() => onNavigate('game', { slug: item.game.slug })}
                  >
                    {item.game.title}
                  </h3>
                  {item.game.category && (
                    <p className="text-xs text-secondary-c mt-0.5">{item.game.category.name}</p>
                  )}
                  <p className="text-xs text-secondary-c mt-0.5">{item.game.platform}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.game.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-c bg-secondary-c text-primary-c hover:border-[var(--accent)] transition-colors flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-primary-c text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.game.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-c bg-secondary-c text-primary-c hover:border-[var(--accent)] transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-accent-c text-sm sm:text-base">
                      {formatEGP(item.game.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.game.id)}
                      className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-primary-c text-lg mb-4">ملخص الطلب</h2>
            <div className="space-y-3 mb-4">
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
              {shipping > 0 && (
                <p className="text-xs text-secondary-c bg-[var(--bg-secondary)] rounded-lg p-2.5">
                  أضف منتجات بقيمة {formatEGP(500 - totalPrice)} للحصول على شحن مجاني!
                </p>
              )}
            </div>
            <div className="border-t border-c pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary-c">الإجمالي</span>
                <span className="text-2xl font-extrabold text-accent-c">{formatEGP(finalTotal)}</span>
              </div>
            </div>
            <button onClick={() => onNavigate('checkout')} className="btn-primary w-full">
              <ShoppingCart className="w-4 h-4" />
              إتمام الطلب
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="btn-ghost w-full mt-2 border border-c"
            >
              متابعة التسوق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
