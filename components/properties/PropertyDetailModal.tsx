'use client';

import React from 'react';
import {
  Property,
  PropertyCategory,
} from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  MapPin,
  Building2,
  Bed,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onEdit: (property: Property) => void;
  onManage: (property: Property) => void;
}

export function PropertyDetailModal({
  property,
  onClose,
  onEdit,
  onManage,
}: PropertyDetailModalProps) {
  const isFlat = property.category === 'FLAT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
              {property.category} · {property.subcategory}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {property.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(property);
              }}
              className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Edit Property
            </button>
            <button
              onClick={() => {
                onClose();
                onManage(property);
              }}
              className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Manage Status
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Main Visuals & Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.images[0] || '/images/flat_luxury.jpg'}
                  alt={property.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 rounded-lg bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                  {property.locality}, {property.city}
                </div>
              </div>

              {/* Secondary thumbnail list */}
              {property.images.length > 1 && (
                <div className="flex gap-2">
                  {property.images.map((img, i) => (
                    <div
                      key={i}
                      className="h-16 w-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt="thumb"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{property.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  {property.address}
                </p>

                {/* Status Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                      property.adminApprovalStatus === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : property.adminApprovalStatus === 'PENDING_APPROVAL'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Admin: {property.adminApprovalStatus.replace('_', ' ')}
                  </span>

                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                      property.ownerAuthorizationStatus === 'AUTHORIZED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    Owner: {property.ownerAuthorizationStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Pricing Box adhering to Section E rules */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {isFlat ? 'Flat Monthly Rent' : 'Rent Per Person'}
                  </span>
                  <div className="text-2xl font-black text-blue-700 tabular-nums">
                    {formatCurrency(property.monthlyRent)}
                    <span className="text-xs font-medium text-slate-500">
                      {isFlat ? '/mo' : '/person/mo'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-blue-200/60 pt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(property.securityDeposit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <span className="font-semibold text-slate-900">
                      {property.isMaintenanceIncluded
                        ? 'Included in Rent'
                        : formatCurrency(property.maintenanceCharges)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notice / Lock-in:</span>
                    <span className="font-semibold text-slate-900">
                      {property.noticePeriodDays} Days / {property.lockInMonths} Mo
                    </span>
                  </div>
                </div>
              </div>

              {/* Capacity / Sharing Details adhering to Section E rules */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500">
                  {isFlat ? 'Flat BHK & Person Occupancy' : 'Sharing & Bed Capacity'}
                </span>

                {isFlat ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Selected BHK:</span>
                      <span className="font-bold text-blue-700">{property.subcategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Min Occupancy:</span>
                      <span className="font-semibold text-slate-900">{property.minOccupancy || 2} Persons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Max Occupancy:</span>
                      <span className="font-semibold text-slate-900">{property.maxOccupancy || 4} Persons</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      BHK and person count are recorded separately. Full flat rent is fixed for the selected occupancy.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Selected Sharing Type:</span>
                      <span className="font-bold text-blue-700">{property.subcategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Bed Capacity:</span>
                      <span className="font-semibold text-slate-900">{property.totalBeds} Beds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Available Beds:</span>
                      <span className="font-bold text-emerald-600">{property.availableBeds} Beds Left</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Occupancy Status:</span>
                      <span className="font-semibold text-slate-900">
                        {property.totalBeds && property.availableBeds !== undefined
                          ? `${Math.round(((property.totalBeds - property.availableBeds) / property.totalBeds) * 100)}% Occupied`
                          : 'Available'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Available Amenities & Services ({property.amenities.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2 text-xs text-slate-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner & Broker Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1 text-xs">
              <span className="font-bold text-slate-900">Property Owner Information</span>
              <p className="text-slate-700">Name: <strong className="font-semibold">{property.ownerName}</strong></p>
              <p className="text-slate-700">Phone: <strong className="font-semibold">{property.ownerPhone}</strong></p>
              <p className="text-slate-700">Agreement Ref: <code className="text-[11px] font-mono">{property.ownerDocumentRef || 'AGR-PEF-NOC'}</code></p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1 text-xs">
              <span className="font-bold text-slate-900">Broker Authorization & Commission</span>
              <p className="text-slate-700">Managing Broker: <strong className="font-semibold">Rahul Sharma (BRK-78429)</strong></p>
              <p className="text-slate-700">Brokerage Rate: <strong className="font-semibold text-emerald-700">{property.brokerCommissionPercent}% of 1st Month Rent</strong></p>
              <p className="text-slate-700">Submission Date: <strong className="font-semibold">{property.submissionDate}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
