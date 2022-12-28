import React, { useState, useEffect } from "react";
import moment from "moment";
import './UsersList.css'; // import the CSS file

const UsersList = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("http://localhost:5004/users");
				const data = await response.json();
				setUsers(data);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>An error occurred: {error.message}</p>;
	}

	const formatDate = (dateStr) => {
		const [year, month, day] = dateStr.split("-");
		let newDate = `${day}-${month}-${year}`;
		return newDate;
	};

	return (
		<>
			<h1>Users List</h1>
			<ul>
				{users.map((user) => (
					<li
						key={user.email}
						className={user.approved ? "verified" : "pending"}
					>
						<span>
							{user.first_name} {user.middle_name} {user.last_name}
						</span>
						<span className="email">{user.email}</span>
						<span>member since: {moment(user.reg_date).format("DD-MM-YYYY")}</span>
					</li>
				))}
			</ul>
		</>
	);
};

export default UsersList;
