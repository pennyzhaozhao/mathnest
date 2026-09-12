import Link from 'next/link';
import CourseIcon from '@/components/CourseIcon';
import { getVisibleCourseConfigs } from '@/lib/courses';
import { getAllNoteIndex } from '@/lib/notes';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Courses' };

export default function CoursesPage() {
  const allNotes = getAllNoteIndex();
  const courses = getVisibleCourseConfigs();

  return (
    <div className="page-content">
      <div className="sec-head" style={{ textAlign: 'left', marginBottom: 36 }}>
        <span className="pill">📚 All courses</span>
        <h2 style={{ marginTop: 12 }}>Pick your track.</h2>
        <p style={{ margin: '10px 0 0' }}>
          {allNotes.length} note{allNotes.length !== 1 ? 's' : ''} across {courses.length} tracks — and growing.
        </p>
      </div>

      <div className="courses-list">
        {courses.map((c) => {
          const count = allNotes.filter((n) => n.course === c.slug).length;
          return (
            <Link key={c.slug} href={`/courses/${c.slug}`} className="courses-list-row">
              <div className="courses-list-icon"><CourseIcon icon={c.icon} title={c.title} /></div>
              <div className="courses-list-copy">
                <div className="course-sub">{c.subtitle}</div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
              <div className="courses-list-meta">
                {count > 0 ? `${count} note${count !== 1 ? 's' : ''}` : <><span className="dot-live" />Growing</>}
              </div>
              <div className="course-list-arrow" aria-hidden="true">→</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
