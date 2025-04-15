import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          maxWidth: '600px', 
          margin: '40px auto',
          backgroundColor: '#2D3748',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#FC8181' }}>Something went wrong</h1>
          <p>The application encountered an error. Please try refreshing the page.</p>
          {this.state.error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: 'rgba(0,0,0,0.2)', 
              borderRadius: '4px',
              marginTop: '16px',
              overflowX: 'auto'
            }}>
              <p><strong>Error:</strong> {this.state.error.toString()}</p>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#4299E1',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              marginTop: '16px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 