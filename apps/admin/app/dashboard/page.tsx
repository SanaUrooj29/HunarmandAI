import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/admin/StatCard';
import ActivityChart from '../../components/analytics/ActivityChart';
import {
  dashboardStats, topCategories, marketplaceActivity,
  needsAttention, sellers, formatPKR
} from '../../lib/mock-data';

export default function DashboardPage() {
  return (
    <div>
      <TopBar
        title="Dashboard"
        subtitle="Overview · last 30 days"
        actions={
          <button className="btn btn-secondary">
            <DownloadIcon /> Export
          </button>
        }
      />

      <div className="dashboard-content">
        {/* Stat cards */}
        <div className="stats-grid">
          <StatCard
            label="Active Sellers"
            value={dashboardStats.active_sellers.toLocaleString()}
            change={dashboardStats.active_sellers_change}
            icon={<SellerIcon />}
          />
          <StatCard
            label="GMV This Month"
            value={formatPKR(dashboardStats.gmv_this_month_pkr)}
            change={dashboardStats.gmv_change}
            icon={<GMVIcon />}
            accent="#1F7A8C"
          />
          <StatCard
            label="Orders"
            value={dashboardStats.orders_this_month.toLocaleString()}
            change={dashboardStats.orders_change}
            icon={<OrdersIcon />}
            accent="#B5945E"
          />
          <StatCard
            label="AI Listings"
            value={dashboardStats.ai_listings.toLocaleString()}
            change={dashboardStats.ai_listings_change}
            icon={<AIIcon />}
            accent="#8E6FAF"
          />
        </div>

        {/* Charts row */}
        <div className="chart-row">
          {/* Activity chart */}
          <div className="card chart-card">
            <div className="chart-card-header">
              <div>
                <div className="chart-card-title">Marketplace activity</div>
                <div className="chart-card-sub">Listings · Orders · GMV</div>
              </div>
            </div>
            <ActivityChart data={marketplaceActivity} />
          </div>

          {/* Top categories */}
          <div className="card categories-card">
            <div className="chart-card-title" style={{ marginBottom: 16 }}>Top categories</div>
            <div className="categories-list">
              {topCategories.map(cat => (
                <div key={cat.name} className="category-row">
                  <div className="category-row-header">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-pct">{cat.percentage}%</span>
                  </div>
                  <div className="category-bar-bg">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${cat.percentage}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="bottom-row">
          {/* Needs attention */}
          <div className="card attention-card">
            <div className="attention-header">
              <span className="chart-card-title">Needs attention</span>
              <a href="/moderation" className="view-all-link">View all</a>
            </div>
            <div className="attention-list">
              {needsAttention.map(item => (
                <div key={item.id} className="attention-item">
                  <div className="attention-icon" style={{ color: item.color }}>
                    {item.type === 'moderation' ? <FlagIcon /> :
                     item.type === 'courier' ? <TruckIcon /> : <UserCheckIcon />}
                  </div>
                  <div className="attention-text">
                    <span className="attention-count" style={{ color: item.color }}>{item.count}</span>
                    {' '}{item.label}
                    <div className="attention-detail">{item.detail}</div>
                  </div>
                  <ChevronRightIcon />
                </div>
              ))}
            </div>
          </div>

          {/* Recent sellers */}
          <div className="card recent-sellers-card">
            <div className="chart-card-title" style={{ marginBottom: 16 }}>Recent sellers</div>
            <div className="recent-sellers-list">
              {sellers.slice(0, 4).map(seller => (
                <div key={seller.id} className="recent-seller-row">
                  <div
                    className="avatar avatar-md"
                    style={{ background: getAvatarBg(seller.name), color: 'white' }}
                  >
                    {seller.name.split(' ').map(p => p[0]).join('').slice(0,2)}
                  </div>
                  <div className="recent-seller-info">
                    <div className="recent-seller-name">{seller.name}</div>
                    <div className="recent-seller-detail">{seller.city} · {seller.categories?.join(', ')}</div>
                  </div>
                  <div className="recent-seller-right">
                    <span className={`badge badge-${seller.status}`}>
                      <span className={`dot dot-${seller.status === 'verified' ? 'green' : seller.status === 'pending' ? 'amber' : 'amber'}`}/>
                      {seller.status.toUpperCase()}
                    </span>
                    <div className="recent-seller-time">
                      {seller.id === 'u1' ? '2h ago' : seller.id === 'u2' ? '4h ago' : seller.id === 'u3' ? '1d ago' : '2d ago'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .chart-row {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
        }

        .chart-card {
          padding: 20px;
        }

        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .chart-card-title {
          font-size: 15px;
          font-weight: 600;
          color: #2A1F14;
        }

        .chart-card-sub {
          font-size: 12px;
          color: #6B5B4E;
          margin-top: 2px;
        }

        .categories-card {
          padding: 20px;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .category-row { display: flex; flex-direction: column; gap: 5px; }
        .category-row-header { display: flex; justify-content: space-between; align-items: center; }
        .category-name { font-size: 13px; color: #2A1F14; }
        .category-pct { font-size: 13px; color: #6B5B4E; font-weight: 500; }
        .category-bar-bg { height: 6px; background: #F0E8DC; border-radius: 3px; overflow: hidden; }
        .category-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

        .bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .attention-card { padding: 20px; }
        .attention-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .view-all-link { font-size: 13px; color: #E27D60; text-decoration: none; font-weight: 500; }
        .view-all-link:hover { text-decoration: underline; }

        .attention-list { display: flex; flex-direction: column; gap: 4px; }

        .attention-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          background: #F9F4EE;
          cursor: pointer;
          transition: background 0.12s;
        }
        .attention-item:hover { background: #F0E8DC; }

        .attention-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #F0E8DC;
        }
        .attention-icon svg { width: 15px; height: 15px; }

        .attention-text { flex: 1; font-size: 13.5px; color: #2A1F14; }
        .attention-count { font-weight: 700; }
        .attention-detail { font-size: 11.5px; color: #6B5B4E; margin-top: 1px; }

        .recent-sellers-card { padding: 20px; }
        .recent-sellers-list { display: flex; flex-direction: column; gap: 12px; }

        .recent-seller-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .recent-seller-info { flex: 1; min-width: 0; }
        .recent-seller-name { font-size: 13.5px; font-weight: 500; color: #2A1F14; }
        .recent-seller-detail { font-size: 11.5px; color: #6B5B4E; }

        .recent-seller-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
        }

        .recent-seller-time { font-size: 11px; color: #9B8B7E; }

        @media (max-width: 1100px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .chart-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .dashboard-content { padding: 16px; gap: 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .bottom-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function getAvatarBg(name: string) {
  const colors = ['#E27D60', '#1F7A8C', '#8E6FAF', '#4CAF7D', '#F0B429'];
  return colors[name.charCodeAt(0) % colors.length];
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function SellerIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M3 16c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function GMVIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7h14" stroke="currentColor" strokeWidth="1.3"/><circle cx="5.5" cy="11" r="1" fill="currentColor"/></svg>;
}
function OrdersIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function AIIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v2M9 14v2M16 9h-2M4 9H2M14.2 3.8l-1.4 1.4M5.2 11.8l-1.4 1.4M14.2 14.2l-1.4-1.4M5.2 6.2 3.8 4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.3"/></svg>;
}
function FlagIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 1v13M3 1h9l-2 4 2 4H3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function TruckIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="4" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M10 6h2.5l1.5 2.5V11H10V6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="4" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.1"/><circle cx="11" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.1"/></svg>;
}
function UserCheckIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 13c0-2.5 2-4 5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M9.5 10.5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ChevronRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="#9B8B7E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
