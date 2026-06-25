'use client';
import { useState } from 'react';
import ShaderBackground from './ShaderBackground';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import FormPanel from './components/FormPanel';
import ResultsPanel from './components/ResultsPanel';

export default function Home() {
  const [formData, setFormData] = useState({
    brand: '',
    product: '',
    platforms: ['instagram', 'twitter', 'email'],
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setResult(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ShaderBackground />
      <SiteHeader />
      <div className="body-grid" style={{ flex: 1 }}>
        <div className="section-gutter">
          {/* <span className="section-num">01</span> */}
        </div>
        <FormPanel
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
        />
        <ResultsPanel
          result={result}
          loading={loading}
          error={error}
          setError={setError}
          setResult={setResult}
          formData={formData}
        />
      </div>
      <SiteFooter />
    </div>
  );
}
