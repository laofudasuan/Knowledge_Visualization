import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { api } from '../api/mock';
import { SearchResult } from '../types';

interface GlobalSearchProps {
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        const results = await api.search(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'graph') {
      navigate(`/graph?id=${result.id}`);
    } else if (result.type === 'article') {
      navigate('/articles');
    } else if (result.type === 'problem') {
      navigate('/problems');
    }
    onClose();
  };

  const handleCreateNew = () => {
    navigate(`/graph?id=${searchQuery}`);
    onClose();
  };

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div 
        ref={containerRef}
        className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl transition-all duration-300 overflow-hidden ring-2 ring-[#007AFF]/20"
      >
        <div className="flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder={t('graph.searchPlaceholder') || "Search..."}
            className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="border-t border-gray-100 max-h-[60vh] overflow-y-auto bg-white">
            {searchResults.length > 0 ? (
              searchResults.map((result, idx) => (
                <div
                  key={`${result.type}-${result.id}-${idx}`}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center">
                    <span className={cn(
                      "text-xs uppercase font-bold px-2 py-0.5 rounded-md mr-3",
                      result.type === 'graph' ? "bg-blue-100 text-blue-600" :
                      result.type === 'article' ? "bg-green-100 text-green-600" :
                      "bg-orange-100 text-orange-600"
                    )}>
                      {t(`graph.types.${result.type}`) || result.type}
                    </span>
                    <span className="text-gray-700 font-medium">{result.title}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">{t('graph.noResults') || "No results found"}</div>
            )}
            
            {/* Add new graph option */}
            <div
              className="px-4 py-3 border-t border-gray-100 hover:bg-blue-50 cursor-pointer flex items-center text-[#007AFF]"
              onClick={handleCreateNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="font-medium">{t('graph.createNew', { name: searchQuery }) || `Create new graph "${searchQuery}"`}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
