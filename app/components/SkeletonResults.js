const WIDTHS = [88, 52, 36, 72, 44];

export default function SkeletonResults() {
  return (
    <div>
      {WIDTHS.map((w, i) => (
        <div
          key={i}
          className="result-card"
          style={{ animationDelay: `${i * 60}ms`, animation: 'fade-up 0.4s ease both' }}
        >
          <div className="result-num" style={{ opacity: 0.08 }}>
            {String(i + 1).padStart(2, '0')}
          </div>
          <div className="result-body">
            <div className="result-card-header">
              <div className="skeleton" style={{ height: 7, width: '26%' }} />
            </div>
            <div className="skeleton" style={{ height: 7, width: `${w}%`, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 7, width: `${Math.max(w - 20, 28)}%`, marginBottom: 8 }} />
            {w > 52 && <div className="skeleton" style={{ height: 7, width: `${w - 30}%` }} />}
          </div>
        </div>
      ))}
    </div>
  );
}
