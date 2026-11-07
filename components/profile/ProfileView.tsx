'use client';

import React, { useState } from 'react';
import { BrokerProfile } from '@/lib/types';
import {
  UserCircle2,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  CheckCircle2,
  FileCheck2,
  Save,
} from 'lucide-react';

interface ProfileViewProps {
  broker: BrokerProfile;
}

export function ProfileView({ broker }: ProfileViewProps) {
  const [phone, setPhone] = useState(broker.phone);
  const [email, setEmail] = useState(broker.email);
  const [agencyName, setAgencyName] = useState(broker.agencyName);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 font-extrabold text-2xl text-white shadow-md shadow-blue-500/20">
            {broker.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{broker.name}</h2>
              <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                RERA Certified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Broker ID: <strong>{broker.id}</strong> · Joined {broker.joinedDate}
            </p>
            <p className="text-xs text-blue-700 font-semibold mt-0.5">
              Tier: {broker.tier} Partner
            </p>
          </div>
        </div>
      </div>

      {savedToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Broker profile updated successfully.
        </div>
      )}

      {/* RERA and Compliance Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileCheck2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">RERA Regulatory Accreditation</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">RERA License Number</span>
            <p className="font-bold text-slate-900 font-mono">{broker.reraNumber}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">PAN Card</span>
            <p className="font-bold text-slate-900 font-mono">{broker.panNumber}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">KYC Status</span>
            <p className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> 100% Verified
            </p>
          </div>
        </div>
      </div>

      {/* Service Territories */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Authorized Service Territories</h3>
        </div>
        <p className="text-xs text-slate-500">
          You are permitted to list and manage PG, Flat, Room, and Hostel inventory in the following municipal zones:
        </p>
        <div className="flex flex-wrap gap-2">
          {broker.serviceAreas.map((area) => (
            <span
              key={area}
              className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Bank Account */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Payout Bank Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 text-[11px]">Beneficiary Name:</span>
            <p className="font-bold text-slate-900 text-sm">{broker.bankAccount.accountHolder}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">Bank:</span>
            <p className="font-bold text-slate-900 text-sm">{broker.bankAccount.bankName}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">Account Number:</span>
            <p className="font-bold text-slate-900 font-mono text-sm">{broker.bankAccount.accountNumberMasked}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">IFSC Code:</span>
            <p className="font-bold text-slate-900 font-mono text-sm">{broker.bankAccount.ifsc}</p>
          </div>
        </div>
      </div>

      {/* Edit Contact Form */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Update Contact Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Mobile Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Agency / Firm Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
