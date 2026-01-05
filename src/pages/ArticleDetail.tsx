import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/mock';
import { Article } from '../types';
import { 
  Edit2, Save, ArrowLeft,
  Bold, Italic, Heading, List, Link, Image, Minus
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Editing state
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editAliases, setEditAliases] = useState('');

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    setLoading(true);
    const data = await api.articles.get(articleId);
    if (data) {
      setArticle(data);
      // Initialize edit state just in case
      setEditContent(data.content);
      setEditTitle(data.title);
      setEditTags(data.tags?.join(', ') || '');
      setEditAliases(data.aliases?.join(', ') || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!article) return;
    const updatedArticle = {
      ...article,
      title: editTitle,
      content: editContent,
      tags: editTags.split(',').map(s => s.trim()).filter(Boolean),
      aliases: editAliases.split(',').map(s => s.trim()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };
    await api.articles.save(updatedArticle);
    setArticle(updatedArticle);
    setIsEditing(false);
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);
    const selection = text.substring(start, end);

    const newText = beforeText + before + selection + after + afterText;
    setEditContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!article) {
    return <div className="p-8">Article not found</div>;
  }

  return (
    <div className={cn("mx-auto animate-in slide-in-from-right-4 duration-300", isEditing ? "max-w-7xl" : "max-w-4xl")}>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/articles')}
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
                // Ensure edit state is synced with current article state
                setEditContent(article.content);
                setEditTitle(article.title);
                setEditTags(article.tags?.join(', ') || '');
                setEditAliases(article.aliases?.join(', ') || '');
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
          <div className="flex flex-col h-[75vh] p-6 space-y-4">
            {/* Row 1: Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('articles.titleLabel')}</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                placeholder={t('articles.titlePlaceholder')}
              />
            </div>

            {/* Row 2: Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('articles.tagsLabel')}</label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                placeholder={t('articles.tagsPlaceholder')}
              />
            </div>

            {/* Row 3: Aliases */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('articles.aliasesLabel')}</label>
              <input
                type="text"
                value={editAliases}
                onChange={(e) => setEditAliases(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                placeholder={t('articles.aliasesPlaceholder')}
              />
            </div>

            {/* Row 4: Content Editor with Toolbar */}
            <div className="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center space-x-2 p-2 bg-gray-50 border-b border-gray-200">
                <button onClick={() => insertText('# ')} className="p-1 hover:bg-gray-200 rounded" title="Heading 1"><Heading className="w-4 h-4" /><span className="text-xs ml-0.5">1</span></button>
                <button onClick={() => insertText('## ')} className="p-1 hover:bg-gray-200 rounded" title="Heading 2"><Heading className="w-4 h-4" /><span className="text-xs ml-0.5">2</span></button>
                <button onClick={() => insertText('**', '**')} className="p-1 hover:bg-gray-200 rounded" title="Bold"><Bold className="w-4 h-4" /></button>
                <button onClick={() => insertText('*', '*')} className="p-1 hover:bg-gray-200 rounded" title="Italic"><Italic className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <button onClick={() => insertText('- ')} className="p-1 hover:bg-gray-200 rounded" title="List"><List className="w-4 h-4" /></button>
                <button onClick={() => insertText('[](url)')} className="p-1 hover:bg-gray-200 rounded" title="Link"><Link className="w-4 h-4" /></button>
                <button onClick={() => insertText('![]()')} className="p-1 hover:bg-gray-200 rounded" title="Image"><Image className="w-4 h-4" /></button>
                <button onClick={() => insertText('\n---\n')} className="p-1 hover:bg-gray-200 rounded" title="Horizontal Rule"><Minus className="w-4 h-4" /></button>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 h-full border-b md:border-b-0 md:border-r border-gray-100">
                  <textarea
                    id="article-content-textarea"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full p-4 focus:outline-none font-mono text-sm resize-none bg-gray-50/30"
                    placeholder={t('articles.placeholder')}
                  />
                </div>
                <div className="w-full md:w-1/2 h-full overflow-y-auto bg-white">
                  <div className="p-4 prose prose-sm max-w-none prose-headings:font-bold prose-a:text-[#007AFF]">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {editContent}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[#007AFF]">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkMath]} 
              rehypePlugins={[rehypeKatex]}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
