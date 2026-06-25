'use client';
import { PLATFORMS } from '../constants';

export default function FormPanel({ formData, setFormData, onSubmit, loading }) {
  const togglePlatform = (id) =>
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p) => p !== id)
        : [...prev.platforms, id],
    }));

  return (
    <aside className="form-panel">
      <div className="form-inner">
        <div className="form-heading">
          <h1>
            Generate<br />
            <em>Content</em>
          </h1>
          <p>
            Enter your brand details and select platforms
          </p>
        </div>

        <form onSubmit={onSubmit} className="field-group">
          {[
            { key: 'brand', label: 'Brand' },
            { key: 'product', label: 'Product' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="field-wrap">
              <label className="field-label">{label}</label>
              <input
                className="input-field"
                type="text"
                placeholder={placeholder}
                value={formData[key]}
                onChange={(e) => setFormData((p) => ({ ...p, [key]: e.target.value }))}
                required
              />
            </div>
          ))}

          {/* <div className="platform-wrap">
            <label className="field-label">Channels</label>
            <div className="platform-pills">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`platform-pill${formData.platforms.includes(p.id) ? ' active' : ''}`}
                  onClick={() => togglePlatform(p.id)}
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
          </div> */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || formData.platforms.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Generating…
              </>
            ) : (
              'Generate Content'
            )}
          </button>
        </form>
      </div>

      <div className="form-footer">
        <p>
          {/* Powered by n8n &amp; AI<br />
          Multi-platform content in seconds */}
        </p>
      </div>
    </aside>
  );
}
