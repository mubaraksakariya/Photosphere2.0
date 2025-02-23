import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchUserSettings = async (api, userId) => {
	const response = await api.get(`/api/user-settings/${userId}`);
	return response.data;
};

const updateUserSettings = async (api, userId, settings) => {
	const response = await api.put(`/api/user-settings/${userId}/`, settings);
	return response.data;
};

export const useUserSettings = (userId) => {
	const api = useApi();
	return useQuery({
		queryKey: ['userSettings', userId],
		queryFn: () => fetchUserSettings(api, userId),
		enabled: !!userId,
	});
};

export const useUpdateUserSettings = (userId) => {
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (settings) => updateUserSettings(api, userId, settings),
		onSuccess: () => {
			queryClient.invalidateQueries(['userSettings', userId]);
		},
	});
};
