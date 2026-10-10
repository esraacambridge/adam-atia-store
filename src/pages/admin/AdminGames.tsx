import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Search, ArrowLeft, Loader2, Package } from 'lucide-react';
import { fetchAllGames, fetchCategories, createGame, updateGame, deleteGame } from '@/lib/api';
import type { Game, Category } from '@/lib/types';
import { formatEGP } from '@/lib/format';
import { useToast } from '@/contexts/ToastContext';

interface AdminGamesProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminGames({ onNavigate }: AdminGamesProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [g, c] = await Promise.all([fetchAllGames(), fetchCategories()]);
      setGames(g);
      setCategories(c);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (gameData: Partial<Game>) => {
    try {
      if (editingGame) {
        await updateGame(editingGame.id, gameData);
        show('تم تحديث اللعبة بنجاح', 'success');
      } else {
        await createGame(gameData);
        show('تم إضافة اللعبة بنجاح', 'success');
      }
      setShowForm(false);
      setEditingGame(null);
      loadData();
    } catch {
      show('حدث خطأ أثناء الحفظ', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه اللعبة؟')) return;
    try {
      await deleteGame(id);
      show('تم حذف اللعبة', 'success');
      loadData();
    } catch {
      show('حدث خطأ أثناء الحذف', 'error');
    }
  };

  const filtered = games.filter((g) => g.title.includes(search) || g.slug.includes(search));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-c flex items-center gap-2">
            <Package className="w-7 h-7 text-accent-c" />
            إدارة الألعاب
          </h1>
          <p className="text-secondary-c text-sm mt-1">{games.length} لعبة في المتجر</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('admin')} className="btn-ghost border border-c">
            <ArrowLeft className="w-4 h-4" />
            لوحة التحكم
          </button>
          <button
            onClick={() => { setEditingGame(null); setShowForm(true); }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            إضافة لعبة
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-c" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن لعبة..."
          className="input-field pr-10"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="card p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-secondary-c rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-c text-right">
                  <th className="p-4 text-sm font-semibold text-secondary-c">اللعبة</th>
                  <th className="p-4 text-sm font-semibold text-secondary-c">الفئة</th>
                  <th className="p-4 text-sm font-semibold text-secondary-c">السعر</th>
                  <th className="p-4 text-sm font-semibold text-secondary-c">المخزون</th>
                  <th className="p-4 text-sm font-semibold text-secondary-c">الحالة</th>
                  <th className="p-4 text-sm font-semibold text-secondary-c text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((game) => (
                  <tr key={game.id} className="border-b border-c hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-c shrink-0">
                          <img src={game.image_url || ''} alt={game.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-primary-c truncate">{game.title}</p>
                          <p className="text-xs text-secondary-c">{game.platform}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-secondary-c">{game.category?.name || '—'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-accent-c">{game.price === 0 ? 'مجاني' : formatEGP(game.price)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-semibold ${game.stock <= 0 ? 'text-red-400' : game.stock <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {game.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${game.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                        {game.is_active ? 'متاح' : 'مخفي'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setEditingGame(game); setShowForm(true); }}
                          className="w-8 h-8 rounded-lg bg-secondary-c text-accent-c hover:bg-[var(--accent-glow)] transition-colors flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(game.id)}
                          className="w-8 h-8 rounded-lg bg-secondary-c text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[var(--border)]">
            {filtered.map((game) => (
              <div key={game.id} className="p-4 flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-c shrink-0">
                  <img src={game.image_url || ''} alt={game.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary-c truncate">{game.title}</p>
                  <p className="text-xs text-secondary-c">{game.category?.name} • {game.platform}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-accent-c">{game.price === 0 ? 'مجاني' : formatEGP(game.price)}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${game.stock <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      مخزون: {game.stock}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setEditingGame(game); setShowForm(true); }}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-secondary-c text-accent-c flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3" /> تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-secondary-c text-red-400 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-secondary-c mx-auto mb-3" />
              <p className="text-secondary-c">لا توجد ألعاب</p>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <GameForm
          game={editingGame}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingGame(null); }}
        />
      )}
    </div>
  );
}

function GameForm({ game, categories, onSave, onClose }: {
  game: Game | null;
  categories: Category[];
  onSave: (data: Partial<Game>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: game?.title || '',
    slug: game?.slug || '',
    description: game?.description || '',
    price: game?.price?.toString() || '0',
    original_price: game?.original_price?.toString() || '',
    category_id: game?.category_id || '',
    image_url: game?.image_url || '',
    platform: game?.platform || 'PC',
    rating: game?.rating?.toString() || '5',
    stock: game?.stock?.toString() || '0',
    is_featured: game?.is_featured || false,
    is_active: game?.is_active ?? true,
    publisher: game?.publisher || '',
    developer: game?.developer || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    await onSave({
      ...form,
      slug,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      rating: Number(form.rating),
      stock: Number(form.stock),
      category_id: form.category_id || null,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-c">{game ? 'تعديل لعبة' : 'إضافة لعبة جديدة'}</h2>
          <button onClick={onClose} className="text-secondary-c hover:text-primary-c">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">اسم اللعبة *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">المعرّف (slug)</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="input-field" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="text-sm text-secondary-c mb-1.5 block">الوصف</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" />
          </div>

          <div>
            <label className="text-sm text-secondary-c mb-1.5 block">رابط الصورة</label>
            <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" dir="ltr" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">السعر (ج.م) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" min="0" required />
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">السعر الأصلي</label>
              <input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className="input-field" min="0" />
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">المخزون *</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" min="0" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">الفئة</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field cursor-pointer">
                <option value="">بدون فئة</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">المنصة</label>
              <input type="text" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-field" placeholder="PC, PS5, Xbox" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">الناشر</label>
              <input type="text" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">المطور</label>
              <input type="text" value={form.developer} onChange={(e) => setForm({ ...form, developer: e.target.value })} className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-sm text-secondary-c mb-1.5 block">التقييم (1-5)</label>
            <input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input-field" min="1" max="5" step="0.1" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-[var(--accent)]" />
              <span className="text-sm text-primary-c">لعبة مميزة</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-[var(--accent)]" />
              <span className="text-sm text-primary-c">متاح للعرض</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {game ? 'حفظ التعديلات' : 'إضافة اللعبة'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}
