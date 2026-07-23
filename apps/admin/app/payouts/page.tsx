'use client';

import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { payouts } from '../../lib/mock-data';
import type { PayoutRecord } from '../../types';

export default function PayoutsPage() {
  const totalPending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.net_pkr, 0);
  const totalPaid = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + p.net_pkr, 0);

  return (
    <div>
      <TopBar
        title="Payouts"
        subtitle="Seller disbursements · 48h post-delivery"
        actions={
          <button className="btn btn-primary">
            <SendIcon /> Run payouts
          </button>
        }
      />

      <div className="payouts-content">
        {/* Summary cards */}
        <div className="payouts-stats-grid">
          <div className="card payout-stat">
            <div className="payout-stat-label">PENDING</div>
            <div className="payout-stat-value">PKR {totalPending.toLocaleString()}</div>
            <div className="payout-stat-count">{payouts.filter(p => p.status === 'pending').length} payments</div>
          </div>
          <div className="card payout-stat">
            <div className="payout-stat-label">PAID THIS MONTH</div>
            <div className="payout-stat-value">PKR {totalPaid.toLocaleString()}</div>
            <div className="payout-stat-count">{payouts.filter(p => p.status === 'paid').length} payments</div>
          </div>
          <div className="card payout-stat">
            <div className="payout-stat-label">COMMISSION COLLECTED</div>
            <div className="payout-stat-value">PKR {payouts.reduce((s, p) => s + p.commission_pkr, 0).toLocaleString()}</div>
            <div className="payout-stat-count">5% per transaction</div>
          </div>
          <div className="card payout-stat">
            <div className="payout-stat-label">FAILED</div>
            <div className="payout-stat-value">{payouts.filter(p => p.status === 'failed').length}</div>
            <div className="payout-stat-count" style={{ color: '#C0392B' }}>Needs retry</div>
          </div>
        </div>

        {/* Table */}
        <div className="card payouts-table-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th className="hide-tablet">Order</th>
                  <th className="hide-mobile">Gross</th>
                  <th className="hide-mobile">Commission</th>
                  <th>Net payout</th>
                  <th className="hide-tablet">Method</th>
                  <th>Status</th>
                  <th>Due</th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {payouts.map(payout => (
                  <tr key={payout.id}>
                    <td>
                      <span className="text-sm font-medium">{payout.seller_name}</span>
                    </td>
                    <td className="text-sm font-medium hide-tablet" style={{ fontFamily: 'monospace' }}>
                      #{payout.order_id}
                    </td>
                    <td className="text-sm hide-mobile">PKR {payout.gross_pkr.toLocaleString()}</td>
                    <td className="text-sm text-muted hide-mobile">- PKR {payout.commission_pkr}</td>
                    <td className="text-sm font-semibold">PKR {payout.net_pkr.toLocaleString()}</td>
                    <td className="text-sm hide-tablet" style={{ textTransform: 'capitalize' }}>
                      {payout.payment_method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'}
                    </td>
                    <td><PayoutStatusBadge status={payout.status} /></td>
                    <td className="text-sm text-muted">{payout.due_at}</td>
                    <td>
                      <button className="btn btn-icon"><DotsIcon /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .payouts-content { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

        .payouts-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .payout-stat { padding: 18px 20px; }
        .payout-stat-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #9B8B7E;
          margin-bottom: 6px;
        }
        .payout-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #2A1F14;
          margin-bottom: 4px;
        }
        .payout-stat-count { font-size: 12px; color: #6B5B4E; }

        .payouts-table-card { overflow: hidden; }
        .table-wrap { overflow-x: auto; }

        @media (max-width: 1100px) {
          .payouts-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .payouts-content { padding: 16px; }
          .payouts-stats-grid { gap: 10px; }
        }
      `}</style>
    </div>
  );
}

function PayoutStatusBadge({ status }: { status: PayoutRecord['status'] }) {
  const map = {
    pending:    { cls: 'badge-pending',  dot: 'dot-amber', label: 'PENDING' },
    processing: { cls: 'badge-wellness', dot: 'dot-blue',  label: 'PROCESSING' },
    paid:       { cls: 'badge-verified', dot: 'dot-green', label: 'PAID' },
    failed:     { cls: 'badge-issues',   dot: 'dot-red',   label: 'FAILED' },
  };
  const m = map[status];
  return (
    <span className={`badge ${m.cls}`}>
      <span className={`dot ${m.dot}`} />
      {m.label}
    </span>
  );
}

function SendIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7L13 2L8 13L7 8L1 7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>; }
function DotsIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>; }
