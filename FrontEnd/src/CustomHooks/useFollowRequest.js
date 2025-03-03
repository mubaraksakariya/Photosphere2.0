import { useApi } from '../Contexts/ApiContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const acceptFollowRequest = async (api, requestId) => {
	const { data } = await api.post(
		`/api/follow-requests/${requestId}/accept/`
	);
	return data;
};

const rejectFollowRequest = async (api, requestId) => {
	const { data } = await api.post(
		`/api/follow-requests/${requestId}/reject/`
	);
	return data;
};

// Accept Follow Request Hook
export const useAcceptFollowRequest = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (requestId) => acceptFollowRequest(api, requestId),
		onSuccess: () => {
			console.log('Follow request accepted');
			// Invalidate user-related queries to refresh data
			queryClient.invalidateQueries(['follow-requests']);
			queryClient.invalidateQueries(['followers']);
		},
		onError: (error) => {
			console.error(
				'Error accepting follow request:',
				error.response?.data?.detail || error
			);
		},
	});
};

// Reject Follow Request Hook
export const useRejectFollowRequest = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (requestId) => rejectFollowRequest(api, requestId),
		onSuccess: () => {
			console.log('Follow request rejected');
			// Invalidate follow requests to remove the rejected one
			queryClient.invalidateQueries(['follow-requests']);
		},
		onError: (error) => {
			console.error(
				'Error rejecting follow request:',
				error.response?.data?.detail || error
			);
		},
	});
};
