'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  FileQuestion,
  ChevronDown,
  Send,
  CheckCircle2,
  Headphones,
} from 'lucide-react';

export function SupportView() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Listing Approval');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does Admin Approval take after submitting a property listing?',
      a: 'PEFLARMO compliance reviews submissions within 2 to 4 business hours. If physical inspection is required or owner agreement is pending signature, the compliance team will flag remarks directly in your dashboard.',
    },
    {
      q: 'Can I publish a property without Owner Authorization?',
      a: 'No. As per RERA regulations and PEFLARMO quality policy, owner authorization is mandatory before any property can go live to prospective tenants.',
    },
    {
      q: 'When are commission payouts disbursed to my bank account?',
      a: 'Commission payouts are credited automatically every Friday for all tenancies where move-in has occurred and token or security deposit has cleared with PEFLARMO escrow.',
    },
    {
      q: 'How do PG and Flat occupancy rules differ on PEFLARMO?',
      a: 'For PGs, Rooms, and Hostels, pricing and availability are strictly managed on a per-person bed basis (Single, Double, Triple, Four, Multiple Sharing). For Flats, BHK (1BHK, 2BHK, 3BHK, 4BHK) defines the entire unit with minimum and maximum person occupancy, and rent is fixed for the flat rather than split per person.',
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTicketSubject('');
    setTicketDescription('');
    setTimeout(() => setTicketSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            PEFLARMO Broker Desk & Partner Support
          </h2>
          <p className="text-xs text-slate-500">
            Dedicated account support for broker operations, listing clearances & payouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:18008917335"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Toll-Free: 1800-891-PEF</span>
          </a>
        </div>
      </div>

      {ticketSubmitted && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Support Ticket #TK-8921 logged successfully. Priority SLA response within 45 minutes.
        </div>
      )}

      {/* Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 w-fit">
            <Headphones className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Dedicated Relationship Lead</h3>
          <p className="text-xs text-slate-600">Priya Menon (Partner Success)</p>
          <p className="text-[11px] text-blue-600 font-medium">+91 98201 11234</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 w-fit">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">WhatsApp Broker Desk</h3>
          <p className="text-xs text-slate-600">Instant answers for urgent site visits</p>
          <a
            href="https://wa.me/919820111234?text=Hello%20PEFLARMO%20Support"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-emerald-700 font-bold hover:underline block"
          >
            Chat with Desk →
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
          <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 w-fit">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Compliance & Escrow Email</h3>
          <p className="text-xs text-slate-600">agreements@peflarmo.com</p>
          <p className="text-[11px] text-slate-400">Response SLA: 2 Hours</p>
        </div>
      </div>

      {/* Ticket Submission Form */}
      <form
        onSubmit={handleSubmitTicket}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Raise Priority Support Ticket
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Ticket Category *</label>
            <select
              value={ticketCategory}
              onChange={(e) => setTicketCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
            >
              <option value="Listing Approval">Listing Approval / Verification</option>
              <option value="Owner Authorization">Owner Authorization Issue</option>
              <option value="Commission Disbursement">Commission Payout / TDS</option>
              <option value="Tenant KYC">Tenant Verification & Agreement</option>
              <option value="Technical Issue">Platform / Bug Report</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Subject / Property Reference *</label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Urgent review for Skyline 2BHK Bandra"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Describe the Issue in Detail *</label>
            <textarea
              rows={4}
              required
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Provide background, customer/property references, and expected resolution..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            <Send className="h-4 w-4" />
            <span>Submit Ticket</span>
          </button>
        </div>
      </form>

      {/* FAQ Accordion */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Broker Frequently Asked Questions
        </h3>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-blue-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
