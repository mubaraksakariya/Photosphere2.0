import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchUserPosts = async (
	api,
	{ userId, pageParam = '/posts/?page=1' }
) => {
	// Append the userId query parameter to the pageParam URL
	const url = new URL(pageParam, window.location.origin);
	if (userId) {
		url.searchParams.set('user_id', userId);
	}
	const response = await api.get(url.pathname + url.search);
	return response.data;
};

const useUserPosts = (userId) => {
	const api = useApi();

	return useInfiniteQuery({
		queryKey: ['user-posts', userId], // Include userId in the query key for caching
		queryFn: ({ pageParam = 'api/posts/?page=1' }) =>
			fetchUserPosts(api, { userId, pageParam }),

		initialPageParam: 'api/posts/?page=1',

		getNextPageParam: (lastPage) => {
			// Extract only the part after the base URL (i.e., the path and query)
			const nextPageUrl = lastPage.next;
			if (nextPageUrl) {
				const url = new URL(nextPageUrl);
				return url.pathname + url.search || undefined;
			}
			return undefined;
		},
		enabled: !!userId, // Only fetch if userId is provided
	});
};

export default useUserPosts;
