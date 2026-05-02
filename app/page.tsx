import Link from 'next/link';
import { COURSES } from '@/lib/config';
import { getRecentNotes } from '@/lib/notes';
import PostCard from '@/components/PostCard';
import FeatureCards from '@/components/FeatureCards';

export default function HomePage() {
  const recent = getRecentNotes(3);

  return (
    <>
      {/* ── Hero ── */}
      <section className="container" style={{ padding: '60px 22px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 50, alignItems: 'center' }}>
          <div>
            <span className="pill" style={{ marginBottom: 22, display: 'inline-flex', background: 'linear-gradient(135deg,#fff,#FFEEDD)' }}>
              <span className="dot-live" />
              A small, growing library — built note by note
            </span>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: 'clamp(44px,6vw,80px)', lineHeight: 1, letterSpacing: '-.035em', marginBottom: 24 }}>
              Maths notes,<br />made to <span className="squiggle-text">click</span>.
            </h1>
            <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 500, marginBottom: 32 }}>
              A personal corner of the internet for KS3, IGCSE, A-Level, AP and university maths.
              Free notes, video walkthroughs, worked examples — open to anyone, forever.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link href="/courses" className="btn btn-primary">Browse the notes →</Link>
              <Link href="/about"   className="btn">About this site</Link>
            </div>
          </div>

          {/* floating cards */}
          <div style={{ position: 'relative', height: 520 }}>
            <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(40px)', opacity: .6, width: 260, height: 260, background: 'var(--coral)', top: -40, right: -20, zIndex: 0 }} />
            <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(40px)', opacity: .6, width: 240, height: 240, background: 'var(--mint)', bottom: -20, left: -20, zIndex: 0 }} />

            <FloatCard color="#FFEFE0,#FFD9BD" style={{ top: 0, left: 0, width: '62%', animationDelay: '-1s' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Quadratic Formula</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, background: 'rgba(255,255,255,.7)', padding: '9px 13px', borderRadius: 13, boxShadow: 'inset 2px 2px 6px rgba(170,120,80,.1)' }}>
                x = (−b ± √(b²−4ac)) / 2a
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                {['A-Level', 'Pure', 'Algebra'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </FloatCard>

            <FloatCard color="#E1F7EC,#BFE9D5" style={{ top: '37%', right: 0, width: '54%', animationDelay: '-3s' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Notes + worked examples</div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Plain-English explanation, then examples that look exactly like the exam.</p>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {['IGCSE', 'Trig'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </FloatCard>

            <FloatCard color="#EFE6FF,#D9C9FF" style={{ bottom: 0, left: '14%', width: '58%', animationDelay: '-5s' }}>
              <div style={{ height: 80, borderRadius: 13, background: 'linear-gradient(135deg,#FFB3D6,#B9A6F0)', display: 'grid', placeItems: 'center', fontSize: 30, color: '#fff', boxShadow: 'inset 2px 2px 6px rgba(0,0,0,.08)' }}>▶</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700, marginTop: 12 }}>Video walkthrough</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-soft)', marginTop: 8, fontWeight: 600 }}>
                <span>YouTube · 8:24</span><span>初中数学</span>
              </div>
            </FloatCard>
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section className="container" style={{ padding: '72px 22px' }}>
        <div className="sec-head">
          <span className="pill">📚 Course catalog</span>
          <h2>Six tracks, one growing library.</h2>
          <p>Each track auto-organises itself by topic tag as new notes go live.</p>
        </div>
        <div className="grid-3">
          {COURSES.map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="course-card" data-color={c.color}>
                <div className="course-icon">{c.icon}</div>
                <div className="course-sub">{c.subtitle}</div>
                <h3>{c.title}</h3>
                <p className="course-desc">{c.description}</p>
                <div className="course-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                    <span className="dot-live" />Growing library
                  </span>
                  <div className="course-arrow">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent notes ── */}
      {recent.length > 0 && (
        <section className="container" style={{ padding: '0 22px 72px' }}>
          <div className="sec-head">
            <span className="pill">🌱 Latest notes</span>
            <h2>Fresh from the desk.</h2>
            <p>New notes get tagged and sorted into their course automatically.</p>
          </div>
          <div className="grid-3">
            {recent.map((n) => <PostCard key={`${n.course}/${n.slug}`} note={n} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/notes" className="btn">See all notes →</Link>
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      <section className="container" style={{ padding: '0 22px 72px' }}>
        <div className="sec-head">
          <span className="pill">✨ How it works</span>
          <h2>Simple, open, free.</h2>
        </div>
        <FeatureCards />
      </section>

      {/* ── CTA ── */}
      <div className="container" style={{ padding: '0 22px 80px' }}>
        <div style={{
          padding: '56px 40px', borderRadius: 40, textAlign: 'center', color: '#fff',
          background: 'linear-gradient(135deg,#FFB89A,#FF7A66,#FF8E6E)',
          boxShadow: '24px 24px 50px rgba(232,90,69,.32),-10px -10px 24px rgba(255,255,255,.7)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.15)', top: -100, right: -80, filter: 'blur(20px)' }} />
          <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,214,107,.45)', bottom: -80, left: -60, filter: 'blur(30px)' }} />
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(34px,4.5vw,52px)', fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: 16, position: 'relative', zIndex: 1 }}>
            Free to read,<br/>forever.
          </h2>
          <p style={{ fontSize: 17, opacity: .95, maxWidth: 520, margin: '0 auto 26px', position: 'relative', zIndex: 1 }}>
            No accounts, no paywalls, no ads. Just notes, slowly piling up.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/courses" className="btn" style={{ background: '#fff', color: 'var(--coral-deep)', boxShadow: '10px 10px 22px rgba(0,0,0,.15)' }}>Browse the notes</Link>
            <a href={`https://github.com/${process.env.NEXT_PUBLIC_GH_OWNER || 'pennyzhaozhao'}/mathnest`}
               target="_blank" rel="noopener noreferrer" className="btn btn-ghost">View on GitHub ↗</a>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, opacity: .8, display: 'flex', gap: 18, justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            {['Open source', 'Free forever', 'No tracking'].map(t => <span key={t}>♡ {t}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}

// ── tiny local components ──
function FloatCard({ children, color, style }: any) {
  return (
    <div style={{
      position: 'absolute', borderRadius: 24, padding: 18, zIndex: 1,
      background: `linear-gradient(160deg,#${color.split(',')[0].replace('#','')} , #${color.split(',')[1].replace('#','')})`,
      boxShadow: '18px 18px 36px rgba(170,120,80,.18), -10px -10px 22px rgba(255,255,255,.9)',
      animation: 'floaty 6s ease-in-out infinite',
      ...style,
    }}>
      <style>{`@keyframes floaty{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}}`}</style>
      {children}
    </div>
  );
}
function Tag({ children }: any) {
  return <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 999, background: 'rgba(255,255,255,.7)', fontWeight: 600, color: 'var(--ink)' }}>{children}</span>;
}
