import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const removerFollower = (api, followerId) => {
	return api.post(`api/users/${followerId}/remove-follower/`);
};

export const useRemoveFollowerMutation = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (followerId) => removerFollower(api, followerId),
		onSuccess: () => {
			// Invalidate and refetch followers list
			queryClient.invalidateQueries(['followers']);
			queryClient.invalidateQueries(['followerCount']);
		},
		onError: (error) => {
			console.error('Error removing follower:', error);
		},
	});
};
