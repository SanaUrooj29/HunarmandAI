'use client';

import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { flaggedListings } from '../../lib/mock-data';
import type { Product } from '../../types';

type QueueFilter = 'all' | 'auto' | 'reported';

export default function ModerationPage() {
  const [selected, setSelected] = useState<Product>(flaggedListings[0]);
  const [filter, setFilter] = useState<QueueFilter>('all');
  const [queue, setQueue] = useState(flaggedListings);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeReason, setRemoveReason] = useState('');

  const filtered = queue.filter(p =>
    filter === 'all' ? true :
    filter === 'auto' ? p.flag_source === 'auto' :
    p.flag_source === 'reported'
  );

  const autoCount = queue.filter(p => p.flag_source === 'auto').length;
  const reportedCount = queue.filter(p => p.flag_source === 'reported').length;

  function handleApprove() {
    setQueue(q => q.filter(p => p.id !== selected.id));
    const remaining = queue.filter(p => p.id !== selected.id);
    if (remaining.length > 0) setSelected(remaining[0]);
  }

  function handleRemove() {
    if (!removeReason) return;
    setQueue(q => q.filter(p => p.id !== selected.id));
    const remaining = queue.filter(p => p.id !== selected.id);
    if (remaining.length > 0) setSelected(remaining[0]);
    setShowRemoveModal(false);
    setRemoveReason('');
  }

  return (
    <div>
      <TopBar
        title="Moderation"
        subtitle={`${queue.length} listings need review`}
        actions={
          <button className="btn btn-secondary">
            Audit log
          </button>
        }
      />

      <div className="mod-layout">
        {/* Queue panel */}
        <div className="mod-queue">
          <div className="mod-filters">
            <button className={`mod-filter-btn${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
              All {queue.length}
            </button>
            <button className={`mod-filter-btn${filter === 'auto' ? ' active' : ''}`} onClick={() => setFilter('auto')}>
              Auto {autoCount}
            </button>
            <button className={`mod-filter-btn${filter === 'reported' ? ' active' : ''}`} onClick={() => setFilter('reported')}>
              Reported {reportedCount}
            </button>
          </div>

          <div className="mod-queue-list">
            {filtered.map(p => (
              <button
                key={p.id}
                className={`mod-queue-item${selected?.id === p.id ? ' mod-queue-item--active' : ''}`}
                onClick={() => setSelected(p)}
              >
                <div className="mod-queue-item-img">
                  <div className="mod-queue-img-placeholder">
                    <ProductIcon />
                  </div>
                </div>
                <div className="mod-queue-item-info">
                  <div className="mod-queue-item-name">{p.title_en}</div>
                  <div className="mod-queue-item-seller">{p.seller_name} · {p.seller_city}</div>
                  <div className="mod-queue-item-tags">
                    <span className={`badge ${p.flag_source === 'auto' ? 'badge-auto-flag' : 'badge-reported'}`}>
                      {p.flag_source === 'auto' ? 'AUTO-FLAG' : 'REPORTED'}
                    </span>
                    <span className="mod-queue-flag-reason">{formatFlagReason(p.flag_reason)}</span>
                  </div>
                </div>
                <div className="mod-queue-item-time">{p.submitted_at}</div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="mod-empty">
                <CheckCircleIcon />
                <p>No listings in this queue</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="mod-detail">
            <div className="mod-detail-header">
              <div>
                <h2 className="mod-detail-title">{selected.title_en}</h2>
                <div className="mod-detail-meta">
                  <span>Listing #{selected.listing_id}</span>
                  <span>Submitted {selected.submitted_at}</span>
                  <span className="mod-detail-flag-badge">
                    <WarnIcon /> Auto-flagged: {formatFlagReason(selected.flag_reason)}
                  </span>
                </div>
              </div>
              <div className="mod-detail-actions">
                <button className="btn btn-secondary">Edit & approve</button>
                <button className="btn btn-danger" onClick={() => setShowRemoveModal(true)}>Remove</button>
                <button className="btn btn-success" onClick={handleApprove}>
                  <CheckIcon /> Approve
                </button>
              </div>
            </div>

            <div className="mod-detail-body">
              {/* Product images */}
              <div className="mod-detail-images">
                <div className="mod-main-image">
                  <div className="mod-img-placeholder">
                    <ProductIcon />
                    <span>Product image</span>
                  </div>
                </div>
                <div className="mod-thumb-row">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="mod-thumb">
                      <div className="mod-thumb-placeholder"><ProductIcon /></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Listing info */}
              <div className="mod-detail-info">
                {/* Content */}
                <div className="mod-info-section">
                  <div className="mod-info-title">Listing content</div>

                  <div className="mod-info-field">
                    <div className="mod-info-label">CATEGORY</div>
                    <div className="mod-info-value">{selected.category_path || selected.category}</div>
                  </div>

                  <div className="mod-info-field">
                    <div className="mod-info-label">TITLE</div>
                    <div className="mod-info-value">{selected.title_en}</div>
                  </div>

                  <div className="mod-info-field">
                    <div className="mod-info-label">DESCRIPTION</div>
                    <div className="mod-info-value mod-info-value--desc">{selected.description_en}</div>
                  </div>

                  <div className="mod-price-row">
                    <div className="mod-info-field">
                      <div className="mod-info-label">PRICE</div>
                      <div className="mod-price">PKR {selected.price_pkr.toLocaleString()}</div>
                    </div>
                    {selected.price_suggested_min && (
                      <div className="mod-info-field">
                        <div className="mod-info-label">SUGGESTED RANGE</div>
                        <div className="mod-info-value">
                          PKR {selected.price_suggested_min.toLocaleString()} – {selected.price_suggested_max?.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Flag box */}
                  {selected.flag_reason && (
                    <div className="mod-flag-box">
                      <div className="mod-flag-box-title">
                        <WarnIcon /> Auto-flag: {formatFlagReason(selected.flag_reason)}
                      </div>
                      <div className="mod-flag-box-desc">
                        {getFlagDescription(selected.flag_reason, selected.category_path)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Seller info */}
                <div className="mod-info-section">
                  <div className="mod-info-title">Seller</div>
                  <div className="mod-seller-card">
                    <div className="avatar avatar-lg" style={{ background: '#E27D60', color: 'white' }}>
                      {selected.seller_name.split(' ').map(p => p[0]).join('').slice(0,2)}
                    </div>
                    <div className="mod-seller-info">
                      <div className="mod-seller-name">{selected.seller_name}</div>
                      <div className="mod-seller-meta">{selected.seller_city}</div>
                      <div className="mod-seller-meta">8 products · ★ 4.6</div>
                      <div className="mod-seller-joined">Joined Apr 2026</div>
                    </div>
                    <div className="mod-seller-removals">
                      <span className="badge badge-healthy">0 PRIOR REMOVALS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Remove modal */}
      {showRemoveModal && (
        <div className="modal-overlay" onClick={() => setShowRemoveModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Remove listing</div>
            <div className="modal-body">
              <label className="modal-label">Reason for removal</label>
              <select
                className="input w-full"
                value={removeReason}
                onChange={e => setRemoveReason(e.target.value)}
              >
                <option value="">Select a reason…</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="safety">Missing safety information</option>
                <option value="duplicate">Duplicate listing</option>
                <option value="fake">Misleading or fake product</option>
                <option value="quality">Image quality too low</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowRemoveModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleRemove} disabled={!removeReason}>Confirm removal</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mod-layout {
          display: flex;
          height: calc(100vh - 64px);
          overflow: hidden;
        }

        .mod-queue {
          width: 280px;
          border-right: 1px solid #E8DDD0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          background: white;
        }

        .mod-filters {
          display: flex;
          gap: 6px;
          padding: 14px 12px;
          border-bottom: 1px solid #F0E8DC;
        }

        .mod-filter-btn {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          border: 1.5px solid transparent;
          background: #F7F3EE;
          color: #6B5B4E;
          cursor: pointer;
          transition: all 0.12s;
        }

        .mod-filter-btn:hover { background: #EDE0CE; }

        .mod-filter-btn.active {
          background: #E27D60;
          color: white;
          border-color: #E27D60;
        }

        .mod-queue-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mod-queue-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: all 0.12s;
          width: 100%;
        }

        .mod-queue-item:hover { background: #F9F4EE; }

        .mod-queue-item--active {
          background: #FEF0EA;
          border-color: #F5C4B4;
        }

        .mod-queue-item-img { flex-shrink: 0; }

        .mod-queue-img-placeholder {
          width: 44px;
          height: 44px;
          background: #F0E8DC;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9B8B7E;
        }

        .mod-queue-img-placeholder svg { width: 20px; height: 20px; }

        .mod-queue-item-info { flex: 1; min-width: 0; }

        .mod-queue-item-name {
          font-size: 13px;
          font-weight: 500;
          color: #2A1F14;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mod-queue-item-seller {
          font-size: 11.5px;
          color: #6B5B4E;
          margin-top: 2px;
        }

        .mod-queue-item-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 5px;
          flex-wrap: wrap;
        }

        .mod-queue-flag-reason {
          font-size: 11px;
          color: #6B5B4E;
        }

        .mod-queue-item-time {
          font-size: 11px;
          color: #9B8B7E;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .mod-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 16px;
          color: #9B8B7E;
          font-size: 13px;
        }

        .mod-empty svg { width: 32px; height: 32px; color: #C5B8AD; }

        /* Detail */
        .mod-detail {
          flex: 1;
          overflow-y: auto;
          background: #F7F3EE;
        }

        .mod-detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 24px;
          background: white;
          border-bottom: 1px solid #F0E8DC;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mod-detail-title {
          font-size: 17px;
          font-weight: 700;
          color: #2A1F14;
          margin-bottom: 4px;
        }

        .mod-detail-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #6B5B4E;
          flex-wrap: wrap;
        }

        .mod-detail-flag-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #C47A1F;
          font-weight: 500;
        }

        .mod-detail-flag-badge svg { width: 12px; height: 12px; }

        .mod-detail-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          align-items: center;
        }

        .mod-detail-body {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 0;
          padding: 0;
        }

        .mod-detail-images {
          padding: 20px;
          border-right: 1px solid #E8DDD0;
          background: white;
        }

        .mod-main-image {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          background: #F0E8DC;
          margin-bottom: 10px;
          max-height: 320px;
        }

        .mod-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #9B8B7E;
          font-size: 12px;
          min-height: 200px;
        }

        .mod-img-placeholder svg { width: 40px; height: 40px; }

        .mod-thumb-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .mod-thumb {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: #EDE0CE;
        }

        .mod-thumb-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #B5A090;
        }

        .mod-thumb-placeholder svg { width: 20px; height: 20px; }

        .mod-detail-info {
          background: white;
          border-left: 1px solid #F0E8DC;
          overflow-y: auto;
        }

        .mod-info-section {
          padding: 20px;
          border-bottom: 1px solid #F0E8DC;
        }

        .mod-info-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6B5B4E;
          margin-bottom: 14px;
        }

        .mod-info-field { margin-bottom: 12px; }

        .mod-info-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9B8B7E;
          margin-bottom: 3px;
        }

        .mod-info-value {
          font-size: 13.5px;
          color: #2A1F14;
          line-height: 1.4;
        }

        .mod-info-value--desc {
          font-size: 12.5px;
          color: #4A3F35;
          line-height: 1.5;
        }

        .mod-price-row {
          display: flex;
          gap: 20px;
          margin-bottom: 12px;
        }

        .mod-price {
          font-size: 17px;
          font-weight: 700;
          color: #2A1F14;
        }

        .mod-flag-box {
          background: #FEF3DC;
          border: 1px solid #F0D090;
          border-radius: 8px;
          padding: 12px;
          margin-top: 4px;
        }

        .mod-flag-box-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: #C47A1F;
          margin-bottom: 6px;
        }

        .mod-flag-box-title svg { width: 13px; height: 13px; }

        .mod-flag-box-desc {
          font-size: 12px;
          color: #6B5B4E;
          line-height: 1.5;
        }

        .mod-seller-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .mod-seller-info { flex: 1; }
        .mod-seller-name { font-size: 14px; font-weight: 600; color: #2A1F14; }
        .mod-seller-meta { font-size: 12px; color: #6B5B4E; margin-top: 1px; }
        .mod-seller-joined { font-size: 11px; color: #9B8B7E; margin-top: 4px; }
        .mod-seller-removals { margin-top: 2px; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 14px;
          padding: 24px;
          width: 360px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        }

        .modal-title {
          font-size: 16px;
          font-weight: 700;
          color: #2A1F14;
          margin-bottom: 16px;
        }

        .modal-body { margin-bottom: 20px; }
        .modal-label { display: block; font-size: 12px; font-weight: 500; color: #6B5B4E; margin-bottom: 6px; }

        .modal-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        @media (max-width: 1024px) {
          .mod-detail-body { grid-template-columns: 1fr; }
          .mod-detail-images { border-right: none; border-bottom: 1px solid #E8DDD0; }
          .mod-detail-info { border-left: none; }
        }

        @media (max-width: 768px) {
          .mod-layout { flex-direction: column; height: auto; overflow: visible; }
          .mod-queue { width: 100%; height: auto; max-height: 40vh; overflow-y: auto; }
          .mod-detail-header { flex-direction: column; }
          .mod-detail-actions { width: 100%; }
        }
      `}</style>
    </div>
  );
}

function formatFlagReason(reason?: string): string {
  const map: Record<string, string> = {
    missing_safety_info: 'Missing safety info',
    ai_confidence_low: 'AI confidence low',
    image_quality: 'Image quality',
    duplicate_listing: 'Duplicate listing',
    buyer_reported: 'Buyer reported',
  };
  return reason ? (map[reason] || reason) : '';
}

function getFlagDescription(reason: string, category?: string): string {
  const map: Record<string, string> = {
    missing_safety_info: `Listings in ${category || 'this category'} require an "allergen / material" disclosure. Add this in the description before approving, or use Edit & Approve.`,
    ai_confidence_low: 'The AI model was not confident about the category classification. Please verify the category is correct before approving.',
    image_quality: 'The product image may be too dark, blurry, or have a cluttered background. Consider asking the seller to re-upload before approving.',
    duplicate_listing: 'This listing appears to be a duplicate of an existing active listing by the same seller.',
    buyer_reported: 'A buyer has flagged this listing. Please review the content carefully before deciding.',
  };
  return map[reason] || 'Please review this listing carefully before approving.';
}

function ProductIcon() {
  return <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M3 16l5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function WarnIcon() {
  return <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1.5L13 12H1L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 5.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}
function CheckCircleIcon() {
  return <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/><path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
