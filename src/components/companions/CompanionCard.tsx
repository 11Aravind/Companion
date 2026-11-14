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
    <Card className="rounded-xl border border-[#EEEEEE] hover:border-black/30 hover:shadow-md transition-all duration-200 bg-white overflow-hidden flex flex-col justify-between group">
      <CardContent className="p-5">
        {/* Header: Avatar, Name, Rating, Online indicator */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-[#F6F6F6] border border-[#EEEEEE] overflow-hidden flex items-center justify-center text-lg font-bold text-black shrink-0">
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
                className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white"
                title="Online"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-black text-base truncate">{companion.fullName}</h4>
              {companion.isVerified && (
                <span title="Verified">
                  <ShieldCheck className="h-4 w-4 text-black shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-500 font-normal truncate mt-0.5">{companion.headline}</p>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-black">
              <span className="flex items-center gap-1 font-bold text-black bg-[#F6F6F6] px-2 py-0.5 rounded-md">
                <Star className="h-3 w-3 fill-black text-black" />
                {companion.ratingAverage.toFixed(1)}
              </span>
              <span className="text-neutral-500">({companion.ratingCount})</span>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-0.5 text-neutral-500">
                <MapPin className="h-3 w-3 text-black" /> {companion.city}
              </span>
            </div>
          </div>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-neutral-600 line-clamp-2 mb-3.5 leading-relaxed font-normal">
          {companion.bio}
        </p>

        {/* Categories Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {companion.categories.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-[11px] px-2.5 py-0.5 capitalize bg-[#F6F6F6] text-black border-transparent font-medium rounded-md">
              {cat.replace('-', ' ')}
            </Badge>
          ))}
          {companion.categories.length > 3 && (
            <span className="text-[11px] text-neutral-400 font-normal">+{companion.categories.length - 3}</span>
          )}
        </div>

        {/* Footer: Rate & Action */}
        <div className="pt-3.5 border-t border-[#EEEEEE] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 block uppercase font-bold tracking-wider">Rate</span>
            <span className="text-base font-bold text-black">
              {formatCurrency(companion.hourlyRate)}
              <span className="text-xs font-normal text-neutral-500">/hr</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/companions/${companion.id}`}>
              <Button variant="ghost" size="sm" className="text-xs font-medium h-9 rounded-full bg-[#F6F6F6] text-black hover:bg-[#EEEEEE]">
                Profile
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => onBook?.(companion)}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-medium h-9 rounded-full gap-1"
            >
              Book <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
