import React from 'react';

// Without this, an uncaught render error anywhere in the tree unmounts the
// whole app silently (React's default in production builds) - which is
// exactly the kind of bug that's impossible to diagnose from a screenshot
// alone ("half the page is just... gone"). This surfaces it as a visible,
// specific error instead.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <div
            style={{
              maxWidth: 640,
              margin: '40px auto',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 12,
              padding: 20,
              color: '#991b1b',
            }}
          >
            <strong>Terjadi kesalahan saat menampilkan halaman ini.</strong>
            <div style={{ marginTop: 8, fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {String(this.state.error?.message || this.state.error)}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 14, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#991b1b', color: '#fff', cursor: 'pointer' }}
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
