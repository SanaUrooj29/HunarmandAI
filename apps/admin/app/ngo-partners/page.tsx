import TopBar from '../../components/layout/TopBar';
import { ngoPartners } from '../../lib/mock-data';
import type { NGOStatus } from '../../types';

export default function NGOPartnersPage() {
  return (
    <div>
      <TopBar
        title="NGO partners"
        subtitle="6 active partners · 312 sellers onboarded"
        actions={
          <button className="btn btn-primary">
            <PlusIcon /> Add partner
          </button>
        }
      />

      <div className="ngo-content">
        <div className="ngo-grid">
          {ngoPartners.map(partner => (
            <div key={partner.id} className="card ngo-card">
              <div className="ngo-card-header">
                <div className="ngo-icon">
                  <HeartIcon />
                </div>
                <NGOStatusBadge status={partner.status} />
              </div>

              <div className="ngo-card-body">
                <div className="ngo-name">{partner.name}</div>
                <div className="ngo-location">
                  {partner.hq_city && partner.cities_count > 0
                    ? `${partner.hq_city} HQ · ${partner.cities_count} cities`
                    : partner.hq_city}
                </div>
                {partner.is_crisis_partner && (
                  <div className="ngo-crisis-tag">Crisis routing partner</div>
                )}
              </div>

              <div className="ngo-card-footer">
                <div className="ngo-stats">
                  <div className="ngo-stat">
                    <div className="ngo-stat-value">{partner.sellers_count}</div>
                    <div className="ngo-stat-label">SELLERS</div>
                  </div>
                  <div className="ngo-stat">
                    <div className="ngo-stat-value">{partner.orders_count}</div>
                    <div className="ngo-stat-label">ORDERS</div>
                  </div>
                </div>
                <button className="btn btn-icon ngo-arrow">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ngo-content { padding: 24px; }

        .ngo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .ngo-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: box-shadow 0.15s;
        }

        .ngo-card:hover {
          box-shadow: 0 4px 16px rgba(42,31,20,0.1);
        }

        .ngo-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .ngo-icon {
          width: 44px;
          height: 44px;
          background: #1F7A8C;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .ngo-icon svg { width: 22px; height: 22px; }

        .ngo-card-body { flex: 1; }

        .ngo-name {
          font-size: 15px;
          font-weight: 700;
          color: #2A1F14;
          margin-bottom: 3px;
        }

        .ngo-location {
          font-size: 12.5px;
          color: #6B5B4E;
        }

        .ngo-crisis-tag {
          font-size: 12px;
          color: #E27D60;
          font-style: italic;
          margin-top: 4px;
          font-weight: 500;
        }

        .ngo-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid #F0E8DC;
        }

        .ngo-stats {
          display: flex;
          gap: 24px;
        }

        .ngo-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #2A1F14;
          line-height: 1;
        }

        .ngo-stat-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #9B8B7E;
          margin-top: 2px;
        }

        .ngo-arrow {
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }

        @media (max-width: 1024px) {
          .ngo-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .ngo-content { padding: 16px; }
          .ngo-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function NGOStatusBadge({ status }: { status: NGOStatus }) {
  const map: Record<NGOStatus, { label: string; cls: string; dot: string }> = {
    active:     { label: 'ACTIVE',     cls: 'badge-verified',   dot: 'dot-green' },
    wellness:   { label: 'WELLNESS',   cls: 'badge-wellness',   dot: 'dot-blue' },
    onboarding: { label: 'ONBOARDING', cls: 'badge-onboarding', dot: 'dot-amber' },
    inactive:   { label: 'INACTIVE',   cls: 'badge-draft',      dot: 'dot-gray' },
  };
  const m = map[status];
  return (
    <span className={`badge ${m.cls}`}>
      <span className={`dot ${m.dot}`} />
      {m.label}
    </span>
  );
}

function HeartIcon() { return <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19S2 13 2 7.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3C20 13 11 19 11 19Z" fill="white" fillOpacity="0.9"/></svg>; }
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function ChevronRightIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
