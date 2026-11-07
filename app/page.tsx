'use client';

import React, { useState } from 'react';
import { usePeflarmoStore } from '@/lib/store';
import { Property, CustomerInquiry, SiteVisit } from '@/lib/types';
import { Sidebar, NavTabId } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { MyPropertiesView } from '@/components/properties/MyPropertiesView';
import { AddPropertyWizard } from '@/components/properties/AddPropertyWizard';
import { PropertyDetailModal } from '@/components/properties/PropertyDetailModal';
import { BookingsView } from '@/components/bookings/BookingsView';
import { InquiriesView } from '@/components/inquiries/InquiriesView';
import { SiteVisitsView } from '@/components/visits/SiteVisitsView';
import { OwnersView } from '@/components/owners/OwnersView';
import { CustomersView } from '@/components/customers/CustomersView';
import { CommissionView } from '@/components/commission/CommissionView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { NotificationsView } from '@/components/notifications/NotificationsView';
import { ProfileView } from '@/components/profile/ProfileView';
import { SupportView } from '@/components/support/SupportView';
import { LogOut, ShieldCheck, CheckCircle2, RotateCcw, X } from 'lucide-react';

export default function BrokerDashboardPage() {
  const {
    broker,
    properties,
    bookings,
    inquiries,
    siteVisits,
    transactions,
    owners,
    customers,
    notifications,
    metrics,
    actions,
  } = usePeflarmoStore();

  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingPropertyFromOverview, setViewingPropertyFromOverview] = useState<Property | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEditProperty = (prop: Property) => {
    setEditingProperty(prop);
    setActiveTab('add-property');
  };

  const handleSavePropertyFromWizard = (property: Property) => {
    if (editingProperty) {
      actions.updateProperty(property);
      showToast(`Property "${property.name}" updated successfully!`);
    } else {
      actions.addProperty(property);
      showToast(`Property "${property.name}" submitted for Admin Approval!`);
    }
    setEditingProperty(null);
    setActiveTab('properties');
  };

  const handleCancelWizard = () => {
    setEditingProperty(null);
    setActiveTab('properties');
  };

  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-black text-2xl">
            P
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Logged Out Successfully</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your PEFLARMO broker session for <strong>{broker.name}</strong> ({broker.id}) has ended securely.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsLoggedOut(false);
                setActiveTab('dashboard');
              }}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              Log Back Into Broker Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingBookingsCount = bookings.filter((b) => b.bookingStatus === 'REQUESTED' || b.bookingStatus === 'PENDING').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW').length;
  const upcomingVisitsCount = siteVisits.filter((v) => v.status === 'SCHEDULED').length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'logout') {
            setIsLogoutModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        broker={broker}
        counts={{
          pendingBookings: pendingBookingsCount,
          newInquiries: newInquiriesCount,
          upcomingVisits: upcomingVisitsCount,
          unreadNotifications: unreadNotifsCount,
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onRequestLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={activeTab}
          broker={broker}
          notifications={notifications}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onMarkNotificationRead={actions.markNotificationRead}
          onMarkAllNotificationsRead={actions.markAllNotificationsRead}
        />

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl flex items-center gap-2.5 text-xs font-semibold text-slate-800 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* 1. Dashboard */}
            {activeTab === 'dashboard' && (
              <OverviewView
                metrics={metrics}
                properties={properties}
                bookings={bookings}
                inquiries={inquiries}
                siteVisits={siteVisits}
                transactions={transactions}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectPropertyToView={(prop) => setViewingPropertyFromOverview(prop)}
              />
            )}

            {/* 2. My Properties */}
            {activeTab === 'properties' && (
              <MyPropertiesView
                properties={properties}
                onAddNew={() => {
                  setEditingProperty(null);
                  setActiveTab('add-property');
                }}
                onEditProperty={handleEditProperty}
                onUpdateProperty={actions.updateProperty}
                onDeleteProperty={actions.deleteProperty}
                onRequestOwnerAuth={actions.requestOwnerAuthorization}
                onApproveByAdmin={actions.approvePropertyByAdmin}
              />
            )}

            {/* 3. Add / Edit Property */}
            {activeTab === 'add-property' && (
              <AddPropertyWizard
                initialProperty={editingProperty}
                onSave={handleSavePropertyFromWizard}
                onCancel={handleCancelWizard}
                onSaveDraft={actions.saveDraftProperty}
              />
            )}

            {/* 4. Bookings */}
            {activeTab === 'bookings' && (
              <BookingsView
                bookings={bookings}
                properties={properties}
                onUpdateStatus={actions.updateBookingStatus}
                onAddBooking={actions.addBooking}
              />
            )}

            {/* 5. Customer Inquiries */}
            {activeTab === 'inquiries' && (
              <InquiriesView
                inquiries={inquiries}
                properties={properties}
                onUpdateStatus={actions.updateInquiryStatus}
              />
            )}

            {/* 6. My Customers */}
            {activeTab === 'customers' && (
              <CustomersView customers={customers} />
            )}

            {/* 7. Site Visits */}
            {activeTab === 'site-visits' && (
              <SiteVisitsView
                siteVisits={siteVisits}
                properties={properties}
                onAddVisit={actions.addSiteVisit}
                onUpdateVisitStatus={actions.updateSiteVisitStatus}
              />
            )}

            {/* 8. Property Owners */}
            {activeTab === 'owners' && (
              <OwnersView
                owners={owners}
                properties={properties}
                onRequestOwnerAuth={actions.requestOwnerAuthorization}
              />
            )}

            {/* 9. Commission & Earnings */}
            {activeTab === 'commission' && (
              <CommissionView
                transactions={transactions}
                bookings={bookings}
                broker={broker}
              />
            )}

            {/* 10. Analytics */}
            {activeTab === 'analytics' && (
              <AnalyticsView
                properties={properties}
                bookings={bookings}
                inquiries={inquiries}
                siteVisits={siteVisits}
              />
            )}

            {/* 11. Notifications */}
            {activeTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                onMarkRead={actions.markNotificationRead}
                onMarkAllRead={actions.markAllNotificationsRead}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* 12. My Profile */}
            {activeTab === 'profile' && (
              <ProfileView broker={broker} />
            )}

            {/* 13. Support */}
            {activeTab === 'support' && (
              <SupportView />
            )}
          </div>
        </main>
      </div>

      {/* Quick Overview Property Detail Modal */}
      {viewingPropertyFromOverview && (
        <PropertyDetailModal
          property={viewingPropertyFromOverview}
          onClose={() => setViewingPropertyFromOverview(null)}
          onEdit={(p) => {
            setViewingPropertyFromOverview(null);
            handleEditProperty(p);
          }}
          onManage={(p) => {
            setViewingPropertyFromOverview(null);
            setActiveTab('properties');
          }}
        />
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <LogOut className="h-5 w-5" />
                <h3 className="text-base font-bold text-slate-900">Logout Broker Session?</h3>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are currently authenticated as <strong>{broker.name}</strong> (RERA: {broker.reraNumber}). All your inventory changes and draft listings will remain safely stored.
            </p>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  setIsLoggedOut(true);
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
