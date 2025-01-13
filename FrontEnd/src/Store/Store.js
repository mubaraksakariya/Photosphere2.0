import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/AuthSlice';
import modalReducer from './Slices/ModalSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		modal: modalReducer,
	},
});

export default store;
