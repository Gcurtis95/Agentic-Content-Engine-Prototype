'use client';
import { useState } from 'react';
import { RESULT_FIELDS } from '../constants';
import ResultCard from './ResultCard';
import SkeletonResults from './SkeletonResults';
import BrandIntelPanel from './BrandIntelPanel';

export default function ResultsPanel({ result, loading, error, setError, setResult, formData }) {
  const [activeTab, setActiveTab] = useState('campaign');

  const intel = result
    ? Object.entries(result).find(([k]) => k.trim().toLowerCase() === 'brand intelligence')?.[1]
    : null;

  const visibleResults = result
    ? RESULT_FIELDS.flatMap((field) => {
        const needle = field.key.trim().toLowerCase();
        const key = Object.keys(result).find((k) => k.trim().toLowerCase() === needle);
        return key ? [{ field, value: result[key] }] : [];
      })
    : [];

  return (
    <main className="results-panel">
      {!result && !loading && !error && (
        <div className="empty-state">
          <p className="empty-title">
            Awaiting<br />your brief
          </p>
          <div className="empty-rule" />
          <p className="empty-sub">
            Fill in brand details on the left<br />and click Generate Content
          </p>
        </div>
      )}

      {loading && (
        <div>
          <div className="results-header">
            <span className="results-title">Generating campaign…</span>
            <span className="results-meta" style={{ color: 'var(--color-accent)' }} />
          </div>
          <SkeletonResults />
        </div>
      )}

      {error && (
        <div className="error-card">
          <p className="error-title">Something went wrong</p>
          <p className="error-msg">{error}</p>
          <p className="error-retry">Please try again.</p>
          <button className="dismiss-btn" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {result && (
        <div>
          <div className="results-header">
            <span className="results-title">
              {result['Brand '] || result.Brand || formData.brand}
              {' — '}
              {result['Product '] || result.Product || formData.product}
            </span>
            <span className="results-meta">Ready</span>
          </div>

          <div className="tab-bar">
            <button
              className={`tab-btn${activeTab === 'campaign' ? ' active' : ''}`}
              onClick={() => setActiveTab('campaign')}
            >
              Campaign
            </button>
            {intel && (
              <button
                className={`tab-btn${activeTab === 'intel' ? ' active' : ''}`}
                onClick={() => setActiveTab('intel')}
              >
                Brand Intelligence
              </button>
            )}
          </div>

          {activeTab === 'campaign' && (
            <div>
              {visibleResults.map(({ field, value }, index) => (
                <ResultCard
                  key={field.key}
                  field={field}
                  value={value}
                  delay={index * 80}
                  index={index + 1}
                />
              ))}
            </div>
          )}

          {activeTab === 'intel' && <BrandIntelPanel intel={intel} />}

          <div style={{ paddingTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="clear-btn" onClick={() => { setResult(null); setActiveTab('campaign'); }}>
              Clear output
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
