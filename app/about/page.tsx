import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="page-content" style={{ maxWidth: 760 }}>
      <span className="pill">👋 About</span>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-.03em', margin: '16px 0 20px' }}>
        What is MathNest?
      </h1>
      <article className="prose">
        <p>
          MathNest is a personal learning resource site built by <strong>Penny</strong> — a maths graduate in London working towards a PGCE Maths qualification.
        </p>
        <p>
          The idea is simple: rather than scattering notes across Google Drive, Notion and scraps of paper, everything lives here — organised by curriculum track, tagged by topic, and open to anyone who finds it useful.
        </p>
        <h2>What's covered</h2>
        <ul>
          <li>KS3 &amp; GCSE Foundation (UK Secondary)</li>
          <li>IGCSE Maths — Cambridge &amp; Edexcel (Core + Extended)</li>
          <li>A-Level Maths — Pure, Mechanics, Statistics</li>
          <li>AP Calculus AB/BC and AP Statistics</li>
          <li>初中数学 — 人教版 &amp; 北师大版</li>
          <li>University Foundations — Calculus, Linear Algebra, Probability</li>
        </ul>
        <h2>How it's built</h2>
        <p>
          Notes are written in Markdown with a simple frontmatter header. Maths is written in LaTeX and rendered with KaTeX. Videos embed automatically from YouTube or Bilibili links. Images are pasted directly into the editor and stored on GitHub.
        </p>
        <p>
          The site is open source on GitHub, built with Next.js, and hosted on Cloudflare Pages. Everything is free, no accounts needed, no tracking.
        </p>
        <h2>How to use it</h2>
        <p>
          Browse by course, or search for a topic. Each note has worked examples in exam style. Some notes have a companion video. If you spot a mistake or want to ask a question, leave a comment — that's what they're there for.
        </p>
        <blockquote>
          "The best way to learn maths is to do maths — but a good explanation of why something works doesn't hurt either."
        </blockquote>
      </article>
    </div>
  );
}
