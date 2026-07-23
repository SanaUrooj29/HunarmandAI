import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/admin/StatCard';
import {
  analyticsStats, aiGenerationLatency, wellnessSentiment, topSellers
} from '../../lib/mock-data';

export default function AnalyticsPage() {
  const maxLatency = Math.max(...aiGenerationLatency.map(d => d.time));

  return (
    <div>
      <TopBar title="Analytics" subtitle="Marketplace health" />

      <div className="analytics-content">
        {/* Stats row */}
        <div className="analytics-stats-grid">
          <StatCard
            label="AI Listing Success"
            value={`${analyticsStats.ai_listing_success_pct}%`}
            change={analyticsStats.ai_success_change}
            icon={<AIIcon />}
            accent="#E27D60"
          />
          <StatCard
            label="Avg Generation Time"
            value={`${analyticsStats.avg_generation_time_s}s`}
            change={analyticsStats.gen_time_change}
            icon={<ClockIcon />}
            accent="#1F7A8C"
          />
          <StatCard
            label="Wellness Check-ins"
            value={analyticsStats.wellness_checkins.toLocaleString()}
            change={analyticsStats.wellness_change}
            icon={<HeartIcon />}
            accent="#E74C3C"
          />
          <StatCard
            label="Lessons Completed"
            value={analyticsStats.lessons_completed.toLocaleString()}
            change={analyticsStats.lessons_change}
            icon={<LearnIcon />}
            accent="#8E6FAF"
          />
        </div>

        {/* Charts row */}
        <div className="analytics-charts-row">
          {/* AI Latency Bar Chart */}
          <div className="card analytics-chart-card">
            <div className="analytics-chart-header">
              <div className="analytics-chart-title">AI listing performance</div>
              <div className="analytics-chart-sub">Generation latency · last 7 days</div>
            </div>
            <div className="bar-chart">
              {aiGenerationLatency.map((d, i) => (
                <div key={i} className="bar-col">
                  <div className="bar-value">{d.time}s</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${(d.time / maxLatency) * 100}%` }}
                    />
                  </div>
                  <div className="bar-label">{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wellness Sentiment Donut */}
          <div className="card analytics-chart-card">
            <div className="analytics-chart-header">
              <div className="analytics-chart-title">Wellness sentiment</div>
              <div className="analytics-chart-sub">Aggregated mood · this month</div>
            </div>
            <div className="wellness-chart">
              <div className="donut-wrap">
                <DonutChart sentiment={wellnessSentiment} />
                <div className="donut-center">
                  <div className="donut-pct">{wellnessSentiment.positive_pct}%</div>
                  <div className="donut-label">positive</div>
                </div>
              </div>
              <div className="wellness-legend">
                {[
                  { key: 'khush', label: 'Khush 😊', color: '#2D8A4E', pct: wellnessSentiment.khush },
                  { key: 'theek', label: 'Theek 😌', color: '#4CAF7D', pct: wellnessSentiment.theek },
                  { key: 'pareshan', label: 'Pareshan 😰', color: '#F0B429', pct: wellnessSentiment.pareshan },
                  { key: 'udaas', label: 'Udaas 😔', color: '#C0392B', pct: wellnessSentiment.udaas },
                  { key: 'thaki', label: 'Thaki 😤', color: '#9B8B7E', pct: wellnessSentiment.thaki },
                ].map(item => (
                  <div key={item.key} className="wellness-legend-row">
                    <span className="wellness-legend-dot" style={{ background: item.color }} />
                    <span className="wellness-legend-label">{item.label}</span>
                    <span className="wellness-legend-pct">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top sellers */}
        <div className="card top-sellers-card">
          <div className="analytics-chart-title" style={{ marginBottom: 16 }}>Top performing sellers</div>
          <div className="top-sellers-grid">
            {topSellers.map(seller => (
              <div key={seller.id} className="top-seller-item">
                <div className="top-seller-header">
                  <div
                    className="avatar avatar-md"
                    style={{ background: ['#E27D60', '#1F7A8C', '#8E6FAF', '#4CAF7D'][seller.rank - 1], color: 'white' }}
                  >
                    {seller.initials}
                  </div>
                  <div className="top-seller-rank">#{seller.rank}</div>
                </div>
                <div className="top-seller-name">{seller.name}</div>
                <div className="top-seller-gmv">PKR {seller.gmv_pkr.toLocaleString()}</div>
                <div className="top-seller-orders">{seller.orders} orders</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .analytics-content { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

        .analytics-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .analytics-charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .analytics-chart-card { padding: 20px; }

        .analytics-chart-header { margin-bottom: 20px; }

        .analytics-chart-title {
          font-size: 15px;
          font-weight: 600;
          color: #2A1F14;
        }

        .analytics-chart-sub {
          font-size: 12px;
          color: #6B5B4E;
          margin-top: 2px;
        }

        /* Bar chart */
        .bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 160px;
          padding-bottom: 24px;
          position: relative;
        }

        .bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          height: 100%;
        }

        .bar-value {
          font-size: 10px;
          color: #9B8B7E;
          font-weight: 500;
        }

        .bar-track {
          flex: 1;
          width: 100%;
          background: #F0E8DC;
          border-radius: 4px 4px 0 0;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .bar-fill {
          width: 100%;
          background: #E27D60;
          border-radius: 4px 4px 0 0;
          transition: height 0.5s ease;
        }

        .bar-label {
          font-size: 10px;
          color: #9B8B7E;
          position: absolute;
          bottom: 0;
        }

        /* Donut / Wellness */
        .wellness-chart {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .donut-wrap {
          position: relative;
          width: 130px;
          height: 130px;
          flex-shrink: 0;
        }

        .donut-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .donut-pct { font-size: 22px; font-weight: 700; color: #2A1F14; line-height: 1; }
        .donut-label { font-size: 11px; color: #6B5B4E; margin-top: 2px; }

        .wellness-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .wellness-legend-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wellness-legend-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .wellness-legend-label {
          font-size: 12.5px;
          color: #2A1F14;
          flex: 1;
        }

        .wellness-legend-pct {
          font-size: 12.5px;
          color: #6B5B4E;
          font-weight: 500;
          min-width: 30px;
          text-align: right;
        }

        /* Top sellers */
        .top-sellers-card { padding: 20px; }

        .top-sellers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .top-seller-item {
          background: #F9F4EE;
          border-radius: 12px;
          padding: 16px;
        }

        .top-seller-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .top-seller-rank {
          font-size: 12px;
          font-weight: 600;
          color: #9B8B7E;
          background: white;
          padding: 2px 8px;
          border-radius: 10px;
          border: 1px solid #E8DDD0;
        }

        .top-seller-name { font-size: 13.5px; font-weight: 600; color: #2A1F14; margin-bottom: 4px; }
        .top-seller-gmv { font-size: 16px; font-weight: 700; color: #2A1F14; }
        .top-seller-orders { font-size: 12px; color: #6B5B4E; margin-top: 2px; }

        @media (max-width: 1100px) {
          .analytics-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .top-sellers-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .analytics-content { padding: 16px; gap: 16px; }
          .analytics-charts-row { grid-template-columns: 1fr; }
          .analytics-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .top-sellers-grid { grid-template-columns: repeat(2, 1fr); }
          .wellness-chart { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

function DonutChart({ sentiment }: { sentiment: typeof wellnessSentiment }) {
  const segments = [
    { pct: sentiment.khush, color: '#2D8A4E' },
    { pct: sentiment.theek, color: '#4CAF7D' },
    { pct: sentiment.pareshan, color: '#F0B429' },
    { pct: sentiment.udaas, color: '#C0392B' },
    { pct: sentiment.thaki, color: '#9B8B7E' },
  ];

  const r = 50;
  const cx = 65;
  const cy = 65;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      {segments.map((seg, i) => {
        const dashArray = (seg.pct / 100) * circumference;
        const dashOffset = circumference - offset * circumference / 100;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += seg.pct;
        return el;
      })}
      <circle cx={cx} cy={cy} r={r - 9} fill="white" />
    </svg>
  );
}

function AIIcon() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v2M9 14v2M16 9h-2M4 9H2M14.2 3.8l-1.4 1.4M5.2 11.8l-1.4 1.4M14.2 14.2l-1.4-1.4M5.2 6.2 3.8 4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.3"/></svg>; }
function ClockIcon() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function HeartIcon() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 15S2 10.5 2 6a4 4 0 0 1 7-2.6A4 4 0 0 1 16 6c0 4.5-7 9-7 9Z" stroke="currentColor" strokeWidth="1.3"/></svg>; }
function LearnIcon() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L1 6.5L9 11L17 6.5L9 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4 8.5v5s1.5 2 5 2 5-2 5-2v-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
