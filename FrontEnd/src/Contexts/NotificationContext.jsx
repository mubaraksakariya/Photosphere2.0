import React, { createContext, useState, useEffect } from 'react';

// Create context
const NotificationContext = createContext();

// Notification provider
export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);

	// Fetch notifications (Simulating API call)
	useEffect(() => {
		const fetchNotifications = async () => {
			// Simulated data (replace with API call)
			const data = [
				{ id: 1, message: 'New message from John Doe', isRead: false },
				{
					id: 2,
					message: 'Your auction bid has been outbid',
					isRead: false,
				},
				{
					id: 3,
					message: 'System update completed successfully',
					isRead: true,
				},
			];
			setNotifications(data);
		};
		fetchNotifications();
	}, []);

	// Mark notification as read
	const markAsRead = (id) => {
		setNotifications((prev) =>
			prev.map((notif) =>
				notif.id === id ? { ...notif, isRead: true } : notif
			)
		);
	};

	// Add a new notification
	const addNotification = (newNotif) => {
		setNotifications((prev) => [{ id: Date.now(), ...newNotif }, ...prev]);
	};

	// Remove a notification
	const removeNotification = (id) => {
		setNotifications((prev) => prev.filter((notif) => notif.id !== id));
	};

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				markAsRead,
				addNotification,
				removeNotification,
			}}>
			{children}
		</NotificationContext.Provider>
	);
};

const useNotifications = () => React.useContext(NotificationContext);
export { useNotifications };
export default NotificationContext;
