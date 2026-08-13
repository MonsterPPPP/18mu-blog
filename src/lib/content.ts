import { getCollection } from 'astro:content';

export const cleanSlug = (id: string) => id.replace(/\.md$/, '');
export const articleHref = (id: string) => `/blog/${cleanSlug(id)}`;
export async function publishedPosts() {
  return (await getCollection('blog', ({ data }) => data.published))
    .sort((left, right) => right.data.updated.valueOf() - left.data.updated.valueOf());
}
