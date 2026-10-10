import { useEffect, useState } from 'react';
import { Zap, TrendingUp, Shield, Truck, Star, ArrowLeft, Gamepad2, Sparkles, Flame, Tag, Crown } from 'lucide-react';
import GameCard from '@/components/GameCard';
import { fetchFeaturedGames, fetchGames, fetchCategories, fetchBestSellers, fetchOnSaleGames, fetchOffers } from '@/lib/api';
import type { Game, Category, Offer } from '@/lib/types';
import { formatEGP } from '@/lib/format';
import adamPortrait from '@/assets/adam-portrait.jpg.asset.json';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featured, setFeatured] = useState<Game[]>([]);
  const [bestSellers, setBestSellers] = useState<Game[]>([]);
  const [onSale, setOnSale] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFeaturedGames(), fetchGames(), fetchCategories(), fetchBestSellers(), fetchOnSaleGames(), fetchOffers()])
      .then(([feat, all, cats, best, sale, off]) => {
        setFeatured(feat);
        setBestSellers(best);
        setOnSale(sale);
        setCategories(cats);
        setOffers(off);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section with ADAM ATIA portrait */}
      <section className="relative min-h-[90vh] overflow-hidden -mt-[72px] mb-16">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d18] to-[var(--bg-primary)]" />
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          }} />
          {/* Glow orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 min-h-[90vh] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
            {/* Text Side */}
            <div className="order-2 lg:order-1 text-center lg:text-right animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-accent-c" />
                <span className="text-accent-c text-sm font-bold">متجر الألعاب الرقمية الأول في مصر</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-4 leading-tight">
                ADAM <span className="text-accent-c glow-text">ATIA</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mr-0 leading-relaxed">
                اكتشف مكتبة ضخمة من الألعاب الرقمية. أحدث الإصدارات، أفضل الأسعار بالجنيه المصري، وتوصيل فوري.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                <button onClick={() => onNavigate('shop')} className="btn-primary text-base px-8 py-3.5">
                  ابدأ التسوق
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('shop', { sort: 'rating' })}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                >
                  الأكثر مبيعاً
                </button>
              </div>
              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6">
                {[
                  { value: '+500', label: 'لعبة' },
                  { value: '+10K', label: 'لاعب' },
                  { value: '4.8', label: 'تقييم' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-extrabold text-accent-c">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Portrait Side */}
            <div className="order-1 lg:order-2 flex justify-center mb-8 lg:mb-0">
              <div className="relative">
                {/* Rotating ring */}
                <div className="absolute inset-0 -m-4 rounded-full border-2 border-dashed border-accent/30 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-0 -m-8 rounded-full border border-accent/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />

                {/* Portrait container */}
                <div className="relative w-64 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden glow-box animate-float">
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/30 via-transparent to-blue-500/20 z-10" />
                  <img
                    src={adamPortrait.url}
                    alt="ADAM ATIA"
                    className="w-full h-full object-cover"
                  />
                  {/* Scan line effect */}
                  <div className="absolute inset-0 z-20 pointer-events-none" style={{
                    background: 'linear-gradient(180deg, transparent 0%, transparent 49%, rgba(0,217,255,0.15) 50%, transparent 51%, transparent 100%)',
                    backgroundSize: '100% 8px',
                    animation: 'shimmer 3s linear infinite',
                  }} />
                </div>

                {/* Floating badges */}
                <div className="absolute -top-3 -right-3 bg-accent text-white px-4 py-2 rounded-xl shadow-lg shadow-accent/30 animate-pulse-glow">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4" />
                    <span className="text-xs font-bold">الأفضل في مصر</span>
                  </div>
                </div>
                <div className="absolute -bottom-3 -left-3 bg-card-c border border-c px-4 py-2 rounded-xl shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-accent-c" />
                    <span className="text-xs font-bold text-primary-c">توصيل فوري</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
      </section>

      {/* Features Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Zap, title: 'توصيل فوري', desc: 'استلم لعبتك خلال دقائق' },
            { icon: Shield, title: 'دفع آمن', desc: 'حماية كاملة لبياناتك' },
            { icon: Truck, title: 'شحن مجاني', desc: 'للطلبات فوق 500 ج.م' },
            { icon: TrendingUp, title: 'أفضل الأسعار', desc: 'بالجنيه المصري' },
          ].map((f, i) => (
            <div key={i} className="card p-5 flex items-center gap-3 hover:border-[var(--accent)] transition-colors">
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
      </section>

      {/* Offers Banner */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offers.slice(0, 2).map((offer) => (
              <div key={offer.id} className="relative card overflow-hidden p-6 group cursor-pointer hover:border-[var(--accent)] transition-all" onClick={() => onNavigate('shop')}>
                <div className="absolute inset-0 bg-gradient-to-l from-accent/10 to-transparent" />
                {offer.image_url && (
                  <div className="absolute left-0 top-0 bottom-0 w-32 opacity-30">
                    <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                    <Tag className="w-7 h-7 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-primary-c text-lg">{offer.title}</h3>
                    <p className="text-sm text-secondary-c line-clamp-1">{offer.description}</p>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-3xl font-extrabold text-red-400">{offer.discount_percent}%</p>
                    <p className="text-xs text-secondary-c">خصم</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-primary-c">تصفح حسب الفئة</h2>
            <button onClick={() => onNavigate('shop')} className="text-sm text-accent-c hover:underline flex items-center gap-1">
              عرض الكل <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('shop', { category: cat.slug })}
                className="card p-5 flex flex-col items-center gap-2 hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-accent-c" />
                </div>
                <span className="text-sm font-semibold text-primary-c">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-primary-c flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            الأكثر مبيعاً
          </h2>
          <button onClick={() => onNavigate('shop', { sort: 'rating' })} className="text-sm text-accent-c hover:underline flex items-center gap-1">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-secondary-c" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-secondary-c rounded w-3/4" />
                  <div className="h-3 bg-secondary-c rounded w-1/2" />
                  <div className="h-6 bg-secondary-c rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.slice(0, 4).map((game) => (
              <GameCard key={game.id} game={game} onView={(slug) => onNavigate('game', { slug })} />
            ))}
          </div>
        )}
      </section>

      {/* On Sale Games */}
      {onSale.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-primary-c flex items-center gap-2">
              <Tag className="w-6 h-6 text-red-400" />
              عروض وتخفيضات
            </h2>
            <button onClick={() => onNavigate('shop')} className="text-sm text-accent-c hover:underline flex items-center gap-1">
              عرض الكل <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {onSale.slice(0, 4).map((game) => (
              <GameCard key={game.id} game={game} onView={(slug) => onNavigate('game', { slug })} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Games */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-primary-c flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent-c" />
            الألعاب المميزة
          </h2>
          <button onClick={() => onNavigate('shop')} className="text-sm text-accent-c hover:underline flex items-center gap-1">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.slice(0, 4).map((game) => (
            <GameCard key={game.id} game={game} onView={(slug) => onNavigate('game', { slug })} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="relative card overflow-hidden p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
          <div className="relative">
            <Gamepad2 className="w-16 h-16 text-accent-c mx-auto mb-4 animate-float" />
            <h2 className="text-3xl font-extrabold text-primary-c mb-3">انضم لآلاف اللاعبين</h2>
            <p className="text-secondary-c mb-6 max-w-md mx-auto">
              اكتشف مكتبة ضخمة من الألعاب الرقمية بأفضل الأسعار في مصر
            </p>
            <button onClick={() => onNavigate('shop')} className="btn-primary">
              ابدأ التسوق الآن
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
