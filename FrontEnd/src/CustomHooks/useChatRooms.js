import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const GetChatRooms = async (api) => {
	const response = await api.get('api/chat/recent/');
	return response.data;
};

const useChatRooms = () => {
	const api = useApi();
	return useQuery({
		queryKey: ['chatUsers'],
		queryFn: () => GetChatRooms(api),
	});
};

export default useChatRooms;

// import { useInfiniteQuery } from '@tanstack/react-query';
// import { useApi } from '../Contexts/ApiContext';

// const fetchChatUsers = async (
// 	api,
// 	{ pageParam = 'api/chat/recent/?page=1' } // Default path with pagination
// ) => {
// 	const response = await api.get(pageParam);
// 	return response.data; // The data structure includes count, next, previous, and results
// };

// const useChatUsers = () => {
// 	const api = useApi();
// 	return useInfiniteQuery({
// 		queryKey: ['chatUsers'],
// 		queryFn: ({ pageParam = 'api/chat/recent/?page=1' }) =>
// 			fetchChatUsers(api, { pageParam }),

// 		initialPageParam: 'api/chat/recent/?page=1',
// 		getNextPageParam: (lastPage) => {
// 			// Extract the next page URL from the response
// 			const nextPageUrl = lastPage.next;
// 			if (nextPageUrl) {
// 				const url = new URL(nextPageUrl);
// 				return url.pathname + url.search; // Return the path and query string for pagination
// 			}
// 			return undefined; // No more pages to fetch
// 		},
// 	});
// };

// export default useChatUsers;
