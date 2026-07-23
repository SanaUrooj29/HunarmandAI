'use client';

import { useState } from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <span className="topbar-subtitle">{subtitle}</span>}
      </div>
      <div className="topbar-right">
        <div className={`topbar-search${searchOpen ? ' topbar-search--open' : ''}`}>
          <SearchIcon />
          <input
            className="topbar-search-input"
            placeholder="Search..."
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
          <kbd className="topbar-search-kbd">⌘K</kbd>
        </div>
        {actions}
        <button className="topbar-notif btn btn-icon">
          <BellIcon />
        </button>
      </div>

      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid #F0E8DC;
          background: white;
          position: sticky;
          top: 0;
          z-index: 50;
          gap: 12px;
          min-height: 64px;
        }

        .topbar-left {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .topbar-title {
          font-size: 18px;
          font-weight: 700;
          color: #2A1F14;
          line-height: 1.2;
        }

        .topbar-subtitle {
          font-size: 12px;
          color: #6B5B4E;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F7F3EE;
          border: 1px solid #E8DDD0;
          border-radius: 8px;
          padding: 6px 10px;
          transition: all 0.15s ease;
          width: 180px;
        }

        .topbar-search--open {
          border-color: #E27D60;
          background: white;
          width: 240px;
        }

        .topbar-search svg {
          width: 14px;
          height: 14px;
          color: #6B5B4E;
          flex-shrink: 0;
        }

        .topbar-search-input {
          border: none;
          background: transparent;
          font-size: 13px;
          color: #2A1F14;
          outline: none;
          flex: 1;
          min-width: 0;
        }

        .topbar-search-input::placeholder { color: #9B8B7E; }

        .topbar-search-kbd {
          font-size: 10px;
          color: #9B8B7E;
          background: #EDE0CE;
          border-radius: 4px;
          padding: 1px 5px;
          font-family: monospace;
        }

        .topbar-notif {
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .topbar {
            padding: 12px 16px 12px 56px;
          }
          .topbar-search { width: 36px; padding: 6px; }
          .topbar-search-input, .topbar-search-kbd { display: none; }
          .topbar-search--open { width: 160px; }
          .topbar-search--open .topbar-search-input { display: block; }
        }
      `}</style>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6v3L2 10.5h12L12.5 9V6C12.5 3.5 10.5 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M6.5 13c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5H6.5Z" fill="currentColor"/>
    </svg>
  );
}
