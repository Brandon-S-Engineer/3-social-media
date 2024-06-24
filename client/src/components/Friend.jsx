// Icons for adding and removing a person (friend)
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';

// UI components: Box for layout, IconButton for clickable icons, Typography for text, and useTheme for theming
import { Box, IconButton, Typography, useTheme } from '@mui/material';

// Redux hooks for dispatching actions and accessing state
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom'; // Hook for navigation between routes

// Action to update friends state in the Redux store
import { setFriends } from 'state';

import FlexBetween from './FlexBetween';

// Custom component to display user images
import UserImage from './UserImage';

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store`
  const navigate = useNavigate(); // Hook for navigation between routes

  // Extracting from the Redux state
  const { _id } = useSelector((state) => state.user); // Current user's ID
  const token = useSelector((state) => state.token); // Token
  const friends = useSelector((state) => state.user.friends); // List of friends

  // Accessing the theme object to use its color palette
  const { palette } = useTheme();
  // Defining specific colors from the theme palette for styling
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // Check if the given friendId exists in the current user's friends list
  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {};

  return <div>Friend</div>;
};

export default Friend;
