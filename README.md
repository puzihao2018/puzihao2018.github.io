# Zihao Pu's Personal Blog

A modern, minimalist personal blog site built with Astro + Tailwind CSS, deployed to GitHub Pages.

## 🚀 Quick Start

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

## 📁 Project Structure

```
zihaoastro/
├── src/
│   ├── components/          # UI components
│   │   ├── Header.astro     # Navigation bar
│   │   ├── Footer.astro     # Site footer
│   │   ├── Hero.astro       # Homepage hero section
│   │   ├── PostCard.astro   # Blog post preview card
│   │   ├── ProjectCard.astro # Project showcase card
│   │   ├── TagList.astro    # Tag pills component
│   │   ├── ThemeToggle.astro # Dark/light mode switch
│   │   └── seo/
│   │       ├── SEO.astro    # Meta tags, Open Graph
│   │       └── Schema.astro # JSON-LD structured data
│   │
│   ├── content/
│   │   ├── config.ts        # Content collection config
│   │   └── blog/            # Markdown blog posts
│   │       ├── test-post.md
│   │       └── multi-core-rc4-decoder.md
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro # Main layout with header/footer
│   │   └── PostLayout.astro # Blog post layout
│   │
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── blog/
│   │   │   ├── index.astro  # Blog list
│   │   │   └── [slug].astro # Dynamic post pages
│   │   ├── projects.astro   # Projects page
│   │   ├── about.astro      # About page
│   │   └── contact.astro    # Contact page
│   │
│   ├── styles/
│   │   └── global.css       # Global styles, Tailwind imports
│   │
│   └── utils/
│       └── helpers.ts       # Date formatting, reading time, etc.
│
├── public/
│   ├── images/              # Static images
│   └── favicon.svg          # Site favicon
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment
│
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## ✨ Features

- **Dark/Light Theme** - Toggle with system preference detection
- **Responsive Design** - Mobile, tablet, and desktop layouts
- **Markdown Blog** - Full Markdown support with MDX capability
- **Syntax Highlighting** - Shiki with github-dark theme
- **Tags & Categories** - Filter posts by tags
- **Reading Time** - Automatic estimation for each post
- **SEO Optimized** - Meta tags, Open Graph, JSON-LD, sitemap
- **Fast & Lightweight** - Zero JS by default, static output
- **GitHub Pages** - Automatic deployment via GitHub Actions

## 🎨 Design

### Color Palette (Dark Theme - Primary)

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0f172a` | Page background |
| Surface | `#1e293b` | Cards, elevated elements |
| Border | `#334155` | Dividers, borders |
| Text Primary | `#f1f5f9` | Headings |
| Text Secondary | `#94a3b8` | Body text |
| Accent | `#06b6d4` | Links, highlights, CTAs |

### Typography

- **Sans-serif**: Inter
- **Monospace**: JetBrains Mono

## 📝 Writing Blog Posts

Create a new `.md` or `.mdx` file in `src/content/blog/`:

```markdown
---
title: "Post Title"
description: "Brief description for SEO"
date: 2026-04-04
tags: ["FPGA", "Verilog"]
image: "/images/post-cover.jpg"
published: true
---

Your content here...
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `description` | string | No | SEO description |
| `date` | Date | Yes | Publication date |
| `updated` | Date | No | Last update date |
| `tags` | string[] | No | Post tags |
| `image` | string | No | Cover image path |
| `published` | boolean | No | Default: true |

## 🚀 Deployment

### GitHub Pages

1. Push this repository to GitHub
2. Go to Settings → Pages → Source: GitHub Actions
3. The site will auto-deploy on push to `main` branch

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔧 Configuration

### Site URL

Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
});
```

### Author Info

Update the following files with your information:
- `src/components/Hero.astro` - Name and subtitle
- `src/components/Footer.astro` - Social links
- `src/pages/about.astro` - Bio and skills
- `src/components/seo/SEO.astro` - Default meta values

## 📦 Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 5.x |
| Styling | Tailwind CSS 3.x |
| Content | Markdown + MDX |
| Syntax Highlighting | Shiki (github-dark) |
| Deployment | GitHub Pages |
| Node.js | 18.x+ |

## 📄 License

MIT License - feel free to use this template for your own blog!

## 👤 Author

**Zihao Pu**
- Email: zihao.pu@zihaopu.cn
- GitHub: [@puzihao2018](https://github.com/puzihao2018)
- Site: [zihaopu.cn](https://zihaopu.cn)