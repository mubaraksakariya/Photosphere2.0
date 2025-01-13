import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './Styles/global.css'; // Import the global styles

import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import store from './Store/Store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<GoogleOAuthProvider
			clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
			<Provider store={store}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>
		</GoogleOAuthProvider>
	</StrictMode>
);
