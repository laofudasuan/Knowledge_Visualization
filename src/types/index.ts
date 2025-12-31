export interface GraphNode {
  id: string;
  label?: string; // Optional label for display
  color?: string; // Default color if not provided
  x?: number; // Coordinate, if missing auto-layout
  y?: number;
  link?: {
    url: string;
    type: 'internal' | 'external'; // internal: route change, external: new window
  };
  // React Flow specific properties can be added here if needed, but we map to them
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  id: string; // Filename usually
  tags: string[];
  aliases: string[];
  cssclasses?: string; // e.g., 'tree', 'radial', 'dark-mode'
  nodes: GraphNode[];
  edges: GraphEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string; // Filename
  title: string;
  content: string; // Markdown content
  createdAt: string;
  updatedAt: string;
}

export interface AnimationStep {
  stepId: string;
  description: string;
  targetNodeId?: string; // Focus on this node
  highlightNodes?: string[]; // Highlight these nodes
  highlightEdges?: { source: string; target: string }[];
  duration?: number; // ms
}

export interface Problem {
  id: string; // Filename
  title: string;
  content: string; // Markdown content describing the problem
  solutionScript: AnimationStep[];
  createdAt: string;
  updatedAt: string;
}

export type SearchResult = {
  type: 'graph' | 'article' | 'problem';
  id: string;
  title: string;
  matchField?: string;
};

export interface User {
  id: number; // Changed from string to number based on API spec
  username: string;
  email: string;
  role?: number;
  created_at?: string;
  updated_at?: string;
}

// Response for /register
export interface RegisterResponse {
  message: string;
  user: User;
}

// Response for /login
export interface LoginResponse {
  token: string;
  user: User;
}

// Unified AuthResponse for backward compatibility if needed, but better to use specific ones
export interface AuthResponse {
  token?: string;
  user: User;
  message?: string;
}
