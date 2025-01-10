import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isAuthenticated: false,
	user: null,
	token: null,
};

// Helper function to load user data from localStorage
const loadStateFromLocalStorage = () => {
	const storedUser = localStorage.getItem('user');
	const storedToken = localStorage.getItem('token');

	if (storedUser && storedToken) {
		return {
			isAuthenticated: true,
			user: JSON.parse(storedUser),
			token: JSON.parse(storedToken),
		};
	}

	return initialState;
};

// Set the initial state from localStorage (if available)
const persistedState = loadStateFromLocalStorage();

const authSlice = createSlice({
	name: 'auth',
	initialState: persistedState, // Use persisted state from localStorage
	reducers: {
		login: (state, action) => {
			state.isAuthenticated = true;
			state.user = action.payload.user;
			state.token = action.payload.token;

			// Save user data and token to localStorage
			localStorage.setItem('user', JSON.stringify(action.payload.user));
			localStorage.setItem('token', JSON.stringify(action.payload.token));
		},
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
			state.token = null;

			// Remove user data and token from localStorage
			localStorage.removeItem('user');
			localStorage.removeItem('token');
		},
	},
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
