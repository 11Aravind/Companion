import Link from 'next/link';
import { Star, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { CompanionProfile } from '@/types/companion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export function CompanionCard({
  companion,
  onBook,
}: {
  companion: CompanionProfile;
  onBook?: (companion: CompanionProfile) => void;
}) {
  return (
    <Card className="rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all bg-white overflow-hidden flex flex-col justify-between">
      <CardContent className="p-5">
        {/* Header: Avatar, Name, Rating, Online indicator */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-lg font-bold text-navy-900 shrink-0">
              {companion.avatarUrl ? (
                <img
                  src={companion.avatarUrl}
                  alt={companion.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                companion.fullName.charAt(0)
              )}
            </div>
            {companion.isOnline && (
              <span
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
                title="Online & Ready for Bookings"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-navy-950 text-base truncate">{companion.fullName}</h4>
              {companion.isVerified && (
                <span title="Government ID Verified">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{companion.headline}</p>

            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {companion.ratingAverage.toFixed(1)}
              </span>
              <span>({companion.ratingCount} reviews)</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-slate-500">
                <MapPin className="h-3 w-3" /> {companion.city}
              </span>
            </div>
          </div>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {companion.bio}
        </p>

        {/* Categories Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {companion.categories.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-[10px] px-2 py-0.5 capitalize bg-slate-100 text-slate-700">
              {cat.replace('-', ' ')}
            </Badge>
          ))}
          {companion.categories.length > 3 && (
            <span className="text-[10px] text-slate-400">+{companion.categories.length - 3} more</span>
          )}
        </div>

        {/* Footer: Rate & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Hourly Rate</span>
            <span className="text-base font-bold text-navy-950">
              {formatCurrency(companion.hourlyRate)}
              <span className="text-xs font-normal text-slate-500">/hr</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/companions/${companion.id}`}>
              <Button variant="outline" size="sm" className="text-xs font-medium h-9">
                Profile
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => onBook?.(companion)}
              className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold h-9 gap-1"
            >
              Book Now <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

