import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

export const useBlockedUsers = () => {
	const api = useApi();
	return useQuery({
		queryKey: ['blockedUsers'],
		queryFn: async () => {
			const res = await api.get('/api/user-blocks/');
			return res.data;
		},
	});
};

export const useBlockUser = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (blockedId) => {
			await api.post('/api/user-blocks/', { blocked: blockedId });
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['blockedUsers']);
		},
	});
};

export const useUnblockUser = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (blockedId) => {
			await api.post('/api/user-blocks/unblock/', {
				blocked_id: blockedId,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['blockedUsers']);
		},
	});
};
