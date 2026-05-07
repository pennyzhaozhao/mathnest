'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Lang, NoteIndex, NoteMeta } from '@/lib/notes';
import { getCourseConfig } from '@/lib/config';

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

function PostCardContent({ note, lang }: { note: NoteIndex; lang: Lang }) {
  const display = getDisplayMeta(note, lang);
  const course = getCourseConfig(note.course);
  const color = course?.color ?? 'default';

  return (
    <Link href={`/${note.course}/${note.section}/${note.slug}${lang === 'zh' ? '?lang=zh' : ''}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="post-card">
        <div className="post-tags">
          {course && <span className={`post-tag ${color}`}>{course.title}</span>}
          <span className={`post-tag ${color}`}>{note.section.replace(/-/g, ' ')}</span>
          {display.tags.slice(0, 2).map((t) => (
            <span key={t} className="post-tag default">{t}</span>
          ))}
          {note.langs.includes('zh') && note.langs.includes('en') && (
            <span className="post-tag default">EN / 中</span>
          )}
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

function PostCardInner({ note }: { note: NoteIndex }) {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') || 'en') as Lang;
  return <PostCardContent note={note} lang={lang} />;
}

export default function PostCard({ note }: { note: NoteIndex }) {
  return (
    <Suspense fallback={<PostCardContent note={note} lang="en" />}>
      <PostCardInner note={note} />
    </Suspense>
  );
}
