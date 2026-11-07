'use client';

import React, { useState, useMemo } from 'react';
import {
  Property,
  PropertyCategory,
  PropertySubcategory,
  CATEGORY_SUBCATEGORIES_MAP,
} from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit3,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  Clock,
  Building2,
  Bed,
  Hotel,
  Home,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { PropertyDetailModal } from './PropertyDetailModal';
import { ManagePropertyModal } from './ManagePropertyModal';

interface MyPropertiesViewProps {
  properties: Property[];
  onAddNew: () => void;
  onEditProperty: (property: Property) => void;
  onUpdateProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onRequestOwnerAuth: (id: string) => void;
  onApproveByAdmin: (id: string) => void;
}

export function MyPropertiesView({
  properties,
  onAddNew,
  onEditProperty,
  onUpdateProperty,
  onDeleteProperty,
  onRequestOwnerAuth,
  onApproveByAdmin,
}: MyPropertiesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'ALL'>('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [managingProperty, setManagingProperty] = useState<Property | null>(null);

  // Available subcategories based strictly on selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'ALL') return [];
    return CATEGORY_SUBCATEGORIES_MAP[selectedCategory] || [];
  }, [selectedCategory]);

  const handleCategoryChange = (cat: PropertyCategory | 'ALL') => {
    setSelectedCategory(cat);
    setSelectedSubcategory('ALL'); // Reset subcategory when category changes
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = prop.name.toLowerCase().includes(q);
        const matchesLoc = prop.locality.toLowerCase().includes(q) || prop.city.toLowerCase().includes(q);
        const matchesSub = prop.subcategory.toLowerCase().includes(q);
        const matchesOwner = prop.ownerName.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesSub && !matchesOwner) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && prop.category !== selectedCategory) {
        return false;
      }

      // Subcategory
      if (selectedSubcategory !== 'ALL' && prop.subcategory !== selectedSubcategory) {
        return false;
      }

      // Status
      if (statusFilter === 'ACTIVE') {
        if (!prop.isPublished || prop.adminApprovalStatus !== 'APPROVED') return false;
      } else if (statusFilter === 'PENDING') {
        if (prop.adminApprovalStatus !== 'PENDING_APPROVAL' && prop.adminApprovalStatus !== 'DRAFT') {
          return false;
        }
      } else if (statusFilter === 'NEEDS_AUTH') {
        if (prop.ownerAuthorizationStatus === 'AUTHORIZED') return false;
      }

      return true;
    });
  }, [properties, searchQuery, selectedCategory, selectedSubcategory, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            My Authorized Properties ({filteredProperties.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage your authorized PG, Flat, Room, and Hostel inventory
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, locality, landmark, subcategory, or owner..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active & Published</option>
              <option value="PENDING">Pending Admin Approval</option>
              <option value="NEEDS_AUTH">Pending Owner Sign</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Tabs adhering to Section C rules */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Category:
          </span>
          {(['ALL', 'PG', 'FLAT', 'ROOM', 'HOSTEL'] as const).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            );
          })}
        </div>

        {/* Subcategory Filter (Strictly showing only subcategories of selected category) */}
        {selectedCategory !== 'ALL' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              {selectedCategory} Subcategories:
            </span>
            <button
              onClick={() => setSelectedSubcategory('ALL')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                selectedSubcategory === 'ALL'
                  ? 'bg-blue-100 text-blue-800 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All {selectedCategory}
            </button>
            {availableSubcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    isSelected
                      ? 'bg-blue-100 text-blue-800 font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Properties Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">No properties found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, category, or subcategory filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedSubcategory('ALL');
              setStatusFilter('ALL');
            }}
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => {
            const isFlat = property.category === 'FLAT';
            return (
              <div
                key={property.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition hover:border-blue-200 hover:shadow-lg"
              >
                <div>
                  {/* Property Image & Status Badges */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={property.images[0] || '/images/flat_luxury.jpg'}
                      alt={property.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Category & Subcategory Tag */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-blue-700 shadow-xs backdrop-blur-xs">
                        {property.category} · {property.subcategory}
                      </span>
                    </div>

                    {/* Approval Status Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-xs ${
                          property.adminApprovalStatus === 'APPROVED'
                            ? 'bg-emerald-600 text-white'
                            : property.adminApprovalStatus === 'PENDING_APPROVAL'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        {property.adminApprovalStatus === 'APPROVED'
                          ? 'Approved'
                          : property.adminApprovalStatus === 'PENDING_APPROVAL'
                          ? 'In Review'
                          : 'Draft'}
                      </span>
                    </div>

                    {/* Bottom overlay with locality */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-3 pt-6 text-white">
                      <p className="truncate text-xs font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                        {property.locality}, {property.city}
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3
                        onClick={() => setViewingProperty(property)}
                        className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-600 transition cursor-pointer"
                        title={property.name}
                      >
                        {property.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        ID: {property.id} · {property.furnishingStatus}
                      </p>
                    </div>

                    {/* Pricing & Capacity Adhering to Section E */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">
                          {isFlat ? 'Flat Monthly Rent' : 'Rent / Person'}
                        </span>
                        <span className="text-base font-extrabold text-blue-700 tabular-nums">
                          {formatCurrency(property.monthlyRent)}
                          <span className="text-[10px] font-normal text-slate-500">
                            {isFlat ? '/mo' : '/mo'}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] border-t border-slate-200/60 pt-1.5">
                        <span className="text-slate-600">
                          {isFlat ? 'Flat Configuration:' : 'Available Beds:'}
                        </span>
                        <span className="font-bold text-slate-900">
                          {isFlat
                            ? `${property.subcategory} (${property.minOccupancy}-${property.maxOccupancy} persons)`
                            : `${property.availableBeds} of ${property.totalBeds} Beds`}
                        </span>
                      </div>
                    </div>

                    {/* Owner Auth & Compliance Line */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 truncate">
                        Owner: <strong className="font-medium text-slate-800 truncate">{property.ownerName}</strong>
                      </span>
                      <span
                        className={`shrink-0 font-semibold ${
                          property.ownerAuthorizationStatus === 'AUTHORIZED'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {property.ownerAuthorizationStatus === 'AUTHORIZED' ? 'Authorized' : 'Pending Sign'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Working Action Buttons: Edit, View, Manage */}
                <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/40 p-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setViewingProperty(property)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-white border border-slate-200 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-2xs"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditProperty(property)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-white border border-slate-200 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition shadow-2xs"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setManagingProperty(property)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Manage</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Property Detail Modal */}
      {viewingProperty && (
        <PropertyDetailModal
          property={viewingProperty}
          onClose={() => setViewingProperty(null)}
          onEdit={(p) => {
            setViewingProperty(null);
            onEditProperty(p);
          }}
          onManage={(p) => {
            setViewingProperty(null);
            setManagingProperty(p);
          }}
        />
      )}

      {/* Manage Property Modal */}
      {managingProperty && (
        <ManagePropertyModal
          property={managingProperty}
          onClose={() => setManagingProperty(null)}
          onUpdate={onUpdateProperty}
          onDelete={onDeleteProperty}
          onRequestOwnerAuth={onRequestOwnerAuth}
          onApproveByAdmin={onApproveByAdmin}
        />
      )}
    </div>
  );
}
