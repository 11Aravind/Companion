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
      <Card className="h-full border border-charcoal-border hover:border-navy-900 hover:shadow-card transition-all duration-200 bg-white rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-navy-50 text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors flex items-center justify-center border border-charcoal-border">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-navy-900 bg-navy-50 px-2.5 py-1 rounded-full border border-charcoal-border">
                From {formatCurrency(category.baseRatePerHour)}/hr
              </span>
            </div>

            <h3 className="text-base font-bold text-navy-900 mb-1.5 group-hover:text-navy-900 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-charcoal-border flex items-center justify-between text-xs font-bold text-navy-900">
            <span className="text-charcoal-muted font-normal">{category.recommendedDuration}</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore <ArrowRight className="h-3.5 w-3.5 text-accent" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
