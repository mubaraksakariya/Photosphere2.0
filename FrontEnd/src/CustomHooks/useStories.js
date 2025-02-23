import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchStories = async (api, { pageParam = '/stories/?page=1' }) => {
	const response = await api.get(pageParam);
	return response.data; // The data structure includes count, next, previous, and results
};

const useStories = () => {
	const api = useApi();
	return useInfiniteQuery({
		queryKey: ['stories'],
		queryFn: ({ pageParam = 'api/stories/?page=1' }) =>
			fetchStories(api, { pageParam }),

		initialPageParam: 'api/stories/?page=1',
		getNextPageParam: (lastPage) => {
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

export default useStories;
