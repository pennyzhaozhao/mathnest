import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllNotePaths, getNote } from '@/lib/notes';
import { markdownToHtml } from '@/lib/markdown';
import { getCourseConfig } from '@/lib/config';
import { getAllPracticeIndex } from '@/lib/practice';
import LangToggle from '@/components/LangToggle';
import Comments from '@/components/Comments';
import NoteContentWrapper from '@/components/NoteContentWrapper';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllNotePaths();
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const note = getNote(params.course, params.section, params.slug, 'en');
  return { title: note?.title ?? params.slug };
}

export default async function NotePage({ params }: { params: { course: string; section: string; slug: string } }) {
  const { course, section, slug } = params;

  const note = getNote(course, section, slug, 'en');
  if (!note) notFound();

  const courseConfig = getCourseConfig(course);
  const html = await markdownToHtml(note.content, course, section);

  // 找对应的练习题集
  const practiceSet = getAllPracticeIndex().find(
    p => p.course === course && p.relatedNote === slug
  );

  return (
    <div className="page-content">
      <div className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${course}`}>{courseConfig?.title ?? course}</Link>
        <span>/</span>
        <Link href={`/courses/${course}#${section}`}>{section.replace(/-/g, ' ')}</Link>
        <span>/</span>
        <span>{note.title}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {courseConfig && (
              <span className={`post-tag ${courseConfig.color}`} style={{ fontSize: 12, padding: '4px 11px', borderRadius: 999, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                {courseConfig.title}
              </span>
            )}
            {note.tags.map((t) => (
              <span key={t} className="post-tag default" style={{ fontSize: 12, padding: '4px 11px', borderRadius: 999, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 10 }}>
            {note.title}
          </h1>
          {note.description && (
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', marginBottom: 8, fontWeight: 600 }}>{note.description}</p>
          )}
          <p style={{ fontSize: 13, color: 'var(--ink-faint)', fontWeight: 600 }}>{note.date}</p>
        </div>
        <LangToggle langs={note.langs} />
      </div>

      {note.youtube && (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 18, marginBottom: 32, border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <iframe src={`https://www.youtube.com/embed/${note.youtube}`}
            allowFullScreen loading="lazy" title="Video walkthrough"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
        </div>
      )}
      {note.bilibili && !note.youtube && (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 18, marginBottom: 32, border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <iframe src={`https://player.bilibili.com/player.html?bvid=${note.bilibili}&page=1&high_quality=1`}
            allowFullScreen loading="lazy" title="Video walkthrough"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
        </div>
      )}

      <NoteContentWrapper html={html} course={course} section={section} slug={slug} langs={note.langs} />

      {/* Go to Practice banner */}
      {practiceSet && (
        <div style={{
          margin: '48px 0 32px', padding: '24px 28px', borderRadius: 20,
          background: 'var(--lemon-bg)', border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>🧩 Ready to practise?</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-soft)' }}>
              {practiceSet.title} · {practiceSet.questionCount} question{practiceSet.questionCount !== 1 ? 's' : ''} · <span style={{ textTransform: 'capitalize' }}>{practiceSet.difficulty}</span>
            </div>
          </div>
          <Link href={`/practice/${course}/${practiceSet.slug}`} className="btn btn-primary" style={{ fontSize: 15 }}>
            Go to practice →
          </Link>
        </div>
      )}

      <Comments />
    </div>
  );
}
