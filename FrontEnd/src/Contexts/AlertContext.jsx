import { createContext, useContext, useState, useCallback } from 'react';
import ErrorAlert from '../Components/Alert/ErrorAlert';
import SuccessAlert from '../Components/Alert/SuccessAlert';
import ConfirmBox from '../Components/Alert/ConfirmBox';
import ErrorBox from '../Components/Alert/ErrorBox';
import SuccessBox from '../Components/Alert/SuccessBox';

// Create context for alert management
const AlertContext = createContext();

/**
 * AlertProvider component that manages different types of alerts and modals
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AlertProvider = ({ children }) => {
	// State for different types of alerts
	const [alertData, setAlertData] = useState(null); // For temporary alerts
	const [confirmData, setConfirmData] = useState(null); // For confirmation dialogs
	const [successData, setSuccessData] = useState(null); // For success modals

	/**
	 * Shows a success alert that automatically disappears after 3 seconds
	 * @param {string} message - The success message to display
	 */
	const showSuccessAlert = useCallback((message) => {
		setAlertData({ message, type: 'success' });
		const timer = setTimeout(() => setAlertData(null), 3000);
		return () => clearTimeout(timer);
	}, []);

	/**
	 * Shows an error alert that automatically disappears after 3 seconds
	 * @param {string} message - The error message to display
	 */
	const showErrorAlert = useCallback((message) => {
		setAlertData({ message, type: 'error' });
		const timer = setTimeout(() => setAlertData(null), 3000);
		return () => clearTimeout(timer);
	}, []);

	/**
	 * Shows a success modal with an OK button
	 * @param {string} message - The success message to display
	 * @param {Function} onConfirm - Callback function when OK is clicked
	 */
	const showSuccess = useCallback((message, onConfirm) => {
		setSuccessData({ message, onConfirm });
	}, []);

	/**
	 * Shows a confirmation dialog with OK/Cancel buttons
	 * @param {string} message - The confirmation message
	 * @param {Function} onConfirm - Callback function when OK is clicked
	 * @param {Function} onCancel - Optional callback function when Cancel is clicked
	 */
	const showConfirm = useCallback((message, onConfirm, onCancel = null) => {
		setConfirmData({ message, type: 'confirm', onConfirm, onCancel });
	}, []);

	/**
	 * Shows an error dialog with OK/Cancel buttons
	 * @param {string} message - The error message
	 * @param {Function} onConfirm - Callback function when OK is clicked
	 * @param {Function} onCancel - Optional callback function when Cancel is clicked
	 */
	const showError = useCallback((message, onConfirm, onCancel = null) => {
		setConfirmData({ message, type: 'error', onConfirm, onCancel });
	}, []);

	/**
	 * Handles confirmation action for both confirm and success modals
	 */
	const handleConfirm = useCallback(() => {
		if (confirmData?.onConfirm) confirmData.onConfirm();
		if (successData?.onConfirm) successData.onConfirm();
		setConfirmData(null);
		setSuccessData(null);
	}, [confirmData, successData]);

	/**
	 * Handles cancel action for confirm/error modals
	 */
	const handleCancel = useCallback(() => {
		if (confirmData?.onCancel) confirmData.onCancel();
		setConfirmData(null);
	}, [confirmData]);

	// Context value containing all alert management functions
	const contextValue = {
		showSuccessAlert,
		showErrorAlert,
		showConfirm,
		showError,
		showSuccess,
	};

	return (
		<AlertContext.Provider value={contextValue}>
			{children}

			{/* Temporary alerts */}
			{alertData?.type === 'success' && (
				<SuccessAlert message={alertData.message} />
			)}
			{alertData?.type === 'error' && (
				<ErrorAlert message={alertData.message} />
			)}

			{/* Confirmation/Error dialogs */}
			{confirmData &&
				(confirmData.type === 'confirm' ? (
					<ConfirmBox
						message={confirmData.message}
						onConfirm={handleConfirm}
						onCancel={handleCancel}
					/>
				) : (
					<ErrorBox
						message={confirmData.message}
						onConfirm={handleConfirm}
						onCancel={handleCancel}
					/>
				))}

			{/* Success modal */}
			{successData && (
				<SuccessBox
					message={successData.message}
					onConfirm={handleConfirm}
				/>
			)}
		</AlertContext.Provider>
	);
};

/**
 * Custom hook to use the alert context
 * @returns {Object} Alert context containing all alert management functions
 * @throws {Error} If used outside of AlertProvider
 */
export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error('useAlert must be used within an AlertProvider');
	}
	return context;
};
