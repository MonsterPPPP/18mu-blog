import { getCollection } from 'astro:content';

export const cleanSlug = (id: string) => id.replace(/\.md$/, '');
export const articleHref = (id: string) => `/blog/${cleanSlug(id)}`;
export const projectHref = (id: string) => `/projects/${cleanSlug(id)}`;
export const agentHref = (id: string) => `/agent/${cleanSlug(id)}`;

export async function publishedPosts() {
  return (await getCollection('blog', ({ data }) => data.published))
    .sort((left, right) => right.data.updated.valueOf() - left.data.updated.valueOf());
}

export async function publishedProjects() {
  return (await getCollection('projects', ({ data }) => data.published))
    .sort((left, right) => right.data.updated.valueOf() - left.data.updated.valueOf());
}

export async function publishedAgentRecords() {
  return (await getCollection('agent', ({ data }) => data.published))
    .sort((left, right) => right.data.updated.valueOf() - left.data.updated.valueOf());
}

export async function publishedResumeRecords() {
  return (await getCollection('resume', ({ data }) => data.published))
    .sort((left, right) => right.data.updated.valueOf() - left.data.updated.valueOf());
}

export function resolveRelated<T extends { id: string }>(entries: T[], ids: string[]) {
  return entries.filter((entry) => ids.includes(cleanSlug(entry.id)));
}
