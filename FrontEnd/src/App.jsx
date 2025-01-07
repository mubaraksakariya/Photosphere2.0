import { Route, Routes } from 'react-router';
import './App.css';
import Home from './Pages/Home/Home';
import Signup from './Pages/Signup/Signup';
import Signin from './Pages/Login/Signin';
import { ApiProvider } from './Contexts/ApiContext';

function App() {
	return (
		<ApiProvider>
			<Routes>
				<Route path='/*' element={<User />} />
				<Route exact path='/admin/*' element={<Admin />} />
			</Routes>
		</ApiProvider>
	);
}

function User() {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/signup' element={<Signup />} />
			<Route path='/signin' element={<Signin />} />
		</Routes>
	);
}

function Admin() {
	return <div>Admin</div>;
}
export default App;
