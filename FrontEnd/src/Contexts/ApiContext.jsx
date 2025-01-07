import React, { createContext, useContext } from 'react';
import { createApi } from './Helpers/createApi';

// Create the ApiContext
const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
	const api = createApi();
	return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
	const api = useContext(ApiContext);
	if (!api) {
		throw new Error('useApi must be used within an ApiProvider');
	}
	return api;
};
