# MathNest

MathNest is a bilingual maths learning platform for structured notes, worked examples, video walkthroughs, and interactive practice sets.

Live site: [https://mathnest.top/](https://mathnest.top/)

## Overview

MathNest started as a personal teaching and revision hub, then grew into a full-stack static-first web application. It is designed for students who want clear topic explanations, exam-style examples, and lightweight practice without needing an account.

The site currently supports multiple maths tracks, including IGCSE, A-Level, AP, KS3/GCSE, Chinese middle-school maths, and university foundations.

## Features

- Course catalogue with topic-based organisation
- Markdown-driven notes with frontmatter metadata
- Dynamic routes for course, section, and note pages
- Bilingual note support for English and Chinese content
- LaTeX rendering for mathematical notation
- Syntax highlighting for code-style examples
- Interactive practice sets with MCQ, fill-in, and short-answer questions
- Related-note linking between revision notes and practice sets
- Admin writing interface for publishing notes and practice files to GitHub
- Comment integration through Twikoo
- Static generation for fast page loads and simple deployment

## Tech Stack

- Framework: Next.js 14 App Router
- Language: TypeScript
- UI: React, CSS modules/global CSS
- Content: Markdown, gray-matter
- Maths rendering: KaTeX, remark-math, rehype-katex
- Markdown processing: unified, remark, rehype
- Comments: Twikoo
- Deployment: Cloudflare Pages

## Project Structure

```text
app/                    Next.js App Router pages and dynamic routes
components/             Reusable React components
content/courses/        Markdown notes grouped by course and section
content/practice/       Markdown practice sets grouped by course
lib/                    Content loaders, config, markdown processing
public/content/         Build-time copied public markdown assets
styles/                 Global design system and page styles
```

## Content Model

Notes are stored as Markdown files:

```text
content/courses/{course}/{section}/{slug}.en.md
content/courses/{course}/{section}/{slug}.zh.md
```

Practice sets are stored separately:

```text
content/practice/{course}/{slug}.md
```

The build process scans these files, extracts frontmatter, generates static routes, and groups content automatically by course and section.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To create a production build:

```bash
npm run build
```

## Resume Summary

Built and deployed MathNest, a bilingual maths learning platform using Next.js, TypeScript, Markdown content pipelines, static generation, dynamic routing, LaTeX rendering, and interactive practice modules. The project is live at [mathnest.top](https://mathnest.top/).

## Deployment

The project is deployed on Cloudflare Pages and served through the custom domain:

[https://mathnest.top/](https://mathnest.top/)
