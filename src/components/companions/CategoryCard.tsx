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
    <Link href={`/companions?category=${category.slug}`} className="group block">
      <Card className="h-full border border-slate-200/90 hover:border-primary-500/50 hover:shadow-md transition-all duration-200 bg-white group-hover:-translate-y-1 rounded-2xl overflow-hidden">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-navy-50 text-navy-900 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                From {formatCurrency(category.baseRatePerHour)}/hr
              </span>
            </div>

            <h3 className="text-base font-bold text-navy-950 mb-1.5 group-hover:text-primary-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-600">
            <span>{category.recommendedDuration}</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

