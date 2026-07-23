'use client';

import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { sellers, buyers, getInitials, getAvatarColor } from '../../lib/mock-data';
import type { User } from '../../types';

type Tab = 'sellers' | 'buyers' | 'admins';

const admins: User[] = [
  { id: 'a1', name: 'Sana Urooj', phone: '+92···9001', role: 'admin', preferred_language: 'en', city: 'Islamabad', status: 'verified', joined_at: 'Jan 10' },
  { id: 'a2', name: 'Admin Ali', phone: '+92···9002', role: 'admin', preferred_language: 'en', city: 'Lahore', status: 'verified', joined_at: 'Feb 01' },
];

export default function UsersPage() {
  const [tab, setTab] = useState<Tab>('sellers');
  const [search, setSearch] = useState('');

  const allSellers = sellers;
  const allBuyers = buyers;

  const filtered =
    tab === 'sellers' ? allSellers.filter(u => u.name.toLowerCase().includes(search.toLowerCase())) :
    tab === 'buyers' ? allBuyers.filter(u => u.name.toLowerCase().includes(search.toLowerCase())) :
    admins.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <TopBar
        title="Users"
        subtitle={`${allSellers.length} sellers · ${allBuyers.length} buyers`}
        actions={
          <button className="btn btn-primary">
            <PlusIcon /> Invite admin
          </button>
        }
      />

      <div className="users-content">
        <div className="card users-card">
          {/* Tabs + filter bar */}
          <div className="users-toolbar">
            <div className="users-tabs">
              <button
                className={`users-tab${tab === 'sellers' ? ' active' : ''}`}
                onClick={() => setTab('sellers')}
              >
                Sellers {allSellers.length}
              </button>
              <button
                className={`users-tab${tab === 'buyers' ? ' active' : ''}`}
                onClick={() => setTab('buyers')}
              >
                Buyers {allBuyers.length}
              </button>
              <button
                className={`users-tab${tab === 'admins' ? ' active' : ''}`}
                onClick={() => setTab('admins')}
              >
                Admins 6
              </button>
            </div>
            <div className="users-toolbar-right">
              <button className="btn btn-secondary">
                <FilterIcon /> Filter
              </button>
              <button className="btn btn-secondary">
                <DownloadIcon /> CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrap">
            {tab === 'sellers' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Seller</th>
                    <th>City</th>
                    <th className="hide-tablet">Category</th>
                    <th className="hide-tablet">Listings</th>
                    <th className="hide-mobile">GMV</th>
                    <th className="hide-mobile">Rating</th>
                    <th>Status</th>
                    <th className="hide-tablet">Joined</th>
                    <th style={{ width: 40 }}/>
                  </tr>
                </thead>
                <tbody>
                  {(filtered as User[]).map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div
                            className="avatar avatar-sm"
                            style={{ background: getAvatarColor(user.name), color: 'white' }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-phone">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{user.city}</td>
                      <td className="text-sm hide-tablet">{user.categories?.join(' + ')}</td>
                      <td className="text-sm hide-tablet">{user.listings_count}</td>
                      <td className="text-sm hide-mobile">PKR {user.gmv_pkr?.toLocaleString()}</td>
                      <td className="text-sm hide-mobile">★ {user.rating}</td>
                      <td>
                        <span className={`badge badge-${user.status}`}>
                          <span className={`dot dot-${
                            user.status === 'verified' ? 'green' :
                            user.status === 'pending' ? 'amber' :
                            user.status === 'review' ? 'amber' : 'red'
                          }`}/>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-sm text-muted hide-tablet">{user.joined_at}</td>
                      <td>
                        <button className="btn-icon btn">
                          <DotsIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'buyers' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Buyer</th>
                    <th>City</th>
                    <th className="hide-mobile">Language</th>
                    <th>Status</th>
                    <th className="hide-tablet">Joined</th>
                    <th style={{ width: 40 }}/>
                  </tr>
                </thead>
                <tbody>
                  {(filtered as User[]).map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div
                            className="avatar avatar-sm"
                            style={{ background: getAvatarColor(user.name), color: 'white' }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-phone">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{user.city}</td>
                      <td className="text-sm hide-mobile">{user.preferred_language === 'ur' ? 'اردو' : 'English'}</td>
                      <td>
                        <span className={`badge badge-${user.status}`}>
                          <span className={`dot dot-${user.status === 'verified' ? 'green' : 'amber'}`}/>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-sm text-muted hide-tablet">{user.joined_at}</td>
                      <td>
                        <button className="btn-icon btn"><DotsIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'admins' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>City</th>
                    <th>Status</th>
                    <th className="hide-tablet">Joined</th>
                    <th style={{ width: 40 }}/>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar avatar-sm" style={{ background: '#8E6FAF', color: 'white' }}>
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-phone">Super admin</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{user.city}</td>
                      <td>
                        <span className="badge badge-verified">
                          <span className="dot dot-green"/>ACTIVE
                        </span>
                      </td>
                      <td className="text-sm text-muted hide-tablet">{user.joined_at}</td>
                      <td>
                        <button className="btn-icon btn"><DotsIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span className="text-sm text-muted">
              Showing 1–{filtered.length} of {
                tab === 'sellers' ? allSellers.length :
                tab === 'buyers' ? allBuyers.length : 6
              }
            </span>
            <div className="pagination-btns">
              <button className="pagination-btn" disabled>‹</button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">4</button>
              <button className="pagination-btn">›</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .users-content { padding: 24px; }
        .users-card { overflow: hidden; }

        .users-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid #F0E8DC;
          gap: 12px;
          flex-wrap: wrap;
        }

        .users-tabs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .users-tab {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          border: 1.5px solid transparent;
          background: transparent;
          color: #6B5B4E;
          cursor: pointer;
          transition: all 0.12s;
        }

        .users-tab:hover { background: #F7F3EE; }
        .users-tab.active { background: #E27D60; color: white; border-color: #E27D60; }

        .users-toolbar-right {
          display: flex;
          gap: 8px;
        }

        .table-wrap { overflow-x: auto; }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-name { font-size: 13.5px; font-weight: 500; color: #2A1F14; }
        .user-phone { font-size: 11.5px; color: #9B8B7E; }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-top: 1px solid #F0E8DC;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pagination-btns { display: flex; gap: 4px; }

        .pagination-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #E8DDD0;
          background: white;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2A1F14;
          transition: all 0.12s;
        }

        .pagination-btn:hover:not(:disabled):not(.active) { background: #F9F4EE; }
        .pagination-btn.active { background: #E27D60; color: white; border-color: #E27D60; }
        .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 768px) {
          .users-content { padding: 16px; }
          .users-toolbar { padding: 10px 12px; }
        }
      `}</style>
    </div>
  );
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function FilterIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function DotsIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>;
}
