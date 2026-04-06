# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Type-check (astro check) + production build
npm run preview   # Preview production build locally
```

There is no separate lint or test command — `astro check` (run as part of `build`) handles TypeScript validation.

## Architecture

This is a static personal blog built with **Astro 5 + Tailwind CSS**, deployed to GitHub Pages at `https://zihaopu.cn`.

**Routing** is file-based via `src/pages/`. Blog posts use a dynamic route at `src/pages/blog/[slug].astro` that fetches from the content collection.

**Blog content** lives in `src/content/blog/` as Markdown files. The schema (validated with Zod) is defined in `src/content/config.ts`. Required frontmatter: `title`, `date`. Optional: `description`, `updated`, `tags`, `image`, `published` (defaults true).

**Layouts** wrap pages: `BaseLayout.astro` provides the header/footer shell; `PostLayout.astro` extends it for blog posts.

**Theming** (dark/light) is handled entirely in `ThemeToggle.astro` using `localStorage` and a CSS class on `<html>`. The site defaults to dark mode.

**Styling** uses Tailwind with custom utility classes (`card`, `tag`, `btn`) defined in `src/styles/global.css`. Color palette centers on `#06b6d4` (cyan accent). Fonts: Inter (sans), JetBrains Mono (mono).

**Helpers** in `src/utils/helpers.ts`: `formatDate` (Chinese locale), `calculateReadingTime` (200 wpm), `getUniqueTags`, `sortPostsByDate`, `filterPostsByTag`.

**SEO** components live in `src/components/seo/`: `SEO.astro` for meta/OG/Twitter tags, `Schema.astro` for JSON-LD structured data.

**Deployment** is automatic via `.github/workflows/deploy.yml` on push to `main`, using `withastro/action@v3`.

## Site configuration

- Site URL and author details: `astro.config.mjs`, `src/components/seo/SEO.astro`, `src/components/Hero.astro`, `src/pages/about.astro`
- Color scheme / fonts: `tailwind.config.mjs`
- Content schema: `src/content/config.ts`
