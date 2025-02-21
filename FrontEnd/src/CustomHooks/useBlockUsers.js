import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

// Function to fetch blocked users
const fetchBlockedUsers = async (api) => {
	try {
		const res = await api.get('/api/user-blocks/');
		return res.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch blocked users'
		);
	}
};

// Hook to fetch blocked users
export const useBlockedUsers = () => {
	const api = useApi();
	return useQuery({
		queryKey: ['blockedUsers'],
		queryFn: () => fetchBlockedUsers(api),
	});
};

// ------------------------------------------------------------------------

// Function to block a user
const blockUser = async (api, blockedId) => {
	if (!blockedId) throw new Error('Blocked user ID is required.');

	const response = await api.post('/api/user-blocks/', {
		blocked: blockedId,
	});
	return response.data;
};

// Hook to block a user
export const useBlockUser = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (blockedId) => blockUser(api, blockedId),
		onSuccess: () => {
			queryClient.invalidateQueries(['blockedUsers']);
		},
	});
};

// ------------------------------------------------------------------------
// Function to unblock a user
const unblockUserFn = async (api, blockedId) => {
	if (!blockedId) throw new Error('Blocked user ID is required.');

	const response = await api.post('/api/user-blocks/unblock/', {
		blocked_id: blockedId,
	});
	return response.data;
};

// Hook to unblock a user
export const useUnblockUser = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (blockedId) => unblockUserFn(api, blockedId),
		onSuccess: () => {
			queryClient.invalidateQueries(['blockedUsers']);
		},
	});
};

// ------------------------------------------------------------------------

// Hook to check if a user is blocked
export const useIsUserBlocked = (userId) => {
	const { data: blockedUsers, isLoading, error } = useBlockedUsers();

	// Ensure we're checking against the correct structure
	const isBlocked = blockedUsers
		? blockedUsers.some((block) => block.blocked?.id === userId)
		: false;

	return { isBlocked, isLoading, error };
};
