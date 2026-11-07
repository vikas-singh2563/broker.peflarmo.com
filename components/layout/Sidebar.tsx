'use client';

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  CalendarCheck,
  MessageSquareText,
  Users,
  Compass,
  KeyRound,
  Coins,
  BarChart3,
  Bell,
  UserCircle2,
  HelpCircle,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrokerProfile } from '@/lib/types';

export type NavTabId =
  | 'dashboard'
  | 'properties'
  | 'add-property'
  | 'bookings'
  | 'inquiries'
  | 'customers'
  | 'site-visits'
  | 'owners'
  | 'commission'
  | 'analytics'
  | 'notifications'
  | 'profile'
  | 'support'
  | 'logout';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  broker: BrokerProfile;
  counts: {
    pendingBookings: number;
    newInquiries: number;
    upcomingVisits: number;
    unreadNotifications: number;
  };
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onRequestLogout: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  broker,
  counts,
  isMobileOpen,
  onCloseMobile,
  onRequestLogout,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as NavTabId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties' as NavTabId, label: 'My Properties', icon: Building2 },
    { id: 'add-property' as NavTabId, label: 'Add Property', icon: PlusCircle, isHighlight: true },
    {
      id: 'bookings' as NavTabId,
      label: 'Bookings',
      icon: CalendarCheck,
      badge: counts.pendingBookings > 0 ? counts.pendingBookings : undefined,
    },
    {
      id: 'inquiries' as NavTabId,
      label: 'Customer Inquiries',
      icon: MessageSquareText,
      badge: counts.newInquiries > 0 ? counts.newInquiries : undefined,
    },
    { id: 'customers' as NavTabId, label: 'My Customers', icon: Users },
    {
      id: 'site-visits' as NavTabId,
      label: 'Site Visits',
      icon: Compass,
      badge: counts.upcomingVisits > 0 ? counts.upcomingVisits : undefined,
    },
    { id: 'owners' as NavTabId, label: 'Property Owners', icon: KeyRound },
    { id: 'commission' as NavTabId, label: 'Commission & Earnings', icon: Coins },
    { id: 'analytics' as NavTabId, label: 'Analytics', icon: BarChart3 },
    {
      id: 'notifications' as NavTabId,
      label: 'Notifications',
      icon: Bell,
      badge: counts.unreadNotifications > 0 ? counts.unreadNotifications : undefined,
    },
    { id: 'profile' as NavTabId, label: 'My Profile', icon: UserCircle2 },
    { id: 'support' as NavTabId, label: 'Support & Helpdesk', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white shadow-md shadow-blue-500/20">
              <span className="text-xl tracking-tighter">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">PEFLARMO</span>
              </div>
              <p className="text-[11px] font-semibold tracking-wider text-blue-600 uppercase">
                Broker Portal
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Broker Identity Pill */}
        <div className="border-b border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {broker.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-semibold text-slate-900">{broker.name}</p>
                <span title="RERA Verified">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                </span>
              </div>
              <p className="truncate text-xs text-slate-500 font-mono">ID: {broker.id}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600">
            <span>RERA Verified</span>
            <span className="font-semibold text-blue-700">{broker.tier}</span>
          </div>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={cn(
                  'group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : item.isHighlight
                    ? 'text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-white' : item.isHighlight ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums',
                      isActive
                        ? 'bg-white text-blue-700'
                        : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-3">
          <button
            onClick={onRequestLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 shrink-0 text-red-500" />
            <span>Logout Broker</span>
          </button>
          <div className="mt-2 text-center text-[10px] text-slate-400">
            PEFLARMO Broker Network v2.4
          </div>
        </div>
      </aside>
    </>
  );
}
