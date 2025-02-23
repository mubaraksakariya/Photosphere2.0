import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchNotifications = async (
	api,
	{ pageParam = 'api/notifications/?page=1' }
) => {
	const response = await api.get(pageParam);
	return response.data;
};

const useAllNotifications = () => {
	const api = useApi();
	return useInfiniteQuery({
		queryKey: ['notifications'],
		queryFn: ({ pageParam = 'api/notifications/?page=1' }) =>
			fetchNotifications(api, { pageParam }),
		initialPageParam: 'api/notifications/?page=1',
		getNextPageParam: (lastPage) => {
			// Extract next page URL path (removing the base URL)
			if (lastPage.next) {
				const url = new URL(lastPage.next);
				return url.pathname + url.search;
			}
			return undefined;
		},
	});
};

export default useAllNotifications;
