import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COURSES, getCourseConfig } from '@/lib/config';
import { getCourseTree } from '@/lib/notes';
import PostCard from '@/components/PostCard';
import LangToggle from '@/components/LangToggle';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return COURSES.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const c = getCourseConfig(params.course);
  return { title: c?.title ?? params.course };
}

export default function CoursePage({ params }: { params: { course: string } }) {
  const config = getCourseConfig(params.course);
  if (!config) notFound();

  const tree = getCourseTree(params.course);

  return (
    <div className="page-content">
      {/* header */}
      <div className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span>/</span>
        <span>{config.title}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
        <div data-color={config.color} style={{
          width: 80, height: 80, borderRadius: 24, display: 'grid', placeItems: 'center',
          background: 'var(--c-icon)', color: '#fff',
          fontSize: 32, fontFamily: 'JetBrains Mono, monospace',
          boxShadow: '10px 10px 22px var(--c-shadow), inset 3px 3px 6px rgba(255,255,255,.3)',
          flexShrink: 0,
        }}>{config.icon}</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-soft)', marginBottom: 6 }}>{config.subtitle}</p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 10 }}>{config.title}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 16 }}>{config.description}</p>
          <p style={{ color: 'var(--ink-faint)', fontSize: 13.5, marginTop: 8, fontWeight: 500 }}>
            {tree.totalNotes} note{tree.totalNotes !== 1 ? 's' : ''} · {tree.sections.length} section{tree.sections.length !== 1 ? 's' : ''}
          </p>
        </div>
        </div>
        <LangToggle langs={['en', 'zh']} />
      </div>

      {/* sections */}
      {tree.sections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
          <p style={{ fontSize: 16 }}>No notes yet — check back soon!</p>
        </div>
      ) : (
        tree.sections.map((sec) => (
          <div key={sec.slug} style={{ marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 700,
              letterSpacing: '-.01em', marginBottom: 20,
              paddingBottom: 12, borderBottom: '2px dashed rgba(42,31,61,.1)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              {sec.title}
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-faint)', background: 'var(--bg-2)', padding: '3px 10px', borderRadius: 999, boxShadow: 'var(--shadow-sm)' }}>
                {sec.notes.length}
              </span>
            </h2>
            <div className="grid-3">
              {sec.notes.map((note) => (
                <PostCard key={note.slug} note={note} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
