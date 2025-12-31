import { GraphData, Article, Problem } from '../types';

const STORAGE_KEYS = {
  GRAPHS: 'kv_graphs',
  ARTICLES: 'kv_articles',
  PROBLEMS: 'kv_problems',
};

// Initial Data
const initialGraph: GraphData = {
  id: 'root',
  tags: ['root', 'knowledge'],
  aliases: ['Main', 'Index'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  nodes: [
    { id: '1', label: 'Mathematics', x: 0, y: 0, color: '#ff6b6b' },
    { id: '2', label: 'Physics', x: 200, y: 0, color: '#4ecdc4' },
    { id: '3', label: 'Computer Science', x: 100, y: 150, color: '#45b7d1' },
  ],
  edges: [
    { source: '1', target: '2', label: 'Related' },
    { source: '3', target: '1', label: 'Foundation' },
  ],
};

const initialArticle: Article = {
  id: 'welcome',
  title: 'Welcome to Knowledge Visualization',
  content: '# Welcome\n\nThis is your personal knowledge base. You can create graphs, write articles, and solve problems.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Helpers
const getStorage = <T>(key: string, defaultVal: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  return JSON.parse(data);
};

const setStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// API
export const api = {
  graphs: {
    list: async (): Promise<GraphData[]> => {
      return getStorage<GraphData>(STORAGE_KEYS.GRAPHS, [initialGraph]);
    },
    get: async (id: string): Promise<GraphData | undefined> => {
      const graphs = getStorage<GraphData>(STORAGE_KEYS.GRAPHS, [initialGraph]);
      return graphs.find((g) => g.id === id);
    },
    save: async (graph: GraphData): Promise<void> => {
      const graphs = getStorage<GraphData>(STORAGE_KEYS.GRAPHS, [initialGraph]);
      const index = graphs.findIndex((g) => g.id === graph.id);
      if (index >= 0) {
        graphs[index] = { ...graph, updatedAt: new Date().toISOString() };
      } else {
        graphs.push({ ...graph, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      setStorage(STORAGE_KEYS.GRAPHS, graphs);
    },
    create: async (id: string): Promise<GraphData> => {
       const newGraph: GraphData = {
           id,
           tags: [],
           aliases: [],
           nodes: [],
           edges: [],
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString()
       }
       await api.graphs.save(newGraph);
       return newGraph;
    }
  },
  articles: {
    list: async (): Promise<Article[]> => {
      return getStorage<Article>(STORAGE_KEYS.ARTICLES, [initialArticle]).sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },
    get: async (id: string): Promise<Article | undefined> => {
      const articles = getStorage<Article>(STORAGE_KEYS.ARTICLES, [initialArticle]);
      return articles.find((a) => a.id === id);
    },
    save: async (article: Article): Promise<void> => {
      const articles = getStorage<Article>(STORAGE_KEYS.ARTICLES, [initialArticle]);
      const index = articles.findIndex((a) => a.id === article.id);
      if (index >= 0) {
        articles[index] = { ...article, updatedAt: new Date().toISOString() };
      } else {
        articles.push({ ...article, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      setStorage(STORAGE_KEYS.ARTICLES, articles);
    },
  },
  problems: {
    list: async (): Promise<Problem[]> => {
      return getStorage<Problem>(STORAGE_KEYS.PROBLEMS, []).sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },
    get: async (id: string): Promise<Problem | undefined> => {
      const problems = getStorage<Problem>(STORAGE_KEYS.PROBLEMS, []);
      return problems.find((p) => p.id === id);
    },
    save: async (problem: Problem): Promise<void> => {
      const problems = getStorage<Problem>(STORAGE_KEYS.PROBLEMS, []);
      const index = problems.findIndex((p) => p.id === problem.id);
      if (index >= 0) {
        problems[index] = { ...problem, updatedAt: new Date().toISOString() };
      } else {
        problems.push({ ...problem, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      setStorage(STORAGE_KEYS.PROBLEMS, problems);
    },
  },
  search: async (query: string) => {
    const graphs = await api.graphs.list();
    const articles = await api.articles.list();
    const problems = await api.problems.list();
    
    const lowerQuery = query.toLowerCase();
    
    return [
      ...graphs.filter(g => g.id.toLowerCase().includes(lowerQuery) || g.aliases.some(a => a.toLowerCase().includes(lowerQuery)))
        .map(g => ({ type: 'graph', id: g.id, title: g.id } as const)),
      ...articles.filter(a => a.title.toLowerCase().includes(lowerQuery))
        .map(a => ({ type: 'article', id: a.id, title: a.title } as const)),
      ...problems.filter(p => p.title.toLowerCase().includes(lowerQuery))
        .map(p => ({ type: 'problem', id: p.id, title: p.title } as const)),
    ];
  }
};
