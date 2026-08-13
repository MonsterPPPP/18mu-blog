import { ArrowRight, Footprints, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Node = { id: string; title: string; description: string; url: string; category: string; tags: string[]; updated: string; neighbors: { id: string; score: number }[] };
type Knowledge = { updatedAt: string; nodes: Node[] };
const sample = <T,>(values: T[]) => values[Math.floor(Math.random() * values.length)];

export default function RandomWalk({ startId }: { startId?: string }) {
  const [data, setData] = useState<Knowledge | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'empty'>('loading');
  useEffect(() => { fetch('/api/knowledge').then(async (response) => response.ok ? response.json() : null).then((value) => { const nodes = value?.nodes as Node[] | undefined; setData(value); if (nodes?.length) { const initial = nodes.find((node) => node.id === startId) ?? sample(nodes); setPath([initial.id]); setState('ready'); } else setState('empty'); }).catch(() => setState('empty')); }, [startId]);
  const current = useMemo(() => data?.nodes.find((node) => node.id === path.at(-1)) ?? null, [data, path]);
  const next = useMemo(() => current ? current.neighbors.map((edge) => ({ node: data?.nodes.find((node) => node.id === edge.id), score: edge.score })).filter((item): item is { node: Node; score: number } => Boolean(item.node) && !path.includes(item.node!.id)) : [], [current, data, path]);
  const restart = () => { if (data?.nodes.length) setPath([startId && data.nodes.some((node) => node.id === startId) ? startId : sample(data.nodes).id]); };
  if (state === 'loading') return <div className="map-loading">正在准备漫步路线</div>;
  if (state === 'empty') return <div className="empty-state"><Footprints size={26} aria-hidden="true" /><h2>漫步路线还未生成</h2><p>语义快照同步后，随机漫步会从一篇文章出发，把你带往与它真正相关的旧内容。</p></div>;
  return <section className="walk-tool"><div className="walk-path"><span>已经走过</span>{path.map((id, index) => <span key={`${id}-${index}`} className="walk-dot" title={data?.nodes.find((node) => node.id === id)?.title}>{index + 1}</span>)}</div><article className="walk-current"><div className="eyebrow">{current?.category}</div><h2>{current?.title}</h2><p>{current?.description}</p><div>{current?.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><a href={current?.url}>先阅读这一篇 <ArrowRight size={16} /></a></article><div className="walk-next"><div><span className="eyebrow">下一步</span><h3>沿着关联继续</h3></div>{next.length ? <div className="walk-options">{next.slice(0, 3).map(({ node, score }) => <button key={node.id} onClick={() => setPath((value) => [...value, node.id])}><span>{node.title}</span><small>相关度 {Math.round(score * 100)}%</small><ArrowRight size={16} /></button>)}</div> : <p className="walk-end">这一段漫步已经抵达尽头。重新开始，换一条线索。</p>}<button className="walk-restart" onClick={restart}><RefreshCw size={15} /> 换一个起点</button></div></section>;
}
