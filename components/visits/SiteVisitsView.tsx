'use client';

import React, { useState, useMemo } from 'react';
import { SiteVisit, Property, VisitStatus } from '@/lib/types';
import {
  Search,
  Compass,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  Phone,
  MessageCircle,
  MapPin,
  X,
  User,
  Building2,
  CalendarDays,
  List,
} from 'lucide-react';

interface SiteVisitsViewProps {
  siteVisits: SiteVisit[];
  properties: Property[];
  onAddVisit: (visit: SiteVisit) => void;
  onUpdateVisitStatus: (id: string, status: VisitStatus, notes?: string) => void;
}

export function SiteVisitsView({
  siteVisits,
  properties,
  onAddVisit,
  onUpdateVisitStatus,
}: SiteVisitsViewProps) {
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [reschedulingVisit, setReschedulingVisit] = useState<SiteVisit | null>(null);

  // New visit modal state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [visitDate, setVisitDate] = useState('2026-11-10');
  const [visitTime, setVisitTime] = useState('04:00 PM');
  const [visitNotes, setVisitNotes] = useState('');

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  const filteredVisits = useMemo(() => {
    return siteVisits.filter((v) => {
      if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.customerName.toLowerCase().includes(q);
        const matchesProp = v.propertyName.toLowerCase().includes(q);
        const matchesPhone = v.customerPhone.includes(q);
        if (!matchesName && !matchesProp && !matchesPhone) return false;
      }
      return true;
    });
  }, [siteVisits, statusFilter, searchQuery]);

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === selectedPropertyId) || properties[0];
    if (!prop || !customerName.trim() || !customerPhone.trim()) return;

    const newVisit: SiteVisit = {
      id: 'VST-' + Date.now().toString().slice(-4),
      visitRef: 'PEF-VISIT-' + Math.floor(1000 + Math.random() * 9000),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'customer@gmail.com',
      propertyId: prop.id,
      propertyName: prop.name,
      propertyLocation: `${prop.locality}, ${prop.city}`,
      visitDate,
      visitTime,
      status: 'SCHEDULED',
      visitNotes: visitNotes.trim() || 'Walkthrough requested by client.',
      assignedBrokerName: 'Rahul Sharma',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddVisit(newVisit);
    setIsScheduleModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setVisitNotes('');
  };

  const handleSaveReschedule = () => {
    if (!reschedulingVisit || !rescheduleDate) return;
    onUpdateVisitStatus(
      reschedulingVisit.id,
      'RESCHEDULED',
      `Rescheduled to ${rescheduleDate} at ${rescheduleTime}.`
    );
    setReschedulingVisit(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Schedule Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Property Site Visits & Walkthroughs ({siteVisits.length})
          </h2>
          <p className="text-xs text-slate-500">
            Schedule appointments, send directions via WhatsApp, and record client visit outcomes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === 'CALENDAR' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Site Visit</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Visits' },
            { id: 'SCHEDULED', label: 'Scheduled' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CONVERTED', label: 'Converted to Booking' },
            { id: 'RESCHEDULED', label: 'Rescheduled' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => {
            const count =
              tab.id === 'ALL'
                ? siteVisits.length
                : siteVisits.filter((v) => v.status === tab.id).length;
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, property, phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pr-3 pl-8 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Calendar or List View */}
      {viewMode === 'CALENDAR' ? (
        /* Calendar Agenda Strip */
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Upcoming Visit Calendar Schedule</h3>
            <span className="text-xs text-blue-600 font-semibold">November 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/50 hover:bg-white hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">{visit.visitDate}</span>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md font-mono">
                    {visit.visitTime}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{visit.customerName}</h4>
                  <p className="text-[11px] text-slate-500">{visit.customerPhone}</p>
                </div>

                <div className="border-t border-slate-200/60 pt-2 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900 truncate">{visit.propertyName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{visit.propertyLocation}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      visit.status === 'SCHEDULED'
                        ? 'bg-blue-600 text-white'
                        : visit.status === 'COMPLETED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-400 text-white'
                    }`}
                  >
                    {visit.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${visit.customerPhone}`}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50"
                      title="Call"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={`https://wa.me/${visit.customerPhone.replace(/[^0-9]/g, '')}`}
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
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredVisits.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-xs">
              No site visits found matching your filter criteria.
            </div>
          ) : (
            filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{visit.customerName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-blue-700">{visit.customerPhone}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-mono font-bold text-slate-800 bg-blue-50 px-2 py-0.5 rounded-md">
                        {visit.visitDate} at {visit.visitTime}
                      </span>

                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          visit.status === 'SCHEDULED'
                            ? 'bg-blue-600 text-white'
                            : visit.status === 'COMPLETED'
                            ? 'bg-emerald-600 text-white'
                            : visit.status === 'CONVERTED'
                            ? 'bg-purple-600 text-white'
                            : visit.status === 'RESCHEDULED'
                            ? 'bg-amber-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 flex flex-wrap items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <strong className="font-semibold text-slate-900">{visit.propertyName}</strong>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{visit.propertyLocation}</span>
                    </div>

                    {visit.visitNotes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <strong className="text-slate-800">Visit Notes:</strong> {visit.visitNotes}
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Mark Completed */}
                    {visit.status === 'SCHEDULED' && (
                      <button
                        onClick={() =>
                          onUpdateVisitStatus(
                            visit.id,
                            'COMPLETED',
                            'Client inspected property and expressed positive interest.'
                          )
                        }
                        className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        Mark Completed
                      </button>
                    )}

                    {/* Reschedule Button */}
                    <button
                      onClick={() => {
                        setReschedulingVisit(visit);
                        setRescheduleDate(visit.visitDate);
                      }}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Reschedule
                    </button>

                    {/* Direct Call */}
                    <a
                      href={`tel:${visit.customerPhone}`}
                      className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      title="Call"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${visit.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                        visit.customerName
                      )},%20confirming%20our%20scheduled%20site%20visit%20for%20${encodeURIComponent(
                        visit.propertyName
                      )}%20on%20${visit.visitDate}%20at%20${visit.visitTime}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100 transition"
                      title="Send WhatsApp confirmation"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Schedule Site Visit Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateVisit}
            className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule In-Person Site Visit</h3>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Select Property *</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.locality}, {p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Yash Vardhan"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Customer Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Visit Date *</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Visit Time Slot *</label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                  >
                    <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:30 AM">11:30 AM - 12:30 PM</option>
                    <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:30 PM">04:30 PM - 05:30 PM</option>
                    <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Client Instructions / Notes</label>
                <textarea
                  rows={2}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder="e.g. Client needs car parking inspection and discussion on move-in timeline."
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Confirm Site Visit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reschedule Visit</h3>
              <button
                onClick={() => setReschedulingVisit(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Rescheduling for: <strong>{reschedulingVisit.customerName}</strong>
              </p>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">New Time Slot</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900"
                >
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setReschedulingVisit(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Save New Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
