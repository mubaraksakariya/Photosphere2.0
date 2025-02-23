import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchPosts = async (
	api,
	{
		pageParam = '/posts/?page=1', // Default path without the base URL
	}
) => {
	const response = await api.get(pageParam);
	return response.data; // The data structure includes count, next, previous, and results
};

const usePosts = () => {
	const api = useApi();
	return useInfiniteQuery({
		queryKey: ['posts'],
		queryFn: ({ pageParam = 'api/posts/?page=1' }) =>
			fetchPosts(api, { pageParam }),

		initialPageParam: 'api/posts/?page=1',
		getNextPageParam: (lastPage, allPages) => {
			// Extract only the part after the base URL (i.e., the path and query)
			const nextPageUrl = lastPage.next;
			if (nextPageUrl) {
				const url = new URL(nextPageUrl);
				const nextPagePath = url.pathname + url.search;
				return nextPagePath || undefined;
			}
			return undefined;
		},
	});
};

export default usePosts;
