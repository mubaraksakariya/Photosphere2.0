import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/AuthSlice';
import modalReducer from './Slices/ModalSlice';
import chatReducer from './Slices/ChatSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		modal: modalReducer,
		chat: chatReducer,
	},
});

export default store;
