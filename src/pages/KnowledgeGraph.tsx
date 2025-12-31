import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Connection,
  addEdge,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { api } from '../api/mock';
import { GraphData, SearchResult } from '../types';
import { Search, Plus, Edit3, Save, X, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

import GraphEditor from '../components/GraphEditor';

const KnowledgeGraph: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentGraphId, setCurrentGraphId] = useState('root');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [jsonContent, setJsonContent] = useState('');

  // Load graph data
  const loadGraph = useCallback(async (id: string) => {
    const data = await api.graphs.get(id);
    if (data) {
      setGraphData(data);
      setCurrentGraphId(id);
      
      // Map to React Flow nodes
      const flowNodes: Node[] = data.nodes.map((n) => ({
        id: n.id,
        position: { x: n.x || Math.random() * 500, y: n.y || Math.random() * 500 },
        data: { label: n.label || n.id, color: n.color, link: n.link },
        style: {
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '10px 20px',
          minWidth: '100px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          color: '#1D1D1F',
          fontSize: '14px',
          fontWeight: 500,
          ...(n.color ? { borderColor: n.color, borderLeftWidth: '4px' } : {}),
        },
      }));

      // Map to React Flow edges
      const flowEdges: Edge[] = data.edges.map((e, i) => ({
        id: `e-${i}`,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' },
        style: { stroke: '#9ca3af', strokeWidth: 1.5 },
        labelStyle: { fill: '#6b7280', fontWeight: 500 },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
      setJsonContent(JSON.stringify(data, null, 2));
    } else {
        // If graph doesn't exist (e.g. from search new), create it
        const newGraph = await api.graphs.create(id);
        setGraphData(newGraph);
        setCurrentGraphId(id);
        setNodes([]);
        setEdges([]);
        setJsonContent(JSON.stringify(newGraph, null, 2));
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadGraph(currentGraphId);
  }, [currentGraphId, loadGraph]);

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const link = node.data.link;
    if (link) {
      if (link.type === 'internal') {
        navigate(link.url);
      } else if (link.type === 'external') {
        window.open(link.url, '_blank');
      }
    }
  };

  const handleSaveGraph = async (updatedData: GraphData) => {
    try {
      await api.graphs.save(updatedData);
      setGraphData(updatedData);
      setIsEditing(false);
      loadGraph(updatedData.id); // Reload to update view
    } catch (e) {
      alert(t('graph.saveError') || 'Failed to save graph');
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] bg-[#F5F5F7] rounded-3xl overflow-hidden shadow-inner border border-white/50">
      
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        className="bg-[#F5F5F7]"
      >
        <Background color="#E5E5E5" gap={20} />
        <Controls className="bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden !m-4" />
        <MiniMap 
            className="!bg-white !border !border-gray-100 !shadow-lg !rounded-xl !m-4" 
            nodeColor={(n) => n.style?.background as string || '#eee'}
        />
      </ReactFlow>

      {/* Edit Button */}
      <div className="absolute bottom-6 right-6 z-10">
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center justify-center w-14 h-14 bg-white text-[#1D1D1F] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-gray-100"
        >
          <Edit3 className="w-6 h-6" />
        </button>
      </div>

      {/* Graph Editor Modal */}
      {isEditing && graphData && (
        <GraphEditor
          initialData={graphData}
          onSave={handleSaveGraph}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default KnowledgeGraph;
