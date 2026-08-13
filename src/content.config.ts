import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), description: z.string(), updated: z.date(), category: z.string(),
    tags: z.array(z.string()).min(1), featured: z.boolean().default(false), published: z.boolean().default(false)
  })
});
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), titleEn: z.string(), summary: z.string(), summaryEn: z.string(),
    updated: z.date(), status: z.string(),
    relatedResume: z.array(z.string()).default([]),
    relatedBlog: z.array(z.string()).default([]),
    relatedAgent: z.array(z.string()).default([]),
    published: z.boolean().default(false)
  })
});
const agent = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string(), description: z.string(), updated: z.date(), tags: z.array(z.string()), published: z.boolean().default(false) })
});
const resume = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), titleEn: z.string(), updated: z.date(),
    published: z.boolean().default(true), relatedProjects: z.array(z.string()).default([])
  })
});
export const collections = { blog, projects, agent, resume };
