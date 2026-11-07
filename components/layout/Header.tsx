'use client';

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { BrokerProfile, NotificationItem } from '@/lib/types';
import { NavTabId } from './Sidebar';

interface HeaderProps {
  currentTab: NavTabId;
  broker: BrokerProfile;
  notifications: NotificationItem[];
  onOpenMobileMenu: () => void;
  onNavigateTab: (tab: NavTabId) => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onSearchQuery?: (q: string) => void;
}

const TAB_TITLES: Record<NavTabId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Broker Dashboard',
    subtitle: 'Overview of authorized inventory, performance metrics & live pipeline',
  },
  properties: {
    title: 'My Properties',
    subtitle: 'Authorized listings across PG, Flat, Room, and Hostel inventory',
  },
  'add-property': {
    title: 'Add New Property',
    subtitle: '12-step guided listing form with owner authorization & verification',
  },
  bookings: {
    title: 'Bookings & Tenancies',
    subtitle: 'Manage client booking requests, token payments & move-in dates',
  },
  inquiries: {
    title: 'Customer Inquiries',
    subtitle: 'Respond to leads via direct dial, WhatsApp templates & follow-ups',
  },
  customers: {
    title: 'My Customers',
    subtitle: 'Directory of verified prospects, active tenants and applicants',
  },
  'site-visits': {
    title: 'Site Visit Schedules',
    subtitle: 'Calendar agenda, scheduled walkthroughs and customer feedback',
  },
  owners: {
    title: 'Property Owners',
    subtitle: 'Property authorization agreements and owner contact directory',
  },
  commission: {
    title: 'Commission & Earnings',
    subtitle: 'Track gross commissions, TDS deductions, and weekly direct payouts',
  },
  analytics: {
    title: 'Performance Analytics',
    subtitle: 'Occupancy statistics, conversion velocity and locality demand',
  },
  notifications: {
    title: 'Notifications & Alerts',
    subtitle: 'Real-time updates regarding approvals, bookings and payments',
  },
  profile: {
    title: 'Broker Profile',
    subtitle: 'RERA accreditation, KYC details, bank account & service territories',
  },
  support: {
    title: 'Broker Helpdesk & Support',
    subtitle: 'Direct support line, operational FAQs and priority ticket escalation',
  },
  logout: {
    title: 'Broker Logout',
    subtitle: 'Secure session termination',
  },
};

export function Header({
  currentTab,
  broker,
  notifications,
  onOpenMobileMenu,
  onNavigateTab,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}: HeaderProps) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const tabInfo = TAB_TITLES[currentTab] || { title: 'PEFLARMO Broker', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Zone 1: Mobile toggle & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {tabInfo.title}
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">{tabInfo.subtitle}</p>
        </div>
      </div>

      {/* Zone 2: Quick Search / Status Tracker */}
      <div className="hidden max-w-md flex-1 px-6 md:block">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search properties, bookings, or inquiries (e.g. Bandra, 2BHK, Rohit)..."
            onClick={() => {
              if (currentTab !== 'properties' && currentTab !== 'bookings') {
                onNavigateTab('properties');
              }
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Zone 3: Actions & Notifications Popover */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Add Property Button */}
        {currentTab !== 'add-property' && (
          <button
            onClick={() => onNavigateTab('add-property')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Property</span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="View notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onMarkAllNotificationsRead();
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No notifications yet.</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onMarkNotificationRead(n.id);
                        if (n.linkTab) onNavigateTab(n.linkTab as NavTabId);
                        setShowNotifMenu(false);
                      }}
                      className={`group cursor-pointer rounded-xl p-2.5 transition text-left ${
                        n.isRead ? 'bg-slate-50/60 hover:bg-slate-100/80' : 'bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${n.isRead ? 'font-medium text-slate-700' : 'font-semibold text-slate-900'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigateTab('notifications');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div
          onClick={() => onNavigateTab('profile')}
          className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 py-1.5 pr-3 pl-1.5 transition hover:bg-slate-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-xs text-white">
            {broker.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold leading-tight text-slate-900">{broker.name}</p>
            <p className="text-[10px] leading-tight text-blue-600 font-medium">Verified Broker</p>
          </div>
        </div>
      </div>
    </header>
  );
}
