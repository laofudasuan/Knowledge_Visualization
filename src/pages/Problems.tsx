import React, { useEffect, useState } from 'react';
import { api } from '../api/mock';
import { Problem, AnimationStep } from '../types';
import { Plus, HelpCircle, Calendar, Play, Pause, RotateCcw, Save, Edit2, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

const Problems: React.FC = () => {
  const { t } = useTranslation();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedProblem) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= selectedProblem.solutionScript.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500); // 1.5s per step
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedProblem]);

  const loadProblems = async () => {
    const data = await api.problems.list();
    setProblems(data);
  };

  const handleCreate = async () => {
    const newProblem: Problem = {
      id: `problem-${Date.now()}`,
      title: 'New Problem',
      content: '# New Problem\n\nDescribe the problem here...',
      solutionScript: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await api.problems.save(newProblem);
    setProblems([newProblem, ...problems]);
    setSelectedProblem(newProblem);
    setIsEditingContent(true);
    setEditContent(newProblem.content);
  };

  const handleSaveContent = async () => {
    if (!selectedProblem) return;
    const updatedProblem = {
      ...selectedProblem,
      content: editContent,
      title: editContent.split('\n')[0].replace('# ', '') || selectedProblem.title,
      updatedAt: new Date().toISOString(),
    };
    await api.problems.save(updatedProblem);
    setSelectedProblem(updatedProblem);
    setIsEditingContent(false);
    loadProblems();
  };

  const handleAddStep = async () => {
    if (!selectedProblem) return;
    const newStep: AnimationStep = {
      stepId: `step-${Date.now()}`,
      description: 'New step description',
    };
    const updatedProblem = {
      ...selectedProblem,
      solutionScript: [...selectedProblem.solutionScript, newStep],
      updatedAt: new Date().toISOString(),
    };
    await api.problems.save(updatedProblem);
    setSelectedProblem(updatedProblem);
  };

  const handleUpdateStep = async (index: number, description: string) => {
    if (!selectedProblem) return;
    const newScript = [...selectedProblem.solutionScript];
    newScript[index] = { ...newScript[index], description };
    const updatedProblem = {
      ...selectedProblem,
      solutionScript: newScript,
      updatedAt: new Date().toISOString(),
    };
    await api.problems.save(updatedProblem);
    setSelectedProblem(updatedProblem);
  };

  const handleDeleteStep = async (index: number) => {
      if (!selectedProblem) return;
      const newScript = [...selectedProblem.solutionScript];
      newScript.splice(index, 1);
      const updatedProblem = {
          ...selectedProblem,
          solutionScript: newScript,
          updatedAt: new Date().toISOString()
      };
      await api.problems.save(updatedProblem);
      setSelectedProblem(updatedProblem);
  }

  if (selectedProblem) {
    return (
      <div className="max-w-6xl mx-auto animate-in slide-in-from-right-4 duration-300 h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <button
            onClick={() => {
              setSelectedProblem(null);
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="flex items-center text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('problems.back')}
          </button>
          <div className="flex space-x-2">
            {isEditingContent ? (
              <button
                onClick={handleSaveContent}
                className="flex items-center px-4 py-2 bg-[#007AFF] text-white rounded-full hover:bg-[#0077ED] transition-colors shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('problems.saveContent')}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingContent(true);
                  setEditContent(selectedProblem.content);
                }}
                className="flex items-center px-4 py-2 bg-white text-black border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t('problems.editContent')}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow overflow-hidden">
          {/* Problem Description */}
          <div className={cn("bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300", isEditingContent ? "lg:col-span-2" : "")}>
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">{t('problems.description')}</h2>
            </div>
            <div className={cn("flex-grow", isEditingContent ? "overflow-hidden" : "overflow-y-auto")}>
              {isEditingContent ? (
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-1/2 h-full border-b md:border-b-0 md:border-r border-gray-100">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-full p-8 focus:outline-none font-mono text-sm resize-none bg-gray-50/30"
                      placeholder={t('problems.placeholder')}
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
                    {selectedProblem.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Solution Animation Script */}
          <div className={cn("bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full", isEditingContent ? "hidden" : "")}>
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">{t('problems.solutionPath')}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    if (currentStepIndex >= selectedProblem.solutionScript.length - 1) {
                      setCurrentStepIndex(0);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5 text-[#007AFF]" /> : <Play className="w-5 h-5 text-[#007AFF]" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                  }}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {selectedProblem.solutionScript.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  {t('problems.emptyScript')}
                </div>
              ) : (
                selectedProblem.solutionScript.map((step, index) => (
                  <div
                    key={step.stepId}
                    className={cn(
                      "relative p-4 rounded-xl border transition-all duration-300",
                      index === currentStepIndex
                        ? "bg-[#007AFF]/5 border-[#007AFF] shadow-sm scale-[1.02]"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5",
                         index === currentStepIndex ? "bg-[#007AFF] text-white" : "bg-gray-100 text-gray-500"
                      )}>
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={step.description}
                          onChange={(e) => handleUpdateStep(index, e.target.value)}
                          className="w-full bg-transparent border-none focus:outline-none text-sm"
                          placeholder={t('problems.stepPlaceholder')}
                        />
                      </div>
                      <button onClick={() => handleDeleteStep(index)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                ))
              )}
              
              <button
                onClick={handleAddStep}
                className="w-full py-3 flex items-center justify-center text-gray-400 hover:text-[#007AFF] border-2 border-dashed border-gray-200 hover:border-[#007AFF] rounded-xl transition-all"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                {t('problems.addStep')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1F]">{t('problems.title')}</h1>
          <p className="text-gray-500 mt-1">{t('problems.subtitle')}</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-5 py-2.5 bg-[#1D1D1F] text-white rounded-full hover:bg-black transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('problems.newProblem')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => setSelectedProblem(problem)}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#F5F5F7] transition-colors">
                <HelpCircle className="w-6 h-6 text-gray-400 group-hover:text-[#007AFF] transition-colors" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-500">
                {problem.solutionScript.length} {t('problems.steps')}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2 line-clamp-1">{problem.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-3 mb-4">
              {problem.content.replace(/#+\s/g, '').slice(0, 100)}...
            </p>
            <div className="flex items-center text-xs text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(problem.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;
