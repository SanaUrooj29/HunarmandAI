import TopBar from '../../components/layout/TopBar';

const aiStats = [
  { label: 'Total API Calls Today', value: '892', change: 12, color: '#E27D60' },
  { label: 'Success Rate', value: '94.2%', change: 3, color: '#2D8A4E' },
  { label: 'Avg Latency', value: '6.4s', change: -12, color: '#1F7A8C' },
  { label: 'Cost Today (USD)', value: '$4.82', change: 8, color: '#8E6FAF' },
];

const recentCalls = [
  { id: 'c1', type: 'listing', seller: 'Fatima A.', model: 'claude-sonnet-4-6', latency: '5.2s', status: 'success', time: '2m ago' },
  { id: 'c2', type: 'wellness', seller: 'Khadija B.', model: 'claude-sonnet-4-6', latency: '3.8s', status: 'success', time: '5m ago' },
  { id: 'c3', type: 'listing', seller: 'Rabia Z.', model: 'claude-sonnet-4-6', latency: '12.1s', status: 'timeout', time: '18m ago' },
  { id: 'c4', type: 'listing', seller: 'Saima B.', model: 'claude-sonnet-4-6', latency: '4.9s', status: 'success', time: '23m ago' },
  { id: 'c5', type: 'wellness', seller: 'Nida A.', model: 'claude-sonnet-4-6', latency: '6.1s', status: 'success', time: '31m ago' },
  { id: 'c6', type: 'listing', seller: 'Mehnaz B.', model: 'claude-sonnet-4-6', latency: '8.4s', status: 'success', time: '42m ago' },
];

const flaggedByAI = [
  { listing: 'LST-8841', reason: 'Missing allergen info', category: 'Jewelry → Earrings', confidence: '92%' },
  { listing: 'LST-8834', reason: 'Low confidence category', category: 'Crafts', confidence: '58%' },
  { listing: 'LST-8820', reason: 'Potential harmful content', category: 'Food', confidence: '71%' },
];

export default function AIMonitoringPage() {
  return (
    <div>
      <TopBar title="AI monitoring" subtitle="claude-sonnet-4-6 · live stats" />

      <div className="aim-content">
        {/* Stats */}
        <div className="aim-stats-grid">
          {aiStats.map(stat => (
            <div key={stat.label} className="card aim-stat">
              <div className="aim-stat-label">{stat.label}</div>
              <div className="aim-stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className={`aim-stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% today
              </div>
            </div>
          ))}
        </div>

        <div className="aim-split">
          {/* Recent API calls */}
          <div className="card aim-card">
            <div className="aim-card-title">Recent API calls</div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Seller</th>
                    <th className="hide-mobile">Model</th>
                    <th>Latency</th>
                    <th>Status</th>
                    <th className="hide-tablet">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map(call => (
                    <tr key={call.id}>
                      <td>
                        <span className={`call-type-badge ${call.type}`}>
                          {call.type === 'listing' ? '🖼️ Listing' : '💬 Wellness'}
                        </span>
                      </td>
                      <td className="text-sm">{call.seller}</td>
                      <td className="text-xs text-muted hide-mobile" style={{ fontFamily: 'monospace' }}>{call.model}</td>
                      <td className={`text-sm ${Number(call.latency) > 10 ? 'latency-slow' : ''}`} style={{ fontFamily: 'monospace' }}>{call.latency}</td>
                      <td>
                        <span className={`badge ${call.status === 'success' ? 'badge-verified' : 'badge-issues'}`}>
                          <span className={`dot ${call.status === 'success' ? 'dot-green' : 'dot-red'}`} />
                          {call.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-sm text-muted hide-tablet">{call.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI-flagged listings */}
          <div className="card aim-card">
            <div className="aim-card-title">AI auto-flags</div>
            <div className="ai-flags-list">
              {flaggedByAI.map(flag => (
                <div key={flag.listing} className="ai-flag-row">
                  <div className="ai-flag-id">#{flag.listing}</div>
                  <div className="ai-flag-reason">{flag.reason}</div>
                  <div className="ai-flag-meta">
                    <span>{flag.category}</span>
                    <span className="ai-flag-confidence">
                      Confidence: <strong>{flag.confidence}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="aim-model-info">
              <div className="aim-model-info-title">Model configuration</div>
              <div className="aim-model-info-row">
                <span>Model</span>
                <span className="aim-model-val">claude-sonnet-4-6</span>
              </div>
              <div className="aim-model-info-row">
                <span>Max tokens</span>
                <span className="aim-model-val">1,000</span>
              </div>
              <div className="aim-model-info-row">
                <span>Rate limit</span>
                <span className="aim-model-val">30 req / user / min</span>
              </div>
              <div className="aim-model-info-row">
                <span>Timeout</span>
                <span className="aim-model-val">15s</span>
              </div>
              <div className="aim-model-info-row">
                <span>API status</span>
                <span className="badge badge-healthy"><span className="dot dot-green"/>HEALTHY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .aim-content { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

        .aim-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .aim-stat { padding: 18px 20px; }
        .aim-stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: #9B8B7E; margin-bottom: 8px; }
        .aim-stat-value { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
        .aim-stat-change { font-size: 12px; font-weight: 500; }
        .aim-stat-change.positive { color: #2D8A4E; }
        .aim-stat-change.negative { color: #C0392B; }

        .aim-split {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
        }

        .aim-card { overflow: hidden; }
        .aim-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #2A1F14;
          padding: 16px 16px 0;
          margin-bottom: 12px;
        }

        .call-type-badge {
          font-size: 12px;
          color: #4A3F35;
        }

        .latency-slow { color: #C0392B; font-weight: 600; }

        .table-wrap { overflow-x: auto; }

        .ai-flags-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0 16px;
          border-bottom: 1px solid #F0E8DC;
          margin-bottom: 16px;
        }

        .ai-flag-row {
          padding: 12px 0;
          border-bottom: 1px solid #F0E8DC;
        }

        .ai-flag-row:last-child { border-bottom: none; }

        .ai-flag-id {
          font-size: 12px;
          font-weight: 700;
          color: #9B8B7E;
          font-family: monospace;
          margin-bottom: 2px;
        }

        .ai-flag-reason {
          font-size: 13px;
          font-weight: 500;
          color: #2A1F14;
          margin-bottom: 3px;
        }

        .ai-flag-meta {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: #6B5B4E;
        }

        .ai-flag-confidence strong { color: #C47A1F; }

        .aim-model-info {
          padding: 0 16px 16px;
        }

        .aim-model-info-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #9B8B7E;
          margin-bottom: 10px;
        }

        .aim-model-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid #F0E8DC;
          font-size: 12.5px;
          color: #6B5B4E;
        }

        .aim-model-info-row:last-child { border-bottom: none; }

        .aim-model-val {
          font-size: 12.5px;
          font-weight: 500;
          color: #2A1F14;
          font-family: monospace;
        }

        @media (max-width: 1100px) {
          .aim-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .aim-split { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .aim-content { padding: 16px; }
          .aim-stats-grid { gap: 10px; }
        }
      `}</style>
    </div>
  );
}
