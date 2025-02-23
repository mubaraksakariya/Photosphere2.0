import { Navigate, Route, Routes, useNavigate } from 'react-router';
import './App.css';
import Home from './Pages/Home/Home';
import Signup from './Pages/Signup/Signup';
import Signin from './Pages/Login/Signin';
import { ApiProvider } from './Contexts/ApiContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VerifyOtp from './Pages/OtpVerification/VerifyOtp';
import { useSelector } from 'react-redux';
import { ModalProvider } from './Contexts/ModalProvider';
import Profile from './Pages/Profile/Profile';
import ChatMainPage from './Pages/Chat/ChatMainPage';
import { ChatProvider } from './Contexts/ChatContext';
import { ChatSocketProvider } from './Contexts/ChatSocketContext';
import { NotificationProvider } from './Contexts/NotificationContext';
import NotificationsFullPage from './Pages/Notifications/NotificationsFullPage';
import { SettingsProvider } from './Contexts/SettingsContext';
import { AlertProvider } from './Contexts/AlertContext';
import Settings from './Pages/Settings/Settings';
import PasswordReset from './Pages/PasswordReset/PasswordReset';
import PasswordRecovery from './Pages/PasswordRecovery/PasswordRecovery';

function PublicRoute({ children }) {
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	return isAuthenticated ? <Navigate to='/' replace /> : children;
}
function PrivateRoute({ children }) {
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

	return !isAuthenticated ? (
		<Navigate to='/signin' replace />
	) : (
		<SettingsProvider>
			<NotificationProvider>
				<ChatProvider>
					<ChatSocketProvider>{children}</ChatSocketProvider>
				</ChatProvider>
			</NotificationProvider>
		</SettingsProvider>
	);
}

function App() {
	const queryClient = new QueryClient();
	return (
		<AlertProvider>
			<ApiProvider>
				<QueryClientProvider client={queryClient}>
					<ModalProvider>
						<Routes>
							<Route path='/*' element={<User />} />
							<Route exact path='/admin/*' element={<Admin />} />
							<Route
								path='/password-reset-request'
								element={<PasswordRecovery />}
							/>
							<Route
								path='/password-reset'
								element={<PasswordReset />}
							/>
						</Routes>
					</ModalProvider>
				</QueryClientProvider>
			</ApiProvider>
		</AlertProvider>
	);
}

function User() {
	return (
		<Routes>
			<Route
				path='/'
				element={
					<PrivateRoute>
						<Home />
					</PrivateRoute>
				}
			/>
			<Route
				path='/signup'
				element={
					<PublicRoute>
						<Signup />
					</PublicRoute>
				}
			/>
			<Route
				path='/signin'
				element={
					<PublicRoute>
						<Signin />
					</PublicRoute>
				}
			/>
			<Route
				path='/verify'
				element={
					<PublicRoute>
						<VerifyOtp />
					</PublicRoute>
				}
			/>
			<Route
				path='/profile/'
				element={
					<PrivateRoute>
						<Profile />
					</PrivateRoute>
				}
			/>
			<Route
				path='/profile/:user_id'
				element={
					<PrivateRoute>
						<Profile />
					</PrivateRoute>
				}
			/>

			<Route
				path='/profile/:user_id/:tab'
				element={
					<PrivateRoute>
						<Profile />
					</PrivateRoute>
				}
			/>
			<Route
				path='/chat'
				element={
					<PrivateRoute>
						<ChatMainPage />
					</PrivateRoute>
				}
			/>
			<Route
				path='/notifications'
				element={
					<PrivateRoute>
						<NotificationsFullPage />
					</PrivateRoute>
				}
			/>
			<Route
				path='/settings/*'
				element={
					<PrivateRoute>
						<Settings />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

function Admin() {
	return <div>Admin</div>;
}
export default App;
