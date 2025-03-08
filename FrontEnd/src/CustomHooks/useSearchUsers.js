import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchSearchUsers = async (
	api,
	{ searchQuery, pageParam = '/users/?page=1' }
) => {
	const url = new URL(pageParam, window.location.origin);

	// Add the search query as a parameter
	if (searchQuery) {
		url.searchParams.set('search', searchQuery);
	}

	const response = await api.get(url.pathname + url.search);
	return response.data;
};

const useInfiniteSearchUsers = (searchQuery) => {
	const api = useApi();

	return useInfiniteQuery({
		queryKey: ['search-users', searchQuery], // Cache key includes search query
		queryFn: ({ pageParam = 'api/users/?page=1' }) =>
			fetchSearchUsers(api, { searchQuery, pageParam }),

		initialPageParam: 'api/users/?page=1',

		getNextPageParam: (lastPage) => {
			// Extract the next page URL from the API response
			const nextPageUrl = lastPage.next;
			if (nextPageUrl) {
				const url = new URL(nextPageUrl);
				return url.pathname + url.search || undefined;
			}
			return undefined;
		},
		// enabled: !!searchQuery,
	});
};

export default useInfiniteSearchUsers;
