type Article = {
  id: string;
  title: string;
  description: string;
  text: string;
  url: string;
  category: string;
  tags: string[];
  updated: string;
};

interface KVNamespace {
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
}

type Node = Omit<Article, 'text'> & {
  x: number;
  y: number;
  cluster: number;
  neighbors: { id: string; score: number }[];
};

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  KNOWLEDGE_KV: KVNamespace;
  DASHSCOPE_API_KEY: string;
  SYNC_TOKEN: string;
  EMBEDDING_BASE_URL: string;
  EMBEDDING_MODEL: string;
  EMBEDDING_DIMENSIONS: string;
}

const json = (body: unknown, options: ResponseInit = {}) =>
  Response.json(body, { ...options, headers: { 'Cache-Control': 'no-store', ...options.headers } });

function cosine(left: number[], right: number[]) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude) || 1);
}

function clusters(scores: number[][], threshold = 0.48) {
  const result = Array<number>(scores.length).fill(-1);
  let current = 0;
  for (let start = 0; start < scores.length; start += 1) {
    if (result[start] !== -1) continue;
    const queue = [start];
    result[start] = current;
    while (queue.length) {
      const item = queue.shift()!;
      for (let candidate = 0; candidate < scores.length; candidate += 1) {
        if (result[candidate] === -1 && scores[item][candidate] >= threshold) {
          result[candidate] = current;
          queue.push(candidate);
        }
      }
    }
    current += 1;
  }
  return result;
}

async function createEmbeddings(articles: Article[], env: Env) {
  const vectors: number[][] = [];
  for (let offset = 0; offset < articles.length; offset += 20) {
    const batch = articles.slice(offset, offset + 20);
    const response = await fetch(`${env.EMBEDDING_BASE_URL}/embeddings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.DASHSCOPE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.EMBEDDING_MODEL,
        input: batch.map((article) => `${article.title}\n${article.description}\n${article.text}`.slice(0, 50000)),
        dimensions: Number(env.EMBEDDING_DIMENSIONS),
        encoding_format: 'float'
      })
    });
    if (!response.ok) throw new Error(`Embedding provider returned ${response.status}`);
    const payload = await response.json() as { data?: { embedding: number[]; index: number }[] };
    if (!payload.data || payload.data.length !== batch.length) throw new Error('Embedding provider returned an incomplete batch');
    vectors.push(...payload.data.sort((a, b) => a.index - b.index).map((item) => item.embedding));
  }
  return vectors;
}

function buildSnapshot(articles: Article[], vectors: number[][]) {
  const scores = vectors.map((vector) => vectors.map((candidate) => cosine(vector, candidate)));
  const clusterByArticle = clusters(scores);
  const clusterIds = [...new Set(clusterByArticle)];
  const byCluster = new Map(clusterIds.map((id) => [id, clusterByArticle.filter((value) => value === id).length]));
  const nodes: Node[] = articles.map((article, index) => {
    const cluster = clusterByArticle[index];
    const clusterIndex = clusterIds.indexOf(cluster);
    const inClusterIndex = clusterByArticle.slice(0, index).filter((value) => value === cluster).length;
    const size = byCluster.get(cluster) ?? 1;
    const clusterAngle = (Math.PI * 2 * clusterIndex) / Math.max(clusterIds.length, 1);
    const nodeAngle = clusterAngle + (Math.PI * 2 * inClusterIndex) / Math.max(size, 1);
    const radius = size === 1 ? 0.15 : 0.12 + inClusterIndex * 0.08;
    return {
      id: article.id, title: article.title, description: article.description, url: article.url,
      category: article.category, tags: article.tags, updated: article.updated, cluster,
      x: Math.cos(clusterAngle) * 0.58 + Math.cos(nodeAngle) * radius,
      y: Math.sin(clusterAngle) * 0.58 + Math.sin(nodeAngle) * radius,
      neighbors: scores[index]
        .map((score, candidate) => ({ id: articles[candidate].id, score }))
        .filter((item) => item.id !== article.id)
        .sort((left, right) => right.score - left.score)
        .slice(0, 6)
        .map((item) => ({ ...item, score: Number(item.score.toFixed(4)) }))
    };
  });
  return { updatedAt: new Date().toISOString(), model: 'semantic', nodes };
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/knowledge' && request.method === 'GET') {
      const snapshot = await env.KNOWLEDGE_KV.get('current', 'json');
      return json(snapshot ?? { updatedAt: null, nodes: [], status: 'empty' }, { headers: { 'Cache-Control': 'public, max-age=300' } });
    }

    if (url.pathname === '/api/sync/knowledge' && request.method === 'POST') {
      if (request.headers.get('Authorization') !== `Bearer ${env.SYNC_TOKEN}`) return json({ error: 'Unauthorized' }, { status: 401 });
      try {
        const payload = await request.json() as { articles?: Article[] };
        const articles = payload.articles?.filter((article) => article.id && article.title && article.text) ?? [];
        const vectors = await createEmbeddings(articles, env);
        const snapshot = buildSnapshot(articles, vectors);
        await env.KNOWLEDGE_KV.put('current', JSON.stringify(snapshot));
        return json({ updatedAt: snapshot.updatedAt, articleCount: snapshot.nodes.length });
      } catch (error) {
        console.error('Knowledge synchronization failed', error);
        return json({ error: error instanceof Error ? error.message : 'Knowledge synchronization failed' }, { status: 502 });
      }
    }

    if (url.pathname.startsWith('/api/')) return json({ error: 'Not found' }, { status: 404 });
    return env.ASSETS.fetch(request);
  }
};

export default worker;
