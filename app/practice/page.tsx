import Link from 'next/link';
import { getAllPracticeIndex } from '@/lib/practice';
import { COURSES, getCourseConfig } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Practice' };

const diffIcon = { foundation: '🌱', standard: '⭐', challenge: '🔥' };
const diffColor = {
  foundation: 'var(--mint-bg)',
  standard:   'var(--sky-bg)',
  challenge:  'var(--coral-bg)',
};

export default function PracticePage() {
  const all = getAllPracticeIndex();

  return (
    <div className="page-content">
      <div style={{ marginBottom: 36 }}>
        <span className="pill">🧩 Practice</span>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 'clamp(28px,4vw,46px)', letterSpacing: '-.02em', margin: '12px 0 8px' }}>
          Practice questions
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, fontWeight: 600 }}>
          MCQ, fill-in-the-blank and short answer — grouped by course and difficulty.
        </p>
      </div>

      {all.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧩</div>
          <h3 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>No practice sets yet</h3>
          <p>Coming soon — check back after notes are published.</p>
        </div>
      ) : (
        COURSES.map(course => {
          const sets = all.filter(p => p.course === course.slug);
          if (sets.length === 0) return null;
          return (
            <div key={course.slug} style={{ marginBottom: 48 }}>
              <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '2.5px solid var(--ink)' }}>
                <span style={{ fontSize: 26 }}>{course.icon}</span>
                {course.title}
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', background: 'var(--bg-2)', padding: '2px 10px', borderRadius: 999, border: '1.5px solid rgba(26,26,46,.2)' }}>
                  {sets.length} set{sets.length !== 1 ? 's' : ''}
                </span>
              </h2>
              <div className="grid-3">
                {sets.map(set => (
                  <Link key={set.slug} href={`/practice/${set.course}/${set.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{
                      padding: '22px', borderRadius: 18, background: '#fff',
                      border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)',
                      transition: 'transform .12s, box-shadow .12s',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 var(--ink)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 var(--ink)'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span style={{ fontSize: 28 }}>{diffIcon[set.difficulty] ?? '📝'}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: diffColor[set.difficulty] ?? 'var(--bg-2)', border: '1.5px solid var(--ink)' }}>
                          {set.difficulty}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.3, marginBottom: 10 }}>{set.title}</h3>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {set.tags.slice(0, 3).map(t => (
                          <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'var(--bg-2)', fontWeight: 700, border: '1.5px solid rgba(26,26,46,.2)' }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-soft)', borderTop: '1.5px dashed rgba(26,26,46,.15)', paddingTop: 12 }}>
                        {set.questionCount} question{set.questionCount !== 1 ? 's' : ''} →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
