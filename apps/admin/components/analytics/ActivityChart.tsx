'use client';

import { useState } from 'react';

interface DataPoint {
  day: string;
  orders: number;
  listings: number;
}

interface ActivityChartProps {
  data: Record<string, DataPoint[]>;
}

type Period = '7d' | '30d' | '90d' | '1y';

export default function ActivityChart({ data }: ActivityChartProps) {
  const [period, setPeriod] = useState<Period>('30d');
  const points = data[period] || [];

  const maxOrders = Math.max(...points.map(p => p.orders));
  const maxListings = Math.max(...points.map(p => p.listings));
  const max = Math.max(maxOrders, maxListings) * 1.15;

  const W = 580;
  const H = 160;
  const PAD = { top: 16, right: 12, bottom: 24, left: 8 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  function toX(i: number) {
    return PAD.left + (i / (points.length - 1)) * innerW;
  }
  function toY(val: number) {
    return PAD.top + innerH - (val / max) * innerH;
  }

  function polyline(vals: number[]) {
    return vals.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  }

  function area(vals: number[]) {
    const pts = vals.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
    const last = toX(vals.length - 1);
    const first = toX(0);
    const bottom = PAD.top + innerH;
    return `${first},${bottom} ${pts} ${last},${bottom}`;
  }

  const showLabels = points.length <= 14;

  return (
    <div className="activity-chart">
      <div className="activity-chart-controls">
        {(['7d', '30d', '90d', '1y'] as Period[]).map(p => (
          <button
            key={p}
            className={`activity-period-btn${period === p ? ' active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="activity-svg-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="activity-svg">
          <defs>
            <linearGradient id="grad-orders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E27D60" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#E27D60" stopOpacity="0.02"/>
            </linearGradient>
            <linearGradient id="grad-listings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F7A8C" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#1F7A8C" stopOpacity="0.02"/>
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map(t => (
            <line
              key={t}
              x1={PAD.left} y1={PAD.top + innerH * (1 - t)}
              x2={W - PAD.right} y2={PAD.top + innerH * (1 - t)}
              stroke="#F0E8DC" strokeWidth="1" strokeDasharray="4 3"
            />
          ))}

          {/* Areas */}
          <polygon points={area(points.map(p => p.orders))} fill="url(#grad-orders)"/>
          <polygon points={area(points.map(p => p.listings))} fill="url(#grad-listings)"/>

          {/* Lines */}
          <polyline
            points={polyline(points.map(p => p.orders))}
            fill="none" stroke="#E27D60" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          />
          <polyline
            points={polyline(points.map(p => p.listings))}
            fill="none" stroke="#1F7A8C" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          />

          {/* X axis labels */}
          {showLabels && points.map((p, i) => (
            <text
              key={i}
              x={toX(i)} y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#9B8B7E"
            >
              {p.day}
            </text>
          ))}
          {!showLabels && [0, Math.floor(points.length / 4), Math.floor(points.length / 2), Math.floor(points.length * 3 / 4), points.length - 1].map(i => (
            <text
              key={i}
              x={toX(i)} y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#9B8B7E"
            >
              {points[i]?.day}
            </text>
          ))}
        </svg>
      </div>

      <div className="activity-legend">
        <div className="activity-legend-item">
          <span className="activity-legend-dot" style={{ background: '#E27D60' }}/>
          Orders
        </div>
        <div className="activity-legend-item">
          <span className="activity-legend-dot" style={{ background: '#1F7A8C' }}/>
          Listings
        </div>
      </div>

      <style>{`
        .activity-chart { width: 100%; }

        .activity-chart-controls {
          display: flex;
          gap: 4px;
          justify-content: flex-end;
          margin-bottom: 12px;
        }

        .activity-period-btn {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          background: transparent;
          border: 1px solid transparent;
          color: #6B5B4E;
          cursor: pointer;
          transition: all 0.12s;
        }

        .activity-period-btn:hover { background: #F9F4EE; }

        .activity-period-btn.active {
          background: #E27D60;
          color: white;
          border-color: #E27D60;
        }

        .activity-svg-wrap { width: 100%; overflow: hidden; }

        .activity-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .activity-legend {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }

        .activity-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6B5B4E;
        }

        .activity-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
