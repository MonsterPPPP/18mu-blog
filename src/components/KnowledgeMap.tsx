import { ArrowUpRight, LoaderCircle, MapPin, RefreshCw } from 'lucide-react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3';
import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type Node = { id: string; title: string; description: string; url: string; category: string; tags: string[]; updated: string; x: number; y: number; cluster: number; neighbors: { id: string; score: number }[] };
type Knowledge = { updatedAt: string; nodes: Node[] };
type PositionedNode = Node & { px: number; py: number };
const colors = ['#146b5f', '#d85a41', '#2f75a1', '#7c5d9e', '#b77a1f', '#3d7a58'];

export default function KnowledgeMap() {
  const [data, setData] = useState<Knowledge | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'empty'>('loading');

  useEffect(() => { fetch('/api/knowledge').then(async (response) => response.ok ? response.json() : null).then((value) => { setData(value); setState(value?.nodes?.length ? 'ready' : 'empty'); }).catch(() => setState('empty')); }, []);
  const active = useMemo(() => data?.nodes.find((node) => node.id === selected) ?? null, [data, selected]);
  const linked = useMemo(() => new Set(active?.neighbors.map((node) => node.id) ?? []), [active]);
  const positioned = useMemo<PositionedNode[]>(() => {
    if (!data?.nodes.length) return [];
    const nodes = data.nodes.map((node, index) => ({ ...node, x: 50 + node.x * 26, y: 50 + node.y * 26, px: 50, py: 50, index }));
    const links = data.nodes.flatMap((node) => node.neighbors.filter((edge) => node.id < edge.id).map((edge) => ({ source: node.id, target: edge.id, strength: edge.score })));
    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-70))
      .force('center', forceCenter(50, 50))
      .force('collide', forceCollide(7))
      .force('link', forceLink(links).id((node: any) => node.id).distance((link: any) => 12 + (1 - link.strength) * 25).strength(0.48))
      .stop();
    for (let index = 0; index < 160; index += 1) simulation.tick();
    return nodes.map((node) => ({ ...node, px: Math.max(7, Math.min(93, node.x ?? 50)), py: Math.max(10, Math.min(90, node.y ?? 50)) }));
  }, [data]);

  if (state === 'loading') return <div className="map-loading"><LoaderCircle size={22} className="spin" /> 正在读取知识快照</div>;
  if (state === 'empty') return <div className="empty-state"><MapPin size={26} aria-hidden="true" /><h2>地图正在等待第一份语义快照</h2><p>文章仍可完整阅读。完成 embedding 同步后，这里会自动呈现文章之间的主题邻近关系。</p></div>;

  const nodes = positioned;
  return <section className="knowledge-map" aria-label="博客认知地图">
    <div className="map-canvas">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {active && active.neighbors.map((edge) => { const source = nodes.find((node) => node.id === active.id); const target = nodes.find((node) => node.id === edge.id); return source && target ? <line key={edge.id} x1={source.px} y1={source.py} x2={target.px} y2={target.py} /> : null; })}
      </svg>
      {nodes.map((node) => <button key={node.id} className={`map-node ${selected === node.id ? 'selected' : ''} ${linked.has(node.id) ? 'linked' : ''}`} style={{ left: `${node.px}%`, top: `${node.py}%`, '--node-color': colors[Math.abs(node.cluster) % colors.length] } as CSSProperties} onClick={() => setSelected(node.id)} aria-label={`查看 ${node.title}`}><span>{node.title}</span></button>)}
      <p className="map-caption">每一个点是一篇文章。选择一点，查看它的语义邻居。</p>
    </div>
    <aside className="map-inspector" aria-live="polite">
      {active ? <><span className="eyebrow">{active.category}</span><h2>{active.title}</h2><p>{active.description}</p><div>{active.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><a className="map-read" href={active.url}>阅读文章 <ArrowUpRight size={15} /></a><button className="map-reset" onClick={() => setSelected(null)}><RefreshCw size={14} /> 回到全局</button></> : <><span className="eyebrow">全量地图</span><h2>{nodes.length} 篇已关联文章</h2><p>主题山峰由文章语义相似度自动形成，而不是由手动标签决定。</p><p className="map-date">快照更新于 {new Date(data!.updatedAt).toLocaleDateString('zh-CN')}</p></>}
    </aside>
  </section>;
}
