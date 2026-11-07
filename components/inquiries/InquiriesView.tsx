'use client';

import React, { useState, useMemo } from 'react';
import { CustomerInquiry, InquiryStatus, Property } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  MessageSquareText,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Plus,
  Send,
  X,
  User,
  History,
} from 'lucide-react';

interface InquiriesViewProps {
  inquiries: CustomerInquiry[];
  properties: Property[];
  onUpdateStatus: (id: string, status: InquiryStatus, note?: string) => void;
  onScheduleVisitForCustomer?: (inquiry: CustomerInquiry) => void;
}

export function InquiriesView({
  inquiries,
  properties,
  onUpdateStatus,
  onScheduleVisitForCustomer,
}: InquiriesViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Follow-up modal state
  const [activeFollowUpInquiry, setActiveFollowUpInquiry] = useState<CustomerInquiry | null>(null);
  const [followUpNote, setFollowUpNote] = useState('');
  const [newStatus, setNewStatus] = useState<InquiryStatus>('CONTACTED');

  // WhatsApp quick composer modal
  const [whatsAppInquiry, setWhatsAppInquiry] = useState<CustomerInquiry | null>(null);
  const [customMsg, setCustomMsg] = useState('');

  // Call Logger modal
  const [callInquiry, setCallInquiry] = useState<CustomerInquiry | null>(null);
  const [callOutcomeNote, setCallOutcomeNote] = useState('');

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter !== 'ALL' && inq.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = inq.customerName.toLowerCase().includes(q);
        const matchesProp = inq.propertyName.toLowerCase().includes(q);
        const matchesPhone = inq.customerPhone.includes(q);
        if (!matchesName && !matchesProp && !matchesPhone) return false;
      }
      return true;
    });
  }, [inquiries, statusFilter, searchQuery]);

  const handleOpenFollowUp = (inquiry: CustomerInquiry) => {
    setActiveFollowUpInquiry(inquiry);
    setNewStatus(inquiry.status);
    setFollowUpNote('');
  };

  const handleSaveFollowUp = () => {
    if (!activeFollowUpInquiry) return;
    onUpdateStatus(activeFollowUpInquiry.id, newStatus, followUpNote.trim());
    setActiveFollowUpInquiry(null);
  };

  const handleOpenWhatsApp = (inquiry: CustomerInquiry) => {
    setWhatsAppInquiry(inquiry);
    setCustomMsg(
      `Hello ${inquiry.customerName}, this is Rahul Sharma from PEFLARMO regarding your inquiry for ${inquiry.propertyName}. Would you like to schedule an in-person walkthrough today or tomorrow?`
    );
  };

  const handleSendWhatsApp = () => {
    if (!whatsAppInquiry) return;
    const cleanPhone = whatsAppInquiry.customerPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMsg)}`;
    window.open(url, '_blank');
    onUpdateStatus(
      whatsAppInquiry.id,
      'CONTACTED',
      `Sent WhatsApp message: "${customMsg.slice(0, 60)}..."`
    );
    setWhatsAppInquiry(null);
  };

  const handleOpenCall = (inquiry: CustomerInquiry) => {
    setCallInquiry(inquiry);
    setCallOutcomeNote('Customer was interested in move-in date and deposit breakdown.');
  };

  const handleLogCall = () => {
    if (!callInquiry) return;
    onUpdateStatus(
      callInquiry.id,
      'CONTACTED',
      `Call logged: ${callOutcomeNote.trim()}`
    );
    setCallInquiry(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Customer Inquiries & Lead Pipeline ({inquiries.length})
          </h2>
          <p className="text-xs text-slate-500">
            High-intent customer leads from PEFLARMO portal. Direct call, WhatsApp & follow-up tools.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Inquiries' },
            { id: 'NEW', label: 'New' },
            { id: 'CONTACTED', label: 'Contacted' },
            { id: 'SCHEDULED_VISIT', label: 'Visit Scheduled' },
            { id: 'CONVERTED', label: 'Converted' },
            { id: 'DROPPED', label: 'Dropped' },
          ].map((tab) => {
            const count =
              tab.id === 'ALL'
                ? inquiries.length
                : inquiries.filter((i) => i.status === tab.id).length;
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

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, property..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pr-3 pl-8 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-xs">
            No inquiries found matching your filter criteria.
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left: Customer & Property Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{inq.customerName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-blue-700">{inq.customerPhone}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{inq.customerEmail}</span>

                    {/* Status badge */}
                    <span
                      className={`ml-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        inq.status === 'NEW'
                          ? 'bg-blue-600 text-white'
                          : inq.status === 'SCHEDULED_VISIT'
                          ? 'bg-purple-600 text-white'
                          : inq.status === 'CONVERTED'
                          ? 'bg-emerald-600 text-white'
                          : inq.status === 'CONTACTED'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-400 text-white'
                      }`}
                    >
                      {inq.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                    <span>Interested Property:</span>
                    <strong className="text-slate-900 font-semibold">{inq.propertyName}</strong>
                    <span className="rounded-sm bg-blue-50 px-2 py-0.5 font-bold text-blue-700 text-[11px]">
                      {inq.category} · {inq.subcategory}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>Inquiry Date: <strong className="text-slate-700">{inq.inquiryDate}</strong></span>
                    <span>Budget: <strong className="text-slate-700">{formatCurrency(inq.budgetMonthly)}/mo</strong></span>
                    <span>Move-in: <strong className="text-slate-700">{inq.expectedMoveIn}</strong></span>
                  </div>

                  {/* Latest follow-up remark */}
                  {inq.lastFollowUpNote && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs text-slate-700 flex items-start gap-2">
                      <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Latest Follow-up:</span>{' '}
                        {inq.lastFollowUpNote}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Working Action Buttons (Call, WhatsApp, Follow-up) */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  {/* Call Button */}
                  <button
                    onClick={() => handleOpenCall(inq)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                  >
                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                    <span>Call</span>
                  </button>

                  {/* WhatsApp Button */}
                  <button
                    onClick={() => handleOpenWhatsApp(inq)}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Follow-up Button */}
                  <button
                    onClick={() => handleOpenFollowUp(inq)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Follow-up</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Follow-up Update Modal */}
      {activeFollowUpInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Log Follow-up Remark</h3>
                <p className="text-xs text-slate-500">{activeFollowUpInquiry.customerName}</p>
              </div>
              <button
                onClick={() => setActiveFollowUpInquiry(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Update Inquiry Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as InquiryStatus)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                >
                  <option value="NEW">NEW (Unattended)</option>
                  <option value="CONTACTED">CONTACTED (Follow-up in progress)</option>
                  <option value="SCHEDULED_VISIT">SCHEDULED_VISIT (Site visit set)</option>
                  <option value="CONVERTED">CONVERTED (Booking agreed / paid)</option>
                  <option value="DROPPED">DROPPED (Not interested / out of budget)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Follow-up Notes / Remarks *</label>
                <textarea
                  rows={3}
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="e.g. Discussed security deposit terms; client agreed to visit on Saturday morning."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              {/* History */}
              {activeFollowUpInquiry.notesHistory && activeFollowUpInquiry.notesHistory.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Previous Remarks</span>
                  <div className="mt-1.5 max-h-32 overflow-y-auto space-y-1.5 text-[11px]">
                    {activeFollowUpInquiry.notesHistory.map((nh, idx) => (
                      <div key={idx} className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>{nh.author}</span>
                          <span>{nh.date}</span>
                        </div>
                        <p className="text-slate-800 mt-0.5">{nh.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setActiveFollowUpInquiry(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFollowUp}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Composer Modal */}
      {whatsAppInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Send WhatsApp Message</h3>
              </div>
              <button
                onClick={() => setWhatsAppInquiry(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-200">
                <p>Recipient: <strong>{whatsAppInquiry.customerName}</strong> ({whatsAppInquiry.customerPhone})</p>
                <p className="text-slate-500 mt-0.5">Property: {whatsAppInquiry.propertyName}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Message Content</label>
                <textarea
                  rows={4}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setWhatsAppInquiry(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Launch WhatsApp Web / App</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Logger Modal */}
      {callInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Direct Customer Call</h3>
              </div>
              <button
                onClick={() => setCallInquiry(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-center space-y-2">
              <p className="text-xs text-slate-600">Clicking below will dial via your device dialer:</p>
              <a
                href={`tel:${callInquiry.customerPhone}`}
                className="inline-block text-xl font-black text-blue-700 hover:underline"
              >
                {callInquiry.customerPhone}
              </a>
              <p className="text-xs font-semibold text-slate-800">{callInquiry.customerName}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Log Call Outcome / Notes</label>
              <textarea
                rows={3}
                value={callOutcomeNote}
                onChange={(e) => setCallOutcomeNote(e.target.value)}
                placeholder="What did the customer say during the call?"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setCallInquiry(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleLogCall}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Log Call & Mark Contacted
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
