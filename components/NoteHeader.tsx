'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Lang, Note, NoteMeta } from '@/lib/notes';
import { getCourseTagStyle, isHexColor, normalizeCourseColor } from '@/lib/course-colors';
import LangToggle from '@/components/LangToggle';

type HeaderNote = Omit<Note, 'content'>;

function getDisplayMeta(note: HeaderNote, lang: Lang): NoteMeta {
  return note.translations[lang] ?? note.translations.en ?? note.translations.zh ?? {
    title: note.title,
    description: note.description,
    date: note.date,
    tags: note.tags,
    youtube: note.youtube,
    bilibili: note.bilibili,
  };
}

function NoteHeaderInner({
  note,
  courseTitle,
  courseColor,
  initialLang,
}: {
  note: HeaderNote;
  courseTitle: string;
  courseColor: string;
  initialLang: Lang;
}) {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') || initialLang) as Lang;
  return <NoteHeaderContent note={note} courseTitle={courseTitle} courseColor={courseColor} lang={lang} />;
}

function NoteHeaderContent({
  note,
  courseTitle,
  courseColor,
  lang,
}: {
  note: HeaderNote;
  courseTitle: string;
  courseColor: string;
  lang: Lang;
}) {
  const display = getDisplayMeta(note, lang);
  const courseHref = `/courses/${note.course}${lang === 'zh' ? '?lang=zh' : ''}`;
  const sectionHref = `${courseHref}#${note.section}`;

  return (
    <>
      <div className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span>/</span>
        <Link href={courseHref}>{courseTitle}</Link>
        <span>/</span>
        <Link href={sectionHref}>{note.section.replace(/-/g, ' ')}</Link>
        <span>/</span>
        <span>{display.title}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span className={`post-tag ${normalizeCourseColor(courseColor)}`} style={{ fontSize: 12, padding: '4px 11px', borderRadius: 999, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', ...(isHexColor(courseColor) ? getCourseTagStyle(courseColor) : {}) }}>
              {courseTitle}
            </span>
            {display.tags.map((t) => (
              <span key={t} className="post-tag default" style={{ fontSize: 12, padding: '4px 11px', borderRadius: 999, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 10 }}>
            {display.title}
          </h1>
          {display.description && (
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', marginBottom: 8, fontWeight: 600 }}>{display.description}</p>
          )}
          <p style={{ fontSize: 13, color: 'var(--ink-faint)', fontWeight: 600 }}>{display.date}</p>
        </div>
        <LangToggle langs={note.langs} />
      </div>
    </>
  );
}

export default function NoteHeader(props: {
  note: HeaderNote;
  courseTitle: string;
  courseColor: string;
  initialLang: Lang;
}) {
  return (
    <Suspense fallback={
      <NoteHeaderContent
        note={props.note}
        courseTitle={props.courseTitle}
        courseColor={props.courseColor}
        lang={props.initialLang}
      />
    }>
      <NoteHeaderInner {...props} />
    </Suspense>
  );
}
