function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function IntelValue({ value, depth = 0 }) {
  if (Array.isArray(value)) {
    return (
      <div className="intel-tags">
        {value.map((item, i) =>
          typeof item === 'object' && item !== null ? (
            <div key={i} className="intel-nested">
              <IntelSection data={item} depth={depth + 1} />
            </div>
          ) : (
            <span key={i} className="intel-tag">{String(item)}</span>
          )
        )}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return <IntelSection data={value} depth={depth + 1} />;
  }

  return <p className="intel-text">{String(value)}</p>;
}

function IntelSection({ data, depth = 0 }) {
  return (
    <div className={depth > 0 ? 'intel-nested' : undefined}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className={depth > 0 ? 'intel-sub-section' : 'intel-section'}>
          <div className={depth > 0 ? 'intel-sub-label' : 'intel-label'}>{formatLabel(key)}</div>
          <IntelValue value={value} depth={depth} />
        </div>
      ))}
    </div>
  );
}

export default function BrandIntelPanel({ intel }) {
  if (!intel) return null;
  return (
    <div className="brand-intel">
      <IntelSection data={intel} />
    </div>
  );
}
