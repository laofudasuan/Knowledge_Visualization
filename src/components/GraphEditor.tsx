import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GraphData, GraphNode, GraphEdge } from '../types';

interface GraphEditorProps {
  initialData: GraphData;
  onSave: (data: GraphData) => void;
  onClose: () => void;
}

const GraphEditor: React.FC<GraphEditorProps> = ({ initialData, onSave, onClose }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<GraphData>(initialData);
  const [activeTab, setActiveTab] = useState<'nodes' | 'edges' | 'meta'>('nodes');

  const updateMeta = (key: keyof GraphData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const addNode = () => {
    const newNode: GraphNode = {
      id: `node-${Date.now()}`,
      label: 'New Node',
      x: 0,
      y: 0,
      color: '#007AFF'
    };
    setData(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
  };

  const updateNode = (index: number, key: keyof GraphNode, value: any) => {
    const newNodes = [...data.nodes];
    if (key === 'link') {
        newNodes[index] = { ...newNodes[index], link: { ...newNodes[index].link, ...value } };
    } else {
        newNodes[index] = { ...newNodes[index], [key]: value };
    }
    setData(prev => ({ ...prev, nodes: newNodes }));
  };

  const removeNode = (index: number) => {
    const nodeId = data.nodes[index].id;
    setData(prev => ({
      ...prev,
      nodes: prev.nodes.filter((_, i) => i !== index),
      edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    }));
  };

  const addEdge = () => {
    if (data.nodes.length < 2) return;
    const newEdge: GraphEdge = {
      source: data.nodes[0].id,
      target: data.nodes[1].id,
      label: ''
    };
    setData(prev => ({ ...prev, edges: [...prev.edges, newEdge] }));
  };

  const updateEdge = (index: number, key: keyof GraphEdge, value: any) => {
    const newEdges = [...data.edges];
    newEdges[index] = { ...newEdges[index], [key]: value };
    setData(prev => ({ ...prev, edges: newEdges }));
  };

  const removeEdge = (index: number) => {
    setData(prev => ({
      ...prev,
      edges: prev.edges.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">{t('graph.editGraph')}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onSave(data)}
              className="flex items-center px-4 py-2 bg-[#007AFF] text-white rounded-full hover:bg-[#0077ED] transition-colors shadow-sm text-sm font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('graph.saveChanges')}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'nodes' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('nodes')}
          >
            {t('graph.nodes') || 'Nodes'} ({data.nodes.length})
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'edges' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('edges')}
          >
            {t('graph.edges') || 'Edges'} ({data.edges.length})
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'meta' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('meta')}
          >
            {t('graph.metadata') || 'Metadata'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'nodes' && (
            <div className="space-y-4">
              <button
                onClick={addNode}
                className="flex items-center justify-center w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('graph.addNode') || 'Add Node'}
              </button>
              {data.nodes.map((node, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-gray-900">{t('graph.node')} {index + 1}</h4>
                    <button onClick={() => removeNode(index)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">ID</label>
                      <input
                        type="text"
                        value={node.id}
                        onChange={(e) => updateNode(index, 'id', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{t('graph.label') || 'Label'}</label>
                      <input
                        type="text"
                        value={node.label || ''}
                        onChange={(e) => updateNode(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{t('graph.color') || 'Color'}</label>
                      <input
                        type="color"
                        value={node.color || '#000000'}
                        onChange={(e) => updateNode(index, 'color', e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer"
                      />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('graph.linkUrl') || 'Link URL'}</label>
                        <input
                            type="text"
                            value={node.link?.url || ''}
                            onChange={(e) => updateNode(index, 'link', { url: e.target.value, type: node.link?.type || 'internal' })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            placeholder="/path or https://..."
                        />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'edges' && (
            <div className="space-y-4">
              <button
                onClick={addEdge}
                className="flex items-center justify-center w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('graph.addEdge') || 'Add Edge'}
              </button>
              {data.edges.map((edge, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                   <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-gray-900">{t('graph.edge') || 'Edge'} {index + 1}</h4>
                    <button onClick={() => removeEdge(index)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{t('graph.source') || 'Source Node ID'}</label>
                      <select
                        value={edge.source}
                        onChange={(e) => updateEdge(index, 'source', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      >
                        {data.nodes.map(n => (
                          <option key={n.id} value={n.id}>{n.label || n.id}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{t('graph.target') || 'Target Node ID'}</label>
                      <select
                        value={edge.target}
                        onChange={(e) => updateEdge(index, 'target', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      >
                        {data.nodes.map(n => (
                          <option key={n.id} value={n.id}>{n.label || n.id}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{t('graph.label') || 'Label'}</label>
                      <input
                        type="text"
                        value={edge.label || ''}
                        onChange={(e) => updateEdge(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-4">
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('graph.id') || 'Graph ID / Filename'}</label>
                    <input
                      type="text"
                      value={data.id}
                      onChange={(e) => updateMeta('id', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      disabled // ID changes might be complex to handle
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('graph.tags') || 'Tags (comma separated)'}</label>
                    <input
                      type="text"
                      value={data.tags.join(', ')}
                      onChange={(e) => updateMeta('tags', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('graph.aliases') || 'Aliases (comma separated)'}</label>
                    <input
                      type="text"
                      value={data.aliases.join(', ')}
                      onChange={(e) => updateMeta('aliases', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    />
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphEditor;
