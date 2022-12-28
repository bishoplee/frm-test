import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import * as dotenv from "dotenv";
import cors from "cors";
// only for test purposes
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure it with email provider's credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Connect to MongoDB database
mongoose.connect("mongodb://localhost:27017/users", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Create a Mongoose schema for user documents
const userSchema = new mongoose.Schema({
	first_name: String,
	middle_name: String,
	last_name: String,
	phone_number: String,
	email: String,
	password: String,
	identifier: String,
	role: { type: String, default: "User" },
	approved: { type: Boolean, default: false },
});

// Create a Mongoose model for user documents
const User = mongoose.model("User", userSchema);

const sendVerificationEmail = (user) => {
	const verificationCode = user.identifier;
	User.findByIdAndUpdate(user._id, { verificationCode }, (error) => {
		if (error) {
			console.error(error);
		} else {
			const verificationLink = `http://localhost:5173/verify?email=${user.email}&code=${verificationCode}`;
			const mailOptions = {
				from: "your-email@gmail.com",
				to: user.email,
				subject: "Email Verification",
				text: `Click the following link to verify your email: ${verificationLink}`,
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.error(error);
				} else {
					console.log(`Verification email sent: ${info.response}`);
				}
			});
		}
	});
};

// Default route
app.get('/', (req, res) => {
  res.status(200).send("<h1>No access granted.</h1>");
});

app.get('/users', (req, res) => {
	// Read the file and parse the JSON string into an object
	const data = fs.readFileSync("users.json");
	const users = JSON.parse(data);

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

	// Read the file and parse the JSON string into an object
	const data = fs.readFileSync("users.json");
	const users = JSON.parse(data);

	// Push a new value into the users object
	users.push({
		first_name: first_name,
		middle_name: middle_name,
		last_name: last_name,
		phone_number: phone_number,
		email: email,
		password: password,
		identifier: identifier,
		role: "User",
		approved: false,
	});

	try {
		// Convert the object back to a JSON string and write it to the file
		fs.writeFileSync("users.json", JSON.stringify(users));
		console.log("Successfully wrote to file");
	} catch (error) {
		console.error(error);
	}

	// uncomment box below for production
	/* const user = new User({
		first_name,
		middle_name,
		last_name,
		phone_number,
		email,
		password,
		identifier,
	});

  user.save((error) => {
    if (error) {
			res.status(500).send({
				success: false,
				message: error
			});
    } else {
			sendVerificationEmail(user);
			delete user.password;
			res.status(200).send({
				success: true,
				message: `Hello ${user.first_name.toUpperCase()}, Registration successful! Check your email for a verification link.`,
			});
    }
  }); */
});

app.get("/verify", (req, res) => {
	const { email, code } = req.query;

	const emailExists = users.some(
		(user) => user.email === "john.smith@example.com"
	);
	if (!emailExists) {
		res.status(500).send({
			success: false,
			message: "User not found."
		});
	}

	const identifierExists = users.some((user) => user.identifier === "abc123");
	console.log(identifierExists); // Output: true

	// uncomment this block in production
	/* User.findOne({ email }, (error, user) => {
		if (error) {
			res.status(500).send(error);
		} else if (!user) {
			res.status(404).send({ message: "User not found" });
		} else if (user.identifier !== code) {
			res.status(400).send({ message: "Invalid verification code" });
		} else {
			User.findByIdAndUpdate(user._id, { approved: true }, (error) => {
				if (error) {
					res.status(500).send({
						success: false,
						message: error
					});
				} else {
					res.status(200).send({
						success: true,
						message: "Verification successful"
					});
				}
			});
		}
	}); */
});

app.get('/report', (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      res.status(500).send(error);
    } else {
      const report = {
        all: users,
        approved: users.filter(user => user.approved),
        pending: users.filter(user => !user.approved)
      };
      res.send(report);
    }
  });
});

app.listen(5004, () => {
  console.log('Server listening on port 5004');
});
