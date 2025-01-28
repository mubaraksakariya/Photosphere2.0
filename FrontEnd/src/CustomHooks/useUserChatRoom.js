import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const getOrCreateChatRoom = async (api, user_id) => {
	// API call to fetch or create a chat room
	const response = await api.post(`api/chat/get-or-create-room/${user_id}/`);
	return response.data;
};

const useUserChatRoom = (user_id) => {
	const api = useApi();

	return useMutation({
		mutationKey: ['chatRoom', user_id],
		mutationFn: () => getOrCreateChatRoom(api, user_id),
	});
};

export default useUserChatRoom;
