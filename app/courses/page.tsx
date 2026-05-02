import Link from 'next/link';
import { COURSES } from '@/lib/config';
import { getAllNoteIndex } from '@/lib/notes';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Courses' };

export default function CoursesPage() {
  const allNotes = getAllNoteIndex();

  return (
    <div className="page-content">
      <div className="sec-head" style={{ textAlign: 'left', marginBottom: 36 }}>
        <span className="pill">📚 All courses</span>
        <h2 style={{ marginTop: 12 }}>Pick your track.</h2>
        <p style={{ margin: '10px 0 0' }}>
          {allNotes.length} note{allNotes.length !== 1 ? 's' : ''} across {COURSES.length} tracks — and growing.
        </p>
      </div>

      <div className="grid-3">
        {COURSES.map((c) => {
          const count = allNotes.filter((n) => n.course === c.slug).length;
          return (
            <Link key={c.slug} href={`/courses/${c.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="course-card" data-color={c.color}>
                <div className="course-icon">{c.icon}</div>
                <div className="course-sub">{c.subtitle}</div>
                <h3>{c.title}</h3>
                <p className="course-desc">{c.description}</p>
                <div className="course-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                    {count > 0 ? `${count} note${count !== 1 ? 's' : ''}` : (
                      <><span className="dot-live" />Growing library</>
                    )}
                  </span>
                  <div className="course-arrow">→</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
