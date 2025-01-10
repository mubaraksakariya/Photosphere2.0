import { Route, Routes } from 'react-router';
import './App.css';
import Home from './Pages/Home/Home';
import Signup from './Pages/Signup/Signup';
import Signin from './Pages/Login/Signin';
import { ApiProvider } from './Contexts/ApiContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VerifyOtp from './Pages/OtpVerification/VerifyOtp';

function App() {
	const queryClient = new QueryClient();
	return (
		<ApiProvider>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path='/*' element={<User />} />
					<Route exact path='/admin/*' element={<Admin />} />
				</Routes>
			</QueryClientProvider>
		</ApiProvider>
	);
}

function User() {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/signup' element={<Signup />} />
			<Route path='/signin' element={<Signin />} />
			<Route path='/verify' element={<VerifyOtp />} />
		</Routes>
	);
}

function Admin() {
	return <div>Admin</div>;
}
export default App;
