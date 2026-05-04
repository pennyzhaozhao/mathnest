import Link from 'next/link';
import { getAllPracticeIndex } from '@/lib/practice';
import { getCourseConfig } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Practice' };

const difficultyStyle: Record<string, { bg: string; text: string; label: string }> = {
  foundation: { bg: 'var(--mint-bg)', text: 'var(--mint-deep)', label: 'Foundation' },
  standard: { bg: 'var(--sky-bg)', text: 'var(--sky-deep)', label: 'Standard' },
  challenge: { bg: 'var(--coral-bg)', text: 'var(--coral-deep)', label: 'Challenge' },
};

export default function PracticeIndexPage() {
  const practiceSets = getAllPracticeIndex();

  return (
    <div className="page-content">
      <div style={{ marginBottom: 32 }}>
        <span className="pill">Practice</span>
        <h1 style={{ fontWeight: 900, fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.02em', lineHeight: 1.1, margin: '12px 0 8px' }}>
          Practice sets
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, fontWeight: 600 }}>
          Pick a set, work through the questions, then check your answers.
        </p>
      </div>

      {practiceSets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>No practice sets yet</h2>
          <p>Go to <Link href="/admin" style={{ color: 'var(--coral-deep)', textDecoration: 'underline' }}>Admin</Link> to publish your first practice set.</p>
        </div>
      ) : (
        <div className="grid-3">
          {practiceSets.map((set) => {
            const course = getCourseConfig(set.course);
            const diff = difficultyStyle[set.difficulty] ?? difficultyStyle.standard;

            return (
              <Link
                key={`${set.course}/${set.slug}`}
                href={`/practice/${set.course}/${set.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div className="post-card">
                  <div className="post-tags">
                    {course && <span className={`post-tag ${course.color}`}>{course.title}</span>}
                    <span
                      className="post-tag"
                      style={{ background: diff.bg, color: diff.text, borderColor: 'rgba(26,26,46,.35)' }}
                    >
                      {diff.label}
                    </span>
                    {set.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="post-tag default">{tag}</span>
                    ))}
                  </div>

                  <h3>{set.title}</h3>

                  <p>
                    {set.questionCount} question{set.questionCount !== 1 ? 's' : ''}
                    {set.section ? ` in ${set.section.replace(/-/g, ' ')}` : ''}
                  </p>

                  <div className="post-meta">
                    <span>{set.relatedNote ? `Linked to ${set.relatedNote.replace(/-/g, ' ')}` : 'Standalone practice'}</span>
                    <span>Start</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
