import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import CreatePostModal from '../Components/Posts/CreatePost/CreatePostModal';
import CreateStoryModal from '../Components/Story/CreateStory/CreateStoryModal';
import ViewStoryModal from '../Components/Story/ViewStory/ViewStoryModal';
import SharePostModal from '../Components/Models/SharePostModal';

// Create a ModalContext
const ModalContext = createContext();

// ModalProvider Component
export const ModalProvider = ({ children }) => {
	// Destructure modal states from Redux
	const {
		isCreatePostModalOpen,
		isCreateStoryModalOpen,
		isViewStoryModalOpen,
		isSharePostModalOpen,
		sharedPost,
	} = useSelector((state) => state.modal);

	// Render modal components conditionally based on their open state
	return (
		<ModalContext.Provider value={{}}>
			{children}
			{isCreatePostModalOpen && <CreatePostModal />}
			{isCreateStoryModalOpen && <CreateStoryModal />}
			{isViewStoryModalOpen && <ViewStoryModal />}
			{isSharePostModalOpen && <SharePostModal sharedPost={sharedPost} />}
		</ModalContext.Provider>
	);
};

// Custom hook to use the ModalContext
export const useModal = () => useContext(ModalContext);
