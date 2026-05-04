'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/config';

export default function Nav() {
  const path = usePathname();
  const active = (href: string) => path === href || path.startsWith(href + '/') ? 'active' : '';

  return (
    <div className="container">
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">π</div>
          {SITE.name}
        </Link>

        <div className="nav-links">
        <Link href="/courses"  className={active('/courses')}>Courses</Link>
          <Link href="/notes"    className={active('/notes')}>All notes</Link>
          <Link href="/practice" className={active('/practice')}>Practice</Link>
          <Link href="/about">About</Link>
        </div>

        <div className="nav-right">
          <Link href="/notes" className="btn btn-sm btn-primary">Browse notes →</Link>
        </div>
      </nav>
    </div>
  );
}
