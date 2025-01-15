import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const getPosts = async (api, pageNumber = 1) => {
	const { data } = await api.get(`/posts/?page=${pageNumber}`);
	return data;
};

const usePosts = (pageNumber = 1) => {
	const api = useApi();
	return useQuery({
		queryKey: ['posts', pageNumber],
		queryFn: () => getPosts(api, pageNumber),
		keepPreviousData: true,
	});
};

export default usePosts;
