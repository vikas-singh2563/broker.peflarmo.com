'use client';

import React, { useState, useEffect } from 'react';
import {
  Property,
  PropertyCategory,
  PropertySubcategory,
  CATEGORY_SUBCATEGORIES_MAP,
} from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Building2,
  Home,
  Bed,
  Hotel,
  Check,
  ArrowRight,
  ArrowLeft,
  Save,
  Eye,
  Send,
  Upload,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';

interface AddPropertyWizardProps {
  initialProperty?: Property | null;
  onSave: (property: Property) => void;
  onCancel: () => void;
  onSaveDraft?: (draft: Partial<Property>) => void;
}

const STEP_LABELS = [
  'Category',
  'Subcategory',
  'Name',
  'Location',
  'Details',
  'Capacity',
  'Pricing',
  'Amenities',
  'Media',
  'Owner Details',
  'Preview',
  'Submit',
];

const STANDARD_AMENITIES = [
  'High-Speed Wi-Fi',
  'Air Conditioning',
  'Daily Housekeeping',
  'RO Purified Water',
  'Power Backup',
  '24x7 Security & CCTV',
  'Washing Machine',
  'Refrigerator',
  'Hot Water Geyser',
  'Attached Washroom',
  'Balcony View',
  'Covered Parking',
  'Elevator / Lift',
  'Modular Kitchen',
  'Nutritious 3-Time Meals',
  'Biometric Access',
  'Study Desk & Chair',
  'Gymnasium',
];

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Luxury Flat Interior', url: '/images/flat_luxury.jpg' },
  { label: 'Executive PG Suite', url: '/images/pg_suite.jpg' },
  { label: 'Boutique Hostel Dorm', url: '/images/hostel_dorm.jpg' },
  { label: 'Cozy Private Studio', url: '/images/room_studio.jpg' },
];

export function AddPropertyWizard({
  initialProperty,
  onSave,
  onCancel,
  onSaveDraft,
}: AddPropertyWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Form State
  const [category, setCategory] = useState<PropertyCategory>(
    initialProperty?.category || 'PG'
  );
  const [subcategory, setSubcategory] = useState<PropertySubcategory>(
    initialProperty?.subcategory || 'Double Sharing'
  );
  const [name, setName] = useState(initialProperty?.name || '');
  
  // Location
  const [city, setCity] = useState(initialProperty?.city || 'Mumbai');
  const [locality, setLocality] = useState(initialProperty?.locality || '');
  const [address, setAddress] = useState(initialProperty?.address || '');
  const [landmark, setLandmark] = useState(initialProperty?.landmark || '');
  const [pincode, setPincode] = useState(initialProperty?.pincode || '');

  // Specs
  const [furnishingStatus, setFurnishingStatus] = useState<Property['furnishingStatus']>(
    initialProperty?.furnishingStatus || 'Fully Furnished'
  );
  const [tenantPreference, setTenantPreference] = useState<Property['tenantPreference']>(
    initialProperty?.tenantPreference || 'Co-ed'
  );
  const [floorNumber, setFloorNumber] = useState<number>(initialProperty?.floorNumber || 3);
  const [totalFloors, setTotalFloors] = useState<number>(initialProperty?.totalFloors || 10);
  const [propertyAge, setPropertyAge] = useState(initialProperty?.propertyAge || '1 Year');
  const [availableFrom, setAvailableFrom] = useState(
    initialProperty?.availableFrom || new Date().toISOString().split('T')[0]
  );
  const [superBuiltUpSqFt, setSuperBuiltUpSqFt] = useState<number>(
    initialProperty?.superBuiltUpSqFt || 850
  );

  // Capacity & Occupancy (PG / Room / Hostel vs Flat)
  const [totalBeds, setTotalBeds] = useState<number>(initialProperty?.totalBeds || 6);
  const [availableBeds, setAvailableBeds] = useState<number>(initialProperty?.availableBeds || 2);
  const [minOccupancy, setMinOccupancy] = useState<number>(initialProperty?.minOccupancy || 2);
  const [maxOccupancy, setMaxOccupancy] = useState<number>(initialProperty?.maxOccupancy || 4);

  // Pricing
  const [monthlyRent, setMonthlyRent] = useState<number>(initialProperty?.monthlyRent || 15000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(
    initialProperty?.securityDeposit || 30000
  );
  const [maintenanceCharges, setMaintenanceCharges] = useState<number>(
    initialProperty?.maintenanceCharges || 0
  );
  const [isMaintenanceIncluded, setIsMaintenanceIncluded] = useState<boolean>(
    initialProperty?.isMaintenanceIncluded ?? true
  );
  const [noticePeriodDays, setNoticePeriodDays] = useState<number>(
    initialProperty?.noticePeriodDays || 30
  );
  const [lockInMonths, setLockInMonths] = useState<number>(
    initialProperty?.lockInMonths || 3
  );
  const [foodIncluded, setFoodIncluded] = useState<boolean>(
    initialProperty?.foodIncluded ?? (category === 'PG' || category === 'HOSTEL')
  );

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialProperty?.amenities || [
      'High-Speed Wi-Fi',
      'Air Conditioning',
      'Daily Housekeeping',
      'RO Purified Water',
      'Power Backup',
      '24x7 Security & CCTV',
      'Attached Washroom',
    ]
  );

  // Media
  const [selectedImages, setSelectedImages] = useState<string[]>(
    initialProperty?.images && initialProperty.images.length > 0
      ? initialProperty.images
      : ['/images/flat_luxury.jpg', '/images/room_studio.jpg']
  );
  const [videoTourUrl, setVideoTourUrl] = useState(initialProperty?.videoTourUrl || '');

  // Owner Details
  const [ownerName, setOwnerName] = useState(initialProperty?.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(initialProperty?.ownerPhone || '');
  const [ownerEmail, setOwnerEmail] = useState(initialProperty?.ownerEmail || '');
  const [ownerAuthorizationStatus, setOwnerAuthorizationStatus] = useState<Property['ownerAuthorizationStatus']>(
    initialProperty?.ownerAuthorizationStatus || 'AUTHORIZED'
  );
  const [brokerCommissionPercent, setBrokerCommissionPercent] = useState<number>(
    initialProperty?.brokerCommissionPercent || 100
  );

  // Step 12 Admin submission notes
  const [adminNotes, setAdminNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Whenever category changes, ensure subcategory is strictly a valid subcategory for that category
  const handleCategorySelect = (newCategory: PropertyCategory) => {
    setCategory(newCategory);
    const validSubcategories = CATEGORY_SUBCATEGORIES_MAP[newCategory];
    if (!validSubcategories.includes(subcategory)) {
      setSubcategory(validSubcategories[0] as PropertySubcategory);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSaveDraft = () => {
    const draft: Partial<Property> = {
      category,
      subcategory,
      name,
      city,
      locality,
      address,
      landmark,
      pincode,
      furnishingStatus,
      tenantPreference,
      floorNumber,
      totalFloors,
      propertyAge,
      availableFrom,
      superBuiltUpSqFt,
      totalBeds,
      availableBeds,
      minOccupancy,
      maxOccupancy,
      monthlyRent,
      securityDeposit,
      maintenanceCharges,
      isMaintenanceIncluded,
      noticePeriodDays,
      lockInMonths,
      foodIncluded,
      amenities: selectedAmenities,
      images: selectedImages,
      videoTourUrl,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerAuthorizationStatus,
      brokerCommissionPercent,
    };
    onSaveDraft?.(draft);
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  const handleFinalSubmit = () => {
    const isFlat = category === 'FLAT';
    const newProperty: Property = {
      id: initialProperty?.id || 'PROP-' + Math.floor(100 + Math.random() * 900),
      name: name.trim() || `Peflarmo ${category} ${subcategory} - ${locality || city}`,
      category,
      subcategory,
      brokerId: 'BRK-78429',
      city,
      locality: locality || 'Central City',
      address: address || `${locality}, ${city}`,
      landmark,
      pincode: pincode || '400001',
      coordinates: { lat: 19.076, lng: 72.8777 },
      furnishingStatus,
      tenantPreference,
      floorNumber,
      totalFloors,
      propertyAge,
      availableFrom,
      superBuiltUpSqFt,
      
      // Capacity logic
      ...(isFlat
        ? {
            bhkType: subcategory as any,
            minOccupancy,
            maxOccupancy,
            flatRent: monthlyRent,
          }
        : {
            sharingType: subcategory,
            totalBeds,
            availableBeds,
            rentPerPerson: monthlyRent,
          }),

      monthlyRent,
      securityDeposit,
      maintenanceCharges,
      isMaintenanceIncluded,
      noticePeriodDays,
      lockInMonths,
      foodIncluded,
      amenities: selectedAmenities,
      images: selectedImages.length > 0 ? selectedImages : ['/images/flat_luxury.jpg'],
      videoTourUrl,
      ownerName: ownerName.trim() || 'Peflarmo Verified Owner',
      ownerPhone: ownerPhone.trim() || '+91 98200 12345',
      ownerEmail: ownerEmail.trim() || 'owner@peflarmo.com',
      ownerAuthorizationStatus,
      ownerAgreementDate: new Date().toISOString().split('T')[0],
      ownerDocumentRef: 'AGR-PEF-AUTH-' + Math.floor(1000 + Math.random() * 9000),
      brokerCommissionPercent,
      adminApprovalStatus: 'PENDING_APPROVAL',
      adminReviewRemarks: adminNotes || 'Submitted for broker listing approval.',
      submissionDate: new Date().toISOString().split('T')[0],
      availabilityStatus: 'AVAILABLE',
      isPublished: false,
      totalViews: 0,
      totalInquiries: 0,
    };

    onSave(newProperty);
  };

  const isNextDisabled = () => {
    if (currentStep === 3 && !name.trim()) return true;
    if (currentStep === 4 && (!locality.trim() || !city.trim())) return true;
    if (currentStep === 7 && monthlyRent <= 0) return true;
    if (currentStep === 10 && (!ownerName.trim() || !ownerPhone.trim())) return true;
    if (currentStep === 12 && !termsAccepted) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Top Wizard Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
              Step {currentStep} of 12
            </span>
            <h2 className="text-base font-bold text-slate-900">
              {STEP_LABELS[currentStep - 1]} Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete all 12 steps to submit the property for PEFLARMO Admin Verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Save className="h-4 w-4 text-blue-600" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      {draftSavedToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Listing draft saved to browser storage. You can resume at any time.
        </div>
      )}

      {/* Step Progress Pills */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center min-w-[760px] gap-1.5">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setCurrentStep(stepNum)}
                className={`flex-1 rounded-xl px-2.5 py-2 text-left transition border ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                    : isCompleted
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    : 'border-slate-200/60 bg-slate-50/60 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="tabular-nums">{stepNum}.</span>
                  )}
                  <span className="truncate">{label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Form Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs min-h-[460px]">
        {/* STEP 1: Select Property Category */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">Step 1: Select Property Category</h3>
            <p className="text-xs text-slate-500">
              Choose the primary classification for this listing. Only corresponding subcategories will be available in the next step.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  id: 'PG' as PropertyCategory,
                  title: 'PG (Paying Guest)',
                  desc: 'Furnished shared or single accommodations with food & daily services.',
                  icon: Building2,
                },
                {
                  id: 'FLAT' as PropertyCategory,
                  title: 'FLAT / Apartment',
                  desc: 'Independent 1BHK, 2BHK, 3BHK, or 4BHK flats for families or bachelors.',
                  icon: Home,
                },
                {
                  id: 'ROOM' as PropertyCategory,
                  title: 'ROOM',
                  desc: 'Private or shared individual rooms in a co-living apartment.',
                  icon: Bed,
                },
                {
                  id: 'HOSTEL' as PropertyCategory,
                  title: 'HOSTEL',
                  desc: 'Student or working professional dormitories with multi-bed sharing.',
                  icon: Hotel,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = category === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleCategorySelect(item.id)}
                    className={`cursor-pointer rounded-2xl border p-5 transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`rounded-xl p-2.5 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      {isSelected && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <h4 className="mt-3.5 font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Select Subcategory */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 2: Select Subcategory for {category}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Displaying only authorized subcategories for <strong>{category}</strong>.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50/60 p-3 text-xs text-blue-800 border border-blue-100">
              Selected Category: <strong className="font-bold">{category}</strong>. (PG sharing options are never shown under Flat; Flat BHK options are never shown under PG, Room or Hostel).
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {CATEGORY_SUBCATEGORIES_MAP[category].map((sub) => {
                const isSelected = subcategory === sub;
                return (
                  <div
                    key={sub}
                    onClick={() => setSubcategory(sub as PropertySubcategory)}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{sub}</span>
                      {isSelected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Property Name */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-slate-900">Step 3: Property Name</h3>
            <p className="text-xs text-slate-500">
              Enter a professional, recognizable title for your listing on the PEFLARMO network.
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Listing Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Peflarmo Royal Palms Luxury PG / Skyline Heights 2BHK"
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400">
                Recommended formula: [Peflarmo] + [Project/Building Name] + [{subcategory}]
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Property Location and Address */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Step 4: Property Location and Address
            </h3>
            <p className="text-xs text-slate-500">
              Provide precise locality details for client navigation and site visit mapping.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi NCR">Delhi NCR (Gurgaon / Noida)</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Locality / Sector *</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Bandra West, Powai, Koramangala"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Complete Street Address *</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tower / Flat / House Number, Street Name, Wing"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Prominent Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Hiranandani Galleria / Metro Station"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 400076"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Property Details */}
        {currentStep === 5 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">Step 5: Property Details</h3>
            <p className="text-xs text-slate-500">
              Structural specifications, tenant preference, and furnishing status.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Furnishing Status</label>
                <select
                  value={furnishingStatus}
                  onChange={(e) => setFurnishingStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tenant Preference</label>
                <select
                  value={tenantPreference}
                  onChange={(e) => setTenantPreference(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Co-ed">Co-ed / Any</option>
                  <option value="Boys">Boys Only</option>
                  <option value="Girls">Girls Only</option>
                  <option value="Family">Family Only</option>
                  <option value="Bachelors">Bachelors</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Floor Number</label>
                <input
                  type="number"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Total Floors in Building</label>
                <input
                  type="number"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Super Built-up Area (Sq.Ft)</label>
                <input
                  type="number"
                  value={superBuiltUpSqFt}
                  onChange={(e) => setSuperBuiltUpSqFt(parseInt(e.target.value) || 500)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Available From</label>
                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Person Capacity */}
        {currentStep === 6 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 6: Person Capacity</h3>
              <p className="text-xs text-slate-500">
                {category === 'FLAT'
                  ? 'Configure Flat occupancy. BHK and person count are kept strictly separate.'
                  : `Configure bed inventory and sharing capacity for ${category}.`}
              </p>
            </div>

            {category === 'FLAT' ? (
              /* Flat Configuration */
              <div className="rounded-2xl border border-slate-200 p-5 space-y-4 bg-slate-50/50">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">Selected BHK</span>
                    <p className="text-lg font-bold text-blue-700">{subcategory}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-md">
                    Flat Configuration
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Minimum Occupancy (Persons) *</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={minOccupancy}
                      onChange={(e) => setMinOccupancy(parseInt(e.target.value) || 1)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Maximum Occupancy (Persons) *</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={maxOccupancy}
                      onChange={(e) => setMaxOccupancy(parseInt(e.target.value) || 2)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3.5 border border-slate-200 text-xs text-slate-600">
                  <p>
                    <strong>Summary:</strong> This <strong>{subcategory}</strong> flat can accommodate a minimum of{' '}
                    <strong className="text-slate-900">{minOccupancy} persons</strong> and a maximum of{' '}
                    <strong className="text-slate-900">{maxOccupancy} persons</strong>.
                  </p>
                </div>
              </div>
            ) : (
              /* PG / Room / Hostel Configuration */
              <div className="rounded-2xl border border-slate-200 p-5 space-y-4 bg-slate-50/50">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">Selected Sharing</span>
                    <p className="text-lg font-bold text-blue-700">{subcategory}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-md">
                    Bed-Level Inventory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Total Capacity (Beds in Property) *</label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={totalBeds}
                      onChange={(e) => setTotalBeds(parseInt(e.target.value) || 1)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Available Beds (Ready for Move-in) *</label>
                    <input
                      type="number"
                      min={0}
                      max={totalBeds}
                      value={availableBeds}
                      onChange={(e) => setAvailableBeds(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3.5 border border-slate-200 text-xs text-slate-600">
                  <p>
                    <strong>Sharing type:</strong> {subcategory} · <strong>Available Occupancy:</strong>{' '}
                    <span className="font-bold text-blue-700">{availableBeds} beds available</span> out of{' '}
                    {totalBeds} total beds.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Monthly Rent and Security Deposit */}
        {currentStep === 7 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 7: Monthly Rent and Security Deposit
              </h3>
              <p className="text-xs text-slate-500">
                {category === 'FLAT'
                  ? 'Set the monthly rent for the flat and security deposit terms.'
                  : 'Set rent per person per month and security deposit.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {category === 'FLAT' ? 'Flat Monthly Rent (₹) *' : 'Monthly Rent Per Person (₹) *'}
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 pl-8 text-sm font-bold text-slate-900 focus:border-blue-600 focus:outline-hidden tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Security Deposit (₹) *</label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 pl-8 text-sm font-bold text-slate-900 focus:border-blue-600 focus:outline-hidden tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Notice Period (Days)</label>
                <input
                  type="number"
                  value={noticePeriodDays}
                  onChange={(e) => setNoticePeriodDays(parseInt(e.target.value) || 30)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Lock-in Period (Months)</label>
                <input
                  type="number"
                  value={lockInMonths}
                  onChange={(e) => setLockInMonths(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMaintenanceIncluded}
                    onChange={(e) => setIsMaintenanceIncluded(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-300 text-blue-600"
                  />
                  <span>Maintenance charges are included in monthly rent</span>
                </label>
              </div>

              {(category === 'PG' || category === 'HOSTEL') && (
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={foodIncluded}
                      onChange={(e) => setFoodIncluded(e.target.checked)}
                      className="h-4 w-4 rounded-sm border-slate-300 text-blue-600"
                    />
                    <span>3-Time Food (Breakfast, Lunch & Dinner) included in rent</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 8: Amenities and Facilities */}
        {currentStep === 8 && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-base font-bold text-slate-900">Step 8: Amenities and Facilities</h3>
            <p className="text-xs text-slate-500">
              Select all available utilities and lifestyle amenities to attract high-intent tenants.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {STANDARD_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs truncate">{amenity}</span>
                    <div
                      className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 9: Upload Property Photos and Videos */}
        {currentStep === 9 && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-base font-bold text-slate-900">
              Step 9: Upload Property Photos and Videos
            </h3>
            <p className="text-xs text-slate-500">
              High-resolution photography increases booking conversion by 40%. Select preset images or upload photos.
            </p>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700">Choose from Verified Image Assets</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_PHOTO_PRESETS.map((preset) => {
                  const isSelected = selectedImages.includes(preset.url);
                  return (
                    <div
                      key={preset.label}
                      onClick={() => {
                        if (isSelected) {
                          if (selectedImages.length > 1) {
                            setSelectedImages(selectedImages.filter((u) => u !== preset.url));
                          }
                        } else {
                          setSelectedImages([...selectedImages, preset.url]);
                        }
                      }}
                      className={`group cursor-pointer rounded-xl border overflow-hidden transition relative ${
                        isSelected ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-slate-200'
                      }`}
                    >
                      <div className="aspect-video bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-2 text-center text-[11px] font-semibold text-slate-800">
                        {preset.label}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 rounded-full bg-blue-600 text-white p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700">Virtual Video Walkthrough URL (Optional)</label>
                <input
                  type="text"
                  value={videoTourUrl}
                  onChange={(e) => setVideoTourUrl(e.target.value)}
                  placeholder="https://peflarmo.com/tours/your-property"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: Owner Details */}
        {currentStep === 10 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">Step 10: Property Owner Details</h3>
            <p className="text-xs text-slate-500">
              Owner authorization is required by PEFLARMO Compliance before publishing any property listing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Owner Full Legal Name *</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singhania / Dr. Anita Deshmukh"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Owner Phone Number *</label>
                <input
                  type="text"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Owner Email Address</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@domain.com"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Authorization Agreement</label>
                <select
                  value={ownerAuthorizationStatus}
                  onChange={(e) => setOwnerAuthorizationStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                >
                  <option value="AUTHORIZED">Authorized & Signed Digital NOC</option>
                  <option value="PENDING_OWNER_SIGN">Pending Owner Digital Signature</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Broker Commission Fee</label>
                <select
                  value={brokerCommissionPercent}
                  onChange={(e) => setBrokerCommissionPercent(parseInt(e.target.value) || 100)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                >
                  <option value={100}>100% of First Month Rent (Standard Flat Brokerage)</option>
                  <option value={50}>50% of First Month Rent (Standard PG/Room Brokerage)</option>
                  <option value={15}>15% Annualized Service Fee</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 11: Preview Listing */}
        {currentStep === 11 && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 11: Preview Listing</h3>
                <p className="text-xs text-slate-500">
                  Review the listing before sending for PEFLARMO Admin Verification.
                </p>
              </div>
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                Live Preview
              </span>
            </div>

            {/* Preview Card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className="relative aspect-video sm:aspect-21/9 w-full bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImages[0] || '/images/flat_luxury.jpg'}
                  alt={name || 'Property'}
                  className="h-full w-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                    {category} · {subcategory}
                  </span>
                  <span className="rounded-md bg-white/95 px-2 py-1 text-xs font-bold text-slate-900 backdrop-blur-xs">
                    {city}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {name || 'Peflarmo Premier Property'}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      {address || `${locality}, ${city}`}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xl font-extrabold text-blue-700 tabular-nums">
                      {formatCurrency(monthlyRent)}
                      <span className="text-xs font-normal text-slate-500">
                        {category === 'FLAT' ? '/month' : '/person/month'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Deposit: {formatCurrency(securityDeposit)}
                    </p>
                  </div>
                </div>

                {/* Capacity & Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Category</span>
                    <p className="font-semibold text-slate-800">{category}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Subcategory</span>
                    <p className="font-semibold text-slate-800">{subcategory}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">
                      {category === 'FLAT' ? 'Occupancy' : 'Available Beds'}
                    </span>
                    <p className="font-bold text-blue-700">
                      {category === 'FLAT'
                        ? `${minOccupancy} to ${maxOccupancy} Persons`
                        : `${availableBeds} / ${totalBeds} Beds`}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Furnishing</span>
                    <p className="font-semibold text-slate-800">{furnishingStatus}</p>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h5 className="text-xs font-bold text-slate-900 mb-2">Amenities Included</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAmenities.slice(0, 8).map((a) => (
                      <span
                        key={a}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] text-slate-700"
                      >
                        {a}
                      </span>
                    ))}
                    {selectedAmenities.length > 8 && (
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                        +{selectedAmenities.length - 8} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Owner info */}
                <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 flex items-center justify-between">
                  <span>Owner: <strong>{ownerName || 'Verified Owner'}</strong> ({ownerPhone || 'N/A'})</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Owner Authorized
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 12: Submit for Admin Approval */}
        {currentStep === 12 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Step 12: Submit for Admin Approval
            </h3>
            <p className="text-xs text-slate-500">
              Once submitted, the PEFLARMO Compliance Team will review the floor plan, owner authorization, and compliance documents within 2–4 hours.
            </p>

            <div className="space-y-3 pt-2">
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <span>Admin Compliance Checklist</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Property Category: <strong>{category}</strong> ({subcategory})</li>
                  <li>Monthly Rent: <strong>{formatCurrency(monthlyRent)}</strong></li>
                  <li>Owner authorization status: <strong>{ownerAuthorizationStatus}</strong></li>
                  <li>Broker commission: <strong>{brokerCommissionPercent}%</strong></li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Notes for PEFLARMO Admin Reviewer (Optional)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Key is with society security guard; owner willing to offer immediate move-in concession."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    I certify under RERA guidelines that I am the authorized broker for this property and all details provided are accurate.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous Step</span>
        </button>

        {currentStep < 12 ? (
          <button
            type="button"
            disabled={isNextDisabled()}
            onClick={() => setCurrentStep((prev) => Math.min(12, prev + 1))}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            <span>Next: {STEP_LABELS[currentStep]}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!termsAccepted}
            onClick={handleFinalSubmit}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>Submit for Admin Approval</span>
          </button>
        )}
      </div>
    </div>
  );
}
