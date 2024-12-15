import React from 'react';

// Icons for adding and removing a person (friend)
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';

// UI components: Box for layout, IconButton for clickable icons, Typography for text, and useTheme for theming
import { Box, IconButton, Typography, useTheme } from '@mui/material';

// Redux hooks for dispatching actions and accessing state
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom'; // Hook for navigation between routes

// Action to update friends state in the Redux store
import { setFriends } from '../state';

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

  // Check if the given friendId exists in the current user's friends list to update Icon
  const isFriend = friends.find((friend) => friend._id === friendId);

  // Asynchronous PATCH request to update user-friend relationship
  const patchFriend = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/${friendId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error('Error updating friend relationship:', error);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap='1rem'>
        <UserImage
          image={userPicturePath}
          size='55px'
        />

        {/* Navigate to the friend's profile on click */}
        <Box
          onClick={() => {
            console.log('Navigating to:', `/profile/${friendId}`); //!
            navigate(`/profile/${friendId}`);
            navigate(0); // Workaround to fix bug where components do not re-render
          }}>
          <Typography
            color={main}
            variant='h5'
            flexWrap='500'
            sx={{
              '&:hover': {
                color: palette.primary.light,
                cursor: 'pointer',
              },
            }}>
            {name}
          </Typography>

          <Typography
            color={medium}
            fontSize='0.75rem'>
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>

      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: '0.6rem' }}>
        {/* Conditional rendering based on isFriend */}
        {isFriend ? <PersonRemoveOutlined sx={{ color: primaryDark }} /> : <PersonAddOutlined sx={{ color: primaryDark }} />}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;

//? Proper solution: add a dependency to the useEffect hook
//? This ensures that the effect runs whenever the friendId changes.
// useEffect(() => {
//   // Fetch new profile data or perform any update based on friendId
//   console.log(`Profile ID changed: ${friendId}`);
//   // Your code to handle profile change
// }, [friendId]); // Dependency array includes friendId to re-run effect on change
