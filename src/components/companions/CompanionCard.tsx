import Link from 'next/link';
import { Star, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
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
    <Card className="rounded-2xl border border-charcoal-border hover:border-navy-300 hover:shadow-card transition-all duration-200 bg-white overflow-hidden flex flex-col justify-between group">
      <CardContent className="p-5">
        {/* Header: Avatar, Name, Rating, Online indicator (Airbnb styled) */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-navy-50 border border-charcoal-border overflow-hidden flex items-center justify-center text-lg font-bold text-navy-900 shrink-0">
              {companion.avatarUrl ? (
                <img
                  src={companion.avatarUrl}
                  alt={companion.fullName}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                companion.fullName.charAt(0)
              )}
            </div>
            {companion.isOnline && (
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-accent border-2 border-white shadow-subtle"
                title="Online & Ready for Bookings"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-navy-900 text-base truncate">{companion.fullName}</h4>
              {companion.isVerified && (
                <span title="Government ID Verified">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs text-charcoal-muted font-medium truncate mt-0.5">{companion.headline}</p>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-charcoal">
              <span className="flex items-center gap-1 font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded-full border border-charcoal-border">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {companion.ratingAverage.toFixed(1)}
              </span>
              <span className="text-charcoal-muted">({companion.ratingCount} reviews)</span>
              <span className="text-charcoal-muted">•</span>
              <span className="flex items-center gap-0.5 text-charcoal-muted">
                <MapPin className="h-3 w-3 text-[#2583E8]" /> {companion.city}
              </span>
            </div>
          </div>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-charcoal-muted line-clamp-2 mb-3.5 leading-relaxed">
          {companion.bio}
        </p>

        {/* Categories Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {companion.categories.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-[10px] px-2.5 py-0.5 capitalize bg-navy-50 text-navy-900 border-charcoal-border">
              {cat.replace('-', ' ')}
            </Badge>
          ))}
          {companion.categories.length > 3 && (
            <span className="text-[10px] text-charcoal-muted font-medium">+{companion.categories.length - 3} more</span>
          )}
        </div>

        {/* Footer: Rate & Action */}
        <div className="pt-3.5 border-t border-charcoal-border flex items-center justify-between">
          <div>
            <span className="text-[10px] text-charcoal-muted block uppercase font-bold tracking-wider">Rate</span>
            <span className="text-base font-bold text-navy-900">
              {formatCurrency(companion.hourlyRate)}
              <span className="text-xs font-normal text-charcoal-muted">/hr</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/companions/${companion.id}`}>
              <Button variant="outline" size="sm" className="text-xs font-semibold h-9">
                Profile
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => onBook?.(companion)}
              className="bg-yellow-400 hover:bg-yellow-500 text-navy-900 text-xs font-bold h-9 gap-1 shadow-subtle"
            >
              Book Now <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
