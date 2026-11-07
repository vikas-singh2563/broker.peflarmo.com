'use client';

import React, { useState } from 'react';
import { CustomerProfile, PropertyCategory } from '@/lib/types';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  Building2,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface CustomersViewProps {
  customers: CustomerProfile[];
}

export function CustomersView({ customers }: CustomersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = c.name.toLowerCase().includes(q);
      const matchesPhone = c.phone.includes(q);
      const matchesLoc = c.preferredLocation.toLowerCase().includes(q);
      if (!matchesName && !matchesPhone && !matchesLoc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Tenant & Client Directory ({customers.length})
          </h2>
          <p className="text-xs text-slate-500">
            Active verified tenants, prospective home-seekers, and move-in histories
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, locality..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pr-3 pl-8 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        {['ALL', 'ACTIVE_TENANT', 'PROSPECT', 'LEAD'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            {st === 'ALL'
              ? 'All Clients'
              : st === 'ACTIVE_TENANT'
              ? 'Active Tenants'
              : st === 'PROSPECT'
              ? 'Verified Prospects'
              : 'New Leads'}
          </button>
        ))}
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3.5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {c.id}</p>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    c.status === 'ACTIVE_TENANT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : c.status === 'PROSPECT'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {c.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{c.email}</span>
                </div>
              </div>

              {c.currentProperty ? (
                <div className="rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100 text-xs text-emerald-900 mt-2.5">
                  <span className="font-semibold block">Currently Occupying:</span>
                  <p className="text-[11px] text-emerald-800 truncate">{c.currentProperty}</p>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs text-slate-700 mt-2.5 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Interested In:</span>
                    <strong className="text-slate-900">{c.preferredCategory}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Locality:</span>
                    <strong className="text-slate-900 truncate max-w-[150px]">{c.preferredLocation}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Budget:</span>
                    <strong className="text-blue-700">{c.budgetRange}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {c.inquiryCount} Inquiries · {c.visitCount} Visits
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${c.phone}`}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50"
                  title="Call"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
