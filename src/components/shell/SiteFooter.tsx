import Link from 'next/link';
import { HeartHandshake, ShieldCheck, Lock, Award } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-charcoal-border bg-[#F7F8FA] py-12 text-charcoal-muted">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-900 text-white">
                <HeartHandshake className="h-4 w-4 text-accent" />
              </div>
              <span className="text-lg font-bold text-navy-900">Companion</span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Safe, verified, professional personal companion booking for hospital visits, shopping, dining, travel, and social events.
            </p>
          </div>

          {/* Activities Col */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 mb-3 uppercase tracking-wider">Activities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/companions?category=hospital-visit" className="hover:text-navy-900 transition-colors">Hospital Visits</Link></li>
              <li><Link href="/companions?category=shopping" className="hover:text-navy-900 transition-colors">Shopping Assistant</Link></li>
              <li><Link href="/companions?category=restaurant-dining" className="hover:text-navy-900 transition-colors">Restaurant & Dining</Link></li>
              <li><Link href="/companions?category=travel-city-tour" className="hover:text-navy-900 transition-colors">Travel & City Tours</Link></li>
              <li><Link href="/companions?category=events-social" className="hover:text-navy-900 transition-colors">Events & Social</Link></li>
            </ul>
          </div>

          {/* Trust & Safety Col */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 mb-3 uppercase tracking-wider">Trust & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Government ID Verified</li>
              <li className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-[#2583E8]" /> Private Live GPS Tracking</li>
              <li className="flex items-center gap-1.5"><Award className="h-4 w-4 text-amber-500" /> Community Reviews</li>
              <li><Link href="/safety" className="hover:text-navy-900 transition-colors">Safety Guidelines</Link></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 mb-3 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login?role=companion" className="hover:text-navy-900 transition-colors">Companion Portal</Link></li>
              <li><Link href="/login?role=admin" className="hover:text-navy-900 transition-colors">Admin Operations</Link></li>
              <li><Link href="/terms" className="hover:text-navy-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-navy-900 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted">
          <p>© {new Date().getFullYear()} Companion Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for security, empathy, and professional presence.</p>
        </div>
      </div>
    </footer>
  );
}
