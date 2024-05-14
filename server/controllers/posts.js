import Post from '../models/Post.js';
import User from '../models/User.js';

//? Asynchronous function to create a new post
export const createPost = async (req, res) => {
  try {
    // Extract relevant data from the request body
    const { userId, description, picturePath } = req.body;

    // Retrieve the user who is creating the post
    const user = await User.findById(userId);

    // Create a new post using the user's data and the provided info
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    // Save the new post to the database
    await newPost.save();

    // Retrieve and return all posts (could be limited or paginated)
    const post = await Post.find();
    res.status(201).json(post); // Send the new post data with a 201 Created status
  } catch (err) {
    // If there's an issue creating the post, send a 409 Conflict error
    res.status(409).json({ message: err.message });
  }
};

//? Asynchronous function to fetch all posts for the feed
export const getFeedPosts = async (req, res) => {
  try {
    // Retrieve all posts from the database
    const post = await Post.find();
    // Send the retrieved posts back to the client with a 200 OK status
    res.status(200).json(post);
  } catch (err) {
    // If an error occurs, return a 404 Not Found status with the error message
    res.status(404).json({ message: err.message });
  }
};

//? Asynchronous function to fetch all posts by a specific user
export const getUserPosts = async (req, res) => {
  try {
    // Extract the user ID from request parameters
    const { userId } = req.params;
    // Retrieve posts from the database where the userId matches the provided ID
    const post = await Post.find({ userId });
    // Send the retrieved posts back to the client with a 200 OK status
    res.status(200).json(post);
  } catch (err) {
    // If an error occurs, return a 404 Not Found status with the error message
    res.status(404).json({ message: err.message });
  }
};

//? Asynchronous function to like or unlike a post
export const likePost = async (req, res) => {
  try {
    // Extract post ID and user ID from request parameters and body
    const { id } = req.params;
    const { userId } = req.body;

    // Retrieve the post by its ID from the database
    const post = await Post.findById(id);
    // Check if the current user has already liked the post
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      // If the post is already liked by the user, remove the like
      post.likes.delete(userId);
    } else {
      // If the post is not liked, add a like from the user
      post.likes.set(userId, true);
    }

    // Save the updated likes information in the database
    const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });

    // Return the updated post data with a 200 OK status
    res.status(200).json(updatedPost);
  } catch (err) {
    // If an error occurs, return a 404 Not Found status with the error message
    res.status(404).json({ message: err.message });
  }
};
