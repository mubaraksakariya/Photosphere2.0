import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { requestNewToken } from './axiosHelpers';
import { logout, setToken } from '../../Store/Slices/AuthSlice';

export const createApi = () => {
	const dispatch = useDispatch();
	const accessToken = useSelector((state) => state.auth.token?.access);
	const refreshToken = useSelector((state) => state.auth.token?.refresh);

	const api = axios.create({
		baseURL: import.meta.env.VITE_BASE_URL,
	});

	// Add the Authorization header to each request
	api.interceptors.request.use(
		(config) => {
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	// Handle token refreshing
	api.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (
				error.response?.status === 401 &&
				error.response?.data?.code === 'token_not_valid' &&
				!originalRequest._retry
			) {
				originalRequest._retry = true;

				try {
					if (refreshToken) {
						const newAccessToken = await requestNewToken(
							refreshToken
						);

						// Update the token in Redux and localStorage
						dispatch(
							setToken({
								access: newAccessToken,
								refresh: refreshToken,
							})
						);

						// Retry the failed request with the new access token
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
						return api(originalRequest);
					}
				} catch (err) {
					console.error('Refresh token expired or blacklisted:', err);

					// Logout the user if the refresh token is invalid
					dispatch(logout());
					return Promise.reject(err);
				}
			}

			return Promise.reject(error);
		}
	);

	return api;
};
