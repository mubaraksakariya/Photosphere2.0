import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const GetChatUsers = async (api) => {
	const response = await api.get('api/chat/users');
	return response.data;
};

const useChatUsers = () => {
	const api = useApi();
	return useQuery({
		queryKey: ['chatUsers'],
		queryFn: () => GetChatUsers(api),
	});
};

export default useChatUsers;
