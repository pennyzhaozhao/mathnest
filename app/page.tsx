import Link from 'next/link';
import { COURSES } from '@/lib/config';
import { getAllNoteIndex, getRecentNotes } from '@/lib/notes';
import PostCard from '@/components/PostCard';
import FeatureCards from '@/components/FeatureCards';

export default function HomePage() {
  const recent = getRecentNotes(3);
  const allNotes = getAllNoteIndex();

  return (
    <>
      {/* ── Hero ── */}
      <section className="container" style={{ padding: '38px 22px 30px', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-visual { height: 270px !important; transform: scale(.8); transform-origin: top center; margin: 10px auto -30px; width: min(560px, 100%); }
            .hero-draft-bg { display: none !important; }
            .hero-stats { gap: 12px !important; }
          }
          .hero-formula-card:hover { transform: rotate(-4deg) translateY(-4px) !important; }
          .hero-formula-card:hover > div { border-color: #1f1834 !important; }
          @media (max-width: 480px) {
            .hero-stats > div { padding: 10px 14px !important; }
          }
        `}</style>
        <div className="hero-draft-bg" aria-hidden="true" style={{
          position: 'absolute', inset: '10px 22px 0',
          pointerEvents: 'none', zIndex: 0,
          color: '#2d2640',
          fontFamily: 'Georgia, serif',
          fontWeight: 500,
          opacity: .32,
        }}>
          <svg viewBox="0 0 1000 420" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <pattern id="hero-draft-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="#2d2640" strokeWidth=".4" opacity=".3" />
              </pattern>
            </defs>
            <rect width="1000" height="420" fill="url(#hero-draft-grid)" opacity=".35" />
            <g opacity=".2">
              <path d="M648 276H930M790 120V354" stroke="#2d2640" strokeWidth="2" strokeLinecap="round" />
              <path d="m916 268 14 8-14 8M782 134l8-14 8 14" stroke="#2d2640" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M672 265c34-44 64-45 94-4s58 39 96-18" fill="none" stroke="#2d2640" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
          <div style={{ position: 'absolute', left: '42%', top: 16, transform: 'rotate(-7deg)', fontSize: 24, opacity: .32 }}>
            f(x)=ax²+bx+c
          </div>
          <div style={{ position: 'absolute', left: '8%', top: 86, transform: 'rotate(5deg)', fontSize: 18, opacity: .28 }}>
            lim x→∞
          </div>
          <div style={{ position: 'absolute', left: '35%', bottom: 58, transform: 'rotate(-10deg)', fontSize: 22, opacity: .3 }}>
            ∫ x dx = x² / 2 + C
          </div>
          <div style={{ position: 'absolute', right: '35%', top: 124, transform: 'rotate(8deg)', fontSize: 18, opacity: .27 }}>
            e^iπ+1=0
          </div>
          <div style={{ position: 'absolute', right: '5%', top: 42, transform: 'rotate(-4deg)', fontSize: 20, opacity: .3 }}>
            dy/dx
          </div>
          <div style={{ position: 'absolute', right: '13%', bottom: 28, transform: 'rotate(6deg)', fontSize: 21, opacity: .26 }}>
            ∑aₙ
          </div>
        </div>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 38, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            {/* eyebrow */}
            <div style={{ marginBottom: 16 }}>
              <span className="pill">
                <span className="dot-live" />
                A small, growing library — built note by note
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 900,
              fontSize: 'clamp(40px,5.5vw,68px)', lineHeight: 1.02,
              letterSpacing: 0, marginBottom: 18,
            }}>
              Maths notes,<br />
              made to{' '}
              <span className="click-chip" style={{
                background: 'var(--lemon)', borderRadius: 12, padding: '0 10px',
                border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)',
                display: 'inline-block', transform: 'rotate(-1.5deg) translateY(2px)',
              }}>
                click.
              </span>
            </h1>

            <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', maxWidth: 500, marginBottom: 24, lineHeight: 1.58, fontWeight: 600 }}>
              A personal corner of the internet for KS3, IGCSE, A-Level, AP and university maths.
              Free notes, video walkthroughs, worked examples — open to anyone, forever.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <Link href="/courses" className="btn btn-primary" style={{ fontSize: 15 }}>Browse the notes →</Link>
              <Link href="/about" className="btn" style={{ fontSize: 15 }}>About this site</Link>
            </div>

            {/* stats */}
            <div className="hero-stats" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {[
                { n: '6', label: 'Tracks', bg: 'var(--coral-bg)', border: 'var(--coral)' },
                { n: String(allNotes.length), label: allNotes.length === 1 ? 'Note' : 'Notes', bg: 'var(--mint-bg)', border: 'var(--mint)' },
                { n: 'EN/中', label: 'Bilingual', bg: 'var(--sky-bg)', border: 'var(--sky)' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '10px 15px', borderRadius: 12,
                  background: s.bg, border: '2.5px solid var(--ink)',
                  boxShadow: '2px 2px 0 var(--ink)',
                }}>
                  <div style={{ fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontWeight: 700, fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* hero illustration — two-card formula cluster */}
          <div className="hero-visual" style={{ position: 'relative', height: 340 }}>
            <HeroCard color="#e8e4d8" style={{
              top: 94, left: '28%', width: '64%', padding: 18,
              transform: 'rotate(10deg) scale(.9)', opacity: .65, zIndex: 1,
              border: '2.5px solid #2d2640', borderRadius: 14, boxShadow: 'none',
            }}>
              <div style={{ fontWeight: 900, color: '#2d2640', fontSize: 15, marginBottom: 10 }}>Derivative Rules</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, background: '#fff', padding: '8px 12px', borderRadius: 10, border: '2px solid #2d2640' }}>
                d/dx [xⁿ] = nxⁿ⁻¹
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {['A-Level','Calculus'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </HeroCard>
            <Link href="/igcse/algebra/quadratic-equations" className="hero-formula-card" style={{
              position: 'absolute', top: 82, left: '3%', width: '76%', zIndex: 3,
              display: 'block', textDecoration: 'none', color: 'inherit',
              transform: 'rotate(-4deg)', transition: 'transform .14s ease, border-color .14s ease',
            }}>
              <div style={{
                background: '#ddeaf8', border: '3px solid #2d2640', borderRadius: 14,
                padding: 24, boxShadow: 'none',
              }}>
                <div style={{ fontWeight: 900, color: '#2d2640', fontSize: 18, marginBottom: 14 }}>Quadratic Formula</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, background: '#fff', padding: '12px 16px', borderRadius: 10, border: '2.5px solid #2d2640' }}>
                  x = (−b ± √(b²−4ac)) / 2a
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  {['A-Level','Algebra'].map(t => <Tag key={t}>{t}</Tag>)}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section className="container" style={{ padding: '0 22px 56px' }}>
        <div className="course-catalog-head">
          <div>
            <h2>{COURSES.length} tracks, one growing library.</h2>
            <p>Start with the track you recognise. New notes settle into the right place as the library grows.</p>
          </div>
          <Link href="/courses" className="course-catalog-link">See all tracks →</Link>
        </div>
        <div className="course-shelf" aria-label="Curated course tracks">
          {COURSES.map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`} className="course-shelf-link">
              <div className="course-shelf-card" data-color={c.color}>
                <div className="course-icon">{c.icon}</div>
                <div className="course-sub">{c.subtitle}</div>
                <h3>{c.title}</h3>
                <p className="course-desc">{c.description}</p>
                <div className="course-footer">
                  <span><span className="dot-live" /> Growing</span>
                  <div className="course-arrow">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent notes ── */}
      {recent.length > 0 && (
        <section className="container" style={{ padding: '0 22px 56px' }}>
          <div className="sec-head">
            <span className="pill">🌱 Latest notes</span>
            <h2>Fresh from the desk.</h2>
            <p style={{ fontSize: 15 }}>Recently published notes, trimmed and sorted into their course tracks.</p>
          </div>
          <div className="grid-3">
            {recent.map((n) => <PostCard key={`${n.course}/${n.slug}`} note={n} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/notes" className="btn">See all notes →</Link>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="container" style={{ padding: '0 22px 56px' }}>
        <div className="sec-head">
          <span className="pill">✨ How it works</span>
          <h2>Simple, open, free.</h2>
        </div>
        <FeatureCards />
      </section>

      {/* ── CTA ── */}
      <div className="container" style={{ padding: '0 22px 68px' }}>
        <div style={{
          padding: '46px 36px', borderRadius: 24, textAlign: 'center',
          background: 'var(--lemon-bg)',
          border: '2.5px solid var(--ink)',
          boxShadow: '5px 5px 0 var(--ink)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'var(--lemon)', opacity: .32, top: -76, right: -52, border: '2px solid rgba(0,0,0,.08)' }} />
          <div style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', background: 'var(--sky-bg)', opacity: .5, bottom: -44, left: -34 }} />

          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 'clamp(30px,4vw,44px)', letterSpacing: 0, lineHeight: 1.05, marginBottom: 14, color: 'var(--ink)', position: 'relative', zIndex: 1 }}>
            Free to read,<br />forever.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 500, margin: '0 auto 24px', fontWeight: 600, position: 'relative', zIndex: 1 }}>
            No accounts, no paywalls, no ads. Just notes, slowly piling up.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/courses" className="btn" style={{ background: '#fff', color: 'var(--ink)' }}>Browse the notes</Link>
            <a href={`https://github.com/pennyzhaozhao/mathnest`} target="_blank" rel="noopener noreferrer"
              className="btn" style={{ background: 'var(--lilac-bg)', color: 'var(--ink)' }}>View on GitHub ↗</a>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--ink-soft)', display: 'flex', gap: 18, justifyContent: 'center', fontWeight: 700, position: 'relative', zIndex: 1 }}>
            {['Open source', 'Free forever', 'No tracking'].map(t => <span key={t}>♡ {t}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── tiny local components ── */
function HeroCard({ children, color, style }: any) {
  return (
    <div style={{
      position: 'absolute', borderRadius: 18, padding: 18, zIndex: 1,
      background: color,
      border: '2.5px solid var(--ink)',
      boxShadow: '4px 4px 0 var(--ink)',
      ...style,
    }}>
      {children}
    </div>
  );
}
function Tag({ children }: any) {
  return (
    <span style={{
      fontSize: 11, padding: '3px 9px', borderRadius: 999,
      background: '#eef6ff', fontWeight: 700, color: 'var(--ink)',
      border: '1.5px solid var(--ink)',
    }}>{children}</span>
  );
}
