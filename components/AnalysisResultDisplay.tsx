import React from 'react';
import type { AnalysisResult, KeywordDensity, KeywordStrategyAnalysis, MetaContentAnalysis, ComparisonDetail } from '../types';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

const getWinnerBadgeColor = (winner: 'version1' | 'version2' | 'tie') => {
  switch (winner) {
    case 'version1':
      return 'bg-blue-100 text-blue-800';
    case 'version2':
      return 'bg-green-100 text-green-800';
    case 'tie':
      return 'bg-slate-100 text-slate-800';
  }
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 className="text-xl font-bold text-brand-dark mb-4">{title}</h3>
    {children}
  </div>
);

const ComparisonSection: React.FC<{ title: string; data: ComparisonDetail }> = ({ title, data }) => (
  <Section title={title}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-lg text-blue-700 mb-2">Version 1</h4>
        <p className="text-slate-600 whitespace-pre-wrap">{data.version1}</p>
      </div>
      <div>
        <h4 className="font-semibold text-lg text-green-700 mb-2">Version 2</h4>
        <p className="text-slate-600 whitespace-pre-wrap">{data.version2}</p>
      </div>
    </div>
  </Section>
);

const IntegratedKeywordTable: React.FC<{ data: KeywordStrategyAnalysis }> = ({ data }) => {
  const { qualitativePoints, version1Keywords, version2Keywords } = data;
  const maxDensityRows = Math.max(version1Keywords.length, version2Keywords.length);
  const densityRows = Array.from({ length: maxDensityRows }, (_, i) => ({
    v1Keyword: version1Keywords[i]?.keyword || '-',
    v1Density: version1Keywords[i]?.density || '-',
    v2Keyword: version2Keywords[i]?.keyword || '-',
    v2Density: version2Keywords[i]?.density || '-',
  }));

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                    <th scope="col" className="px-6 py-3">Aspect</th>
                    <th scope="col" colSpan={2} className="px-6 py-3 text-center border-l border-r border-slate-200">Version 1</th>
                    <th scope="col" colSpan={2} className="px-6 py-3 text-center">Version 2</th>
                </tr>
            </thead>
            <tbody>
                {/* Qualitative Analysis Rows */}
                {qualitativePoints.map((point, index) => (
                    <tr key={`qual-${index}`} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-800">{point.point}</td>
                        <td colSpan={2} className="px-6 py-4 border-l border-r border-slate-200">{point.version1}</td>
                        <td colSpan={2} className="px-6 py-4">{point.version2}</td>
                    </tr>
                ))}

                {/* Sub-header for Quantitative Data */}
                <tr className="bg-slate-200">
                    <th scope="col" className="px-6 py-3 text-left text-xs text-slate-700 uppercase">Top Keywords</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs text-slate-700 uppercase border-l border-white">Density</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs text-slate-700 uppercase border-l border-white">Top Keywords</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs text-slate-700 uppercase border-l border-white">Density</th>
                </tr>

                {/* Quantitative Data Rows */}
                {densityRows.map((row, index) => (
                     <tr key={`quant-${index}`} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap border-r border-slate-200">{row.v1Keyword}</td>
                        <td className="px-6 py-4 border-r border-slate-200">{row.v1Density}</td>
                        <td className="px-6 py-4 font-medium text-green-600 whitespace-nowrap border-r border-slate-200">{row.v2Keyword}</td>
                        <td className="px-6 py-4">{row.v2Density}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};


const KeywordStrategySection: React.FC<{ data: KeywordStrategyAnalysis }> = ({ data }) => (
    <Section title="Keyword Strategy Analysis">
      <IntegratedKeywordTable data={data} />
    </Section>
);


const MetaContentSection: React.FC<{ data: MetaContentAnalysis }> = ({ data }) => (
    <Section title="Meta Content Analysis">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-semibold text-lg text-blue-700 mb-2">Version 1</h4>
                <div className="flex items-baseline mb-2">
                    <p className="text-3xl font-bold text-blue-600">{data.scoreVersion1}</p>
                    <p className="text-slate-500 ml-1">/ 100</p>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap">{data.version1}</p>
            </div>
            <div>
                <h4 className="font-semibold text-lg text-green-700 mb-2">Version 2</h4>
                 <div className="flex items-baseline mb-2">
                    <p className="text-3xl font-bold text-green-600">{data.scoreVersion2}</p>
                    <p className="text-slate-500 ml-1">/ 100</p>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap">{data.version2}</p>
            </div>
        </div>
    </Section>
);

const ListSection: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <Section title={title}>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </Section>
);

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Analysis Complete!</h2>
            <p className="text-slate-600 mb-4">Here's the detailed SEO comparison of your content.</p>
            <div className="inline-flex items-center">
                <span className="text-lg font-semibold mr-2">The Winner is:</span>
                <span className={`text-lg font-bold px-4 py-1 rounded-full ${getWinnerBadgeColor(result.winner)}`}>
                    {result.winner === 'tie' ? 'It\'s a Tie' : `Version ${result.winner.slice(-1)}`}
                </span>
            </div>
        </div>

      <Section title="Executive Summary">
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
      </Section>

      <div className="bg-slate-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Detailed Breakdown</h2>
        
        <KeywordStrategySection data={result.detailedAnalysis.keywordStrategy} />
        <MetaContentSection data={result.detailedAnalysis.metaContent} />
        <ComparisonSection title="Readability & Engagement" data={result.detailedAnalysis.readabilityAndEngagement} />
        <ComparisonSection title="Structure & Flow" data={result.detailedAnalysis.structureAndFlow} />
        <ComparisonSection title="Call to Action (CTA)" data={result.detailedAnalysis.callToAction} />

      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListSection title="Actionable Recommendations" items={result.recommendations} />
        <ListSection title="Suggested Keywords" items={result.suggestedKeywords} />
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Competitor Analysis">
              <p className="text-slate-600 whitespace-pre-wrap">{result.competitorAnalysis}</p>
          </Section>
          <Section title="Ranking Prediction">
              <p className="text-slate-600 whitespace-pre-wrap">{result.rankingPrediction}</p>
          </Section>
       </div>
    </div>
  );
};