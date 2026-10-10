import { Star, ShoppingCart, Zap } from 'lucide-react';
import type { Game } from '@/lib/types';
import { formatEGP } from '@/lib/format';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

interface GameCardProps {
  game: Game;
  onView: (slug: string) => void;
}

export default function GameCard({ game, onView }: GameCardProps) {
  const { addToCart } = useCart();
  const { show } = useToast();
  const discount = game.original_price && game.original_price > game.price
    ? Math.round(((game.original_price - game.price) / game.original_price) * 100)
    : 0;
  const isFree = game.price === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(game);
    show(`تمت إضافة "${game.title}" إلى السلة`, 'success');
  };

  return (
    <div
      onClick={() => onView(game.slug)}
      className="group card overflow-hidden cursor-pointer hover:border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary-c">
        <img
          src={game.image_url || ''}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
              خصم {discount}%
            </span>
          )}
          {isFree && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
              مجاني
            </span>
          )}
          {game.is_featured && !isFree && (
            <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <Zap className="w-3 h-3" />
              مميز
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-bold">{game.rating.toFixed(1)}</span>
        </div>

        {/* Platform */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-md">
            {game.platform}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-primary-c text-sm mb-1 line-clamp-1 group-hover:text-accent-c transition-colors">
          {game.title}
        </h3>
        {game.category && (
          <p className="text-xs text-secondary-c mb-3">{game.category.name}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {isFree ? (
              <span className="text-lg font-extrabold text-emerald-500">مجاني</span>
            ) : (
              <>
                <span className="text-lg font-extrabold text-accent-c">{formatEGP(game.price)}</span>
                {game.original_price && game.original_price > game.price && (
                  <span className="text-xs text-secondary-c line-through">{formatEGP(game.original_price)}</span>
                )}
              </>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={game.stock <= 0 && !isFree}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark text-white flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="أضف إلى السلة"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {!isFree && game.stock <= 5 && game.stock > 0 && (
          <p className="text-xs text-orange-400 mt-2 font-medium">باقي {game.stock} قطع فقط!</p>
        )}
        {!isFree && game.stock <= 0 && (
          <p className="text-xs text-red-400 mt-2 font-medium">نفذت الكمية</p>
        )}
      </div>
    </div>
  );
}
