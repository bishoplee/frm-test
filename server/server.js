import express from "express";
import cors from "cors";

// only for test purposes
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.status(200).send("<h1>No access granted.</h1>");
});

// Read the file and parse the JSON string into an object
const data = fs.readFileSync("users.json");
const users = JSON.parse(data);

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

app.get('/users', (req, res) => {
	res.send(users);
});

// Route for saving new user document
app.post('/users', (req, res) => {
	const {
		first_name,
		middle_name,
		last_name,
		email,
		phone_number,
		password,
		identifier,
	} = req.body;

	// Push a new value into the users object
	users.push({
		first_name: capitalize(first_name),
		middle_name: capitalize(middle_name),
		last_name: capitalize(last_name),
		phone_number: phone_number,
		email: email,
		password: password,
		identifier: identifier,
		role: "user",
		approved: false,
		reg_date: new Date().toLocaleString()
	});

	try {
		// Convert the object back to a JSON string and write it to the file
		fs.writeFileSync("users.json", JSON.stringify(users));

		console.log("Successfully wrote to file");

		res.status(200).send({
			success: true,
			message: `Hello ${first_name.toUpperCase()},
								Registration successful! Copy this link into the browser to verify your account: 
								http://localhost:5004/verify?email=${email}&code=${identifier}`,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({
			success: false,
			message: error
		});
	}
});

app.get("/verify", (req, res) => {
	const { email, code } = req.query;
	
	const user = users.find(
		(user) => user.email === email
	);
	//res.status(200).send(user);

	if (!user) {
		res.status(500).send({
			success: false,
			message: "User not found."
		});
	}

	if (user && user.identifier !== code) {
		res.status(500).send({
			success: false,
			message: "Invalid verification code.",
		});
	}

	try {
		user.approved = true;
		// update user verification
		fs.writeFileSync("users.json", JSON.stringify(users));
		res.status(200).redirect("http://localhost:5173/users");

	} catch (error) {
		console.error(error);
		res.status(500).send({
			success: false,
			message: error,
		});
	}
});

app.listen(5004, () => {
  console.log('Server listening on port 5004');
});
