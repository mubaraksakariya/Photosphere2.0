import axios from 'axios';
import { useDispatch } from 'react-redux';
import { requestNewToken } from './axiosHelpers';
import { logout } from '../../Store/Slices/AuthSlice';

export const createApi = () => {
	const dispatch = useDispatch();
	const api = axios.create({
		baseURL: import.meta.env.VITE_BASE_URL,
	});

	// Request interceptor to add the access token
	api.interceptors.request.use(
		(config) => {
			const accessToken = localStorage.getItem('accessToken');
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	// Response interceptor to handle token refreshing
	api.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;
			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				try {
					const refreshToken = localStorage.getItem('refreshToken');
					localStorage.removeItem('accessToken');
					if (refreshToken) {
						const newAccessToken = await requestNewToken(
							refreshToken
						);
						localStorage.setItem('accessToken', newAccessToken);
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
						return api(originalRequest);
					}
				} catch (err) {
					console.error('Refresh token expired or blacklisted:', err);
					dispatch(logout());
					localStorage.clear();
					return Promise.reject(err);
				}
			}
			return Promise.reject(error);
		}
	);

	return api;
};
