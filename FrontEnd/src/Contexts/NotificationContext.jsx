import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useApi } from '../Contexts/ApiContext';
import useRecentNotifications from '../CustomHooks/useRecentNotifications';
import useWebSocket from '../CustomHooks/useWebSocket';
import { useMarkNotificationsAsRead } from '../CustomHooks/useMarkNotificationsAsRead';

// Create context
const NotificationContext = createContext();

// Notification provider
export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);

	const api = useApi();

	// Fetch notifications from API
	const { data, isLoading, error, refetch } = useRecentNotifications();
	// mark notifiactions as read
	const { mutate: markAsReadUpdate } = useMarkNotificationsAsRead();

	useEffect(() => {
		if (data) {
			setNotifications(data);
		}
	}, [data]);
	useEffect(() => {
		countUnreadMessages(notifications);
	}, [notifications]);
	// Function to count unread messages
	const countUnreadMessages = (notifications) => {
		const count = notifications.filter(
			(notification) => !notification.is_read
		).length;
		setUnreadCount(count);
	};

	// WebSocket Handlers
	const handleWebSocketMessage = useCallback((event) => {
		try {
			const newNotification = JSON.parse(event.data);
			setNotifications((prev) => {
				const updatedNotifications = [newNotification, ...prev];
				countUnreadMessages(updatedNotifications);
				return updatedNotifications;
			}); // Prepend new notification
		} catch (err) {
			console.error('Error parsing WebSocket notification:', err);
		}
	}, []);

	const handleWebSocketOpen = useCallback(() => {
		console.log('Notification WebSocket Connected');
	}, []);

	const handleWebSocketClose = useCallback(() => {
		console.log('Notification WebSocket Disconnected, retrying...');
	}, []);

	const handleWebSocketError = useCallback((error) => {
		console.error('Notification WebSocket Error:', error);
	}, []);

	// WebSocket setup
	const { isConnected, sendMessage, reconnect } = useWebSocket(
		'notifications',
		`notifications`,
		handleWebSocketMessage,
		handleWebSocketOpen,
		handleWebSocketClose,
		handleWebSocketError
	);

	// Mark notification as read (only first 10)
	const markAsRead = async () => {
		setNotifications((prev) => {
			const updatedNotifications = prev.map((notif) => ({
				...notif,
				is_read: true,
			}));
			// setUnreadCount(0);
			return updatedNotifications;
		});

		markAsReadUpdate();
	};

	// Remove a notification
	const removeNotification = (id) => {
		setNotifications((prev) => prev.filter((notif) => notif.id !== id));
	};

	const addNotification = (notification) => {
		setNotifications((prev) => [notification, ...prev]);
	};
	return (
		<NotificationContext.Provider
			value={{
				notifications,
				isLoading,
				error,
				isConnected,
				unreadCount,
				markAsRead,
				removeNotification,
				refetch,
				reconnect,
				addNotification,
			}}>
			{children}
		</NotificationContext.Provider>
	);
};

// Hook for consuming notifications
const useNotifications = () => React.useContext(NotificationContext);

export { useNotifications };
export default NotificationContext;
