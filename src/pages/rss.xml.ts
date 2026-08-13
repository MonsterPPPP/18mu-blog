import rss from '@astrojs/rss';import { getCollection } from 'astro:content';
export async function GET(context: { site: URL }) { const posts=await getCollection('blog',({data})=>data.published); return rss({title:'18mu-blog',description:'个人知识站',site:context.site,items:posts.map(p=>({title:p.data.title,description:p.data.description,link:`/blog/${p.id}/`,pubDate:p.data.updated}))}); }
