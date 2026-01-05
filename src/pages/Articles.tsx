import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/mock';
import { Article } from '../types';
import { Plus, FileText, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Articles: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);

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
      tags: [],
      aliases: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await api.articles.save(newArticle);
    // Navigate to the new article
    navigate(`/articles/${newArticle.id}`);
  };

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
            onClick={() => window.open(`/articles/${article.id}`, '_blank')}
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
