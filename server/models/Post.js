import mongoose from 'mongoose';

//? Define the schema for a 'Post' in the database
const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true, // This field is mandatory; every post must be associated with a user
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map, // Uses a Map to store user IDs as keys and boolean values to track likes
      of: Boolean, // Each entry in the Map indicates whether a user likes the post
    },
    comments: {
      type: Array, // Array to store comments, if any
      default: [], // Default to an empty array if no comments are present
    },
  },
  { timestamps: true } // Automatically add 'createdAt' and 'updatedAt' timestamps to each document
);

// Create a Mongoose model for 'Post' based on the defined schema
const Post = mongoose.model('Post', postSchema);

export default Post;
