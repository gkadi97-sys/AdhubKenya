import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkLoadError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkLoadError = error?.name === 'TypeError' && (
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('importing a module')
    );
    return { hasError: true, error, isChunkLoadError };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Automatically reload the page once if a dynamic import fails (e.g., after a new deployment changes chunk hashes)
    if (this.state.isChunkLoadError) {
      const hasReloaded = sessionStorage.getItem('vite_chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('vite_chunk_reload', 'true');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We apologize for the inconvenience. An unexpected error has occurred in the application.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-left bg-muted p-4 rounded-xl text-xs overflow-auto max-w-2xl mb-6 w-full">
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 gradient-emerald px-6 py-3 rounded-xl text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
