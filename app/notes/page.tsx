import { getAllNoteIndex } from '@/lib/notes';
import { COURSES } from '@/lib/config';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'All notes' };

export default function NotesPage() {
  const notes = getAllNoteIndex();

  return (
    <div className="page-content">
      <div className="sec-head" style={{ textAlign: 'left', marginBottom: 32 }}>
        <span className="pill">📖 All notes</span>
        <h2 style={{ marginTop: 12 }}>{notes.length} note{notes.length !== 1 ? 's' : ''} and counting.</h2>
        <p style={{ margin: '8px 0 0' }}>Filter by course, or browse everything below.</p>
      </div>

      {/* course filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        <Link href="/notes" className="pill" style={{ fontSize: 13, boxShadow: 'var(--shadow-out)' }}>All</Link>
        {COURSES.map(c => (
          <Link key={c.slug} href={`/courses/${c.slug}`} className="pill" style={{ fontSize: 13 }}>{c.icon} {c.title}</Link>
        ))}
      </div>

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, marginBottom: 8 }}>No notes yet</h3>
          <p>Go to <Link href="/admin" style={{ color: 'var(--coral-deep)' }}>Admin</Link> to publish your first note.</p>
        </div>
      ) : (
        <div className="grid-3">
          {notes.map(n => <PostCard key={`${n.course}/${n.slug}`} note={n} />)}
        </div>
      )}
    </div>
  );
}
