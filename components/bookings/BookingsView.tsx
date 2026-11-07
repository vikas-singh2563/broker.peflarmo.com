'use client';

import React, { useState, useMemo } from 'react';
import { Booking, Property } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  MessageCircle,
  FileText,
  Filter,
  Plus,
  X,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface BookingsViewProps {
  bookings: Booking[];
  properties: Property[];
  onUpdateStatus: (id: string, status: Booking['bookingStatus'], paymentStatus?: Booking['paymentStatus']) => void;
  onAddBooking: (booking: Booking) => void;
}

export function BookingsView({
  bookings,
  properties,
  onUpdateStatus,
  onAddBooking,
}: BookingsViewProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'REQUESTED' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForAgreement, setSelectedBookingForAgreement] = useState<Booking | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Booking form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [newBedOrUnit, setNewBedOrUnit] = useState('Unit 101');
  const [newMoveInDate, setNewMoveInDate] = useState('2026-11-20');
  const [newLeaseMonths, setNewLeaseMonths] = useState(11);
  const [newTokenDeposit, setNewTokenDeposit] = useState(10000);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (activeTab !== 'ALL' && b.bookingStatus !== activeTab) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = b.customerName.toLowerCase().includes(q);
        const matchesRef = b.bookingRef.toLowerCase().includes(q);
        const matchesProp = b.propertyName.toLowerCase().includes(q);
        const matchesPhone = b.customerPhone.includes(q);
        if (!matchesName && !matchesRef && !matchesProp && !matchesPhone) return false;
      }
      return true;
    });
  }, [bookings, activeTab, searchQuery]);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === selectedPropId) || properties[0];
    if (!prop || !newCustomerName.trim() || !newCustomerPhone.trim()) return;

    const commission = prop.category === 'FLAT' ? prop.monthlyRent : Math.round(prop.monthlyRent * 0.5);

    const newBooking: Booking = {
      id: 'BKG-' + Date.now().toString().slice(-4),
      bookingRef: 'PEF-BK-' + Math.floor(1000 + Math.random() * 9000),
      propertyId: prop.id,
      propertyName: `${prop.name} (${prop.locality})`,
      category: prop.category,
      subcategory: prop.subcategory,
      customerName: newCustomerName.trim(),
      customerPhone: newCustomerPhone.trim(),
      customerEmail: newCustomerEmail.trim() || 'customer@gmail.com',
      customerKycVerified: true,
      bedOrUnitNumber: newBedOrUnit,
      moveInDate: newMoveInDate,
      leaseDurationMonths: newLeaseMonths,
      monthlyRent: prop.monthlyRent,
      tokenDepositPaid: newTokenDeposit,
      securityDepositTotal: prop.securityDeposit,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      commissionAmount: commission,
      commissionStatus: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      notes: 'Direct walk-in booking entered by broker.',
    };

    onAddBooking(newBooking);
    setIsAddModalOpen(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Booking & Tenancy Agreements ({bookings.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage client bookings, token receipts, digital lease agreements & move-in dates
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Direct Booking</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Bookings', count: bookings.length },
            {
              id: 'REQUESTED',
              label: 'Booking Requests',
              count: bookings.filter((b) => b.bookingStatus === 'REQUESTED').length,
            },
            {
              id: 'CONFIRMED',
              label: 'Confirmed',
              count: bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length,
            },
            {
              id: 'PENDING',
              label: 'Pending',
              count: bookings.filter((b) => b.bookingStatus === 'PENDING').length,
            },
            {
              id: 'CANCELLED',
              label: 'Cancelled',
              count: bookings.filter((b) => b.bookingStatus === 'CANCELLED').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, ref, or property..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pr-3 pl-8 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Property & Room</th>
                <th className="py-3 px-4">Move-in / Lease</th>
                <th className="py-3 px-4">Rent & Token</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No bookings found matching your selected filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    {/* Booking Ref */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 font-mono">{b.bookingRef}</span>
                      <p className="text-[10px] text-slate-400">{b.createdAt}</p>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        {b.customerName}
                        {b.customerKycVerified && (
                          <span title="KYC Verified">
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{b.customerPhone}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{b.customerEmail}</p>
                    </td>

                    {/* Property */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 truncate max-w-[180px]" title={b.propertyName}>
                        {b.propertyName}
                      </p>
                      <p className="text-[11px] text-blue-700 font-medium">
                        {b.category} · {b.subcategory}
                      </p>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-sm font-mono text-slate-700">
                        {b.bedOrUnitNumber}
                      </span>
                    </td>

                    {/* Move-in / Lease */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{b.moveInDate}</span>
                      <p className="text-[11px] text-slate-500">{b.leaseDurationMonths} Months Tenancy</p>
                    </td>

                    {/* Rent & Token */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 tabular-nums">
                        {formatCurrency(b.monthlyRent)}/mo
                      </span>
                      <p className="text-[11px] text-emerald-700 font-semibold tabular-nums">
                        Token: {formatCurrency(b.tokenDepositPaid)}
                      </p>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          b.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.paymentStatus === 'PARTIAL'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : b.paymentStatus === 'REFUNDED'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    {/* Booking Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          b.bookingStatus === 'CONFIRMED'
                            ? 'bg-emerald-600 text-white'
                            : b.bookingStatus === 'REQUESTED'
                            ? 'bg-blue-600 text-white'
                            : b.bookingStatus === 'PENDING'
                            ? 'bg-amber-500 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>

                    {/* Broker Commission */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-black text-emerald-700 tabular-nums">
                        {formatCurrency(b.commissionAmount)}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {b.commissionStatus === 'PAID' ? '✓ Paid' : '⏳ Pending'}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Confirm button if requested or pending */}
                        {(b.bookingStatus === 'REQUESTED' || b.bookingStatus === 'PENDING') && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'CONFIRMED', 'PAID')}
                            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                            title="Confirm Booking"
                          >
                            Confirm
                          </button>
                        )}

                        {/* Agreement modal trigger */}
                        <button
                          onClick={() => setSelectedBookingForAgreement(b)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                          title="View Digital Agreement"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>

                        {/* Contact WhatsApp */}
                        <a
                          href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                            b.customerName
                          )},%20regarding%20your%20PEFLARMO%20booking%20${b.bookingRef}%20for%20${encodeURIComponent(
                            b.propertyName
                          )}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 transition"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>

                        {/* Cancel option */}
                        {b.bookingStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => {
                              if (confirm(`Cancel booking ${b.bookingRef} for ${b.customerName}?`)) {
                                onUpdateStatus(b.id, 'CANCELLED', 'REFUNDED');
                              }
                            }}
                            className="rounded-lg border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50 transition"
                            title="Cancel Booking"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lease Agreement Preview Modal */}
      {selectedBookingForAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  PEFLARMO Tenancy Agreement Summary
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForAgreement(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</span>
                  <p className="text-base font-bold text-slate-900 font-mono">{selectedBookingForAgreement.bookingRef}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Agreement Date</span>
                  <p className="text-sm font-semibold text-slate-900">{selectedBookingForAgreement.createdAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-slate-700">Tenant / Lessee:</span>
                  <p className="text-slate-900 font-semibold">{selectedBookingForAgreement.customerName}</p>
                  <p className="text-slate-500">{selectedBookingForAgreement.customerPhone}</p>
                  <p className="text-slate-500">{selectedBookingForAgreement.customerEmail}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-700">Authorized Broker:</span>
                  <p className="text-slate-900 font-semibold">Rahul Sharma (BRK-78429)</p>
                  <p className="text-slate-500">PEFLARMO Premier Estates</p>
                  <p className="text-slate-500 font-mono">RERA: A51800034921</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1">
                <span className="font-bold text-slate-700">Demised Property & Unit:</span>
                <p className="font-semibold text-slate-900">{selectedBookingForAgreement.propertyName}</p>
                <p className="text-slate-600">
                  Unit/Bed: <strong>{selectedBookingForAgreement.bedOrUnitNumber}</strong> ({selectedBookingForAgreement.category} - {selectedBookingForAgreement.subcategory})
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-3 bg-white p-3 rounded-xl border">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly Rent</span>
                  <p className="font-extrabold text-blue-700 text-sm">
                    {formatCurrency(selectedBookingForAgreement.monthlyRent)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Security Deposit</span>
                  <p className="font-bold text-slate-800 text-sm">
                    {formatCurrency(selectedBookingForAgreement.securityDepositTotal)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Token Received</span>
                  <p className="font-bold text-emerald-600 text-sm">
                    {formatCurrency(selectedBookingForAgreement.tokenDepositPaid)}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                This digital agreement summary has been authenticated under the PEFLARMO Standard Residential Tenancy terms. E-stamping and biometric sign-off will complete at check-in.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Agreement PDF download initiated for ${selectedBookingForAgreement.bookingRef}`);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                <Download className="h-4 w-4" />
                <span>Download Agreement PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateBooking}
            className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Direct Booking</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Assign to Property *</label>
                <select
                  value={selectedPropId}
                  onChange={(e) => setSelectedPropId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category} - {p.subcategory})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="e.g. Ananya Roy"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="customer@domain.com"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Bed / Unit Assigned</label>
                  <input
                    type="text"
                    value={newBedOrUnit}
                    onChange={(e) => setNewBedOrUnit(e.target.value)}
                    placeholder="e.g. Bed A-201 / Flat 402"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Move-in Date</label>
                  <input
                    type="date"
                    value={newMoveInDate}
                    onChange={(e) => setNewMoveInDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Token Amount (₹)</label>
                  <input
                    type="number"
                    value={newTokenDeposit}
                    onChange={(e) => setNewTokenDeposit(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Save & Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
