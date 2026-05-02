import Link from 'next/link';
import type { NoteIndex } from '@/lib/notes';
import { getCourseConfig } from '@/lib/config';

export default function PostCard({ note }: { note: NoteIndex }) {
  const course = getCourseConfig(note.course);
  const color = course?.color ?? 'default';

  return (
    <Link href={`/${note.course}/${note.section}/${note.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="post-card">
        <div className="post-tags">
          {course && <span className={`post-tag ${color}`}>{course.title}</span>}
          <span className={`post-tag ${color}`}>{note.section.replace(/-/g, ' ')}</span>
          {note.tags.slice(0, 2).map((t) => (
            <span key={t} className="post-tag default">{t}</span>
          ))}
          {note.langs.includes('zh') && note.langs.includes('en') && (
            <span className="post-tag default">EN / 中</span>
          )}
        </div>
        <h3>{note.title}</h3>
        {note.description && <p>{note.description}</p>}
        <div className="post-meta">
          <span>{note.date}</span>
          <span style={{ display: 'flex', gap: 8 }}>
            {(note.youtube || note.bilibili) && <span className="has-video">▶ Video</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}
