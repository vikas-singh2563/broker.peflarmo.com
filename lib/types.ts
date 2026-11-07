export type PropertyCategory = 'PG' | 'FLAT' | 'ROOM' | 'HOSTEL';

export type PGSubcategory = 'Single Sharing' | 'Double Sharing' | 'Triple Sharing';
export type FlatSubcategory = '1BHK' | '2BHK' | '3BHK' | '4BHK';
export type RoomSubcategory = 'Single Sharing' | 'Double Sharing' | 'Triple Sharing';
export type HostelSubcategory = 'Single Sharing' | 'Double Sharing' | 'Triple Sharing' | 'Four Sharing' | 'Multiple Sharing';

export type PropertySubcategory = PGSubcategory | FlatSubcategory | RoomSubcategory | HostelSubcategory;

export const CATEGORY_SUBCATEGORIES_MAP: Record<PropertyCategory, readonly string[]> = {
  PG: ['Single Sharing', 'Double Sharing', 'Triple Sharing'],
  FLAT: ['1BHK', '2BHK', '3BHK', '4BHK'],
  ROOM: ['Single Sharing', 'Double Sharing', 'Triple Sharing'],
  HOSTEL: ['Single Sharing', 'Double Sharing', 'Triple Sharing', 'Four Sharing', 'Multiple Sharing'],
} as const;

export type AdminApprovalStatus = 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED' | 'DRAFT';
export type OwnerAuthorizationStatus = 'AUTHORIZED' | 'PENDING_OWNER_SIGN' | 'DECLINED';
export type PropertyAvailabilityStatus = 'AVAILABLE' | 'FEW_BEDS_LEFT' | 'OCCUPIED' | 'MAINTENANCE';

export interface Property {
  id: string;
  name: string;
  category: PropertyCategory;
  subcategory: PropertySubcategory;
  brokerId: string;
  
  // Location
  city: string;
  locality: string;
  address: string;
  landmark: string;
  pincode: string;
  coordinates?: { lat: number; lng: number };
  
  // Specs
  furnishingStatus: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
  tenantPreference: 'Boys' | 'Girls' | 'Co-ed' | 'Family' | 'Bachelors' | 'Any';
  floorNumber: number;
  totalFloors: number;
  propertyAge: string;
  availableFrom: string;
  superBuiltUpSqFt: number;
  
  // Capacity & Occupancy rules
  // For PG / Room / Hostel:
  totalBeds?: number;
  availableBeds?: number;
  sharingType?: string;
  rentPerPerson?: number;
  
  // For Flat:
  bhkType?: FlatSubcategory;
  minOccupancy?: number;
  maxOccupancy?: number;
  flatRent?: number;
  
  // Financials
  monthlyRent: number; // Effective display monthly rent
  securityDeposit: number;
  maintenanceCharges: number;
  isMaintenanceIncluded: boolean;
  noticePeriodDays: number;
  lockInMonths: number;
  foodIncluded: boolean;
  foodChargeOptional?: number;
  
  // Amenities & Media
  amenities: string[];
  images: string[];
  videoTourUrl?: string;
  
  // Owner Details
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAuthorizationStatus: OwnerAuthorizationStatus;
  ownerAgreementDate?: string;
  ownerDocumentRef?: string;
  
  // Broker agreement
  brokerCommissionPercent: number; // e.g., 50% of first month rent or 100%
  
  // Approval
  adminApprovalStatus: AdminApprovalStatus;
  adminReviewRemarks?: string;
  submissionDate: string;
  approvedDate?: string;
  
  // Status
  availabilityStatus: PropertyAvailabilityStatus;
  isPublished: boolean;
  totalViews: number;
  totalInquiries: number;
}

export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'PENDING' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'REFUNDED';

export interface Booking {
  id: string;
  bookingRef: string;
  propertyId: string;
  propertyName: string;
  category: PropertyCategory;
  subcategory: PropertySubcategory;
  
  // Customer details
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerKycVerified: boolean;
  
  // Tenancy details
  bedOrUnitNumber: string;
  moveInDate: string;
  leaseDurationMonths: number;
  
  // Financials
  monthlyRent: number;
  tokenDepositPaid: number;
  securityDepositTotal: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  
  // Commission
  commissionAmount: number;
  commissionStatus: 'PENDING' | 'APPROVED' | 'PAID';
  
  createdAt: string;
  notes?: string;
}

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'SCHEDULED_VISIT' | 'CONVERTED' | 'DROPPED';

export interface CustomerInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  propertyId: string;
  propertyName: string;
  category: PropertyCategory;
  subcategory: PropertySubcategory;
  inquiryDate: string;
  status: InquiryStatus;
  budgetMonthly: number;
  expectedMoveIn: string;
  lastFollowUpNote?: string;
  nextFollowUpDate?: string;
  notesHistory: Array<{ date: string; note: string; author: string }>;
}

export type VisitStatus = 'SCHEDULED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED' | 'CONVERTED';

export interface SiteVisit {
  id: string;
  visitRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  propertyId: string;
  propertyName: string;
  propertyLocation: string;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:MM AM/PM
  status: VisitStatus;
  visitNotes?: string;
  assignedBrokerName: string;
  createdAt: string;
}

export interface CommissionTransaction {
  id: string;
  transactionRef: string;
  bookingId: string;
  propertyName: string;
  customerName: string;
  grossAmount: number;
  tdsDeduction: number;
  netPayout: number;
  status: 'PAID' | 'PENDING' | 'PROCESSING';
  payoutDate?: string;
  paymentMode?: string;
  invoiceUrl?: string;
}

export interface PropertyOwner {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalProperties: number;
  authorizedProperties: number;
  pendingProperties: number;
  panNumber: string;
  agreementStatus: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  lastContactDate: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredCategory: PropertyCategory;
  preferredLocation: string;
  budgetRange: string;
  status: 'LEAD' | 'PROSPECT' | 'ACTIVE_TENANT' | 'PAST_TENANT';
  currentProperty?: string;
  inquiryCount: number;
  visitCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'BOOKING' | 'INQUIRY' | 'VISIT' | 'COMMISSION' | 'APPROVAL' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface BrokerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  agencyName: string;
  reraNumber: string;
  panNumber: string;
  kycStatus: 'VERIFIED' | 'PENDING';
  tier: 'Gold Platinum' | 'Silver' | 'Diamond';
  joinedDate: string;
  serviceAreas: string[];
  bankAccount: {
    accountHolder: string;
    accountNumberMasked: string;
    bankName: string;
    ifsc: string;
    payoutSchedule: string;
  };
}
