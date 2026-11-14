import Link from 'next/link';
import { HeartHandshake, ShieldCheck, Lock, Award } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-900 bg-black py-14 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity" title="Go to Home">
              <span className="text-xl font-bold tracking-tight text-white block">Companion</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              On-demand verified personal accompaniment for appointments, shopping, dining, and city travel.
            </p>
          </div>

          {/* Activities Col */}
          <div>
            <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Activities</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/companions?category=hospital-visit" className="hover:text-white transition-colors">Hospital Visits</Link></li>
              <li><Link href="/companions?category=shopping" className="hover:text-white transition-colors">Shopping Assistant</Link></li>
              <li><Link href="/companions?category=restaurant-dining" className="hover:text-white transition-colors">Restaurant & Dining</Link></li>
              <li><Link href="/companions?category=travel-city-tour" className="hover:text-white transition-colors">Travel & City Tours</Link></li>
              <li><Link href="/companions?category=events-social" className="hover:text-white transition-colors">Events & Social</Link></li>
            </ul>
          </div>

          {/* Trust & Safety Col */}
          <div>
            <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Safety</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-white" /> Government ID Verified</li>
              <li className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-white" /> Live GPS Tracking</li>
              <li className="flex items-center gap-1.5"><Award className="h-4 w-4 text-white" /> In-Person PIN Security</li>
              <li><Link href="/#safety" className="hover:text-white transition-colors">Safety Standards</Link></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/login?role=companion" className="hover:text-white transition-colors">Companion Portal</Link></li>
              <li><Link href="/login?role=admin" className="hover:text-white transition-colors">Admin Console</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Companion Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Move safely with trusted accompaniment.</p>
        </div>
      </div>
    </footer>
  );
}
