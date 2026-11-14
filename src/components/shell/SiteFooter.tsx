import Link from 'next/link';
import { HeartHandshake, ShieldCheck, Lock, Award } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
                <HeartHandshake className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-navy-950">Companion</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Safe, verified, professional personal companion booking for hospital visits, shopping, dining, travel, and social events.
            </p>
          </div>

          {/* Activities Col */}
          <div>
            <h4 className="text-sm font-semibold text-navy-950 mb-3 uppercase tracking-wider">Activities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/companions?category=hospital-visit" className="hover:text-primary-600">Hospital Visits</Link></li>
              <li><Link href="/companions?category=shopping" className="hover:text-primary-600">Shopping Assistant</Link></li>
              <li><Link href="/companions?category=restaurant-dining" className="hover:text-primary-600">Restaurant & Dining</Link></li>
              <li><Link href="/companions?category=travel-city-tour" className="hover:text-primary-600">Travel & City Tours</Link></li>
              <li><Link href="/companions?category=events-social" className="hover:text-primary-600">Events & Social</Link></li>
            </ul>
          </div>

          {/* Trust & Safety Col */}
          <div>
            <h4 className="text-sm font-semibold text-navy-950 mb-3 uppercase tracking-wider">Trust & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Government ID Verified</li>
              <li className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-primary-600" /> Private Live GPS Tracking</li>
              <li className="flex items-center gap-1.5"><Award className="h-4 w-4 text-amber-500" /> Community Reviews</li>
              <li><Link href="/safety" className="hover:text-primary-600">Safety Guidelines</Link></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-sm font-semibold text-navy-950 mb-3 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login?role=companion" className="hover:text-primary-600">Companion Portal</Link></li>
              <li><Link href="/login?role=admin" className="hover:text-primary-600">Admin Operations</Link></li>
              <li><Link href="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Companion Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for security, empathy, and professional presence.</p>
        </div>
      </div>
    </footer>
  );
}

