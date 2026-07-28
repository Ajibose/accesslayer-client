import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initGlobalErrorHandler } from '@/utils/globalErrorHandler.utils';

// Initialize global error handler to prevent duplicate logs with React error boundaries
initGlobalErrorHandler();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
