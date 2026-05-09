import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllNotePaths, getNote } from '@/lib/notes';
import { markdownToHtml } from '@/lib/markdown';
import { getMergedCourseConfig } from '@/lib/courses';
import { normalizeCourseColor } from '@/lib/course-colors';
import { getAllPracticeIndex } from '@/lib/practice';
import Comments from '@/components/Comments';
import NoteContentWrapper from '@/components/NoteContentWrapper';
import NoteHeader from '@/components/NoteHeader';
import NoteToc from '@/components/NoteToc';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllNotePaths();
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const note = getNote(params.course, params.section, params.slug, 'en');
  return { title: note?.title ?? params.slug };
}

export default async function NotePage({
  params,
}: {
  params: { course: string; section: string; slug: string };
}) {
  const { course, section, slug } = params;

  const note = getNote(course, section, slug, 'en');
  if (!note) notFound();

  const courseConfig = getMergedCourseConfig(course);
  const html = await markdownToHtml(note.content, course, section);

  // 找对应的练习题集
  const practiceSet = getAllPracticeIndex().find(
    p => p.course === course && p.relatedNote === slug
  );

  return (
    <div className="page-content">
      <NoteHeader
        note={{
          slug: note.slug,
          course: note.course,
          section: note.section,
          langs: note.langs,
          title: note.title,
          description: note.description,
          date: note.date,
          tags: note.tags,
          youtube: note.youtube,
          bilibili: note.bilibili,
          translations: note.translations,
        }}
        courseTitle={courseConfig?.title ?? course}
        courseColor={courseConfig ? normalizeCourseColor(courseConfig.color) : 'default'}
        initialLang="en"
      />

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

      <div className="note-reading-layout">
        <main className="note-main">
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

          <p className="note-source">
            Originally published at mathnest.top by Penny Zhao.
          </p>

          <Comments />
        </main>
        <NoteToc />
      </div>
    </div>
  );
}
