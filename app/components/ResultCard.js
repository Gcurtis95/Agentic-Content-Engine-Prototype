'use client';
import { useState } from 'react';
import CopyButton from './CopyButton';

export default function ResultCard({ field, value, delay, index }) {
  const [imgError, setImgError] = useState(false);
  const num = String(index).padStart(2, '0');

  return (
    <div
      className="result-card"
      style={{ '--card-accent': field.color, animationDelay: `${delay}ms` }}
    >
      <div className="result-num">{num}</div>
      <div className="result-body">
        <div className="result-card-header">
          <div className="result-label">
            {field.label}
          </div>
          {field.isImage ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="open-link">
              Open full size
            </a>
          ) : (
            <CopyButton text={value} />
          )}
        </div>

        {field.isImage ? (
          imgError ? (
            <p className="result-content" style={{ color: 'var(--color-muted)', fontSize: '0.82rem' }}>
              Could not load image.{' '}
              <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: field.color }}>
                Open directly
              </a>
            </p>
          ) : (
            <div className="result-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="AI generated visual" onError={() => setImgError(true)} />
            </div>
          )
        ) : (
          <p className={`result-content${field.mono ? ' is-mono' : ''}`}>{value}</p>
        )}
      </div>
    </div>
  );
}
