import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface ContactPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const { show } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      show('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    show('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: MessageCircle, label: 'واتساب', value: '0112 654 5452', dir: 'ltr' as const, href: 'https://wa.me/201126545452' },
    { icon: Phone, label: 'الهاتف', value: '0112 654 5452', dir: 'ltr' as const },
    { icon: Mail, label: 'البريد الإلكتروني', value: 'support@adamatia.eg', dir: 'ltr' as const },
    { icon: MapPin, label: 'العنوان', value: 'القاهرة، مصر', dir: 'rtl' as const },
    { icon: Clock, label: 'ساعات العمل', value: 'السبت - الخميس، 10ص - 10م', dir: 'rtl' as const },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-1.5 text-sm text-secondary-c hover:text-accent-c transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        العودة للرئيسية
      </button>

      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-glow)] flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-accent-c" />
        </div>
        <h1 className="text-3xl font-extrabold text-primary-c mb-2">تواصل معنا</h1>
        <p className="text-secondary-c max-w-md mx-auto">هل لديك سؤال أو استفسار؟ فريقنا جاهز لمساعدتك في أي وقت</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          {contactInfo.map((info, i) => (
            <div key={i} className="card p-5 flex items-center gap-4 hover:border-[var(--accent)] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center shrink-0">
                <info.icon className="w-6 h-6 text-accent-c" />
              </div>
              <div>
                <p className="text-xs text-secondary-c mb-0.5">{info.label}</p>
                {'href' in info && info.href ? (
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-accent-c hover:underline"
                    dir={info.dir}
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-sm font-bold text-primary-c" dir={info.dir}>{info.value}</p>
                )}
              </div>
            </div>
          ))}

          {/* Social */}
          <div className="card p-5">
            <p className="text-sm font-bold text-primary-c mb-3">تابعنا على</p>
            <div className="flex gap-3">
              {['Twitter', 'Facebook', 'Instagram', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex-1 text-center text-xs font-medium text-secondary-c py-2.5 rounded-lg border border-c hover:border-[var(--accent)] hover:text-accent-c transition-all"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6">
          <h2 className="font-bold text-primary-c text-lg mb-4">أرسل لنا رسالة</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-secondary-c mb-1.5 block">الاسم *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="اسمك"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-secondary-c mb-1.5 block">البريد الإلكتروني *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">الموضوع</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-field"
                placeholder="موضوع الرسالة"
              />
            </div>
            <div>
              <label className="text-sm text-secondary-c mb-1.5 block">الرسالة *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field min-h-[140px] resize-none"
                placeholder="اكتب رسالتك هنا..."
                required
              />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-50">
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  إرسال الرسالة
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
