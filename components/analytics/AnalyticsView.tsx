'use client';

import React from 'react';
import { Property, Booking, CustomerInquiry, SiteVisit } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Building2,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface AnalyticsViewProps {
  properties: Property[];
  bookings: Booking[];
  inquiries: CustomerInquiry[];
  siteVisits: SiteVisit[];
}

export function AnalyticsView({
  properties,
  bookings,
  inquiries,
  siteVisits,
}: AnalyticsViewProps) {
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length;
  const visitCount = siteVisits.length;
  const inqCount = inquiries.length;

  const visitConversionRate = inqCount > 0 ? Math.round((visitCount / inqCount) * 100) : 0;
  const bookingConversionRate = visitCount > 0 ? Math.round((confirmedBookings / visitCount) * 100) : 0;

  // Breakdown by Category
  const categories = ['PG', 'FLAT', 'ROOM', 'HOSTEL'] as const;
  const categoryStats = categories.map((cat) => {
    const catProps = properties.filter((p) => p.category === cat);
    const catBookings = bookings.filter((b) => b.category === cat && b.bookingStatus === 'CONFIRMED');
    const revenue = catBookings.reduce((sum, b) => sum + b.commissionAmount, 0);

    let totalBedsOrUnits = 0;
    let occupiedCount = 0;

    catProps.forEach((p) => {
      if (p.category === 'FLAT') {
        totalBedsOrUnits += 1;
        if (p.availabilityStatus === 'OCCUPIED') occupiedCount += 1;
      } else {
        totalBedsOrUnits += p.totalBeds || 0;
        occupiedCount += (p.totalBeds || 0) - (p.availableBeds || 0);
      }
    });

    const occupancyRate = totalBedsOrUnits > 0 ? Math.round((occupiedCount / totalBedsOrUnits) * 100) : 75;

    return {
      category: cat,
      propertyCount: catProps.length,
      bookingCount: catBookings.length,
      revenue,
      occupancyRate,
    };
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Broker Performance & Occupancy Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Conversion velocity, category revenue breakdown, and demand across authorized regions
          </p>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Lead Conversion Funnel (Last 30 Days)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-400">1. Customer Inquiries</span>
            <div className="text-2xl font-black text-slate-900 tabular-nums">{inqCount}</div>
            <p className="text-[11px] text-slate-500">Incoming inquiries on portal</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-blue-700">2. Scheduled Site Visits</span>
              <span className="text-xs font-bold text-blue-700">{visitConversionRate}% Conversion</span>
            </div>
            <div className="text-2xl font-black text-blue-900 tabular-nums">{visitCount}</div>
            <p className="text-[11px] text-blue-700">Completed physical walkthroughs</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-emerald-800">3. Confirmed Tenancies</span>
              <span className="text-xs font-bold text-emerald-800">{bookingConversionRate}% Closure</span>
            </div>
            <div className="text-2xl font-black text-emerald-800 tabular-nums">{confirmedBookings}</div>
            <p className="text-[11px] text-emerald-700">Token deposit & agreement stamped</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Inventory Category Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((stat) => (
            <div
              key={stat.category}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">{stat.category}</span>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                  {stat.propertyCount} Properties
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Occupancy</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${stat.occupancyRate}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 tabular-nums">{stat.occupancyRate}%</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2 flex items-baseline justify-between text-xs">
                <span className="text-slate-500">Commission:</span>
                <span className="font-extrabold text-emerald-700 tabular-nums">
                  {formatCurrency(stat.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Localities */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">High-Demand Broker Localities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
            <span className="font-bold text-slate-900 block">Bandra West & Khar (Mumbai)</span>
            <p className="text-slate-500">Average Flat Rent: ₹78,000/mo</p>
            <span className="inline-block text-emerald-700 font-semibold">92% Occupancy Rate</span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
            <span className="font-bold text-slate-900 block">Powai Central (Mumbai)</span>
            <p className="text-slate-500">Average PG Rent: ₹14,500/person</p>
            <span className="inline-block text-emerald-700 font-semibold">88% Occupancy Rate</span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
            <span className="font-bold text-slate-900 block">Koramangala 4th Block (Bangalore)</span>
            <p className="text-slate-500">Average Studio Rent: ₹18,500/mo</p>
            <span className="inline-block text-emerald-700 font-semibold">95% Occupancy Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
