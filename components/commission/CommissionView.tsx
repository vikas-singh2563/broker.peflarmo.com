'use client';

import React, { useState } from 'react';
import { CommissionTransaction, Booking, BrokerProfile } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Coins,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Clock,
  Building,
  CreditCard,
  FileText,
  Calendar,
  X,
  ShieldCheck,
} from 'lucide-react';

interface CommissionViewProps {
  transactions: CommissionTransaction[];
  bookings: Booking[];
  broker: BrokerProfile;
}

export function CommissionView({
  transactions,
  bookings,
  broker,
}: CommissionViewProps) {
  const [selectedTxn, setSelectedTxn] = useState<CommissionTransaction | null>(null);

  const totalGross = transactions.reduce((acc, t) => acc + t.grossAmount, 0);
  const totalTds = transactions.reduce((acc, t) => acc + t.tdsDeduction, 0);
  const totalNetPaid = transactions
    .filter((t) => t.status === 'PAID')
    .reduce((acc, t) => acc + t.netPayout, 0);
  const totalPending = transactions
    .filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING')
    .reduce((acc, t) => acc + t.netPayout, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Commission & Brokerage Earnings Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Automated TDS reconciliation and direct bank payouts for authorized inventory
          </p>
        </div>

        <button
          onClick={() => alert('Generated PEFLARMO Broker Tax Statement (FY 2026-27)')}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <Download className="h-4 w-4 text-blue-600" />
          <span>Download Tax Ledger (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Gross Brokerage
          </span>
          <div className="mt-2 text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(totalGross)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Across {transactions.length} tenancy closures</p>
        </div>

        {/* Paid Commission */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Paid Commission (Net)
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700 tabular-nums">
            {formatCurrency(totalNetPaid)}
          </div>
          <p className="mt-1 text-[11px] text-emerald-700">Successfully credited to bank</p>
        </div>

        {/* Pending Commission */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Pending Commission
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-700 tabular-nums">
            {formatCurrency(totalPending)}
          </div>
          <p className="mt-1 text-[11px] text-amber-800">Releases at move-in / deposit clearance</p>
        </div>

        {/* TDS Deductions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            TDS Deducted (Sec 194H - 5%)
          </span>
          <div className="mt-2 text-2xl font-black text-slate-700 tabular-nums">
            {formatCurrency(totalTds)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Deposited to PAN: {broker.panNumber}</p>
        </div>
      </div>

      {/* Direct Deposit Bank Account Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-4.5">
        <div className="flex items-center gap-3.5">
          <div className="rounded-xl bg-blue-600 p-2.5 text-white">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{broker.bankAccount.bankName}</span>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Auto-Payout Active
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              A/C: {broker.bankAccount.accountNumberMasked} · IFSC: {broker.bankAccount.ifsc}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs">
          <span className="text-slate-500">Next Payout Cycle:</span>
          <p className="font-bold text-blue-900">{broker.bankAccount.payoutSchedule}</p>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-slate-100 p-4">
          <h3 className="text-sm font-bold text-slate-900">Transaction History & Invoices</h3>
          <p className="text-xs text-slate-500">Individual booking commission payments and release dates</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Txn Ref</th>
                <th className="py-3 px-4">Booking & Tenant</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Gross</th>
                <th className="py-3 px-4">TDS (5%)</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Payout Date / Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {txn.transactionRef}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{txn.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{txn.bookingId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800 truncate max-w-[200px]" title={txn.propertyName}>
                      {txn.propertyName}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(txn.grossAmount)}
                  </td>
                  <td className="py-3 px-4 text-slate-500 tabular-nums">
                    -{formatCurrency(txn.tdsDeduction)}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 tabular-nums">
                    {formatCurrency(txn.netPayout)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-medium">{txn.payoutDate || 'Upcoming Cycle'}</span>
                    <p className="text-[10px] text-slate-400">{txn.paymentMode || 'NEFT Transfer'}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        txn.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">PEFLARMO Commission Voucher</h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Voucher No: <strong className="font-mono">{selectedTxn.transactionRef}</strong></span>
                <span>Date: <strong>{selectedTxn.payoutDate}</strong></span>
              </div>

              <div>
                <span className="text-slate-500">Payee Broker:</span>
                <p className="font-bold text-slate-900">{broker.name} ({broker.agencyName})</p>
                <p className="text-[11px] text-slate-500 font-mono">PAN: {broker.panNumber} · RERA: {broker.reraNumber}</p>
              </div>

              <div className="border-t border-slate-200 pt-2">
                <span className="text-slate-500">Property & Booking:</span>
                <p className="font-semibold text-slate-900">{selectedTxn.propertyName}</p>
                <p className="text-slate-600">Client: {selectedTxn.customerName} ({selectedTxn.bookingId})</p>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1 bg-white p-3 rounded-xl border">
                <div className="flex justify-between">
                  <span>Gross Brokerage Commission:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(selectedTxn.grossAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Less TDS under Sec 194H (5%):</span>
                  <span>-{formatCurrency(selectedTxn.tdsDeduction)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1 text-sm font-black text-emerald-700">
                  <span>Net Payout Disbursed:</span>
                  <span>{formatCurrency(selectedTxn.netPayout)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">
              <button
                onClick={() => {
                  alert(`Invoice PDF downloaded for ${selectedTxn.transactionRef}`);
                  setSelectedTxn(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                <Download className="h-4 w-4" />
                <span>Download Official Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
