'use client';

import React, { useState } from 'react';
import { NotificationItem } from '@/lib/types';
import {
  Bell,
  CheckCircle2,
  Clock,
  Building2,
  CalendarCheck,
  MessageSquareText,
  ShieldCheck,
  Coins,
  Check,
} from 'lucide-react';
import { NavTabId } from '../layout/Sidebar';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateTab: (tab: NavTabId) => void;
}

export function NotificationsView({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigateTab,
}: NotificationsViewProps) {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter !== 'ALL') return n.category === filter;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Notifications & Compliance Alerts ({notifications.length})
          </h2>
          <p className="text-xs text-slate-500">
            Real-time updates regarding tenant inquiries, owner authorizations, and commission disbursements
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition"
        >
          <Check className="h-4 w-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {['ALL', 'UNREAD', 'BOOKING', 'INQUIRY', 'COMMISSION', 'APPROVAL'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-xs">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onMarkRead(item.id);
                if (item.linkTab) onNavigateTab(item.linkTab as NavTabId);
              }}
              className={`cursor-pointer rounded-2xl border p-4.5 transition flex items-start gap-4 ${
                item.isRead
                  ? 'border-slate-200/80 bg-white hover:bg-slate-50'
                  : 'border-blue-200 bg-blue-50/50 hover:bg-blue-100/50'
              }`}
            >
              <div
                className={`rounded-xl p-2.5 shrink-0 ${
                  item.category === 'COMMISSION'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.category === 'BOOKING'
                    ? 'bg-blue-100 text-blue-700'
                    : item.category === 'APPROVAL'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.category === 'COMMISSION' ? (
                  <Coins className="h-5 w-5" />
                ) : item.category === 'BOOKING' ? (
                  <CalendarCheck className="h-5 w-5" />
                ) : item.category === 'APPROVAL' ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <MessageSquareText className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs ${item.isRead ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{item.message}</p>
              </div>

              {!item.isRead && (
                <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
