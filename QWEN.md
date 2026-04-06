# Zihao Pu's Personal Blog - Project Specification

## Project Overview

Build a modern, minimalist personal blog site using Astro + Tailwind CSS. The site will be deployed to GitHub Pages and focus on a clean developer aesthetic with excellent Markdown support for blogging.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | Astro 5.x |
| **Styling** | Tailwind CSS 3.x |
| **Content** | Markdown + MDX |
| **Syntax Highlighting** | Shiki (github-dark theme) |
| **Deployment** | GitHub Pages (via GitHub Actions) |
| **Node.js** | 18.x or higher |

### Why Astro?

- Component-based architecture - easy for AI to generate complete code
- Perfect Markdown/MDX support for blogging
- Zero JS by default - fast page loads
- Can use React/Vue components if needed
- Static output - works on any hosting platform
- Excellent SEO

---

## Design Goals

### Visual Style: Modern Minimalist

| Aspect | Specification |
|--------|---------------|
| **Theme** | Dark mode primary with light mode toggle |
| **Background** | Deep dark (#0f172a, #020617) |
| **Accent Color** | Cyan/Teal (#06b6d4, #22d3ee) |
| **Typography** | Inter (sans), JetBrains Mono (code) |
| **Layout** | Clean, generous whitespace, clear hierarchy |
| **Animations** | Subtle fade-in, slide-up on scroll |
| **Cards** | Rounded corners, subtle borders, hover effects |

### Design Principles

1. **Clean & Professional** - Developer-focused but approachable
2. **Fast & Lightweight** - Minimal JS, optimized assets
3. **Readable** - Excellent typography for long-form content
4. **Accessible** - Proper contrast, keyboard navigation
5. **Responsive** - Mobile-first design

---

## Site Structure

### Pages

| Page | Path | Description |
|------|------|-------------|
| **Home** | `/` | Hero section, brief intro, latest posts, featured projects |
| **Blog List** | `/blog` | Paginated list of all posts with tags and dates |
| **Blog Post** | `/blog/[slug]` | Individual article page with reading time |
| **About** | `/about` | Personal introduction, education, experience |
| **Projects** | `/projects` | Showcase of GitHub projects and work |
| **Contact** | `/contact` | Contact form, social links, email |

### Navigation

```
[Logo/Home]  [Blog]  [Projects]  [About]  [Contact]  [GitHub] [Theme Toggle]
```

---

## Component Architecture

```
src/
├── components/
│   ├── Header.astro          # Navigation bar with theme toggle
│   ├── Footer.astro          # Site footer with links
│   ├── Hero.astro            # Homepage hero section
│   ├── PostCard.astro        # Blog post preview card
│   ├── ProjectCard.astro    # Project showcase card
│   ├── TagList.astro        # Tag pills component
│   ├── SocialLinks.astro    # GitHub, LinkedIn, Email icons
│   ├── ThemeToggle.astro   # Dark/light mode switch
│   └── seo/
│       ├── SEO.astro         # Meta tags, Open Graph
│       └── Schema.astro      # JSON-LD structured data
│
├── layouts/
│   ├── BaseLayout.astro     # Main layout with header/footer
│   ├── PostLayout.astro     # Blog post layout
│   └── PageLayout.astro     # Generic page layout
│
├── pages/
│   ├── index.astro          # Homepage
│   ├── blog/
│   │   ├── index.astro      # Blog list
│   │   └── [...slug].astro  # Dynamic post pages
│   ├── projects.astro       # Projects page
│   ├── about.astro          # About page
│   └── contact.astro        # Contact page
│
├── content/
│   ├── config.ts            # Content collection config
│   └── blog/
│       └── *.md             # Markdown blog posts
│
├── styles/
│   └── global.css           # Global styles, Tailwind imports
│
└── utils/
    └── helpers.ts           # Date formatting, reading time, etc.
```

---

## Content Structure

### Blog Post Frontmatter

```yaml
---
title: "Post Title"
description: "Brief description for SEO and previews"
date: 2026-04-04
updated: 2026-04-05
tags: ["FPGA", "Verilog"]
image: "/images/post-cover.jpg"
published: true
---
```

### Content Collections Configuration

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { blog };
```

---

## Features

### Must Have

- [ ] Dark/Light theme toggle with system preference detection
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Blog with Markdown support
- [ ] Syntax highlighting for code blocks
- [ ] Tags and categories for posts
- [ ] Reading time estimation
- [ ] SEO optimization (meta tags, sitemap, RSS)
- [ ] GitHub Pages deployment via GitHub Actions

### Nice to Have

- [ ] Search functionality (local search with Fuse.js)
- [ ] Table of contents for posts
- [ ] Related posts suggestions
- [ ] Comments system (Giscus/Utterances)
- [ ] Analytics (Plausible/Umami)
- [ ] RSS feed
- [ ] Print-friendly resume page
- [ ] Multi-language support (future)

---

## Author Information

```yaml
name: Zihao Pu
email: zihao.pu@zihaopu.cn
site: https://zihaopu.cn
github: puzihao2018
title: Zihao's Blog
description: Computer architecture research student
keywords:
  - FPGA
  - Verilog
  - Embedded Systems
  - Electrical Engineering
```


## Deployment Configuration

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zihaopu.cn',
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

---

## Color Palette

### Dark Theme (Primary)

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0f172a` | Page background |
| Surface | `#1e293b` | Cards, elevated elements |
| Border | `#334155` | Dividers, borders |
| Text Primary | `#f1f5f9` | Headings |
| Text Secondary | `#94a3b8` | Body text |
| Accent | `#06b6d4` | Links, highlights, CTAs |
| Accent Hover | `#22d3ee` | Interactive states |

### Light Theme

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#f8fafc` | Page background |
| Surface | `#ffffff` | Cards, elevated elements |
| Border | `#e2e8f0` | Dividers, borders |
| Text Primary | `#0f172a` | Headings |
| Text Secondary | `#475569` | Body text |
| Accent | `#0891b2` | Links, highlights, CTAs |

---

## Implementation Phases

### Phase 1: Foundation
1. Initialize Astro project with Tailwind CSS
2. Set up content collections
3. Create base layout and global styles
4. Implement Header and Footer components

### Phase 2: Core Pages
1. Build Homepage with Hero section
2. Create Blog list and post pages
3. Implement About page
4. Build Projects page
5. Create Contact page

### Phase 3: Features
1. Add dark/light theme toggle
2. Implement tags and categories
3. Add reading time calculation
4. Set up RSS feed
5. Configure sitemap

### Phase 4: Polish
1. Add animations and transitions
2. Optimize images
3. Add SEO meta tags
4. Test responsiveness
5. Configure GitHub Actions deployment

### Phase 5: Content Migration
1. Migrate existing blog posts
2. Update image paths
3. Verify all content renders correctly
4. Test all links

---

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Files to Create

```
/package.json
/astro.config.mjs
/tailwind.config.mjs
/tsconfig.json
/.github/workflows/deploy.yml
/.gitignore
/src/content/config.ts
/src/styles/global.css
/src/layouts/BaseLayout.astro
/src/layouts/PostLayout.astro
/src/components/Header.astro
/src/components/Footer.astro
/src/components/Hero.astro
/src/components/PostCard.astro
/src/components/ProjectCard.astro
/src/components/TagList.astro
/src/components/SocialLinks.astro
/src/components/ThemeToggle.astro
/src/pages/index.astro
/src/pages/blog/index.astro
/src/pages/blog/[...slug].astro
/src/pages/projects.astro
/src/pages/about.astro
/src/pages/contact.astro
/src/content/blog/*.md
/public/images/* (migrated assets)
```

---

## Notes

- All new blog posts should be created in `src/content/blog/` as `.md` or `.mdx` files
- Images should be placed in `public/images/`
- The site uses Chinese (zh-Hans) as primary language
- Author is a FPGA/Embedded Systems developer - content will be technical