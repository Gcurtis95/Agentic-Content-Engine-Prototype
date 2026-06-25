'use client';
import { useState } from 'react';

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handle} className={`copy-btn${copied ? ' copied' : ''}`}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
