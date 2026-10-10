import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Zap, Shield, Truck, Check, ArrowRight, Gamepad2, Calendar, Building2, Cpu } from 'lucide-react';
import { fetchGameBySlug, fetchGames } from '@/lib/api';
import type { Game } from '@/lib/types';
import { formatEGP, formatDate } from '@/lib/format';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import GameCard from '@/components/GameCard';

interface GameDetailsPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function GameDetailsPage({ slug, onNavigate }: GameDetailsPageProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [related, setRelated] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { show } = useToast();

  useEffect(() => {
    setLoading(true);
    fetchGameBySlug(slug)
      .then(async (g) => {
        setGame(g);
        if (g) {
          const all = await fetchGames({ categoryId: g.category_id || undefined });
          setRelated(all.filter((x) => x.id !== g.id).slice(0, 4));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!game) return;
    addToCart(game, quantity);
    show(`تمت إضافة "${game.title}" إلى السلة`, 'success');
  };

  const handleBuyNow = () => {
    if (!game) return;
    addToCart(game, quantity);
    onNavigate('cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-6 bg-secondary-c rounded w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[16/10] bg-secondary-c rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary-c rounded w-3/4" />
            <div className="h-4 bg-secondary-c rounded w-1/2" />
            <div className="h-24 bg-secondary-c rounded" />
            <div className="h-12 bg-secondary-c rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <Gamepad2 className="w-16 h-16 text-secondary-c mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary-c mb-2">اللعبة غير موجودة</h2>
        <button onClick={() => onNavigate('shop')} className="btn-primary mt-4">
          العودة للمتجر
        </button>
      </div>
    );
  }

  const discount = game.original_price && game.original_price > game.price
    ? Math.round(((game.original_price - game.price) / game.original_price) * 100)
    : 0;
  const isFree = game.price === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <button
        onClick={() => onNavigate('shop')}
        className="flex items-center gap-1.5 text-sm text-secondary-c hover:text-accent-c transition-colors mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للمتجر
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="relative">
          <div className="card overflow-hidden aspect-[16/10] glow-box">
            <img src={game.image_url || ''} alt={game.title} className="w-full h-full object-cover" />
          </div>
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
              خصم {discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {game.category && (
            <span className="text-sm text-accent-c font-semibold mb-2">{game.category.name}</span>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-c mb-3">{game.title}</h1>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(game.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                />
              ))}
              <span className="text-sm text-secondary-c mr-1">{game.rating.toFixed(1)}</span>
            </div>
            <div className="h-4 w-px bg-c" />
            <span className="text-sm text-secondary-c">{game.platform}</span>
          </div>

          <p className="text-secondary-c leading-relaxed mb-6">{game.description}</p>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {game.publisher && (
              <div className="card p-3 flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-accent-c shrink-0" />
                <div>
                  <p className="text-xs text-secondary-c">الناشر</p>
                  <p className="text-sm font-semibold text-primary-c">{game.publisher}</p>
                </div>
              </div>
            )}
            {game.developer && (
              <div className="card p-3 flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-accent-c shrink-0" />
                <div>
                  <p className="text-xs text-secondary-c">المطور</p>
                  <p className="text-sm font-semibold text-primary-c">{game.developer}</p>
                </div>
              </div>
            )}
            {game.release_date && (
              <div className="card p-3 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-accent-c shrink-0" />
                <div>
                  <p className="text-xs text-secondary-c">تاريخ الإصدار</p>
                  <p className="text-sm font-semibold text-primary-c">{formatDate(game.release_date)}</p>
                </div>
              </div>
            )}
            <div className="card p-3 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-accent-c shrink-0" />
              <div>
                <p className="text-xs text-secondary-c">المخزون</p>
                <p className="text-sm font-semibold text-primary-c">
                  {isFree ? 'متاح دائماً' : game.stock > 0 ? `${game.stock} قطعة` : 'نفذت الكمية'}
                </p>
              </div>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="card p-5 mt-auto">
            <div className="flex items-center gap-3 mb-4">
              {isFree ? (
                <span className="text-3xl font-extrabold text-emerald-500">مجاني</span>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-accent-c">{formatEGP(game.price)}</span>
                  {game.original_price && game.original_price > game.price && (
                    <span className="text-lg text-secondary-c line-through">{formatEGP(game.original_price)}</span>
                  )}
                </>
              )}
            </div>

            {!isFree && game.stock > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-secondary-c">الكمية:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg border border-c bg-secondary-c text-primary-c hover:border-[var(--accent)] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-primary-c">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(game.stock, quantity + 1))}
                    className="w-9 h-9 rounded-lg border border-c bg-secondary-c text-primary-c hover:border-[var(--accent)] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={(!isFree && game.stock <= 0)}
                className="btn-secondary flex-1 disabled:opacity-40"
              >
                <ShoppingCart className="w-4 h-4" />
                أضف للسلة
              </button>
              <button
                onClick={handleBuyNow}
                disabled={(!isFree && game.stock <= 0)}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                <Zap className="w-4 h-4" />
                اشتري الآن
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Zap, title: 'تفعيل فوري', desc: 'استلم كود التفعيل خلال دقائق' },
          { icon: Shield, title: 'ضمان أصلي', desc: 'جميع الألعاب أصلية 100%' },
          { icon: Truck, title: 'دعم 24/7', desc: 'فريق دعم متاح على مدار الساعة' },
        ].map((f, i) => (
          <div key={i} className="card p-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center shrink-0">
              <f.icon className="w-6 h-6 text-accent-c" />
            </div>
            <div>
              <h3 className="font-bold text-primary-c text-sm">{f.title}</h3>
              <p className="text-xs text-secondary-c">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Related Games */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-extrabold text-primary-c mb-6">ألعاب مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((g) => (
              <GameCard key={g.id} game={g} onView={(s) => onNavigate('game', { slug: s })} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
