import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { registerUnhandledRejectionLogger } from './utils/unhandledRejectionLogger';

registerUnhandledRejectionLogger();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
