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

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().optional(),
    tags: z.array(z.string()).default([]),
    github: z.string().optional(),
    demo: z.string().optional(),
    image: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const publications = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    location: z.string().optional(),
    pages: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects, publications };