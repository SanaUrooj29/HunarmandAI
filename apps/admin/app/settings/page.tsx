'use client';

import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { integrations } from '../../lib/mock-data';
import type { IntegrationStatus } from '../../types';

export default function SettingsPage() {
  const [commission, setCommission] = useState(5);

  return (
    <div>
      <TopBar title="Platform settings" />

      <div className="settings-content">
        {/* Commission */}
        <div className="card settings-card">
          <div className="settings-section-title">Commission</div>
          <div className="settings-section-sub">Platform fee deducted automatically per order.</div>

          <div className="commission-slider-wrap">
            <div className="commission-track-wrap">
              <input
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={commission}
                onChange={e => setCommission(Number(e.target.value))}
                className="commission-slider"
                style={{
                  background: `linear-gradient(to right, #1F7A8C ${(commission / 15) * 100}%, #E8DDD0 ${(commission / 15) * 100}%)`
                }}
              />
              <div className="commission-labels">
                <span>0%</span>
                <span className="commission-recommended">Recommended: 5%</span>
                <span>15%</span>
              </div>
            </div>
            <div className="commission-value">{commission}%</div>
          </div>
        </div>

        {/* Integrations */}
        <div className="card settings-card">
          <div className="settings-section-title">Integrations</div>
          <div className="integrations-list">
            {integrations.map(integration => (
              <div key={integration.id} className="integration-row">
                <div
                  className="integration-icon"
                  style={{ background: integration.color }}
                >
                  {integration.initials}
                </div>
                <div className="integration-info">
                  <div className="integration-name">{integration.name}</div>
                  <div className="integration-desc">{integration.description}</div>
                </div>
                <div className="integration-status-wrap">
                  <IntegrationStatusBadge status={integration.status} />
                </div>
                <button className="btn btn-secondary btn-sm">Configure</button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="card settings-card settings-danger-card">
          <div className="settings-section-title" style={{ color: '#C0392B' }}>Danger zone</div>
          <div className="danger-row">
            <div>
              <div className="danger-label">Reset all moderation flags</div>
              <div className="danger-desc">Mark all flagged listings as reviewed. This cannot be undone.</div>
            </div>
            <button className="btn btn-danger btn-sm">Reset flags</button>
          </div>
          <div className="danger-row">
            <div>
              <div className="danger-label">Export all user data</div>
              <div className="danger-desc">Download a CSV of all seller and buyer records.</div>
            </div>
            <button className="btn btn-secondary btn-sm">Export CSV</button>
          </div>
        </div>
      </div>

      <style>{`
        .settings-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 760px;
        }

        .settings-card { padding: 24px; }

        .settings-section-title {
          font-size: 15px;
          font-weight: 700;
          color: #2A1F14;
          margin-bottom: 4px;
        }

        .settings-section-sub {
          font-size: 13px;
          color: #6B5B4E;
          margin-bottom: 20px;
        }

        /* Commission slider */
        .commission-slider-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .commission-track-wrap {
          flex: 1;
        }

        .commission-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          border: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
        }

        .commission-slider::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2.5px solid #1F7A8C;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .commission-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2.5px solid #1F7A8C;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .commission-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: #9B8B7E;
        }

        .commission-recommended { color: #6B5B4E; font-weight: 500; }

        .commission-value {
          width: 56px;
          height: 56px;
          background: #F7F3EE;
          border: 1.5px solid #E8DDD0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: #2A1F14;
          flex-shrink: 0;
        }

        /* Integrations */
        .integrations-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .integration-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #F0E8DC;
        }

        .integration-row:last-child { border-bottom: none; }

        .integration-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          letter-spacing: 0.3px;
        }

        .integration-info { flex: 1; min-width: 0; }

        .integration-name {
          font-size: 14px;
          font-weight: 600;
          color: #2A1F14;
        }

        .integration-desc {
          font-size: 12px;
          color: #6B5B4E;
          margin-top: 2px;
        }

        .integration-status-wrap { flex-shrink: 0; }

        /* Danger zone */
        .settings-danger-card {
          border: 1px solid #FDECEA;
        }

        .danger-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid #F0E8DC;
        }

        .danger-row:last-child { border-bottom: none; }

        .danger-label {
          font-size: 13.5px;
          font-weight: 500;
          color: #2A1F14;
          margin-bottom: 2px;
        }

        .danger-desc {
          font-size: 12px;
          color: #6B5B4E;
        }

        @media (max-width: 768px) {
          .settings-content { padding: 16px; }
          .commission-slider-wrap { flex-direction: column; align-items: stretch; }
          .commission-value { width: 100%; height: 44px; }
          .integration-row { flex-wrap: wrap; }
          .integration-status-wrap { order: -1; }
        }
      `}</style>
    </div>
  );
}

function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const map = {
    healthy:       { cls: 'badge-healthy', dot: 'dot-green', label: 'HEALTHY' },
    issues:        { cls: 'badge-issues',  dot: 'dot-amber', label: 'ISSUES' },
    disconnected:  { cls: 'badge-draft',   dot: 'dot-gray',  label: 'DISCONNECTED' },
  };
  const m = map[status];
  return (
    <span className={`badge ${m.cls}`}>
      <span className={`dot ${m.dot}`} />
      {m.label}
    </span>
  );
}
