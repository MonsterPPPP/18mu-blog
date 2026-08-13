export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return Response.json(
        { error: 'Semantic synchronization is not configured yet.' },
        { status: 501 }
      );
    }

    return env.ASSETS.fetch(request);
  }
};

export default worker;
