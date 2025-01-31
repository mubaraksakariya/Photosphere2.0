import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	currentChat: null,
	isGroup: false,
	messages: [],
};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		selectChat: (state, action) => {
			state.currentChat = action.payload;
			state.isGroup = action.payload.is_group;
			state.messages = []; // Clear messages when a new chat is selected
		},
		clearChat: (state) => {
			state.currentChat = null;
			state.messages = [];
		},
		setMessages: (state, action) => {
			state.messages = [...state.messages, action.payload];
		},
	},
});

export const { selectChat, clearChat, setMessages } = chatSlice.actions;

export default chatSlice.reducer;
