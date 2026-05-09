'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Lang, NoteIndex, NoteMeta } from '@/lib/notes';
import { getCourseConfig, type CourseConfig } from '@/lib/config';
import { getCourseTagStyle, normalizeCourseColor } from '@/lib/course-colors';

function getDisplayMeta(note: NoteIndex, lang: Lang): NoteMeta {
  return note.translations[lang] ?? note.translations.en ?? note.translations.zh ?? {
    title: note.title,
    description: note.description,
    date: note.date,
    tags: note.tags,
    youtube: note.youtube,
    bilibili: note.bilibili,
  };
}

function PostCardContent({ note, lang, course: courseOverride }: { note: NoteIndex; lang: Lang; course?: CourseConfig }) {
  const display = getDisplayMeta(note, lang);
  const course = courseOverride ?? getCourseConfig(note.course) ?? undefined;
  const color = course ? normalizeCourseColor(course.color) : 'default';
  const visibleTags = [
    course?.title,
    note.section.replace(/-/g, ' '),
    ...display.tags,
  ].filter(Boolean).slice(0, 3);

  return (
    <Link href={`/${note.course}/${note.section}/${note.slug}${lang === 'zh' ? '?lang=zh' : ''}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="post-card">
        <div className="post-tags">
          {visibleTags.map((tag, index) => (
            <span key={tag} className={`post-tag ${index === 0 ? color : 'default'}`} style={index === 0 && course ? getCourseTagStyle(course.color) : undefined}>{tag}</span>
          ))}
        </div>
        <h3>{display.title}</h3>
        {display.description && <p>{display.description}</p>}
        <div className="post-meta">
          <span>{display.date}</span>
          <span style={{ display: 'flex', gap: 8 }}>
            {(display.youtube || display.bilibili) && <span className="has-video">▶ Video</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCardInner({ note, course }: { note: NoteIndex; course?: CourseConfig }) {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') || 'en') as Lang;
  return <PostCardContent note={note} lang={lang} course={course} />;
}

export default function PostCard({ note, course }: { note: NoteIndex; course?: CourseConfig }) {
  return (
    <Suspense fallback={<PostCardContent note={note} lang="en" course={course} />}>
      <PostCardInner note={note} course={course} />
    </Suspense>
  );
}
