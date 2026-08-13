import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import matter from 'gray-matter';

const contentRoot = join(process.cwd(), 'src', 'content');
const collections = ['blog', 'projects', 'resume', 'agent'];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}

const records = new Map();
for (const collection of collections) {
  const directory = join(contentRoot, collection);
  const files = (await walk(directory)).filter((file) => file.endsWith('.md'));
  records.set(collection, new Map(await Promise.all(files.map(async (file) => {
    const { data } = matter(await readFile(file, 'utf8'));
    return [relative(directory, file).split(sep).join('/').replace(/\.md$/, ''), data];
  }))));
}

const relationTargets = { relatedResume: 'resume', relatedBlog: 'blog', relatedAgent: 'agent', relatedProjects: 'projects' };
const failures = [];
for (const [collection, entries] of records) {
  for (const [slug, data] of entries) {
    for (const [field, targetCollection] of Object.entries(relationTargets)) {
      for (const target of data[field] ?? []) {
        const record = records.get(targetCollection).get(target);
        if (!record) failures.push(`${collection}/${slug}: ${field} references missing ${targetCollection}/${target}`);
        else if (record.published === false) failures.push(`${collection}/${slug}: ${field} references unpublished ${targetCollection}/${target}`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Content relationships are valid.');
