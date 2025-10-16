
import React, { useState, useCallback } from 'react';
import { SeoComparator } from './components/SeoComparator';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { analyzeSeoContent } from './services/geminiService';
import type { AnalysisResult } from './types';
import { VERSION_1_TEXT, VERSION_2_TEXT } from './constants';

const App: React.FC = () => {
  const [version1Text, setVersion1Text] = useState<string>(VERSION_1_TEXT);
  const [version2Text, setVersion2Text] = useState<string>(VERSION_2_TEXT);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSeoContent(version1Text, version2Text);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [version1Text, version2Text]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-brand-dark">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary">
            SEO Content Analyzer
          </h1>
          <p className="text-sm text-slate-500 hidden sm:block">Powered by Gemini AI</p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <SeoComparator
            version1Text={version1Text}
            setVersion1Text={setVersion1Text}
            version2Text={version2Text}
            setVersion2Text={setVersion2Text}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {analysisResult && <AnalysisResultDisplay result={analysisResult} />}
        </div>
      </main>
      <footer className="text-center py-4 mt-8">
        <p className="text-slate-500 text-sm">Built by a world-class senior frontend React engineer.</p>
      </footer>
    </div>
  );
};

export default App;
