import { Mail, MapPin, MessageCircle } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-secondary-c border-t border-c mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-secondary-c leading-relaxed max-w-sm">
              ADAM ATIA - متجرك الأول لشراء الألعاب الرقمية في مصر. أحدث الألعاب بأفضل الأسعار، توصيل فوري ودفع آمن بالجنيه المصري.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {['Twitter', 'Facebook', 'Instagram', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-c bg-card-c text-secondary-c hover:text-accent-c hover:border-[var(--accent)] transition-all duration-200 text-xs font-bold"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary-c mb-4 text-sm">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'الرئيسية', page: 'home' },
                { label: 'المتجر', page: 'shop' },
                { label: 'الأكثر مبيعاً', page: 'shop', params: { sort: 'rating' } },
                { label: 'تواصل معنا', page: 'contact' },
                { label: 'لوحة التحكم', page: 'admin' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.page, link.params)}
                    className="text-sm text-secondary-c hover:text-accent-c transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary-c mb-4 text-sm">تواصل معنا</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/201126545452"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-secondary-c hover:text-accent-c transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-accent-c shrink-0" />
                  <span dir="ltr">0112 654 5452</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-secondary-c">
                <Mail className="w-4 h-4 text-accent-c shrink-0" />
                <span dir="ltr">support@adamatia.eg</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-secondary-c">
                <MapPin className="w-4 h-4 text-accent-c shrink-0" />
                <span>القاهرة، مصر</span>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="flex items-center gap-2.5 text-sm text-accent-c hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>صفحة التواصل</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-c flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-secondary-c">
            © 2026 ADAM ATIA. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-xs text-secondary-c">
            <a href="#" className="hover:text-accent-c transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-accent-c transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
