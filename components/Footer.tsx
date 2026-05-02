import { SITE } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="footer container">
      © {new Date().getFullYear()} {SITE.name} · A small note-taking corner by Penny ·
      Future PGCE Maths teaching resource ·{' '}
      <a href={`https://github.com/${SITE.github.owner}/${SITE.github.repo}`}
         target="_blank" rel="noopener noreferrer"
         style={{ color: 'var(--coral-deep)' }}>
        View on GitHub ↗
      </a>
    </footer>
  );
}
