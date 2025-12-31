import React, { useEffect, useState } from 'react';
import { api } from '../api/mock';
import { Article } from '../types';
import { Plus, FileText, Calendar, Edit2, Save, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

const Articles: React.FC = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const data = await api.articles.list();
    setArticles(data);
  };

  const handleCreate = async () => {
    const newArticle: Article = {
      id: `article-${Date.now()}`,
      title: 'New Article',
      content: '# New Article\n\nStart writing here...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await api.articles.save(newArticle);
    setArticles([newArticle, ...articles]);
    setSelectedArticle(newArticle);
    setIsEditing(true);
    setEditContent(newArticle.content);
  };

  const handleSave = async () => {
    if (!selectedArticle) return;
    const updatedArticle = {
      ...selectedArticle,
      content: editContent,
      title: editContent.split('\n')[0].replace('# ', '') || selectedArticle.title,
      updatedAt: new Date().toISOString(),
    };
    await api.articles.save(updatedArticle);
    setSelectedArticle(updatedArticle);
    setIsEditing(false);
    loadArticles();
  };

  if (selectedArticle) {
    return (
      <div className={cn("mx-auto animate-in slide-in-from-right-4 duration-300", isEditing ? "max-w-7xl" : "max-w-4xl")}>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('articles.back')}
          </button>
          <div className="flex space-x-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-[#007AFF] text-white rounded-full hover:bg-[#0077ED] transition-colors shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('articles.save')}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditContent(selectedArticle.content);
                }}
                className="flex items-center px-4 py-2 bg-white text-black border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t('articles.edit')}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[60vh]">
          {isEditing ? (
            <div className="flex flex-col md:flex-row h-[75vh]">
              <div className="w-full md:w-1/2 h-full border-b md:border-b-0 md:border-r border-gray-100">
                 <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full p-8 focus:outline-none font-mono text-sm resize-none bg-gray-50/30"
                  placeholder={t('articles.placeholder')}
                />
              </div>
              <div className="w-full md:w-1/2 h-full overflow-y-auto bg-white">
                <div className="p-8 prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[#007AFF]">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {editContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[#007AFF]">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]} 
                rehypePlugins={[rehypeKatex]}
              >
                {selectedArticle.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1F]">{t('articles.title')}</h1>
          <p className="text-gray-500 mt-1">{t('articles.subtitle')}</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-5 py-2.5 bg-[#1D1D1F] text-white rounded-full hover:bg-black transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('articles.newArticle')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#F5F5F7] transition-colors">
                <FileText className="w-6 h-6 text-gray-400 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 line-clamp-1">{article.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-3 mb-4">
              {article.content.replace(/#+\s/g, '').slice(0, 100)}...
            </p>
            <div className="flex items-center text-xs text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(article.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
