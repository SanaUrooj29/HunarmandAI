interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, change, icon, accent = '#E27D60' }: StatCardProps) {
  const positive = change !== undefined && change >= 0;
  return (
    <div className="stat-card card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {icon && (
          <div className="stat-card-icon" style={{ color: accent }}>
            {icon}
          </div>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      {change !== undefined && (
        <div className={`stat-card-change ${positive ? 'positive' : 'negative'}`}>
          <span>{positive ? '↑' : '↓'}</span>
          {Math.abs(change)}% vs last month
        </div>
      )}

      <style>{`
        .stat-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .stat-card-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6B5B4E;
        }

        .stat-card-icon {
          opacity: 0.7;
        }

        .stat-card-icon svg {
          width: 18px;
          height: 18px;
        }

        .stat-card-value {
          font-size: 28px;
          font-weight: 700;
          color: #2A1F14;
          line-height: 1;
          margin-top: 4px;
        }

        .stat-card-change {
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .stat-card-change.positive { color: #2D8A4E; }
        .stat-card-change.negative { color: #C0392B; }
      `}</style>
    </div>
  );
}
