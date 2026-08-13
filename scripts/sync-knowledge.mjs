import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import matter from 'gray-matter';

const root = join(process.cwd(), 'src', 'content', 'blog');
const workerUrl = process.env.KNOWLEDGE_SYNC_URL;
const token = process.env.KNOWLEDGE_SYNC_TOKEN;
if (!workerUrl || !token) throw new Error('KNOWLEDGE_SYNC_URL and KNOWLEDGE_SYNC_TOKEN are required');

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}

const articles = await Promise.all((await files(root)).filter((file) => file.endsWith('.md')).map(async (file) => {
  const { data, content } = matter(await readFile(file, 'utf8'));
  if (!data.published) return null;
  const id = relative(root, file).split(sep).join('/').replace(/\.md$/, '');
  return {
    id, title: data.title, description: data.description, category: data.category,
    tags: data.tags ?? [], updated: new Date(data.updated).toISOString(), url: `/blog/${id}`,
    text: content.replace(/[`#>*_\[\]()]/g, ' ').replace(/\s+/g, ' ').trim()
  };
}));

const response = await fetch(workerUrl, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ articles: articles.filter(Boolean) }) });
if (!response.ok) throw new Error(`Knowledge sync failed: ${response.status} ${await response.text()}`);
console.log(await response.text());
