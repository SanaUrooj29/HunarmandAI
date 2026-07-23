'use client';

import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { orders, orderStats } from '../../lib/mock-data';
import type { Order, OrderStatus } from '../../types';

type OrderFilter = 'all' | 'confirmed' | 'pickup' | 'in_transit' | 'delivered' | 'issues';

export default function OrdersPage() {
  const [filter, setFilter] = useState<OrderFilter>('all');

  const filtered = orders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'confirmed') return o.status === 'placed';
    if (filter === 'pickup') return o.status === 'pickup_scheduled';
    if (filter === 'in_transit') return o.status === 'in_transit';
    if (filter === 'delivered') return o.status === 'delivered';
    if (filter === 'issues') return o.status === 'cancelled';
    return true;
  });

  return (
    <div>
      <TopBar
        title="Orders"
        subtitle={`${orders.length} this month · PKR 4.82M GMV`}
      />

      <div className="orders-content">
        {/* Stat cards */}
        <div className="orders-stats-grid">
          <div className="card order-stat">
            <div className="order-stat-label">CONFIRMED</div>
            <div className="order-stat-value">{orderStats.confirmed.count.toLocaleString()}</div>
            <div className="order-stat-change positive">↑ {orderStats.confirmed.change}% vs last month</div>
            <div className="order-stat-icon"><ConfirmedIcon /></div>
          </div>
          <div className="card order-stat">
            <div className="order-stat-label">IN TRANSIT</div>
            <div className="order-stat-value">{orderStats.in_transit.count.toLocaleString()}</div>
            <div className="order-stat-change positive">↑ {orderStats.in_transit.change}% vs last month</div>
            <div className="order-stat-icon"><TransitIcon /></div>
          </div>
          <div className="card order-stat">
            <div className="order-stat-label">DELIVERED</div>
            <div className="order-stat-value">{orderStats.delivered.count.toLocaleString()}</div>
            <div className="order-stat-change positive">↑ {orderStats.delivered.change}% vs last month</div>
            <div className="order-stat-icon"><DeliveredIcon /></div>
          </div>
          <div className="card order-stat">
            <div className="order-stat-label">ISSUES</div>
            <div className="order-stat-value">{orderStats.issues.count}</div>
            <div className="order-stat-change negative">↓ {Math.abs(orderStats.issues.change)}% vs last month</div>
            <div className="order-stat-icon"><IssuesIcon /></div>
          </div>
        </div>

        {/* Table card */}
        <div className="card orders-table-card">
          <div className="orders-toolbar">
            <div className="orders-filters">
              {[
                { key: 'all', label: 'All' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'pickup', label: 'Pickup' },
                { key: 'in_transit', label: 'In transit' },
                { key: 'delivered', label: 'Delivered' },
                { key: 'issues', label: 'Issues' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`orders-filter-btn${filter === key ? ' active' : ''}`}
                  onClick={() => setFilter(key as OrderFilter)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button className="btn btn-secondary">
              <DownloadIcon /> Export
            </button>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th className="hide-tablet">Seller</th>
                  <th className="hide-tablet">Items</th>
                  <th>Amount</th>
                  <th className="hide-mobile">Payment</th>
                  <th className="hide-mobile">Courier</th>
                  <th>Status</th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">#{order.order_number}</span>
                    </td>
                    <td className="text-sm">{order.buyer_name}</td>
                    <td className="text-sm hide-tablet">{order.seller_name}</td>
                    <td className="text-sm hide-tablet">{order.items_count}</td>
                    <td className="text-sm font-medium">PKR {order.amount_pkr.toLocaleString()}</td>
                    <td className="text-sm hide-mobile" style={{ textTransform: 'capitalize' }}>{order.payment_method === 'jazzcash' ? 'JazzCash' : order.payment_method === 'easypaisa' ? 'EasyPaisa' : 'COD'}</td>
                    <td className="text-sm hide-mobile">{order.courier}</td>
                    <td><OrderStatusBadge status={order.status} /></td>
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
        .orders-content { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

        .orders-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .order-stat {
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
        }

        .order-stat-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #9B8B7E;
          margin-bottom: 6px;
        }

        .order-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #2A1F14;
          line-height: 1;
          margin-bottom: 6px;
        }

        .order-stat-change {
          font-size: 12px;
          font-weight: 500;
        }

        .order-stat-change.positive { color: #2D8A4E; }
        .order-stat-change.negative { color: #C0392B; }

        .order-stat-icon {
          position: absolute;
          top: 16px;
          right: 16px;
          color: #E8DDD0;
        }

        .order-stat-icon svg { width: 22px; height: 22px; }

        .orders-table-card { overflow: hidden; }

        .orders-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid #F0E8DC;
          gap: 12px;
          flex-wrap: wrap;
        }

        .orders-filters {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .orders-filter-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 500;
          border: 1.5px solid transparent;
          background: transparent;
          color: #6B5B4E;
          cursor: pointer;
          transition: all 0.12s;
        }

        .orders-filter-btn:hover { background: #F7F3EE; }
        .orders-filter-btn.active { background: #E27D60; color: white; }

        .order-id {
          font-size: 13px;
          font-weight: 600;
          color: #2A1F14;
          font-family: monospace;
        }

        .table-wrap { overflow-x: auto; }

        @media (max-width: 1100px) {
          .orders-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .orders-content { padding: 16px; }
          .orders-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 480px) {
          .orders-stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
    placed:            { label: 'PICKUP TMR',    cls: 'badge-pending', dot: 'dot-amber' },
    pickup_scheduled:  { label: 'PICKUP TMR',    cls: 'badge-pending', dot: 'dot-amber' },
    picked_up:         { label: 'PICKED UP',     cls: 'badge-wellness', dot: 'dot-blue' },
    in_transit:        { label: 'IN TRANSIT',    cls: 'badge-wellness', dot: 'dot-blue' },
    delivered:         { label: 'DELIVERED',     cls: 'badge-verified', dot: 'dot-green' },
    cancelled:         { label: 'PICKUP FAILED', cls: 'badge-issues', dot: 'dot-red' },
  };
  const m = map[status] || { label: status, cls: 'badge-draft', dot: 'dot-gray' };
  return (
    <span className={`badge ${m.cls}`}>
      <span className={`dot ${m.dot}`} />
      {m.label}
    </span>
  );
}

function ConfirmedIcon() { return <svg viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M7 11l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function TransitIcon() { return <svg viewBox="0 0 22 22" fill="none"><rect x="2" y="6" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 9h3.5l2.5 3.5V16H14V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="6" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.5"/></svg>; }
function DeliveredIcon() { return <svg viewBox="0 0 22 22" fill="none"><path d="M3 12l4 4 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 6h8M11 10h8M11 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function IssuesIcon() { return <svg viewBox="0 0 22 22" fill="none"><path d="M11 3L20 19H2L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M11 9v5M11 15.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function DownloadIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function DotsIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>; }
