'use client';

import React from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  CalendarCheck,
  MessageSquareText,
  Compass,
  Coins,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  ChevronRight,
  Phone,
  MessageCircle,
  FileCheck2,
} from 'lucide-react';
import { Property, Booking, CustomerInquiry, SiteVisit, CommissionTransaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { NavTabId } from '../layout/Sidebar';

interface OverviewViewProps {
  metrics: {
    totalProperties: number;
    activeProperties: number;
    pendingProperties: number;
    totalBookings: number;
    totalInquiries: number;
    upcomingSiteVisits: number;
    totalCommission: number;
    pendingCommission: number;
  };
  properties: Property[];
  bookings: Booking[];
  inquiries: CustomerInquiry[];
  siteVisits: SiteVisit[];
  transactions: CommissionTransaction[];
  onNavigateTab: (tab: NavTabId) => void;
  onSelectPropertyToView?: (property: Property) => void;
}

export function OverviewView({
  metrics,
  properties,
  bookings,
  inquiries,
  siteVisits,
  transactions,
  onNavigateTab,
  onSelectPropertyToView,
}: OverviewViewProps) {
  // Breakdown by category
  const pgCount = properties.filter((p) => p.category === 'PG').length;
  const flatCount = properties.filter((p) => p.category === 'FLAT').length;
  const roomCount = properties.filter((p) => p.category === 'ROOM').length;
  const hostelCount = properties.filter((p) => p.category === 'HOSTEL').length;

  const pendingOwnerAuth = properties.filter((p) => p.ownerAuthorizationStatus === 'PENDING_OWNER_SIGN').length;
  const pendingAdminApproval = properties.filter((p) => p.adminApprovalStatus === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-6">
      {/* Alert banner if pending items exist */}
      {(pendingOwnerAuth > 0 || pendingAdminApproval > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold">Action required:</span>{' '}
              {pendingOwnerAuth > 0 && (
                <span>{pendingOwnerAuth} property pending Owner Authorization agreement · </span>
              )}
              {pendingAdminApproval > 0 && (
                <span>{pendingAdminApproval} listing pending Admin Approval.</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('properties')}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 underline underline-offset-2 shrink-0"
          >
            Review Listings <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid (8 required metrics) */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* 1. Total Properties */}
        <div
          onClick={() => onNavigateTab('properties')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Properties
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <Building2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {metrics.totalProperties}
            </span>
            <span className="text-xs text-blue-600 font-semibold flex items-center">
              View all <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {pgCount} PG · {flatCount} Flat · {roomCount} Room · {hostelCount} Hostel
          </p>
        </div>

        {/* 2. Active Properties */}
        <div
          onClick={() => onNavigateTab('properties')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Properties
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-700 tabular-nums">
              {metrics.activeProperties}
            </span>
            <span className="text-[11px] font-medium text-emerald-600">
              Live in market
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Admin approved & owner authorized</p>
        </div>

        {/* 3. Pending Properties */}
        <div
          onClick={() => onNavigateTab('properties')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition hover:border-amber-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Properties
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-700 tabular-nums">
              {metrics.pendingProperties}
            </span>
            <span className="text-[11px] font-medium text-amber-600">
              In review / draft
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Awaiting admin or owner sign-off</p>
        </div>

        {/* 4. Total Bookings */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Bookings
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <CalendarCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {metrics.totalBookings}
            </span>
            <span className="text-xs text-blue-600 font-semibold flex items-center">
              Manage <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length} confirmed tenancies
          </p>
        </div>

        {/* 5. Customer Inquiries */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition hover:border-indigo-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Customer Inquiries
            </span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
              <MessageSquareText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {metrics.totalInquiries}
            </span>
            <span className="text-xs text-indigo-600 font-semibold flex items-center">
              Active leads <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {inquiries.filter((i) => i.status === 'NEW').length} unread new inquiries
          </p>
        </div>

        {/* 6. Upcoming Site Visits */}
        <div
          onClick={() => onNavigateTab('site-visits')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition hover:border-teal-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Upcoming Site Visits
            </span>
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition">
              <Compass className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {metrics.upcomingSiteVisits}
            </span>
            <span className="text-xs text-teal-600 font-semibold flex items-center">
              Schedule <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Scheduled walkthroughs this week</p>
        </div>

        {/* 7. Total Commission */}
        <div
          onClick={() => onNavigateTab('commission')}
          className="group cursor-pointer rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-600 to-blue-700 p-4.5 text-white shadow-md transition hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-blue-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              Total Commission
            </span>
            <div className="rounded-xl bg-white/20 p-2 text-white">
              <Coins className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums">
              {formatCurrency(metrics.totalCommission)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-blue-100">Paid out to bank account</p>
        </div>

        {/* 8. Pending Commission */}
        <div
          onClick={() => onNavigateTab('commission')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition hover:border-amber-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Commission
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <Coins className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-600 tabular-nums">
              {formatCurrency(metrics.pendingCommission)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Releasing on next cycle / move-in</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Broker Quick Operations</h2>
            <p className="text-xs text-slate-500">Frequently used listing and booking tasks</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('add-property')}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Property Listing</span>
            </button>
            <button
              onClick={() => onNavigateTab('site-visits')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Compass className="h-4 w-4 text-blue-600" />
              <span>Schedule Visit</span>
            </button>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <MessageSquareText className="h-4 w-4 text-blue-600" />
              <span>Call Inquiries</span>
            </button>
            <button
              onClick={() => onNavigateTab('commission')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              <span>Commission Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Visits Today & Recent Inquiries/Bookings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Upcoming Site Visits */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Scheduled Site Visits</h3>
              <p className="text-xs text-slate-500">Client walkthroughs assigned to you</p>
            </div>
            <button
              onClick={() => onNavigateTab('site-visits')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Calendar View <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {siteVisits.slice(0, 4).map((visit) => (
              <div
                key={visit.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-100/60 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{visit.customerName}</span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-xs font-medium text-blue-600 font-mono">
                      {visit.visitDate} ({visit.visitTime})
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-600 mt-0.5">{visit.propertyName}</p>
                  <p className="truncate text-[11px] text-slate-400">{visit.propertyLocation}</p>
                </div>

                <div className="ml-3 flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${visit.customerPhone}`}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                    title={`Call ${visit.customerName}`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${visit.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                      visit.customerName
                    )},%20confirming%20your%20PEFLARMO%20site%20visit%20at%20${encodeURIComponent(
                      visit.propertyName
                    )}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100 transition"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Booking Pipeline & Confirmed Tenancies */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Booking Requests & Move-ins</h3>
              <p className="text-xs text-slate-500">Tenant confirmations & deposit receipts</p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All Bookings <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {bookings.slice(0, 4).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-100/60 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{booking.customerName}</span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[11px] font-semibold text-blue-700">
                      {booking.category} ({booking.subcategory})
                    </span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] font-mono text-slate-500">{booking.bedOrUnitNumber}</span>
                  </div>
                  <p className="truncate text-xs text-slate-600 mt-0.5">{booking.propertyName}</p>
                  <p className="text-[11px] text-slate-500">
                    Rent: <span className="font-semibold text-slate-900">{formatCurrency(booking.monthlyRent)}/mo</span> · Commission:{' '}
                    <span className="font-bold text-emerald-600">{formatCurrency(booking.commissionAmount)}</span>
                  </p>
                </div>

                <div className="ml-3 shrink-0 text-right">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      booking.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : booking.bookingStatus === 'REQUESTED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : booking.bookingStatus === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Move-in: {booking.moveInDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties Showcase Preview */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Featured Authorized Inventory</h3>
            <p className="text-xs text-slate-500">
              Live listings verified by PEFLARMO Compliance and ready for client matching
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('properties')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Manage All Properties ({properties.length}) <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {properties.slice(0, 4).map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectPropertyToView?.(property)}
              className="group cursor-pointer rounded-xl border border-slate-200 overflow-hidden bg-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.images[0] || '/images/flat_luxury.jpg'}
                  alt={property.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold text-blue-700 shadow-xs backdrop-blur-xs">
                  {property.category} · {property.subcategory}
                </div>
                <div className="absolute top-2 right-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white shadow-xs backdrop-blur-xs">
                  {property.city}
                </div>
              </div>

              <div className="p-3.5">
                <h4 className="truncate text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {property.name}
                </h4>
                <p className="truncate text-[11px] text-slate-500 mt-0.5">{property.locality}</p>

                <div className="mt-2.5 flex items-baseline justify-between border-t border-slate-100 pt-2 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      {formatCurrency(property.monthlyRent)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {property.category === 'FLAT' ? '/month' : '/person/mo'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600">
                    {property.category === 'FLAT'
                      ? `${property.subcategory}`
                      : `${property.availableBeds}/${property.totalBeds} Beds`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
