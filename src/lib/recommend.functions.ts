import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const InputSchema = z.object({
  preferences: z.string().trim().min(3).max(1000),
  platform: z.string().trim().max(50),
  budget: z.number().min(0).max(100000).nullable(),
});

export interface RecommendationResult {
  intro: string;
  picks: { slug: string; reason: string }[];
}

export const recommendGames = createServerFn({ method: 'POST' })
  .validator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<RecommendationResult> => {
    const { createClient } = await import('@supabase/supabase-js');
    const { createOpenAI } = await import('@ai-sdk/openai');
    const { streamText } = await import('ai');

    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) throw new Error('خدمة الاقتراحات غير متاحة حالياً.');

    const sb = createClient(process.env['SUPABASE_URL']!, process.env['SUPABASE_PUBLISHABLE_KEY']!, {
      auth: { persistSession: false },
    });
    const { data: games, error } = await sb
      .from('games')
      .select('slug,title,description,price,platform,rating,category:categories(name)')
      .eq('is_active', true);
    if (error) { console.error('catalog error', error); throw new Error('تعذر تحميل كتالوج المتجر.'); }

    const catalog = (games ?? []).map((g: any) => ({
      slug: g.slug,
      title: g.title,
      category: g.category?.name ?? null,
      platform: g.platform,
      price_egp: g.price,
      rating: g.rating,
      description: (g.description ?? '').slice(0, 160),
    }));

    const provider = createOpenAI({
      baseURL: 'https://ai.gateway.lovable.dev/v1',
      apiKey,
      headers: { 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
    });

    const system = `أنت مساعد متجر ألعاب رقمية مصري اسمه ADAM ATIA. اقترح من 1 إلى 4 ألعاب فقط من الكتالوج المرفق تناسب العميل.
قواعد: استخدم فقط slugs موجودة في الكتالوج. احترم الميزانية (السعر بالجنيه المصري) والمنصة إن حُددت. اكتب بالعربية المصرية بإيجاز.
أعد JSON فقط بدون أي نص آخر بالشكل: {"intro":"جملة قصيرة","picks":[{"slug":"...","reason":"سبب قصير (أقل من 25 كلمة)"}]}
لو لا توجد لعبة مناسبة أعد picks فارغة واشرح في intro.`;

    const prompt = `الكتالوج:\n${JSON.stringify(catalog)}\n\nتفضيلات العميل: ${data.preferences}\nالمنصة: ${data.platform || 'أي منصة'}\nالميزانية القصوى: ${data.budget != null ? `${data.budget} جنيه` : 'غير محددة'}`;

    try {
      const result = streamText({
        model: provider.responses('openai/gpt-6-astra'),
        system,
        prompt,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: 'low',
            reasoningSummary: 'auto',
            store: false,
            include: ['reasoning.encrypted_content'],
          },
        },
      });
      const text = await result.text;
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : { intro: text, picks: [] };
      const valid = new Set(catalog.map((c) => c.slug));
      const picks = (Array.isArray(parsed.picks) ? parsed.picks : [])
        .filter((p: any) => p && valid.has(p.slug))
        .slice(0, 4)
        .map((p: any) => ({ slug: String(p.slug), reason: String(p.reason ?? '') }));
      return { intro: String(parsed.intro ?? ''), picks };
    } catch (e: any) {
      const status = e?.statusCode ?? e?.status;
      if (status === 429) throw new Error('ضغط كبير على الخدمة، حاول بعد قليل.');
      if (status === 402) throw new Error('رصيد خدمة الذكاء الاصطناعي نفد حالياً.');
      console.error('recommendGames failed', e);
      throw new Error('حصلت مشكلة أثناء تجهيز الاقتراحات، حاول تاني.');
    }
  });
