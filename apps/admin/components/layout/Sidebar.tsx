'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: DashIcon },
  { href: '/moderation', label: 'Moderation', icon: ModIcon, badge: 12 },
  { href: '/users', label: 'Users', icon: UsersIcon },
  { href: '/orders', label: 'Orders', icon: OrdersIcon },
  { href: '/analytics', label: 'Analytics', icon: AnalyticsIcon },
  { href: '/payouts', label: 'Payouts', icon: PayoutsIcon },
  { href: '/ngo-partners', label: 'NGO partners', icon: NGOIcon },
  { href: '/learning-content', label: 'Learning content', icon: LearnIcon },
  { href: '/ai-monitoring', label: 'AI monitoring', icon: AIIcon },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <MenuIcon />
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar${mobileOpen ? ' sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <SparkleIcon />
          </div>
          <div>
            <div className="sidebar-brand-name">HunarmandAI</div>
            <div className="sidebar-brand-role">Admin · v2.0</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-nav-item${active ? ' sidebar-nav-item--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon />
                <span className="sidebar-nav-label">{label}</span>
                {badge ? (
                  <span className="sidebar-nav-badge">{badge}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User at bottom */}
        <div className="sidebar-user">
          <div className="avatar avatar-sm" style={{ background: '#E27D60', color: 'white' }}>
            SU
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Sana Urooj</div>
            <div className="sidebar-user-role">Super admin</div>
          </div>
          <button className="btn-icon btn sidebar-user-chevron">
            <ChevronIcon />
          </button>
        </div>
      </aside>

      <style>{`
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 200;
          background: white;
          border: 1px solid #E8DDD0;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .sidebar-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 150;
        }

        .sidebar {
          width: var(--sidebar-width, 220px);
          height: 100vh;
          background: white;
          border-right: 1px solid #E8DDD0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          overflow-y: auto;
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 16px;
          border-bottom: 1px solid #F0E8DC;
        }

        .sidebar-brand-icon {
          width: 34px;
          height: 34px;
          background: #E27D60;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .sidebar-brand-name {
          font-weight: 700;
          font-size: 14px;
          color: #2A1F14;
          line-height: 1.2;
        }

        .sidebar-brand-role {
          font-size: 11px;
          color: #6B5B4E;
        }

        .sidebar-nav {
          padding: 10px 8px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          text-decoration: none;
          color: #6B5B4E;
          font-size: 13.5px;
          font-weight: 400;
          transition: all 0.12s ease;
          position: relative;
        }

        .sidebar-nav-item:hover {
          background: #F9F4EE;
          color: #2A1F14;
        }

        .sidebar-nav-item--active {
          background: #FEF0EA;
          color: #E27D60;
          font-weight: 500;
        }

        .sidebar-nav-item--active svg {
          color: #E27D60;
        }

        .sidebar-nav-item svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .sidebar-nav-label {
          flex: 1;
        }

        .sidebar-nav-badge {
          background: #E27D60;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 12px;
          border-top: 1px solid #F0E8DC;
          cursor: pointer;
        }

        .sidebar-user:hover { background: #F9F4EE; }

        .sidebar-user-info {
          flex: 1;
          min-width: 0;
        }

        .sidebar-user-name {
          font-size: 13px;
          font-weight: 500;
          color: #2A1F14;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-user-role {
          font-size: 11px;
          color: #6B5B4E;
        }

        .sidebar-user-chevron {
          border: none;
          padding: 2px;
          color: #6B5B4E;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .sidebar-backdrop { display: block; }
          .sidebar {
            position: fixed;
            left: -240px;
            top: 0;
            transition: left 0.25s ease;
            width: 240px;
            height: 100vh;
            box-shadow: var(--shadow-lg);
          }
          .sidebar--open { left: 0; }
        }
      `}</style>
    </>
  );
}

// ─── Icon components ──────────────────────────────────────────────────────────
function DashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/>
    </svg>
  );
}

function ModIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L10 5.5H15L11 8.5L12.5 13L8 10.5L3.5 13L5 8.5L1 5.5H6L8 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 13c0-2.5 2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M11 5c1 0 2 .8 2 2M13 13c0-1.5-1-2.5-2.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="1.5" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 14L5 9L8 11L12 5L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PayoutsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 7h14" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="4.5" cy="10.5" r="1" fill="currentColor"/>
    </svg>
  );
}

function NGOIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2.5C5.5 2.5 3 4.5 3 7c0 3 5 7 5 7s5-4 5-7c0-2.5-2.5-4.5-5-4.5Z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M6 7l1.5 1.5L10 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2L1 5.5L8 9L15 5.5L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M4 7.5V11.5C4 11.5 5.5 13 8 13s4-1.5 4-1.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M15 5.5V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function AIIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.2 3.8l-1.4 1.4M5.2 10.8l-1.4 1.4M12.2 12.2l-1.4-1.4M5.2 5.2 3.8 3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M13.2 2.8l-1 1M3.8 11.2l-1 1M13.2 13.2l-1-1M3.8 4.8l-1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2L10.5 7H16L11.5 10L13 15L9 12L5 15L6.5 10L2 7H7.5L9 2Z" fill="white"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 4h14M2 9h14M2 14h14" stroke="#2A1F14" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 5l3-3 3 3M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
