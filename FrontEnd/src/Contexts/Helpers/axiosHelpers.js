import axios from 'axios';

export const requestNewToken = async (refreshToken) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_BASE_URL}api/token/refresh/`,
			{
				refresh: refreshToken,
			}
		);
		return response.data.access;
	} catch (error) {
		throw new Error('Failed to refresh token');
	}
};
