import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type Item = { title: string; description: string; href: string; tags: string[] };

export default function RecordSearch({ items, label, placeholder }: { items: Item[]; label: string; placeholder: string }) {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return term ? items.filter((item) => `${item.title}${item.description}${item.tags.join(' ')}`.toLocaleLowerCase().includes(term)) : [];
  }, [items, query]);
  return <section className="search" aria-label={label}>
    <label><span className="sr-only">{label}</span><input className="search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} /></label>
    <Search className="search-icon" size={20} aria-hidden="true" />
    {query && <div className="search-results" role="list" aria-live="polite">
      {matches.map((item) => <a className="search-result" href={item.href} key={item.href} role="listitem">{item.title}<small>{item.tags.join(' / ')}</small></a>)}
      {!matches.length && <p className="search-empty">没有找到匹配内容，试试更短的关键词。</p>}
    </div>}
  </section>;
}
