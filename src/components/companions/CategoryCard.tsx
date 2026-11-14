import Link from 'next/link';
import {
  ShoppingBag,
  HeartHandshake,
  UtensilsCrossed,
  Sparkles,
  Compass,
  Ticket,
  Users,
  ArrowRight,
} from 'lucide-react';
import { ActivityCategory } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  HeartHandshake,
  UtensilsCrossed,
  Sparkles,
  Compass,
  Ticket,
  Users,
};

export function CategoryCard({ category }: { category: ActivityCategory }) {
  const Icon = ICON_MAP[category.icon] || Users;

  return (
    <Link href={`/companions?category=${category.slug}`} className="group block h-full">
      <Card className="h-full border border-transparent hover:border-black/20 bg-[#F6F6F6] hover:bg-neutral-100 transition-all rounded-xl overflow-hidden flex flex-col justify-between shadow-none">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-black">
                From {formatCurrency(category.baseRatePerHour)}/hr
              </span>
            </div>

            <h3 className="text-base font-bold text-black mb-1">
              {category.name}
            </h3>
            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
              {category.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs font-medium text-black">
            <span className="text-neutral-500 font-normal">{category.recommendedDuration}</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Book <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
