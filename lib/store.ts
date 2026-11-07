'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Property,
  Booking,
  CustomerInquiry,
  SiteVisit,
  CommissionTransaction,
  PropertyOwner,
  CustomerProfile,
  NotificationItem,
  BrokerProfile,
  PropertyCategory,
} from './types';
import {
  CURRENT_BROKER,
  INITIAL_PROPERTIES,
  INITIAL_BOOKINGS,
  INITIAL_INQUIRIES,
  INITIAL_SITE_VISITS,
  INITIAL_TRANSACTIONS,
  INITIAL_OWNERS,
  INITIAL_CUSTOMERS,
  INITIAL_NOTIFICATIONS,
} from './data';

const STORAGE_KEYS = {
  PROPERTIES: 'peflarmo_properties_v2',
  BOOKINGS: 'peflarmo_bookings_v2',
  INQUIRIES: 'peflarmo_inquiries_v2',
  SITE_VISITS: 'peflarmo_site_visits_v2',
  TRANSACTIONS: 'peflarmo_transactions_v2',
  OWNERS: 'peflarmo_owners_v2',
  CUSTOMERS: 'peflarmo_customers_v2',
  NOTIFICATIONS: 'peflarmo_notifications_v2',
  BROKER: 'peflarmo_broker_v2',
  DRAFT_PROPERTY: 'peflarmo_draft_property_v2',
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('peflarmo_store_update'));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export function usePeflarmoStore() {
  const [properties, setProperties] = useState<Property[]>(() =>
    getStoredItem(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES)
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    getStoredItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() =>
    getStoredItem(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES)
  );
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() =>
    getStoredItem(STORAGE_KEYS.SITE_VISITS, INITIAL_SITE_VISITS)
  );
  const [transactions, setTransactions] = useState<CommissionTransaction[]>(() =>
    getStoredItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
  );
  const [owners, setOwners] = useState<PropertyOwner[]>(() =>
    getStoredItem(STORAGE_KEYS.OWNERS, INITIAL_OWNERS)
  );
  const [customers, setCustomers] = useState<CustomerProfile[]>(() =>
    getStoredItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [broker, setBroker] = useState<BrokerProfile>(() =>
    getStoredItem(STORAGE_KEYS.BROKER, CURRENT_BROKER)
  );

  const syncFromStorage = useCallback(() => {
    setProperties(getStoredItem(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES));
    setBookings(getStoredItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));
    setInquiries(getStoredItem(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES));
    setSiteVisits(getStoredItem(STORAGE_KEYS.SITE_VISITS, INITIAL_SITE_VISITS));
    setTransactions(getStoredItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS));
    setOwners(getStoredItem(STORAGE_KEYS.OWNERS, INITIAL_OWNERS));
    setCustomers(getStoredItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS));
    setNotifications(getStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
    setBroker(getStoredItem(STORAGE_KEYS.BROKER, CURRENT_BROKER));
  }, []);

  useEffect(() => {
    const handleStorage = () => syncFromStorage();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('peflarmo_store_update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('peflarmo_store_update', handleStorage);
    };
  }, [syncFromStorage]);

  // Actions
  const addProperty = useCallback((newProp: Property) => {
    const updated = [newProp, ...getStoredItem<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES)];
    setStoredItem(STORAGE_KEYS.PROPERTIES, updated);
    
    // Add notification
    const notifs = getStoredItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: 'Property Submitted for Review',
      message: `"${newProp.name}" (${newProp.category} - ${newProp.subcategory}) was submitted for Admin Approval.`,
      category: 'APPROVAL',
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'properties',
    };
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
    syncFromStorage();
  }, [syncFromStorage]);

  const updateProperty = useCallback((updatedProp: Property) => {
    const current = getStoredItem<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const next = current.map((p) => (p.id === updatedProp.id ? updatedProp : p));
    setStoredItem(STORAGE_KEYS.PROPERTIES, next);
    syncFromStorage();
  }, [syncFromStorage]);

  const deleteProperty = useCallback((id: string) => {
    const current = getStoredItem<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const next = current.filter((p) => p.id !== id);
    setStoredItem(STORAGE_KEYS.PROPERTIES, next);
    syncFromStorage();
  }, [syncFromStorage]);

  const updateBookingStatus = useCallback(
    (bookingId: string, status: Booking['bookingStatus'], paymentStatus?: Booking['paymentStatus']) => {
      const current = getStoredItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const next = current.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            bookingStatus: status,
            paymentStatus: paymentStatus || b.paymentStatus,
          };
        }
        return b;
      });
      setStoredItem(STORAGE_KEYS.BOOKINGS, next);
      syncFromStorage();
    },
    [syncFromStorage]
  );

  const addBooking = useCallback((booking: Booking) => {
    const current = getStoredItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    setStoredItem(STORAGE_KEYS.BOOKINGS, [booking, ...current]);
    syncFromStorage();
  }, [syncFromStorage]);

  const updateInquiryStatus = useCallback(
    (inquiryId: string, status: CustomerInquiry['status'], newNote?: string) => {
      const current = getStoredItem<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
      const next = current.map((inq) => {
        if (inq.id === inquiryId) {
          const notesHistory = inq.notesHistory || [];
          if (newNote) {
            notesHistory.unshift({
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note: newNote,
              author: 'Rahul Sharma',
            });
          }
          return {
            ...inq,
            status,
            lastFollowUpNote: newNote || inq.lastFollowUpNote,
            notesHistory,
          };
        }
        return inq;
      });
      setStoredItem(STORAGE_KEYS.INQUIRIES, next);
      syncFromStorage();
    },
    [syncFromStorage]
  );

  const addSiteVisit = useCallback((visit: SiteVisit) => {
    const current = getStoredItem<SiteVisit[]>(STORAGE_KEYS.SITE_VISITS, INITIAL_SITE_VISITS);
    setStoredItem(STORAGE_KEYS.SITE_VISITS, [visit, ...current]);

    // Also update inquiry if related
    const inqs = getStoredItem<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const updatedInqs = inqs.map((i) => {
      if (i.customerPhone === visit.customerPhone || i.customerEmail === visit.customerEmail) {
        return {
          ...i,
          status: 'SCHEDULED_VISIT' as const,
          lastFollowUpNote: `Site visit scheduled for ${visit.visitDate} at ${visit.visitTime}`,
        };
      }
      return i;
    });
    setStoredItem(STORAGE_KEYS.INQUIRIES, updatedInqs);

    const notifs = getStoredItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: 'New Site Visit Scheduled',
      message: `Visit confirmed for ${visit.customerName} on ${visit.visitDate} at ${visit.visitTime}.`,
      category: 'VISIT',
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'site-visits',
    };
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
    syncFromStorage();
  }, [syncFromStorage]);

  const updateSiteVisitStatus = useCallback(
    (visitId: string, status: SiteVisit['status'], notes?: string) => {
      const current = getStoredItem<SiteVisit[]>(STORAGE_KEYS.SITE_VISITS, INITIAL_SITE_VISITS);
      const next = current.map((v) =>
        v.id === visitId ? { ...v, status, visitNotes: notes || v.visitNotes } : v
      );
      setStoredItem(STORAGE_KEYS.SITE_VISITS, next);
      syncFromStorage();
    },
    [syncFromStorage]
  );

  const requestOwnerAuthorization = useCallback((propertyId: string) => {
    const current = getStoredItem<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const next = current.map((p) => {
      if (p.id === propertyId) {
        return {
          ...p,
          ownerAuthorizationStatus: 'AUTHORIZED' as const,
          ownerAgreementDate: new Date().toISOString().split('T')[0],
          ownerDocumentRef: 'AGR-PEF-AUTH-' + Math.floor(1000 + Math.random() * 9000),
        };
      }
      return p;
    });
    setStoredItem(STORAGE_KEYS.PROPERTIES, next);
    syncFromStorage();
  }, [syncFromStorage]);

  const approvePropertyByAdmin = useCallback((propertyId: string) => {
    const current = getStoredItem<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const next = current.map((p) => {
      if (p.id === propertyId) {
        return {
          ...p,
          adminApprovalStatus: 'APPROVED' as const,
          approvedDate: new Date().toISOString().split('T')[0],
          isPublished: true,
          adminReviewRemarks: 'Verified by PEFLARMO Admin Compliance. All guidelines met.',
        };
      }
      return p;
    });
    setStoredItem(STORAGE_KEYS.PROPERTIES, next);

    const notifs = getStoredItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: 'Property Approved by Admin',
      message: `Property ID ${propertyId} has been approved and published to the live marketplace.`,
      category: 'APPROVAL',
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'properties',
    };
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
    syncFromStorage();
  }, [syncFromStorage]);

  const markNotificationRead = useCallback((id: string) => {
    const current = getStoredItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const next = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, next);
    syncFromStorage();
  }, [syncFromStorage]);

  const markAllNotificationsRead = useCallback(() => {
    const current = getStoredItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const next = current.map((n) => ({ ...n, isRead: true }));
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, next);
    syncFromStorage();
  }, [syncFromStorage]);

  const resetAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (typeof window !== 'undefined') localStorage.removeItem(k);
    });
    syncFromStorage();
  }, [syncFromStorage]);

  // Draft handling for Add Property
  const getDraftProperty = useCallback((): Partial<Property> | null => {
    return getStoredItem<Partial<Property> | null>(STORAGE_KEYS.DRAFT_PROPERTY, null);
  }, []);

  const saveDraftProperty = useCallback((draft: Partial<Property>) => {
    setStoredItem(STORAGE_KEYS.DRAFT_PROPERTY, draft);
  }, []);

  const clearDraftProperty = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.DRAFT_PROPERTY);
    }
  }, []);

  // Computed metrics
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.isPublished && p.adminApprovalStatus === 'APPROVED').length;
  const pendingProperties = properties.filter(
    (p) => p.adminApprovalStatus === 'PENDING_APPROVAL' || p.adminApprovalStatus === 'DRAFT'
  ).length;
  const totalBookings = bookings.length;
  const totalInquiries = inquiries.length;
  const upcomingSiteVisits = siteVisits.filter((v) => v.status === 'SCHEDULED').length;

  const totalCommission = transactions
    .filter((t) => t.status === 'PAID')
    .reduce((acc, t) => acc + t.netPayout, 0);

  const pendingCommission = transactions
    .filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING')
    .reduce((acc, t) => acc + t.netPayout, 0);

  return {
    broker,
    properties,
    bookings,
    inquiries,
    siteVisits,
    transactions,
    owners,
    customers,
    notifications,
    metrics: {
      totalProperties,
      activeProperties,
      pendingProperties,
      totalBookings,
      totalInquiries,
      upcomingSiteVisits,
      totalCommission,
      pendingCommission,
    },
    actions: {
      addProperty,
      updateProperty,
      deleteProperty,
      addBooking,
      updateBookingStatus,
      updateInquiryStatus,
      addSiteVisit,
      updateSiteVisitStatus,
      requestOwnerAuthorization,
      approvePropertyByAdmin,
      markNotificationRead,
      markAllNotificationsRead,
      resetAllData,
      getDraftProperty,
      saveDraftProperty,
      clearDraftProperty,
    },
  };
}
