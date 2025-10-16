
import React from 'react';

interface SeoComparatorProps {
  version1Text: string;
  setVersion1Text: (text: string) => void;
  version2Text: string;
  setVersion2Text: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const SeoComparator: React.FC<SeoComparatorProps> = ({
  version1Text,
  setVersion1Text,
  version2Text,
  setVersion2Text,
  onAnalyze,
  isLoading,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="version1" className="block text-lg font-semibold mb-2 text-slate-700">
            Version 1
          </label>
          <textarea
            id="version1"
            value={version1Text}
            onChange={(e) => setVersion1Text(e.target.value)}
            className="w-full h-96 p-4 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out"
            placeholder="Paste your first version of the content here..."
          />
        </div>
        <div>
          <label htmlFor="version2" className="block text-lg font-semibold mb-2 text-slate-700">
            Version 2
          </label>
          <textarea
            id="version2"
            value={version2Text}
            onChange={(e) => setVersion2Text(e.target.value)}
            className="w-full h-96 p-4 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out"
            placeholder="Paste your second version of the content here..."
          />
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onAnalyze}
          disabled={isLoading || !version1Text || !version2Text}
          className="bg-brand-primary text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Analyzing...' : 'Analyze for SEO'}
        </button>
      </div>
    </div>
  );
};
