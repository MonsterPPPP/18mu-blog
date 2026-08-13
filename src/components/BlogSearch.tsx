import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type Item = { title: string; description: string; href: string; tags: string[]; category: string };

export default function BlogSearch({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return term ? items.filter((item) => `${item.title}${item.description}${item.category}${item.tags.join(' ')}`.toLocaleLowerCase().includes(term)) : [];
  }, [query, items]);

  return <section className="search" aria-label="博客检索">
    <label>
      <span className="sr-only">搜索文章与标签</span>
      <input className="search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文章、分类或标签" />
    </label>
    <Search className="search-icon" size={20} aria-hidden="true" />
    {query && <div className="search-results" role="list">
      {matches.map((item) => <a className="search-result" href={item.href} key={item.href} role="listitem">{item.title}<small>{item.category} · {item.tags.join(' / ')}</small></a>)}
      {!matches.length && <p className="search-empty">没有找到匹配内容，试试更短的关键词。</p>}
    </div>}
  </section>;
}
