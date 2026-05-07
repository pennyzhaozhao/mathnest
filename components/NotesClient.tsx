'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import LangToggle from '@/components/LangToggle';
import type { NoteIndex } from '@/lib/notes';
import type { CourseConfig } from '@/lib/config';

export default function NotesClient({
  notes,
  courses,
}: {
  notes: NoteIndex[];
  courses: CourseConfig[];
}) {
  const [query, setQuery]           = useState('');
  const [activeCourse, setActiveCourse] = useState('');  // '' = all

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter(n => {
      // course filter
      if (activeCourse && n.course !== activeCourse) return false;
      // search filter
      if (!q) return true;
      const translationText = Object.values(n.translations)
        .flatMap(meta => meta ? [meta.title, meta.description, ...meta.tags] : [])
        .join(' ')
        .toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q)) ||
        n.section.toLowerCase().includes(q) ||
        n.course.toLowerCase().includes(q) ||
        translationText.includes(q)
      );
    });
  }, [notes, query, activeCourse]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="page-content">
      {/* header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <span className="pill">📖 All notes</span>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.03em', margin: '12px 0 6px' }}>
            {notes.length} note{notes.length !== 1 ? 's' : ''} and counting.
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>
            Search by topic, tag or keyword — or filter by course below.
          </p>
        </div>
        <LangToggle langs={['en', 'zh']} />
      </div>

      {/* search box */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <span style={{
          position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
          fontSize: 18, pointerEvents: 'none', opacity: .5,
        }}>🔍</span>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search notes… e.g. quadratic, integration, 几何"
          style={{
            width: '100%', padding: '15px 18px 15px 48px',
            borderRadius: 18, border: 'none',
            fontFamily: 'DM Sans, sans-serif', fontSize: 15.5, color: 'var(--ink)',
            background: '#fff',
            boxShadow: 'var(--shadow-in)',
            outline: 'none',
            transition: 'box-shadow .15s',
          }}
          onFocus={e => e.currentTarget.style.boxShadow = 'var(--shadow-in), 0 0 0 3px rgba(255,122,102,.2)'}
          onBlur={e => e.currentTarget.style.boxShadow = 'var(--shadow-in)'}
        />
        {hasQuery && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              border: 'none', background: 'var(--bg-2)', cursor: 'pointer',
              width: 28, height: 28, borderRadius: 8, fontSize: 14,
              color: 'var(--ink-soft)', display: 'grid', placeItems: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
            aria-label="Clear search"
          >×</button>
        )}
      </div>

      {/* course filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        <button
          className="pill"
          onClick={() => setActiveCourse('')}
          style={{
            fontSize: 13, cursor: 'pointer', border: 'none',
            background: activeCourse === '' ? 'var(--coral)' : 'var(--bg-2)',
            color: activeCourse === '' ? '#fff' : 'var(--ink)',
            boxShadow: 'var(--shadow-out)',
            transition: '.15s',
          }}
        >All</button>
        {courses.map(c => (
          <button
            key={c.slug}
            className="pill"
            onClick={() => setActiveCourse(activeCourse === c.slug ? '' : c.slug)}
            style={{
              fontSize: 13, cursor: 'pointer', border: 'none',
              background: activeCourse === c.slug ? 'var(--coral)' : 'var(--bg-2)',
              color: activeCourse === c.slug ? '#fff' : 'var(--ink)',
              boxShadow: 'var(--shadow-out)',
              transition: '.15s',
            }}
          >{c.icon} {c.title}</button>
        ))}
      </div>

      {/* results count when searching */}
      {(hasQuery || activeCourse) && (
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 20, fontWeight: 500 }}>
          {filtered.length === 0
            ? 'No notes found'
            : `${filtered.length} note${filtered.length !== 1 ? 's' : ''} found`}
          {hasQuery && <span style={{ color: 'var(--coral-deep)' }}> for "{query}"</span>}
          {activeCourse && <span> in <strong>{courses.find(c => c.slug === activeCourse)?.title}</strong></span>}
        </p>
      )}

      {/* notes grid */}
      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, marginBottom: 8 }}>No notes yet</h3>
          <p>Go to <Link href="/admin" style={{ color: 'var(--coral-deep)' }}>Admin</Link> to publish your first note.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, marginBottom: 8 }}>No matches</h3>
          <p style={{ marginBottom: 16 }}>Try a different keyword or clear the search.</p>
          <button className="btn" onClick={() => { setQuery(''); setActiveCourse(''); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(n => <PostCard key={`${n.course}/${n.slug}`} note={n} />)}
        </div>
      )}
    </div>
  );
}
