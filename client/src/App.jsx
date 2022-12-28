import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import UsersList from "./components/UsersList";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<RegistrationForm />} />
				<Route path="users/*" element={<UsersList />} />
			</Routes>
		</Router>
	);
};

export default App;