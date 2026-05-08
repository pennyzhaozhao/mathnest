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
            <span key={tag} className={`post-tag ${index === 0 ? color : 'default'}`}>{tag}</span>
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
