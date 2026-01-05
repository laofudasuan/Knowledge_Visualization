import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Mock login
    setIsLoggedIn(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1D1D1F]">
          {t('home.title').split(' ')[0]} <br />
          <span className="text-[#007AFF]">{t('home.title').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed">
          {t('home.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 w-full max-w-5xl">
        {[
          { title: t('home.features.graph.title'), desc: t('home.features.graph.desc') },
          { title: t('home.features.articles.title'), desc: t('home.features.articles.desc') },
          { title: t('home.features.problems.title'), desc: t('home.features.problems.desc') },
        ].map((feature, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
