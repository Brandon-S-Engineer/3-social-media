import User from '../models/User.js';

//? Asynchronous function to retrieve a user by their ID from the database
export const getUser = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const { id } = req.params;

    // Retrieve the user from the database by their ID
    const user = await User.findById(id);

    // If user is found, send user data with a 200 OK status
    res.status(200).json(user);
  } catch (err) {
    // If an error occurs (e.g., user not found), send a 404 Not Found status with the error message
    res.status(404).json({ message: err.message });
  }
};

//? Asynchronous function to retrieve and format a user's friends list
export const getUserFriends = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const { id } = req.params;

    // Retrieve the user from the database by their ID
    const user = await User.findById(id);

    // Fetch each friend's details using their IDs stored in 'user.friends'
    const friends = await Promise.all(user.friends.map((friendId) => User.findById(friendId)));

    // Format friend data to include only specific fields
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    // Send the formatted friends list as a JSON response with a 200 OK status
    res.status(200).json(formattedFriends);
  } catch (err) {
    // If an error occurs, send a 404 Not Found status with the error message
    res.status(404).json({ message: err.message });
  }
};

//? Asynchronous function to add or remove a friend of an user
export const addRemoveFriend = async (req, res) => {
  try {
    // Extract user and friend IDs from request parameters
    const { id, friendId } = req.params;

    // Retrieve user and friend from the database by their IDs
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // Check if the friend ID is already in the user's friend list
    if (user.friends.includes(friendId)) {
      // Remove friend ID from both the user's and friend's friend lists
      user.friends = user.friends.filter((fId) => fId !== friendId);
      friend.friends = friend.friends.filter((fId) => fId !== id);
    } else {
      // Add friend ID to both the user's and friend's friend lists
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    // Save changes to both user and friend documents
    await user.save();
    await friend.save();

    // Fetch and format the updated list of user's friends
    const friends = await Promise.all(user.friends.map((fId) => User.findById(fId)));
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    // Send the formatted list of friends as a JSON response with a 200 OK status
    res.status(200).json(formattedFriends);
  } catch (err) {
    // If an error occurs, send a 404 Not Found status with the error message
    res.status(404).json({ message: err.message });
  }
};
