'use client';

import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { lessons } from '../../lib/mock-data';
import type { Lesson, LessonStatus } from '../../types';

export default function LearningContentPage() {
  const [lessonList, setLessonList] = useState(lessons);

  const totalCompletions = lessonList.reduce((s, l) => s + l.completions, 0);

  return (
    <div>
      <TopBar
        title="Learning content"
        subtitle={`${lessonList.length} lessons · ${totalCompletions.toLocaleString()} completions this month`}
        actions={
          <button className="btn btn-primary">
            <PlusIcon /> New lesson
          </button>
        }
      />

      <div className="learn-content">
        <div className="card learn-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Lesson</th>
                  <th className="hide-tablet">Trigger</th>
                  <th className="hide-mobile">Cards</th>
                  <th className="hide-mobile">Completions</th>
                  <th className="hide-tablet">Avg time</th>
                  <th className="hide-tablet">Badge</th>
                  <th>Status</th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {lessonList.map(lesson => (
                  <LessonRow key={lesson.id} lesson={lesson} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .learn-content { padding: 24px; }
        .learn-card { overflow: hidden; }
        .table-wrap { overflow-x: auto; }

        @media (max-width: 768px) {
          .learn-content { padding: 16px; }
        }
      `}</style>
    </div>
  );
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  return (
    <tr>
      <td>
        <span className="lesson-num">
          {String(lesson.number).padStart(2, '0')}
        </span>
      </td>
      <td>
        <span className="lesson-title">{lesson.title}</span>
      </td>
      <td className="text-sm text-muted hide-tablet">{lesson.trigger}</td>
      <td className="text-sm hide-mobile">{lesson.cards_count}</td>
      <td className="text-sm hide-mobile">{lesson.completions}</td>
      <td className="text-sm hide-tablet">{lesson.avg_time_minutes}</td>
      <td className="hide-tablet">
        <span className="badge-name">
          <BadgeIcon />
          {lesson.badge_name}
        </span>
      </td>
      <td>
        <LessonStatusBadge status={lesson.status} />
      </td>
      <td>
        <button className="btn btn-icon"><DotsIcon /></button>
      </td>

      <style>{`
        .lesson-num {
          font-size: 13px;
          font-weight: 600;
          color: #9B8B7E;
          font-variant-numeric: tabular-nums;
        }

        .lesson-title {
          font-size: 13.5px;
          font-weight: 500;
          color: #2A1F14;
        }

        .badge-name {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          color: #2D8A4E;
          font-weight: 500;
        }

        .badge-name svg { width: 13px; height: 13px; }
      `}</style>
    </tr>
  );
}

function LessonStatusBadge({ status }: { status: LessonStatus }) {
  const map = {
    live:     { cls: 'badge-live',  dot: 'dot-green', label: 'LIVE' },
    draft:    { cls: 'badge-draft', dot: 'dot-gray',  label: 'DRAFT' },
    archived: { cls: 'badge-draft', dot: 'dot-gray',  label: 'ARCHIVED' },
  };
  const m = map[status];
  return (
    <span className={`badge ${m.cls}`}>
      <span className={`dot ${m.dot}`} />
      {m.label}
    </span>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function BadgeIcon() { return <svg viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.5 3.5H12L9 7l1 3.5L6.5 8.5 4 10.5 5 7 2 4.5h4L6.5 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>; }
function DotsIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>; }
