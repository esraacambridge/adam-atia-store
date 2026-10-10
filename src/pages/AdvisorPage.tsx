import { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { recommendGames, type RecommendationResult } from '@/lib/recommend.functions';
import { fetchGames } from '@/lib/api';
import type { Game } from '@/lib/types';
import GameCard from '@/components/GameCard';

const PLATFORMS = ['', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

export default function AdvisorPage({ onNavigate }: { onNavigate: (page: string, params?: Record<string, string>) => void }) {
  const recommend = useServerFn(recommendGames);
  const [preferences, setPreferences] = useState('');
  const [platform, setPlatform] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames().then(setGames).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.trim().length < 3 || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const b = budget.trim() ? Number(budget) : null;
      const res = await recommend({ data: { preferences, platform, budget: b != null && !isNaN(b) ? b : null } });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'حصلت مشكلة، حاول تاني.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-accent-c text-sm mb-4">
          <Sparkles className="w-4 h-4" /> مستشار الألعاب الذكي
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-3">قولنا بتحب إيه، وإحنا نختارلك</h1>
        <p className="text-muted-foreground">اوصف نوع الألعاب اللي بتحبها، واختار منصتك وميزانيتك، وهنرشحلك من كتالوج المتجر.</p>
      </div>

      <form onSubmit={submit} className="card p-6 max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">بتحب أنهي نوع ألعاب؟</label>
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="مثلاً: بحب ألعاب العالم المفتوح والقصة الحلوة، زي GTA وRed Dead..."
            className="w-full rounded-xl bg-background border border-border p-3 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">المنصة</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-xl bg-background border border-border p-3">
              {PLATFORMS.map((p) => <option key={p} value={p}>{p || 'أي منصة'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">الميزانية القصوى (جنيه)</label>
            <input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="مثلاً 1500"
              className="w-full rounded-xl bg-background border border-border p-3" />
          </div>
        </div>
        <button type="submit" disabled={loading || preferences.trim().length < 3} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> بنختارلك...</> : <><Sparkles className="w-5 h-5" /> اقترح عليّا</>}
        </button>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </form>

      {result && (
        <div className="mt-12">
          {result.intro && <p className="text-center text-lg mb-8">{result.intro}</p>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {result.picks.map((p) => {
              const g = games.find((x) => x.slug === p.slug);
              if (!g) return null;
              return (
                <div key={p.slug} className="space-y-3">
                  <GameCard game={g} onView={(slug) => onNavigate('game', { slug })} />
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
