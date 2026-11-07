'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface ManagePropertyModalProps {
  property: Property;
  onClose: () => void;
  onUpdate: (updated: Property) => void;
  onDelete: (id: string) => void;
  onRequestOwnerAuth: (id: string) => void;
  onApproveByAdmin: (id: string) => void;
}

export function ManagePropertyModal({
  property,
  onClose,
  onUpdate,
  onDelete,
  onRequestOwnerAuth,
  onApproveByAdmin,
}: ManagePropertyModalProps) {
  const isFlat = property.category === 'FLAT';
  const [availableBeds, setAvailableBeds] = useState(property.availableBeds ?? 1);
  const [availabilityStatus, setAvailabilityStatus] = useState(property.availabilityStatus);
  const [isPublished, setIsPublished] = useState(property.isPublished);
  const [adminApprovalStatus, setAdminApprovalStatus] = useState(property.adminApprovalStatus);
  const [ownerAuthorizationStatus, setOwnerAuthorizationStatus] = useState(
    property.ownerAuthorizationStatus
  );

  const handleSave = () => {
    const updated: Property = {
      ...property,
      availableBeds: isFlat ? undefined : availableBeds,
      availabilityStatus,
      isPublished: adminApprovalStatus === 'APPROVED' && ownerAuthorizationStatus === 'AUTHORIZED' ? isPublished : false,
      adminApprovalStatus,
      ownerAuthorizationStatus,
    };
    onUpdate(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Manage Property Inventory</h3>
            <p className="text-xs text-slate-500 font-mono">ID: {property.id} · {property.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Occupancy / Bed Management */}
        {!isFlat ? (
          <div className="space-y-2 rounded-xl bg-slate-50 p-4 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block">
              Adjust Available Bed Count (Total: {property.totalBeds})
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={property.totalBeds || 100}
                value={availableBeds}
                onChange={(e) => setAvailableBeds(parseInt(e.target.value) || 0)}
                className="w-24 rounded-lg border border-slate-300 p-2 text-sm font-bold text-slate-900 bg-white tabular-nums"
              />
              <span className="text-xs text-slate-600">
                {availableBeds === 0
                  ? 'Property is fully occupied'
                  : `${availableBeds} beds available for move-in`}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs">
            <span className="font-bold text-slate-800">Flat Configuration</span>
            <p className="text-slate-600">
              Type: <strong>{property.subcategory}</strong> · Capacity: <strong>{property.minOccupancy} to {property.maxOccupancy} persons</strong>
            </p>
          </div>
        )}

        {/* Status Settings */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Listing Availability Status</label>
            <select
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
            >
              <option value="AVAILABLE">AVAILABLE (Accepting instant bookings)</option>
              <option value="FEW_BEDS_LEFT">FEW BEDS LEFT (High demand)</option>
              <option value="OCCUPIED">OCCUPIED (Waitlist only)</option>
              <option value="MAINTENANCE">MAINTENANCE (Temporarily paused)</option>
            </select>
          </div>

          {/* Owner Authorization check */}
          <div className="rounded-xl border border-slate-200 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Owner Authorization Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                  ownerAuthorizationStatus === 'AUTHORIZED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {ownerAuthorizationStatus}
              </span>
            </div>
            {ownerAuthorizationStatus !== 'AUTHORIZED' && (
              <button
                type="button"
                onClick={() => {
                  onRequestOwnerAuth(property.id);
                  setOwnerAuthorizationStatus('AUTHORIZED');
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Simulate Owner Digital Signature (Approve)</span>
              </button>
            )}
          </div>

          {/* Admin Approval check */}
          <div className="rounded-xl border border-slate-200 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Admin Approval Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                  adminApprovalStatus === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {adminApprovalStatus}
              </span>
            </div>
            {adminApprovalStatus !== 'APPROVED' && (
              <button
                type="button"
                onClick={() => {
                  onApproveByAdmin(property.id);
                  setAdminApprovalStatus('APPROVED');
                  setIsPublished(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Simulate PEFLARMO Admin Approval (Go Live)</span>
              </button>
            )}
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-bold text-slate-800">Marketplace Visibility</span>
              <p className="text-[11px] text-slate-500">
                {adminApprovalStatus === 'APPROVED' && ownerAuthorizationStatus === 'AUTHORIZED'
                  ? 'Show listing publicly on peflarmo.com'
                  : 'Cannot publish without Admin Approval and Owner Authorization'}
              </p>
            </div>
            <input
              type="checkbox"
              disabled={adminApprovalStatus !== 'APPROVED' || ownerAuthorizationStatus !== 'AUTHORIZED'}
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5 rounded-md text-blue-600 focus:ring-blue-500 disabled:opacity-40"
            />
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to remove property "${property.name}"?`)) {
                onDelete(property.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Listing</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
