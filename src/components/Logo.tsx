import { Gamepad2 } from 'lucide-react';

interface LogoProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ onClick, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-base' },
    md: { icon: 'w-9 h-9', text: 'text-lg' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
  };
  const s = sizes[size];

  return (
    <button onClick={onClick} className="flex items-center gap-2.5 group">
      <div className={`${s.icon} rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform shrink-0`}>
        <Gamepad2 className="w-1/2 h-1/2 text-white" />
      </div>
      <div className="flex flex-col items-start">
        <span className={`${s.text} font-extrabold text-primary-c leading-none tracking-tight`}>
          ADAM <span className="text-accent-c">ATIA</span>
        </span>
        <span className="text-[10px] text-secondary-c font-medium tracking-wide">متجر الألعاب الرقمية</span>
      </div>
    </button>
  );
}
