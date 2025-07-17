import React from 'react';
import { Link } from 'wouter';
import { Film, Tv, Gamepad2, Smartphone, Theater, Zap, Trophy } from 'lucide-react';

const navItems = [
  { href: '/movies', label: 'أفلام', icon: Film },
  { href: '/series', label: 'مسلسلات', icon: Tv },
  { href: '/programs', label: 'برامج', icon: Tv },
  { href: '/games', label: 'ألعاب', icon: Gamepad2 },
  { href: '/applications', label: 'تطبيقات', icon: Smartphone },
  { href: '/theater', label: 'مسرح', icon: Theater },
  { href: '/wrestling', label: 'مصارعة', icon: Zap },
  { href: '/sports', label: 'رياضة', icon: Trophy },
];

export default function SimpleNavigation() {
  return (
    <nav className="bg-card-clean border-b">
      <div className="container-clean">
        <div className="flex items-center gap-6 h-12 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-muted text-sm whitespace-nowrap">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}