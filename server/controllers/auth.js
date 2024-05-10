import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // To send Web Token
import User from '../models/User.js';

/* ------------------------------ Register User ----------------------------- */
// req = request body from the frontend
// res = response that we'll send to the frontend
export const register = async (req, res) => {
  try {
    // Destructuring properties sent by frontend
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

    // Generate a salt for hashing
    const salt = await bcrypt.genSalt();
    // Hash the password with the generated salt
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    // Send newly created user details to the frontend with status 201
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
