'use client';

import React, { useState } from 'react';
import { PropertyOwner, Property } from '@/lib/types';
import {
  KeyRound,
  Search,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Building2,
  Plus,
  X,
} from 'lucide-react';

interface OwnersViewProps {
  owners: PropertyOwner[];
  properties: Property[];
  onRequestOwnerAuth: (propertyId: string) => void;
}

export function OwnersView({
  owners,
  properties,
  onRequestOwnerAuth,
}: OwnersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentToast, setSentToast] = useState<string | null>(null);

  const filteredOwners = owners.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendReminder = (owner: PropertyOwner) => {
    // Find un-authorized properties of this owner
    const unauth = properties.filter(
      (p) => p.ownerName.toLowerCase().includes(owner.name.toLowerCase()) && p.ownerAuthorizationStatus !== 'AUTHORIZED'
    );
    if (unauth.length > 0) {
      unauth.forEach((p) => onRequestOwnerAuth(p.id));
    }
    setSentToast(`Digital authorization agreement link re-sent via WhatsApp and SMS to ${owner.name} (${owner.phone}).`);
    setTimeout(() => setSentToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Property Owners & Authorization Directory ({owners.length})
          </h2>
          <p className="text-xs text-slate-500">
            Mandatory RERA owner authorizations, digitized agreements and owner communication
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search owners by name, phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pr-3 pl-8 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {sentToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {sentToast}
        </div>
      )}

      {/* Owners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOwners.map((owner) => {
          const ownerProperties = properties.filter((p) =>
            p.ownerName.toLowerCase().includes(owner.name.toLowerCase())
          );
          const hasPending = ownerProperties.some((p) => p.ownerAuthorizationStatus !== 'AUTHORIZED');

          return (
            <div
              key={owner.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{owner.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">PAN: {owner.panNumber}</p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      owner.agreementStatus === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {owner.agreementStatus === 'ACTIVE' ? 'Active NOC' : 'Pending Sign'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-2.5">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{owner.email}</span>
                  </div>
                </div>

                {/* Assigned Properties */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs space-y-1.5">
                  <span className="font-semibold text-slate-700 block">
                    Assigned Properties ({ownerProperties.length})
                  </span>
                  {ownerProperties.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-[11px]">
                      <span className="truncate max-w-[170px] text-slate-900 font-medium">
                        {p.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          p.ownerAuthorizationStatus === 'AUTHORIZED'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {p.ownerAuthorizationStatus === 'AUTHORIZED' ? 'Authorized' : 'Pending Sign'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${owner.phone}`}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50"
                    title="Call Owner"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${owner.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                    title="WhatsApp"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </a>
                </div>

                <button
                  onClick={() => handleSendReminder(owner)}
                  className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                >
                  Send Agreement
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
