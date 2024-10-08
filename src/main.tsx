import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './hooks/useAuth'
import ErrorBoundary from './components/ErrorBoundary'

// Add these lines at the top of the file
window.global ||= window;
window.process ||= { env: {} };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)