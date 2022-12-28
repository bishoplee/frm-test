import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import './RegistrationForm.css'; // import the CSS file

const initialFormData = {
	first_name: "",
	middle_name: "",
	last_name: "",
	phone_number: "",
	email: "",
	password: "",
	identifier: uuidv4(), // generate a unique identifier using the uuid library
};

const RegistrationForm = () => {
	const [formData, setFormData] = useState(initialFormData);
	const [submitted, setSubmitted] = useState("");
	const [fieldError, setFieldError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [loading, setLoading] = useState(false);

	const validateEmail = (email) => {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

	const validatePassword = (password) => {
		const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
		return re.test(password);
	};

	const validatePhone = (phone_number) => {
		return phone_number.length === 11;
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });

		// clear error message if the input is valid
		if (name === "email" && validateEmail(value)) {
			setEmailError("");
		}
		if (name === "password" && validatePassword(value)) {
			setPasswordError("");
		}
		if (name === "phone_number" && validatePhone(value)) {
			setPhoneError("");
		}
	};

	const handleBlur = (event) => {
		const { name, value } = event.target;
		if (name === "email" && !validateEmail(value)) {
			setEmailError("Please enter a valid email address");
		} else {
			setEmailError("");
		}

		if (name === "password" && !validatePassword(value)) {
			setPasswordError(
				"Password must be at least 8 characters long and contain at least one capital letter and number"
			);
		} else {
			setPasswordError("");
		}
		
		if (name === "phone_number" && !validatePhone(value)) {
			setPhoneError(
				"Phone number must be 11 characters."
			);
		} else {
			setPhoneError("");
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!validateEmail(formData.email) ||
			!validatePassword(formData.password) ||
			formData.first_name.length <= 0 ||
			formData.last_name.length <= 0 ||
			!validatePhone(formData.phone_number)) {
			setFieldError("All fields marked * are required.");
			return;
		} else {
			setFieldError("");
		}

		setLoading(true);

		fetch("http://localhost:5004/users", {
			method: "POST",
			body: JSON.stringify(formData),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				// handle successful submission
				console.log(data);
				setFormData(initialFormData);
				setSubmitted(data.message);
				setFieldError("");
				setLoading(false);
			})
			.catch((error) => {
				// handle error
				console.log(error);
				alert("Unable to process your request. Try again later.");
				setLoading(false);
			});
	};

	return (
		<div className="wrapper">
			{submitted !== ""
				? (<p className="success">
						{submitted}
					</p>)
				: (
					<form className="RegistrationForm" onSubmit={handleSubmit}>
						{fieldError && <p className="error fields">{fieldError}</p>}
						<label>
							* First name:
							<input
								type="text"
								name="first_name"
								value={formData.first_name}
								onChange={handleChange}
							/>
						</label>
						<br />
						<label>
							Middle name:
							<input
								type="text"
								name="middle_name"
								value={formData.middle_name}
								onChange={handleChange}
							/>
						</label>
						<br />
						<label>
							* Last name:
							<input
								type="text"
								name="last_name"
								value={formData.last_name}
								onChange={handleChange}
							/>
						</label>
						<br />
						<label>
							* Phone number:
							<input
								type="tel"
								name="phone_number"
								value={formData.phone_number}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{phoneError && <p className="error">{phoneError}</p>}{" "}
						</label>
						<br />
						<label>
							* Email:
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								onBlur={handleBlur}
								className={emailError && "error"}
							/>
							{emailError && <p className="error">{emailError}</p>}{" "}
						</label>
						<br />
						<label>
							* Password:
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								onBlur={handleBlur}
								className={passwordError && "error"}
							/>
							{passwordError && (
								<p className="error">{passwordError}</p>
							)}{" "}
						</label>
						<br />
						{loading
							? <button type="button" disabled>Processing...</button>
							: <button type="submit">Submit</button>
						}
					</form>
				
				)
			}
		</div>
	);
};

export default RegistrationForm;