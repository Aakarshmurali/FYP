import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
            <p className="text-gray-300 mb-4">We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
            {this.state.error && (
              <p className="text-sm text-gray-400">Error: {this.state.error.toString()}</p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;