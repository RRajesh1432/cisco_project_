import React, { useState } from 'react';
import Header from './components/Header.tsx';
import PredictionPage from './pages/PredictionPage.tsx';
import CropExplorerPage from './pages/CropExplorerPage.tsx';
import HistoryPage from './pages/HistoryPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import AnalyticsPage from './pages/AnalyticsPage.tsx';

export type Page = 'predict' | 'explorer' | 'history' | 'about' | 'analytics';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('predict');

  const renderPage = () => {
    switch (currentPage) {
      case 'predict':
        return <PredictionPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'explorer':
        return <CropExplorerPage />;
      case 'history':
        return <HistoryPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <PredictionPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;