import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPracticePaths, getPracticeSet } from '@/lib/practice';
import { getCourseConfig } from '@/lib/config';
import PracticeClient from '@/components/PracticeClient';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllPracticePaths();
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const set = getPracticeSet(params.course, params.slug);
  return { title: set ? `Practice: ${set.title}` : 'Practice' };
}

const difficultyStyle: Record<string, { bg: string; text: string; label: string }> = {
  foundation: { bg: 'var(--mint-bg)',  text: 'var(--mint-deep)',  label: '🌱 Foundation' },
  standard:   { bg: 'var(--sky-bg)',   text: 'var(--sky-deep)',   label: '⭐ Standard'   },
  challenge:  { bg: 'var(--coral-bg)', text: 'var(--coral-deep)', label: '🔥 Challenge'  },
};

export default function PracticePage({ params }: { params: { course: string; slug: string } }) {
  const set = getPracticeSet(params.course, params.slug);
  if (!set) notFound();

  const course = getCourseConfig(params.course);
  const diff = difficultyStyle[set.difficulty] ?? difficultyStyle.standard;
  const mcqCount   = set.questions.filter(q => q.type === 'mcq').length;
  const fillCount  = set.questions.filter(q => q.type === 'fill').length;
  const shortCount = set.questions.filter(q => q.type === 'short').length;
  const noteSection = set.section; // 直接用 frontmatter 里的 section

  return (
    <div className="page-content" style={{ maxWidth: 860 }}>
      {/* breadcrumb */}
      <div className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${params.course}`}>{course?.title ?? params.course}</Link>
        <span>/</span>
        <Link href={`/practice`}>Practice</Link>
        <span>/</span>
        <span>{set.title}</span>
      </div>

      {/* header */}
      <div style={{
        padding: '28px 30px', borderRadius: 22, marginBottom: 32,
        background: '#fff', border: '2.5px solid var(--ink)', boxShadow: '5px 5px 0 var(--ink)',
      }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          {course && (
            <span className="post-tag" data-color={course.color} style={{
              fontSize: 12, padding: '3px 10px', borderRadius: 999, fontWeight: 700,
              background: 'var(--lemon-bg)', border: '1.5px solid var(--ink)',
            }}>{course.title}</span>
          )}
          <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, fontWeight: 700, background: diff.bg, color: diff.text, border: '1.5px solid var(--ink)' }}>
            {diff.label}
          </span>
          {set.tags.map(t => (
            <span key={t} className="post-tag default" style={{ fontSize: 12 }}>{t}</span>
          ))}
        </div>

        <h1 style={{ fontWeight: 900, fontSize: 'clamp(24px,3.5vw,36px)', letterSpacing: '-.02em', marginBottom: 12 }}>
          {set.title}
        </h1>

        {/* question summary */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {mcqCount > 0 && <Chip label={`${mcqCount} MCQ`} bg="var(--sky-bg)" />}
          {fillCount > 0 && <Chip label={`${fillCount} Fill-in`} bg="var(--lemon-bg)" />}
          {shortCount > 0 && <Chip label={`${shortCount} Short answer`} bg="var(--lilac-bg)" />}
          <Chip label={`${set.questions.length} questions total`} bg="var(--bg-2)" />
        </div>

        {/* related note link */}
        {set.relatedNote && noteSection && (
          <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600 }}>
            📖 Revision notes:{' '}
            <Link href={`/${params.course}/${noteSection}/${set.relatedNote}`}
              style={{ color: 'var(--coral-deep)', textDecoration: 'underline' }}>
              {set.relatedNote.replace(/-/g, ' ')}
            </Link>
          </div>
        )}
      </div>

      <PracticeClient set={set} />
    </div>
  );
}

function Chip({ label, bg }: { label: string; bg: string }) {
  return (
    <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 999, fontWeight: 700, background: bg, border: '1.5px solid var(--ink)' }}>
      {label}
    </span>
  );
}
