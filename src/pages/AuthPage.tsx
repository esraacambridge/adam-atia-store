import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, ArrowLeft, Loader2, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Logo from '@/components/Logo';

interface AuthPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const { show } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
        show('تم تسجيل الدخول بنجاح', 'success');
        onNavigate('home');
      } else {
        if (!form.name.trim()) {
          show('يرجى إدخال الاسم', 'error');
          setLoading(false);
          return;
        }
        await signUp(form.email, form.password, form.name);
        show('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني.', 'success');
        setMode('login');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ';
      show(msg.includes('Invalid login') || msg.includes('credentials') ? 'بيانات غير صحيحة' : msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" onClick={() => onNavigate('home')} />
          </div>
          <h1 className="text-2xl font-extrabold text-primary-c mt-4">
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
          <p className="text-secondary-c text-sm mt-1">
            {mode === 'login' ? 'أهلاً بعودتك! سجل دخولك للمتابعة' : 'انضم لمتجر ADAM ATIA اليوم'}
          </p>
        </div>

        <div className="card p-6">
          {/* Mode Toggle */}
          <div className="flex bg-secondary-c rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-accent text-white' : 'text-secondary-c'
              }`}
            >
              دخول
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-accent text-white' : 'text-secondary-c'
              }`}
            >
              حساب جديد
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm text-secondary-c mb-1.5 block">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-c" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="أدخل اسمك"
                    className="input-field pr-10"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-c" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  className="input-field pr-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-c" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  إنشاء الحساب
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-4 text-sm text-secondary-c hover:text-accent-c transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </button>
        </div>

        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2 text-xs text-secondary-c">
            <Gamepad2 className="w-4 h-4 text-accent-c" />
            ADAM ATIA - متجر الألعاب الرقمية
          </div>
        </div>
      </div>
    </div>
  );
}
