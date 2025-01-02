import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Use the existing User model

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist.' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
};

//? Original
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'; // To send Web Token
// import User from '../models/User.js';

// /* ------------------------------ Register User ----------------------------- */
// // req = request body from the frontend
// // res = response that we'll send to the frontend
// export const register = async (req, res) => {
//   try {
//     // Destructuring properties sent by frontend
//     const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

//     // Generate a salt for hashing
//     const salt = await bcrypt.genSalt();
//     // Hash the password with the generated salt
//     const passwordHash = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password: passwordHash,
//       picturePath,
//       friends,
//       location,
//       occupation,
//       viewedProfile: Math.floor(Math.random() * 10000),
//       impressions: Math.floor(Math.random() * 10000),
//     });

//     const savedUser = await newUser.save();
//     // Send newly created user details to the frontend with status 201
//     res.status(201).json(savedUser);
//   } catch (err) {
//     // Send error returned by database
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ------------------------------- Logging in ------------------------------- */
// // Define an asynchronous login function to handle user authentication
// export const login = async (req, res) => {
//   try {
//     // Extract email and password from request body
//     const { email, password } = req.body;

//     // Attempt to find a user by email
//     const user = await User.findOne({ email: email });
//     // If no user is found, return a 400 status with an error message
//     if (!user) return res.status(400).json({ msg: 'User does not exist.' });

//     // Compare submitted password with stored password
//     const isMatch = await bcrypt.compare(password, user.password);
//     // If the passwords do not match, return a 400 status with an error message
//     if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

//     // Generate a token using the user's ID and the JWT secret
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     // Remove password from user object before sending it to the client
//     delete user.password;

//     // Return the user data and token with a 200 status
//     res.status(200).json({ token, user });
//   } catch (err) {
//     // Handle errors and return a 500 status with the error message
//     res.status(500).json({ error: err.message });
//   }
// };
