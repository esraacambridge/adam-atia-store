import { useEffect, useState, useMemo } from 'react';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import GameCard from '@/components/GameCard';
import { fetchGames, fetchCategories } from '@/lib/api';
import type { Game, Category } from '@/lib/types';

interface ShopPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  initialSearch?: string | undefined;
  initialCategory?: string | undefined;
  initialSort?: string | undefined;
}

export default function ShopPage({ onNavigate, initialSearch, initialCategory, initialSort }: ShopPageProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [sort, setSort] = useState(initialSort || 'featured');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [platform, setPlatform] = useState('all');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchGames({
      categoryId: selectedCategory || undefined,
      search: search || undefined,
      maxPrice,
      platform: platform !== 'all' ? platform : undefined,
      sort,
    })
      .then(setGames)
      .finally(() => setLoading(false));
  }, [search, selectedCategory, sort, maxPrice, platform]);

  const platforms = useMemo(() => ['all', 'PC', 'PS5', 'Xbox', 'Switch'], []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary-c mb-2">متجر الألعاب</h1>
        <p className="text-secondary-c text-sm">اكتشف مجموعتنا الكاملة من الألعاب الرقمية</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-c" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن لعبة..."
            className="input-field pr-10"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field sm:w-48 cursor-pointer"
        >
          <option value="featured">المميزة أولاً</option>
          <option value="newest">الأحدث</option>
          <option value="price_asc">السعر: من الأقل</option>
          <option value="price_desc">السعر: من الأعلى</option>
          <option value="rating">الأعلى تقييماً</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary sm:w-auto"
        >
          <SlidersHorizontal className="w-4 h-4" />
          فلترة
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside
          className={`${
            showFilters ? 'fixed inset-0 z-50 bg-black/50 lg:bg-transparent lg:static lg:z-auto' : 'hidden lg:block'
          } lg:w-64 shrink-0`}
        >
          <div
            className={`${
              showFilters ? 'absolute bottom-0 right-0 left-0 lg:static lg:rounded-2xl' : ''
            } card p-5 space-y-6 max-h-[80vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="font-bold text-primary-c">الفلاتر</h3>
              <button onClick={() => setShowFilters(false)} className="text-secondary-c">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-primary-c text-sm mb-3">الفئات</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all ${
                    !selectedCategory
                      ? 'bg-[var(--accent-glow)] text-accent-c font-semibold'
                      : 'text-secondary-c hover:text-primary-c hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  جميع الفئات
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-[var(--accent-glow)] text-accent-c font-semibold'
                        : 'text-secondary-c hover:text-primary-c hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-bold text-primary-c text-sm mb-3">السعر الأقصى</h3>
              <input
                type="range"
                min={0}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-xs text-secondary-c mt-1">
                <span>0 ج.م</span>
                <span className="font-bold text-accent-c">{maxPrice} ج.م</span>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-bold text-primary-c text-sm mb-3">المنصة</h3>
              <div className="space-y-1.5">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all ${
                      platform === p
                        ? 'bg-[var(--accent-glow)] text-accent-c font-semibold'
                        : 'text-secondary-c hover:text-primary-c hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {p === 'all' ? 'جميع المنصات' : p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory(null);
                setSort('featured');
                setMaxPrice(1000);
                setPlatform('all');
                setSearch('');
              }}
              className="w-full btn-ghost border border-c"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        </aside>

        {/* Games Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-secondary-c">
              {loading ? 'جاري التحميل...' : `${games.length} لعبة`}
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
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
          ) : games.length === 0 ? (
            <div className="card p-12 text-center">
              <Search className="w-12 h-12 text-secondary-c mx-auto mb-3" />
              <p className="text-secondary-c">لا توجد ألعاب مطابقة لبحثك</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} onView={(slug) => onNavigate('game', { slug })} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
